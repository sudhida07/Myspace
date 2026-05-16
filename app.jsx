/* global React */
const { useState: useStateA, useEffect: useEffectA } = React;

const MODULES = [
  { id: "trading", label: "Trading", icon: "TrendUp", title: "Trading Portfolio", action: { label: "Add trade", icon: "Plus" } },
  { id: "habits", label: "Habits", icon: "Target", title: "Habit Tracker", action: { label: "Mark today", icon: "Check" } },
  { id: "emi", label: "EMI", icon: "Wallet", title: "EMI Command Center", action: { label: "Log payment", icon: "Plus" } },
  { id: "organizer", label: "Organizer", icon: "Inbox", title: "Organizer", action: { label: "New task", icon: "Plus" } },
  { id: "profile", label: "Profile", icon: "User", title: "Job Profile", action: { label: "Resume", icon: "Download" } },
  { id: "gallery", label: "Gallery", icon: "Image", title: "Photo Gallery", action: { label: "Upload", icon: "Plus" } },
];

const STATUS_DOTS = {
  habits: { color: "var(--positive)", label: "All morning habits done" },
  emi: { color: "var(--warning)", label: "HDFC EMI due in 3 days" },
  trading: { color: "var(--accent)", label: "Markets open" },
};

function Sidebar({ active, setActive, collapsed, setCollapsed, openPalette }) {
  const W = collapsed ? 56 : 220;
  const I = window.Icons;
  return (
    <aside className="glass" style={{
      width: W, flexShrink: 0,
      display: "flex", flexDirection: "column",
      transition: "width 200ms var(--ease)",
      borderRadius: 0,
      borderLeft: "none", borderTop: "none", borderBottom: "none",
    }}>
      {/* Header */}
      <div style={{ padding: collapsed ? "16px 12px" : 16, display: "flex", alignItems: "center", gap: 12, height: 56 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 6,
          border: "1px solid var(--accent)", color: "var(--accent)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600,
          flexShrink: 0,
        }}>SB</div>
        {!collapsed && (
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>Sudheer Bhat</div>
            <div style={{ fontSize: 10, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Command Center</div>
          </div>
        )}
      </div>

      {/* Search trigger */}
      <div style={{ padding: collapsed ? "0 12px 12px" : "0 12px 12px" }}>
        <button onClick={openPalette} style={{
          width: "100%", height: 32,
          background: "rgba(255,255,255,0.02)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          display: "flex", alignItems: "center", gap: 10,
          padding: collapsed ? 0 : "0 10px",
          justifyContent: collapsed ? "center" : "flex-start",
          color: "var(--text-tertiary)",
          fontSize: 12,
        }}>
          <I.Search size={13} />
          {!collapsed && <>
            <span style={{ flex: 1, textAlign: "left" }}>Search…</span>
            <span className="kbd">⌘K</span>
          </>}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "4px 12px", display: "flex", flexDirection: "column", gap: 2, overflow: "auto" }}>
        {MODULES.map(m => {
          const Ico = I[m.icon];
          const status = STATUS_DOTS[m.id];
          const isActive = active === m.id;
          return (
            <button key={m.id} onClick={() => setActive(m.id)} title={collapsed ? m.label : ""} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: collapsed ? "8px 0" : "8px 10px",
              justifyContent: collapsed ? "center" : "flex-start",
              borderRadius: 8,
              color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
              background: isActive ? "rgba(125,249,255,0.06)" : "transparent",
              border: `1px solid ${isActive ? "rgba(125,249,255,0.2)" : "transparent"}`,
              fontSize: 13, fontWeight: 500,
              transition: "all 120ms var(--ease)",
              position: "relative",
            }}>
              <Ico size={15} />
              {!collapsed && <span style={{ flex: 1, textAlign: "left" }}>{m.label}</span>}
              {status && (
                <span title={status.label} style={{
                  width: 6, height: 6, borderRadius: 999,
                  background: status.color,
                  position: collapsed ? "absolute" : "static",
                  top: 8, right: 8,
                }} className="pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: 12, borderTop: "1px solid var(--border)", display: "flex", flexDirection: collapsed ? "column" : "row", gap: 4, alignItems: "center", justifyContent: "space-between" }}>
        <button className="btn-ghost btn" style={{ height: 28, padding: "0 8px" }}><I.Sun size={13} /></button>
        <button className="btn-ghost btn" style={{ height: 28, padding: "0 8px" }}><I.Settings size={13} /></button>
        <button onClick={() => setCollapsed(!collapsed)} className="btn-ghost btn" style={{ height: 28, padding: "0 8px" }}>
          {collapsed ? <I.ChevronRight size={13} /> : <I.ChevronLeft size={13} />}
        </button>
      </div>
    </aside>
  );
}

function TopBar({ module, openPalette }) {
  const I = window.Icons;
  const Ico = I[module.action.icon];
  return (
    <div style={{
      height: 40, flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px",
      gap: 12,
      borderBottom: "1px solid var(--border)",
      background: "rgba(8,9,11,0.7)",
      backdropFilter: "blur(8px)",
      position: "sticky", top: 0, zIndex: 10,
      whiteSpace: "nowrap",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, overflow: "hidden" }}>
        <span style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{module.title}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <window.ISTClock />
        <button className="btn" style={{ flexShrink: 0, whiteSpace: "nowrap" }}>
          <Ico size={13} /> {module.action.label}
        </button>
      </div>
    </div>
  );
}

// Command palette
function CommandPalette({ open, onClose, setActive }) {
  const [q, setQ] = useStateA("");
  const I = window.Icons;
  const items = [
    ...MODULES.map(m => ({ kind: "Navigate", label: `Go to ${m.label}`, icon: m.icon, action: () => setActive(m.id) })),
    { kind: "Action", label: "Mark all morning habits", icon: "Check", action: () => setActive("habits") },
    { kind: "Action", label: "Add trade", icon: "Plus", action: () => setActive("trading") },
    { kind: "Action", label: "New task", icon: "Plus", action: () => setActive("organizer") },
    { kind: "Action", label: "Log EMI payment", icon: "Wallet", action: () => setActive("emi") },
    { kind: "Action", label: "Capture note", icon: "Inbox", action: () => setActive("organizer") },
    { kind: "Action", label: "Download resume", icon: "Download", action: () => setActive("profile") },
  ];
  const filtered = q ? items.filter(i => i.label.toLowerCase().includes(q.toLowerCase())) : items;

  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(8,9,11,0.6)",
      backdropFilter: "blur(4px)",
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      paddingTop: "12vh",
    }}>
      <div onClick={e => e.stopPropagation()} className="glass" style={{
        width: 560, maxWidth: "calc(100vw - 32px)",
        borderRadius: 16, overflow: "hidden",
        animation: "pageIn 200ms var(--ease)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
          <I.Search size={15} />
          <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Jump anywhere, run quick actions…" style={{ flex: 1, fontSize: 14 }} />
          <span className="kbd">esc</span>
        </div>
        <div style={{ maxHeight: 380, overflow: "auto", padding: 8 }}>
          {filtered.length === 0 && (
            <div style={{ padding: "32px 12px", textAlign: "center", fontSize: 12, color: "var(--text-tertiary)" }}>
              No matches
            </div>
          )}
          {filtered.map((it, i) => {
            const Ico = I[it.icon];
            return (
              <button key={i} onClick={() => { it.action(); onClose(); }} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: "10px 12px", borderRadius: 8,
                color: "var(--text-primary)", fontSize: 13,
                textAlign: "left",
              }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                 onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <Ico size={14} />
                <span style={{ flex: 1 }}>{it.label}</span>
                <span style={{ fontSize: 10, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{it.kind}</span>
              </button>
            );
          })}
        </div>
        <div style={{ padding: "10px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: 16, fontSize: 11, color: "var(--text-tertiary)" }}>
          <span><span className="kbd">↑↓</span> navigate</span>
          <span><span className="kbd">↵</span> select</span>
          <span><span className="kbd">esc</span> close</span>
        </div>
      </div>
    </div>
  );
}

// Action history strip
function ActionHistory() {
  const [open, setOpen] = useStateA(true);
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", bottom: 12, right: 12,
      display: "flex", alignItems: "center", gap: 10,
      padding: "5px 10px 5px 12px", borderRadius: 999,
      background: "rgba(17,19,21,0.85)",
      backdropFilter: "blur(12px)",
      border: "1px solid var(--border)",
      fontSize: 11, color: "var(--text-tertiary)",
      zIndex: 50, maxWidth: "calc(100vw - 24px)", whiteSpace: "nowrap", overflow: "hidden",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--positive)", flexShrink: 0 }} className="pulse" />
      <span className="mono" style={{ overflow: "hidden", textOverflow: "ellipsis" }}>INFY +10 @ ₹1660 · 10:42</span>
      <button onClick={() => setOpen(false)} style={{ color: "var(--text-tertiary)", display: "flex", flexShrink: 0 }}>
        <window.Icons.X size={11} />
      </button>
    </div>
  );
}

function App() {
  const [active, setActive] = useStateA("trading");
  const [collapsed, setCollapsed] = useStateA(false);
  const [paletteOpen, setPaletteOpen] = useStateA(false);

  useEffectA(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen(v => !v);
      }
      if (e.key === "Escape") setPaletteOpen(false);
      // g+letter shortcuts
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (window.__lastG && Date.now() - window.__lastG < 800) {
        const map = { t: "trading", h: "habits", e: "emi", o: "organizer", p: "profile", g: "gallery" };
        if (map[e.key]) setActive(map[e.key]);
        window.__lastG = 0;
      }
      if (e.key === "g") window.__lastG = Date.now();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const module = MODULES.find(m => m.id === active);

  const Page = {
    trading: window.TradingPortfolio,
    habits: window.HabitTracker,
    emi: window.EMICommandCenter,
    organizer: window.Organizer,
    profile: window.JobProfile,
    gallery: window.PhotoGallery,
  }[active];

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg)" }}>
      <Sidebar active={active} setActive={setActive} collapsed={collapsed} setCollapsed={setCollapsed} openPalette={() => setPaletteOpen(true)} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <TopBar module={module} openPalette={() => setPaletteOpen(true)} />
        <main key={active} className="page-in" style={{ flex: 1, overflow: "auto", padding: "24px 32px 80px", maxWidth: 1440, margin: "0 auto", width: "100%" }}>
          {Page ? <Page /> : <div style={{ color: "var(--text-tertiary)" }}>Loading…</div>}
        </main>
      </div>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} setActive={setActive} />
      <ActionHistory />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
