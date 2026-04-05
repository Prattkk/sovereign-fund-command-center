import { useNews } from '../hooks/useNews'

/* ================================================================
   NEWSFEED — Scrollable list of headlines
   Each item: headline, source, time, sentiment badge
   BULLISH=green, BEARISH=red, NEUTRAL=gray
   ================================================================ */

function getSentimentStyle(sentiment) {
  switch (sentiment) {
    case 'BULLISH':
      return {
        color: '#00f5c4',
        background: 'rgba(0,245,196,0.1)',
        border: '1px solid rgba(0,245,196,0.4)',
        textShadow: '0 0 6px rgba(0,245,196,0.3)',
      }
    case 'BEARISH':
      return {
        color: '#ff4560',
        background: 'rgba(255,69,96,0.1)',
        border: '1px solid rgba(255,69,96,0.4)',
        textShadow: '0 0 6px rgba(255,69,96,0.3)',
      }
    default:
      return {
        color: 'rgba(255,255,255,0.35)',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.12)',
      }
  }
}

export default function Newsfeed({ ticker = null }) {
  const { headlines, loading, source } = useNews(ticker)

  return (
    <div className="glass-card newsfeed-section section-animate" style={{ animationDelay: '0.3s' }}>
      <div className="card-header">
        <span className="card-title">
          <span className="title-accent-bar" />
          {ticker ? `${ticker} NEWS TERMINAL` : 'MARKET INTELLIGENCE FEED'}
        </span>
        <span className="card-subtitle">
          SOURCE: {source} • {headlines.length} ITEMS
        </span>
      </div>
      <div className="card-body" style={{ padding: '0' }}>
        {loading ? (
          <div className="awaiting-loader" style={{ padding: '40px 22px' }}>
            <div className="scan-line-wrap"><div className="scan-line" /></div>
            SCANNING NEWS FEEDS...
          </div>
        ) : (
          <div className="newsfeed-list">
            {headlines.map((item, i) => {
              const sentStyle = getSentimentStyle(item.sentiment)
              return (
                <div className="newsfeed-item" key={i}>
                  <div className="newsfeed-item-main">
                    <div className="newsfeed-headline">{item.headline}</div>
                    <div className="newsfeed-meta">
                      <span className="newsfeed-source">{item.source}</span>
                      <span className="newsfeed-time">{item.time}</span>
                    </div>
                  </div>
                  <span className="newsfeed-sentiment" style={sentStyle}>
                    {item.sentiment}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
