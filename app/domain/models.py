"""
领域模型定义，对应系统架构文档第二节"核心领域模型"。
所有输入/输出的 JSON 字段名均使用 camelCase，内部属性使用 snake_case。
"""

from __future__ import annotations

from typing import Annotated, Optional
from pydantic import BaseModel, Field, ConfigDict, field_validator


# ---------------------------------------------------------------------------
# 通用工具配置：允许通过别名（camelCase）或字段名（snake_case）赋值
# ---------------------------------------------------------------------------
_COMMON_CFG = ConfigDict(populate_by_name=True)


# ---------------------------------------------------------------------------
# 产品相关模型
# ---------------------------------------------------------------------------

class DefectRule(BaseModel):
    model_config = _COMMON_CFG

    defect_name: str = Field(alias="defectName")
    max_count: int = Field(alias="maxCount", ge=0)
    defect_length: float = Field(alias="defectLength", ge=0)
    defect_height: float = Field(alias="defectHeight", ge=0)
    reference_length: float = Field(alias="referenceLength", gt=0)


class Zone(BaseModel):
    model_config = _COMMON_CFG

    id: str
    begin: float = Field(ge=0)
    length: float = Field(gt=0)
    defect_rules: list[DefectRule] = Field(alias="defectRules", default_factory=list)


class Section(BaseModel):
    model_config = _COMMON_CFG

    id: str
    begin: float = Field(ge=0)
    length: float = Field(gt=0)
    zones: list[Zone] = Field(default_factory=list)


class Product(BaseModel):
    model_config = _COMMON_CFG

    id: str
    min_length: Optional[float] = Field(alias="minLength", default=None, ge=0)
    max_length: Optional[float] = Field(alias="maxLength", default=None, ge=0)
    min_width: Optional[float] = Field(alias="minWidth", default=None, ge=0)
    max_width: Optional[float] = Field(alias="maxWidth", default=None, ge=0)
    min_height: Optional[float] = Field(alias="minHeight", default=None, ge=0)
    max_height: Optional[float] = Field(alias="maxHeight", default=None, ge=0)
    # 文档示例中存在拼写错误 "refHeigth"，此处统一使用正确拼写 "refHeight"
    ref_height: float = Field(alias="refHeight", gt=0)
    ref_width: float = Field(alias="refWidth", gt=0)
    qty: int = Field(ge=1)
    # 累计已完成数量，由后端根据 CuttingPlan 持续更新；下单时默认为 0
    produced_qty: int = Field(alias="producedQty", default=0, ge=0)
    value: Annotated[float, Field(ge=0.0, le=1.0)]
    sections: list[Section] = Field(default_factory=list)


# ---------------------------------------------------------------------------
# 订单模型
# ---------------------------------------------------------------------------

class Order(BaseModel):
    model_config = _COMMON_CFG

    order_id: str = Field(alias="orderId")
    products: list[Product]
    # 锯片厚度（mm），每刀损耗，随订单传入；未传时视为 0
    saw_kerf_mm: float = Field(alias="sawKerfMm", default=0.0, ge=0)


# ---------------------------------------------------------------------------
# 木材扫描相关模型
# ---------------------------------------------------------------------------

Bbox = list[float]  # [x, y, w, h]


class DefectInstance(BaseModel):
    """单个缺陷实例，bbox 为原始面坐标 [x, y, w, h]。"""
    model_config = _COMMON_CFG

    bbox: Bbox = Field(min_length=4, max_length=4)
    defect_class: str = Field(alias="class")

    @field_validator("bbox")
    @classmethod
    def bbox_must_have_four_elements(cls, v: list[float]) -> list[float]:
        if len(v) != 4:
            raise ValueError("bbox 必须包含恰好 4 个元素 [x, y, w, h]")
        return v


class WoodDefectDetails(BaseModel):
    model_config = _COMMON_CFG

    top: list[DefectInstance] = Field(default_factory=list)
    bottom: list[DefectInstance] = Field(default_factory=list)
    left: list[DefectInstance] = Field(default_factory=list)
    right: list[DefectInstance] = Field(default_factory=list)


class Wood(BaseModel):
    model_config = _COMMON_CFG

    wood_id: str = Field(alias="woodId")
    length: float = Field(gt=0)
    width: float = Field(gt=0)
    height: float = Field(gt=0)
    defect_details: WoodDefectDetails = Field(alias="defectDetails")


# ---------------------------------------------------------------------------
# 中间模型
# ---------------------------------------------------------------------------

class FlattenedDefect(BaseModel):
    """缺陷在统一展开平面坐标系中的表示。"""
    model_config = _COMMON_CFG

    wood_id: str = Field(alias="woodId")
    defect_class: str = Field(alias="class")
    face: str  # top / right / bottom / left
    bbox_on_plane: Bbox = Field(alias="bboxOnPlane")


# ---------------------------------------------------------------------------
# 输出模型（切割方案）
# ---------------------------------------------------------------------------

class CutPiece(BaseModel):
    model_config = _COMMON_CFG

    begin: float
    length: float
    product_id: str = Field(alias="productId")
    value: float


class SatisfiedProduct(BaseModel):
    model_config = _COMMON_CFG

    product_id: str = Field(alias="productId")
    produced_qty: int = Field(alias="producedQty")
    required_qty: int = Field(alias="requiredQty")


class CuttingPlan(BaseModel):
    model_config = _COMMON_CFG

    wood_id: str = Field(alias="woodId")
    pieces: list[CutPiece] = Field(default_factory=list)
    total_value: float = Field(alias="totalValue", default=0.0)
    total_used_length: float = Field(alias="totalUsedLength", default=0.0)
    waste_length: float = Field(alias="wasteLength", default=0.0)
    # 锯缝总损耗（mm），等于 刀数 × 订单 sawKerfMm
    total_kerf_mm: float = Field(alias="totalKerfMm", default=0.0)
    satisfied_products: list[SatisfiedProduct] = Field(
        alias="satisfiedProducts", default_factory=list
    )
