# EMI Command Center

A self-contained EMI (Equated Monthly Installment) dashboard. Single `index.html`,
no build step, no external/CDN dependencies — open it directly in any browser and
it works fully offline.

## Features
- EMI calculation: `EMI = P·r·(1+r)^n / ((1+r)^n − 1)`
- KPIs: monthly EMI, total interest, total payment, portfolio-wide monthly outgo
- Principal-vs-interest donut (canvas) + interest-share progress bar
- Full amortization schedule (per-installment principal/interest/balance)
- Multi-loan portfolio saved in `localStorage`

## Run
Open `index.html` in a browser, or serve locally:

    python3 -m http.server 8000   # then visit http://localhost:8000/emi-tracker/

## Why this version is dependency-free
A blank/broken dashboard is most often caused by a failed external CDN load
(e.g. a charting library). This build draws its own chart and persists data
locally, so nothing external can break it.
