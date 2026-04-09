# 🏛️ Sovereign Fund Command Center

A real-time, multi-agent hedge fund intelligence dashboard built with React + Vite. The Command Center simulates a sovereign wealth fund's operations room — monitoring market shocks, orchestrating AI agent fleet decisions, and surfacing alpha opportunities across asset classes.

> **Live Demo**: [prattkk.github.io/sovereign-fund-command-center](https://prattkk.github.io/sovereign-fund-command-center/)

---

## 📸 Screenshots

### Global Overview
The main dashboard displays live market data, scenario analysis (Oil Shock, CPI Re-acceleration), Strategy DNA cards for 5 hedge fund archetypes, and an Alpha Heatmap with squeeze risk scoring.

### Agent War Room
Multi-agent debate arena where AI agents (RenTech Quant, Bridgewater Macro, Millennium Pod, Elliott Activist, Brevan Howard Rates) deliberate on positions with a real-time transcript and vote matrix.

### Deep Dive
Single-asset analysis screen with short interest charts, sentiment bars, squeeze catalyst summaries, and 13F institutional flow data.

---

## 🏗️ Architecture

```
war-room-ui/
├── src/
│   ├── App.jsx                    # Main shell — router, live clock, background effects
│   ├── index.css                  # Full design system (~53KB of premium dark-mode CSS)
│   ├── main.jsx                   # React entry point
│   │
│   ├── screens/                   # Three main views
│   │   ├── GlobalOverview.jsx     # Dashboard with scenario panel, strategy DNA, heatmap
│   │   ├── DeepDive.jsx           # Single-asset deep analysis
│   │   └── AgentWarRoom.jsx       # Multi-agent debate + vote matrix
│   │
│   ├── components/                # Reusable UI components
│   │   ├── Navigation.jsx         # Tab navigation with ticker context
│   │   ├── AlphaHeatmap.jsx       # Squeeze Risk Matrix (V4) — 20 assets
│   │   ├── AgentTranscript.jsx    # Live agent debate transcript
│   │   ├── GovernorPanel.jsx      # Risk Guardian oversight panel
│   │   ├── Newsfeed.jsx           # Scrolling breaking news ticker
│   │   ├── SentimentBars.jsx      # Multi-source sentiment visualization
│   │   ├── ShortInterestChart.jsx # Short interest time-series (Recharts)
│   │   └── SqueezeGauge.jsx       # Radial squeeze probability gauge
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── useNews.js             # News headline rotation
│   │   ├── useSentiment.js        # Sentiment score aggregation
│   │   └── useSqueezeScore.js     # Squeeze probability calculator
│   │
│   └── data/                      # Static data sources
│       ├── mirror13f.json         # SEC EDGAR 13F institutional holdings
│       ├── newsHeadlines.json     # Simulated breaking news feed
│       ├── sentimentScores.json   # Multi-source sentiment data
│       └── shortInterest.json     # Short interest time-series data
│
├── index.html                     # HTML entry with meta tags
├── vite.config.js                 # Vite config with base path for GitHub Pages
├── package.json                   # Dependencies & scripts
└── eslint.config.js               # ESLint configuration
```

---

## 🎨 Design System

- **Theme**: Midnight Emerald — dark background (`#0a0f1a`) with emerald accent (`#00e68a`)
- **Typography**: Inter (Google Fonts) with monospace for data
- **Effects**: Glassmorphism cards, particle background, CSS grid overlay
- **Animations**: Micro-animations on hover, pulsing status indicators, smooth transitions
- **Layout**: Responsive flexbox/grid, 3-column strategy DNA, 5-column heatmap

---

## 🤖 Agent Fleet

| Agent | Archetype | Strategy | Leverage |
|-------|-----------|----------|----------|
| **The Quant** | RenTech | Mean-Reversion / Vol Arb | Very High (12–20x) |
| **The Macro** | Bridgewater | Risk Parity / Debt Cycle | Med-High (5–7.5x) |
| **The Pod** | Millennium | Market Neutral / Pairs | Very High (~7x) |
| **The Activist** | Elliott | Event-Driven / Activist | Low-Med (1.5–3x) |
| **The Rates** | Brevan Howard | Rates / FX / Vol | Med-High (5–10x) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Run
```bash
# Clone the repository
git clone https://github.com/Prattkk/sovereign-fund-command-center.git
cd sovereign-fund-command-center/war-room-ui

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173/sovereign-fund-command-center/](http://localhost:5173/sovereign-fund-command-center/) in your browser.

### Build for Production
```bash
npm run build
npm run preview
```

### Deploy to GitHub Pages
```bash
npm run deploy
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework with hooks |
| **Vite 8** | Build tool & dev server |
| **Recharts** | Data visualization (charts) |
| **Vanilla CSS** | Full custom design system |
| **GitHub Pages** | Static hosting |
| **gh-pages** | Deployment automation |

---

## 📊 Data Sources

- **SEC EDGAR 13F** — Institutional holdings (Q4 2025)
- **Investor Letters** — Hedge fund strategy insights
- **Market Data** — Simulated real-time ticker feed (SPY, VIX, GLD, XLE, etc.)
- **News Feed** — Geopolitical and macro event simulation

---

## 📄 License

This project is for educational and demonstration purposes.
