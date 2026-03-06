import React, { useEffect, useMemo, useState } from 'react';
import { demoOrderJson, demoWoods } from './demoData';

const API_BASE = 'http://127.0.0.1:8765';

function pretty(obj) {
  return JSON.stringify(obj, null, 2);
}

export default function App() {
  const [activeTab, setActiveTab] = useState('order');

  const [orderJson, setOrderJson] = useState(pretty(demoOrderJson));
  const [orderResult, setOrderResult] = useState('');
  const [orderSummary, setOrderSummary] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);

  const [selectedWoodId, setSelectedWoodId] = useState(demoWoods[0]?.woodId ?? '');
  const selectedWood = useMemo(
    () => demoWoods.find((w) => w.woodId === selectedWoodId) ?? demoWoods[0],
    [selectedWoodId],
  );
  const [woodResponse, setWoodResponse] = useState(null);
  const [woodLoading, setWoodLoading] = useState(false);
  const [woodError, setWoodError] = useState('');
  const [previewDefects, setPreviewDefects] = useState([]);
  const [previewLoading, setPreviewLoading] = useState(false);

  // 切换木材时只清空当前木材的切割结果与预览缺陷，并拉取新木材的展开缺陷（订单与累计完成不清空）
  useEffect(() => {
    setWoodResponse(null);
    setWoodError('');
    setPreviewDefects([]);
    if (!selectedWood?.woodId) return;
    let cancelled = false;
    setPreviewLoading(true);
    fetch(`${API_BASE}/woods/preview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wood: selectedWood }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('[POST /woods/preview] 返回:', data);
        if (data?.flattened_defects || data?.flattenedDefects) {
          const list = data.flattened_defects ?? data.flattenedDefects;
          console.log('[POST /woods/preview] 缺陷数:', list?.length, '首条 bbox:', list?.[0]);
        }
        if (!cancelled && data?.flattened_defects) setPreviewDefects(data.flattened_defects);
        else if (!cancelled && data?.flattenedDefects) setPreviewDefects(data.flattenedDefects);
      })
      .catch(() => {
        if (!cancelled) setPreviewDefects([]);
      })
      .finally(() => {
        if (!cancelled) setPreviewLoading(false);
      });
    return () => { cancelled = true; };
  }, [selectedWoodId]);

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
      try {
        const current = await fetch(`${API_BASE}/orders/current`).then((r) => r.json());
        setOrderSummary(current);
      } catch {
        // ignore
      }
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
    setWoodError('');
    setWoodResponse(null);
    try {
      const body = { wood: selectedWood };
      const res = await fetch(`${API_BASE}/woods`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setWoodResponse(data);
      try {
        const current = await fetch(`${API_BASE}/orders/current`).then((r) => r.json());
        setOrderSummary(current);
      } catch {
        // ignore
      }
    } catch (e) {
      const msg =
        e?.message?.includes('fetch') || e?.name === 'TypeError'
          ? '请求失败（请确认后端已启动：在项目根目录运行 python main.py，监听 8765 端口）'
          : String(e);
      setWoodError(msg);
    } finally {
      setWoodLoading(false);
    }
  }

  const plan = woodResponse?.cutting_plan;
  const satisfiedProducts =
    plan?.satisfiedProducts ?? plan?.satisfied_products ?? [];
  const flattenedDefects =
    woodResponse?.flattened_defects ?? woodResponse?.flattenedDefects ?? [];
  const defectsForDiagram = woodResponse ? flattenedDefects : previewDefects;

  // 缺陷颜色映射与图例（不同缺陷类型不同颜色）
  const defectColorMap = useMemo(() => {
    const palette = [
      '#ef4444', // red
      '#f97316', // orange
      '#eab308', // yellow
      '#22c55e', // green
      '#3b82f6', // blue
      '#a855f7', // purple
    ];
    const map = {};
    defectsForDiagram.forEach((d) => {
      const name =
        d.defect_class ?? d.class ?? d.defectName ?? d.name ?? '缺陷';
      if (!map[name]) {
        const idx = Object.keys(map).length;
        map[name] = palette[idx % palette.length];
      }
    });
    return map;
  }, [defectsForDiagram]);

  const defectLegend = Object.entries(defectColorMap).map(
    ([name, color]) => ({ name, color }),
  );

  // 产品颜色映射与图例（不同产品不同颜色，用于切割段）
  const productColorMap = useMemo(() => {
    // 半透明颜色，保证切割段不会完全遮挡缺陷
    const palette = [
      'hsla(142, 70%, 60%, 0.35)', // green
      'hsla(217, 70%, 65%, 0.35)', // blue
      'hsla(270, 70%, 70%, 0.35)', // purple
      'hsla(24,  90%, 65%, 0.35)', // orange
      'hsla(50,  90%, 60%, 0.35)', // yellow
      'hsla(190, 80%, 60%, 0.35)', // cyan
    ];
    const map = {};
    const products = orderSummary?.products ?? [];
    products.forEach((p, idx) => {
      if (!map[p.id]) {
        map[p.id] = palette[idx % palette.length];
      }
    });
    // 若尚未加载订单或产品表为空，则从切割段中推导
    if (!products.length && plan?.pieces) {
      plan.pieces.forEach((p) => {
        const pid = p.productId ?? p.product_id;
        if (pid && !map[pid]) {
          const idx = Object.keys(map).length;
          map[pid] = palette[idx % palette.length];
        }
      });
    }
    return map;
  }, [orderSummary, plan]);
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
              <div className="row" style={{ flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                <button
                  type="button"
                  className="primary-btn"
                  style={{ background: '#6b7280' }}
                  onClick={() => {
                    const idx = demoWoods.findIndex((w) => w.woodId === selectedWoodId);
                    if (idx > 0) setSelectedWoodId(demoWoods[idx - 1].woodId);
                  }}
                  disabled={demoWoods.findIndex((w) => w.woodId === selectedWoodId) <= 0}
                >
                  上一根
                </button>
                <label style={{ margin: 0 }}>
                  木材:
                  <select
                    value={selectedWoodId}
                    onChange={(e) => setSelectedWoodId(e.target.value)}
                    style={{ marginLeft: 8 }}
                  >
                    {demoWoods.map((w) => (
                      <option key={w.woodId} value={w.woodId}>
                        {w.woodId} (长 {w.length} mm)
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  className="primary-btn"
                  style={{ background: '#6b7280' }}
                  onClick={() => {
                    const idx = demoWoods.findIndex((w) => w.woodId === selectedWoodId);
                    if (idx >= 0 && idx < demoWoods.length - 1) setSelectedWoodId(demoWoods[idx + 1].woodId);
                  }}
                  disabled={
                    demoWoods.findIndex((w) => w.woodId === selectedWoodId) >= demoWoods.length - 1 ||
                    demoWoods.findIndex((w) => w.woodId === selectedWoodId) < 0
                  }
                >
                  下一根
                </button>
                <button
                  type="button"
                  className="primary-btn"
                  onClick={handleSubmitWood}
                  disabled={woodLoading}
                >
                  {woodLoading ? '计算中…' : '提交并计算切割方案'}
                </button>
              </div>
              {woodError && (
                <p style={{ marginTop: 8, color: '#dc2626', fontSize: 14 }}>{woodError}</p>
              )}
            </div>
            <div className="panel">
              <h2>订单完成情况</h2>
              {!orderSummary && (
                <p className="subtext">尚未加载订单，请先在上方“订单配置”提交。</p>
              )}
              {orderSummary && (
                <div style={{ fontSize: 13 }}>
                  {orderSummary.products?.map((p) => {
                    const produced = p.producedQty ?? p.produced_qty ?? 0;
                    const required = p.qty ?? 0;
                    const remaining = Math.max(0, required - produced);
                    return (
                      <div key={p.id} style={{ marginBottom: 4 }}>
                        产品 {p.id}: 已完成 {produced} / {required}，剩余 {remaining}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          {woodLength > 0 && (
            <div className="panel" style={{ marginTop: 16 }}>
              <h2>展开平面图</h2>
              <div className="metrics">
                <span className="metric-item">木材: {woodLength} × {woodWidth} × {woodHeight} mm，展开 Y 高: {planeHeight} mm</span>
                <span className="metric-item">
                  缺陷数: {previewLoading && !woodResponse ? '加载中…' : defectsForDiagram.length}
                </span>
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
                {/* 缺陷：预览用 previewDefects，提交后用接口返回的 flattened_defects */}
                {defectsForDiagram.map((d, i) => {
                  const name =
                    d.defect_class ?? d.class ?? d.defectName ?? d.name ?? '缺陷';
                  const color = defectColorMap[name] ?? '#ef4444';
                  const b = d.bbox_on_plane ?? d.bboxOnPlane ?? [];
                  if (b.length < 4) return null;
                  const xRaw = Number(b[0]);
                  const yRaw = Number(b[1]);
                  const wRaw = Number(b[2]);
                  const hRaw = Number(b[3]);
                  if (!Number.isFinite(xRaw) || !Number.isFinite(yRaw) || !Number.isFinite(wRaw) || !Number.isFinite(hRaw)) {
                    return null;
                  }
                  // 将缺陷裁剪到 [0, woodLength] 区间，保证 width >= 0
                  const x = Math.max(0, Math.min(woodLength, xRaw));
                  const maxWidth = Math.max(0, woodLength - x);
                  const w = Math.max(0, Math.min(wRaw, maxWidth));
                  const h = Math.max(hRaw, 1.5); // 最小显示高度，避免太细看不见
                  if (w <= 0) return null;
                  return (
                    <rect
                      key={i}
                      x={x}
                      y={yRaw}
                      width={w}
                      height={h}
                      fill={color}
                      stroke={color}
                      strokeWidth="1"
                    />
                  );
                })}
                {/* 切割段：按产品着色，不再单独渲染锯缝/切割线 */}
                {woodResponse && plan?.pieces?.map((p, i) => {
                  const pid = p.productId ?? p.product_id;
                  const color = productColorMap[pid] ?? `hsla(${200 + (i % 4) * 40}, 70%, 85%, 0.35)`;
                  return (
                  <rect
                    key={`seg-${i}`}
                    x={p.begin}
                    y={0}
                    width={p.length}
                    height={planeHeight}
                    fill={color}
                    stroke="none"
                  />
                  );
                })}
              </svg>
              <div className="legend">
                {defectLegend.map((d) => (
                  <span className="legend-item" key={d.name}>
                    <span className="legend-color" style={{ background: d.color }} />
                    {d.name}
                  </span>
                ))}
                {Object.entries(productColorMap).map(([id, color]) => (
                  <span className="legend-item" key={id}>
                    <span className="legend-color" style={{ background: color }} />
                    产品 {id}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
