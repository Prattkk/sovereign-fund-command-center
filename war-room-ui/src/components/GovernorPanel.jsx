/* ================================================================
   GOVERNOR PANEL — Full-width bottom panel
   Shows final synthesized decision from the Governor agent
   Consensus direction, confidence %, reasoning text
   ================================================================ */

export default function GovernorPanel() {
  return (
    <div className="glass-card governor-section section-animate" style={{ animationDelay: '0.4s' }}>
      <div className="card-header" style={{ borderBottom: 'none' }}>
        <span className="card-title">
          <span className="title-dot" style={{ background: '#00f5c4', boxShadow: '0 0 12px #00f5c4' }} />
          GOVERNOR DECISION — FINAL SYNTHESIS
        </span>
        <span className="card-subtitle" style={{
          color: '#00f5c4',
          borderColor: 'rgba(0,245,196,0.3)',
          background: 'rgba(0,245,196,0.08)',
        }}>AUTHORIZED</span>
      </div>

      <div className="card-body governor-body">
        {/* Decision header row */}
        <div className="governor-decision-row">
          <div className="governor-stat">
            <span className="governor-stat-label">CONSENSUS DIRECTION</span>
            <span className="direction-pill dir-long" style={{ fontSize: 14, padding: '6px 20px' }}>
              LONG
            </span>
          </div>
          <div className="governor-stat">
            <span className="governor-stat-label">TARGET ASSET</span>
            <span className="governor-stat-value" style={{ color: '#00f5c4' }}>$AFRM</span>
          </div>
          <div className="governor-stat">
            <span className="governor-stat-label">CONFIDENCE</span>
            <div className="governor-confidence">
              <div className="governor-conf-track">
                <div className="governor-conf-fill" style={{ width: '84%' }} />
              </div>
              <span className="governor-conf-value">84%</span>
            </div>
          </div>
          <div className="governor-stat">
            <span className="governor-stat-label">POSITION SIZE</span>
            <span className="governor-stat-value">6% PORT</span>
          </div>
          <div className="governor-stat">
            <span className="governor-stat-label">STOP LOSS</span>
            <span className="governor-stat-value" style={{ color: '#ff4560' }}>$20.85</span>
          </div>
        </div>

        {/* Reasoning text */}
        <div className="governor-reasoning">
          <div className="governor-reason-label">REASONING</div>
          <p className="governor-reason-text">
            Based on majority multi-agent consensus (Sentiment Pod, Mirror Pod, Short Interest Oracle) and significant
            dark pool accumulation signals, I authorize a <strong style={{ color: '#00f5c4' }}>LONG</strong> entry for
            AFRM at current market price ($24.82). Risk is mitigated by tight stops at $20.85 (-16% from entry).
            The high borrow rate (42%) is considered a bullish signal for a squeeze event.
            Short interest at 31.0% of float with 7.1 days to cover creates significant upside asymmetry.
          </p>
        </div>

        {/* Agent consensus breakdown */}
        <div className="governor-agents">
          <div className="governor-agent-vote">
            <span className="governor-agent-dot" style={{ background: '#38bdf8' }} />
            <span className="governor-agent-name">Sentiment Pod</span>
            <span className="signal-badge badge-buy" style={{ fontSize: 8 }}>BUY</span>
          </div>
          <div className="governor-agent-vote">
            <span className="governor-agent-dot" style={{ background: '#a78bfa' }} />
            <span className="governor-agent-name">Mirror Pod</span>
            <span className="signal-badge badge-buy" style={{ fontSize: 8 }}>BUY</span>
          </div>
          <div className="governor-agent-vote">
            <span className="governor-agent-dot" style={{ background: '#f59e0b' }} />
            <span className="governor-agent-name">Short Interest Oracle</span>
            <span className="signal-badge badge-buy" style={{ fontSize: 8 }}>BUY</span>
          </div>
          <div className="governor-agent-vote">
            <span className="governor-agent-dot" style={{ background: '#ff4560' }} />
            <span className="governor-agent-name">Risk Guardian</span>
            <span className="signal-badge badge-hedge" style={{ fontSize: 8 }}>HOLD</span>
          </div>
          <div className="governor-agent-vote">
            <span className="governor-agent-dot" style={{ background: '#00f5c4' }} />
            <span className="governor-agent-name">Governor</span>
            <span className="signal-badge badge-buy" style={{ fontSize: 8 }}>BUY</span>
          </div>
        </div>
      </div>
    </div>
  )
}
