import { useRef, useEffect } from 'react'

export interface GraphNode {
  id: string
  label: string
  x: number; y: number
  connections: number[]  // indices of connected nodes
}

interface FlowDot {
  lineIdx: number
  progress: number
  speed: number
}

const CYAN = 'rgba(0,242,255,'
const LINE_ALPHA = 0.08
const HIGHLIGHT_ALPHA = 0.5

export default function NodeGraph({
  nodes: nodeData, hoveredId, containerRef
}: {
  nodes: GraphNode[]
  hoveredId: string | null
  containerRef: React.RefObject<HTMLDivElement | null>
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dotsRef = useRef<FlowDot[]>([])
  const animRef = useRef<number>(0)

  // Animate flow dots
  useEffect(() => {
    if (hoveredId) {
      const idx = nodeData.findIndex(n => n.id === hoveredId)
      if (idx === -1) return
      dotsRef.current = nodeData[idx].connections.map((_, i) => ({
        lineIdx: i, progress: Math.random(), speed: 0.003 + Math.random() * 0.005,
      }))
    } else {
      dotsRef.current = []
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const hoverIdx = nodeData.findIndex(n => n.id === hoveredId)
      const connectedSet = new Set<number>()
      if (hoverIdx !== -1) {
        nodeData[hoverIdx].connections.forEach(c => connectedSet.add(c))
        connectedSet.add(hoverIdx)
      }

      // Draw connections
      for (let i = 0; i < nodeData.length; i++) {
        const src = nodeData[i]
        for (const targetIdx of src.connections) {
          if (targetIdx >= nodeData.length) continue
          const dst = nodeData[targetIdx]
          const isHighlighted = hoveredId !== null && connectedSet.has(i) && connectedSet.has(targetIdx)
          const alpha = isHighlighted ? HIGHLIGHT_ALPHA : LINE_ALPHA
          const color = isHighlighted ? CYAN : 'rgba(0,242,255,'

          ctx.beginPath()
          ctx.moveTo(src.x, src.y)
          ctx.lineTo(dst.x, dst.y)
          ctx.strokeStyle = `${color}${alpha})`
          ctx.lineWidth = isHighlighted ? 1.2 : 0.5
          ctx.stroke()

          // Draw flow dots on highlighted lines
          if (isHighlighted && hoveredId !== null) {
            for (const dot of dotsRef.current) {
              const srcConn = nodeData[hoverIdx].connections[dot.lineIdx]
              if (srcConn === undefined) continue
              // Only draw on this specific connection
              const a = nodeData[hoverIdx]
              const b = nodeData[srcConn]
              if (!((a === src && b === dst) || (b === src && a === dst))) continue
              const px = src.x + (dst.x - src.x) * dot.progress
              const py = src.y + (dst.y - src.y) * dot.progress
              ctx.beginPath()
              ctx.arc(px, py, 2.5, 0, Math.PI * 2)
              ctx.fillStyle = `${color}0.9)`
              ctx.fill()
              ctx.beginPath()
              ctx.arc(px, py, 6, 0, Math.PI * 2)
              ctx.fillStyle = `${color}0.25)`
              ctx.fill()
            }
          }
        }
      }

      // Update dot progress
      for (const dot of dotsRef.current) {
        dot.progress += dot.speed
        if (dot.progress > 1) dot.progress = 0
      }

      animRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => cancelAnimationFrame(animRef.current)
  }, [hoveredId, nodeData])

  // Update canvas size
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (rect) { canvas.width = rect.width; canvas.height = rect.height }
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}

/** Stable pseudo-random based on seed */
function seededRandom(seed: number) {
  let s = seed
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
}

export type LayoutType = 'scatter' | 'diamond' | 'grid' | 'circle' | 'spiral' | 'hexagon' | 'cross'

/** Generate node positions based on layout type */
export function generateNodeLayout(
  ids: string[], labels: string[], viewW: number, viewH: number, layout: LayoutType = 'scatter'
): GraphNode[] {
  const cx = viewW / 2; const cy = viewH / 2
  const nodes: GraphNode[] = []
  const n = ids.length

  switch (layout) {
    case 'diamond': {
      const cols = Math.ceil(Math.sqrt(n * 1.5))
      let idx = 0
      for (let row = 0; row < cols && idx < n; row++) {
        const itemsInRow = row < cols / 2 ? row * 2 + 1 : (cols - row) * 2 - 1
        const startX = cx - (itemsInRow - 1) * 55 / 2
        for (let col = 0; col < itemsInRow && idx < n; col++) {
          nodes.push({ id: ids[idx], label: labels[idx], x: startX + col * 55, y: cy - (cols - 1) * 30 + row * 60, connections: [] })
          idx++
        }
      }
      break
    }
    case 'grid': {
      const cols = Math.ceil(Math.sqrt(n))
      for (let i = 0; i < n; i++) {
        const col = i % cols; const row = Math.floor(i / cols)
        nodes.push({ id: ids[i], label: labels[i], x: cx - (cols - 1) * 50 / 2 + col * 50, y: cy - (Math.ceil(n / cols) - 1) * 50 / 2 + row * 50, connections: [] })
      }
      break
    }
    case 'circle': {
      for (let i = 0; i < n; i++) {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2
        nodes.push({ id: ids[i], label: labels[i], x: cx + Math.cos(angle) * 180, y: cy + Math.sin(angle) * 180, connections: [] })
      }
      break
    }
    case 'spiral': {
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1); const angle = t * Math.PI * 4
        const r = 30 + t * 200
        nodes.push({ id: ids[i], label: labels[i], x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r, connections: [] })
      }
      break
    }
    case 'hexagon': {
      const ring = Math.ceil((Math.sqrt(12 * n - 3) - 3) / 6) + 1
      nodes.push({ id: ids[0], label: labels[0], x: cx, y: cy, connections: [] })
      let placed = 1
      for (let r = 1; r <= ring && placed < n; r++) {
        const perRing = r * 6
        for (let i = 0; i < perRing && placed < n; i++) {
          const angle = (i / perRing) * Math.PI * 2 - Math.PI / 2
          const dist = r * 60
          nodes.push({ id: ids[placed], label: labels[placed], x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist, connections: [] })
          placed++
        }
      }
      break
    }
    case 'cross': {
      const arms = 4; const perArm = Math.ceil((n - 1) / arms)
      nodes.push({ id: ids[0], label: labels[0], x: cx, y: cy, connections: [] })
      let placed = 1
      for (let arm = 0; arm < arms && placed < n; arm++) {
        const angle = (arm / arms) * Math.PI * 2
        for (let d = 1; d <= perArm && placed < n; d++) {
          nodes.push({ id: ids[placed], label: labels[placed], x: cx + Math.cos(angle) * d * 55, y: cy + Math.sin(angle) * d * 55, connections: [] })
          placed++
        }
      }
      break
    }
    default: { // scatter
      const rx = viewW * 0.36; const ry = viewH * 0.32
      const rand = seededRandom(ids.join('').length + labels.join('').length)
      for (let i = 0; i < n; i++) {
        const angle = (i / n) * Math.PI * 2 + rand() * 0.4
        const radius = 0.55 + rand() * 0.45
        nodes.push({ id: ids[i], label: labels[i], x: cx + Math.cos(angle) * rx * radius + (rand() - 0.5) * 40, y: cy + Math.sin(angle) * ry * radius + (rand() - 0.5) * 30, connections: [] })
      }
    }
  }

  // Connect nearest neighbors
  for (let i = 0; i < nodes.length; i++) {
    const dists = nodes.map((nd, j) => ({
      idx: j, dist: (nd.x - nodes[i].x) ** 2 + (nd.y - nodes[i].y) ** 2,
    })).filter(d => d.idx !== i).sort((a, b) => a.dist - b.dist)
    for (let k = 0; k < 3 && k < dists.length; k++) nodes[i].connections.push(dists[k].idx)
  }

  return nodes
}

export const LAYOUT_NAMES: Record<LayoutType, string> = {
  scatter: '散布', diamond: '菱形', grid: '网格', circle: '环形', spiral: '螺旋', hexagon: '六边形', cross: '十字',
}

export const LAYOUTS: LayoutType[] = ['scatter', 'diamond', 'grid', 'circle', 'spiral', 'hexagon', 'cross']
