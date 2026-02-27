"""
解析管理模块（OrderService）
职责：接收并解析订单 JSON，将当前有效订单配置存入内存缓存。
"""

from __future__ import annotations

import threading
from typing import Optional

from app.domain.models import Order
from app.infrastructure.logger import get_logger

logger = get_logger(__name__)

# ---------------------------------------------------------------------------
# 内存缓存（单例，线程安全）
# ---------------------------------------------------------------------------

_lock = threading.Lock()
_current_order: Optional[Order] = None


def load_order(order: Order) -> None:
    """将给定订单设置为当前有效订单，覆盖旧订单。"""
    global _current_order
    with _lock:
        _current_order = order
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
