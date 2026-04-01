import { useState, useEffect, useRef, useMemo } from 'react'
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer, Tooltip
} from 'recharts'
import './App.css'

/* ================================================================
   DATA
   ================================================================ */
const FUNDS = [
  { id: 'rentech', name: 'The Quant — RenTech', leverage: 'Very High (12–20x)', leverageClass: 'lev-high',
    factorTilt: 'Mean-Reversion / Vol Arb', sectorFocus: 'Cross-Sector (3,185 pos)',
    holdingPeriod: '3–7 days', fidelityScore: 73, color: '#00f5c4', conviction: 3, shockChange: '+12%', shockDir: 'up' },
  { id: 'bridgewater', name: 'The Macro — Bridgewater', leverage: 'Med-High (5–7.5x)', leverageClass: 'lev-med',
    factorTilt: 'Risk Parity / Debt Cycle', sectorFocus: 'All Asset Classes',
    holdingPeriod: '3–6 months', fidelityScore: 88, color: '#f59e0b', conviction: 4, shockChange: '+18%', shockDir: 'up' },
  { id: 'millennium', name: 'The Pod — Millennium', leverage: 'Very High (~7x)', leverageClass: 'lev-high',
    factorTilt: 'Market Neutral / Pairs', sectorFocus: '5 Active Pair Trades',
    holdingPeriod: '5–15 days', fidelityScore: 81, color: '#a78bfa', conviction: 4, shockChange: '+5%', shockDir: 'up' },
  { id: 'elliott', name: 'The Activist — Elliott', leverage: 'Low-Med (1.5–3x)', leverageClass: 'lev-low',
    factorTilt: 'Event-Driven / Activist', sectorFocus: 'Energy, Gold, Airlines',
    holdingPeriod: '12–18 months', fidelityScore: 94, color: '#f472b6', conviction: 5, shockChange: '+32%', shockDir: 'up' },
  { id: 'brevan', name: 'The Rates — Brevan Howard', leverage: 'Med-High (5–10x)', leverageClass: 'lev-med',
    factorTilt: 'Rates / FX / Vol', sectorFocus: '2Y/10Y Steepener + EUR/USD',
    holdingPeriod: '2–8 weeks', fidelityScore: 87, color: '#38bdf8', conviction: 4, shockChange: '-8%', shockDir: 'down' },
]

const RADAR_DATA = [
  { axis: 'EQ',      rentech: 55, bridgewater: 20, millennium: 85, elliott: 45, brevan: 10 },
  { axis: 'Fixed',   rentech: 15, bridgewater: 22, millennium: 25, elliott: 20, brevan: 92 },
  { axis: 'Cmdty',    rentech: 40, bridgewater: 85, millennium: 30, elliott: 90, brevan: 35 },
  { axis: 'FX',      rentech: 10, bridgewater: 65, millennium: 15, elliott: 10, brevan: 95 },
  { axis: 'Vol',     rentech: 70, bridgewater: 40, millennium: 45, elliott: 30, brevan: 85 },
  { axis: 'Cash',    rentech: 12, bridgewater: 15, millennium: 10, elliott: 75, brevan: 20 },
]

const DEBATE_MESSAGES = [
  { agent: 'The Quant — RenTech', fund: 'rentech', signal: 'buy',
    text: 'Oil shock triggers mean-reversion signal on XLE/XLU spread (Z-score > 2.3). VIX term structure inversion at 4.2σ — selling front-month, buying 3M. Adding KGC (already top-5). Trimming PLTR, MU on beta compression. Historical pattern: 73% hit rate on commodity-shock reversal within 5 sessions (n=47 events).',
    holding: '3–7 days', risk: '-1.8% pair / -2.5% portfolio', confidence: '73%',
    timestamp: '15:47:03', genTime: '1.4s', tag: 'STATISTICAL' },
  { agent: 'The Macro — Bridgewater', fund: 'bridgewater', signal: 'buy',
    text: 'Confirms late-cycle inflationary tightening — most dangerous macro quadrant (mirrors 1973–74). Increasing commodities to 25% risk budget. Adding TIPS + gold (GLD) to 12% allocation. Cutting US tech to underweight. Shifting equity to EM producers: Brazil (EWZ), Saudi (KSA). Risk parity rebalance: bonds 30%→22%, commodities 15%→25%.',
    holding: '3–6 months', risk: 'CPI < 3.5% YoY × 2mo', confidence: '88%',
    timestamp: '15:47:18', genTime: '2.1s', tag: 'THEMATIC' },
  { agent: 'The Pod — Millennium', fund: 'millennium', signal: 'hedge',
    text: 'Five pairs initiated. Long CVX / Short TSLA: refiner vs. EV margin squeeze. Long PSX / Short AAL: refiner spread vs. jet fuel crisis. Long XOM / Short UBER: integrated oil vs. cost pass-through lag. Long WMT / Short TGT: pricing power spread. Long GDX / Short QQQ: real assets vs. duration-sensitive tech. All confirmed dollar-neutral within ±0.5%.',
    holding: '5–15 days', risk: '-3% per pair / -3% max', confidence: '81%',
    timestamp: '15:47:26', genTime: '1.8s', tag: 'HEDGED' },
  { agent: 'The Activist — Elliott', fund: 'elliott', signal: 'buy',
    text: 'THIS IS WHAT THE $7B DRY POWDER WAS FOR. Increasing LUV to 8% — oil shock pressures airline margins, stock drops, governance pressure opportunity. New target: GE Aerospace (4% stake) — force spinoff of non-core assets. Adding TFPM to 10%, GDX 6M calls. Broad XLE at 3%. No stops — conviction positions. Ride the dislocation.',
    holding: '12–18 months', risk: 'No stop — adding on dips', confidence: '94%',
    timestamp: '15:47:41', genTime: '1.2s', tag: 'HIGH CONVICTION' },
  { agent: 'The Rates — Brevan Howard', fund: 'brevan', signal: 'sell',
    text: 'Fed pause = steeper curve. This is our sweet spot. Paying 2Y/10Y steepener — 2Y yield headed to 5.25%+. Buying 3M SOFR swaption straddles for rate vol repricing. EUR/USD short — ECB constrained by German recession. Adding 3M/6M inflation breakevens + Brent $120/$140 call spread for tail exposure. LONG VOLATILITY — this is not a low-vol environment.',
    holding: '2–8 weeks', risk: '2Y yield < 4.60%', confidence: '87%',
    timestamp: '15:47:55', genTime: '1.6s', tag: 'CONTRARIAN' },
]

