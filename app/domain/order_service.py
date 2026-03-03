"""
解析管理模块（OrderService）
职责：接收并解析订单 JSON，将当前有效订单配置存入内存缓存。
"""

from __future__ import annotations

import threading
from typing import Optional

from app.domain.models import Order, CuttingPlan
from app.infrastructure.logger import get_logger

logger = get_logger(__name__)

# ---------------------------------------------------------------------------
# 内存缓存（单例，线程安全）
# ---------------------------------------------------------------------------

_lock = threading.Lock()
_current_order: Optional[Order] = None


def load_order(order: Order) -> None:
    """将给定订单设置为当前有效订单，覆盖旧订单，并重置产品完成量。"""
    global _current_order
    with _lock:
        # 下单时，所有产品的完成量视为 0
        for p in order.products:
            p.produced_qty = 0
        _current_order = order
        _produced_counter = {}
    logger.info(
        "订单已加载",
        extra={
            "order_id": order.order_id,
            "product_count": len(order.products),
        },
    )


def get_current_order() -> Optional[Order]:
    """返回当前缓存的订单，若尚未加载则返回 None。"""
    with _lock:
        return _current_order


def clear_order() -> None:
    """清除当前缓存的订单（主要用于测试）。"""
    global _current_order
    with _lock:
        _current_order = None
    logger.info("当前订单已清除")


def register_production(plan: CuttingPlan) -> None:
    """根据 CuttingPlan 中的 satisfied_products，将本次切割产量直接累计到订单里的产品上。"""
    global _current_order
    if _current_order is None:
        return
    with _lock:
        for sp in plan.satisfied_products:
            pid = sp.product_id
            add = int(sp.produced_qty)
            for product in _current_order.products:
                if product.id == pid:
                    product.produced_qty = int(product.produced_qty or 0) + add
                    break
