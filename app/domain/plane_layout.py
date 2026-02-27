"""
平面展开与缺陷映射模块（PlaneLayout & DefectMapping）

统一平面坐标系定义（参见系统架构文档第二节）：
  X 轴：沿木材长度方向，范围 [0, wood.length]。
  Y 轴：将上(top)、右(right)、下(bottom)、左(left) 四个面按顺序展开拼接：
    top:    [0,                        wood.width)
    right:  [wood.width,               wood.width + wood.height)
    bottom: [wood.width + wood.height, 2*wood.width + wood.height)
    left:   [2*wood.width + wood.height, 2*wood.width + 2*wood.height)

各面的 DefectInstance.bbox = [x, y, w, h]，其中：
  x：沿木材长度方向的起点（与平面坐标系 X 轴一致，无需转换）。
  y：垂直于长度方向、沿该面展开的起点。

转换规则：
  x_plane = x_face          （X 轴不变）
  y_plane = face_offset + y_face
  w_plane = w_face           （沿 X 方向的宽度不变）
  h_plane = h_face           （沿该面 Y 方向的高度不变）
"""

from __future__ import annotations

from typing import Literal

from app.domain.models import FlattenedDefect, Wood
from app.infrastructure.logger import get_logger

logger = get_logger(__name__)

Face = Literal["top", "right", "bottom", "left"]


def _face_y_offset(face: Face, wood_width: float, wood_height: float) -> float:
    """计算指定面在展开平面 Y 轴上的起始偏移量。"""
    offsets: dict[Face, float] = {
        "top":    0.0,
        "right":  wood_width,
        "bottom": wood_width + wood_height,
        "left":   2.0 * wood_width + wood_height,
    }
    return offsets[face]


def flatten_defects(wood: Wood) -> list[FlattenedDefect]:
    """
    将 Wood.defectDetails 中四个面的缺陷全部映射到统一展开平面坐标系。

    返回 FlattenedDefect 列表，其中 bbox_on_plane = [x, y, w, h]（平面坐标）。
    """
    result: list[FlattenedDefect] = []

    faces: list[Face] = ["top", "right", "bottom", "left"]
    face_defects = {
        "top":    wood.defect_details.top,
        "right":  wood.defect_details.right,
        "bottom": wood.defect_details.bottom,
        "left":   wood.defect_details.left,
    }

    for face in faces:
        y_offset = _face_y_offset(face, wood.width, wood.height)
        defects = face_defects[face]
        for d in defects:
            x, y, w, h = d.bbox
            bbox_on_plane = [x, y_offset + y, w, h]
            result.append(
                FlattenedDefect(
                    woodId=wood.wood_id,
                    **{"class": d.defect_class},
                    face=face,
                    bboxOnPlane=bbox_on_plane,
                )
            )

    logger.debug(
        "缺陷平面展开完成",
        extra={
            "wood_id": wood.wood_id,
            "total_defects": len(result),
            "per_face": {f: len(face_defects[f]) for f in faces},
        },
    )
    return result
