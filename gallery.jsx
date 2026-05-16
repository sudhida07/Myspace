/* global React */
const { useState: useStateG, useMemo: useMemoG } = React;

const PHOTOS = [
  { id: 1, title: "Ulsoor lake, golden hour", tag: "Travel", h: 280, hue: 28, edits: 12, camera: "Sony A7 III", lens: "55mm f/1.8", iso: 200, exp: "1/640", aperture: "f/2.8" },
  { id: 2, title: "Shop window — Chickpet", tag: "Photoshop", h: 360, hue: 220, edits: 47, camera: "Sony A7 III", lens: "35mm f/1.4", iso: 800, exp: "1/125", aperture: "f/1.8" },
  { id: 3, title: "Anaaya — first birthday", tag: "Portraits", h: 420, hue: 12, edits: 23, camera: "Sony A7 III", lens: "85mm f/1.8", iso: 400, exp: "1/200", aperture: "f/2.0" },
  { id: 4, title: "Gokarna, monsoon", tag: "Travel", h: 320, hue: 195, edits: 18, camera: "Sony A7 III", lens: "16-35mm", iso: 100, exp: "1/250", aperture: "f/8" },
  { id: 5, title: "Studio composite #4", tag: "Photoshop", h: 460, hue: 280, edits: 84, camera: "Composite", lens: "—", iso: 0, exp: "—", aperture: "—" },
  { id: 6, title: "Friend at Cubbon", tag: "Portraits", h: 300, hue: 60, edits: 9, camera: "Sony A7 III", lens: "55mm f/1.8", iso: 200, exp: "1/500", aperture: "f/2.0" },
  { id: 7, title: "Hampi ruins, dawn", tag: "Travel", h: 340, hue: 18, edits: 14, camera: "Sony A7 III", lens: "24mm f/1.4", iso: 200, exp: "1/320", aperture: "f/4" },
  { id: 8, title: "Surreal corridor", tag: "Photoshop", h: 480, hue: 240, edits: 62, camera: "Composite", lens: "—", iso: 0, exp: "—", aperture: "—" },
  { id: 9, title: "Self, mirror series", tag: "Portraits", h: 360, hue: 320, edits: 31, camera: "Sony A7 III", lens: "35mm f/1.4", iso: 1600, exp: "1/80", aperture: "f/1.8" },
  { id: 10, title: "Coorg, fog at 6am", tag: "Travel", h: 280, hue: 175, edits: 7, camera: "Sony A7 III", lens: "70-200mm", iso: 800, exp: "1/200", aperture: "f/4" },
  { id: 11, title: "Texture study II", tag: "Photoshop", h: 380, hue: 100, edits: 28, camera: "Composite", lens: "—", iso: 0, exp: "—", aperture: "—" },
  { id: 12, title: "Wedding — Pooja & Rohit", tag: "Portraits", h: 420, hue: 340, edits: 41, camera: "Sony A7 III", lens: "85mm f/1.8", iso: 1000, exp: "1/160", aperture: "f/2.2" },
];

const FILTERS = ["All", "Photoshop", "Travel", "Portraits"];

