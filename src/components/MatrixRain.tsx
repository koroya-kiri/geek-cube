import { useEffect, useRef } from 'react'

const FONT_SIZE = 16
const COLOR = '#0F0'
const TRAIL_OPACITY = 0.05

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0, height = 0, columns = 0
    let drops: number[] = []
    let animId = 0

    const resize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      columns = Math.floor(width / FONT_SIZE)
      drops = Array.from({ length: columns }, () => Math.floor(Math.random() * height / FONT_SIZE))
    }

    const draw = () => {
      ctx.fillStyle = `rgba(0, 0, 0, ${TRAIL_OPACITY})`
      ctx.fillRect(0, 0, width, height)

      ctx.fillStyle = COLOR
      ctx.font = `bold ${FONT_SIZE}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = Math.random() > 0.5 ? '1' : '0'
        ctx.fillText(text, i * FONT_SIZE, drops[i] * FONT_SIZE)

        if (drops[i] * FONT_SIZE > height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
      animId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    animId = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />
}
