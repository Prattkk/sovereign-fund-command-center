import { useState, useEffect, useRef } from 'react'

/* ================================================================
   AGENT TRANSCRIPT — Scrolling chat feed
   Each message: agent name in accent color, timestamp,
   bubble with left border, BUY/SELL/HOLD badge
   Auto-scroll to latest message
   ================================================================ */

const AGENT_MESSAGES = [
  {
    agent: 'Sentiment Pod', agentColor: '#38bdf8', signal: 'BUY', timestamp: '09:41:02',
    text: 'DETECTION: Unusual call option flow in $AFRM detected. Delta-neutral positioning decaying at 0.85/sec. Dark pool accumulation signal confirmed — 3-month high. VADER compound score: +0.72. Recommend incremental long exposure to capture momentum overflow.',
    confidence: 88,
  },
  {
    agent: 'Mirror Pod', agentColor: '#a78bfa', signal: 'BUY', timestamp: '09:41:18',
    text: '13F SCAN COMPLETE: Renaissance Technologies increased AFRM position by 45.2%. Elliott Management up 38.5%. Institutional accumulation pattern matches pre-squeeze setup from Q2 2024. Two major funds loading while short interest climbs — classic squeeze catalyst.',
    confidence: 82,
  },
  {
    agent: 'Short Interest Oracle', agentColor: '#f59e0b', signal: 'BUY', timestamp: '09:41:31',
    text: 'CRITICAL ALERT: AFRM short interest at 31.0% of float. Days to cover: 7.1 (elevated). Borrow rate spiked to 42% — highest in 6 months. Cost-to-borrow trajectory suggests forced covering imminent. Squeeze probability: 74.8%.',
    confidence: 91,
  },
  {
    agent: 'Risk Guardian', agentColor: '#ff4560', signal: 'HOLD', timestamp: '09:41:45',
    text: 'CAUTION: While squeeze setup is confirmed, global squeeze index is at 74.8. Volatility clustering in fintech sector suggests tail risk. Recommend reducing position sizing by 12% to maintain VaR limits. Set stops at $20.85 for risk mitigation.',
    confidence: 65,
  },
  {
    agent: 'Governor', agentColor: '#00f5c4', signal: 'BUY', timestamp: '09:42:03',
    text: 'GOVERNOR SYNTHESIS: Based on majority multi-agent consensus (Sentiment, Mirror, Oracle) and significant dark pool accumulation signals, I authorize a LONG entry for AFRM at current market. Risk is mitigated by tight stops at $20.85. The high borrow rate is considered a bullish signal for a squeeze event. Position size: 6% of portfolio. Confidence: 84%.',
    confidence: 84,
  },
  {
    agent: 'Sentiment Pod', agentColor: '#38bdf8', signal: 'HOLD', timestamp: '09:43:15',
    text: 'UPDATE: Monitoring $SQ sentiment shift. VADER score dropped from +0.42 to +0.31 after mixed earnings report. Cash App growth deceleration is a concern. Maintaining neutral stance until sentiment stabilizes above +0.40 threshold.',
    confidence: 55,
  },
  {
    agent: 'Short Interest Oracle', agentColor: '#f59e0b', signal: 'SELL', timestamp: '09:43:42',
    text: 'ALERT: $TSLA short interest declining — down to 5.4% of float. This is NOT a squeeze candidate. Delivery miss and brand headwinds creating fundamental bearish pressure. Days to cover dropping to 1.4 — shorts can exit easily. Recommend SHORT if VIX stays below 22.',
    confidence: 78,
  },
  {
    agent: 'Mirror Pod', agentColor: '#a78bfa', signal: 'HOLD', timestamp: '09:44:08',
    text: 'OBSERVATION: Institutional flow in $PYPL shows activist accumulation (Elliott acquired 4% stake). However, overall institutional selling continues at -3.2% QoQ. Mixed signals — activist catalyst possible but consensus is cautious. Monitor for 13D filing.',
    confidence: 62,
  },
]

export default function AgentTranscript() {
  const feedRef = useRef(null)
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleCount(prev => {
        if (prev >= AGENT_MESSAGES.length) { clearInterval(timer); return prev }
        return prev + 1
      })
    }, 1200)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight
    }
  }, [visibleCount])

  return (
    <div className="glass-card transcript-section section-animate" style={{ animationDelay: '0.15s' }}>
      <div className="card-header">
        <span className="card-title"><span className="title-dot" />AGENT NEURAL REASONING CORE</span>
        <span className="card-subtitle" style={{
          color: visibleCount >= AGENT_MESSAGES.length ? '#00f5c4' : 'rgba(255,255,255,0.3)',
          borderColor: visibleCount >= AGENT_MESSAGES.length ? 'rgba(0,245,196,0.3)' : undefined,
          transition: 'color 0.3s',
        }}>
          {visibleCount}/{AGENT_MESSAGES.length} TRANSMISSIONS
        </span>
      </div>
      <div className="card-body" style={{ padding: '16px 22px' }}>
        <div className="transcript-feed" ref={feedRef}>
          {AGENT_MESSAGES.slice(0, visibleCount).map((msg, i) => (
            <div
              key={i}
              className="transcript-msg"
              style={{ borderLeftColor: msg.agentColor, animationDelay: `${i * 0.1}s` }}
            >
              <div className="transcript-msg-header">
                <div className="transcript-msg-left">
                  <span className="transcript-agent" style={{ color: msg.agentColor }}>
                    {msg.agent}
                  </span>
                  <span className="transcript-timestamp">{msg.timestamp}</span>
                </div>
                <div className="transcript-msg-right">
                  <span className={`signal-badge badge-${msg.signal.toLowerCase()}`}>
                    {msg.signal}
                  </span>
                </div>
              </div>
              <div className="transcript-text">{msg.text}</div>
              <div className="transcript-footer">
                <span className="transcript-confidence" style={{
                  color: msg.confidence >= 80 ? '#00f5c4' : msg.confidence >= 60 ? '#f59e0b' : '#ff4560'
                }}>
                  CONF: {msg.confidence}%
                </span>
              </div>
            </div>
          ))}

          {/* Scanning indicators for pending messages */}
          {visibleCount < AGENT_MESSAGES.length && (
            <div className="transcript-scanning">
              <div className="scan-line-wrap" style={{ width: 120, margin: '0 0 8px' }}>
                <div className="scan-line" />
              </div>
              <span>PROCESSING AGENT REASONING...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
