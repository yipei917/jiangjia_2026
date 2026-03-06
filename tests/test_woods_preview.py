"""
测试木材预览接口 POST /woods/preview

输入数据来自 frontend/src/demoData.js 中的 WOOD-DEMO-001。

运行方式（在项目根目录 jiangjia_2026 下）：
  PYTHONPATH=. python tests/test_woods_preview.py -v
  # 若已安装 pytest：
  PYTHONPATH=. python -m pytest tests/test_woods_preview.py -v
"""

from __future__ import annotations

import unittest
from fastapi.testclient import TestClient

from main import app

# 与 demoData.js 中 demoWoods[0]（WOOD-DEMO-001）一致
WOOD_DEMO_001 = {
    "woodId": "WOOD-DEMO-001",
    "length": 1798.08,
    "width": 62.04,
    "height": 18,
    "imgwidth": 3746,
    "imgheight": 129,
    "defectDetails": {
        "top": [
            {"bbox": [135, 1, 12, 142], "class": "crack"},
            {"bbox": [80, 416, 49, 61], "class": "resin"},
            {"bbox": [0, 555, 13, 147], "class": "crack"},
            {"bbox": [0, 555, 11, 146], "class": "crack"},
            {"bbox": [0, 693, 14, 146], "class": "crack"},
            {"bbox": [0, 693, 11, 146], "class": "crack"},
            {"bbox": [0, 832, 16, 147], "class": "crack"},
            {"bbox": [0, 832, 12, 147], "class": "crack"},
            {"bbox": [0, 971, 14, 148], "class": "crack"},
            {"bbox": [0, 971, 11, 147], "class": "crack"},
            {"bbox": [0, 971, 24, 147], "class": "crack"},
            {"bbox": [0, 1110, 18, 147], "class": "crack"},
            {"bbox": [0, 1110, 11, 147], "class": "crack"},
            {"bbox": [0, 1248, 18, 148], "class": "crack"},
            {"bbox": [0, 1248, 14, 148], "class": "crack"},
            {"bbox": [0, 1387, 16, 147], "class": "crack"},
            {"bbox": [0, 1387, 13, 147], "class": "crack"},
            {"bbox": [0, 1387, 24, 147], "class": "crack"},
            {"bbox": [0, 1526, 18, 147], "class": "crack"},
            {"bbox": [0, 1665, 17, 146], "class": "crack"},
            {"bbox": [0, 1803, 19, 146], "class": "crack"},
            {"bbox": [0, 1804, 14, 146], "class": "crack"},
            {"bbox": [0, 1942, 17, 147], "class": "crack"},
            {"bbox": [0, 2081, 18, 147], "class": "crack"},
            {"bbox": [0, 2220, 18, 147], "class": "crack"},
            {"bbox": [0, 2220, 14, 147], "class": "crack"},
            {"bbox": [0, 2358, 12, 147], "class": "crack"},
            {"bbox": [0, 2497, 10, 138], "class": "resin"},
            {"bbox": [0, 2636, 10, 146], "class": "crack"},
            {"bbox": [0, 2636, 13, 147], "class": "crack"},
            {"bbox": [0, 2775, 16, 147], "class": "crack"},
            {"bbox": [0, 2776, 12, 146], "class": "crack"},
            {"bbox": [73, 2913, 57, 76], "class": "black knot"},
            {"bbox": [0, 2914, 9, 146], "class": "crack"},
            {"bbox": [0, 2913, 12, 147], "class": "crack"},
            {"bbox": [0, 3052, 14, 146], "class": "crack"},
            {"bbox": [37, 3164, 50, 36], "class": "black knot"},
            {"bbox": [37, 3163, 51, 36], "class": "resin"},
            {"bbox": [0, 3053, 11, 146], "class": "crack"},
            {"bbox": [30, 3191, 56, 25], "class": "black knot"},
            {"bbox": [87, 3667, 14, 15], "class": "black knot"},
            {"bbox": [89, 3668, 11, 11], "class": "wormhole"},
        ],
        "right": [],
        "bottom": [
            {"bbox": [10, 1303, 15, 13], "class": "black knot"},
            {"bbox": [9, 1671, 14, 14], "class": "black knot"},
            {"bbox": [44, 2560, 12, 10], "class": "black knot"},
            {"bbox": [57, 3193, 42, 52], "class": "black knot"},
            {"bbox": [99, 3668, 10, 12], "class": "black knot"},
        ],
        "left": [],
    },
}


class TestWoodsPreview(unittest.TestCase):
    """木材预览接口测试。"""

    def setUp(self) -> None:
        self.client = TestClient(app)

    def test_woods_preview_with_demo_wood_001(self) -> None:
        """使用 demoData.js 中 WOOD-DEMO-001 调用预览接口，校验返回结构及缺陷数量。"""
        response = self.client.post(
            "/woods/preview",
            json={"wood": WOOD_DEMO_001},
        )
        self.assertEqual(response.status_code, 200, response.text)

        data = response.json()
        self.assertEqual(data["wood_id"], "WOOD-DEMO-001")
        self.assertIn("flattened_defects", data)
        defects = data["flattened_defects"]

        # top 44 + bottom 5 = 49 个缺陷
        top_count = len(WOOD_DEMO_001["defectDetails"]["top"])
        bottom_count = len(WOOD_DEMO_001["defectDetails"]["bottom"])
        expected_total = top_count + bottom_count
        self.assertEqual(
            len(defects),
            expected_total,
            f"期望 {expected_total} 个展开缺陷，实际 {len(defects)}",
        )

        # 每个缺陷应有统一平面坐标（FlattenedDefect 序列化可能为 camelCase 或 snake_case）
        for d in defects:
            wood_key = "wood_id" if "wood_id" in d else "woodId"
            self.assertEqual(d.get(wood_key), "WOOD-DEMO-001")
            bbox_key = "bbox_on_plane" if "bbox_on_plane" in d else "bboxOnPlane"
            self.assertIn(bbox_key, d)
            self.assertEqual(len(d[bbox_key]), 4)
            self.assertTrue("class" in d or "defect_class" in d)


if __name__ == "__main__":
    unittest.main()
