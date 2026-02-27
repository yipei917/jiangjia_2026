"""
订单接口（/orders）

POST /orders          — 加载/替换当前订单
GET  /orders/current  — 查看当前有效订单
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from app.domain import order_service
from app.domain.models import Order
from app.infrastructure.logger import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/orders", tags=["orders"])


# ---------------------------------------------------------------------------
# Request / Response schemas
# ---------------------------------------------------------------------------

class LoadOrderResponse(BaseModel):
    status: str
    order_id: str
    message: str

    model_config = {"populate_by_name": True}


# ---------------------------------------------------------------------------
# 路由
# ---------------------------------------------------------------------------

@router.post(
    "",
    response_model=LoadOrderResponse,
    status_code=status.HTTP_200_OK,
    summary="加载/替换当前订单",
)
def load_order(order: Order) -> LoadOrderResponse:
    """
    接收并解析订单 JSON，将其设置为当前有效订单（覆盖旧订单）。
    """
    logger.info("收到 POST /orders 请求", extra={"order_id": order.order_id})
    order_service.load_order(order)
    return LoadOrderResponse(
        status="ok",
        order_id=order.order_id,
        message="order loaded as current",
    )


@router.get(
    "/current",
    response_model=Order,
    summary="查看当前有效订单",
)
def get_current_order() -> Order:
    """
    返回当前缓存的订单配置。若尚未加载订单，返回 404。
    """
    current = order_service.get_current_order()
    if current is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="当前尚未加载任何订单，请先调用 POST /orders。",
        )
    return current
