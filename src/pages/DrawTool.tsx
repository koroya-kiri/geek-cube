import { useState, useRef, useEffect, useCallback } from 'react'
import { ToolHeader, Card, Button, Chip } from '../components/ui'

export default function DrawTool() {
  const [drawing, setDrawing] = useState(false)
  const [color, setColor] = useState('#00f0ff')
  const [size, setSize] = useState(3)
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    const c = canvasRef.current; if (!c) return
    c.width = c.parentElement!.clientWidth; c.height = 400
    ctxRef.current = c.getContext('2d')
  }, [])

  const getPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const c = canvasRef.current; if (!c) return { x: 0, y: 0 }
    const rect = c.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    return { x: clientX - rect.left, y: clientY - rect.top }
  }, [])

  const start = (e: React.MouseEvent | React.TouchEvent) => { setDrawing(true); const ctx = ctxRef.current; if (!ctx) return; const { x, y } = getPos(e); ctx.beginPath(); ctx.moveTo(x, y); ctx.strokeStyle = tool === 'eraser' ? '#050508' : color; ctx.lineWidth = tool === 'eraser' ? 20 : size; ctx.lineCap = 'round' }
  const draw = (e: React.MouseEvent | React.TouchEvent) => { if (!drawing) return; const ctx = ctxRef.current; if (!ctx) return; const { x, y } = getPos(e); ctx.lineTo(x, y); ctx.stroke() }
  const end = () => setDrawing(false)
  const clear = () => { const c = canvasRef.current; const ctx = ctxRef.current; if (!c || !ctx) return; ctx.clearRect(0, 0, c.width, c.height); ctx.fillStyle = '#0a0a14'; ctx.fillRect(0, 0, c.width, c.height) }

  return (<div className="max-w-3xl mx-auto animate-fadeInUp"><ToolHeader name="描画" accent="画板" desc="自由绘制 · Canvas 画板"/><Card className="p-2 space-y-2">
    <div className="flex items-center gap-2 flex-wrap">
      <Chip active={tool==='pen'} onClick={()=>setTool('pen')}>画笔</Chip><Chip active={tool==='eraser'} onClick={()=>setTool('eraser')}>橡皮</Chip>
      <input type="color" value={color} onChange={e=>setColor(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer"/>
      <input type="range" min={1} max={20} value={size} onChange={e=>setSize(+e.target.value)} className="w-24 accent-neon-cyan"/>
      <Button variant="ghost" onClick={clear} className="text-xs">清空</Button>
    </div>
    <canvas ref={canvasRef} onMouseDown={start} onMouseMove={draw} onMouseUp={end} onMouseLeave={end} onTouchStart={start} onTouchMove={draw} onTouchEnd={end}
      className="w-full rounded-xl border border-white/10 cursor-crosshair" style={{ background: '#0a0a14' }}/>
  </Card></div>)
}
