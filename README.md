# 🪙 Loomrate

> **Loomrate** is a premium, local-first freelance profitability and quote analyzer designed to help independent professionals, contractors, and agencies calculate their **true hourly rate**, model scope creep, analyze client overheads, and plan quotes with a reverse pricing engine.

Built entirely as a modern client-side application, it features a warm, paper-like tactile design system with a seamless Dark Mode toggle, interactive analytics, and professional PDF report exporting.

---

## ✨ Features

*   **True Hourly Rate Calculator**: Account for platform fees, tax brackets, and unpaid administrative/business hours to uncover what you *actually* make.
*   **Scope Creep Cost Visualizer**: See exactly how hours added past the original estimate degrade your margins and drive down your effective hourly wage.
*   **Reverse Quote Planner**: Enter your desired net profit and hours to instantly receive the exact quote rate required to get you there.
*   **Overhead & Expense Allocator**: Distribute your recurring business overhead costs and software subscriptions proportionally across your billing rates.
*   **Local Project Dashboard & Comparisons**: Save quotes locally using `localStorage` to contrast metrics and client performance over time.
*   **Dynamic Client Analytics**: Sleek charts (powered by Chart.js) that map and visualize key freelance profit ratios.
*   **PDF Export Engine**: Export beautiful, clean PDF rate sheets and project summaries via jsPDF to share or archive.

---

## 🎨 Design System & Aesthetics

Loomrate uses a bespoke design language characterized by high-contrast typography, interactive hover micro-animations, and a subtle SVG noise filter overlay for a tactile, high-end paper texture.

*   **Light Mode (Parchment & Amber)**: A warm, analog layout using a color palette of rich amber (`#92400e`), gold, and soft parchment paper tones.
*   **Dark Mode (Midnight Coral)**: A sleek, dark interface featuring deep navy (`#0a0d1a`), neon-coral highlights (`#f97316`), and amber accents.
*   **Animations**: Built with hardware-accelerated transitions and interactive pop/pulse states for dynamic input responses.

---

## 🚀 Getting Started

Since Loomrate is fully serverless and runs entirely in the browser, there are no complicated installation steps or server configurations required.

### Quick Start
Simply open [index.html](file:///Users/29matysiak_i/Desktop/loomrate/index.html) in any modern web browser:
```bash
open index.html
```

### Run Locally (Optional)
To run with a lightweight local web server:
```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx serve .
```
Then navigate to `http://localhost:8000` or the port provided.

---

## 🛠️ Built With

*   **HTML5 & Vanilla CSS3**: Fully responsive fluid layout, custom CSS custom properties (variables), and an SVG turbulence grain filter.
*   **Vanilla JavaScript**: Real-time reactive calculator calculations and state synchronization.
*   **Chart.js**: Premium interactive client analytics and charts.
*   **jsPDF**: Client-side vector PDF document generation.
