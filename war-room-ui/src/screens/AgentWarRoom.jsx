import AgentTranscript from '../components/AgentTranscript'
import GovernorPanel from '../components/GovernorPanel'
import SqueezeGauge from '../components/SqueezeGauge'
import SentimentBars from '../components/SentimentBars'
import ShortInterestChart from '../components/ShortInterestChart'
import { useGlobalSqueezeIndex } from '../hooks/useSqueezeScore'

/* ================================================================
   AGENT WAR ROOM SCREEN
   Agent operations center with debate transcript,
   governor panel, and supporting intelligence
   ================================================================ */

export default function AgentWarRoom() {
  const squeezeIndex = useGlobalSqueezeIndex()

  return (
    <div className="warroom-screen">
      {/* Command Centre Header */}
      <div className="warroom-command-header section-animate">
        <div className="warroom-command-left">
          <span className="warroom-command-label">COMMAND_CENTRE</span>
          <span className="warroom-command-sep">//</span>
          <span className="warroom-command-time" style={{ fontFamily: 'JetBrains Mono' }}>
            {new Date().toLocaleTimeString('en-US', { hour12: false })}
          </span>
        </div>
        <div className="warroom-command-right">
          <span className="warroom-status-pill">
            <span className="pipeline-dot" />
            AGENTS ONLINE: 5/5
          </span>
        </div>
      </div>

      <main className="war-room-grid">
        {/* Agent Transcript (spans full width) */}
        <AgentTranscript />

        <div className="section-divider" />

        {/* Governor Panel (full width) */}
        <GovernorPanel />

        <div className="section-divider" />

        {/* Multi-Agent Vote Matrix */}
        <div style={{ gridColumn: '1 / -1' }} className="glass-card section-animate">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="card-title">
              MULTI-AGENT VOTE MATRIX
            </span>
            <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', letterSpacing: '0.05em' }}>
              REAL-TIME CONSENSUS
            </span>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['TICKER', 'SENTIMENT', 'MIRROR', 'SI ORACLE', 'RISK GUARDIAN', 'GOVERNOR', 'FINAL', 'CONF'].map(h => (
                    <th key={h} style={{ fontSize: '9px', textTransform: 'uppercase', color: '#94a3b8', padding: '12px 16px', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { ticker: 'AFRM', s: 'BUY', m: 'BUY', si: 'BUY', r: 'HOLD', g: 'BUY', f: 'LONG', conf: 84 },
                  { ticker: 'SQ', s: 'BUY', m: 'BUY', si: 'HOLD', r: 'HOLD', g: 'BUY', f: 'LONG', conf: 71 },
                  { ticker: 'PYPL', s: 'SELL', m: 'HOLD', si: 'SELL', r: 'SELL', g: 'SELL', f: 'SHORT', conf: 78 },
                  { ticker: 'SHOP', s: 'BUY', m: 'HOLD', si: 'HOLD', r: 'HOLD', g: 'BUY', f: 'LONG', conf: 62 },
                  { ticker: 'TSLA', s: 'SELL', m: 'SELL', si: 'HOLD', r: 'SELL', g: 'SELL', f: 'SHORT', conf: 69 },
                ].map((row, i) => {
                  const getCellColor = (val) => {
                    if (val === 'BUY') return '#00f5c4'
                    if (val === 'SELL') return '#ff4560'
                    if (val === 'HOLD') return '#f59e0b'
                    return 'inherit'
                  }
                  
                  return (
                    <tr 
                      key={row.ticker} 
                      style={{ 
                        background: i % 2 === 0 ? '#0f172a' : '#111827',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                      onMouseOut={(e) => e.currentTarget.style.background = i % 2 === 0 ? '#0f172a' : '#111827'}
                    >
                      <td style={{ padding: '14px 16px', fontWeight: 'bold', color: 'white', fontFamily: 'JetBrains Mono', fontSize: '13px' }}>{row.ticker}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, fontSize: '11px', color: getCellColor(row.s) }}>{row.s}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, fontSize: '11px', color: getCellColor(row.m) }}>{row.m}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, fontSize: '11px', color: getCellColor(row.si) }}>{row.si}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, fontSize: '11px', color: getCellColor(row.r) }}>{row.r}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, fontSize: '11px', color: getCellColor(row.g) }}>{row.g}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ 
                          background: row.f === 'LONG' ? 'rgba(0,245,196,0.15)' : 'rgba(255,69,96,0.15)',
                          color: row.f === 'LONG' ? '#00f5c4' : '#ff4560',
                          padding: '4px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold'
                        }}>
                          {row.f}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: '13px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>{row.conf}%</div>
                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', width: '40px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${row.conf}%`, background: row.f === 'LONG' ? '#00f5c4' : '#ff4560' }} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
