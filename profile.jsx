/* global React */
const { useState: useStateP } = React;

const SKILLS = [
  { name: "Salesforce LWC", level: 0.95, years: 6 },
  { name: "Apex", level: 0.92, years: 7 },
  { name: "JavaScript / TS", level: 0.9, years: 9 },
  { name: "SOQL / SOSL", level: 0.85, years: 7 },
  { name: "Aura Framework", level: 0.78, years: 5 },
  { name: "Lightning Design System", level: 0.82, years: 5 },
  { name: "REST / Integration", level: 0.84, years: 6 },
  { name: "Node.js", level: 0.7, years: 4 },
  { name: "React", level: 0.74, years: 3 },
  { name: "System design", level: 0.72, years: 4 },
];

const EXPERIENCE = [
  {
    company: "Salesforce", role: "Software Development Lead",
    period: "2022 — Present", location: "Bangalore",
    notes: ["Lead a 6-engineer LWC platform team", "Owner of internal data-table and form components used by 2,400+ devs", "Drove migration to LWS for 380 components"]
  },
  {
    company: "Cognizant", role: "Senior LWC Engineer",
    period: "2019 — 2022", location: "Bangalore",
    notes: ["Built Salesforce Service Cloud customizations for 4 enterprise clients", "Mentored 12 juniors through cohort program"]
  },
  {
    company: "Infosys", role: "Software Engineer",
    period: "2016 — 2019", location: "Mysore → Bangalore",
    notes: ["Apex backend for high-volume retail org", "First production Lightning components in 2017"]
  },
];

const PROJECTS = [
  { title: "Command Center", sub: "Personal OS — this site", tag: "React + Tailwind" },
  { title: "Habit OS", sub: "365-day tracker with watch complications", tag: "Swift + iOS" },
  { title: "EMI Planner", sub: "Prepayment scenario tool", tag: "TypeScript" },
  { title: "Goa 2024", sub: "Photoshop edit series — 18 photos", tag: "Photography" },
];

function JobProfile() {
  return (
    <div className="page-in" style={{ display: "flex", flexDirection: "column", gap: 48, maxWidth: 980, margin: "0 auto" }}>
      {/* Hero */}
      <div style={{ position: "relative", padding: "32px 0 8px" }}>
        <button className="btn btn-primary" style={{ position: "absolute", top: 32, right: 0 }}>
          <window.Icons.Download size={13} /> Resume
        </button>
        <div style={{ fontSize: 11, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Profile</div>
        <h1 className="display" style={{ fontSize: 56, fontWeight: 600, lineHeight: 1.05, marginBottom: 8 }}>Sudheer Bhat</h1>
        <div style={{ fontSize: 20, color: "var(--text-secondary)", marginBottom: 24, fontWeight: 400 }}>
          Software Development Lead — Salesforce LWC specialist
        </div>
        <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 640, marginBottom: 24 }}>
          I build the components other engineers reach for. Nine years across Apex, LWC, and the Lightning platform — currently leading the team behind Salesforce's internal component library. Off-hours: photography, distance running, and over-engineering my own tools.
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <span className="pill"><window.Icons.MapPin size={11} /> Bangalore, IN</span>
          <span className="pill"><window.Icons.Mail size={11} /> sudheer@bhat.dev</span>
          <span className="pill"><window.Icons.Github size={11} /> github.com/sudheerbhat</span>
          <span className="pill"><window.Icons.Linkedin size={11} /> in/sudheerbhat</span>
        </div>
      </div>

      {/* Skills */}
      <Section title="Skills" sub="Mastery, not lists">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24, columnGap: 48 }}>
          {SKILLS.map((s, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{s.name}</span>
                <span className="mono" style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{s.years}y</span>
              </div>
              <div style={{ height: 2, background: "var(--border)", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ width: `${s.level * 100}%`, height: "100%", background: s.level > 0.85 ? "var(--accent)" : "var(--text-secondary)" }} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Experience */}
      <Section title="Experience" sub="9 years · 3 companies">
        <div style={{ position: "relative", paddingLeft: 32 }}>
          <div style={{ position: "absolute", left: 13, top: 8, bottom: 8, width: 1, background: "var(--border)" }} />
          {EXPERIENCE.map((e, i) => (
            <div key={i} style={{ position: "relative", marginBottom: 32 }}>
              <div style={{
                position: "absolute", left: -32, top: 2,
                width: 28, height: 28, borderRadius: 6,
                border: "1px solid var(--accent)", color: "var(--accent)",
                background: "var(--bg)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500
              }}>{e.company.slice(0, 2).toUpperCase()}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 600 }}>{e.role}</span>
                <span className="mono" style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{e.period}</span>
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>{e.company} · {e.location}</div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                {e.notes.map((n, j) => (
                  <li key={j} style={{ display: "flex", gap: 10, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    <span style={{ color: "var(--text-tertiary)", marginTop: 1 }}>—</span>
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Projects */}
      <Section title="Projects" sub="Side work">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {PROJECTS.map((p, i) => (
            <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              {/* Placeholder thumbnail */}
              <div style={{
                aspectRatio: "16/9",
                background: `repeating-linear-gradient(45deg, rgba(125,249,255,0.04) 0 6px, transparent 6px 12px), var(--surface-elevated)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                borderBottom: "1px solid var(--border)",
                color: "var(--text-tertiary)", fontFamily: "var(--font-mono)", fontSize: 11
              }}>
                project-{p.title.toLowerCase().replace(/\s/g, "-")}.png
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{p.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{p.sub}</div>
                <div className="mono" style={{ fontSize: 10, color: "var(--text-tertiary)", marginTop: 10 }}>{p.tag}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, sub, children }) {
  return (
    <section>
      <div style={{ marginBottom: 24, paddingBottom: 12, borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <h2 style={{ fontSize: 13, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" }}>{title}</h2>
        </div>
        {sub && <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{sub}</span>}
      </div>
      {children}
    </section>
  );
}

window.JobProfile = JobProfile;
