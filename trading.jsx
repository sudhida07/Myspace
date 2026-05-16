/* global React */
const { useState: useStateT, useMemo: useMemoT } = React;

// ---------- Mock data ----------
const indianHoldings = [
  { sym: "TCS", name: "Tata Consultancy", qty: 24, avg: 3120, ltp: 3842.5, day: 1.24, spark: gen(3120, 14, 0.02) },
  { sym: "INFY", name: "Infosys", qty: 60, avg: 1480, ltp: 1668.2, day: -0.42, spark: gen(1480, 14, 0.018) },
  { sym: "HDFCBANK", name: "HDFC Bank", qty: 40, avg: 1520, ltp: 1684.7, day: 0.62, spark: gen(1520, 14, 0.012) },
  { sym: "RELIANCE", name: "Reliance Industries", qty: 18, avg: 2380, ltp: 2914.0, day: 0.18, spark: gen(2380, 14, 0.015) },
  { sym: "ASIANPAINT", name: "Asian Paints", qty: 22, avg: 2890, ltp: 2742.1, day: -1.18, spark: gen(2890, 14, 0.02, -0.3) },
  { sym: "BAJFIN", name: "Bajaj Finance", qty: 12, avg: 6420, ltp: 7204.5, day: 2.41, spark: gen(6420, 14, 0.025) },
  { sym: "TITAN", name: "Titan Company", qty: 30, avg: 3010, ltp: 3486.8, day: 0.78, spark: gen(3010, 14, 0.018) },
  { sym: "DMART", name: "Avenue Supermarts", qty: 8, avg: 4200, ltp: 4612.3, day: -0.32, spark: gen(4200, 14, 0.022) },
];
function gen(base, n, vol, drift = 0.1) {
  const out = [];
  let v = base;
  for (let i = 0; i < n; i++) {
    v = v * (1 + (Math.random() - 0.5 + drift / n) * vol);
    out.push(v);
  }
  return out;
}
const usHoldings = [
  { sym: "AAPL", name: "Apple", qty: 22, avg: 162.4, ltp: 218.7, day: 0.84, spark: gen(162, 14, 0.015) },
  { sym: "MSFT", name: "Microsoft", qty: 14, avg: 312.1, ltp: 421.8, day: 1.04, spark: gen(312, 14, 0.013) },
  { sym: "NVDA", name: "NVIDIA", qty: 18, avg: 480.2, ltp: 1142.6, day: 3.12, spark: gen(480, 14, 0.04) },
  { sym: "GOOGL", name: "Alphabet", qty: 16, avg: 132.5, ltp: 178.2, day: -0.42, spark: gen(132, 14, 0.018) },
  { sym: "META", name: "Meta Platforms", qty: 8, avg: 285.0, ltp: 504.9, day: 0.18, spark: gen(285, 14, 0.022) },
  { sym: "TSLA", name: "Tesla", qty: 10, avg: 220.5, ltp: 184.3, day: -2.18, spark: gen(220, 14, 0.04, -0.4) },
];
const watchlist = [
  { sym: "NIFTY 50", v: 24512.4, d: 0.42 },
  { sym: "SENSEX", v: 80845.0, d: 0.38 },
  { sym: "BANKNIFTY", v: 51284.6, d: 0.62 },
  { sym: "S&P 500", v: 5642.8, d: -0.18 },
  { sym: "NASDAQ", v: 18241.2, d: 0.24 },
  { sym: "USDINR", v: 84.21, d: 0.04 },
  { sym: "GOLD", v: 7412.0, d: 0.91 },
  { sym: "BTC", v: 6824000, d: -1.42 },
];
const recentTrades = [
  { t: "10:42", side: "BUY", sym: "INFY", qty: 10, px: 1660.4 },
  { t: "10:18", side: "SELL", sym: "TSLA", qty: 4, px: 184.7 },
  { t: "Yesterday", side: "BUY", sym: "BAJFIN", qty: 4, px: 7180.2 },
  { t: "Yesterday", side: "BUY", sym: "NVDA", qty: 2, px: 1118.4 },
  { t: "2d ago", side: "SELL", sym: "ASIANPAINT", qty: 5, px: 2762.1 },
  { t: "3d ago", side: "BUY", sym: "TCS", qty: 4, px: 3811.0 },
];

