import React, { useMemo, useState } from 'react';
import { demoOrderJson, demoWoods } from './demoData';

const API_BASE = 'http://127.0.0.1:8765';

function pretty(obj) {
  return JSON.stringify(obj, null, 2);
}

export default function App() {
  const [activeTab, setActiveTab] = useState('order');

  const [orderJson, setOrderJson] = useState(pretty(demoOrderJson));
  const [orderResult, setOrderResult] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);

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
      const msg =
        e?.message?.includes('fetch') || e?.name === 'TypeError'
          ? `请求失败（请确认后端已启动：在项目根目录运行 python main.py，监听 8765 端口）\n${String(e)}`
          : String(e);
      setOrderResult(`错误: ${msg}`);
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
      const msg =
        e?.message?.includes('fetch') || e?.name === 'TypeError'
          ? `请求失败（请确认后端已启动：在项目根目录运行 python main.py，监听 8765 端口）\n${String(e)}`
          : String(e);
      setWoodResultText(`错误: ${msg}`);
    } finally {
      setWoodLoading(false);
    }
  }

  const plan = woodResponse?.cutting_plan;
  const flattenedDefects = woodResponse?.flattened_defects ?? woodResponse?.flattenedDefects ?? [];
  const woodLength = selectedWood?.length ?? 0;
  const woodWidth = selectedWood?.width ?? 100;
  const woodHeight = selectedWood?.height ?? 50;
  const planeHeight = 2 * woodWidth + 2 * woodHeight;

  return (
    <div className="page">
      <header className="header">
        <h1>木材智能切割优化 Demo</h1>
        <p>订单配置与木材切割方案</p>
        <p className="tip">后端地址: {API_BASE}</p>
      </header>

      <div className="tabs">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'order' ? 'active' : ''}`}
          onClick={() => setActiveTab('order')}
        >
          订单配置
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'wood' ? 'active' : ''}`}
          onClick={() => setActiveTab('wood')}
        >
          木材切割
        </button>
      </div>

      {activeTab === 'order' && (
        <div className="layout">
          <div className="panel">
            <h2>订单 JSON</h2>
            <p className="subtext">可编辑后提交，将作为当前订单缓存</p>
            <textarea
              className="code-input"
              value={orderJson}
              onChange={(e) => setOrderJson(e.target.value)}
              spellCheck={false}
            />
            <button
              type="button"
              className="primary-btn"
              onClick={handleSubmitOrder}
              disabled={orderLoading}
            >
              {orderLoading ? '提交中…' : '提交订单'}
            </button>
          </div>
          <div className="panel">
            <h2>响应</h2>
            <pre className="code-output">{orderResult || '—'}</pre>
          </div>
        </div>
      )}

      {activeTab === 'wood' && (
        <>
          <div className="layout">
            <div className="panel">
              <h2>选择木材</h2>
              <div className="row">
                <label>
                  木材:
                  <select
                    value={selectedWoodId}
                    onChange={(e) => setSelectedWoodId(e.target.value)}
                  >
                    {demoWoods.map((w) => (
                      <option key={w.woodId} value={w.woodId}>
                        {w.woodId} (长 {w.length} mm)
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <button
                type="button"
                className="primary-btn"
                onClick={handleSubmitWood}
                disabled={woodLoading}
              >
                {woodLoading ? '计算中…' : '提交并计算切割方案'}
              </button>
            </div>
            <div className="panel">
              <h2>响应</h2>
              <pre className="code-output">{woodResultText || '—'}</pre>
            </div>
          </div>
          {woodResponse && woodLength > 0 && (
            <div className="panel" style={{ marginTop: 16 }}>
              <h2>展开平面图与切割结果</h2>
              <div className="metrics">
                <span className="metric-item">木材: {woodLength} × {woodWidth} × {woodHeight} mm，展开 Y 高: {planeHeight} mm</span>
                {plan && (
                  <>
                    <span className="metric-highlight">
                      已用: {(plan.totalUsedLength ?? plan.total_used_length ?? 0).toFixed(0)} mm，段数: {plan.pieces?.length ?? 0}
                    </span>
                    {(plan.totalKerfMm ?? plan.total_kerf_mm) != null && (
                      <span className="metric-item">锯缝: {plan.totalKerfMm ?? plan.total_kerf_mm} mm</span>
                    )}
                  </>
                )}
                <span className="metric-item">缺陷数: {flattenedDefects.length}</span>
              </div>
              <svg
                className="unfolded-svg"
                viewBox={`0 0 ${woodLength} ${planeHeight}`}
                preserveAspectRatio="xMidYMid meet"
              >
                {/* 展开面背景：上/右/下/左 */}
                <rect x={0} y={0} width={woodLength} height={woodWidth} fill="#fef3c7" stroke="#d1d5db" strokeWidth="0.5" />
                <rect x={0} y={woodWidth} width={woodLength} height={woodHeight} fill="#dbeafe" stroke="#d1d5db" strokeWidth="0.5" />
                <rect x={0} y={woodWidth + woodHeight} width={woodLength} height={woodWidth} fill="#fef3c7" stroke="#d1d5db" strokeWidth="0.5" />
                <rect x={0} y={2 * woodWidth + woodHeight} width={woodLength} height={woodHeight} fill="#dbeafe" stroke="#d1d5db" strokeWidth="0.5" />
                {/* 缺陷（展开平面坐标 bbox_on_plane / bboxOnPlane） */}
                {flattenedDefects.map((d, i) => {
                  const b = d.bbox_on_plane ?? d.bboxOnPlane ?? [];
                  if (b.length < 4) return null;
                  return (
                    <rect
                      key={i}
                      x={b[0]}
                      y={b[1]}
                      width={b[2]}
                      height={b[3]}
                      fill="rgba(185, 28, 28, 0.5)"
                      stroke="#b91c1c"
                      strokeWidth="1"
                    />
                  );
                })}
                {/* 切割段（半透明色块，沿整条 Y 方向） */}
                {plan?.pieces?.map((p, i) => (
                  <rect
                    key={`seg-${i}`}
                    x={p.begin}
                    y={0}
                    width={p.length}
                    height={planeHeight}
                    fill={`hsla(${200 + (i % 4) * 40}, 70%, 85%, 0.35)`}
                    stroke="none"
                  />
                ))}
                {/* 切割线（粗线，沿整条 Y 方向） */}
                {plan?.pieces?.map((p, i) => (
                  <line
                    key={`cut-${i}`}
                    x1={p.begin + p.length}
                    y1={0}
                    x2={p.begin + p.length}
                    y2={planeHeight}
                    stroke="#dc2626"
                    strokeWidth={Math.max(2, 4)}
                  />
                ))}
                {plan?.pieces?.length > 0 && (
                  <line
                    x1={plan.pieces[0].begin}
                    y1={0}
                    x2={plan.pieces[0].begin}
                    y2={planeHeight}
                    stroke="#dc2626"
                    strokeWidth={Math.max(2, 4)}
                  />
                )}
              </svg>
              <div className="legend">
                <span className="legend-item">
                  <span className="legend-color" style={{ background: '#fef3c7' }} />
                  上/下面
                </span>
                <span className="legend-item">
                  <span className="legend-color" style={{ background: '#dbeafe' }} />
                  左/右面
                </span>
                <span className="legend-item">
                  <span className="legend-color" style={{ background: 'rgba(185,28,28,0.5)' }} />
                  缺陷
                </span>
                <span className="legend-item">
                  <span className="legend-color" style={{ background: 'hsla(200,70%,85%,0.5)' }} />
                  切割段
                </span>
                <span className="legend-item">
                  <span className="legend-color" style={{ background: '#dc2626' }} />
                  切割线
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