const AGENTIC_13F = [
  { ticker: 'Gold / GLD / GDX',          crowded: true,  bullish: 4, divergent: false, size: 'Large',  fidelity: 92 },
  { ticker: 'Crude Oil / XLE / USO',      crowded: true,  bullish: 4, divergent: false, size: 'Large',  fidelity: 88 },
  { ticker: '2Y UST Short (ZT puts)',     crowded: true,  bullish: 3, divergent: false, size: 'Large',  fidelity: 84 },
  { ticker: 'TIPS / TIP ETF',             crowded: false, bullish: 3, divergent: false, size: 'Medium', fidelity: 90 },
  { ticker: 'LUV (Southwest Airlines)',    crowded: false, bullish: 1, divergent: false, size: 'Medium', fidelity: 94 },
  { ticker: 'TFPM (Triple Flag Gold)',     crowded: false, bullish: 1, divergent: false, size: 'Medium', fidelity: 93 },
  { ticker: 'CVX (Chevron)',              crowded: false, bullish: 2, divergent: false, size: 'Medium', fidelity: 85 },
  { ticker: 'PSX (Phillips 66)',          crowded: false, bullish: 2, divergent: false, size: 'Medium', fidelity: 89 },
  { ticker: 'EUR/USD Short',             crowded: false, bullish: 1, divergent: false, size: 'Medium', fidelity: 78 },
  { ticker: 'SOFR Swaption Straddle',    crowded: false, bullish: 1, divergent: false, size: 'Medium', fidelity: 87 },
  { ticker: 'XLE/XLU Pair Spread',       crowded: false, bullish: 1, divergent: true,  size: 'Small',  fidelity: 73 },
  { ticker: 'VIX Front/3M Spread',       crowded: false, bullish: 1, divergent: true,  size: 'Small',  fidelity: 68 },
  { ticker: 'TSLA (Short Leg)',           crowded: false, bullish: 2, divergent: false, size: 'Small',  fidelity: 81 },
  { ticker: 'AAL (Short Leg)',            crowded: false, bullish: 1, divergent: false, size: 'Small',  fidelity: 79 },
  { ticker: 'EM Producers (EWZ/KSA)',    crowded: false, bullish: 1, divergent: false, size: 'Small',  fidelity: 76 },
  { ticker: 'Brent $120/$140 Call Spread',crowded: false, bullish: 1, divergent: false, size: 'Small',  fidelity: 82 },
]

const CONSENSUS = [
  { asset: 'Gold / Precious', direction: 'LONG', confidence: 92, count: 4, color: '#00f5c4' },
  { asset: 'Crude / Energy',  direction: 'LONG', confidence: 88, count: 4, color: '#00f5c4' },
  { asset: '2Y Rates',        direction: 'SHORT', confidence: 85, count: 3, color: '#ff4560' },
  { asset: 'TIPS / Inflation', direction: 'LONG', confidence: 82, count: 3, color: '#00f5c4' },
  { asset: 'US Equities',     direction: 'UNDER', confidence: 78, count: 3, color: '#f59e0b' },
  { asset: 'Rate Vol (MOVE)', direction: 'LONG', confidence: 72, count: 2, color: '#38bdf8' },
]

const HEATMAP_DATA = [
  { label: 'EQ', dir: 'L', type: 'long' },
  { label: 'FICC', dir: 'S', type: 'short' },
  { label: 'COM', dir: 'L', type: 'long' },
  { label: 'FX', dir: 'S', type: 'short' },
  { label: 'VOL', dir: 'L', type: 'long' },
  { label: 'CSH', dir: 'N', type: 'neutral' },
]

