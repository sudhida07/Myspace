/* global React */
const { useState: useStateE, useMemo: useMemoE } = React;

const LOANS = [
  { id: "home", name: "Home loan", lender: "HDFC", principal: 6800000, paid: 1840000, emi: 58420, rate: 8.65, dueDay: 5, term: 240, monthsPaid: 32 },
  { id: "car", name: "Car loan", lender: "ICICI", principal: 1200000, paid: 720000, emi: 24180, rate: 9.4, dueDay: 12, term: 60, monthsPaid: 30 },
  { id: "edu", name: "Education loan", lender: "SBI", principal: 800000, paid: 540000, emi: 14200, rate: 10.25, dueDay: 18, term: 72, monthsPaid: 38 },
  { id: "personal", name: "Personal loan", lender: "Axis", principal: 350000, paid: 280000, emi: 11820, rate: 12.8, dueDay: 22, term: 36, monthsPaid: 24 },
];

function genAmortization(loan, prepay = 0) {
  const r = loan.rate / 100 / 12;
  const out = [];
  let bal = loan.principal - loan.paid;
  const startMonth = loan.monthsPaid;
  const remaining = loan.term - startMonth;
  for (let m = 0; m <= remaining; m++) {
    out.push({ month: m + startMonth, balance: Math.max(0, bal) });
    const interest = bal * r;
    const principal = loan.emi - interest;
    bal -= principal + prepay;
    if (bal <= 0) { out.push({ month: m + startMonth + 1, balance: 0 }); break; }
  }
  return out;
}

function LoanCard({ loan, onClick, expanded, onClose }) {
  const remaining = loan.principal - loan.paid;
  const pct = loan.paid / loan.principal;
  const remMonths = loan.term - loan.monthsPaid;
  const dueIn = ((loan.dueDay - new Date().getDate()) + 30) % 30 || 30;
  const urgent = dueIn <= 5;

  return (
    <div onClick={!expanded ? onClick : undefined} style={{
      background: "var(--surface)", border: `1px solid ${expanded ? "var(--accent)" : "var(--border)"}`,
      borderRadius: 12, padding: 18, cursor: expanded ? "default" : "pointer",
      transition: "all 200ms var(--ease)",
      gridColumn: expanded ? "1 / -1" : "auto"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, border: "1px solid var(--accent)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontFamily: "var(--font-mono)" }}>
              {loan.lender[0]}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{loan.name}</div>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{loan.lender} · {loan.rate}% p.a.</div>
            </div>
          </div>
        </div>
        <div className="pill" style={{ color: urgent ? "var(--warning)" : "var(--text-secondary)", borderColor: urgent ? "rgba(251,191,36,0.3)" : "var(--border)" }}>
          Due {loan.dueDay} · {dueIn}d
        </div>
      </div>

      <div className="display tnum" style={{ fontSize: 28, fontWeight: 600, marginBottom: 4 }}>{window.fmtINR(remaining, { compact: true })}</div>
      <div className="mono" style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 14 }}>
        of {window.fmtINR(loan.principal, { compact: true })} principal
      </div>

      <div style={{ height: 4, background: "var(--border)", borderRadius: 999, overflow: "hidden", marginBottom: 12 }}>
        <div style={{ width: `${pct * 100}%`, height: "100%", background: "var(--accent)" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: expanded ? "repeat(4, 1fr)" : "repeat(3, 1fr)", gap: 14, fontSize: 11 }}>
        <div>
          <div style={{ color: "var(--text-tertiary)", marginBottom: 2 }}>EMI</div>
          <div className="mono" style={{ color: "var(--text-primary)", fontSize: 13 }}>{window.fmtINR(loan.emi, { decimals: 0 })}</div>
        </div>
        <div>
          <div style={{ color: "var(--text-tertiary)", marginBottom: 2 }}>Tenure left</div>
          <div className="mono" style={{ color: "var(--text-primary)", fontSize: 13 }}>{remMonths}m</div>
        </div>
        <div>
          <div style={{ color: "var(--text-tertiary)", marginBottom: 2 }}>Paid</div>
          <div className="mono" style={{ color: "var(--text-primary)", fontSize: 13 }}>{Math.round(pct * 100)}%</div>
        </div>
        {expanded && (
          <div>
            <div style={{ color: "var(--text-tertiary)", marginBottom: 2 }}>Interest est.</div>
            <div className="mono" style={{ color: "var(--negative)", fontSize: 13 }}>{window.fmtINR(loan.emi * remMonths - remaining, { compact: true })}</div>
          </div>
        )}
      </div>

      {expanded && <LoanDrawer loan={loan} onClose={onClose} />}
    </div>
  );
}

