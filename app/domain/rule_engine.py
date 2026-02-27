"""
规则判定引擎（RuleEngine）— 待实现

职责（见系统架构文档第三节.3）：
  - 针对候选切割段（CutPiece），统计每个 Zone 内各缺陷的数量与密度。
  - 判断该段是否满足所有绑定的 DefectRule。
  - 接口：check_piece(product, section, flattened_defects) -> CheckResult
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import TYPE_CHECKING, Dict, List

if TYPE_CHECKING:
    from app.domain.models import FlattenedDefect, Product, Section


@dataclass
class ZoneCheckDetail:
    zone_id: str
    passed: bool
    violations: list[str] = field(default_factory=list)


@dataclass
class CheckResult:
    passed: bool
    zone_details: list[ZoneCheckDetail] = field(default_factory=list)


def check_piece(
    product: "Product",
    section: "Section",
    flattened_defects: list["FlattenedDefect"],
) -> CheckResult:
    """
    检查某候选切割段是否满足所有区（Zone）的缺陷规则。

    当前实现有一个简化假设：
      - 被检查的切割段 == 整个 section 对应的 X 范围：
          X ∈ [section.begin, section.begin + section.length]

    具体步骤：
      1. 遍历 section.zones，确定每个 Zone 在平面坐标系中的矩形范围：
           X: [section.begin, section.begin + section.length]
           Y: [zone.begin, zone.begin + zone.length]
      2. 在 flattened_defects 中，筛选与该矩形有交集的缺陷。
      3. 按 defect_class 分组，统计数量与密度（maxCount / referenceLength）。
      4. 对每条 DefectRule 检查：
           - 数量 count <= maxCount
           - 所有缺陷的尺寸（长度/高度）<= defectLength/defectHeight
           - 任意长度为 referenceLength 的窗口内，缺陷个数 <= maxCount（密度）
    """
    from app.domain.models import FlattenedDefect as FD  # 局部导入避免循环

    zone_details: List[ZoneCheckDetail] = []

    sec_x0 = float(section.begin)
    sec_x1 = sec_x0 + float(section.length)

    def rect_intersect(
        ax0: float, ax1: float, ay0: float, ay1: float, bx0: float, bx1: float, by0: float, by1: float
    ) -> bool:
        """判断两个轴对齐矩形是否有交集。"""
        return (ax0 < bx1 and ax1 > bx0) and (ay0 < by1 and ay1 > by0)

    for zone in section.zones:
        z_x0 = sec_x0
        z_x1 = sec_x1
        z_y0 = float(zone.begin)
        z_y1 = z_y0 + float(zone.length)

        # 1) 找到落在该 Zone 矩形内（有交集）的缺陷
        defects_in_zone: List[FD] = []
        for d in flattened_defects:
            dx, dy, dw, dh = d.bbox_on_plane
            dx0 = float(dx)
            dx1 = dx0 + float(dw)
            dy0 = float(dy)
            dy1 = dy0 + float(dh)
            if rect_intersect(z_x0, z_x1, z_y0, z_y1, dx0, dx1, dy0, dy1):
                defects_in_zone.append(d)

        # 按 defect_class 分组
        defects_by_class: Dict[str, List[FD]] = {}
        for d in defects_in_zone:
            defects_by_class.setdefault(d.defect_class, []).append(d)

        zone_passed = True
        violations: List[str] = []

        for rule in zone.defect_rules:
            rule_class = rule.defect_name
            matched = defects_by_class.get(rule_class, [])
            count = len(matched)

            # 数量约束
            if count > rule.max_count:
                zone_passed = False
                violations.append(
                    f"rule[{rule_class}] count={count} > maxCount={rule.max_count}"
                )

            # 尺寸约束
            for d in matched:
                dx, dy, dw, dh = d.bbox_on_plane
                d_len = float(dw)
                d_h = float(dh)
                if d_len > rule.defect_length or d_h > rule.defect_height:
                    zone_passed = False
                    violations.append(
                        f"rule[{rule_class}] size violation: "
                        f"len={d_len} (<= {rule.defect_length}), "
                        f"height={d_h} (<= {rule.defect_height})"
                    )
                    # 不 break，记录所有违规尺寸

            # 密度约束：参考区间 referenceLength 内最多 maxCount 个
            if matched and rule.reference_length > 0:
                centers = []
                for d in matched:
                    dx, dy, dw, dh = d.bbox_on_plane
                    centers.append(float(dx) + float(dw) / 2.0)
                centers.sort()

                ref_len = float(rule.reference_length)
                max_count = int(rule.max_count)
                i = 0
                j = 0
                n = len(centers)
                density_violation = False
                while i < n:
                    while j < n and centers[j] - centers[i] <= ref_len:
                        j += 1
                    window_size = j - i
                    if window_size > max_count:
                        density_violation = True
                        break
                    i += 1

                if density_violation:
                    zone_passed = False
                    violations.append(
                        f"rule[{rule_class}] density violation: "
                        f"more than {max_count} defects within {ref_len} length"
                    )

        zone_details.append(
            ZoneCheckDetail(
                zone_id=zone.id,
                passed=zone_passed,
                violations=violations,
            )
        )

    all_passed = all(z.passed for z in zone_details)
    return CheckResult(passed=all_passed, zone_details=zone_details)

