import { useEffect, useCallback } from 'react'

interface ShortcutHandlers {
  onSearch?: () => void
}

export function useShortcuts({ onSearch }: ShortcutHandlers) {
  const handler = useCallback((e: KeyboardEvent) => {
    /* Ctrl+K or Cmd+K → open search */
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      onSearch?.()
    }
  }, [onSearch])

  useEffect(() => {
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handler])
}
