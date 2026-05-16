/* global React */
const { useState: useStateO, useMemo: useMemoO } = React;

const AGENDA = [
  { day: "Today · Mon 27 Apr", items: [
    { time: "10:00", title: "Sprint planning", tag: "work" },
    { time: "12:30", title: "1:1 with Anita", tag: "work" },
    { time: "14:00", title: "LWC architecture review", tag: "work" },
    { time: "19:00", title: "Run — 5km", tag: "personal" },
  ]},
  { day: "Tue 28 Apr", items: [
    { time: "11:00", title: "Code review queue", tag: "work" },
    { time: "16:00", title: "Dentist appt", tag: "personal" },
  ]},
  { day: "Wed 29 Apr", items: [
    { time: "09:30", title: "All-hands", tag: "work" },
    { time: "20:00", title: "Photoshop session", tag: "personal" },
  ]},
  { day: "Thu 30 Apr", items: [
    { time: "10:00", title: "LWC interview panel", tag: "work" },
  ]},
  { day: "Fri 01 May", items: [
    { time: "—", title: "Public holiday", tag: "personal" },
  ]},
];

const TASKS = {
  backlog: [
    { id: "t1", title: "Refactor data-table component", energy: "high", tag: "LWC", due: "May 8" },
    { id: "t2", title: "Apex governor limits research", energy: "med", tag: "research" },
    { id: "t3", title: "Reorganize side-project repos", energy: "low", tag: "personal" },
    { id: "t4", title: "Sketch portfolio v2", energy: "med", tag: "design" },
  ],
  today: [
    { id: "t5", title: "Review PR #1284 — wire adapter rewrite", energy: "med", tag: "review", due: "Today" },
    { id: "t6", title: "Draft Q3 OKRs", energy: "high", tag: "work", due: "Today" },
    { id: "t7", title: "Pay HDFC EMI", energy: "low", tag: "money", due: "Today" },
  ],
  doing: [
    { id: "t8", title: "Build internal LWC docs site", energy: "high", tag: "build" },
    { id: "t9", title: "Photoshop — Goa 2024 series", energy: "med", tag: "personal" },
  ],
  done: [
    { id: "t10", title: "Onboarding doc for new hire", energy: "low", tag: "work" },
    { id: "t11", title: "File ITR-2", energy: "med", tag: "money" },
    { id: "t12", title: "Annual bike service", energy: "low", tag: "personal" },
  ],
};

const NOTES = [
  { t: "Today 09:14", text: "Lightning Web Security: investigate impact on third-party iframe usage. Block on community migration plan." },
  { t: "Yesterday 22:08", text: "Idea — habit tracker on the watch face? Complications API." },
  { t: "Yesterday 18:42", text: "Photo: Ulsoor lake at golden hour. Edit pass needed." },
];

const ENERGY_COLOR = { low: "var(--text-tertiary)", med: "var(--accent)", high: "var(--warning)" };

function TaskCard({ task }) {
  return (
    <div style={{
      background: "var(--surface-elevated)", border: "1px solid var(--border)",
      borderRadius: 8, padding: 10,
      display: "flex", flexDirection: "column", gap: 8,
      cursor: "grab"
    }}>
      <div style={{ fontSize: 13, lineHeight: 1.4, color: "var(--text-primary)" }}>{task.title}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>#{task.tag}</span>
          {task.due && <span style={{ fontSize: 10, color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>· {task.due}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }} title={`${task.energy} energy`}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              width: 4, height: 8, borderRadius: 1,
              background: i <= ({ low: 1, med: 2, high: 3 })[task.energy] ? ENERGY_COLOR[task.energy] : "var(--border)"
            }}/>
          ))}
        </div>
      </div>
    </div>
  );
}

function KanbanColumn({ id, title, tasks, count }) {
  const accent = id === "doing";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: accent ? "var(--accent)" : "var(--text-secondary)" }}>{title}</span>
          <span className="mono" style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{count}</span>
        </div>
        <button style={{ color: "var(--text-tertiary)" }}><window.Icons.Plus size={13} /></button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 8, background: "rgba(255,255,255,0.015)", border: "1px solid var(--border)", borderRadius: 10, minHeight: 120, flex: 1 }}>
        {tasks.map(t => <TaskCard key={t.id} task={t} />)}
      </div>
    </div>
  );
}

function Organizer() {
  const [note, setNote] = useStateO("");

  return (
    <div className="page-in" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "stretch", padding: "8px 0" }}>
        <window.HeroStat label="Today" value={<window.CountUp value={3} format={(v) => Math.round(v).toString()} />} sub="open · 1 done" />
        <window.HeroStat label="Doing" value={<window.CountUp value={2} format={(v) => Math.round(v).toString()} />} sub="active focus" />
        <window.HeroStat label="Backlog" value={<window.CountUp value={4} format={(v) => Math.round(v).toString()} />} sub="grooming Friday" />
        <div style={{ flex: 1, padding: "0 0 0 32px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, flexWrap: "nowrap", whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 11, color: "var(--text-tertiary)", whiteSpace: "nowrap" }}><span className="kbd">N</span> capture</span>
          <button className="btn" style={{ whiteSpace: "nowrap", flexShrink: 0 }}><window.Icons.Plus size={13} /> New task</button>
        </div>
      </div>

      <div className="organizer-grid" style={{ alignItems: "stretch" }}>
        {/* Agenda */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", gap: 14, maxHeight: 640, overflow: "auto" }}>
          <div style={{ fontSize: 12, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>Agenda</span>
            <span style={{ fontSize: 10, color: "var(--text-tertiary)" }}>Next 7d</span>
          </div>
          {AGENDA.map((day, i) => (
            <div key={i}>
              <div style={{ fontSize: 10, color: i === 0 ? "var(--accent)" : "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{day.day}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {day.items.map((it, j) => (
                  <div key={j} style={{ display: "flex", gap: 10, fontSize: 12, padding: "4px 0" }}>
                    <span className="mono" style={{ color: "var(--text-tertiary)", minWidth: 36 }}>{it.time}</span>
                    <span style={{ color: "var(--text-primary)", flex: 1 }}>{it.title}</span>
                    <span style={{ width: 4, height: 4, borderRadius: 999, background: it.tag === "work" ? "var(--accent)" : "var(--text-tertiary)", marginTop: 7 }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Kanban */}
        <div className="kanban-grid">
          <KanbanColumn id="backlog" title="Backlog" tasks={TASKS.backlog} count={TASKS.backlog.length} />
          <KanbanColumn id="today" title="Today" tasks={TASKS.today} count={TASKS.today.length} />
          <KanbanColumn id="doing" title="Doing" tasks={TASKS.doing} count={TASKS.doing.length} />
          <KanbanColumn id="done" title="Done" tasks={TASKS.done} count={TASKS.done.length} />
        </div>

        {/* Notes */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", gap: 12, maxHeight: 640 }}>
          <div style={{ fontSize: 12, fontWeight: 500, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Quick capture</span>
            <span className="kbd">N</span>
          </div>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Drop a thought…"
            style={{
              width: "100%", minHeight: 80, padding: 10, fontSize: 13,
              background: "var(--surface-elevated)", border: "1px solid var(--border)",
              borderRadius: 8, resize: "vertical", lineHeight: 1.5,
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 10, overflow: "auto" }}>
            {NOTES.map((n, i) => (
              <div key={i} style={{ borderLeft: "1px solid var(--border)", paddingLeft: 10 }}>
                <div className="mono" style={{ fontSize: 10, color: "var(--text-tertiary)", marginBottom: 4 }}>{n.t}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>{n.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

window.Organizer = Organizer;
