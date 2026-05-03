import { useState } from 'react'
import { ToolHeader, Card, Input, Label, CopyBtn } from '../components/ui'

export default function GradientTool() {
  const [from, setFrom] = useState('#00f0ff')
  const [to, setTo] = useState('#ff00aa')
  const [deg, setDeg] = useState(135)

  const css = `background: linear-gradient(${deg}deg, ${from}, ${to});`

  return (
    <div className="max-w-sm mx-auto animate-fadeInUp">
      <ToolHeader name="渐变" accent="生成" accentColor="text-neon-magenta" desc="可视化生成 CSS 渐变代码" />
      <Card>
        <div className="w-full h-32 rounded-2xl border border-white/10" style={{background:`linear-gradient(${deg}deg,${from},${to})`}} />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label>起始色</Label><div className="flex gap-2"><input type="color" value={from} onChange={e=>setFrom(e.target.value)} className="w-10 h-10 rounded-lg" /><Input value={from} onChange={e=>setFrom(e.target.value)} className="font-mono" /></div></div>
          <div className="space-y-2"><Label>结束色</Label><div className="flex gap-2"><input type="color" value={to} onChange={e=>setTo(e.target.value)} className="w-10 h-10 rounded-lg" /><Input value={to} onChange={e=>setTo(e.target.value)} className="font-mono" /></div></div>
        </div>
        <div className="space-y-2"><Label>角度: {deg}°</Label><input type="range" min={0} max={360} value={deg} onChange={e=>setDeg(+e.target.value)} className="w-full accent-neon-cyan" /></div>
        <div className="flex items-center justify-between p-3 rounded-xl bg-cyber-bg-deep border border-white/10"><code className="text-xs text-neon-cyan font-mono break-all">{css}</code><CopyBtn copied={false} onCopy={async()=>{await navigator.clipboard.writeText(css)}} /></div>
      </Card>
    </div>
  )
}
