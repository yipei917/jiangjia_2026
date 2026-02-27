"""
方案评估模块（SolutionEvaluator）— 待实现

职责（见系统架构文档第三节.5）：
  - 计算切割方案的整体指标：
      - 总价值、利用率（totalUsedLength / wood.length）、废料比例。
      - 产品需求满足度（哪些产品仍欠缺）。
  - 提供用于日志和可视化的摘要数据。
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import TYPE_CHECKING, List, Dict

if TYPE_CHECKING:
    from app.domain.models import CuttingPlan, Order, Wood


@dataclass
class EvaluationSummary:
    total_value: float
    utilization_rate: float
    waste_rate: float
    fulfilled_products: list[str]
    unfulfilled_products: list[str]


def evaluate(
    plan: "CuttingPlan",
    wood: "Wood",
    order: "Order",
) -> EvaluationSummary:
    """
    对给定切割方案计算综合评估指标。

    实现逻辑：
      1. 遍历 plan.pieces，按 productId 统计 producedQty。
      2. 与 order.products 中的 qty 对比，得出满足/未满足列表。
      3. 计算 utilization_rate = totalUsedLength / wood.length（空木材时为 0）。
      4. 计算 waste_rate = wasteLength / wood.length（空木材时为 0）。
    """
    from app.domain.models import CuttingPlan as CP  # 避免循环导入

    # 使用 plan 自带的 total_value / total_used_length / waste_length
    total_value = float(plan.total_value)

    wood_length = float(wood.length)
    if wood_length > 0:
        utilization_rate = float(plan.total_used_length) / wood_length
        waste_rate = float(plan.waste_length) / wood_length
    else:
        utilization_rate = 0.0
        waste_rate = 0.0

    # 统计每个产品的实际产量
    produced: Dict[str, int] = {}
    for piece in plan.pieces:
        pid = piece.product_id
        produced[pid] = produced.get(pid, 0) + 1

    fulfilled: List[str] = []
    unfulfilled: List[str] = []

    for product in order.products:
        pid = product.id
        required = int(product.qty)
        actual = int(produced.get(pid, 0))
        if actual >= required:
            fulfilled.append(pid)
        else:
            unfulfilled.append(pid)

    return EvaluationSummary(
        total_value=total_value,
        utilization_rate=utilization_rate,
        waste_rate=waste_rate,
        fulfilled_products=fulfilled,
        unfulfilled_products=unfulfilled,
    )

