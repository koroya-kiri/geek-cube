import { useState, useEffect, useCallback } from 'react'

const FAV_KEY = 'geek-cube-favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAV_KEY)
      if (raw) setFavorites(JSON.parse(raw))
    } catch { /* localStorage unavailable – fallback to in-memory only */ }
  }, [])

  const toggle = useCallback((id: string) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [id, ...prev]
      localStorage.setItem(FAV_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites])

  return { favorites, toggle, isFavorite }
}
