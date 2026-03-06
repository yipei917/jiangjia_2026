"""
平面展开与缺陷映射模块（PlaneLayout & DefectMapping）

统一平面坐标系定义（参见系统架构文档第二节）：
  X 轴：沿木材长度方向，范围 [0, wood.length]。（横向）
  Y 轴：将上(top)、右(right)、下(bottom)、左(left) 四个面按顺序展开拼接（纵向）：
    top:    [0,                        wood.width)
    right:  [wood.width,               wood.width + wood.height)
    bottom: [wood.width + wood.height, 2*wood.width + wood.height)
    left:   [2*wood.width + wood.height, 2*wood.width + 2*wood.height)

输入坐标系与转换流程（仅 top/bottom 且提供 imgwidth 时）：
  1. 先将缺陷从竖向转换成横向（像素层面：长度/宽度轴向与 bbox 的对应关系由约定确定）。
  2. 计算比例：ratio = length / imgwidth。
  3. 将横向的缺陷坐标（四个数）乘以该比例，得到物理坐标 [x_len, y_width, w_len, h_width]。
  - 当未提供 imgwidth 或 face 非 top/bottom 时，bbox 直接视为已是横向木材物理坐标。

转换到统一展开平面坐标系的规则（横向木材坐标）：
  x_plane = x_len              （沿木材长度方向）
  y_plane = face_offset + y_width
  w_plane = w_len,  h_plane = h_width
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


def _image_bbox_to_physical(
    bbox: list[float],
    face: Face,
    wood: Wood,
) -> list[float]:
    """
    按约定三步转换：竖向 → 横向（像素）→ 乘以比例 length/imgwidth 得到物理坐标。

    仅当 face 为 top/bottom 且 wood 提供 imgwidth 时做转换；否则视为已是横向物理坐标。
    """
    img_w = getattr(wood, "imgwidth", None)
    if face not in ("top", "bottom") or not img_w or img_w <= 0:
        return [float(x) for x in bbox]
    x_px, y_px, w_px, h_px = (float(b) for b in bbox)

    # 1. 竖向转横向：约定竖向为 图纵轴=长度、图横轴=宽度；横向为 (长度, 宽度)
    #    故 长度方向 = 原纵轴(y)，宽度方向 = 原横轴(x)
    x_len_px = y_px
    y_width_px = x_px
    w_len_px = h_px
    h_width_px = w_px

    # 2. 比例 = length / imgwidth
    ratio = float(wood.length) / img_w

    # 3. 横向缺陷坐标乘以该比例
    x_len = x_len_px * ratio
    y_width = y_width_px * ratio
    w_len = w_len_px * ratio
    h_width = h_width_px * ratio
    return [x_len, y_width, w_len, h_width]


def flatten_defects(wood: Wood) -> list[FlattenedDefect]:
    """
    将 Wood.defectDetails 中四个面的缺陷全部映射到统一展开平面坐标系。

    若 Wood 提供 imgwidth/imgheight，则 top/bottom 的 bbox 视为图片像素坐标并先转为物理坐标；
    侧面暂不转换。输出 FlattenedDefect.bbox_on_plane 为统一展开平面坐标 [x, y, w, h]。
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
            x_len, y_width, w_len, h_width = _image_bbox_to_physical(d.bbox, face, wood)
            # 横向木材坐标：x_len=长度，y_width=宽度 → 平面：X=长度，Y=offset+宽度
            x_plane = x_len
            y_plane = y_offset + y_width
            w_plane = w_len
            h_plane = h_width
            # 裁剪到木材/面范围内，避免超出 viewBox
            x_plane = max(0.0, min(wood.length, x_plane))
            w_plane = max(0.0, min(w_plane, wood.length - x_plane))
            face_height = wood.width if face in ("top", "bottom") else wood.height
            y_plane = max(y_offset, min(y_offset + face_height, y_plane))
            h_plane = max(0.0, min(h_plane, y_offset + face_height - y_plane))
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
