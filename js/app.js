/**
 * Tarik Akarli - Quantitative Engineering & Research Portfolio
 * Spatial Desktop & Interactive Engine (Inspired by Elena Gonci / elenagonci.com)
 * 
 * Features:
 * 1. Live Analog Clock Engine & BST/London System Bar Time
 * 2. Theme Switcher (Dark / Light Porcelain Spatial Modes)
 * 3. Syntropic Labs Live Signal Ticker Player
 * 4. Dynamic Typewriter Animation
 * 5. Level-2 Limit Order Book (LOB) Live Visualizer
 * 6. Modern Portfolio Theory (MPT) Efficient Frontier Slider
 * 7. Live Monte Carlo Exotic Option Pricing Canvas
 * 8. Streamlit Live Preview Modal
 * 9. KaTeX Mathematical Formulas Renderer
 * 10. macOS Terminal CLI & Formspree Socket Dispatcher
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initClockEngine();
  initTickerPlayer();
  initTypewriter();
  initLobVisualizer();
  initPortfolioSlider();
  initMonteCarloSimulator();
  initTerminal();
  renderAllMath();
});

/* -------------------------------------------------------------------------- */
/* 1. Theme Switcher (Light Porcelain / Institutional Dark)                    */
/* -------------------------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const root = document.documentElement;

  // Retrieve saved preference or default to dark
  const savedTheme = localStorage.getItem('ta_portfolio_theme') || 'dark';
  if (savedTheme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isDark = root.classList.toggle('dark');
      localStorage.setItem('ta_portfolio_theme', isDark ? 'dark' : 'light');
    });
  }
}

/* -------------------------------------------------------------------------- */
/* 2. Live Analog Clock & London/Durham System Time Engine                     */
/* -------------------------------------------------------------------------- */
function initClockEngine() {
  const hourHand = document.getElementById('clock-hand-hour');
  const minHand = document.getElementById('clock-hand-min');
  const secHand = document.getElementById('clock-hand-sec');
  const systemClock = document.getElementById('system-bar-clock');
  const digitalClock = document.getElementById('digital-clock-display');

  function updateClocks() {
    // Current time in UK (London / Durham)
    const now = new Date();
    
    // London time formatting
    const timeOptions = { timeZone: 'Europe/London', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const timeStr = now.toLocaleTimeString('en-GB', timeOptions);

    if (systemClock) systemClock.textContent = timeStr;
    if (digitalClock) digitalClock.textContent = `${timeStr} BST`;

    // Calculate rotation angles
    const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
    const minutes = now.getMinutes() + seconds / 60;
    const hours = (now.getHours() % 12) + minutes / 60;

    const secDeg = seconds * 6;
    const minDeg = minutes * 6;
    const hourDeg = hours * 30;

    if (secHand) secHand.style.transform = `translateX(-50%) rotate(${secDeg}deg)`;
    if (minHand) minHand.style.transform = `translateX(-50%) rotate(${minDeg}deg)`;
    if (hourHand) hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
  }

  updateClocks();
  setInterval(updateClocks, 250);
}

/* -------------------------------------------------------------------------- */
/* 3. Syntropic Labs Live Signal Ticker Player Widget                          */
/* -------------------------------------------------------------------------- */
function initTickerPlayer() {
  const btn = document.getElementById('ticker-toggle-btn');
  const btnIcon = document.getElementById('ticker-btn-icon');
  const btnText = document.getElementById('ticker-btn-text');
  const bars = document.querySelectorAll('.audio-wave-bar');

  let isPlaying = true;

  if (btn) {
    btn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      if (isPlaying) {
        if (btnIcon) btnIcon.textContent = '⏸';
        if (btnText) btnText.textContent = 'PAUSE';
        bars.forEach(bar => {
          bar.style.animationPlayState = 'running';
        });
      } else {
        if (btnIcon) btnIcon.textContent = '▶';
        if (btnText) btnText.textContent = 'RESUME';
        bars.forEach(bar => {
          bar.style.animationPlayState = 'paused';
        });
      }
    });
  }
}

