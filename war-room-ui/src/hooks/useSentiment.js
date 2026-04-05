import { useState, useEffect, useCallback } from 'react'
import sentimentData from '../data/sentimentScores.json'

/* ================================================================
   VADER-lite Sentiment Scoring
   Lightweight client-side sentiment analysis.
   Returns compound score from pre-computed data, with live
   update simulation every 30 seconds.
   ================================================================ */

// Simple positive/negative word lists for live headline scoring
const POSITIVE_WORDS = [
  'beats', 'surges', 'growth', 'upgrade', 'bullish', 'record', 'strong',
  'expands', 'partnership', 'accelerates', 'high', 'buy', 'momentum',
  'outperform', 'exceeds', 'innovation', 'launches', 'gains', 'surge',
  'rally', 'breakout', 'accumulation', 'squeeze', 'opportunity'
]

const NEGATIVE_WORDS = [
  'miss', 'decline', 'falls', 'concerns', 'slows', 'recall', 'weigh',
  'cuts', 'reduction', 'bearish', 'sell', 'pressure', 'risk', 'warning',
  'competition', 'compress', 'challenging', 'downturn', 'losses', 'weak',
  'regulatory', 'headwinds', 'crash', 'plunge', 'fails'
]

function scoreHeadline(text) {
  const words = text.toLowerCase().split(/\s+/)
  let pos = 0, neg = 0
  words.forEach(w => {
    if (POSITIVE_WORDS.some(p => w.includes(p))) pos++
    if (NEGATIVE_WORDS.some(n => w.includes(n))) neg++
  })
  const total = pos + neg || 1
  return (pos - neg) / total
}

export function useSentiment(ticker) {
  const [score, setScore] = useState(() => {
    const data = sentimentData[ticker]
    return data ? data.compound : 0
  })

  const [headlines, setHeadlines] = useState(() => {
    const data = sentimentData[ticker]
    return data ? data.headlines : []
  })

  const [detail, setDetail] = useState(() => {
    const data = sentimentData[ticker]
    return data ? {
      positive: data.positive,
      negative: data.negative,
      neutral: data.neutral
    } : { positive: 0, negative: 0, neutral: 0 }
  })

  // Simulate live updates every 30s with slight drift
  useEffect(() => {
    const interval = setInterval(() => {
      setScore(prev => {
        const drift = (Math.random() - 0.5) * 0.08
        return Math.max(-1, Math.min(1, prev + drift))
      })
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  // Recalculate when ticker changes
  useEffect(() => {
    const data = sentimentData[ticker]
    if (data) {
      setScore(data.compound)
      setHeadlines(data.headlines)
      setDetail({
        positive: data.positive,
        negative: data.negative,
        neutral: data.neutral
      })
    }
  }, [ticker])

  return { score, headlines, detail, scoreHeadline }
}

export function useAllSentiments() {
  const tickers = ['AFRM', 'SQ', 'PYPL', 'SHOP', 'TSLA']
  const [scores, setScores] = useState(() => {
    const initial = {}
    tickers.forEach(t => {
      initial[t] = sentimentData[t]?.compound || 0
    })
    return initial
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setScores(prev => {
        const next = { ...prev }
        tickers.forEach(t => {
          const drift = (Math.random() - 0.5) * 0.06
          next[t] = Math.max(-1, Math.min(1, (prev[t] || 0) + drift))
        })
        return next
      })
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  return scores
}

export default useSentiment
