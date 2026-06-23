# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Loomrate is a **static, client-side-only** freelance rate/quote calculator and marketing site (see README.md for product description). No build step, no backend server, no framework — every page is a self-contained `.html` file with inline `<style>` and `<script>` blocks. Deployed to Vercel as static files (`vercel.json`: clean URLs, no trailing slash; `loomrate.com` redirects permanently to `www.loomrate.com`).

There is no `package.json`, bundler, linter, or test suite for the site itself. "Testing" means opening the HTML files in a browser or running a local static server and exercising the UI manually:

```bash
python3 -m http.server 8000   # or: npx serve .
```
fetch()/auth flows behave better over `http://localhost` than `file://`.

## Site structure

- `index.html` — landing/marketing page with an interactive preview slider and auth modal.
- `calculator.html` — the actual calculator/quote planner app: charts, CSV/PDF export, premium gating, saved projects.
- `salary-to-hourly.html`, `freelance-vs-employee.html`, `quarterly-tax-estimator.html`, `day-rate-calculator.html` — single-purpose SEO calculator tools, lighter than `calculator.html`.
- `tools.html` — hub/index page linking the single-purpose tools above.
- `faq.html`, `glossary.html` — SEO content pages (FAQ accordion, term glossary).
- `blog/` — static blog posts + `blog/index.html` listing page.
- `config.js` — runtime config (Supabase URL/anon key, Lemon Squeezy checkout URL, `DEV_MODE_PREMIUM` flag).
- `sitemap.xml`, `robots.txt` — keep `sitemap.xml` in sync when adding/removing pages.
- `assets/loomrate-enhance.css` + `assets/loomrate-enhance.js` — **shared visual layer**, linked (via `/assets/...`) on every HTML page right before `</head>`. Loads *after* each page's inline `<style>`, so it overrides the design tokens site-wide. **This file is the source of truth for the colour palette** ("Verdant Capital" — premium near-black + vivid emerald/lime accent + gold secondary; the per-page inline `:root`/`[data-theme="dark"]` amber/navy values are legacy and overridden here). It also adds button sheen, card depth/hover, gradient headings, focus rings, scrollbar, scroll-reveal. For any site-wide *visual or palette* change, edit this file, not every page. Note the `--on-accent` token: text colour for fills on the now-vivid accent (white on light, near-black on dark) — applied to `.btn-primary`/`.calc-tab.active` etc. The JS reveal is defensive (classes are JS-added, never in static HTML) and ignores `calculator.html`. New pages must add the same `<link>`/`<script>` before `</head>`.
- `assets/loomrate-home.css` + `assets/loomrate-home.js` — **flagship homepage only** (linked just on `index.html`; activated by `<body class="hx-home">`). The dramatic landing experience: sticky glass nav, oversized hero, aurora background, glass "live preview" dashboard, bento features, count-up stats, parallax. All classes are `hx-`-prefixed and scoped under `body.hx-home` so they never leak to other pages. The interactive-preview widget keeps its original `preview_*` IDs (driven by `updatePreview()` in index.html's inline script); `#landing_page` must stay (its fade-out is triggered by `launchApp()`).

## Duplicated logic across pages — update consistently

All ~13 HTML pages each implement their **own copy** of `toggleTheme()`/`loadTheme()` (shared `localStorage` key `fpa_theme`, keeps theme in sync across pages) and the `showModal()`/`closeModal()` pattern — none of this is a shared module/include. `index.html` and `calculator.html` additionally each implement their own auth modal + Supabase sign-in/up/reset flow.

When changing shared behavior (theme, modals, auth UX), grep across **all** HTML files and update each copy — fixing it in one page silently leaves the others stale.

## calculator.html internals (the core app)

- **Calc pipeline**: `getInputsState()` → `computeProjectResults()` → `renderResults()` (~line 2250-2600) — pure input parsing → business math → DOM writeback.
- **Local persistence**: `localStorage` keys `fpa_projects` (saved projects array) and `fpa_theme`. `loadProjects()` / `saveProjectsToStorage()`.
- **Cloud sync**: `mergeLocalProjectsToCloud()` merges localStorage projects into Supabase on sign-in, then clears the local copy. Any new save/load path must check `supabaseClient`/session state before deciding whether to read/write `localStorage.fpa_projects` vs. the Supabase table — otherwise local data gets orphaned.
- **Auth flow**: `handleAuthClick()`, `openAuthModal()`, `handleSignIn/SignUp/ResetPassword/UpdatePassword()` (~line 3760-4040), Supabase-backed.
- **Premium gating is two separate halves** — both need updating for any new premium feature:
  - Data/behavior: global `isPremium` (set by `checkPremiumStatus()`, ~line 4043; checks `CONFIG.DEV_MODE_PREMIUM` first, else Supabase user metadata/subscription).
  - Visual: `updatePremiumUI()` (~line 4078) toggles blur/overlay on gated features (non-billable hour breakdown, client analytics chart, CSV import/export, PDF export, >3 saved projects) — independently of the data check, plus usually a `showPremiumUpgradeModal()` call on the blocked action.
- **Chart**: `renderProfitabilityChart()` / `setChartFilter()` (~line 2950-3190), Chart.js canvas.
- **CSV import/export**: `exportToCSV()`, `importFromCSV()` (~3189-3387) — premium-gated.
- **PDF export**: `exportToPDF()` + nested `drawCardTable()` (~3387-3760) — premium-gated.

## External dependencies (all via CDN, no npm)

- **Supabase JS v2** — auth + cloud sync. Client created in `initSupabase()` (calculator.html ~3761) using `CONFIG.SUPABASE_URL`/`CONFIG.SUPABASE_ANON_KEY`.
- **Chart.js 4.4.0** — profitability chart.
- **jsPDF 2.5.1** — client-side PDF rate-sheet export.
- **Lemon Squeezy** — checkout URL only (`CONFIG.LEMON_SQUEEZY_CHECKOUT_URL`); premium status is checked via Supabase, not a Lemon Squeezy SDK.

## config.js

`SUPABASE_ANON_KEY` is a public anon key — safe to expose client-side by design (Supabase RLS policies are the real security boundary, not key secrecy). Never commit `DEV_MODE_PREMIUM: true` (it's a local-only override to unlock premium without paying) or add service-role keys/other secrets here — this file ships to every browser.

## SEO conventions (titles/descriptions)

Every page's `<title>` must stay in sync with its `og:title` and `twitter:title`. Structure:
- Homepage (`index.html`): brand-first — `Loomrate: <what it does>` — since it's the one page that should read as the main/brand entry point.
- Every other page: `<Page topic> | Loomrate` — descriptive topic first, brand as a suffix, single separator (no double pipes/mixed separators).
- Keep titles roughly 35-65 characters and meta descriptions roughly 140-160 characters so they don't get truncated in Google search results.
- When adding a new page, also add it to `sitemap.xml`.