/* -------------------------------------------------------------------------- */
/* 4. Typewriter Animation Engine                                              */
/* -------------------------------------------------------------------------- */
function initTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  const phrases = [
    "Founder & Quantitative Strategy @ Syntropic Labs",
    "MMathComp Mathematics & Computer Science @ Durham University",
    "High-Frequency Infrastructure & Level-2 LOB Deep Learning",
    "Continuous-Time AMM Invariant Curvature & LVR Hedging",
    "Stochastic Calculus & Exotic Derivatives Pricing (SSRN Author)"
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 50;

  function type() {
    const current = phrases[phraseIdx];

    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 22;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 50;
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
/* 5. Level-2 Limit Order Book (LOB) Live Visualizer Widget                   */
/* -------------------------------------------------------------------------- */
function initLobVisualizer() {
  const container = document.getElementById('lob-visualizer');
  if (!container) return;

  let midPrice = 64250.50;
  const levels = 6;

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

    const totalBidTop5 = bids.slice(0, 5).reduce((acc, b) => acc + b.volume, 0);
    const totalAskTop5 = asks.slice(0, 5).reduce((acc, a) => acc + a.volume, 0);
    const obi = (totalBidTop5 - totalAskTop5) / (totalBidTop5 + totalAskTop5);
    const spread = (asks[0].price - bids[0].price).toFixed(2);

    return { asks, bids, obi, spread, totalBid: cumBidVol, totalAsk: cumAskVol };
  }

  function renderLOB() {
    const delta = (Math.random() - 0.49) * 0.35;
    midPrice = Math.max(1000, midPrice + delta);

    const data = generateLOB();
    const maxCum = Math.max(data.totalAsk, data.totalBid);

    let html = `
      <div class="space-y-3 font-mono text-[11px]">
        <div class="flex items-center justify-between pb-2 border-b border-neutral-800">
          <div>
            <span class="text-neutral-400">MID: </span>
            <span class="text-cyan-400 font-bold text-sm">$${midPrice.toFixed(2)}</span>
          </div>
          <div class="text-neutral-400 text-[10px]">
            SPREAD: <span class="text-white font-semibold">$${data.spread}</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <!-- Bids -->
          <div>
            <div class="flex justify-between text-neutral-500 font-semibold mb-1 px-1 text-[10px]">
              <span>BID PX</span>
              <span>VOL</span>
            </div>
            <div class="space-y-0.5">
    `;

    data.bids.forEach((b) => {
      const pct = Math.min(100, Math.round((b.cum / maxCum) * 100));
      html += `
        <div class="relative flex justify-between px-1.5 py-0.5 rounded overflow-hidden">
          <div class="absolute inset-y-0 right-0 bg-emerald-500/20" style="width: ${pct}%;"></div>
          <span class="text-emerald-400 font-medium z-10">$${b.price}</span>
          <span class="text-neutral-200 z-10">${b.volume}</span>
        </div>
      `;
    });

    html += `
            </div>
          </div>

          <!-- Asks -->
          <div>
            <div class="flex justify-between text-neutral-500 font-semibold mb-1 px-1 text-[10px]">
              <span>ASK PX</span>
              <span>VOL</span>
            </div>
            <div class="space-y-0.5">
    `;

    data.asks.forEach((a) => {
      const pct = Math.min(100, Math.round((a.cum / maxCum) * 100));
      html += `
        <div class="relative flex justify-between px-1.5 py-0.5 rounded overflow-hidden">
          <div class="absolute inset-y-0 left-0 bg-rose-500/20" style="width: ${pct}%;"></div>
          <span class="text-rose-400 font-medium z-10">$${a.price}</span>
          <span class="text-neutral-200 z-10">${a.volume}</span>
        </div>
      `;
    });

    const obiPct = Math.round((data.obi + 1) * 50);
    const signal = data.obi > 0.15 ? 'BULLISH PRESSURE' : data.obi < -0.15 ? 'BEARISH PRESSURE' : 'BALANCED';
    const signalColor = data.obi > 0.15 ? 'text-emerald-400' : data.obi < -0.15 ? 'text-rose-400' : 'text-neutral-400';

    html += `
            </div>
          </div>
        </div>

        <div class="pt-2 border-t border-neutral-800">
          <div class="flex justify-between items-center text-[10px] text-neutral-400 mb-1">
            <span>ORDER FLOW IMBALANCE: <strong class="${signalColor}">${(data.obi * 100).toFixed(1)}%</strong></span>
            <span class="${signalColor} font-bold">${signal}</span>
          </div>
          <div class="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden flex">
            <div class="bg-rose-500 h-full transition-all duration-300" style="width: ${100 - obiPct}%;"></div>
            <div class="bg-emerald-500 h-full transition-all duration-300" style="width: ${obiPct}%;"></div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  renderLOB();
  setInterval(renderLOB, 500);
}

/* -------------------------------------------------------------------------- */
/* 6. Modern Portfolio Theory (MPT) / Efficient Frontier Slider                */
/* -------------------------------------------------------------------------- */
function initPortfolioSlider() {
  const slider = document.getElementById('risk-slider');
  const riskVal = document.getElementById('risk-val');
  const returnEl = document.getElementById('mpt-exp-return');
  const volEl = document.getElementById('mpt-vol');
  const sharpeEl = document.getElementById('mpt-sharpe');
  const barTech = document.getElementById('mpt-bar-tech');
  const barMom = document.getElementById('mpt-bar-mom');
  const barDef = document.getElementById('mpt-bar-def');
  const pctTech = document.getElementById('mpt-pct-tech');
  const pctMom = document.getElementById('mpt-pct-mom');
  const pctDef = document.getElementById('mpt-pct-def');

  if (!slider) return;

  function updateMPT() {
    const risk = parseFloat(slider.value) / 100;

    let label = 'Moderate (50%)';
    if (risk < 0.3) label = 'Conservative (' + Math.round(risk * 100) + '%)';
    else if (risk > 0.7) label = 'Aggressive (' + Math.round(risk * 100) + '%)';
    else label = 'Balanced (' + Math.round(risk * 100) + '%)';

    if (riskVal) riskVal.textContent = label;

    const wTech = Math.round((0.15 + 0.65 * Math.pow(risk, 1.2)) * 100);
    const wMom = Math.round((0.25 + 0.25 * risk) * 100);
    const wDef = Math.max(0, 100 - wTech - wMom);

    const expRet = (4.5 + 16.5 * risk).toFixed(1);
    const vol = (5.0 + 22.0 * Math.pow(risk, 0.9)).toFixed(1);
    const rf = 4.0;
    const sharpe = ((expRet - rf) / vol).toFixed(2);

    if (returnEl) returnEl.textContent = `+${expRet}%`;
    if (volEl) volEl.textContent = `${vol}%`;
    if (sharpeEl) sharpeEl.textContent = `${sharpe}`;

    if (barTech) barTech.style.width = `${wTech}%`;
    if (barMom) barMom.style.width = `${wMom}%`;
    if (barDef) barDef.style.width = `${wDef}%`;

    if (pctTech) pctTech.textContent = `${wTech}%`;
    if (pctMom) pctMom.textContent = `${wMom}%`;
    if (pctDef) pctDef.textContent = `${wDef}%`;
  }

  slider.addEventListener('input', updateMPT);
  updateMPT();
}

/* -------------------------------------------------------------------------- */
/* 7. Live Monte Carlo Asian Option Pricing Canvas                             */
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
    canvas.height = 170;
  }
  resize();
  window.addEventListener('resize', resize);

  if (volInput && volVal) {
    volInput.addEventListener('input', (e) => {
      volVal.textContent = `${e.target.value}%`;
      runSimulation();
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
    const steps = 35;
    const dt = T / steps;
    const numPaths = 35;

    // Draw background grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
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
        const u1 = Math.max(1e-7, Math.random());
        const u2 = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

        currentS = currentS * Math.exp(drift + vol * z);
        sumS += currentS;

        const px = (s / steps) * w;
        const py = strikeY - ((currentS - S0) / (S0 * 0.45)) * (h / 2);
        path.push({ x: px, y: Math.max(2, Math.min(h - 2, py)) });
      }

      const avgS = sumS / (steps + 1);
      const payoff = Math.exp(-r * T) * Math.max(0, avgS - K);
      payoffs.push(payoff);

      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.strokeStyle = currentS >= K ? 'rgba(6, 182, 212, 0.45)' : 'rgba(239, 68, 68, 0.35)';
      ctx.lineWidth = 1.1;
      ctx.stroke();
    }

    const mean = payoffs.reduce((a, b) => a + b, 0) / payoffs.length;
    const variance = payoffs.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (payoffs.length - 1);
    const se = Math.sqrt(variance / payoffs.length);
    const lowerCI = Math.max(0, mean - 1.96 * se).toFixed(2);
    const upperCI = (mean + 1.96 * se).toFixed(2);

    if (priceDisplay) priceDisplay.textContent = `$${mean.toFixed(2)}`;
    if (ciDisplay) ciDisplay.textContent = `[$${lowerCI}, $${upperCI}]`;
  }

  runBtn.addEventListener('click', runSimulation);
  runSimulation();
}

/* -------------------------------------------------------------------------- */
/* 8. macOS Terminal CLI & Formspree Socket Dispatcher                         */
/* -------------------------------------------------------------------------- */
function initTerminal() {
  const form = document.getElementById('terminal-form');
  const cliInput = document.getElementById('cli-command-input');
  const termLogs = document.getElementById('terminal-logs');
  const execBtn = document.getElementById('terminal-exec-btn');

  function log(msg, type = 'info') {
    if (!termLogs) return;
    const time = new Date().toISOString().substring(11, 19);
    let colorClass = 'text-neutral-300';
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
    row.className = `leading-relaxed text-[11px] font-mono ${colorClass}`;
    row.innerHTML = `<span class="text-neutral-500">${time}</span> <span class="font-semibold">${badge}</span> ${msg}`;
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
        log("Missing parameters: name, email, and message are required.", "error");
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
          log(`Transmission response non-200. Please contact directly via LinkedIn.`, "warn");
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

  // Interactive CLI commands
  if (cliInput) {
    cliInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = cliInput.value.trim().toLowerCase();
        cliInput.value = '';
        if (!cmd) return;

        log(`$ ${cmd}`, "cmd");

        switch (cmd) {
          case 'help':
            log("Commands: cv, syntropic, lob, hft, mpt, mc, solute, projects, skills, status, clear, contact, ping", "info");
            break;

          case 'syntropic':
          case 'syntropic labs':
            log("Redirecting to Syntropic Labs (Founder & Quantitative Strategy)...", "success");
            window.open('https://enhayi.github.io/syntropic-labs/', '_blank');
            break;

          case 'lob':
            log("Opening LOB Deep Learning Predictor Streamlit App...", "success");
            window.open('https://lob-deep-learning-predictor-aesbyklvshkmmdvtx3qwnz.streamlit.app/', '_blank');
            break;

          case 'hft':
            log("Opening HFT Simulator Streamlit App...", "success");
            window.open('https://hft-simulation-f6uvqnzvcnja5n3cqogwcz.streamlit.app/', '_blank');
            break;

          case 'mpt':
          case 'portfolio':
            log("Opening Portfolio Optimizer Streamlit App...", "success");
            window.open('https://portfolio-optimizer-wbtrwczmmhwxphwjykrut4.streamlit.app/', '_blank');
            break;

          case 'mc':
          case 'montecarlo':
            log("Opening Monte Carlo Option Pricing Streamlit App...", "success");
            window.open('https://montecarlo-optionpricing-i6w29bdadjxkffb5mzrkke.streamlit.app/', '_blank');
            break;

          case 'solute':
          case 'solute uk':
            log("Solute UK: Automated ETL pipelines (Python/SQL) handling 500k+ daily transactions, -34% batch runtime.", "info");
            break;

          case 'cv':
          case 'download cv':
            log("Opening Tarik Akarli CV (PDF)...", "success");
            window.open('./cv.pdf', '_blank');
            break;

          case 'ssrn':
          case 'papers':
            log("Opening SSRN Author Profile (ID: 13379448)...", "success");
            window.open('https://papers.ssrn.com/Sol3/Cf_Dev/AbsByAuth.cfm?per_id=13379448', '_blank');
            break;

          case 'skills':
            log("Core: Python (PyTorch, Polars, NumPy, SciPy), C++, R, SQL, Linux, CUDA 12.6, Git, LaTeX", "info");
            log("Theory: AMM Invariant Curvature, LVR Hedging, Microstructure OFI, Stochastic Control", "info");
            break;

          case 'projects':
            log("1. LOB Deep Learning Predictor (PyTorch / GPU Tick Forecast) -> lob", "info");
            log("2. Portfolio Optimizer (Markowitz Efficient Frontier & Sharpe) -> mpt", "info");
            log("3. HFT Simulator (Vectorized Avellaneda-Stoikov Market Maker) -> hft", "info");
            log("4. Monte Carlo Exotic Option Pricing (Arithmetic Asian Option) -> mc", "info");
            break;

          case 'status':
            log("STATUS: NOMINAL | LATENCY: 0.38μs | CORE: LINUX/CUDA 12.6 | SYNTROPIC NODE ACTIVE", "success");
            break;

          case 'clear':
            if (termLogs) termLogs.innerHTML = '';
            log("Terminal buffer reset. Ready for orders.", "info");
            break;

          case 'contact':
            log("Email: tarik.akarli@durham.ac.uk", "info");
            log("LinkedIn: linkedin.com/in/tarik-akarli-92688528b/", "info");
            log("GitHub: github.com/enhayi", "info");
            break;

          case 'ping':
            log("PONG 127.0.0.1: icmp_seq=1 ttl=64 time=0.012 ms", "success");
            break;

          default:
            log(`Command not recognized: "${cmd}". Type "help" for available commands.`, "warn");
            break;
        }
      }
    });
  }
}

/* -------------------------------------------------------------------------- */
/* 10. KaTeX LaTeX Formula Auto-Renderer                                       */
/* -------------------------------------------------------------------------- */
function renderAllMath() {
  if (typeof katex === 'undefined') {
    setTimeout(renderAllMath, 200);
    return;
  }

  const mathElements = document.querySelectorAll('.katex-render');
  mathElements.forEach((el) => {
    let raw = el.textContent.trim();
    if (raw.startsWith('$$') && raw.endsWith('$$')) {
      raw = raw.substring(2, raw.length - 2).trim();
    }
    try {
      katex.render(raw, el, {
        displayMode: true,
        throwOnError: false
      });
    } catch (err) {
      console.warn("KaTeX render error:", err);
    }
  });
}
