## 木材智能切割优化引擎系统架构设计

### 一、总体架构分层

- **接口层（API Layer）**
  - **HTTP/JSON 接口**：对外暴露订单管理和木材处理接口。
  - 负责：参数校验、JSON 解析/序列化、调用领域服务，不写业务逻辑。

- **领域层（Domain）**
  - **解析管理模块（OrderService）**
  - **几何与缺陷映射模块（Geometry & DefectMapping）**
  - **规则判定引擎（RuleEngine）**
  - **优化决策引擎（OptimizationEngine）**
  - **方案评估模块（SolutionEvaluator）**
  - 所有与“木材/产品/缺陷/切割方案”相关的核心业务都在这里。

- **基础设施层（Infrastructure）**
  - **日志 & 监控**：记录每次优化请求、耗时、失败原因、关键参数等。

---

### 二、核心领域模型（数据结构）

#### 1. 产品相关（基于平面坐标的定义）

- **统一平面坐标系（一次只处理一根木材）**
  - `X` 轴：沿木材长度方向，范围 `[0, wood.length]`。
  - `Y` 轴：将上、右、下、左四个面按顺序展开拼接后的纵向坐标，且各段**不重叠**：
    - 设木材理论截面尺寸为：`refWidth`（宽，对应 top/bottom 的宽度），`refHeight`（高，对应 left/right 的高度）。
    - `top:    [0, refWidth)`
    - `right:  [refWidth, refWidth + refHeight)`
    - `bottom: [refWidth + refHeight, 2 * refWidth + refHeight)`
    - `left:   [2 * refWidth + refHeight, 2 * refWidth + 2 * refHeight)`
  - 当前版本假设同一产品下的 `Zone` 在 Y 方向上互不重叠（只考虑不重叠 Zone 的情况）。

- **Product**
  - `id: string`
  - `minLength, maxLength: number | null`
  - `minWidth, maxWidth: number | null`
  - `minHeight, maxHeight: number | null`
  - `refHeight: number`
  - `refWidth: number`
  - `qty: number`
  - `value: number`（0–1，保留 2 位）
  - `sections: Section[]`

- **Section**
  - `id: string`
  - `begin: number`（在整根木材上的起点位置，沿长度方向）
  - `length: number`
  - `zones: Zone[]`

- **Zone**
  - `id: string`
  - `begin: number`（可约定统一为“整根木材坐标系”y轴的起点）
  - `length: number`
  - `defectRules: DefectRule[]`

- **DefectRule**
  - `defectName: string`
  - `maxCount: number`
  - `defectLength: number`
  - `defectHeight: number`
  - `referenceLength: number`（用于密度：`maxCount / referenceLength`）

#### 2. 木材扫描相关

- **Wood**
  - `woodId: string`
  - `length: number`
  - `width: number`
  - `height: number`
  - `defectDetails: { top: DefectInstance[]; bottom: DefectInstance[]; left: DefectInstance[]; right: DefectInstance[] }`

- **DefectInstance**
  - `bbox: [x, y, w, h]`（像素坐标或归一化坐标，需有统一约定）
  - `class: string`

#### 3. 中间与输出模型

- **FlattenedDefect（展开平面上的缺陷）**
  - `woodId: string`
  - `class: string`
  - `bboxOnPlane: [x, y, w, h]`（在统一展开平面坐标系中的缺陷矩形）

- **CutPiece（切割段）**
  - `begin: number`
  - `length: number`
  - `productId: string`
  - `value: number`（该段贡献的价值）

- **CuttingPlan（整根木材切割方案）**
  - `woodId: string`
  - `pieces: CutPiece[]`
  - `totalValue: number`
  - `totalUsedLength: number`
  - `wasteLength: number`
  - `satisfiedProducts: { productId: string; producedQty: number; requiredQty: number }[]`

---

### 三、核心模块与职责划分

#### 1. 解析管理模块（OrderService）

- **职责**
  - 接收并解析订单 JSON（多个 `Product`）。
  - 将当前有效订单配置存入内存缓存。
- **输出**
  - 内存中的“当前订单配置”对象（`CurrentOrder`）。

#### 2. 平面展开与缺陷映射模块（PlaneLayout & DefectMapping）

- **职责**
  - 定义统一的“木材展开平面”坐标系（X：长度方向；Y：上/右/下/左按顺序展开）。
  - 将 `defectDetails` 中各面的 `bbox` 转换为 `bboxOnPlane`。

- **输出**
  - `FlattenedDefect[]`（全部被映射到统一平面上的缺陷列表）。

#### 3. 规则判定引擎（RuleEngine）待实现

