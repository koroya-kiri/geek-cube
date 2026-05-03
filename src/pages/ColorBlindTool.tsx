import { useState } from 'react'
import { ToolHeader, Card, Label } from '../components/ui'

function simulateColorBlindness(hex: string, type: 'protanopia' | 'deuteranopia' | 'tritanopia'): string {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16)
  const matrices: Record<string, [number,number,number][]> = {
    protanopia: [[0.567,0.433,0],[0.558,0.442,0],[0,0.242,0.758]],
    deuteranopia: [[0.625,0.375,0],[0.7,0.3,0],[0,0.3,0.7]],
    tritanopia: [[0.95,0.05,0],[0,0.433,0.567],[0,0.475,0.525]],
  }
  const m = matrices[type]
  const nr = Math.round(Math.max(0,Math.min(255,r*m[0][0]+g*m[0][1]+b*m[0][2])))
  const ng = Math.round(Math.max(0,Math.min(255,r*m[1][0]+g*m[1][1]+b*m[1][2])))
  const nb = Math.round(Math.max(0,Math.min(255,r*m[2][0]+g*m[2][1]+b*m[2][2])))
  return '#' + [nr,ng,nb].map(x=>x.toString(16).padStart(2,'0')).join('')
}

export default function ColorBlindTool() {
  const [color, setColor] = useState('#00f0ff')
  const types = ['protanopia', 'deuteranopia', 'tritanopia'] as const
  const names = { protanopia: '红色盲', deuteranopia: '绿色盲', tritanopia: '蓝色盲' }
  return (<div className="max-w-sm mx-auto animate-fadeInUp"><ToolHeader name="色盲" accent="模拟" desc="模拟色觉障碍视角查看颜色"/><Card>
    <div className="flex items-center gap-3"><input type="color" value={color} onChange={e=>setColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer"/><code className="text-lg text-neon-cyan font-mono">{color}</code></div>
    <div className="space-y-3">{types.map(t => <div key={t} className="space-y-1">
      <Label>{names[t]}</Label>
      <div className="flex gap-2 items-center"><div className="w-16 h-10 rounded-lg border border-white/10" style={{background:color}}/><span className="text-gray-500">→</span><div className="w-16 h-10 rounded-lg border border-white/10" style={{background:simulateColorBlindness(color,t)}}/><code className="text-xs text-gray-400 font-mono">{simulateColorBlindness(color,t)}</code></div>
    </div>)}</div>
  </Card></div>)
}
