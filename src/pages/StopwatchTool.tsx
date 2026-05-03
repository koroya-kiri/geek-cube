import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { ToolHeader, Card, Button } from '../components/ui'

export default function StopwatchTool() {
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const startRef = useRef(0)
  const rafRef = useRef(0)

  useEffect(() => {
    if (!running) return
    startRef.current = performance.now() - elapsed
    const tick = () => { setElapsed(performance.now() - startRef.current); rafRef.current = requestAnimationFrame(tick) }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [running])

  const fmt = (ms: number) => {
    const m = Math.floor(ms / 60000); const s = Math.floor((ms % 60000) / 1000); const c = Math.floor((ms % 1000) / 10)
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(c).padStart(2, '0')}`
  }

  return (<div className="max-w-sm mx-auto animate-fadeInUp"><ToolHeader name="计时器" accent="秒表" desc="高精度毫秒计时"/><Card>
    <div className="text-center py-8"><div className="text-5xl font-mono text-neon-cyan font-bold tracking-wider" style={{ textShadow: '0 0 20px rgba(0,240,255,.3)' }}>{fmt(elapsed)}</div></div>
    <div className="flex gap-2 justify-center">
      <Button onClick={() => setRunning(!running)} className="text-lg px-8">{running ? <Pause size={20} /> : <Play size={20} />}{running ? '暂停' : '开始'}</Button>
      <Button onClick={() => { setRunning(false); setElapsed(0) }} variant="secondary"><RotateCcw size={18} />重置</Button>
    </div>
  </Card></div>)
}