// ---------- Treemap ----------
function Treemap({ items, width = 720, height = 280 }) {
  // Squarified-ish layout (simple slice/dice)
  const total = items.reduce((s, x) => s + x.value, 0);
  const tiles = useMemoT(() => {
    const sorted = [...items].sort((a, b) => b.value - a.value);
    const out = [];
    let x = 0, y = 0, rw = width, rh = height;
    let horizontal = rw > rh;
    let row = [];
    let rowSum = 0;

    const flushRow = () => {
      const ratio = rowSum / total;
      if (horizontal) {
        const rowH = rh * ratio;
        let cx = x;
        for (const it of row) {
          const w = (it.value / rowSum) * rw;
          out.push({ ...it, x: cx, y, w, h: rowH });
          cx += w;
        }
        y += rowH; rh -= rowH;
      } else {
        const rowW = rw * ratio;
        let cy = y;
        for (const it of row) {
          const h = (it.value / rowSum) * rh;
          out.push({ ...it, x, y: cy, w: rowW, h });
          cy += h;
        }
        x += rowW; rw -= rowW;
      }
      row = []; rowSum = 0;
      horizontal = rw > rh;
    };

    for (let i = 0; i < sorted.length; i++) {
      row.push(sorted[i]);
      rowSum += sorted[i].value;
      // simple heuristic: flush when row has 3 items or last
      if (row.length >= (sorted.length > 6 ? 3 : 2) || i === sorted.length - 1) flushRow();
    }
    return out;
  }, [items, width, height]);

  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      {tiles.map((t, i) => {
        const pct = (t.value / total) * 100;
        const big = t.w > 80 && t.h > 40;
        const small = t.w > 50 && t.h > 24;
        const intensity = Math.min(1, Math.abs(t.day) / 3);
        const isUp = t.day >= 0;
        const fillBase = isUp ? "74, 222, 128" : "248, 113, 113";
        return (
          <g key={i}>
            <rect
              x={t.x + 1} y={t.y + 1}
              width={t.w - 2} height={t.h - 2}
              fill={`rgba(${fillBase}, ${0.06 + intensity * 0.18})`}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
              rx="6"
            />
            {big && (
              <>
                <text x={t.x + 10} y={t.y + 18} fill="var(--text-primary)" fontSize="12" fontWeight="600" fontFamily="var(--font-ui)">{t.sym}</text>
                <text x={t.x + 10} y={t.y + 34} fill="var(--text-tertiary)" fontSize="10" fontFamily="var(--font-mono)">{pct.toFixed(1)}%</text>
                <text x={t.x + 10} y={t.y + t.h - 10} fill={isUp ? "var(--positive)" : "var(--negative)"} fontSize="11" fontFamily="var(--font-mono)" fontWeight="500">
                  {(isUp ? "+" : "−") + Math.abs(t.day).toFixed(2) + "%"}
                </text>
              </>
            )}
            {!big && small && (
              <text x={t.x + 8} y={t.y + 16} fill="var(--text-primary)" fontSize="11" fontWeight="500" fontFamily="var(--font-ui)">{t.sym}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ---------- Hero Strip primitive ----------
function HeroStat({ label, value, sub, accent }) {
  return (
    <div className="hero-stat" style={{ flex: 1, padding: "0 24px 0 0", borderRight: "1px solid var(--border)", minWidth: 0, overflow: "hidden" }}>
      <div style={{ fontSize: 11, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</div>
      <div className="display tnum hero-num" style={{ fontWeight: 600, lineHeight: 1, color: accent || "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value}</div>
      {sub && <div className="mono hero-sub" style={{ color: "var(--text-secondary)", marginTop: 8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sub}</div>}
    </div>
  );
}
window.HeroStat = HeroStat;

// ---------- Watchlist Strip ----------
function WatchStrip() {
  return (
    <div style={{ display: "flex", gap: 0, overflow: "auto", border: "1px solid var(--border)", borderRadius: 12, background: "var(--surface)" }}>
      {watchlist.map((w, i) => (
        <div key={w.sym} style={{
          padding: "10px 18px",
          borderRight: i < watchlist.length - 1 ? "1px solid var(--border)" : "none",
          display: "flex", flexDirection: "column", gap: 4, minWidth: 130, flex: "1 0 auto"
        }}>
          <div style={{ fontSize: 10, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{w.sym}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span className="mono" style={{ fontSize: 13, color: "var(--text-primary)" }}>
              {w.v >= 100000 ? w.v.toLocaleString("en-IN", { maximumFractionDigits: 0 }) : w.v.toFixed(2)}
            </span>
            <span className="mono" style={{ fontSize: 11, color: w.d >= 0 ? "var(--positive)" : "var(--negative)" }}>
              {(w.d >= 0 ? "+" : "−") + Math.abs(w.d).toFixed(2) + "%"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- Holdings Table ----------
function HoldingsTable({ holdings, currency = "INR" }) {
  const fmt = currency === "INR" ? window.fmtINR : window.fmtUSD;
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1.4fr 0.6fr 0.9fr 0.9fr 0.6fr 1fr 1fr 0.8fr",
        padding: "10px 16px",
        borderBottom: "1px solid var(--border)",
        fontSize: 11, color: "var(--text-tertiary)",
        textTransform: "uppercase", letterSpacing: "0.06em",
      }}>
        <div>Symbol</div>
        <div style={{ textAlign: "right" }}>Qty</div>
        <div style={{ textAlign: "right" }}>Avg</div>
        <div style={{ textAlign: "right" }}>LTP</div>
        <div style={{ textAlign: "right" }}>Day</div>
        <div style={{ textAlign: "right" }}>P&amp;L</div>
        <div style={{ textAlign: "right" }}>Value</div>
        <div style={{ textAlign: "right" }}>14d</div>
      </div>
      {holdings.map((h, i) => {
        const value = h.qty * h.ltp;
        const pnl = (h.ltp - h.avg) * h.qty;
        const pnlPct = ((h.ltp - h.avg) / h.avg) * 100;
        const up = h.day >= 0;
        return (
          <div key={h.sym} className="row-hover" style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 0.6fr 0.9fr 0.9fr 0.6fr 1fr 1fr 0.8fr",
            padding: "12px 16px",
            borderBottom: i < holdings.length - 1 ? "1px solid var(--border)" : "none",
            alignItems: "center",
            fontSize: 13,
          }}>
            <div>
              <div style={{ fontWeight: 500, color: "var(--text-primary)" }}>{h.sym}</div>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{h.name}</div>
            </div>
            <div className="mono" style={{ textAlign: "right", color: "var(--text-secondary)" }}>{h.qty}</div>
            <div className="mono" style={{ textAlign: "right", color: "var(--text-secondary)" }}>{fmt(h.avg, { decimals: currency === "INR" ? 2 : 2 }).replace(/[₹$]/, "")}</div>
            <div className="mono" style={{ textAlign: "right", color: "var(--text-primary)" }}>{fmt(h.ltp, { decimals: 2 }).replace(/[₹$]/, "")}</div>
            <div className="mono" style={{ textAlign: "right", color: up ? "var(--positive)" : "var(--negative)" }}>
              {(up ? "+" : "−") + Math.abs(h.day).toFixed(2)}%
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="mono" style={{ color: pnl >= 0 ? "var(--positive)" : "var(--negative)", fontSize: 13 }}>
                {fmt(pnl, { sign: true, decimals: 0 })}
              </div>
              <div className="mono" style={{ fontSize: 10, color: "var(--text-tertiary)" }}>
                {(pnlPct >= 0 ? "+" : "−") + Math.abs(pnlPct).toFixed(2)}%
              </div>
            </div>
            <div className="mono" style={{ textAlign: "right", color: "var(--text-primary)" }}>{fmt(value, { decimals: 0 })}</div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <window.Sparkline data={h.spark} color={up ? "#4ADE80" : "#F87171"} width={70} height={22} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------- Recent trades feed ----------
function RecentTrades() {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, fontWeight: 500 }}>Recent trades</span>
        <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>This week</span>
      </div>
      <div style={{ flex: 1, overflow: "auto" }}>
        {recentTrades.map((t, i) => (
          <div key={i} style={{
            padding: "10px 16px",
            borderBottom: i < recentTrades.length - 1 ? "1px solid var(--border)" : "none",
            display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 10, alignItems: "center"
          }}>
            <span style={{
              fontSize: 10, fontWeight: 500, padding: "2px 6px", borderRadius: 4,
              color: t.side === "BUY" ? "var(--positive)" : "var(--negative)",
              background: t.side === "BUY" ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)",
              fontFamily: "var(--font-mono)"
            }}>{t.side}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{t.sym}</div>
              <div className="mono" style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{t.qty} @ {t.px.toFixed(2)}</div>
            </div>
            <span className="mono" style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{t.t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Module ----------
function TradingPortfolio() {
  const [tab, setTab] = useStateT("IN");
  const holdings = tab === "IN" ? indianHoldings : usHoldings;

  const totalValueINR = useMemoT(() => {
    const inVal = indianHoldings.reduce((s, h) => s + h.qty * h.ltp, 0);
    const usVal = usHoldings.reduce((s, h) => s + h.qty * h.ltp, 0) * 84.21;
    return inVal + usVal;
  }, []);
  const dayPnL = useMemoT(() => {
    const inP = indianHoldings.reduce((s, h) => s + h.qty * h.ltp * (h.day / 100), 0);
    const usP = usHoldings.reduce((s, h) => s + h.qty * h.ltp * (h.day / 100), 0) * 84.21;
    return inP + usP;
  }, []);
  const dayPnLPct = (dayPnL / totalValueINR) * 100;
  const allTimePnL = useMemoT(() => {
    const inP = indianHoldings.reduce((s, h) => s + (h.ltp - h.avg) * h.qty, 0);
    const usP = usHoldings.reduce((s, h) => s + (h.ltp - h.avg) * h.qty, 0) * 84.21;
    return inP + usP;
  }, []);

  const treeItems = useMemoT(() => {
    return [...indianHoldings, ...usHoldings.map(h => ({ ...h, sym: h.sym, ltp: h.ltp * 84.21, qty: h.qty }))]
      .map(h => ({ sym: h.sym, value: h.qty * h.ltp, day: h.day }));
  }, []);

  return (
    <div className="page-in" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Hero strip */}
      <div style={{ display: "flex", alignItems: "stretch", padding: "8px 0" }}>
        <HeroStat
          label="Portfolio value"
          value={<window.CountUp value={totalValueINR} format={(v) => window.fmtINR(v, { compact: true })} />}
          sub={<>{indianHoldings.length + usHoldings.length} positions · 2 markets</>}
        />
        <HeroStat
          label="Day P&amp;L"
          value={<span style={{ color: dayPnL >= 0 ? "var(--positive)" : "var(--negative)" }}><window.CountUp value={dayPnL} format={(v) => window.fmtINR(v, { sign: true, decimals: 0 })} /></span>}
          sub={<span style={{ color: dayPnL >= 0 ? "var(--positive)" : "var(--negative)" }}>{(dayPnLPct >= 0 ? "+" : "−") + Math.abs(dayPnLPct).toFixed(2)}% today</span>}
        />
        <HeroStat
          label="All-time P&amp;L"
          value={<span style={{ color: allTimePnL >= 0 ? "var(--positive)" : "var(--negative)" }}><window.CountUp value={allTimePnL} format={(v) => window.fmtINR(v, { sign: true, compact: true })} /></span>}
          sub={`${((allTimePnL / (totalValueINR - allTimePnL)) * 100).toFixed(1)}% return on cost`}
        />
        <div style={{ width: 200, flexShrink: 0, padding: "0 0 0 24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 11, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Markets</div>
          <div className="mono" style={{ fontSize: 12, color: "var(--text-primary)", lineHeight: 1.7, whiteSpace: "nowrap" }}>
            NIFTY <span style={{ color: "var(--positive)" }}>+0.42%</span><br/>
            S&amp;P <span style={{ color: "var(--negative)" }}>−0.18%</span>
          </div>
        </div>
      </div>

      <WatchStrip />

      {/* Holdings + Recent Trades */}
      <div className="trading-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 0, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 2 }}>
              {[
                { id: "IN", label: "Indian stocks", count: indianHoldings.length },
                { id: "US", label: "US stocks", count: usHoldings.length },
              ].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  padding: "5px 14px", borderRadius: 6, fontSize: 12, fontWeight: 500,
                  background: tab === t.id ? "var(--surface-elevated)" : "transparent",
                  color: tab === t.id ? "var(--text-primary)" : "var(--text-secondary)",
                  display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap",
                  transition: "all 120ms var(--ease)"
                }}>
                  {t.label}
                  <span className="mono" style={{ fontSize: 10, color: "var(--text-tertiary)" }}>{t.count}</span>
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-ghost"><window.Icons.Filter size={13} /> Filter</button>
              <button className="btn"><window.Icons.Plus size={13} /> Add trade</button>
            </div>
          </div>
          <HoldingsTable holdings={holdings} currency={tab === "IN" ? "INR" : "USD"} />

          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 500 }}>Allocation</span>
              <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>By market value · all positions</span>
            </div>
            <Treemap items={treeItems} width={840} height={260} />
          </div>
        </div>
        <RecentTrades />
      </div>
    </div>
  );
}

window.TradingPortfolio = TradingPortfolio;
