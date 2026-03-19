import React, { useMemo, useState, useEffect } from 'react';
import { demoOrderJson, demoWoods, defectnames } from './demoData';

const API_BASE = 'http://127.0.0.1:8765';
// const API_BASE = 'http://192.168.1.221:8765';

function pretty(obj) {
  return JSON.stringify(obj, null, 2);
}

export default function App() {
  const [activeTab, setActiveTab] = useState('order');

  const [orderJson, setOrderJson] = useState(pretty(demoOrderJson));
  const [orderId, setOrderId] = useState('');
  const [orderProducts, setOrderProducts] = useState([]); // { id, requiredQty, completedQty }
  const [orderError, setOrderError] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);

  const [selectedWoodId, setSelectedWoodId] = useState(demoWoods[0]?.woodId ?? '');
  const selectedWood = useMemo(
    () => demoWoods.find((w) => w.woodId === selectedWoodId) ?? demoWoods[0],
    [selectedWoodId],
  );
  const [previewResponse, setPreviewResponse] = useState(null); // 当前木材展开图（切割前）
  const [previewLoading, setPreviewLoading] = useState(false);
  const [woodResponse, setWoodResponse] = useState(null); // 切割结果，仅当 wood_id 与当前选中一致时叠加显示
  const [woodLoading, setWoodLoading] = useState(false);

  // 切换木材时拉取预览展开图（不切割）
  useEffect(() => {
    if (!selectedWoodId || !selectedWood) return;
    let cancelled = false;
    setPreviewLoading(true);
    setPreviewResponse(null);
    setWoodResponse(null); // 换木材后清空切割结果
    fetch(`${API_BASE}/woods/preview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wood: selectedWood }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setPreviewResponse(data);
      })
      .catch(() => {
        if (!cancelled) setPreviewResponse(null);
      })
      .finally(() => {
        if (!cancelled) setPreviewLoading(false);
      });
    return () => { cancelled = true; };
  }, [selectedWoodId]);

  const woodIndex = useMemo(
    () => demoWoods.findIndex((w) => w.woodId === selectedWoodId),
    [selectedWoodId],
  );
  const hasPrevWood = woodIndex > 0;
  const hasNextWood = woodIndex >= 0 && woodIndex < demoWoods.length - 1;
  function goPrevWood() {
    if (hasPrevWood) setSelectedWoodId(demoWoods[woodIndex - 1].woodId);
  }
  function goNextWood() {
    if (hasNextWood) setSelectedWoodId(demoWoods[woodIndex + 1].woodId);
  }

  async function handleSubmitOrder() {
    setOrderLoading(true);
    setOrderError('');
    try {
      const body = JSON.parse(orderJson);
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setOrderId(body.orderId ?? data.order_id ?? '');
      setOrderProducts((body.products ?? []).map((p) => ({
        id: p.id,
        requiredQty: p.qty ?? 0,
        completedQty: 0,
      })));
    } catch (e) {
      const msg =
        e?.message?.includes('fetch') || e?.name === 'TypeError'
          ? `请求失败（请确认后端已启动：在项目根目录运行 python main.py，监听 8765 端口）\n${String(e)}`
          : String(e);
      setOrderError(msg);
    } finally {
      setOrderLoading(false);
    }
  }

  async function handleSubmitWood() {
    setWoodLoading(true);
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
      // 切割后更新订单产品已完成数量
      const satisfied = data?.cutting_plan?.satisfied_products ?? data?.cutting_plan?.satisfiedProducts ?? [];
      if (satisfied.length > 0) {
        setOrderProducts((prev) => {
          const next = prev.map((p) => ({ ...p }));
          for (const sp of satisfied) {
            const pid = sp.product_id ?? sp.productId;
            const qty = sp.produced_qty ?? sp.producedQty ?? 0;
            const item = next.find((n) => n.id === pid);
            if (item) item.completedQty += qty;
          }
          return next;
        });
      }
    } catch (e) {
      const msg =
        e?.message?.includes('fetch') || e?.name === 'TypeError'
          ? `请求失败（请确认后端已启动：在项目根目录运行 python main.py，监听 8765 端口）\n${String(e)}`
          : String(e);
      setWoodResponse(null);
      // 错误时仍可保留上次结果，仅不更新
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
            <h2>订单信息</h2>
            {orderError && <p className="subtext" style={{ color: '#b91c1c' }}>{orderError}</p>}
            {!orderId && orderProducts.length === 0 && !orderError && (
              <p className="subtext">提交订单后显示订单号与产品需求/已完成数量（初始为 0，切割后更新）</p>
            )}
            {orderId && (
              <>
                <p className="subtext">订单号：{orderId}</p>
                <table className="order-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #d1d5db' }}>
                      <th style={{ textAlign: 'left', padding: '6px 8px' }}>产品 ID</th>
                      <th style={{ textAlign: 'right', padding: '6px 8px' }}>需求数量</th>
                      <th style={{ textAlign: 'right', padding: '6px 8px' }}>已完成数量</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderProducts.map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '6px 8px' }}>{p.id}</td>
                        <td style={{ textAlign: 'right', padding: '6px 8px' }}>{p.requiredQty}</td>
                        <td style={{ textAlign: 'right', padding: '6px 8px' }}>{p.completedQty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      )}

      {activeTab === 'wood' && (
        <>
          <div className="layout">
            <div className="panel">
              <h2>选择木材</h2>
              <div className="row" style={{ alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="primary-btn"
                  onClick={goPrevWood}
                  disabled={!hasPrevWood}
                >
                  上一根
                </button>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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
                <button
                  type="button"
                  className="primary-btn"
                  onClick={goNextWood}
                  disabled={!hasNextWood}
                >
                  下一根
                </button>
              </div>
              <button
                type="button"
                className="primary-btn"
                onClick={handleSubmitWood}
                disabled={woodLoading || !orderId}
                style={{ marginTop: 8 }}
              >
                {woodLoading ? '计算中…' : '提交并计算切割方案'}
              </button>
            </div>
            <div className="panel">
              <h2>订单信息</h2>
              {!orderId && orderProducts.length === 0 && (
                <p className="subtext">请先在「订单配置」提交订单</p>
              )}
              {orderId && (
                <>
                  <p className="subtext">订单号：{orderId}</p>
                  <table className="order-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #d1d5db' }}>
                        <th style={{ textAlign: 'left', padding: '6px 8px' }}>产品 ID</th>
                        <th style={{ textAlign: 'right', padding: '6px 8px' }}>需求数量</th>
                        <th style={{ textAlign: 'right', padding: '6px 8px' }}>已完成数量</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderProducts.map((p) => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                          <td style={{ padding: '6px 8px' }}>{p.id}</td>
                          <td style={{ textAlign: 'right', padding: '6px 8px' }}>{p.requiredQty}</td>
                          <td style={{ textAlign: 'right', padding: '6px 8px' }}>{p.completedQty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
          {(previewLoading && !previewResponse) && (
            <div className="panel" style={{ marginTop: 16 }}>
              <p className="subtext">加载展开图…</p>
            </div>
          )}
          {((previewResponse && previewResponse.wood_id === selectedWoodId) || (woodResponse && woodResponse.wood_id === selectedWoodId)) && (() => {
            const base = previewResponse?.wood_id === selectedWoodId
              ? previewResponse
              : woodResponse;
            const len = base?.length ?? woodLength;
            const w = base?.width ?? woodWidth;
            const h = base?.height ?? woodHeight;
            const ph = 2 * w + 2 * h;
            const defects = base?.flattened_defects ?? base?.flattenedDefects ?? [];
            const plan = woodResponse?.wood_id === selectedWoodId ? (woodResponse?.cutting_plan ?? woodResponse?.cuttingPlan) : null;
            // 缺陷颜色：高饱和、色相差距大
            const defectColors = [
              'rgba(239, 68, 68, 0.65)',   // 红
              'rgba(34, 197, 94, 0.65)',   // 绿
              'rgba(59, 130, 246, 0.65)',  // 蓝
              'rgba(234, 179, 8, 0.75)',   // 黄
              'rgba(168, 85, 247, 0.65)',  // 紫（备用）
              'rgba(14, 165, 233, 0.65)',  // 青（新增：匹配更多缺陷类型）
            ];
            const vividProductFills = ['hsla(0, 95%, 58%, 0.5)', 'hsla(38, 100%, 52%, 0.5)', 'hsla(145, 70%, 42%, 0.55)', 'hsla(260, 90%, 58%, 0.5)', 'hsla(300, 85%, 55%, 0.5)'];
            const vividProductLines = ['hsl(0, 95%, 48%)', 'hsl(38, 100%, 45%)', 'hsl(145, 70%, 35%)', 'hsl(260, 90%, 48%)', 'hsl(300, 85%, 45%)'];
            const productIds = orderProducts.length > 0
              ? orderProducts.map((p) => p.id)
              : (plan ? [...new Map(plan.pieces?.map((p) => [p.product_id ?? p.productId, true]) ?? []).keys()] : []);
            const productColor = (pid) => {
              const idx = productIds.indexOf(pid);
              return idx < 0 ? vividProductFills[0] : vividProductFills[idx % vividProductFills.length];
            };
            const productLineColor = (pid) => {
              const idx = productIds.indexOf(pid);
              return idx < 0 ? vividProductLines[0] : vividProductLines[idx % vividProductLines.length];
            };
            const defectColor = (cls) => {
              const idx = defectnames.indexOf(cls);
              return idx < 0 ? defectColors[0] : defectColors[idx % defectColors.length];
            };
            const defectLegend = defectnames.filter((name) =>
              defects.some((d) => (d.defect_class ?? d.class ?? '缺陷') === name),
            );
            if (!len || !ph) return null;
            return (
              <div key={base?.wood_id} className="panel" style={{ marginTop: 16 }}>
                <h2>展开平面图与切割结果</h2>
                {previewLoading && <p className="subtext">加载展开图…</p>}
                <div className="metrics">
                  <span className="metric-item">木材: {len} × {w} × {h} mm，展开 Y 高: {ph} mm</span>
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
                  <span className="metric-item">缺陷数: {defects.length}</span>
                </div>
                <svg
                  className="unfolded-svg"
                  viewBox={`0 0 ${len} ${ph}`}
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* 展开面背景：上/右/下/左 */}
                  <rect x={0} y={0} width={len} height={w} fill="#fef3c7" stroke="#d1d5db" strokeWidth="0.5" />
                  <rect x={0} y={w} width={len} height={h} fill="#dbeafe" stroke="#d1d5db" strokeWidth="0.5" />
                  <rect x={0} y={w + h} width={len} height={w} fill="#fef3c7" stroke="#d1d5db" strokeWidth="0.5" />
                  <rect x={0} y={2 * w + h} width={len} height={h} fill="#dbeafe" stroke="#d1d5db" strokeWidth="0.5" />
                  {/* 缺陷（按缺陷类型着色） */}
                  {defects.map((d, i) => {
                    const b = d.bbox_on_plane ?? d.bboxOnPlane ?? [];
                    if (b.length < 4) return null;
                    const cls = d.defect_class ?? d.class ?? '缺陷';
                    return (
                      <rect
                        key={i}
                        x={b[0]}
                        y={b[1]}
                        width={b[2]}
                        height={b[3]}
                        fill={defectColor(cls)}
                        stroke="#374151"
                        strokeWidth="1"
                      />
                    );
                  })}
                  {/* 切割后叠加：按产品着色 */}
                  {plan?.pieces?.map((p, i) => (
                    <g key={`seg-${i}`}>
                      <rect
                        x={p.begin}
                        y={0}
                        width={p.length}
                        height={ph}
                        fill={productColor(p.product_id ?? p.productId)}
                        stroke="none"
                      />
                      {/* 底部线条凸显该段范围，按产品颜色区分，两端略缩短避免相连 */}
                      <line
                        x1={p.begin + 4}
                        y1={ph}
                        x2={p.begin + p.length - 4}
                        y2={ph}
                        stroke={productLineColor(p.product_id ?? p.productId)}
                        strokeWidth={6}
                        strokeLinecap="round"
                      />
                    </g>
                  ))}
                </svg>
                <div className="legend">
                  {defectLegend.map((cls) => (
                    <span key={cls} className="legend-item">
                      <span className="legend-color" style={{ background: defectColor(cls) }} />
                      {cls}
                    </span>
                  ))}
                  {orderProducts.length > 0 && orderProducts.map((p) => (
                    <span key={p.id} className="legend-item">
                      <span className="legend-color" style={{ background: productColor(p.id) }} />
                      产品 {p.id}
                    </span>
                  ))}
                </div>
              </div>
            );
          })()}
        </>
      )}
    </div>
  );
}
