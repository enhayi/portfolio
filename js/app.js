/**
 * Tarik Akarli - Quantitative Engineering & Research Portfolio
 * Interactive Application Engine: Typewriter, Canvas Particle Grid,
 * LOB Depth Visualizer, Monte Carlo Simulator, KaTeX Math Engine,
 * Terminal Command Handler & Case Study Modals.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initBackgroundCanvas();
  initLobVisualizer();
  initMonteCarloSimulator();
  initPortfolioSlider();
  initModals();
  initLivePreviewModal();
  initTerminal();
  initNavigation();
  renderAllMath();
});

/* -------------------------------------------------------------------------- */
/* 1. Typewriter Effect                                                        */
/* -------------------------------------------------------------------------- */
function initTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  const phrases = [
    "MSc Mathematics & Computer Science @ Durham University",
    "Building High-Frequency Infrastructure",
    "Deep Learning LOB Dynamics",
    "Systematic Alpha Research & Execution Algos",
    "Stochastic Calculus & Exotic Derivatives Pricing"
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 55;

  function type() {
    const current = phrases[phraseIdx];

    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 25;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 55;
    }

    if (!isDeleting && charIdx === current.length) {
      typingSpeed = 2200; // Pause at complete sentence
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typingSpeed = 400; // Pause before typing new sentence
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* -------------------------------------------------------------------------- */
/* 2. Interactive Ambient Particle & Grid Canvas                              */
/* -------------------------------------------------------------------------- */
function initBackgroundCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(width > 768 ? 45 : 20, 60);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.5 + 0.5,
      color: Math.random() > 0.6 ? '#00f0ff' : '#10b981',
      alpha: Math.random() * 0.4 + 0.1
    });
  }

  let mouse = { x: -1000, y: -1000 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.12 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw and update particles
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Mouse repulsion/attraction
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        p.x -= (dx / dist) * 0.8;
        p.y -= (dy / dist) * 0.8;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1.0;
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* -------------------------------------------------------------------------- */
/* 3. Level-2 Limit Order Book (LOB) Live Visualizer Widget                   */
/* -------------------------------------------------------------------------- */
function initLobVisualizer() {
  const container = document.getElementById('lob-visualizer');
  if (!container) return;

  let midPrice = 64250.50;
  const levels = 8;

  function generateLOB() {
    const asks = [];
    const bids = [];
    let bestAsk = midPrice + (Math.random() * 0.4 + 0.1);
    let bestBid = midPrice - (Math.random() * 0.4 + 0.1);

    let cumAskVol = 0;
    let cumBidVol = 0;

    for (let i = 0; i < levels; i++) {
      const askPx = (bestAsk + i * 0.5).toFixed(2);
      const askVol = Math.floor(Math.random() * 45 + 5);
      cumAskVol += askVol;
      asks.push({ price: askPx, volume: askVol, cum: cumAskVol });

      const bidPx = (bestBid - i * 0.5).toFixed(2);
      const bidVol = Math.floor(Math.random() * 45 + 5);
      cumBidVol += bidVol;
      bids.push({ price: bidPx, volume: bidVol, cum: cumBidVol });
    }

    // Order Book Imbalance (OBI) at top 5 levels
    const totalBidTop5 = bids.slice(0, 5).reduce((acc, b) => acc + b.volume, 0);
    const totalAskTop5 = asks.slice(0, 5).reduce((acc, a) => acc + a.volume, 0);
    const obi = (totalBidTop5 - totalAskTop5) / (totalBidTop5 + totalAskTop5);
    const spread = (asks[0].price - bids[0].price).toFixed(2);

    return { asks, bids, obi, spread, totalBid: cumBidVol, totalAsk: cumAskVol };
  }

  function renderLOB() {
    // Random walk on midPrice
    const delta = (Math.random() - 0.49) * 0.35;
    midPrice = Math.max(1000, midPrice + delta);

    const data = generateLOB();
    const maxCum = Math.max(data.totalAsk, data.totalBid);

    let html = `
      <div class="p-3 bg-[#0a0d14] rounded-lg border border-slate-800 font-mono-code text-xs">
        <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
          <div class="flex items-center space-x-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="text-slate-300 font-semibold">BTC/USDT L2 FEED</span>
            <span class="text-slate-500 text-[10px]">100ms INGESTION</span>
          </div>
          <div class="text-right">
            <span class="text-slate-400">MID: </span>
            <span class="text-cyan-400 font-bold text-sm">$${midPrice.toFixed(2)}</span>
            <span class="ml-2 text-slate-500 text-[10px]">SPREAD: $${data.spread}</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <!-- Bids (Green) -->
          <div>
            <div class="flex justify-between text-slate-500 font-semibold mb-1 px-1">
              <span>BID PRICE</span>
              <span>VOL</span>
            </div>
            <div class="space-y-0.5">
    `;

    data.bids.forEach((b) => {
      const pct = Math.min(100, Math.round((b.cum / maxCum) * 100));
      html += `
        <div class="relative flex justify-between px-1.5 py-0.5 rounded overflow-hidden">
          <div class="absolute inset-y-0 right-0 bg-emerald-500/15" style="width: ${pct}%;"></div>
          <span class="text-emerald-400 font-medium z-10">$${b.price}</span>
          <span class="text-slate-300 z-10">${b.volume}</span>
        </div>
      `;
    });

    html += `
            </div>
          </div>

          <!-- Asks (Red) -->
          <div>
            <div class="flex justify-between text-slate-500 font-semibold mb-1 px-1">
              <span>ASK PRICE</span>
              <span>VOL</span>
            </div>
            <div class="space-y-0.5">
    `;

    data.asks.forEach((a) => {
      const pct = Math.min(100, Math.round((a.cum / maxCum) * 100));
      html += `
        <div class="relative flex justify-between px-1.5 py-0.5 rounded overflow-hidden">
          <div class="absolute inset-y-0 left-0 bg-rose-500/15" style="width: ${pct}%;"></div>
          <span class="text-rose-400 font-medium z-10">$${a.price}</span>
          <span class="text-slate-300 z-10">${a.volume}</span>
        </div>
      `;
    });

    // OBI Gauge & Signal Indicator
    const obiPct = Math.round((data.obi + 1) * 50); // 0 to 100
    const signal = data.obi > 0.15 ? 'BULLISH PRESSURE' : data.obi < -0.15 ? 'BEARISH PRESSURE' : 'NEUTRAL / BALANCED';
    const signalColor = data.obi > 0.15 ? 'text-emerald-400' : data.obi < -0.15 ? 'text-rose-400' : 'text-slate-400';

    html += `
            </div>
          </div>
        </div>

        <!-- Order Book Imbalance (OBI) Indicator -->
        <div class="mt-3 pt-2 border-t border-slate-800/80">
          <div class="flex justify-between items-center text-[10px] text-slate-400 mb-1">
            <span>ORDER BOOK IMBALANCE (L1-L5): <strong class="${signalColor}">${(data.obi * 100).toFixed(1)}%</strong></span>
            <span class="${signalColor} font-bold">${signal}</span>
          </div>
          <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
            <div class="bg-rose-500 h-full transition-all duration-300" style="width: ${100 - obiPct}%;"></div>
            <div class="bg-emerald-500 h-full transition-all duration-300" style="width: ${obiPct}%;"></div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  renderLOB();
  setInterval(renderLOB, 450);
}

/* -------------------------------------------------------------------------- */
/* 4. Interactive Monte Carlo Asian Option Simulator                           */
/* -------------------------------------------------------------------------- */
function initMonteCarloSimulator() {
  const canvas = document.getElementById('mc-canvas');
  const runBtn = document.getElementById('mc-run-btn');
  const priceDisplay = document.getElementById('mc-price-display');
  const ciDisplay = document.getElementById('mc-ci-display');
  const volInput = document.getElementById('mc-vol-slider');
  const volVal = document.getElementById('mc-vol-val');

  if (!canvas || !runBtn) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.parentElement.clientWidth || 360;
    canvas.height = 180;
  }
  resize();
  window.addEventListener('resize', resize);

  if (volInput && volVal) {
    volInput.addEventListener('input', (e) => {
      volVal.textContent = `${e.target.value}%`;
    });
  }

  function runSimulation() {
    resize();
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const S0 = 100;
    const K = 100;
    const r = 0.05;
    const sigma = parseFloat(volInput ? volInput.value : 20) / 100;
    const T = 1.0;
    const steps = 40;
    const dt = T / steps;
    const numPaths = 35;

    // Draw coordinate grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Strike line K = 100
    const strikeY = h / 2;
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
    ctx.moveTo(0, strikeY);
    ctx.lineTo(w, strikeY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#f59e0b';
    ctx.font = '10px JetBrains Mono';
    ctx.fillText(`K = $${K}`, 8, strikeY - 4);

    const payoffs = [];
    const drift = (r - 0.5 * sigma * sigma) * dt;
    const vol = sigma * Math.sqrt(dt);

    for (let p = 0; p < numPaths; p++) {
      let currentS = S0;
      let sumS = S0;
      const path = [{ x: 0, y: strikeY }];

      for (let s = 1; s <= steps; s++) {
        // Standard normal random variable (Box-Muller)
        const u1 = Math.max(1e-7, Math.random());
        const u2 = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

        currentS = currentS * Math.exp(drift + vol * z);
        sumS += currentS;

        const px = (s / steps) * w;
        // Scale price relative to S0: +/- 40% maps to canvas height
        const py = strikeY - ((currentS - S0) / (S0 * 0.45)) * (h / 2);
        path.push({ x: px, y: Math.max(2, Math.min(h - 2, py)) });
      }

      // Discrete arithmetic average payoff
      const avgS = sumS / (steps + 1);
      const payoff = Math.exp(-r * T) * Math.max(0, avgS - K);
      payoffs.push(payoff);

      // Draw path
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.strokeStyle = currentS >= K ? 'rgba(0, 240, 255, 0.45)' : 'rgba(239, 68, 68, 0.35)';
      ctx.lineWidth = 1.1;
      ctx.stroke();
    }

    // Compute estimate and 95% Confidence Interval
    const mean = payoffs.reduce((a, b) => a + b, 0) / payoffs.length;
    const variance = payoffs.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (payoffs.length - 1);
    const se = Math.sqrt(variance / payoffs.length);
    const lowerCI = Math.max(0, mean - 1.96 * se).toFixed(2);
    const upperCI = (mean + 1.96 * se).toFixed(2);

    if (priceDisplay) {
      priceDisplay.textContent = `$${mean.toFixed(2)}`;
    }
    if (ciDisplay) {
      ciDisplay.textContent = `[$${lowerCI}, $${upperCI}]`;
    }
  }

  runBtn.addEventListener('click', runSimulation);
  runSimulation();
}

/* -------------------------------------------------------------------------- */
/* 5. Modern Portfolio Theory / Efficient Frontier Interactive Slider          */
/* -------------------------------------------------------------------------- */
function initPortfolioSlider() {
  const slider = document.getElementById('risk-slider');
  const returnEl = document.getElementById('mpt-exp-return');
  const volEl = document.getElementById('mpt-vol');
  const sharpeEl = document.getElementById('mpt-sharpe');
  const barTech = document.getElementById('mpt-bar-tech');
  const barMomentum = document.getElementById('mpt-bar-mom');
  const barDefensive = document.getElementById('mpt-bar-def');

  if (!slider) return;

  function updateMPT() {
    const risk = parseFloat(slider.value) / 100; // 0 to 1

    // Model weight interpolation along the efficient frontier
    const wTech = Math.round((0.15 + 0.65 * Math.pow(risk, 1.2)) * 100);
    const wMom = Math.round((0.25 + 0.25 * risk) * 100);
    const wDef = Math.max(0, 100 - wTech - wMom);

    // Corresponding expected metrics
    const expRet = (4.5 + 16.5 * risk).toFixed(1);
    const vol = (5.0 + 22.0 * Math.pow(risk, 0.9)).toFixed(1);
    const rf = 4.0;
    const sharpe = ((expRet - rf) / vol).toFixed(2);

    if (returnEl) returnEl.textContent = `+${expRet}%`;
    if (volEl) volEl.textContent = `${vol}%`;
    if (sharpeEl) sharpeEl.textContent = `${sharpe}`;

    if (barTech) {
      barTech.style.width = `${wTech}%`;
      barTech.setAttribute('title', `Tech / Quant Equities: ${wTech}%`);
    }
    if (barMomentum) {
      barMomentum.style.width = `${wMom}%`;
      barMomentum.setAttribute('title', `Statistical Momentum: ${wMom}%`);
    }
    if (barDefensive) {
      barDefensive.style.width = `${wDef}%`;
      barDefensive.setAttribute('title', `Risk-Free / Fixed Income: ${wDef}%`);
    }
  }

  slider.addEventListener('input', updateMPT);
  updateMPT();
}

/* -------------------------------------------------------------------------- */
/* 6. Case Study Modals & LaTeX Mathematical Model Renderer                   */
/* -------------------------------------------------------------------------- */
const projectData = {
  lob: {
    title: "Limit Order Book (LOB) Deep Learning Predictor",
    subtitle: "High-Frequency Microstructural Signal Generation with PyTorch & Dedicated GPU Acceleration",
    tags: ["Python", "PyTorch", "Linux / WSL2", "CUDA 12.6", "L2 Order Book", "Financial Microstructure"],
    live: "https://lob-deep-learning-predictor-aesbyklvshkmmdvtx3qwnz.streamlit.app/",
    github: "https://github.com/enhayi/lob-deep-learning-predictor",
    overview: `
      Architected an end-to-end, hardware-accelerated deep learning pipeline in PyTorch designed to forecast short-term mid-price movements from high-frequency Level-2 Limit Order Book (LOB) tick data. 
      Engineered for local Linux/WSL2 compute environments accelerated by dedicated NVIDIA GPUs (CUDA 12.6, RTX GPU architecture).
    `,
    math: [
      {
        title: "1. Mid-Price & Microstructural Bid-Ask Spread",
        formula: "M_t = \\frac{P_t^{\\text{ask}, 1} + P_t^{\\text{bid}, 1}}{2}, \\quad S_t = P_t^{\\text{ask}, 1} - P_t^{\\text{bid}, 1}"
      },
      {
        title: "2. Multi-Level Order Book Imbalance (OBI)",
        formula: "\\text{OBI}_t^{(k)} = \\frac{V_t^{\\text{bid}, k} - V_t^{\\text{ask}, k}}{V_t^{\\text{bid}, k} + V_t^{\\text{ask}, k}} \\in [-1, 1]"
      },
      {
        title: "3. Forward Horizon Smoothed Target Labeling",
        formula: "l_t = \\begin{cases} +1 & \\text{if } \\bar{M}_{t+H} - M_t > \\alpha M_t \\\\ -1 & \\text{if } \\bar{M}_{t+H} - M_t < -\\alpha M_t \\\\ 0 & \\text{otherwise} \\end{cases}"
      },
      {
        title: "4. Causal Rolling Z-Score Normalization",
        formula: "Z_t = \\frac{X_t - \\mu_{t-1}^{(W)}}{\\sigma_{t-1}^{(W)} + \\epsilon} \\quad \\text{(strictly prevents lookahead bias)}"
      }
    ],
    architecture: `
[Live Binance 100ms / Synthetic LOB Generator]
                    │
                    ▼
[Module 1: Ingestion & 10k-tick Snappy Parquet Buffer]
                    │
                    ▼
[Module 2: Feature Engineering (OBI, Spread, Micro-Price, Causal Z-Score)]
                    │
                    ▼
[Module 3: PyTorch Sliding Window Dataset (Lookback=50 ticks, Batch=256)]
                    │
                    ▼
[Deep LOB Model (1D-CNN Spatial Extractor + LSTM Temporal Encoder)]
                    │
                    ▼
[Vectorized Execution Engine & Real-time PnL Evaluator]
    `,
    codeSnippet: `
# Feature Engineering: Causal Multi-Level Order Book Imbalance
def compute_multilevel_obi(df: pd.DataFrame, depth_levels: int = 10) -> pd.DataFrame:
    for k in range(1, depth_levels + 1):
        bid_vol = df[f'bid_vol_{k}']
        ask_vol = df[f'ask_vol_{k}']
        df[f'obi_lvl_{k}'] = (bid_vol - ask_vol) / (bid_vol + ask_vol + 1e-8)
        
    # Causal Rolling normalization prevents lookahead leakage
    rolling_mean = df['mid_price'].shift(1).rolling(window=100).mean()
    rolling_std = df['mid_price'].shift(1).rolling(window=100).std()
    df['mid_price_norm'] = (df['mid_price'] - rolling_mean) / (rolling_std + 1e-8)
    return df
    `
  },

  optimizer: {
    title: "Portfolio Optimizer (Mean-Variance MPT)",
    subtitle: "Constrained Quadratic Programming & Sharpe Ratio Maximization across 50 Assets",
    tags: ["Python", "Modern Portfolio Theory", "NumPy", "Pandas", "SciPy Optimize", "Streamlit"],
    live: "https://portfolio-optimizer-wbtrwczmmhwxphwjykrut4.streamlit.app/",
    github: "https://github.com/enhayi/portfolio-optimizer",
    overview: `
      Leverages Markowitz Modern Portfolio Theory (MPT) to calculate optimal asset allocations by maximising the Sharpe ratio—balancing expected return against risk. Computes the full efficient frontier across a custom 50-asset equity basket, solving for global minimum variance and optimal tangency portfolios.
    `,
    math: [
      {
        title: "1. Expected Return & Portfolio Variance",
        formula: "\\mu_p = \\mathbf{w}^T \\boldsymbol{\\mu}, \\quad \\sigma_p^2 = \\mathbf{w}^T \\boldsymbol{\\Sigma} \\mathbf{w}"
      },
      {
        title: "2. Tangency Portfolio Optimization (Sharpe Maximization)",
        formula: "\\max_{\\mathbf{w}} \\; \\frac{\\mathbf{w}^T \\boldsymbol{\\mu} - r_f}{\\sqrt{\\mathbf{w}^T \\boldsymbol{\\Sigma} \\mathbf{w}}} \\quad \\text{s.t.} \\quad \\sum_{i=1}^N w_i = 1, \\quad w_i \\ge 0 \\; (\\forall i)"
      },
      {
        title: "3. Global Minimum Variance (GMV) Portfolio",
        formula: "\\min_{\\mathbf{w}} \\; \\mathbf{w}^T \\boldsymbol{\\Sigma} \\mathbf{w} \\quad \\implies \\quad \\mathbf{w}_{\\text{GMV}} = \\frac{\\boldsymbol{\\Sigma}^{-1} \\mathbf{1}}{\\mathbf{1}^T \\boldsymbol{\\Sigma}^{-1} \\mathbf{1}}"
      }
    ],
    architecture: `
[Yahoo Finance Live Market Ingestion]
                │
                ▼
[Historical Log Returns & Covariance Matrix Computation (Σ)]
                │
                ▼
[SciPy SLSQP Constrained Quadratic Programming Engine]
                │
                ▼
[Efficient Frontier Generator + Tangency Sharpe Ratio Point]
                │
                ▼
[Interactive Streamlit Dashboard & Asset Allocation Visualizations]
    `,
    codeSnippet: `
def optimize_sharpe_ratio(mean_returns: np.ndarray, cov_matrix: np.ndarray, rf: float = 0.04):
    num_assets = len(mean_returns)
    def neg_sharpe(weights):
        p_ret = np.dot(weights, mean_returns)
        p_vol = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
        return -(p_ret - rf) / p_vol

    constraints = ({'type': 'eq', 'fun': lambda w: np.sum(w) - 1.0})
    bounds = tuple((0.0, 1.0) for _ in range(num_assets))
    init_guess = num_assets * [1.0 / num_assets]
    
    res = scipy.optimize.minimize(neg_sharpe, init_guess, method='SLSQP', bounds=bounds, constraints=constraints)
    return res.x # Optimal weights vector
    `
  },

  hft: {
    title: "High-Frequency Trading Simulator",
    subtitle: "Vectorized LOB Market-Making & Systematic Strategy Backtester",
    tags: ["Python", "Streamlit", "NumPy", "Pandas", "Alpha Vantage", "Vectorized Backtester"],
    live: "https://hft-simulation-f6uvqnzvcnja5n3cqogwcz.streamlit.app/",
    github: "https://github.com/enhayi/HFT-simulation",
    overview: `
      Engineered a vectorized market-making backtester in Pandas, evaluating historical limit order book data to benchmark Sharpe ratio and maximum drawdown metrics. Supports multi-source data integration (Yahoo Finance minute-level data & Alpha Vantage live stream) with mean reversion, momentum, and statistical arbitrage strategies.
    `,
    math: [
      {
        title: "1. Mean-Reversion Bollinger Spread (Z-Score)",
        formula: "z_t = \\frac{P_t - \\text{SMA}_n(P_t)}{\\sigma_n(P_t)}, \\quad \\text{Signal} = \\begin{cases} +1 & z_t < -k_{\\text{entry}} \\\\ -1 & z_t > +k_{\\text{entry}} \\end{cases}"
      },
      {
        title: "2. Maximum Drawdown (MDD) Formulation",
        formula: "\\text{MDD}_T = \\max_{\\tau \\in [0, T]} \\left( \\frac{\\max_{s \\le \\tau} V_s - V_\\tau}{\\max_{s \\le \\tau} V_s} \\right)"
      },
      {
        title: "3. Statistical Arbitrage Cointegration",
        formula: "S_t = P_t^A - \\beta P_t^B - \\alpha \\sim \\text{Ornstein-Uhlenbeck process } dS_t = -\\theta(S_t - \\bar{S})dt + \\sigma dW_t"
      }
    ],
    architecture: `
[Tick / Minute Data Feed (API / CSV)]
                 │
                 ▼
[Vectorized Signal Matrix Generation (Mean Reversion, Stat-Arb, Momentum)]
                 │
                 ▼
[Order Execution Simulation (Slippage, Spread Crossing, Latency Penalty)]
                 │
                 ▼
[PnL Tracking, Drawdown Analytics & Sharpe Benchmarking]
                 │
                 ▼
[Real-Time Plotly Interactive Trade Markers]
    `,
    codeSnippet: `
def vectorized_mean_reversion(df: pd.DataFrame, window: int = 20, z_thresh: float = 2.0):
    df['sma'] = df['close'].rolling(window=window).mean()
    df['std'] = df['close'].rolling(window=window).std()
    df['z_score'] = (df['close'] - df['sma']) / df['std']
    
    # Vectorized execution signals
    df['position'] = 0
    df.loc[df['z_score'] < -z_thresh, 'position'] = 1  # Long
    df.loc[df['z_score'] > z_thresh, 'position'] = -1  # Short
    df['strategy_return'] = df['position'].shift(1) * df['close'].pct_change()
    return df
    `
  },

  mc: {
    title: "Monte Carlo Pricing of an Exotic Asian Option",
    subtitle: "Path-Dependent Valuation under GBM with Advanced Variance Reduction",
    tags: ["Python", "Stochastic Calculus", "Pandas", "NumPy", "Geometric Brownian Motion", "Streamlit"],
    live: "https://montecarlo-optionpricing-i6w29bdadjxkffb5mzrkke.streamlit.app/",
    github: "https://github.com/enhayi/MonteCarlo-optionPricing",
    overview: `
      Built a Streamlit application to price discrete arithmetic Asian options under Geometric Brownian Motion (GBM) with continuous dividend yield and call/put support. Incorporates antithetic variates, moment matching, and control variates (using geometric Asian exact solutions) to reach razor-thin confidence intervals with reduced computational cost.
    `,
    math: [
      {
        title: "1. Exact Lognormal Discretization under Risk-Neutral Measure ℚ",
        formula: "S_{t_{i+1}} = S_{t_i} \\exp\\left( \\left(r - q - \\frac{1}{2}\\sigma^2\\right)\\Delta t + \\sigma \\sqrt{\\Delta t} Z_i \\right), \\quad Z_i \\sim \\mathcal{N}(0, 1)"
      },
      {
        title: "2. Discrete Arithmetic Asian Payoff",
        formula: "V_0 = e^{-rT} \\mathbb{E}^{\\mathbb{Q}}\\left[ \\max\\left( \\frac{1}{m}\\sum_{i=1}^m S_{t_i} - K, \\; 0 \\right) \\right]"
      },
      {
        title: "3. Control Variate Variance Reduction",
        formula: "\\hat{V}_{\\text{CV}} = \\hat{V}_{\\text{arith}} - c^* \\left( \\hat{V}_{\\text{geom}} - V_{\\text{geom}}^{\\text{exact}} \\right), \\quad c^* = \\frac{\\text{Cov}(\\hat{V}_{\\text{arith}}, \\hat{V}_{\\text{geom}})}{\\text{Var}(\\hat{V}_{\\text{geom}})}"
      }
    ],
    architecture: `
[Input Parameters: S₀, K, r, q, σ, T, Monitoring Steps m, Paths N]
                               │
                               ▼
[Vectorized NumPy Exact Discretization Engine (Antithetic variates Z & -Z)]
                               │
                               ▼
[Arithmetic Average Calculation & Risk-Neutral Discounting]
                               │
                               ▼
[Geometric Asian Closed-Form Control Variate Correction]
                               │
                               ▼
[Convergence Trace Plot, Payoff Distribution Histogram & 95% Confidence Interval]
    `,
    codeSnippet: `
def price_asian_option_mc(S0, K, r, q, sigma, T, m, N, antithetic=True):
    dt = T / m
    drift = (r - q - 0.5 * sigma**2) * dt
    vol = sigma * np.sqrt(dt)
    
    Z = np.random.normal(0, 1, size=(N // 2 if antithetic else N, m))
    if antithetic:
        Z = np.vstack([Z, -Z]) # Antithetic variates
        
    log_increments = drift + vol * Z
    log_paths = np.cumsum(log_increments, axis=1)
    paths = S0 * np.exp(np.hstack([np.zeros((paths_count, 1)), log_paths]))
    
    arithmetic_means = np.mean(paths[:, 1:], axis=1)
    discounted_payoffs = np.exp(-r * T) * np.maximum(arithmetic_means - K, 0)
    
    price = np.mean(discounted_payoffs)
    se = np.std(discounted_payoffs, ddof=1) / np.sqrt(len(discounted_payoffs))
    return price, (price - 1.96 * se, price + 1.96 * se)
    `
  },

  defi: {
    title: "Wintermute Trading DeFi On-Chain Analytics",
    subtitle: "High-Frequency Decentralized Arbitrage & Liquidity Analysis",
    tags: ["Python", "Web3", "Pandas", "DeFi Market Making", "EVM Data"],
    github: "https://github.com/enhayi/Exploratory-Blockchain-Data-Analysis-of-Wintermute-Trading-Activities-in-DeFi",
    overview: `
      Conducted an in-depth exploratory data analysis of high-frequency blockchain transactions, liquidity provision, and MEV arbitrage executed by algorithmic trading firm Wintermute across automated market maker (AMM) protocols.
    `,
    math: [
      {
        title: "1. Constant Product AMM Invariant & Price Impact",
        formula: "x \\cdot y = k, \\quad \\Delta y = \\frac{y \\cdot \\Delta x}{x + \\Delta x}"
      },
      {
        title: "2. Cross-DEX Arbitrage Condition",
        formula: "\\text{PnL} = \\left( P_{\\text{DEX}_A} - P_{\\text{DEX}_B} \\right) \\cdot Q - \\text{Gas Cost} > 0"
      }
    ],
    architecture: `
[EVM On-Chain Transaction Logs / Ethereum Mempool]
                       │
                       ▼
[Parquet Ingestion & Multi-Protocol Swap Parsing]
                       │
                       ▼
[Volume Flow, LP Rebalancing & Arbitrage Spread Extraction]
    `,
    codeSnippet: `
# Extracting swap arbitrage margins from parsed DEX logs
def calculate_arbitrage_spread(row):
    price_a = row['amount_in_usd'] / row['token_in_qty']
    price_b = row['amount_out_usd'] / row['token_out_qty']
    gross_spread = (price_b - price_a) / price_a
    net_pnl = (price_b - price_a) * row['token_in_qty'] - row['tx_fee_usd']
    return pd.Series([gross_spread, net_pnl], index=['spread_bps', 'net_pnl_usd'])
    `
  }
};

function initModals() {
  const modal = document.getElementById('case-study-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const modalBody = document.getElementById('modal-body');

  if (!modal || !closeBtn || !modalBody) return;

  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  });

  // Attach event listeners to project trigger buttons
  document.querySelectorAll('[data-project]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-project');
      const data = projectData[key];
      if (!data) return;

      renderProjectModal(data, modalBody);
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      renderAllMath();
    });
  });
}

function renderProjectModal(data, container) {
  let tagsHtml = data.tags.map(t => `<span class="px-2 py-0.5 rounded text-xs font-mono-code bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">${t}</span>`).join(' ');

  let mathHtml = data.math.map(m => `
    <div class="p-3 bg-[#0d121c] rounded-lg border border-slate-800">
      <div class="text-xs font-semibold text-slate-400 mb-1.5">${m.title}</div>
      <div class="math-tex py-1 text-center">${m.formula}</div>
    </div>
  `).join('');

  let linksHtml = '';
  if (data.live) {
    linksHtml += `
      <a href="${data.live}" target="_blank" rel="noreferrer" class="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all shadow-lg shadow-emerald-500/20">
        <span>Launch Live Streamlit App</span>
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
      </a>
    `;
  }
  if (data.github) {
    linksHtml += `
      <a href="${data.github}" target="_blank" rel="noreferrer" class="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all">
        <svg class="w-4 h-4 fill-current" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
        <span>View Repository</span>
      </a>
    `;
  }

  container.innerHTML = `
    <div>
      <div class="mb-4">
        <h2 class="text-xl md:text-2xl font-bold text-white mb-1.5">${data.title}</h2>
        <p class="text-xs md:text-sm text-cyan-400 font-mono-code mb-3">${data.subtitle}</p>
        <div class="flex flex-wrap gap-1.5 mb-4">${tagsHtml}</div>
        <div class="flex flex-wrap gap-2">${linksHtml}</div>
      </div>

      <div class="space-y-6 pt-4 border-t border-slate-800 text-sm">
        <div>
          <h3 class="text-xs font-mono-code uppercase tracking-wider text-slate-400 mb-2">Project Architecture & Overview</h3>
          <p class="text-slate-300 leading-relaxed text-xs md:text-sm">${data.overview}</p>
        </div>

        <div>
          <h3 class="text-xs font-mono-code uppercase tracking-wider text-cyan-400 mb-2.5 flex items-center space-x-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
            <span>Mathematical Foundations & Formulation</span>
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">${mathHtml}</div>
        </div>

        <div>
          <h3 class="text-xs font-mono-code uppercase tracking-wider text-slate-400 mb-2">Pipeline Topology</h3>
          <pre class="p-3 bg-[#0a0d14] rounded-lg border border-slate-800 text-[11px] font-mono-code text-slate-300 overflow-x-auto leading-tight">${data.architecture}</pre>
        </div>

        <div>
          <h3 class="text-xs font-mono-code uppercase tracking-wider text-slate-400 mb-2">Production Implementation Excerpt</h3>
          <pre class="p-3 bg-[#080b11] rounded-lg border border-slate-800 text-[11px] font-mono-code text-cyan-300 overflow-x-auto leading-relaxed"><code>${data.codeSnippet.trim()}</code></pre>
        </div>
      </div>
    </div>
  `;
}

/* -------------------------------------------------------------------------- */
/* 6.1. Live Streamlit App Preview Modal                                       */
/* -------------------------------------------------------------------------- */
function initLivePreviewModal() {
  const modal = document.getElementById('app-preview-modal');
  const closeBtn = document.getElementById('preview-close-btn');
  const iframe = document.getElementById('preview-iframe');
  const loader = document.getElementById('preview-loader');
  const titleEl = document.getElementById('preview-modal-title');
  const extLink = document.getElementById('preview-external-link');

  if (!modal || !closeBtn || !iframe) return;

  function closePreview() {
    modal.classList.add('hidden');
    iframe.src = '';
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closePreview);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closePreview();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closePreview();
  });

  document.querySelectorAll('.btn-live-preview').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const embedUrl = btn.getAttribute('data-preview-url');
      const title = btn.getAttribute('data-preview-title') || 'Live Streamlit Application';
      if (!embedUrl) return;

      const directUrl = embedUrl.replace('?embed=true', '');
      if (titleEl) titleEl.textContent = title;
      if (extLink) extLink.href = directUrl;

      if (loader) {
        loader.classList.remove('opacity-0', 'pointer-events-none');
        loader.classList.add('opacity-100');
      }

      iframe.src = embedUrl;
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';

      iframe.onload = () => {
        if (loader) {
          loader.classList.add('opacity-0', 'pointer-events-none');
          loader.classList.remove('opacity-100');
        }
      };
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 7. KaTeX Auto-Renderer                                                      */
/* -------------------------------------------------------------------------- */
function renderAllMath() {
  if (typeof katex === 'undefined') return;

  document.querySelectorAll('.math-tex').forEach((el) => {
    const tex = el.textContent.trim();
    if (!tex) return;
    try {
      katex.render(tex, el, {
        throwOnError: false,
        displayMode: true
      });
    } catch (err) {
      console.warn('KaTeX rendering error:', err);
    }
  });

  document.querySelectorAll('.math-inline').forEach((el) => {
    const tex = el.textContent.trim();
    if (!tex) return;
    try {
      katex.render(tex, el, {
        throwOnError: false,
        displayMode: false
      });
    } catch (err) {
      console.warn('KaTeX rendering error:', err);
    }
  });
}

/* -------------------------------------------------------------------------- */
/* 8. Terminal Contact & Interactive CLI Command Engine                        */
/* -------------------------------------------------------------------------- */
function initTerminal() {
  const form = document.getElementById('terminal-form');
  const cliInput = document.getElementById('cli-command-input');
  const termLogs = document.getElementById('terminal-logs');
  const execBtn = document.getElementById('terminal-exec-btn');

  function log(msg, type = 'info') {
    if (!termLogs) return;
    const time = new Date().toISOString().substring(11, 19);
    let colorClass = 'text-slate-300';
    let badge = '[LOG]';

    if (type === 'success') {
      colorClass = 'text-emerald-400';
      badge = '[SUCCESS]';
    } else if (type === 'warn') {
      colorClass = 'text-amber-400';
      badge = '[WARN]';
    } else if (type === 'error') {
      colorClass = 'text-rose-400';
      badge = '[ERROR]';
    } else if (type === 'cmd') {
      colorClass = 'text-cyan-400';
      badge = '[EXEC]';
    }

    const row = document.createElement('div');
    row.className = `leading-relaxed text-[11px] font-mono-code ${colorClass}`;
    row.innerHTML = `<span class="text-slate-500">${time}</span> <span class="font-semibold">${badge}</span> ${msg}`;
    termLogs.appendChild(row);
    termLogs.scrollTop = termLogs.scrollHeight;
  }

  // Handle PRD Contact Form Submission via Formspree
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('terminal-name')?.value?.trim();
      const email = document.getElementById('terminal-email')?.value?.trim();
      const message = document.getElementById('terminal-message')?.value?.trim();

      if (!name || !email || !message) {
        log("Missing required parameters: name, email, and message are required.", "error");
        return;
      }

      log(`Dispatching socket payload to Formspree endpoint [tarik.akarli]...`, "cmd");
      if (execBtn) {
        execBtn.disabled = true;
        execBtn.innerHTML = `<span>DISPATCHING...</span>`;
      }

      try {
        const res = await fetch("https://formspree.io/f/xeokreeg", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({ name, email, message })
        });

        if (res.ok) {
          log(`Transmission ACK received [200 OK]. Message routed to Tarik Akarli.`, "success");
          form.reset();
        } else {
          log(`Transmission response non-200. Please reach out via LinkedIn or direct email.`, "warn");
        }
      } catch (err) {
        log(`Network socket failed: ${err.message}. Please connect on LinkedIn: linkedin.com/in/tarik-akarli-92688528b/`, "error");
      } finally {
        if (execBtn) {
          execBtn.disabled = false;
          execBtn.innerHTML = `<span>EXECUTE</span><svg class="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>`;
        }
      }
    });
  }

  // Handle Interactive CLI commands
  if (cliInput) {
    cliInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = cliInput.value.trim().toLowerCase();
        cliInput.value = '';
        if (!cmd) return;

        log(`$ ${cmd}`, "cmd");

        switch (cmd) {
          case 'help':
            log("Available commands: cv, skills, projects, lob, status, clear, contact, date, ping", "info");
            break;

          case 'lob':
          case 'preview':
          case 'demo':
            log("Connecting to LOB Deep Learning Predictor Streamlit cluster...", "success");
            window.open('https://lob-deep-learning-predictor-aesbyklvshkmmdvtx3qwnz.streamlit.app/', '_blank');
            break;

          case 'cv':
          case 'cat cv.pdf':
          case 'download cv':
            log("Opening Tarik Akarli CV (PDF)...", "success");
            window.open('./cv.pdf', '_blank');
            break;

          case 'skills':
            log("Core: Python (PyTorch, NumPy, Pandas), C++, R, SQL, Linux, CUDA 12.6, Git, LaTeX", "info");
            log("Focus: Market Microstructure, LOB Dynamics, High-Frequency Trading, Stochastic Calculus", "info");
            break;

          case 'projects':
            log("1. LOB Deep Learning Predictor (PyTorch / GPU)", "info");
            log("2. Portfolio Optimizer (MPT / Sharpe Maximization)", "info");
            log("3. HFT Simulator (Vectorized Market Maker)", "info");
            log("4. Monte Carlo Exotic Option Pricing (Arithmetic Asian)", "info");
            break;

          case 'status':
            log("STATUS: OPTIMAL | LATENCY: 8.2μs | BUFFER: 10,000 TICKS | WORKSTATION: LINUX/WSL2 CUDA", "success");
            break;

          case 'clear':
            if (termLogs) termLogs.innerHTML = '';
            log("Terminal buffer reset. Ready for orders.", "info");
            break;

          case 'contact':
            log("Direct Email: contact via form or tarik.akarli@durham.ac.uk", "info");
            log("LinkedIn: linkedin.com/in/tarik-akarli-92688528b/", "info");
            log("GitHub: github.com/enhayi", "info");
            break;

          case 'date':
            log(new Date().toUTCString(), "info");
            break;

          case 'ping':
            log("PONG 127.0.0.1: icmp_seq=1 ttl=64 time=0.012 ms", "success");
            break;

          default:
            log(`Command not recognized: "${cmd}". Type "help" for a list of commands.`, "warn");
            break;
        }
      }
    });
  }
}

/* -------------------------------------------------------------------------- */
/* 9. Navigation & Smooth Scroll                                               */
/* -------------------------------------------------------------------------- */
function initNavigation() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // Filter tabs on Experience section
  const filterBtns = document.querySelectorAll('.exp-filter-btn');
  const expItems = document.querySelectorAll('.timeline-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-cyan-500', 'text-black', 'font-semibold');
        b.classList.add('bg-slate-800/80', 'text-slate-400');
      });
      btn.classList.add('bg-cyan-500', 'text-black', 'font-semibold');
      btn.classList.remove('bg-slate-800/80', 'text-slate-400');

      const filter = btn.getAttribute('data-filter');

      expItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}
