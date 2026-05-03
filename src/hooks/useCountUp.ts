import { useEffect, useRef, useState } from 'react'

/**
 * Animated count-up / count-down hook.
 * When `target` changes, smoothly animates from previous to new value.
 */
export function useCountUp(target: number, duration = 400) {
  const [display, setDisplay] = useState(target)
  const prevRef = useRef(target)
  const rafRef = useRef(0)

  useEffect(() => {
    const start = prevRef.current
    const end = target
    prevRef.current = end

    if (start === end) return

    const startTime = performance.now()

    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      /* easeOutCubic */
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(start + (end - start) * eased))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])

  return display
}
