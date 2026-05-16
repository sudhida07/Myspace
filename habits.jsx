/* global React */
const { useState: useStateH, useMemo: useMemoH } = React;

const TIME_BLOCKS = [
  { id: "morning", label: "Morning", time: "05:30 – 09:00" },
  { id: "forenoon", label: "Forenoon", time: "09:00 – 12:00" },
  { id: "afternoon", label: "Afternoon", time: "12:00 – 16:00" },
  { id: "evening", label: "Evening", time: "16:00 – 19:00" },
  { id: "night", label: "Night", time: "19:00 – 23:00" },
  { id: "anytime", label: "Anytime", time: "—" },
];

const DAILY_HABITS = [
  { id: "h1", block: "morning", label: "Wake by 5:45", done: true },
  { id: "h2", block: "morning", label: "500ml water", done: true },
  { id: "h3", block: "morning", label: "10-min meditation", done: true },
  { id: "h4", block: "morning", label: "Stretch / yoga", done: false },
  { id: "h5", block: "morning", label: "Journal — 3 lines", done: true },

  { id: "h6", block: "forenoon", label: "LWC deep-work block", done: true },
  { id: "h7", block: "forenoon", label: "Code review queue", done: true },
  { id: "h8", block: "forenoon", label: "Inbox zero", done: false },

  { id: "h9", block: "afternoon", label: "Walk after lunch", done: true },
  { id: "h10", block: "afternoon", label: "1:1s & syncs", done: true },
  { id: "h11", block: "afternoon", label: "Read tech article", done: false },

  { id: "h12", block: "evening", label: "Workout — 45m", done: false },
  { id: "h13", block: "evening", label: "Family time", done: false },
  { id: "h14", block: "evening", label: "No screens 18:00", done: false },

  { id: "h15", block: "night", label: "Plan tomorrow — 5m", done: false },
  { id: "h16", block: "night", label: "Read — 20m", done: false },
  { id: "h17", block: "night", label: "Lights out by 22:30", done: false },

  { id: "h18", block: "anytime", label: "10k steps", done: false, progress: 0.62 },
  { id: "h19", block: "anytime", label: "2L water", done: false, progress: 0.4 },
  { id: "h20", block: "anytime", label: "No sugar", done: true },
  { id: "h21", block: "anytime", label: "No alcohol", done: true },
  { id: "h22", block: "anytime", label: "Track expenses", done: true },
];

const WEEKLY_HABITS = [
  { id: "w1", label: "Long run — 8km", done: 3, target: 1 },
  { id: "w2", label: "Photoshop project", done: 2, target: 1 },
  { id: "w3", label: "Read 1 chapter", done: 4, target: 2 },
  { id: "w4", label: "Call parents", done: 1, target: 2 },
  { id: "w5", label: "Date night", done: 1, target: 1 },
  { id: "w6", label: "Review portfolio", done: 1, target: 1 },
  { id: "w7", label: "Sunday meal prep", done: 0, target: 1 },
  { id: "w8", label: "Side-project commit", done: 5, target: 3 },
  { id: "w9", label: "House deep-clean", done: 0, target: 1 },
  { id: "w10", label: "Photography walk", done: 1, target: 1 },
];

const MONTHLY_GOALS = [
  { label: "Run 100 km", progress: 0.74 },
  { label: "Read 3 books", progress: 0.66 },
  { label: "10 Photoshop edits", progress: 0.5 },
  { label: "Apex certification prep", progress: 0.42 },
  { label: "Save ₹80,000", progress: 0.88 },
  { label: "12 LWC blog posts", progress: 0.33 },
];

function HabitCard({ h, onToggle }) {
  const hasProgress = h.progress != null;
  return (
    <button
      onClick={onToggle}
      style={{
        display: "flex", alignItems: "center", gap: 10, width: "100%",
        padding: "10px 12px", borderRadius: 8,
        background: h.done ? "rgba(125,249,255,0.04)" : "var(--surface)",
        border: `1px solid ${h.done ? "rgba(125,249,255,0.18)" : "var(--border)"}`,
        textAlign: "left", transition: "all 200ms var(--ease)",
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: 5, flexShrink: 0,
        border: `1px solid ${h.done ? "var(--accent)" : "var(--border)"}`,
        background: h.done ? "var(--accent)" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#08090B"
      }}>
        {h.done && <window.Icons.Check size={11} strokeWidth={3} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: h.done ? "var(--text-secondary)" : "var(--text-primary)", textDecoration: h.done ? "line-through" : "none", textDecorationColor: "var(--text-tertiary)" }}>{h.label}</div>
        {hasProgress && (
          <div style={{ marginTop: 6, height: 2, background: "var(--border)", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ width: `${h.progress * 100}%`, height: "100%", background: "var(--accent)" }} />
          </div>
        )}
      </div>
    </button>
  );
}

