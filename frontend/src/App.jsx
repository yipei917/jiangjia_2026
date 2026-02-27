import React, { useMemo, useState } from 'react';
import { demoOrderJson, demoWoods } from './demoData';

const API_BASE = 'http://127.0.0.1:8765';

function pretty(obj) {
  return JSON.stringify(obj, null, 2);
}

export default function App() {
  const [activeTab, setActiveTab] = useState('order'); // 'order' | 'wood'

  // 订单页状态
  const [orderJson, setOrderJson] = useState(pretty(demoOrderJson));
  const [orderResult, setOrderResult] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);

  // 木材页状态
  const [selectedWoodId, setSelectedWoodId] = useState(demoWoods[0]?.woodId ?? '');
  const selectedWood = useMemo(
    () => demoWoods.find((w) => w.woodId === selectedWoodId) ?? demoWoods[0],
    [selectedWoodId],
  );
  const [woodResultText, setWoodResultText] = useState('');
  const [woodResponse, setWoodResponse] = useState(null);
  const [woodLoading, setWoodLoading] = useState(false);

  async function handleSubmitOrder() {
    setOrderLoading(true);
    setOrderResult('');
    try {
      const body = JSON.parse(orderJson);
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setOrderResult(pretty(data));
    } catch (e) {
      setOrderResult(`错误: ${String(e)}`);
    } finally {
      setOrderLoading(false);
    }
  }

  async function handleSubmitWood() {
    setWoodLoading(true);
    setWoodResultText('');
    setWoodResponse(null);
    try {
      const body = { wood: selectedWood };
      const res = await fetch(`${API_BASE}/woods`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setWoodResultText(pretty(data));
      setWoodResponse(data);
    } catch (e) {
      setWoodResultText(`错误: ${String(e)}`);
    } finally {
      setWoodLoading(false);
    }
  }

  return (
    <div className="page">
      <header className="header">
        <h1>木材切割优化 Demo UI</h1>
        <p>简单 React 界面：一页管理订单，一页查看木材切割方案和缺陷展开图。</p>
        <p className="tip">请先启动后端：python main.py （端口 8765）。</p>
      </header>
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'order' ? 'active' : ''}`}
          onClick={() => setActiveTab('order')}
        >
          订单配置
        </button>
        <button
          className={`tab-btn ${activeTab === 'wood' ? 'active' : ''}`}
          onClick={() => setActiveTab('wood')}
        >
          木材切割与展开图
        </button>
      </div>

      {activeTab === 'order' && (
        <main className="layout single">
          <section className="panel">
            <h2>订单配置（POST /orders）</h2>
            <p className="subtext">可以直接修改 JSON，或使用默认的 demo 订单。</p>
            <textarea
              className="code-input"
              value={orderJson}
              onChange={(e) => setOrderJson(e.target.value)}
            />
            <button className="primary-btn" onClick={handleSubmitOrder} disabled={orderLoading}>
              {orderLoading ? '提交中…' : '提交订单并设为当前订单'}
            </button>
            <h3>响应结果</h3>
            <pre className="code-output">
              {orderResult || '// 点击上面的按钮后，这里会显示 /orders 的响应'}
            </pre>
          </section>
        </main>
      )}

      {activeTab === 'wood' && (
        <main className="layout single">
          <section className="panel">
            <h2>选择木材并请求切割方案（POST /woods）</h2>
            <div className="row">
              <label>
                选择样例木材：
                <select
                  value={selectedWoodId}
                  onChange={(e) => setSelectedWoodId(e.target.value)}
                >
                  {demoWoods.map((w) => (
                    <option key={w.woodId} value={w.woodId}>
                      {w.woodId}（L={w.length}, W={w.width}, H={w.height}）
                    </option>
                  ))}
                </select>
              </label>
              <button className="primary-btn" onClick={handleSubmitWood} disabled={woodLoading}>
                {woodLoading ? '请求中…' : '提交木材到 /woods'}
              </button>
            </div>

            <h3>请求体（wood）</h3>
            <pre className="code-output small">
              {selectedWood ? pretty({ wood: selectedWood }) : '// 未选择木材'}
            </pre>

            <h3>响应结果（cuttingPlan & flattened_defects）</h3>
            <pre className="code-output">
              {woodResultText || '// 点击“提交木材”后，这里会显示 /woods 的响应'}
            </pre>
          </section>

          <section className="panel">
            <UnfoldedView wood={selectedWood} response={woodResponse} />
          </section>
        </main>
      )}
    </div>
  );
}

function UnfoldedView({ wood, response }) {
  if (!wood) {
    return <p className="subtext">请先在左侧选择一根木材。</p>;
  }

  if (!response || !response.flattened_defects) {
    return <p className="subtext">提交木材后，这里会显示展开平面图和切割结果。</p>;
  }

  const defects = response.flattened_defects || [];
  const pieces = response.cutting_plan?.pieces || [];

  const plan = response.cutting_plan || {};
  const totalUsed =
    typeof plan.totalUsedLength === 'number'
      ? plan.totalUsedLength
      : pieces.reduce((s, p) => s + (p.length || 0), 0);
  const woodLength = wood.length || 0;
  const waste =
    typeof plan.wasteLength === 'number'
      ? plan.wasteLength
      : woodLength > 0
        ? Math.max(0, woodLength - totalUsed)
        : 0;
  const utilization = woodLength > 0 ? (totalUsed / woodLength) * 100 : 0;
  const wasteRate = woodLength > 0 ? (waste / woodLength) * 100 : 0;

  // 使用与后端 PlaneLayout 一致的展开高度比例：
  // top:    [0, width)
  // right:  [width, width + height)
  // bottom: [width + height, 2*width + height)
  // left:   [2*width + height, 2*width + 2*height)
  const width = wood.width || 0;
  const height = wood.height || 0;
  const planeHeight = 2 * width + 2 * height;

  const productIds = Array.from(new Set(pieces.map((p) => p.productId)));
  const palette = ['#bfdbfe', '#bbf7d0', '#fed7aa', '#fecaca', '#e9d5ff'];
  const productColor = (id) => {
    const idx = productIds.indexOf(id);
    return palette[idx >= 0 ? idx % palette.length : 0];
  };

  return (
    <div>
      <h2>展开平面图 & 切割结果</h2>
      <div className="metrics">
        <span className="metric-item">原材料长度：{wood.length} mm</span>
        <span className="metric-item">
          截面：{wood.width} × {wood.height} mm
        </span>
        <span className="metric-item">已利用：{totalUsed.toFixed(1)} mm</span>
        <span className="metric-item metric-highlight">
          废料率：{wasteRate.toFixed(1)}%
        </span>
      </div>
      <p className="subtext">
        展开图纵向比例与截面尺寸一致：上/下为宽度段，右/左为高度段；不同颜色为不同产品切割段，深色小块为缺陷。
      </p>
      <svg
        className="unfolded-svg"
        viewBox={`0 0 ${woodLength} ${planeHeight}`}
        preserveAspectRatio="none"
      >
        {/* 整体背景 */}
        <rect
          x="0"
          y="0"
          width={woodLength}
          height={planeHeight}
          fill="#fefce8"
          stroke="#d4d4d4"
          strokeWidth="0.5"
        />

        {/* 水平分割线，对应四个面边界（加粗一点更清晰） */}
        {[width, width + height, width + height + width].map((y, idx) => (
          <line
            key={`hline-${idx}`}
            x1="0"
            y1={y}
            x2={woodLength}
            y2={y}
            stroke="#e5e7eb"
            strokeWidth="1.5"
          />
        ))}

        {/* 切割段：纵向覆盖整个展开高度 */}
        {pieces.map((p, idx) => (
          <rect
            key={`piece-${idx}`}
            x={p.begin}
            y={0}
            width={p.length}
            height={planeHeight}
            fill={productColor(p.productId)}
            fillOpacity="0.25"
            stroke="#6b7280"
            strokeWidth="0.5"
          />
        ))}

        {/* 缺陷：使用后端提供的 bboxOnPlane，自动按比例落在对应面上 */}
        {defects.map((d, idx) => {
          const [x, y, w, h] = d.bboxOnPlane;
          return (
            <rect
              key={`defect-${idx}`}
              x={x}
              y={y}
              width={w}
              height={h}
              fill="#111827"
              fillOpacity="0.85"
            />
          );
        })}
      </svg>

      {productIds.length > 0 && (
        <div className="legend">
          {productIds.map((id) => (
            <span key={id} className="legend-item">
              <span
                className="legend-color"
                style={{ backgroundColor: productColor(id) }}
              />
              产品 {id}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}


