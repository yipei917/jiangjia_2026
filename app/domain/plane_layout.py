"""
平面展开与缺陷映射模块（PlaneLayout & DefectMapping）

统一平面坐标系定义（参见系统架构文档第二节）：
  X 轴：沿木材长度方向，范围 [0, wood.length]。
  Y 轴：将上(top)、右(right)、下(bottom)、左(left) 四个面按顺序展开拼接：
    top:    [0,                        wood.width)
    right:  [wood.width,               wood.width + wood.height)
    bottom: [wood.width + wood.height, 2*wood.width + wood.height)
    left:   [2*wood.width + wood.height, 2*wood.width + 2*wood.height)

输入坐标系（相机坐标，木材在画面中竖放）：
  - 外部传入的 DefectInstance.bbox = [x_img, y_img, w_img, h_img]：
      x_img：水平方向（沿截面宽度）起点；
      y_img：竖直方向（沿木材长度）起点；
      w_img：水平方向尺寸（沿截面宽度）；
      h_img：竖直方向尺寸（沿木材长度）。

  - 当前 demo 中默认 1:1 比例：x/y/w/h 与物理 mm 一致，
    且满足：x_img + w_img <= wood.width,  y_img + h_img <= wood.length。

转换到统一展开平面坐标系的规则：
  x_plane = y_img              （沿木材长度方向）
  y_plane = face_offset + x_img
  w_plane = h_img              （沿木材长度方向的尺寸）
  h_plane = w_img              （沿该面展开方向的尺寸）
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

    输入 bbox 使用相机坐标（木材竖向）：
      [x_img, y_img, w_img, h_img]

    输出 FlattenedDefect.bbox_on_plane = [x, y, w, h] 使用统一展开平面坐标。
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
            x_img, y_img, w_img, h_img = d.bbox
            x_plane = float(y_img)
            y_plane = y_offset + float(x_img)
            w_plane = float(h_img)
            h_plane = float(w_img)
            bbox_on_plane = [x_plane, y_plane, w_plane, h_plane]
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
