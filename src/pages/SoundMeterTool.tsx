import { useState, useRef } from 'react'
import { Mic, MicOff } from 'lucide-react'
import { ToolHeader, Card, Button } from '../components/ui'

export default function SoundMeterTool() {
  const [listening, setListening] = useState(false)
  const [level, setLevel] = useState(0)
  const ctxRef = useRef<AudioContext | null>(null)
  const rafRef = useRef(0)

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const ctx = new AudioContext(); ctxRef.current = ctx
      const src = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser(); analyser.fftSize = 256; src.connect(analyser)
      const data = new Uint8Array(analyser.frequencyBinCount)
      const tick = () => { analyser.getByteFrequencyData(data); setLevel(Math.round(data.reduce((a,b)=>a+b,0)/data.length)); rafRef.current=requestAnimationFrame(tick) }
      tick(); setListening(true)
    } catch { /* mic denied */ }
  }
  const stop = () => { ctxRef.current?.close(); cancelAnimationFrame(rafRef.current); setListening(false); setLevel(0) }

  const pct = Math.min(100, level * 2)
  const barColor = pct > 70 ? '#ff3366' : pct > 30 ? '#e6b800' : '#00ff88'

  return (<div className="max-w-sm mx-auto animate-fadeInUp"><ToolHeader name="音量" accent="检测" desc="麦克风实时音量可视化"/><Card>
    <div className="text-center py-6">
      {listening ? <Mic size={40} className="mx-auto text-neon-cyan animate-pulse"/> : <MicOff size={40} className="mx-auto text-gray-500"/>}
      <div className="text-3xl font-mono font-bold mt-3" style={{ color: barColor, textShadow: `0 0 10px ${barColor}40` }}>{level}</div>
    </div>
    <div className="h-4 rounded-full bg-white/[0.04] overflow-hidden"><div className="h-full rounded-full transition-all duration-100" style={{width:`${pct}%`,background:barColor,boxShadow:`0 0 8px ${barColor}`}}/></div>
    <Button onClick={listening?stop:start} className="w-full">{listening?<MicOff size={16}/>:<Mic size={16}/>}{listening?'停止':'开始监听'}</Button>
  </Card></div>)
}