const PRE_SHOCK_CONSENSUS = [
  { asset: 'Gold / Precious', direction: 'NEUTRAL', confidence: 68, count: 2, color: 'rgba(255,255,255,0.3)' },
  { asset: 'Crude / Energy',  direction: 'NEUTRAL', confidence: 55, count: 1, color: 'rgba(255,255,255,0.3)' },
  { asset: '2Y Rates',        direction: 'NEUTRAL', confidence: 60, count: 2, color: 'rgba(255,255,255,0.3)' },
  { asset: 'TIPS / Inflation', direction: 'NEUTRAL', confidence: 58, count: 1, color: 'rgba(255,255,255,0.3)' },
  { asset: 'US Equities',     direction: 'LONG',    confidence: 72, count: 3, color: '#00f5c4' },
  { asset: 'Rate Vol (MOVE)', direction: 'NEUTRAL', confidence: 48, count: 1, color: 'rgba(255,255,255,0.3)' },
]

const PRE_SHOCK_HEATMAP = [
  { label: 'EQ', dir: 'L', type: 'long' },
  { label: 'FICC', dir: 'N', type: 'neutral' },
  { label: 'COM', dir: 'N', type: 'neutral' },
  { label: 'FX', dir: 'N', type: 'neutral' },
  { label: 'VOL', dir: 'S', type: 'short' },
  { label: 'CSH', dir: 'N', type: 'neutral' },
]

const TICKER_ITEMS = [
  { sym: '⚠ OIL', val: '$120/BBL', cls: 'ticker-shock' },
  { sym: 'GLD', val: '+3.4%', cls: 'ticker-up', arrow: '▲' },
  { sym: 'XLE', val: '+5.8%', cls: 'ticker-up', arrow: '▲' },
  { sym: 'QQQ', val: '-2.1%', cls: 'ticker-down', arrow: '▼' },
  { sym: 'TLT', val: '-1.7%', cls: 'ticker-down', arrow: '▼' },
  { sym: 'VIX', val: '+28%', cls: 'ticker-up', arrow: '▲' },
  { sym: 'EUR/USD', val: '-0.9%', cls: 'ticker-down', arrow: '▼' },
  { sym: 'USO', val: '+8.2%', cls: 'ticker-up', arrow: '▲' },
  { sym: 'GDX', val: '+4.1%', cls: 'ticker-up', arrow: '▲' },
  { sym: 'TSLA', val: '-3.6%', cls: 'ticker-down', arrow: '▼' },
  { sym: '2Y YIELD', val: '5.18%', cls: 'ticker-up', arrow: '▲' },
  { sym: 'TIPS', val: '+1.2%', cls: 'ticker-up', arrow: '▲' },
]

const MARKET_SHOCK = "Oil prices spike to $120/bbl due to sudden Middle East supply disruption. Markets pricing CPI re-acceleration. Fed now expected to pause rate cuts."

/* ================================================================
   UTILITIES
   ================================================================ */
function getFidelityColor(score) {
  if (score >= 90) return '#00f5c4'
  if (score >= 80) return '#a78bfa'
  if (score >= 70) return '#f59e0b'
  return '#ff4560'
}

/* ================================================================
   BACKGROUND EFFECTS
   ================================================================ */
function BackgroundEffects() {
  const particles = useMemo(() =>
    Array.from({ length: 35 }, (_, i) => ({
      id: i, left: `${Math.random() * 100}%`,
      duration: `${14 + Math.random() * 22}s`, delay: `${Math.random() * 15}s`,
      size: `${1 + Math.random() * 2.5}px`, opacity: 0.06 + Math.random() * 0.12,
    })), [])
  return (
    <>
      <div className="bg-grid" />
      <div className="bg-particles">
        {particles.map(p => (
          <div key={p.id} className="particle" style={{
            left: p.left, width: p.size, height: p.size,
            animationDuration: p.duration, animationDelay: p.delay, opacity: p.opacity,
          }} />
        ))}
      </div>
    </>
  )
}

/* ================================================================
   HEADER + TICKER
   ================================================================ */
function LiveClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => { const id = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(id) }, [])
  return (
    <span className="header-clock">
      {time.toLocaleTimeString('en-US', { hour12: false })}
      <span style={{ color: 'rgba(255,255,255,0.25)', marginLeft: 8 }}>
        {time.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </span>
    </span>
  )
}

