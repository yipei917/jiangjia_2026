"""
优化决策引擎（OptimizationEngine）— 贪心 + 规则引擎

  - 预过滤无效产品；缺陷按 x 排序并提取终点列表用于跳步。
  - 从左到右推进，每步选 value 最大且通过缺陷规则的产品，按 minLength 切一段。
  - 无可行产品时跳至下一缺陷终点再试，避免逐毫米扫描。
  - N 段产生 N-1 个段间锯缝；最后一段不计末尾锯缝。
"""

from __future__ import annotations

import bisect
from collections import Counter
from typing import TYPE_CHECKING, List

from app.domain.models import CutPiece, CuttingPlan, Section, SatisfiedProduct
from app.domain.rule_engine import check_piece as rule_check_piece
from app.infrastructure.logger import get_logger

if TYPE_CHECKING:
    from app.domain.models import FlattenedDefect, Order, Product, Wood


logger = get_logger(__name__)


def _min_length(product: "Product") -> float:
    return float(product.min_length or 0.0)


def _piece_passes_rules(
    product: "Product",
    piece_begin: float,
    piece_length: float,
    sorted_defects: List["FlattenedDefect"],
) -> bool:
    """判断在 [piece_begin, piece_begin+piece_length] 上切出该产品是否满足缺陷规则。"""
    if not product.sections:
        return True
    section = product.sections[0]
    if not section.zones:
        return True
    piece_section = Section(
        id=section.id,
        begin=piece_begin,
        length=piece_length,
        zones=section.zones,
    )
    return rule_check_piece(product, piece_section, sorted_defects).passed


def optimize(
    wood: "Wood",
    order: "Order",
    flattened_defects: List["FlattenedDefect"],
) -> CuttingPlan:
    """
    对单根木材执行切割优化，返回切割方案。

    策略：
      1. 预过滤：剔除 qty=0 或 minLength 超出木材长度的产品，按 value 降序排列。
      2. 预处理：缺陷按 x0 排序；提取所有缺陷终点（x1）的去重升序列表用于跳步。
      3. 从 x=0 向右推进 cur_x：
           - 候选段长 = 产品 minLength；剩余长度 >= minLength 且通过规则引擎才可选。
           - 选 value 最大（相同时选 minLength 更大）的产品，切一段后推进 cur_x。
           - 若当前位置无任何产品通过，跳至下一缺陷终点再试，直到无终点可跳则结束。
      4. 统计：N 段产生 N-1 个段间锯缝；wasteLength = 总长 - 产品总长 - 锯缝总长。
    """
    wood_length = float(wood.length)
    saw_kerf = float(getattr(order, "saw_kerf_mm", 0.0) or 0.0)

    # 1. 预过滤：剔除无需求或放不下的产品，按 value 降序
    products_sorted: List["Product"] = sorted(
        [p for p in order.products if p.qty > 0 and _min_length(p) <= wood_length],
        key=lambda p: p.value,
        reverse=True,
    )
    remaining_qty = {p.id: p.qty for p in products_sorted}

    # 2. 缺陷预处理：按 x0 排序；提取去重升序的缺陷终点列表
    sorted_defects = sorted(flattened_defects, key=lambda d: float(d.bbox_on_plane[0]))
    defect_x1s: List[float] = sorted(
        {float(d.bbox_on_plane[0]) + float(d.bbox_on_plane[2]) for d in sorted_defects}
    )

    logger.info(
        "开始执行贪心优化",
        extra={
            "wood_id": wood.wood_id,
            "wood_length": wood_length,
            "product_count": len(products_sorted),
            "defect_count": len(sorted_defects),
        },
    )

    pieces: List[CutPiece] = []
    cur_x = 0.0

    while cur_x < wood_length:
        remaining_length = wood_length - cur_x
        best_product = None
        best_length = 0.0
        best_value = 0.0

        for product in products_sorted:
            if remaining_qty[product.id] <= 0:
                continue

            min_len = _min_length(product)

            # 最后一段不需要保留额外锯缝，直接与剩余长度比较
            if remaining_length < min_len:
                continue

            if not _piece_passes_rules(product, cur_x, min_len, sorted_defects):
                continue

            candidate_value = float(product.value)
            if best_product is None or candidate_value > best_value or (
                candidate_value == best_value and min_len > best_length
            ):
                best_product = product
                best_length = min_len
                best_value = candidate_value

        if best_product is None:
            # 跳步：找下一个缺陷终点，跳过当前缺陷遮挡区域
            idx = bisect.bisect_right(defect_x1s, cur_x)
            if idx < len(defect_x1s):
                next_x = defect_x1s[idx]
                logger.info(
                    "无可行产品，跳步到下一缺陷终点",
                    extra={"wood_id": wood.wood_id, "cur_x": cur_x, "next_x": next_x},
                )
                cur_x = next_x
                continue
            else:
                logger.info(
                    "贪心优化结束：无更多可跳步位置",
                    extra={"wood_id": wood.wood_id, "cur_x": cur_x},
                )
                break

        piece = CutPiece(
            begin=cur_x,
            length=best_length,
            productId=best_product.id,
            value=best_value,
        )
        pieces.append(piece)
        remaining_qty[best_product.id] -= 1

        # 段间加锯缝；最后一段的锯缝在统计时不计入
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

        if all(qty <= 0 for qty in remaining_qty.values()):
            logger.info("贪心优化结束：已满足所有产品数量需求", extra={"wood_id": wood.wood_id})
            break

    # 统计：N 段产生 N-1 个段间锯缝，最后一段不计末尾锯缝
    n = len(pieces)
    total_used_length = sum(p.length for p in pieces)
    total_kerf_mm = max(0, n - 1) * saw_kerf
    waste_length = max(0.0, wood_length - total_used_length - total_kerf_mm)
    total_value = sum(p.value for p in pieces)

    produced_counter = Counter(p.product_id for p in pieces)
    satisfied_products: List[SatisfiedProduct] = [
        SatisfiedProduct(
            productId=product.id,
            producedQty=int(produced_counter.get(product.id, 0)),
            requiredQty=product.qty,
        )
        for product in order.products
    ]

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
            "piece_count": n,
            "total_used_length": total_used_length,
            "total_kerf_mm": total_kerf_mm,
            "waste_length": waste_length,
        },
    )

    return plan
