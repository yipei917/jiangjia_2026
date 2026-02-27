"""
木材智能切割优化引擎（Wood Cutting Optimization Engine）
FastAPI 应用入口
"""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.orders import router as orders_router
from app.api.woods import router as woods_router
from app.infrastructure.logger import get_logger

logger = get_logger(__name__)

app = FastAPI(
    title="木材智能切割优化引擎",
    description=(
        "根据产品配置规则和木材扫描缺陷数据，计算价值最大化的切割方案。\n\n"
        "参见 system-architecture.md 了解完整系统设计。"
    ),
    version="0.1.0",
)

# ---------------------------------------------------------------------------
# CORS（方便本地 React 前端访问）
# ---------------------------------------------------------------------------
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# 注册路由
# ---------------------------------------------------------------------------
app.include_router(orders_router)
app.include_router(woods_router)


# ---------------------------------------------------------------------------
# 根路径健康检查
# ---------------------------------------------------------------------------
@app.get("/", include_in_schema=False)
def health_check() -> JSONResponse:
    return JSONResponse({"status": "ok", "service": "wood-cutting-engine"})


# ---------------------------------------------------------------------------
# 启动入口（python main.py）
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8765, reload=True)
