import { useState, useEffect, useCallback } from 'react'

const RECENT_KEY = 'geek-cube-recent'
const MAX_RECENT = 8

export function useRecentTools() {
  const [recent, setRecent] = useState<string[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY)
      if (raw) setRecent(JSON.parse(raw))
    } catch { /* localStorage unavailable – fallback to in-memory only */ }
  }, [])

  const addRecent = useCallback((id: string) => {
    setRecent(prev => {
      const next = [id, ...prev.filter(r => r !== id)].slice(0, MAX_RECENT)
      localStorage.setItem(RECENT_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { recent, addRecent }
}
