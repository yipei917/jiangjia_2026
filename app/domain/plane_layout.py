"""
平面展开与缺陷映射模块（PlaneLayout & DefectMapping）

统一平面坐标系定义（参见系统架构文档第二节）：
  X 轴：沿木材长度方向，范围 [0, wood.length]。（横向）
  Y 轴：将上(top)、右(right)、下(bottom)、左(left) 四个面按顺序展开拼接（纵向）：
    top:    [0,                        wood.width)
    right:  [wood.width,               wood.width + wood.height)
    bottom: [wood.width + wood.height, 2*wood.width + wood.height)
    left:   [2*wood.width + wood.height, 2*wood.width + 2*wood.height)

输入坐标系（原始“竖向”像素坐标）：
  - 当 Wood 提供 imgwidth、imgheight 时，DefectInstance.bbox 为相对于图片的像素坐标 [x_px, y_px, w_px, h_px]：
      * 图片横轴（imgwidth）沿木材“宽”方向；
      * 图片纵轴（imgheight）沿木材“长”方向。
    此时 bbox 表示的是“竖向坐标”：x=宽、y=长。
    我们需要先将其转换为“横向木材坐标”：[x_len, y_width, w_len, h_width]：
      * x_len / w_len：沿木材长度方向；
      * y_width / h_width：沿木材宽度方向。
    仅对 top、bottom 面做像素→物理转换；侧面暂不处理。
  - 当未提供 imgwidth/imgheight 时，bbox 直接视为已经是横向木材物理坐标 [x_len, y_width, w_len, h_width]。

像素到横向木材物理坐标（仅 top/bottom 且提供了图片尺寸时）：
  x_len   = y_px * wood.length / imgheight   （图片纵轴 → 木材长度）
  y_width = x_px * wood.width  / imgwidth    （图片横轴 → 木材宽度）
  w_len   = h_px * wood.length / imgheight
  h_width = w_px * wood.width  / imgwidth

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
    将“竖向”像素坐标转换为“横向木材坐标”。

    约定：
      - 原始 bbox = [x_px, y_px, w_px, h_px] 为图片像素：
          x_px / w_px：沿图片横轴（对应木材宽）；
          y_px / h_px：沿图片纵轴（对应木材长）。
      - 转换结果为横向木材物理坐标 [x_len, y_width, w_len, h_width]：
          x_len / w_len：沿木材长度方向（横向 X 轴）；
          y_width / h_width：沿木材宽度方向（纵向 Y 轴）。

    仅当 face 为 top/bottom 且 wood 提供了 imgwidth/imgheight 时进行像素→物理转换；
    其余情况视为已经是横向木材坐标，直接返回数值。
    """
    img_w = getattr(wood, "imgwidth", None)
    img_h = getattr(wood, "imgheight", None)
    if face not in ("top", "bottom") or not img_w or not img_h or img_w <= 0 or img_h <= 0:
        return [float(x) for x in bbox]
    x_px, y_px, w_px, h_px = (float(b) for b in bbox)
    # 将像素限制在图片范围内，避免越界导致换算后超出木材
    y_px = max(0.0, min(y_px, img_h - 1e-6))
    h_px = max(0.0, min(h_px, img_h - y_px))
    x_px = max(0.0, min(x_px, img_w - 1e-6))
    w_px = max(0.0, min(w_px, img_w - x_px))
    # 将“竖向像素坐标”转换为“横向木材物理坐标”
    # 图片纵轴(img_h) → 木材长度；图片横轴(img_w) → 木材宽度
    x_len = y_px * wood.length / img_h
    y_width = x_px * wood.width / img_w
    w_len = h_px * wood.length / img_h
    h_width = w_px * wood.width / img_w
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
