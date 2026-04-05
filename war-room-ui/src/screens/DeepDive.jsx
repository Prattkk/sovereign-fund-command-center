import { useMemo } from 'react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import ShortInterestChart from '../components/ShortInterestChart'
import SentimentBars from '../components/SentimentBars'
import Newsfeed from '../components/Newsfeed'
import SqueezeGauge from '../components/SqueezeGauge'
import { useSqueezeScore } from '../hooks/useSqueezeScore'
import { useSentiment } from '../hooks/useSentiment'
import mirror13f from '../data/mirror13f.json'

/* ================================================================
   DEEP DIVE SCREEN — Single-stock terminal
   Opens when a heatmap tile is clicked
   ================================================================ */

const STOCK_PRICES = {
  AFRM: { price: 24.82, change: 8.4, high: 26.10, low: 22.40, vol: '42.8M', avgVol: '18.2M', mktCap: '7.8B' },
  SQ: { price: 78.45, change: 2.1, high: 80.20, low: 76.30, vol: '12.4M', avgVol: '9.8M', mktCap: '45.2B' },
  PYPL: { price: 68.30, change: -1.8, high: 70.15, low: 67.80, vol: '18.6M', avgVol: '14.2M', mktCap: '72.4B' },
  SHOP: { price: 94.12, change: 4.6, high: 96.40, low: 89.50, vol: '8.9M', avgVol: '6.1M', mktCap: '118.5B' },
  TSLA: { price: 172.50, change: -3.2, high: 180.90, low: 170.10, vol: '98.4M', avgVol: '72.1M', mktCap: '548.2B' },
}

