"""
优化决策引擎（OptimizationEngine）— v1 贪心实现

本版实现一个非常简单的启发式算法：
  - 暂时忽略缺陷与 Zone/Section 规则（相当于 RuleEngine 恒通过），后续版本再接入。
  - 按 product.value 从高到低排序产品。
  - 沿着木材长度从左到右推进，每次在当前位置尝试放入“价值最高的产品”。
  - 对当前产品，尽量使用它允许的最大长度（因为 value 按长度线性放大）。

这样可以快速得到一个“按价值排序”的切割方案，用于打通端到端流程。
"""

from __future__ import annotations

from collections import Counter
from typing import TYPE_CHECKING, List

from app.domain.models import CutPiece, CuttingPlan, SatisfiedProduct
from app.infrastructure.logger import get_logger

if TYPE_CHECKING:
    from app.domain.models import FlattenedDefect, Order, Product, Wood


logger = get_logger(__name__)

def _effective_min_length(product: "Product", wood_length: float) -> float:
    """
    计算产品在当前木材上的“有效最小长度”。
    若未配置 minLength，则视为 0。
    """
    return float(product.min_length or 0.0)


def _effective_max_length(product: "Product", wood_length: float) -> float:
    """
    计算产品在当前木材上的“有效最大长度”。
    若未配置 maxLength，则视为整根木材长度。
    """
    return float(product.max_length or wood_length)


def optimize(
    wood: "Wood",
    order: "Order",
    flattened_defects: List["FlattenedDefect"],  # noqa: ARG001 - v1 未使用
) -> CuttingPlan:
    """
    对单根木材执行切割优化，返回切割方案。

    v1 策略（无缺陷、几何简化版）：
      1. 按 product.value 从高到低排序产品。
      2. 从 x=0 开始向右推进当前位置 cur_x。
      3. 在每个 cur_x，遍历所有“尚有剩余数量”的产品：
           - 根据产品的 minLength/maxLength 以及剩余长度，计算可行的切割长度 L。
           - 如果可行，计算该段的价值 = product.value * L。
      4. 从可行产品中选择 product.value 最大的一个，切出该段并更新 cur_x。
      5. 若在某个位置没有任何产品可行，则停止。
    """

    # 预处理：按价值从高到低排序产品
    products_sorted: List["Product"] = sorted(
        order.products,
        key=lambda p: p.value,
        reverse=True,
    )

    remaining_qty = {p.id: p.qty for p in products_sorted}

    pieces: List[CutPiece] = []
    cur_x = 0.0
    wood_length = float(wood.length)

    logger.info(
        "开始执行贪心优化",
        extra={
            "wood_id": wood.wood_id,
            "wood_length": wood_length,
            "product_count": len(products_sorted),
        },
    )

    # 锯片厚度（mm）由订单传入，每切一刀损耗该长度
    saw_kerf = float(getattr(order, "saw_kerf_mm", 0.0) or 0.0)

    while cur_x < wood_length:
        remaining_length = wood_length - cur_x

        # 剩余长度需至少能放下一个最小段长 + 本段后的锯缝
        if remaining_length <= saw_kerf:
            break
        available_for_piece = remaining_length - saw_kerf

        # 为当前起点 cur_x 选一个“最优产品”
        best_product = None
        best_length = 0.0
        best_value = 0.0

        for product in products_sorted:
            if remaining_qty[product.id] <= 0:
                continue

            min_len = _effective_min_length(product, wood_length)
            max_len = _effective_max_length(product, wood_length)

            if available_for_piece < min_len:
                continue

            # 段长不超过可用长度（已扣除锯缝与预留）
            candidate_length = min(max_len, available_for_piece)
            if candidate_length < min_len:
                continue

            candidate_value = float(product.value) * candidate_length

            # 选择 product.value 最大的产品；若相等则取更长的
            if best_product is None:
                best_product = product
                best_length = candidate_length
                best_value = candidate_value
            else:
                if product.value > best_product.value or (
                    product.value == best_product.value
                    and candidate_length > best_length
                ):
                    best_product = product
                    best_length = candidate_length
                    best_value = candidate_value

        if best_product is None:
            # 当前起点下没有任何可行产品，提前结束
            logger.info(
                "贪心优化结束：无可行产品",
                extra={
                    "wood_id": wood.wood_id,
                    "cur_x": cur_x,
                    "remaining_length": remaining_length,
                },
            )
            break

        # 记录这一段
        piece = CutPiece(
            begin=cur_x,
            length=best_length,
            productId=best_product.id,
            value=best_value,
        )
        pieces.append(piece)

        remaining_qty[best_product.id] -= 1
        cur_x += best_length + saw_kerf

        logger.debug(
            "选择切段",
            extra={
                "wood_id": wood.wood_id,
                "begin": piece.begin,
                "length": piece.length,
                "product_id": piece.product_id,
                "value": piece.value,
                "remaining_qty": remaining_qty[best_product.id],
            },
        )

        # 如果所有产品都已完成需求，则可以提前结束
        if all(qty <= 0 for qty in remaining_qty.values()):
            logger.info(
                "贪心优化结束：已满足所有产品数量需求",
                extra={"wood_id": wood.wood_id},
            )
            break

    total_used_length = sum(p.length for p in pieces)
    total_value = sum(p.value for p in pieces)
    # 锯缝只作“段间间隔”，不单独占位；锯缝导致的损耗统一算入废料
    # 废料 = 木材总长 - 产品总长（含段间锯缝+尾部未用）
    total_kerf_mm = cur_x - total_used_length  # 段间锯缝总长，便于统计
    waste_length = max(0.0, wood_length - total_used_length)

    produced_counter = Counter(p.product_id for p in pieces)
    satisfied_products: List[SatisfiedProduct] = []
    for product in order.products:
        produced_qty = int(produced_counter.get(product.id, 0))
        satisfied_products.append(
            SatisfiedProduct(
                productId=product.id,
                producedQty=produced_qty,
                requiredQty=product.qty,
            )
        )

    plan = CuttingPlan(
        woodId=wood.wood_id,
        pieces=pieces,
        totalValue=total_value,
        totalUsedLength=total_used_length,
        wasteLength=waste_length,
        totalKerfMm=total_kerf_mm,
        satisfiedProducts=satisfied_products,
    )

    logger.info(
        "贪心优化完成",
        extra={
            "wood_id": wood.wood_id,
            "piece_count": len(pieces),
            "total_used_length": total_used_length,
            "total_kerf_mm": total_kerf_mm,
            "waste_length": waste_length,
        },
    )

    return plan