function TickerWrap() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div className="ticker-wrap">
      <div className="shock-alert-bar">
        <span className="shock-alert-dot" />
        <span className="shock-alert-text">{MARKET_SHOCK}</span>
        <span className="shock-alert-dot" />
      </div>
      <div className="ticker-tape">
        <div className="ticker-track">
          {items.map((t, i) => (
            <span className={`ticker-item ${t.cls}`} key={i}>
              <span className="ticker-sym">{t.sym}</span>
              {t.arrow && <span className="ticker-arrow">{t.arrow}</span>}
              <span className="ticker-val">{t.val}</span>
              <span className="ticker-sep">│</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ================================================================
   Fix 4: HERO BANNER — with Threat Level SVG Dial
   ================================================================ */
function ThreatDial({ level = 7, max = 10 }) {
  const r = 26; const cx = 32; const cy = 32;
  const startAngle = -225; const endAngle = 45;
  const totalAngle = endAngle - startAngle;
  const filledAngle = startAngle + (level / max) * totalAngle;

  function polarToCart(angle) {
    const rad = (angle * Math.PI) / 180
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  }

  const bgStart = polarToCart(startAngle); const bgEnd = polarToCart(endAngle);
  const fillEnd = polarToCart(filledAngle);
  const bgLargeArc = totalAngle > 180 ? 1 : 0;
  const fillDeg = filledAngle - startAngle;
  const fillLargeArc = fillDeg > 180 ? 1 : 0;

  return (
    <svg width="64" height="64" viewBox="0 0 64 64">
      {/* Background arc */}
      <path
        d={`M ${bgStart.x} ${bgStart.y} A ${r} ${r} 0 ${bgLargeArc} 1 ${bgEnd.x} ${bgEnd.y}`}
        fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" strokeLinecap="round"
      />
      {/* Filled arc */}
      <path
        d={`M ${bgStart.x} ${bgStart.y} A ${r} ${r} 0 ${fillLargeArc} 1 ${fillEnd.x} ${fillEnd.y}`}
        fill="none" stroke="url(#threatGrad)" strokeWidth="5" strokeLinecap="round"
        style={{ filter: 'drop-shadow(0 0 6px rgba(255,69,96,0.5))' }}
      />
      <defs>
        <linearGradient id="threatGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ff4560" />
        </linearGradient>
      </defs>
      <text x="32" y="36" textAnchor="middle" fill="white" fontSize="18" fontWeight="700" fontFamily="Inter">
        {level}
      </text>
      <text x="32" y="46" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="7" fontWeight="600" fontFamily="Inter">
        /{max}
      </text>
    </svg>
  )
}

function HeroBanner() {
  return (
    <div className="hero-banner section-animate" style={{ animationDelay: '0.05s' }}>
      <div className="hero-left">
        <div className="hero-label">Oil Shock Scenario</div>
        <div className="hero-value">BRENT CRUDE → $120/BBL</div>
      </div>
      <div className="hero-center">
        <div className="hero-pill pill-amber">
          <span className="hero-pill-dot" />
          CPI Reacceleration Risk
        </div>
        <div className="hero-pill pill-red">
          <span className="hero-pill-dot" />
          Fed Pause Priced In
        </div>
        <div className="hero-pill pill-cyan">
          <span className="hero-pill-dot" />
          5 Agents Rebalancing
        </div>
      </div>
      <div className="hero-right">
        <div>
          <div className="threat-label">Threat Level</div>
          <div className="threat-sublabel">Systemic Risk</div>
        </div>
        <ThreatDial level={7} max={10} />
      </div>
    </div>
  )
}

/* ================================================================
   Fix 1: STRATEGY DNA — Dense + Conviction + Post-Shock
   ================================================================ */
function ConvictionMeter({ level, color }) {
  return (
    <div className="conviction-meter">
      {[0,1,2,3,4].map(i => (
        <div key={i}
          className={`conviction-sq ${i < level ? 'filled' : 'empty'}`}
          style={i < level ? { background: color, color: color } : {}}
        />
      ))}
    </div>
  )
}

function StrategyDNA() {
  return (
    <div className="glass-card strategy-section section-animate" style={{ animationDelay: '0.1s' }}>
      <div className="card-header">
        <span className="card-title"><span className="title-accent-bar" />Strategy DNA</span>
        <span className="card-subtitle">5 Agents Active • Post-Shock</span>
      </div>
      <div className="card-body">
        <div className="strategy-grid">
          {FUNDS.map(f => (
            <div className="dna-card" data-fund={f.id} key={f.id}>
              <div className="shimmer-overlay" />
              <div className="dna-fund-name">{f.name}</div>
              <ConvictionMeter level={f.conviction} color={f.color} />
              <div className="dna-row">
                <span className="dna-label">Leverage</span>
                <span className={`leverage-pill ${f.leverageClass}`}>{f.leverage}</span>
              </div>
              <div className="dna-row">
                <span className="dna-label">Factor</span>
                <span className="dna-value">{f.factorTilt}</span>
              </div>
              <div className="dna-row">
                <span className="dna-label">Focus</span>
                <span className="dna-value">{f.sectorFocus}</span>
              </div>
              <div className="dna-row">
                <span className="dna-label">Holding</span>
                <span className="dna-value">{f.holdingPeriod}</span>
              </div>
              <div className="post-shock-row">
                <span className="post-shock-label">POST-SHOCK CHANGE</span>
                <div className={`post-shock-value ${f.shockDir}`}>
                  {f.shockDir === 'up' ? '▲' : '▼'} {f.shockChange}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ================================================================
   Fix 2: RADAR — Polygon + Center Label + Vertical Legend
   ================================================================ */
function RadarTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'rgba(8,12,24,0.92)', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 12, padding: '10px 16px', backdropFilter: 'blur(16px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
    }}>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontSize: 11, fontWeight: 600, marginBottom: 2, textShadow: `0 0 6px ${p.color}40` }}>
          {p.name}: {p.value}%
        </div>
      ))}
    </div>
  )
}

