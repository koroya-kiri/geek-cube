import { useState } from 'react'
import { ToolHeader, Card } from '../components/ui'

export default function ColorPickerTool() {
  const [color, setColor] = useState('#ff00aa')
  const hex = color; const r = parseInt(hex.slice(1, 3), 16); const g = parseInt(hex.slice(3, 5), 16); const b = parseInt(hex.slice(5, 7), 16)
  const hsl = (() => { const nr = r / 255, ng = g / 255, nb = b / 255; const mx = Math.max(nr, ng, nb), mn = Math.min(nr, ng, nb); let h = 0, s = 0, l = (mx + mn) / 2; if (mx !== mn) { const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); switch (mx) { case nr: h = ((ng - nb) / d + (ng < nb ? 6 : 0)) / 6; break; case ng: h = ((nb - nr) / d + 2) / 6; break; case nb: h = ((nr - ng) / d + 4) / 6; break } } return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) } })()

  return (<div className="max-w-sm mx-auto animate-fadeInUp"><ToolHeader name="颜色" accent="选择器" desc="精确取色 · HEX/RGB/HSL"/><Card>
    <div className="w-full h-24 rounded-2xl border border-white/10" style={{ backgroundColor: color }} />
    <div className="flex items-center gap-3"><input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-12 h-12 rounded-lg cursor-pointer border-0 bg-transparent"/><code className="text-xl text-neon-cyan font-mono">{color}</code></div>
    <div className="grid grid-cols-3 gap-3 text-center text-sm">
      <div className="p-2 rounded-lg bg-cyber-bg-deep border border-white/10"><div className="text-gray-500 text-xs">HEX</div><div className="text-white font-mono">{color}</div></div>
      <div className="p-2 rounded-lg bg-cyber-bg-deep border border-white/10"><div className="text-gray-500 text-xs">RGB</div><div className="text-white font-mono">{r},{g},{b}</div></div>
      <div className="p-2 rounded-lg bg-cyber-bg-deep border border-white/10"><div className="text-gray-500 text-xs">HSL</div><div className="text-white font-mono">{hsl.h}°,{hsl.s}%,{hsl.l}%</div></div>
    </div>
  </Card></div>)
}