- **职责**
  - 针对某个候选切割段（`CutPiece`）：
    - 统计该段内每个 `Zone` 的缺陷情况：
      - 每种 `defectName` 的数量。
      - 缺陷尺寸是否超过 `defectLength/defectHeight`。
      - 密度：在长度方向上，单位 `referenceLength` 内最多 `maxCount` 个。
    - 判断该段是否满足所有绑定的 `DefectRule`。
- **接口**
  - `checkPiece(product, section, zones, mappedDefects) -> { passed: boolean; details: ... }`

#### 4. 优化决策引擎（OptimizationEngine）待实现

- **问题抽象**
  - 给定：一根木材（长度 L）和订单需求（若干 Product，各有需求数量与价值）。
  - 约束：每段切割出来的 piece 必须满足对应 Product 的几何约束和缺陷规则。
  - 目标：最大化总价值（`sum(piece.value)`），同时尽量满足订单需求数量。

- **职责**
  - 生成候选切割方案：
    - 根据 `Product.minLength/maxLength/refLength` 预生成一组“可行长度段模板”。
    - 将木材长度离散化为若干“切割位置候选点”（基于 Section/Zone 边界、缺陷边界、最小长度约束等）。
  - 使用算法搜索最优方案：
    - 第一版可用启发式/贪心：
      - 按 `value` / `value per mm` 排序产品，依次尝试从头到尾填充。
      - 每次尝试在当前位置上，为每个可行 Product 构造一个候选段，调用 `RuleEngine` 检查可行性。
      - 使用回溯或局部搜索提升质量。
    - 后续可升级为：
      - 动态规划 / Integer Programming（0-1/多维背包 + 约束）。
      - 遗传算法 / 模拟退火等。
  - 输出：
    - 最终 `CuttingPlan`，以及搜索过程中的评估指标（可选）。

#### 5. 方案评估模块（SolutionEvaluator）待实现

- **职责**
  - 计算方案整体指标：
    - 总价值、利用率（`totalUsedLength / wood.length`）、废料比例。
    - 产品需求满足度（哪些产品欠缺）。
  - 提供用于日志记录和后期可视化的摘要数据。

---

### 四、接口设计

#### 1. 接受订单信息

- **HTTP**
  - `POST /orders`

- **Request 示例**

```json
{
  "orderId": "ORDER-20260227-001",
  "products": [
    {
      "id": "P1",
      "minLength": 2000,
      "maxLength": 2200,
      "minWidth": 100,
      "maxWidth": 100,
      "minHeight": 50,
      "maxHeight": 50,
      "refHeight": 50,
      "refWidth": 100,
      "qty": 100,
      "value": 0.9,
      "sections": [
        {
          "id": "S1",
          "begin": 0,
          "length": 2000,
          "zones": [
            {
              "id": "Z1",
              "begin": 0,
              "length": 1000,
              "defectRules": [
                {
                  "defectName": "Blackknot",
                  "maxCount": 2,
                  "defectLength": 30,
                  "defectHeight": 30,
                  "referenceLength": 1000
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

- **Response 示例**

```json
{
  "status": "ok",
  "orderId": "ORDER-20260227-001",
  "message": "order loaded as current"
}
```

---

#### 2. 查看当前订单信息

- **HTTP**
  - `GET /orders/current`

- **Response 示例**

```json
{
  "orderId": "ORDER-20260227-001",
  "products": [
    /* 当前有效的 Product 配置 */
  ]
}
```

---

#### 3. 接受木材并返回切割方案

- **HTTP**
  - `POST /woods`

- **Request 示例**

```json
{
  "wood": {
    "woodId": "WOOD-001",
    "length": 2000,
    "width": 500,
    "height": 50,
    "defectDetails": {
      "top": [],
      "bottom": [],
      "left": [],
      "right": []
    }
  }
}
```

---

### 五、单根木材处理流程概览

1. 接收订单：`POST /orders` → 解析 → 校验 → 缓存。
2. 接收单根木材扫描数据：`POST /woods`。
3. 将上/右/下/左四个面展开到统一平面，并把原始 `bbox` 映射为 `FlattenedDefect.bboxOnPlane`。
4. 在平面坐标系中，根据 Section（X 轴范围）和 Zone（Y 轴范围）确定规则作用的矩形区域。
5. 生成候选切割位置与段模板（沿 X 轴），并在对应平面区域内统计缺陷，调用 `RuleEngine` 过滤不合格段。
6. 优化搜索：组合合格段，形成总价值最大的切割方案。
7. 计算整体指标并返回 JSON 方案。