function ConsensusRadar() {
  const truncLabel = (value) => value.length > 8 ? value.slice(0, 8) + '…' : value
  return (
    <div className="glass-card radar-section section-animate" style={{ animationDelay: '0.2s' }}>
      <div className="card-header">
        <span className="card-title"><span className="title-dot" />Consensus Positioning Radar</span>
        <span className="card-subtitle">Post-Shock Rebalance</span>
      </div>
      <div className="card-body">
        <div className="radar-container" style={{ position: 'relative' }}>
          <div className="radar-center-label">6 Dimensions</div>
          <div style={{ width: '100%', overflow: 'visible', padding: '0 20px' }}>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={RADAR_DATA} cx="50%" cy="50%" outerRadius={100} margin={{ top: 30, right: 40, bottom: 30, left: 40 }} width="100%" height={300}>
                <PolarGrid gridType="polygon" stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="axis" tickSize={20} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.7)' }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="The Quant" dataKey="rentech" stroke="#00f5c4" fill="#00f5c4" fillOpacity={0.08} strokeWidth={2} dot={{ fill: '#00f5c4', r: 4, strokeWidth: 0 }} legendType="none" style={{ filter: 'drop-shadow(0 0 6px #00f5c4)' }} />
                <Radar name="The Macro" dataKey="bridgewater" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.06} strokeWidth={2} dot={{ fill: '#f59e0b', r: 4, strokeWidth: 0 }} legendType="none" style={{ filter: 'drop-shadow(0 0 6px #f59e0b)' }} />
                <Radar name="The Pod" dataKey="millennium" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.06} strokeWidth={2} dot={{ fill: '#a78bfa', r: 4, strokeWidth: 0 }} legendType="none" style={{ filter: 'drop-shadow(0 0 6px #a78bfa)' }} />
                <Radar name="The Activist" dataKey="elliott" stroke="#f472b6" fill="#f472b6" fillOpacity={0.06} strokeWidth={2} dot={{ fill: '#f472b6', r: 4, strokeWidth: 0 }} legendType="none" style={{ filter: 'drop-shadow(0 0 6px #f472b6)' }} />
                <Radar name="The Rates" dataKey="brevan" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.06} strokeWidth={2} dot={{ fill: '#38bdf8', r: 4, strokeWidth: 0 }} legendType="none" style={{ filter: 'drop-shadow(0 0 6px #38bdf8)' }} />
                <Tooltip content={<RadarTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="radar-legend-row">
          {FUNDS.map(f => (
            <div className="legend-item-h" key={f.id}>
              <div className="legend-line-h" style={{ background: f.color, boxShadow: `0 0 6px ${f.color}` }} />
              {f.name.split('—')[0].trim()}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ================================================================
   Fix 5: CONSENSUS POSITIONING — Exposure Bars + Shift
   ================================================================ */
function AgentDots({ count }) {
  return (
    <div className="agent-dots">
      {[0,1,2,3,4].map(i => (
        <div key={i} className={`agent-dot ${i < count ? 'active' : 'inactive'}`} />
      ))}
    </div>
  )
}

function ConsensusPositioning() {
  const [scenario, setScenario] = useState('post')
  const isPost = scenario === 'post'
  const activeConsensus = isPost ? CONSENSUS : PRE_SHOCK_CONSENSUS
  const activeHeatmap = isPost ? HEATMAP_DATA : PRE_SHOCK_HEATMAP

  return (
    <div className="glass-card consensus-section section-animate" style={{ animationDelay: '0.25s' }}>
      <div className="card-header">
        <span className="card-title"><span className="title-accent-bar" />Consensus Positioning</span>
        <span className="card-subtitle">War Room Output</span>
      </div>
      <div className="card-body">
        {/* Scenario Toggle */}
        <div className="scenario-toggle">
          <button className={`scenario-btn ${!isPost ? 'active' : ''}`} onClick={() => setScenario('pre')}>
            {!isPost && <div className="active-dot" />} PRE-SHOCK
          </button>
          <button className={`scenario-btn ${isPost ? 'active' : ''}`} onClick={() => setScenario('post')}>
            {isPost && <div className="active-dot" />} POST-SHOCK
          </button>
        </div>

        {/* Positioning Heatmap Strip */}
        <div className="heatmap-strip-section">
          <div className="heatmap-strip-header">
            <div className="heatmap-strip-title">Net Exposure Snapshot</div>
            <div className="heatmap-strip-subtitle">{isPost ? 'Post-Shock' : 'Pre-Shock'} | 5 Agent Consensus</div>
          </div>
          <div className="heatmap-strip">
            {activeHeatmap.map((h, i) => {
              const styles = h.type === 'long'
                ? { background: 'rgba(0,245,196,0.15)', border: '1px solid #00f5c4', color: '#00f5c4' }
                : h.type === 'short'
                ? { background: 'rgba(255,69,96,0.15)', border: '1px solid #ff4560', color: '#ff4560' }
                : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.35)' }
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                  <div className="heatmap-sq" style={{ background: styles.background, border: styles.border }}>
                    <span className="heatmap-sq-letter" style={{ color: styles.color }}>{h.dir}</span>
                  </div>
                  <span className="heatmap-sq-label">{h.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="consensus-grid">
          {activeConsensus.map((c, i) => (
            <div className="consensus-row" key={i}>
              <span className="consensus-asset">{c.asset}</span>
              <span className={`direction-pill dir-${c.direction.toLowerCase()}`}>{c.direction}</span>
              <AgentDots count={c.count} />
              <div className="conf-bar-wrap">
                <div className="conf-bar-track">
                  <div className="conf-bar-fill" style={{ width: `${c.confidence}%`, background: c.color, boxShadow: `0 0 10px ${c.color}50`, transition: 'width 0.6s ease-out' }} />
                </div>
                <span className="conf-value" style={{ color: c.color, textShadow: `0 0 8px ${c.color}40` }}>{c.confidence}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Signal tag groups */}
        {isPost ? (
          <>
            <div className="tag-group tag-group-crowded">
              <div className="tag-group-label">🟢 Crowded Longs</div>
              <div className="tag-group-items">
                <span className="glass-pill pill-cyan">Gold/GDX 4/5</span>
                <span className="glass-pill pill-cyan">Oil/XLE 4/5</span>
                <span className="glass-pill pill-cyan">Short 2Y 3/5</span>
                <span className="glass-pill pill-cyan">TIPS 3/5</span>
              </div>
            </div>
            <div className="tag-group tag-group-divergent">
              <div className="tag-group-label">⚡ Divergent Alpha (Quant Only)</div>
              <div className="tag-group-items">
                <span className="glass-pill pill-amber">XLE/XLU Spread</span>
                <span className="glass-pill pill-amber">VIX Term Structure</span>
                <span className="glass-pill pill-amber">Beta Compression</span>
              </div>
            </div>
            <div className="tag-group tag-group-fade">
              <div className="tag-group-label">🔄 Fade Signal</div>
              <div className="tag-group-items">
                <span className="glass-pill pill-red">Airlines: Pod SHORT AAL ↔ Activist LONG LUV</span>
              </div>
            </div>
          </>
        ) : (
          <div className="tag-group" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '14px 16px', borderRadius: 10 }}>
            <div className="tag-group-label" style={{ color: 'rgba(255,255,255,0.3)' }}>— No Crowding Detected</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 6 }}>Standard positioning — no macro catalyst active</div>
          </div>
        )}

        {/* Consensus shift */}
        <div className="consensus-shift">
          <span className="consensus-shift-label">Consensus Shift</span>
          {isPost ? (
            <>
              <span className="consensus-shift-arrow" style={{ color: '#ff4560' }}>⬇</span>
              <span className="consensus-shift-value" style={{ color: '#ff4560' }}>RISK-OFF +24%</span>
            </>
          ) : (
            <>
              <span className="consensus-shift-arrow" style={{ color: 'rgba(255,255,255,0.3)' }}>↔</span>
              <span className="consensus-shift-value" style={{ color: 'rgba(255,255,255,0.35)' }}>RISK-NEUTRAL +0%</span>
            </>
          )}
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}>{isPost ? 'vs. pre-shock baseline' : 'baseline positioning'}</span>
        </div>
      </div>
    </div>
  )
}

/* ================================================================
   Fix 6: DEBATE FEED — Timestamps, Tags, Scanning Loader
   ================================================================ */
function DebateFeed() {
  const feedRef = useRef(null)
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleCount(prev => {
        if (prev >= DEBATE_MESSAGES.length) { clearInterval(timer); return prev }
        return prev + 1
      })
    }, 900)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight
  }, [visibleCount])

  return (
    <div className="glass-card debate-section section-animate" style={{ animationDelay: '0.35s' }}>
      <div className="card-header">
        <span className="card-title"><span className="title-dot" />War Room Debate Feed</span>
        <span className="card-subtitle" style={{ 
          color: visibleCount === 5 ? '#ffffff' : 'rgba(255,255,255,0.3)',
          transition: 'color 0.3s'
        }}>{visibleCount}/5 MEMOS</span>
      </div>
      <div className="card-body">
        <div className="debate-feed" ref={feedRef}>
          {DEBATE_MESSAGES.slice(0, visibleCount).map((msg, i) => {
            const fund = FUNDS.find(f => f.id === msg.fund)
            return (
              <div className="memo-card" data-fund={msg.fund} key={i}>
                <div className="memo-header">
                  <div className="memo-header-left">
                    <span className="memo-agent-name" style={{ color: fund?.color }}>{msg.agent}</span>
                    <span className="memo-timestamp">{msg.timestamp}</span>
                  </div>
                  <div className="memo-header-right">
                    <span className="memo-gen-time">🧠 {msg.genTime}</span>
                    <span className={`signal-badge badge-${msg.signal}`}>{msg.signal}</span>
                  </div>
                </div>
                <div className="memo-text">{msg.text}</div>
                <div className="memo-reactions">
                  <span className="reaction-tag">{msg.tag}</span>
                  {msg.signal === 'buy' && <span className="reaction-tag">RISK-ON</span>}
                  {msg.signal === 'sell' && <span className="reaction-tag">RISK-OFF</span>}
                  {msg.signal === 'hedge' && <span className="reaction-tag">NEUTRAL</span>}
                </div>
                <div className="memo-footer">
                  <span className="memo-chip">⏱ {msg.holding}</span>
                  <span className="memo-chip">🛡 {msg.risk}</span>
                  <span className="memo-fidelity-chip" style={{
                    color: fund?.color, border: `1px solid ${fund?.color}40`,
                    textShadow: `0 0 8px ${fund?.color}60`,
                  }}>📊 {msg.confidence}</span>
                </div>
              </div>
            )
          })}
          {FUNDS.slice(visibleCount).map((fund, idx) => (
            <div className="memo-card awaiting-card" key={`awaiting-${idx}`} style={{ borderLeftColor: fund.color, opacity: 0.6, animation: 'radarPulse 2s infinite' }}>
              <div className="memo-header" style={{ marginBottom: 0 }}>
                <div className="memo-header-left">
                  <span className="memo-agent-name" style={{ color: fund.color }}>{fund.name}</span>
                </div>
              </div>
              <div className="awaiting-loader" style={{ textAlign: 'left', padding: '16px 0 4px', fontSize: 11, letterSpacing: '0.1em', animation: 'none' }}>
                <div className="scan-line-wrap" style={{ display: 'inline-block', width: 24, marginRight: 10, verticalAlign: 'middle' }}><div className="scan-line" /></div>
                AWAITING {fund.name.split('—')[0].trim().toUpperCase()} RESPONSE...
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ================================================================
   Fix 3: AGENTIC 13F TABLE — Square indicators + tooltips
   ================================================================ */
function BullishSquares({ count }) {
  return (
    <div className="bullish-squares">
      {[0,1,2,3,4].map(i => (
        <div key={i} className={`bullish-sq ${i < count ? 'filled' : 'empty'}`} />
      ))}
    </div>
  )
}

function Agentic13FTable() {
  return (
    <div className="glass-card table-section section-animate" style={{ animationDelay: '0.4s' }}>
      <div className="card-header">
        <span className="card-title"><span className="title-accent-bar" />Agentic 13F — Projected Holdings</span>
        <span className="card-subtitle">Alpha Extractor Output • {AGENTIC_13F.length} Positions</span>
      </div>
      <div style={{ padding: 0, overflowX: 'auto' }}>
        <table className="agentic-table">
          <thead>
            <tr>
              <th title="Asset name or ticker symbol">Asset / Ticker</th>
              <th title="3+ agents agree on buying">Crowded Long</th>
              <th title="Number of agents with bullish positioning out of 5"># Bullish</th>
              <th title="Only the Quant agent is bullish — unique signal">Divergent α</th>
              <th title="Projected position size based on fund behavior">Proj. Size</th>
              <th title="Historical behavior match score (0-100)" style={{ textAlign: 'right' }}>Fidelity Score</th>
            </tr>
          </thead>
          <tbody>
            {AGENTIC_13F.map((row, i) => {
              const fidColor = getFidelityColor(row.fidelity)
              return (
                <tr key={i}>
                  <td className="ticker-cell">{row.ticker}</td>
                  <td>{row.crowded ? <span className="crowded-badge crowded-yes">● YES</span> : <span className="crowded-badge crowded-no">—</span>}</td>
                  <td>
                    <div className="bullish-cell">
                      <span className="bullish-text" style={{
                        color: row.bullish >= 4 ? '#00f5c4' : row.bullish >= 3 ? '#38bdf8' : row.bullish >= 2 ? '#a78bfa' : 'rgba(255,255,255,0.35)'
                      }}>{row.bullish}/5</span>
                      <BullishSquares count={row.bullish} />
                    </div>
                  </td>
                  <td>{row.divergent ? <span className="divergent-badge div-yes">⚡ YES</span> : <span className="divergent-badge div-no">—</span>}</td>
                  <td><span className={`size-pill size-${row.size.toLowerCase()}`}>{row.size}</span></td>
                  <td>
                    <div className="fidelity-inline">
                      <div className="fidelity-mini-bar">
                        <div className="fidelity-mini-fill" style={{ width: `${row.fidelity}%`, background: fidColor, boxShadow: `0 0 6px ${fidColor}50` }} />
                      </div>
                      <span className="fidelity-num" style={{ color: fidColor, textShadow: `0 0 8px ${fidColor}40` }}>{row.fidelity}</span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="fidelity-tier-legend" style={{ padding: '0 16px 14px' }}>
          <div className="fidelity-tier-item"><div className="fidelity-tier-sq" style={{ background: '#00f5c4' }} />90+ Elite</div>
          <div className="fidelity-tier-item"><div className="fidelity-tier-sq" style={{ background: '#a78bfa' }} />80-89 Strong</div>
          <div className="fidelity-tier-item"><div className="fidelity-tier-sq" style={{ background: '#f59e0b' }} />70-79 Moderate</div>
        </div>
      </div>
    </div>
  )
}

/* ================================================================
   FIDELITY SCORE BARS
   ================================================================ */
function FidelityScores() {
  const [animated, setAnimated] = useState(false)
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 600); return () => clearTimeout(t) }, [])
  const sorted = [...FUNDS].sort((a, b) => b.fidelityScore - a.fidelityScore)

  return (
    <div className="glass-card fidelity-section section-animate" style={{ animationDelay: '0.5s' }}>
      <div className="card-header">
        <span className="card-title"><span className="title-accent-bar" />Agent Fidelity Scores</span>
        <span className="card-subtitle">Historical Behavior Match</span>
      </div>
      <div className="card-body">
        <div className="fidelity-bars">
          {sorted.map((f, i) => {
            const barColor = getFidelityColor(f.fidelityScore)
            return (
              <div className="fidelity-row" key={f.id}>
                <div className="fidelity-agent-label">
                  <div className="fidelity-agent-dot" style={{ background: f.color, boxShadow: `0 0 8px ${f.color}` }} />
                  <span className="fidelity-agent-name">{f.name.split('—')[0].trim()}</span>
                </div>
                <div className="fidelity-bar-track">
                  <div className="fidelity-tick" style={{ left: '70%' }}>
                    <span className="fidelity-tick-label" style={{ left: 0 }}>70</span>
                  </div>
                  <div className="fidelity-tick" style={{ left: '80%' }}>
                    <span className="fidelity-tick-label" style={{ left: 0 }}>80</span>
                  </div>
                  <div className="fidelity-tick" style={{ left: '90%' }}>
                    <span className="fidelity-tick-label" style={{ left: 0 }}>90</span>
                  </div>
                  <div className="fidelity-bar-fill" style={{
                    width: animated ? `${f.fidelityScore}%` : '0%',
                    background: `linear-gradient(90deg, ${barColor}90, ${barColor})`,
                    boxShadow: `0 0 10px ${barColor}99, 0 0 20px ${barColor}40`,
                    transitionDelay: `${i * 0.15}s`,
                  }}>
                    <span className="score-inside" style={{ color: barColor, textShadow: `0 0 8px ${barColor}` }}>{f.fidelityScore}</span>
                  </div>
                </div>
                <span className="fidelity-score-ext" style={{ color: barColor, textShadow: `0 0 10px ${barColor}60` }}>{f.fidelityScore}%</span>
              </div>
            )
          })}
        </div>
        <div className="methodology-note">
          <strong>Methodology:</strong> Fidelity scores cross-reference each agent's positioning against documented fund behavior during analogous shocks (2008, 2020, 2022, 2023 SVB). Weighted: directional alignment (40%), instrument selection (35%), sizing/risk management (25%). Elliott scores highest (94%) — Singer's "fortress + dry powder deployment" pattern is extensively documented and the agent's response mirrors it precisely.
        </div>
      </div>
    </div>
  )
}

/* ================================================================
   MAIN APP
   ================================================================ */
export default function App() {
  return (
    <>
      <BackgroundEffects />
      <div className="app-shell">
        <header className="war-room-header">
          <div className="header-left"><div className="header-logo">WAR ROOM</div></div>
          <div className="header-center">
            <div className="shock-dot" />
            <span className="shock-badge">Market Shock Active</span>
          </div>
          <div className="header-right">
            <LiveClock />
            <div className="pipeline-status"><div className="pipeline-dot" />Pipeline Complete</div>
          </div>
        </header>

        <TickerWrap />
        <HeroBanner />

        <main className="war-room-grid">
          <StrategyDNA />
          <div className="section-divider" />
          <ConsensusRadar />
          <ConsensusPositioning />
          <div className="section-divider" />
          <DebateFeed />
          <div className="section-divider" />
          <Agentic13FTable />
          <div className="section-divider" />
          <FidelityScores />
        </main>

        <footer className="war-room-footer">
          <span>Pipeline: Research Orchestrator → 5 Agents (parallel) → War Room Moderator → Alpha Extractor</span>
          <div className="footer-status">
            <span style={{ marginRight: 16 }}>Source: SEC EDGAR 13F (Q4 2025) • Investor Letters</span>
            <span className="status-nominal"><span className="status-dot" />ALL SYSTEMS NOMINAL</span>
          </div>
        </footer>
      </div>
    </>
  )
}
