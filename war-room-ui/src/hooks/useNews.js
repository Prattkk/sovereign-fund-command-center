import { useState, useEffect } from 'react'
import cachedHeadlines from '../data/newsHeadlines.json'

/* ================================================================
   News Hook
   Attempts NewsAPI fetch on localhost, falls back to cached
   headlines on production / CORS block.
   ================================================================ */

const NEWS_API_KEY = '' // Set your NewsAPI key here if available

export function useNews(ticker) {
  const [headlines, setHeadlines] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('CACHED')

  useEffect(() => {
    let cancelled = false

    async function fetchNews() {
      setLoading(true)

      // Try NewsAPI if key is available and we're on localhost
      if (NEWS_API_KEY && window.location.hostname === 'localhost') {
        try {
          const res = await fetch(
            `https://newsapi.org/v2/everything?q=${ticker}&sortBy=publishedAt&pageSize=10&apiKey=${NEWS_API_KEY}`
          )
          if (res.ok) {
            const data = await res.json()
            if (!cancelled && data.articles?.length) {
              const mapped = data.articles.map(a => ({
                ticker,
                headline: a.title,
                source: (a.source?.name || 'UNKNOWN').toUpperCase().replace(/\s+/g, '_'),
                time: getRelativeTime(a.publishedAt),
                sentiment: inferSentiment(a.title)
              }))
              setHeadlines(mapped)
              setSource('LIVE')
              setLoading(false)
              return
            }
          }
        } catch (e) {
          // Fall through to cached
        }
      }

      // Fallback: use cached headlines
      if (!cancelled) {
        const filtered = ticker
          ? cachedHeadlines.filter(h => h.ticker === ticker)
          : cachedHeadlines
        setHeadlines(filtered)
        setSource('CACHED')
        setLoading(false)
      }
    }

    fetchNews()
    return () => { cancelled = true }
  }, [ticker])

  return { headlines, loading, source }
}

function getRelativeTime(isoDate) {
  if (!isoDate) return 'recently'
  const diff = Date.now() - new Date(isoDate).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function inferSentiment(headline) {
  if (!headline) return 'NEUTRAL'
  const lower = headline.toLowerCase()
  const bullish = ['beats', 'surge', 'growth', 'upgrade', 'record', 'high', 'buy', 'rally', 'strong', 'expands']
  const bearish = ['miss', 'decline', 'fall', 'concern', 'recall', 'cut', 'sell', 'weak', 'loss', 'pressure']
  const bScore = bullish.filter(w => lower.includes(w)).length
  const sScore = bearish.filter(w => lower.includes(w)).length
  if (bScore > sScore) return 'BULLISH'
  if (sScore > bScore) return 'BEARISH'
  return 'NEUTRAL'
}

export default useNews
