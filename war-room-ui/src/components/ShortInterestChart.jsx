import { useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Legend
} from 'recharts'
import shortInterestData from '../data/shortInterest.json'

/* ================================================================
   SHORT INTEREST CHART — Recharts Line Chart
   Red danger line at 20% float
   Tooltip showing exact values on hover
   ================================================================ */

const TICKER_COLORS = {
  AFRM: '#00f5c4',
  SQ: '#a78bfa',
  PYPL: '#38bdf8',
  SHOP: '#f59e0b',
  TSLA: '#f472b6',
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'rgba(8,12,24,0.92)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 12,
      padding: '12px 16px',
      backdropFilter: 'blur(16px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    }}>
      <div style={{
        fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)',
        marginBottom: 8,
      }}>
        {label}
      </div>
      {payload.map((p, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          marginBottom: 4,
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: 2,
            background: p.color, boxShadow: `0 0 4px ${p.color}`,
          }} />
          <span style={{ color: p.color, fontSize: 11, fontWeight: 600 }}>
            {p.name}
          </span>
          <span style={{
            fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 700,
            color: 'white', marginLeft: 'auto',
          }}>
            {p.value.toFixed(1)}%
          </span>
        </div>
      ))}
    </div>
  )
}

export default function ShortInterestChart({ selectedTicker = null }) {
  const chartData = useMemo(() => {
    const dates = [...new Set(shortInterestData.map(d => d.date))].sort()
    return dates.map(date => {
      const row = { date: date.slice(5) } // MM-DD format
      shortInterestData
        .filter(d => d.date === date)
        .forEach(d => {
          row[d.ticker] = d.percentFloat
        })
      return row
    })
  }, [])

  const tickers = selectedTicker
    ? [selectedTicker]
    : ['AFRM', 'SQ', 'PYPL', 'SHOP', 'TSLA']

  return (
    <div className="glass-card si-chart-section section-animate" style={{ animationDelay: '0.25s' }}>
      <div className="card-header">
        <span className="card-title">
          <span className="title-dot" />
          {selectedTicker ? `${selectedTicker} SHORT INTEREST` : 'SHORT INTEREST ORACLE'}
        </span>
        <span className="card-subtitle">% FLOAT SHORTED • 30-DAY</span>
      </div>
      <div className="card-body">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
              domain={[0, 'dataMax + 5']}
              tickFormatter={v => `${v}%`}
            />

            {/* Danger line at 20% float */}
            <ReferenceLine
              y={20}
              stroke="#ff4560"
              strokeDasharray="8 4"
              strokeWidth={1.5}
              label={{
                value: 'DANGER THRESHOLD (20%)',
                position: 'right',
                fill: '#ff4560',
                fontSize: 9,
                fontWeight: 600,
              }}
            />

            <Tooltip content={<CustomTooltip />} />

            {tickers.map(ticker => (
              <Line
                key={ticker}
                type="monotone"
                dataKey={ticker}
                stroke={TICKER_COLORS[ticker]}
                strokeWidth={2}
                dot={{ fill: TICKER_COLORS[ticker], r: 4, strokeWidth: 0 }}
                activeDot={{
                  r: 6, strokeWidth: 2,
                  stroke: TICKER_COLORS[ticker],
                  fill: '#0a0e1a',
                  style: { filter: `drop-shadow(0 0 6px ${TICKER_COLORS[ticker]})` }
                }}
                style={{ filter: `drop-shadow(0 0 4px ${TICKER_COLORS[ticker]}60)` }}
              />
            ))}

            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{
                fontSize: 10, fontWeight: 500,
                color: 'rgba(255,255,255,0.6)',
                paddingTop: 12,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
