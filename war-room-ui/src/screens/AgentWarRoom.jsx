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

        {/* Supporting intelligence row */}
        <SqueezeGauge score={squeezeIndex} label="GLOBAL SQUEEZE RISK INDEX" />
        <SentimentBars />

        <div className="section-divider" />

        {/* Short Interest Chart (full span) */}
        <ShortInterestChart />
      </main>
    </div>
  )
}
