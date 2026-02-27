"""
木材接口（/woods）

POST /woods — 接受木材扫描数据，执行缺陷平面映射，返回切割方案（优化引擎待实现）
"""

from __future__ import annotations

import time
from typing import Optional

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from app.domain import order_service
from app.domain.models import CuttingPlan, FlattenedDefect, Wood
from app.domain.optimization import optimize
from app.domain.plane_layout import flatten_defects
from app.infrastructure.logger import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/woods", tags=["woods"])


# ---------------------------------------------------------------------------
# Request / Response schemas
# ---------------------------------------------------------------------------

class ProcessWoodRequest(BaseModel):
    wood: Wood


class ProcessWoodResponse(BaseModel):
    """
    当前版本返回：
      - wood_id         : 本次处理的木材 ID
      - flattened_defects: 映射到统一展开平面后的缺陷列表
      - cutting_plan    : 切割方案（优化引擎实现后填充，目前为 null）
      - optimization_status: 当前优化引擎状态说明
    """

    wood_id: str
    flattened_defects: list[FlattenedDefect]
    cutting_plan: Optional[CuttingPlan]
    optimization_status: str
    elapsed_ms: float


# ---------------------------------------------------------------------------
# 路由
# ---------------------------------------------------------------------------

@router.post(
    "",
    response_model=ProcessWoodResponse,
    summary="处理木材扫描数据，返回切割方案",
)
def process_wood(body: ProcessWoodRequest) -> ProcessWoodResponse:
    """
    处理流程（参见系统架构文档第五节）：
      1. 校验当前订单是否已加载。
      2. 将四面缺陷展开到统一平面坐标系（PlaneLayout）。
      3. 调用优化引擎（OptimizationEngine，待实现），生成切割方案。
      4. 返回方案及平面缺陷数据。
    """
    t0 = time.perf_counter()
    wood = body.wood
    logger.info("收到 POST /woods 请求", extra={"wood_id": wood.wood_id})

    # 1. 校验订单
    order = order_service.get_current_order()
    if order is None:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="当前尚未加载任何订单，请先调用 POST /orders。",
        )

    # 2. 缺陷平面映射
    flattened = flatten_defects(wood)

    # 3. 优化引擎（v1 贪心版，仅按 product.value 进行裁切，不考虑缺陷）
    cutting_plan: Optional[CuttingPlan] = optimize(wood, order, flattened)
    optimization_status = "completed"

    elapsed_ms = (time.perf_counter() - t0) * 1000
    logger.info(
        "POST /woods 处理完成",
        extra={
            "wood_id": wood.wood_id,
            "defect_count": len(flattened),
            "elapsed_ms": round(elapsed_ms, 2),
        },
    )

    return ProcessWoodResponse(
        wood_id=wood.wood_id,
        flattened_defects=flattened,
        cutting_plan=cutting_plan,
        optimization_status=optimization_status,
        elapsed_ms=round(elapsed_ms, 2),
    )
