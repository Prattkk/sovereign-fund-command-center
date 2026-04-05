import { useState, useEffect } from 'react'
import shortInterestData from '../data/shortInterest.json'
import sentimentData from '../data/sentimentScores.json'

/* ================================================================
   Squeeze Score Calculator
   Composite score from Short Interest + Sentiment data.
   Formula: normalize(PercentFloat * 2 + DaysToCover * 3 + |sentiment| * 20)
   Returns 0-100 scale. Higher = more squeeze pressure.
   ================================================================ */

function calculateSqueezeScore(ticker) {
  // Get latest short interest data for this ticker
  const siData = shortInterestData
    .filter(d => d.ticker === ticker)
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  const latest = siData[0]
  if (!latest) return 0

  const sentiment = sentimentData[ticker]?.compound || 0

  // Raw score components
  const floatComponent = latest.percentFloat * 2       // Higher float short = more squeeze
  const dtcComponent = latest.daysToCover * 3           // Higher DTC = harder to cover
  const sentimentComponent = Math.abs(sentiment) * 20   // Strong sentiment = catalyst

  // Raw score
  const raw = floatComponent + dtcComponent + sentimentComponent

  // Normalize to 0-100 (empirical max ~85 for extreme cases)
  return Math.min(100, Math.round((raw / 90) * 100))
}

function getLatestShortData(ticker) {
  const siData = shortInterestData
    .filter(d => d.ticker === ticker)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
  return siData[0] || null
}

function getShortHistory(ticker) {
  return shortInterestData
    .filter(d => d.ticker === ticker)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
}

export function useSqueezeScore(ticker) {
  const [score, setScore] = useState(() => calculateSqueezeScore(ticker))
  const [history, setHistory] = useState(() => getShortHistory(ticker))
  const [latest, setLatest] = useState(() => getLatestShortData(ticker))

  // Recalculate on ticker change
  useEffect(() => {
    setScore(calculateSqueezeScore(ticker))
    setHistory(getShortHistory(ticker))
    setLatest(getLatestShortData(ticker))
  }, [ticker])

  // Simulate live update every 30s with slight drift
  useEffect(() => {
    const interval = setInterval(() => {
      setScore(prev => {
        const drift = Math.round((Math.random() - 0.45) * 4)
        return Math.max(0, Math.min(100, prev + drift))
      })
    }, 30000)
    return () => clearInterval(interval)
  }, [ticker])

  return { score, history, latest }
}

export function useAllSqueezeScores() {
  const tickers = ['AFRM', 'SQ', 'PYPL', 'SHOP', 'TSLA']
  const [scores, setScores] = useState(() => {
    const initial = {}
    tickers.forEach(t => {
      initial[t] = calculateSqueezeScore(t)
    })
    return initial
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setScores(prev => {
        const next = { ...prev }
        tickers.forEach(t => {
          const drift = Math.round((Math.random() - 0.45) * 3)
          next[t] = Math.max(0, Math.min(100, (prev[t] || 0) + drift))
        })
        return next
      })
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  return scores
}

export function useGlobalSqueezeIndex() {
  const allScores = useAllSqueezeScores()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const values = Object.values(allScores)
    const avg = values.reduce((a, b) => a + b, 0) / (values.length || 1)
    setIndex(Math.round(avg))
  }, [allScores])

  return index
}

export default useSqueezeScore