function Heatmap({ days }) {
  // 53 weeks × 7 rows
  const cells = useMemoH(() => {
    const out = [];
    for (let w = 0; w < 53; w++) {
      for (let d = 0; d < 7; d++) {
        const idx = w * 7 + d;
        if (idx >= 365) continue;
        const v = days[idx] ?? 0;
        out.push({ w, d, v, idx });
      }
    }
    return out;
  }, [days]);
  const cell = 11, gap = 3;
  const colorFor = (v) => {
    if (v === 0) return "rgba(255,255,255,0.04)";
    if (v < 0.5) return "rgba(125,249,255,0.18)";
    if (v < 0.85) return "rgba(125,249,255,0.45)";
    return "rgba(125,249,255,0.95)";
  };
  return (
    <svg width={53 * (cell + gap)} height={7 * (cell + gap)}>
      {cells.map(c => (
        <rect key={c.idx}
          x={c.w * (cell + gap)} y={c.d * (cell + gap)}
          width={cell} height={cell} rx={2}
          fill={colorFor(c.v)}
        />
      ))}
    </svg>
  );
}

function Ring({ pct, size = 56, label, value }) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth="3" />
          <circle cx={size/2} cy={size/2} r={r} fill="none"
            stroke="var(--accent)" strokeWidth="3"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - pct)}
            strokeLinecap="round"
            transform={`rotate(-90 ${size/2} ${size/2})`}
          />
        </svg>
        <div className="mono" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>{Math.round(pct*100)}</div>
      </div>
      <div style={{ fontSize: 10, color: "var(--text-tertiary)", textAlign: "center", lineHeight: 1.3, maxWidth: 80 }}>{label}</div>
    </div>
  );
}

function HabitTracker() {
  const [habits, setHabits] = useStateH(DAILY_HABITS);
  const toggle = (id) => setHabits(prev => prev.map(h => h.id === id ? { ...h, done: !h.done } : h));
  const completedToday = habits.filter(h => h.done).length;
  const totalToday = habits.length;
  const completionPct = completedToday / totalToday;

  // Generate 365 days of mock heatmap data, with last 60 days denser
  const heatmapDays = useMemoH(() => {
    const arr = [];
    for (let i = 0; i < 365; i++) {
      const recency = i / 365;
      const r = Math.random();
      let v = 0;
      if (r < 0.15) v = 0;
      else if (r < 0.45) v = 0.3 + Math.random() * 0.3;
      else if (r < 0.85) v = 0.6 + Math.random() * 0.3;
      else v = 0.9 + Math.random() * 0.1;
      if (recency > 0.85) v = Math.min(1, v + 0.2); // recent days denser
      arr.push(v);
    }
    arr[arr.length - 1] = completionPct; // today
    return arr;
  }, [completionPct]);

  return (
    <div className="page-in" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Hero */}
      <div style={{ display: "flex", alignItems: "stretch", padding: "8px 0" }}>
        <window.HeroStat
          label="Today"
          value={<><window.CountUp value={completedToday} format={(v) => Math.round(v).toString()} /><span style={{ color: "var(--text-tertiary)", fontSize: 28 }}> / {totalToday}</span></>}
          sub={`${Math.round(completionPct * 100)}% complete`}
        />
        <window.HeroStat
          label="Current streak"
          value={<span style={{ color: "var(--accent)" }}><window.CountUp value={42} format={(v) => Math.round(v).toString()} /> <span style={{ fontSize: 20, color: "var(--text-secondary)" }}>days</span></span>}
          sub="Personal best: 67 days"
        />
        <window.HeroStat
          label="This week"
          value={<><window.CountUp value={6} format={(v) => Math.round(v).toString()} /><span style={{ color: "var(--text-tertiary)", fontSize: 28 }}> / 7</span></>}
          sub="6 perfect days this week"
        />
        <div style={{ flex: 1, padding: "0 0 0 32px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
          <button className="btn"><window.Icons.Check size={13} /> Mark today</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>
        {/* Time-block lanes */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {TIME_BLOCKS.map(tb => {
            const items = habits.filter(h => h.block === tb.id);
            const done = items.filter(h => h.done).length;
            return (
              <div key={tb.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>{tb.label}</div>
                    <div className="mono" style={{ fontSize: 10, color: "var(--text-tertiary)" }}>{tb.time}</div>
                  </div>
                  <div className="mono" style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{done}/{items.length}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {items.map(h => <HabitCard key={h.id} h={h} onToggle={() => toggle(h.id)} />)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right rail */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 12 }}>Weekly</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {WEEKLY_HABITS.map(w => {
                const hit = w.done >= w.target;
                return (
                  <div key={w.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
                    <span style={{ color: hit ? "var(--text-secondary)" : "var(--text-primary)", textDecoration: hit ? "line-through" : "none" }}>{w.label}</span>
                    <span className="mono" style={{ fontSize: 11, color: hit ? "var(--positive)" : "var(--text-tertiary)" }}>{w.done}/{w.target}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 14 }}>Monthly goals · April</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {MONTHLY_GOALS.map((g, i) => <Ring key={i} pct={g.progress} label={g.label} />)}
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500 }}>365-day completion</div>
            <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 2 }}>282 perfect days · 64 above 80% · longest streak 67d</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "var(--text-tertiary)" }}>
            Less
            {[0, 0.4, 0.7, 0.95].map(v => (
              <div key={v} style={{ width: 11, height: 11, borderRadius: 2, background: v === 0 ? "rgba(255,255,255,0.04)" : v < 0.5 ? "rgba(125,249,255,0.18)" : v < 0.85 ? "rgba(125,249,255,0.45)" : "rgba(125,249,255,0.95)" }} />
            ))}
            More
          </div>
        </div>
        <div style={{ overflow: "auto" }}>
          <Heatmap days={heatmapDays} />
        </div>
      </div>
    </div>
  );
}

window.HabitTracker = HabitTracker;
