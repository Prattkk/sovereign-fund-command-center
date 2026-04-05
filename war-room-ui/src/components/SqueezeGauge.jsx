import { useState, useEffect } from 'react'

/* ================================================================
   SQUEEZE GAUGE — Semicircle SVG Dial (0-100)
   Color zones: 0-33 green, 34-66 amber, 67-100 red
   Needle animated to current squeeze score
   ================================================================ */

function getZoneColor(value) {
  if (value <= 33) return '#00f5c4'
  if (value <= 66) return '#f59e0b'
  return '#ff4560'
}

function getZoneLabel(value) {
  if (value <= 33) return 'LOW RISK'
  if (value <= 66) return 'ELEVATED'
  return 'CRITICAL'
}

export default function SqueezeGauge({ score = 0, label = 'GLOBAL SQUEEZE INDEX' }) {
  const [animated, setAnimated] = useState(0)

  useEffect(() => {
    // Animate from 0 to score
    const timer = setTimeout(() => setAnimated(score), 100)
    return () => clearTimeout(timer)
  }, [score])

  const cx = 120, cy = 110, r = 90
  const startAngle = -180
  const endAngle = 0
  const totalArc = endAngle - startAngle // 180 degrees

  // Calculate the sweep for each zone
  const zoneAngles = [
    { start: -180, end: -120, color: '#00f5c4', opacity: 0.2 },  // 0-33
    { start: -120, end: -60, color: '#f59e0b', opacity: 0.2 },   // 34-66
    { start: -60, end: 0, color: '#ff4560', opacity: 0.2 },      // 67-100
  ]

  function polarToCart(angleDeg, radius = r) {
    const rad = (angleDeg * Math.PI) / 180
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) }
  }

  function arcPath(startDeg, endDeg, radius = r) {
    const s = polarToCart(startDeg, radius)
    const e = polarToCart(endDeg, radius)
    const sweep = Math.abs(endDeg - startDeg)
    const large = sweep > 180 ? 1 : 0
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${large} 1 ${e.x} ${e.y}`
  }

  // Needle angle
  const needleAngle = startAngle + (animated / 100) * totalArc
  const needleEnd = polarToCart(needleAngle, r - 15)
  const needleColor = getZoneColor(animated)

  // Tick marks
  const ticks = [0, 20, 33, 50, 66, 80, 100]

  return (
    <div className="glass-card squeeze-gauge-section section-animate" style={{ animationDelay: '0.2s' }}>
      <div className="card-header">
        <span className="card-title"><span className="title-dot" />{label}</span>
        <span className="card-subtitle" style={{
          color: needleColor,
          borderColor: `${needleColor}40`,
          background: `${needleColor}10`,
        }}>{getZoneLabel(animated)}</span>
      </div>
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg width="240" height="140" viewBox="0 0 240 140">
          {/* Zone arcs */}
          {zoneAngles.map((zone, i) => (
            <path
              key={i}
              d={arcPath(zone.start, zone.end)}
              fill="none"
              stroke={zone.color}
              strokeWidth="18"
              strokeLinecap="butt"
              opacity={zone.opacity}
            />
          ))}

          {/* Active arc */}
          <path
            d={arcPath(startAngle, needleAngle)}
            fill="none"
            stroke={needleColor}
            strokeWidth="18"
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 8px ${needleColor})`,
              transition: 'all 1.4s cubic-bezier(0.25,1,0.5,1)'
            }}
          />

          {/* Background arc outline */}
          <path
            d={arcPath(startAngle, endAngle, r + 2)}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
          />

          {/* Tick marks */}
          {ticks.map(t => {
            const angle = startAngle + (t / 100) * totalArc
            const outer = polarToCart(angle, r + 12)
            const inner = polarToCart(angle, r + 5)
            return (
              <g key={t}>
                <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
                  stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <text x={outer.x} y={outer.y - 4} textAnchor="middle"
                  fill="rgba(255,255,255,0.25)" fontSize="8" fontFamily="JetBrains Mono">
                  {t}
                </text>
              </g>
            )
          })}

          {/* Needle */}
          <line
            x1={cx} y1={cy}
            x2={needleEnd.x} y2={needleEnd.y}
            stroke={needleColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 6px ${needleColor})`,
              transition: 'all 1.4s cubic-bezier(0.25,1,0.5,1)'
            }}
          />

          {/* Center dot */}
          <circle cx={cx} cy={cy} r="5" fill={needleColor}
            style={{ filter: `drop-shadow(0 0 8px ${needleColor})` }} />
          <circle cx={cx} cy={cy} r="2.5" fill="#0a0e1a" />

          {/* Score text */}
          <text x={cx} y={cy - 18} textAnchor="middle"
            fill="white" fontSize="28" fontWeight="700" fontFamily="Inter">
            {animated}
          </text>
          <text x={cx} y={cy - 4} textAnchor="middle"
            fill="rgba(255,255,255,0.3)" fontSize="8" fontWeight="600"
            letterSpacing="0.15em" fontFamily="Inter">
            / 100
          </text>
        </svg>

        {/* Bottom legend */}
        <div className="squeeze-gauge-legend">
          <div className="squeeze-legend-item">
            <div className="squeeze-legend-dot" style={{ background: '#00f5c4' }} />
            <span>0-33 LOW</span>
          </div>
          <div className="squeeze-legend-item">
            <div className="squeeze-legend-dot" style={{ background: '#f59e0b' }} />
            <span>34-66 ELEVATED</span>
          </div>
          <div className="squeeze-legend-item">
            <div className="squeeze-legend-dot" style={{ background: '#ff4560' }} />
            <span>67-100 CRITICAL</span>
          </div>
        </div>
      </div>
    </div>
  )
}
