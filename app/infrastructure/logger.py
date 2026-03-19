"""
日志 & 监控基础设施

提供统一的结构化日志工厂，记录每次优化请求的耗时、关键参数和失败原因。
"""

from __future__ import annotations

import datetime
import logging
import sys
from typing import Optional


_LOG_FORMAT = "%(asctime)s [%(levelname)s] %(name)s - %(message)s"
_initialized = False


class _PreciseTimeFormatter(logging.Formatter):
    """asctime 带小数秒：默认毫秒 3 位；标准库 Formatter 的 datefmt 无法用 strftime 输出 %f。"""

    def __init__(
        self,
        fmt: str,
        *,
        fractional_digits: int = 3,
    ) -> None:
        super().__init__(fmt)
        self._frac = max(0, min(6, int(fractional_digits)))

    def formatTime(self, record: logging.LogRecord, datefmt: Optional[str] = None) -> str:
        dt = datetime.datetime.fromtimestamp(record.created)
        base = dt.strftime("%Y-%m-%d %H:%M:%S")
        if self._frac <= 0:
            return base
        # microsecond 0–999999 → 截断到 fractional_digits
        frac = dt.microsecond
        if self._frac < 6:
            frac = frac // (10 ** (6 - self._frac))
        return f"{base}.{frac:0{self._frac}d}"


def _init_root_logger() -> None:
    global _initialized
    if _initialized:
        return
    handler = logging.StreamHandler(sys.stdout)
    # 6 位 = 微秒；3 位 = 毫秒。需要更细可把 fractional_digits 改为 6
    handler.setFormatter(_PreciseTimeFormatter(_LOG_FORMAT, fractional_digits=6))
    root = logging.getLogger()
    if not root.handlers:
        root.addHandler(handler)
    root.setLevel(logging.INFO)
    _initialized = True


def get_logger(name: str) -> logging.Logger:
    """返回指定名称的 Logger，确保根日志已初始化。"""
    _init_root_logger()
    return logging.getLogger(name)
