# Myspace — Command Center

A personal command center: trading portfolio, habits, EMIs, organizer, job profile, and photo gallery — all under one dark-themed shell with a cyan accent.

## Run locally

It's a static site (React + Babel via CDN, no build step):

```
python3 -m http.server 8000
```

Then open `http://localhost:8000/` (redirects to `Command Center.html`).

## Files

- `Command Center.html` — entry point, loads React + Babel and the JSX modules
- `styles.css` — design tokens and shared styles
- `core.jsx` — icons, formatters, `CountUp`, `Sparkline`, `ISTClock`
- `app.jsx` — sidebar, top bar, command palette (⌘K), action history, routing
- `trading.jsx`, `habits.jsx`, `emi.jsx`, `organizer.jsx`, `profile.jsx`, `gallery.jsx` — the six modules

## Shortcuts

- `⌘K` / `Ctrl+K` — command palette
- `g` then `t / h / e / o / p / g` — jump to Trading / Habits / EMI / Organizer / Profile / Gallery
