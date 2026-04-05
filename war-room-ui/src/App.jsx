import { useState, useEffect, useMemo } from 'react'
import Navigation from './components/Navigation'
import GlobalOverview from './screens/GlobalOverview'
import DeepDive from './screens/DeepDive'
import AgentWarRoom from './screens/AgentWarRoom'
import './App.css'

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
   LIVE CLOCK
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

/* ================================================================
   MAIN APP — Router + Shell
   ================================================================ */
export default function App() {
  const [activeScreen, setActiveScreen] = useState('overview')
  const [selectedTicker, setSelectedTicker] = useState(null)

  function handleSelectTicker(ticker) {
    setSelectedTicker(ticker)
    setActiveScreen('deepdive')
  }

  function handleBack() {
    setActiveScreen('overview')
    setSelectedTicker(null)
  }

  function handleNavigate(screen) {
    setActiveScreen(screen)
    if (screen !== 'deepdive') {
      setSelectedTicker(null)
    }
  }

  return (
    <>
      <BackgroundEffects />
      <div className="app-shell">
        <header className="war-room-header">
          <div className="header-left"><div className="header-logo">SOVEREIGN FUND</div></div>
          <div className="header-center">
            <div className="shock-dot" />
            <span className="shock-badge">Market Shock Active</span>
          </div>
          <div className="header-right">
            <LiveClock />
            <div className="pipeline-status"><div className="pipeline-dot" />Pipeline Complete</div>
          </div>
        </header>

        <Navigation
          activeScreen={activeScreen}
          onNavigate={handleNavigate}
          selectedTicker={selectedTicker}
        />

        <div className="screen-container">
          {activeScreen === 'overview' && (
            <GlobalOverview onSelectTicker={handleSelectTicker} />
          )}
          {activeScreen === 'deepdive' && (
            <DeepDive
              ticker={selectedTicker || 'AFRM'}
              onBack={handleBack}
            />
          )}
          {activeScreen === 'warroom' && (
            <AgentWarRoom />
          )}
        </div>

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