function Tile({ p, onOpen }) {
  return (
    <div onClick={onOpen} style={{
      breakInside: "avoid",
      marginBottom: 12,
      cursor: "pointer",
      borderRadius: 10,
      overflow: "hidden",
      position: "relative",
      border: "1px solid var(--border)",
      background: "var(--surface)",
    }}>
      <div style={{
        height: p.h,
        background: `linear-gradient(${130 + (p.id * 17) % 60}deg,
          oklch(0.${20 + (p.id * 7) % 30} 0.06 ${p.hue}),
          oklch(0.${35 + (p.id * 11) % 30} 0.10 ${(p.hue + 40) % 360}),
          oklch(0.${15 + (p.id * 5) % 20} 0.04 ${(p.hue + 80) % 360}))`,
        position: "relative",
      }}>
        {/* faux subject — abstract shapes that won't read as real photos */}
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.3 }}>
          <defs>
            <pattern id={`pat-${p.id}`} width="40" height="40" patternUnits="userSpaceOnUse">
              <line x1="0" y1="20" x2="40" y2="20" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#pat-${p.id})`} />
        </svg>
      </div>
      <div className="hover-overlay" style={{
        position: "absolute", left: 0, right: 0, bottom: 0,
        padding: "10px 14px",
        background: "linear-gradient(to top, rgba(8,9,11,0.92), transparent)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: 12, fontWeight: 500 }}>{p.title}</span>
        <span className="mono" style={{ fontSize: 10, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{p.tag}</span>
      </div>
    </div>
  );
}

function Lightbox({ p, onClose, onPrev, onNext }) {
  if (!p) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "#000",
      zIndex: 100,
      display: "flex", flexDirection: "column",
      padding: 64,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 500 }}>{p.title}</div>
          <div className="mono" style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{p.tag}</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-ghost btn" onClick={(e) => { e.stopPropagation(); onPrev(); }}><window.Icons.ChevronLeft size={14}/></button>
          <button className="btn-ghost btn" onClick={(e) => { e.stopPropagation(); onNext(); }}><window.Icons.ChevronRight size={14}/></button>
          <button className="btn-ghost btn" onClick={(e) => { e.stopPropagation(); onClose(); }}><window.Icons.X size={14}/></button>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", gap: 32, minHeight: 0 }}>
        <div onClick={e => e.stopPropagation()} style={{
          flex: 1,
          background: `linear-gradient(${130 + (p.id * 17) % 60}deg,
            oklch(0.${20 + (p.id * 7) % 30} 0.06 ${p.hue}),
            oklch(0.${35 + (p.id * 11) % 30} 0.10 ${(p.hue + 40) % 360}),
            oklch(0.${15 + (p.id * 5) % 20} 0.04 ${(p.hue + 80) % 360}))`,
          borderRadius: 4,
        }} />
        <div onClick={e => e.stopPropagation()} style={{ width: 260, display: "flex", flexDirection: "column", gap: 20, fontSize: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>EXIF</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                ["Camera", p.camera],
                ["Lens", p.lens],
                ["Aperture", p.aperture],
                ["Shutter", p.exp],
                ["ISO", p.iso || "—"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-tertiary)" }}>{k}</span>
                  <span className="mono" style={{ color: "var(--text-primary)" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Edit history</div>
            <div className="mono" style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.7 }}>
              {p.edits} layers · last edit 3d ago
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: "var(--text-tertiary)", lineHeight: 1.6 }}>
              Dodge & burn pass · color grade · texture overlay · selective sharpen.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhotoGallery() {
  const [filter, setFilter] = useStateG("All");
  const [openId, setOpenId] = useStateG(null);
  const visible = useMemoG(() => PHOTOS.filter(p => filter === "All" || p.tag === filter), [filter]);
  const openIdx = visible.findIndex(p => p.id === openId);
  const open = openIdx >= 0 ? visible[openIdx] : null;

  return (
    <div className="page-in" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "stretch", padding: "8px 0" }}>
        <window.HeroStat label="Photos" value={<window.CountUp value={PHOTOS.length} format={(v) => Math.round(v).toString()} />} sub="Visible · filtered" />
        <window.HeroStat label="Photoshop edits" value={<window.CountUp value={PHOTOS.reduce((s,p)=>s+p.edits,0)} format={(v) => Math.round(v).toString()} />} sub="Total layers across catalog" />
        <window.HeroStat label="Last shoot" value={<span className="display">3d</span>} sub="Ulsoor lake · golden hour" />
        <div style={{ flex: 1, padding: "0 0 0 24px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6, flexWrap: "wrap" }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "6px 12px", borderRadius: 999, fontSize: 12,
              background: filter === f ? "var(--accent)" : "transparent",
              color: filter === f ? "#08090B" : "var(--text-secondary)",
              border: `1px solid ${filter === f ? "var(--accent)" : "var(--border)"}`,
              fontWeight: 500,
            }}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ columnCount: 3, columnGap: 12 }}>
        {visible.map(p => <Tile key={p.id} p={p} onOpen={() => setOpenId(p.id)} />)}
      </div>

      {open && <Lightbox
        p={open}
        onClose={() => setOpenId(null)}
        onPrev={() => setOpenId(visible[(openIdx - 1 + visible.length) % visible.length].id)}
        onNext={() => setOpenId(visible[(openIdx + 1) % visible.length].id)}
      />}
    </div>
  );
}

window.PhotoGallery = PhotoGallery;
