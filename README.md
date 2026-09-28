# Tarik Akarli - Quantitative Engineering & Research Portfolio

Institutional Fintech & Dark Mode Native redesign of Tarik Akarli's quantitative developer and research portfolio.

## 🚀 Live Preview & Deployment
- **Live GitHub Pages URL**: [https://enhayi.github.io/portfolio/](https://enhayi.github.io/portfolio/)
- **Local Development Server**:
  ```bash
  # Using Python
  python -m http.server 8080
  # Or via npx
  npx serve .
  ```
  Open `http://localhost:8080` in your browser.

---

## 🏛️ System Architecture & Aesthetic

- **Theme**: Institutional Fintech / Dark Mode Native (`#08090b` / `#0a0d14`), stark white typography, with electric blue (`#00f0ff`) and trading emerald (`#10b981`) accents inspired by top quantitative hedge funds and high-frequency trading terminals.
- **Typography**: Clean modern sans-serif (*Inter*) for narrative reading paired with *JetBrains Mono* for mathematical models, live tick tickers, code snippets, and terminal command lines.
- **Microstructure & Stochastic Visualizers**:
  - **Live Level-2 Order Book (LOB) Visualizer**: Real-time simulated bid/ask depth, dynamic spread, and Order Book Imbalance (OBI) indicator.
  - **Monte Carlo Asian Option Pricer**: In-browser Geometric Brownian Motion path simulation (30 stochastic sample paths), arithmetic mean estimation, and 95% confidence intervals.
  - **Modern Portfolio Theory (MPT) Efficient Frontier Slider**: Dynamic allocation slider displaying expected return, volatility, Sharpe ratio, and asset weights across 50-asset covariance models.
- **Interactive Mathematical Model Modals**:
  - Full $\LaTeX$ rendering powered by **KaTeX** for microstructural LOB formulas, quadratic Sharpe ratio maximization, Ornstein-Uhlenbeck cointegration, and Asian option risk-neutral valuation.
  - Architecture pipeline topologies and highlighted Python code excerpts.
- **Terminal Contact Section & Interactive CLI**:
  - Command prompt input format (`> user_name =`, `> user_email =`, `> message =`) executing directly to Formspree (`https://formspree.io/f/xeokreeg`).
  - Interactive terminal CLI commands (`help`, `cv`, `skills`, `projects`, `status`, `clear`).

---

## 📂 File Structure

```
portfolio/
├── assets/
│   └── png/
│       ├── pfp.png               # Profile photograph
│       ├── project1.png          # Portfolio Optimizer screenshot
│       ├── hft1.png              # HFT Simulator screenshot
│       ├── hft2.png              # HFT Simulator detail screenshot
│       ├── MCOP_picture.png      # Monte Carlo Option Pricing screenshot
│       ├── linkedin-ico.png      # LinkedIn logo
│       └── github-ico.png        # GitHub logo
├── css/
│   └── style.css                 # Custom institutional dark-mode stylesheet & animations
├── js/
│   └── app.js                    # Interactive engine: Typewriter, Canvas, LOB simulator, Monte Carlo, Modals, Terminal
├── cv.pdf                        # Tarik Akarli Curriculum Vitae
├── index.html                    # Single-Page Portfolio Application
├── README.md                     # Documentation & Deployment Guide
└── .gitignore
```

---

## 🛠️ Deployment to GitHub Pages

To publish these changes directly to your live GitHub Pages site:
```bash
git init
git remote add origin https://github.com/enhayi/portfolio.git
git add .
git commit -m "feat: complete institutional quant portfolio redesign"
git branch -M main
git push -u origin main --force
```

---

© 2026 Tarik Akarli. Built with curiosity and a love for problem-solving.
