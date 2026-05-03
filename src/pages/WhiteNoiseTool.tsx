import { useState, useRef } from 'react'
import { Play, Pause } from 'lucide-react'
import { ToolHeader, Card, Button, Chip } from '../components/ui'

export default function WhiteNoiseTool() {
  const [playing, setPlaying] = useState(false)
  const [type, setType] = useState<'white' | 'pink' | 'brown'>('white')
  const ctxRef = useRef<AudioContext | null>(null)
  const nodeRef = useRef<AudioBufferSourceNode | null>(null)

  const start = () => {
    const ctx = new AudioContext(); ctxRef.current = ctx
    const sr = ctx.sampleRate; const dur = 10
    const buf = ctx.createBuffer(1, sr * dur, sr)
    const data = buf.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      let s = Math.random() * 2 - 1
      if (type === 'pink') { let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0; const w = Math.random() * 2 - 1; b0 = 0.99886 * b0 + w * 0.0555179; b1=0.99332*b1+w*0.0750759; b2=0.969*b2+w*0.153852; b3=0.8665*b3+w*0.3104856; b4=0.55*b4+w*0.5329522; b5=-0.7616*b5-w*0.016898; s=b0+b1+b2+b3+b4+b5+b6+ w*0.5362; s*=0.11 }
      else if (type === 'brown') { let last = 0; const w = Math.random() * 2 - 1; s = (last + 0.02 * w) / 1.02; s *= 3.5 }
      data[i] = s
    }
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true; src.connect(ctx.destination); src.start()
    nodeRef.current = src; setPlaying(true)
  }

  const stop = () => { nodeRef.current?.stop(); ctxRef.current?.close(); setPlaying(false) }

  return (<div className="max-w-xs mx-auto animate-fadeInUp"><ToolHeader name="白噪" accent="发生器" desc="白噪/粉噪/棕噪音"/><Card>
    <div className="flex justify-center gap-2">{([
      { k: 'white' as const, l: '白噪' }, { k: 'pink' as const, l: '粉噪' }, { k: 'brown' as const, l: '棕噪' }
    ]).map(({k,l}) => <Chip key={k} active={type===k} onClick={()=>{stop();setType(k)}}>{l}</Chip>)}</div>
    <Button onClick={playing ? stop : start} className="w-full text-lg">{playing ? <Pause size={20}/> : <Play size={20}/>}{playing ? '停止' : '播放'}</Button>
  </Card></div>)
}