export default function DeepDive({ ticker, onBack }) {
  const { score: squeezeScore, latest: siData } = useSqueezeScore(ticker)
  const { score: sentiment, detail: sentimentDetail } = useSentiment(ticker)

  const stock = STOCK_PRICES[ticker] || { price: 0, change: 0, high: 0, low: 0, vol: '0', avgVol: '0', mktCap: '0' }
  const isPositive = stock.change >= 0

  // Get 13F data for this ticker
  const mirror = useMemo(() =>
    mirror13f.filter(d => d.ticker === ticker && d.shares > 0),
    [ticker]
  )

  return (
    <div className="deep-dive-screen">
      {/* Back button */}
      <div className="deep-dive-back" onClick={onBack}>
        <span className="deep-dive-back-arrow">←</span>
        <span>BACK TO OVERVIEW</span>
      </div>

      {/* Asset Header */}
      <div className="deep-dive-header glass-card section-animate">
        <div className="deep-dive-ticker-block">
          <div className="deep-dive-ticker">{ticker}</div>
          <div className="deep-dive-price" style={{ color: isPositive ? '#00f5c4' : '#ff4560' }}>
            ${stock.price.toFixed(2)}
            <span className="deep-dive-change">
              {isPositive ? '▲' : '▼'} {Math.abs(stock.change)}%
            </span>
          </div>
        </div>
        <div className="deep-dive-stats">
          <div className="deep-dive-stat">
            <span className="deep-dive-stat-label">HIGH</span>
            <span className="deep-dive-stat-value">${stock.high}</span>
          </div>
          <div className="deep-dive-stat">
            <span className="deep-dive-stat-label">LOW</span>
            <span className="deep-dive-stat-value">${stock.low}</span>
          </div>
          <div className="deep-dive-stat">
            <span className="deep-dive-stat-label">VOLUME</span>
            <span className="deep-dive-stat-value">{stock.vol}</span>
          </div>
          <div className="deep-dive-stat">
            <span className="deep-dive-stat-label">AVG VOL</span>
            <span className="deep-dive-stat-value">{stock.avgVol}</span>
          </div>
          <div className="deep-dive-stat">
            <span className="deep-dive-stat-label">MKT CAP</span>
            <span className="deep-dive-stat-value">${stock.mktCap}</span>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="war-room-grid">
        {/* Short Interest Chart */}
        <ShortInterestChart selectedTicker={ticker} />

        {/* Squeeze Gauge */}
        <SqueezeGauge score={squeezeScore} label={`${ticker} SQUEEZE INDEX`} />

        {/* Right Column Stats */}
        <div className="glass-card section-animate" style={{ padding: '20px', borderLeft: '3px solid #ff4560', animationDelay: '0.2s', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', color: '#ff4560', marginBottom: '20px' }}>
            SQUEEZE CATALYST SUMMARY
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '9px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '2px' }}>BORROW RATE</div>
            <div style={{ color: '#ff4560', fontSize: '22px', fontWeight: 'bold' }}>42%</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>Cost to Borrow — 6-month high</div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '9px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '2px' }}>DAYS TO COVER</div>
            <div style={{ color: '#f59e0b', fontSize: '22px', fontWeight: 'bold' }}>7.1</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>Elevated — squeeze window open</div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '9px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '2px' }}>SHORT INTEREST</div>
            <div style={{ color: '#ff4560', fontSize: '22px', fontWeight: 'bold' }}>31%</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>% Float — critical threshold exceeded</div>
          </div>

          <div style={{ marginBottom: '0px' }}>
            <div style={{ fontSize: '9px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '2px' }}>SQUEEZE PROBABILITY</div>
            <div style={{ color: '#00f5c4', fontSize: '22px', fontWeight: 'bold' }}>74.8%</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>AI Model Confidence</div>
          </div>
        </div>

        <div className="section-divider" />

        {/* Sentiment */}
        <SentimentBars selectedTicker={ticker} />

        {/* 13F Mirror Pod */}
        <div className="glass-card mirror-section section-animate" style={{ animationDelay: '0.3s' }}>
          <div className="card-header">
            <span className="card-title"><span className="title-accent-bar" />{ticker} INSTITUTIONAL FLOW</span>
            <span className="card-subtitle">13F MIRROR POD</span>
          </div>
          <div className="card-body">
            {mirror.length > 0 ? (
              <div className="mirror-grid">
                {mirror.map((d, i) => (
                  <div className="mirror-row" key={i}>
                    <span className="mirror-fund">{d.fund}</span>
                    <span className="mirror-shares">
                      {(d.shares / 1000000).toFixed(1)}M shares
                    </span>
                    <span className="mirror-change" style={{
                      color: d.changePercent >= 0 ? '#00f5c4' : '#ff4560'
                    }}>
                      {d.changePercent >= 0 ? '+' : ''}{d.changePercent}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: 20, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 11, letterSpacing: '0.1em' }}>
                NO INSTITUTIONAL POSITIONS DETECTED
              </div>
            )}

            {/* Short Interest Summary */}
            {siData && (
              <div className="si-summary">
                <div className="si-summary-item">
                  <span className="si-summary-label">SHORT INTEREST</span>
                  <span className="si-summary-value">{(siData.shortInterest / 1000000).toFixed(1)}M</span>
                </div>
                <div className="si-summary-item">
                  <span className="si-summary-label">% FLOAT</span>
                  <span className="si-summary-value" style={{
                    color: siData.percentFloat > 20 ? '#ff4560' : siData.percentFloat > 10 ? '#f59e0b' : '#00f5c4'
                  }}>{siData.percentFloat}%</span>
                </div>
                <div className="si-summary-item">
                  <span className="si-summary-label">DAYS TO COVER</span>
                  <span className="si-summary-value" style={{
                    color: siData.daysToCover > 5 ? '#ff4560' : siData.daysToCover > 3 ? '#f59e0b' : '#00f5c4'
                  }}>{siData.daysToCover}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* News Feed (full span) */}
        <Newsfeed ticker={ticker} />

        {/* Governor Insight */}
        <div style={{
          gridColumn: '1 / -1',
          background: 'rgba(0,245,196,0.05)',
          borderLeft: '3px solid #00f5c4',
          borderRadius: '4px',
          padding: '16px 20px',
          marginTop: '8px'
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#00f5c4', marginBottom: 6 }}>
            GOVERNOR INSIGHT
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
            {ticker} shows classic pre-squeeze setup: SI at 31%, borrow rate 42%, institutional accumulation accelerating. High probability forced covering event.
          </div>
        </div>
      </div>
    </div>
  )
}
