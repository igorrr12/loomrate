# 🪙 Loomrate

> **Loomrate** is a freelance profitability and quote calculator that helps independent professionals, contractors, and agencies find their **true hourly rate**, model scope creep, and plan quotes with a reverse pricing engine.

It's a fully static, client-side site — no build step, no backend server, no framework. Every page is a self-contained `.html` file with inline styles and scripts, deployed as static files on Vercel.

---

## ✨ Features

- **True Hourly Rate Calculator** — account for platform fees, taxes, and unpaid admin/business hours to see what you actually make per billable hour.
- **Scope Creep Cost Visualizer** — see how hours added past the original estimate erode your margins and effective hourly wage.
- **Reverse Quote Planner** — enter your target net profit and hours to get the exact quote rate required.
- **Overhead & Expense Allocator** — distribute recurring business costs and subscriptions proportionally across your billing rates.
- **Local & Cloud Project Dashboard** — save and compare quotes via `localStorage`, with optional Supabase-backed cloud sync once signed in.
- **Client Analytics Chart** — Chart.js-powered visualization of freelance profit ratios.
- **CSV & PDF Export** — export project data to CSV or generate clean PDF rate sheets via jsPDF.
- **Single-purpose SEO calculators** — salary-to-hourly, freelance-vs-employee, quarterly tax estimator, and day-rate calculator tools for quick, focused conversions.

---

## 📄 Site Structure

| Page | Purpose |
|---|---|
| `index.html` | Landing/marketing page with interactive preview and auth modal |
| `calculator.html` | The core calculator app — charts, CSV/PDF export, premium gating, saved projects |
| `tools.html` | Hub page linking the single-purpose calculator tools |
| `salary-to-hourly.html` | Convert salary to an equivalent hourly rate |
| `freelance-vs-employee.html` | Compare freelance vs. employee compensation |
| `quarterly-tax-estimator.html` | Estimate quarterly self-employment taxes |
| `day-rate-calculator.html` | Calculate a freelance day rate |
| `faq.html` | FAQ accordion page |
| `glossary.html` | Glossary of freelance/pricing terms |
| `blog/` | Static blog posts on freelance pricing and rates |
| `config.js` | Runtime config (Supabase keys, checkout URL, dev flags) |

---

## 🚀 Getting Started

Loomrate runs entirely in the browser — no install or server required.

### Quick Start
```bash
open index.html
```

### Run Locally (recommended)
Auth and cloud-sync flows behave better served over `http://localhost` than opened directly as a file:
```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx serve .
```
Then open `http://localhost:8000` (or the port shown).

---

## 🛠️ Built With

- **HTML5 & CSS3** — responsive layouts, CSS custom properties, dark mode
- **Vanilla JavaScript** — calculator logic, theming, modals, auth flows
- **Supabase** — authentication and cloud sync for saved projects
- **Chart.js** — interactive client analytics charts
- **jsPDF** — client-side PDF rate-sheet generation
- **Lemon Squeezy** — premium checkout

---

## 🌐 Deployment

Deployed to [Vercel](https://vercel.com) as static files. `vercel.json` enforces clean URLs (no trailing slash) and permanently redirects `loomrate.com` → `www.loomrate.com`.
