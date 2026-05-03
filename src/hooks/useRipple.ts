import { useCallback, useRef, useEffect } from 'react'

/**
 * Returns { setRef, createRipple }.
 * Attach setRef to any element via ref={setRef}.
 * Call createRipple(clientX, clientY) with viewport-relative coordinates.
 * Ripple auto-removes after animation (default 800ms).
 * @param duration - animation duration in ms
 * @param brightness - backdrop-filter brightness value (default 1.3)
 */
export function useRipple(duration = 800, brightness = 1.3) {
  const elRef = useRef<HTMLElement | null>(null)

  const setRef = useCallback((node: HTMLElement | null) => {
    elRef.current = node
  }, [])

  const createRipple = useCallback(
    (clientX: number, clientY: number) => {
      const container = elRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height) * 0.8

      const ripple = document.createElement('div')
      ripple.className = 'ripple-element'
      ripple.style.width = `${size}px`
      ripple.style.height = `${size}px`
      ripple.style.left = `${clientX - rect.left - size / 2}px`
      ripple.style.top = `${clientY - rect.top - size / 2}px`
      ripple.style.backdropFilter = `brightness(${brightness})`;

      container.appendChild(ripple)

      setTimeout(() => {
        if (ripple.parentNode) ripple.parentNode.removeChild(ripple)
      }, duration + 100)
    },
    [duration, brightness]
  )

  /* Cleanup any leftover ripples on unmount */
  useEffect(() => {
    const el = elRef.current
    return () => {
      if (el) el.querySelectorAll('.ripple-element').forEach(r => r.remove())
    }
  }, [])

  return { setRef, createRipple }
}