function LoanDrawer({ loan, onClose }) {
  const [prepay, setPrepay] = useStateE(0);
  const baseline = useMemoE(() => genAmortization(loan, 0), [loan]);
  const withPrepay = useMemoE(() => genAmortization(loan, prepay), [loan, prepay]);

  const interestSaved = useMemoE(() => {
    const bMonths = baseline.length;
    const pMonths = withPrepay.length;
    return loan.emi * (bMonths - pMonths);
  }, [baseline, withPrepay, loan.emi]);

  const monthsSaved = baseline.length - withPrepay.length;

  // Build chart
  const W = 720, H = 180, pad = { l: 50, r: 12, t: 12, b: 24 };
  const maxY = baseline[0].balance;
  const maxX = baseline[baseline.length - 1].month;
  const minX = baseline[0].month;
  const xScale = (m) => pad.l + ((m - minX) / (maxX - minX)) * (W - pad.l - pad.r);
  const yScale = (v) => pad.t + (1 - v / maxY) * (H - pad.t - pad.b);
  const path = (data) => data.map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(d.month)} ${yScale(d.balance)}`).join(" ");

  return (
    <div style={{ marginTop: 22, paddingTop: 22, borderTop: "1px solid var(--border)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 500 }}>Amortization & payoff scenarios</div>
        <button className="btn-ghost btn" onClick={(e) => { e.stopPropagation(); onClose(); }}>
          <window.Icons.X size={13} /> Close
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24, alignItems: "flex-start" }}>
        <div>
          <svg width={W} height={H} style={{ display: "block" }}>
            {/* grid */}
            {[0, 0.25, 0.5, 0.75, 1].map(t => (
              <g key={t}>
                <line x1={pad.l} x2={W - pad.r} y1={pad.t + t * (H - pad.t - pad.b)} y2={pad.t + t * (H - pad.t - pad.b)} stroke="var(--border)" strokeDasharray="2 4"/>
                <text x={pad.l - 8} y={pad.t + t * (H - pad.t - pad.b) + 3} fill="var(--text-tertiary)" fontSize="10" textAnchor="end" fontFamily="var(--font-mono)">
                  {window.fmtINR(maxY * (1 - t), { compact: true }).replace("₹", "")}
                </text>
              </g>
            ))}
            <path d={path(baseline)} stroke="var(--text-tertiary)" strokeWidth="1.25" fill="none" strokeDasharray="3 3" />
            <path d={path(withPrepay)} stroke="var(--accent)" strokeWidth="1.5" fill="none" />
            <text x={pad.l} y={H - 6} fill="var(--text-tertiary)" fontSize="10" fontFamily="var(--font-mono)">M{minX}</text>
            <text x={W - pad.r} y={H - 6} fill="var(--text-tertiary)" fontSize="10" textAnchor="end" fontFamily="var(--font-mono)">M{maxX}</text>
          </svg>
          <div style={{ display: "flex", gap: 16, fontSize: 11, color: "var(--text-tertiary)", marginTop: 4 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 14, height: 1, background: "var(--text-tertiary)", borderTop: "1px dashed" }}/>Baseline</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 14, height: 2, background: "var(--accent)" }}/>With prepayment</span>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Monthly prepayment</div>
          <div className="display mono" style={{ fontSize: 28, color: "var(--accent)", marginBottom: 10 }}>
            {window.fmtINR(prepay, { decimals: 0 })}
          </div>
          <input type="range" min="0" max="50000" step="1000" value={prepay} onChange={e => setPrepay(+e.target.value)}
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", accentColor: "#7DF9FF" }} />
          <div style={{ marginTop: 16, padding: 12, border: "1px solid var(--border)", borderRadius: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12 }}>
              <span style={{ color: "var(--text-tertiary)" }}>Interest saved</span>
              <span className="mono" style={{ color: "var(--positive)" }}>{window.fmtINR(Math.max(0, interestSaved), { compact: true })}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ color: "var(--text-tertiary)" }}>Months saved</span>
              <span className="mono" style={{ color: "var(--positive)" }}>{Math.max(0, monthsSaved)}m</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EMICalendar() {
  const today = new Date();
  const days = useMemoE(() => {
    const out = [];
    for (let i = 0; i < 90; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      out.push(d);
    }
    return out;
  }, []);

  const emiByDay = (d) => LOANS.filter(l => l.dueDay === d.getDate());

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 500 }}>Next 90 days</div>
        <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>EMI calendar · 4 due dates</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(30, 1fr)", gap: 4 }}>
        {days.map((d, i) => {
          const emis = emiByDay(d);
          const has = emis.length > 0;
          return (
            <div key={i} title={has ? emis.map(e => e.name).join(", ") : ""} style={{
              aspectRatio: "1", borderRadius: 4,
              background: has ? "rgba(125,249,255,0.18)" : "rgba(255,255,255,0.03)",
              border: has ? "1px solid var(--accent-dim)" : "1px solid transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontFamily: "var(--font-mono)",
              color: has ? "var(--accent)" : "var(--text-tertiary)"
            }}>
              {d.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EMICommandCenter() {
  const [expandedId, setExpandedId] = useStateE(null);

  const totalOutstanding = LOANS.reduce((s, l) => s + (l.principal - l.paid), 0);
  const monthlyBurden = LOANS.reduce((s, l) => s + l.emi, 0);
  const interestYTD = 184200;

  return (
    <div className="page-in" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "stretch", padding: "8px 0" }}>
        <window.HeroStat
          label="Total outstanding"
          value={<window.CountUp value={totalOutstanding} format={(v) => window.fmtINR(v, { compact: true })} />}
          sub={`${LOANS.length} active loans`}
        />
        <window.HeroStat
          label="Monthly burden"
          value={<window.CountUp value={monthlyBurden} format={(v) => window.fmtINR(v, { compact: true })} />}
          sub="34% of net income"
        />
        <window.HeroStat
          label="Interest paid YTD"
          value={<span style={{ color: "var(--negative)" }}><window.CountUp value={interestYTD} format={(v) => window.fmtINR(v, { compact: true })} /></span>}
          sub="₹62k saved via prepay"
        />
        <div style={{ flex: 1, padding: "0 0 0 32px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
          <button className="btn"><window.Icons.Plus size={13} /> Log payment</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: expandedId ? "1fr" : "repeat(2, 1fr)", gap: 16 }}>
        {LOANS.map(loan => (
          <LoanCard key={loan.id} loan={loan}
            expanded={expandedId === loan.id}
            onClick={() => setExpandedId(loan.id)}
            onClose={() => setExpandedId(null)}
          />
        ))}
      </div>

      <EMICalendar />
    </div>
  );
}

window.EMICommandCenter = EMICommandCenter;
