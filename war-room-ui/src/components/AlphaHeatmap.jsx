import { useMemo } from 'react'
import { useAllSqueezeScores } from '../hooks/useSqueezeScore'
import { useAllSentiments } from '../hooks/useSentiment'

/* ================================================================
   ALPHA HEATMAP — 5x4 Grid of Stock Tiles
   Each tile: ticker, price %, squeeze score
   Color: green (#00f5c4) low risk → red (#ff4560) high risk
   onClick: navigate to Deep Dive screen
   ================================================================ */

const HEATMAP_STOCKS = [
  { ticker: 'AFRM', price: 24.82, change: 8.4, sector: 'Fintech' },
  { ticker: 'SQ', price: 78.45, change: 2.1, sector: 'Payments' },
  { ticker: 'PYPL', price: 68.30, change: -1.8, sector: 'Payments' },
  { ticker: 'SHOP', price: 94.12, change: 4.6, sector: 'E-Commerce' },
  { ticker: 'TSLA', price: 172.50, change: -3.2, sector: 'EV/Auto' },
  { ticker: 'NVDA', price: 892.40, change: 1.4, sector: 'Semicon' },
  { ticker: 'AMD', price: 168.20, change: -0.8, sector: 'Semicon' },
  { ticker: 'PLTR', price: 24.60, change: 5.2, sector: 'AI/Data' },
  { ticker: 'COIN', price: 245.80, change: 6.8, sector: 'Crypto' },
  { ticker: 'HOOD', price: 18.90, change: 3.4, sector: 'Fintech' },
  { ticker: 'SOFI', price: 9.45, change: 7.2, sector: 'Fintech' },
  { ticker: 'UPST', price: 32.10, change: -4.5, sector: 'AI/Lending' },
  { ticker: 'MARA', price: 22.80, change: 9.1, sector: 'Crypto' },
  { ticker: 'RIVN', price: 14.20, change: -2.6, sector: 'EV/Auto' },
  { ticker: 'LCID', price: 3.85, change: -5.8, sector: 'EV/Auto' },
  { ticker: 'GME', price: 16.40, change: 12.3, sector: 'Retail' },
  { ticker: 'AMC', price: 5.20, change: 8.7, sector: 'Entertainment' },
  { ticker: 'BBBY', price: 0.42, change: -18.2, sector: 'Retail' },
  { ticker: 'MSTR', price: 1640.00, change: 4.2, sector: 'BTC/Tech' },
  { ticker: 'DJT', price: 28.90, change: -7.4, sector: 'Media' },
]

function getSqueezeColor(score) {
  if (score <= 33) return '#00f5c4'
  if (score <= 66) return '#f59e0b'
  return '#ff4560'
}

function getSqueezeColorOpacity(score) {
  if (score <= 33) return 'rgba(0,245,196,0.12)'
  if (score <= 66) return 'rgba(245,158,11,0.12)'
  return 'rgba(255,69,96,0.12)'
}

function getSqueezeGlow(score) {
  if (score <= 33) return '0 0 12px rgba(0,245,196,0.25)'
  if (score <= 66) return '0 0 12px rgba(245,158,11,0.25)'
  return '0 0 12px rgba(255,69,96,0.25)'
}

export default function AlphaHeatmap({ onSelectTicker }) {
  const squeezeScores = useAllSqueezeScores()
  const sentiments = useAllSentiments()

  const tiles = useMemo(() => {
    return HEATMAP_STOCKS.map(stock => {
      // Use real squeeze score for tracked tickers, generate for others
      const squeeze = squeezeScores[stock.ticker]
        ?? Math.round(Math.abs(stock.change) * 4 + Math.random() * 20)
      return { ...stock, squeeze }
    })
  }, [squeezeScores])

  return (
    <div className="glass-card heatmap-section section-animate" style={{ animationDelay: '0.15s', gridColumn: '1 / -1' }}>
      <div className="card-header">
        <span className="card-title">
          <span className="title-dot" />ALPHA HEATMAP V4
        </span>
        <span className="card-subtitle">SQUEEZE RISK MATRIX • 20 ASSETS</span>
      </div>
      <div className="card-body">
        <div className="alpha-heatmap-grid">
          {tiles.map((stock) => {
            const color = getSqueezeColor(stock.squeeze)
            const bgColor = getSqueezeColorOpacity(stock.squeeze)
            const glow = getSqueezeGlow(stock.squeeze)
            return (
              <div
                key={stock.ticker}
                className="heatmap-tile"
                style={{
                  '--tile-accent': color,
                  '--tile-bg': bgColor,
                  '--tile-glow': glow,
                  borderLeft: `3px solid ${color}`,
                }}
                onClick={() => onSelectTicker?.(stock.ticker)}
              >
                <div className="heatmap-tile-header">
                  <span className="heatmap-tile-ticker">{stock.ticker}</span>
                  <span className="heatmap-tile-sector">{stock.sector}</span>
                </div>
                <div className="heatmap-tile-price" style={{
                  color: stock.change >= 0 ? '#00f5c4' : '#ff4560'
                }}>
                  {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.change)}%
                </div>
                <div style={{ position: 'absolute', bottom: '10px', right: '12px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                  <span style={{ fontSize: '7px', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.1em' }}>SQZ</span>
                  <span style={{ fontSize: '15px', fontWeight: 700, color, lineHeight: '1' }}>
                    {stock.squeeze}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
