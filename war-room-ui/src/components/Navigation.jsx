/* ================================================================
   NAVIGATION — 3-Screen Tab Bar
   Global Overview | Deep Dive | Agent War Room
   Active tab: underlined in neon emerald (#00f5c4)
   ================================================================ */

export default function Navigation({ activeScreen, onNavigate, selectedTicker }) {
  const tabs = [
    { id: 'overview', label: 'GLOBAL OVERVIEW', icon: 'monitoring' },
    { id: 'deepdive', label: 'DEEP DIVE', icon: 'query_stats', extra: selectedTicker },
    { id: 'warroom', label: 'AGENT WAR ROOM', icon: 'smart_toy' },
  ]

  return (
    <nav className="screen-nav">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`screen-nav-tab ${activeScreen === tab.id ? 'active' : ''}`}
          onClick={() => onNavigate(tab.id)}
        >
          <span className="screen-nav-label">{tab.label}</span>
          {tab.extra && (
            <span className="screen-nav-ticker">{tab.extra}</span>
          )}
          {activeScreen === tab.id && <div className="screen-nav-indicator" />}
        </button>
      ))}
    </nav>
  )
}
