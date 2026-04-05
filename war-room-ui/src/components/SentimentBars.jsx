import { useState, useEffect } from 'react'
import { useAllSentiments } from '../hooks/useSentiment'

/* ================================================================
   SENTIMENT BARS — Horizontal bar chart for 5 tickers
   Bar color: positive = cyan (#38bdf8), negative = red (#ff4560)
   VADER score shown at end of bar
   ================================================================ */

const TICKERS = ['AFRM', 'SQ', 'PYPL', 'SHOP', 'TSLA']

export default function SentimentBars({ selectedTicker = null }) {
  const allScores = useAllSentiments()
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300)
    return () => clearTimeout(t)
  }, [])

  const tickers = selectedTicker ? [selectedTicker] : TICKERS

  return (
    <div className="glass-card sentiment-section section-animate" style={{ animationDelay: '0.25s' }}>
      <div className="card-header">
        <span className="card-title">
          <span className="title-accent-bar" />INSTITUTIONAL SENTIMENT V3
        </span>
        <span className="card-subtitle">VADER COMPOUND SCORES</span>
      </div>
      <div className="card-body">
        <div className="sentiment-bars-container">
          {tickers.map((ticker, i) => {
            const score = allScores[ticker] || 0
            const isPositive = score >= 0
            const color = isPositive ? '#38bdf8' : '#ff4560'
            const width = Math.abs(score) * 100

            return (
              <div className="sentiment-bar-row" key={ticker}>
                <div className="sentiment-bar-label">
                  <span className="sentiment-bar-ticker">{ticker}</span>
                  <span className="sentiment-bar-direction" style={{ color }}>
                    {isPositive ? 'BULLISH' : 'BEARISH'}
                  </span>
                </div>
                <div className="sentiment-bar-track">
                  {/* Center line */}
                  <div className="sentiment-bar-center" />
                  <div
                    className="sentiment-bar-fill"
                    style={{
                      width: animated ? `${width}%` : '0%',
                      background: color,
                      boxShadow: `0 0 10px ${color}50`,
                      [isPositive ? 'left' : 'right']: '50%',
                      transitionDelay: `${i * 0.1}s`,
                    }}
                  />
                </div>
                <span className="sentiment-bar-value" style={{
                  color,
                  textShadow: `0 0 8px ${color}40`,
                }}>
                  {score >= 0 ? '+' : ''}{score.toFixed(2)}
                </span>
              </div>
            )
          })}
        </div>

        {/* Scale */}
        <div className="sentiment-scale">
          <span>-1.0</span>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>NEUTRAL</span>
          <span>+1.0</span>
        </div>
      </div>
    </div>
  )
}
