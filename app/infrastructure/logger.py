"""
日志 & 监控基础设施

提供统一的结构化日志工厂，记录每次优化请求的耗时、关键参数和失败原因。
"""

from __future__ import annotations

import logging
import sys


_LOG_FORMAT = "%(asctime)s [%(levelname)s] %(name)s - %(message)s"
_DATE_FORMAT = "%Y-%m-%d %H:%M:%S"
_initialized = False


def _init_root_logger() -> None:
    global _initialized
    if _initialized:
        return
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(logging.Formatter(_LOG_FORMAT, datefmt=_DATE_FORMAT))
    root = logging.getLogger()
    if not root.handlers:
        root.addHandler(handler)
    root.setLevel(logging.DEBUG)
    _initialized = True


def get_logger(name: str) -> logging.Logger:
    """返回指定名称的 Logger，确保根日志已初始化。"""
    _init_root_logger()
    return logging.getLogger(name)
