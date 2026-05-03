import { useState } from 'react'
import { ToolHeader, Card, Input, Label } from '../components/ui'

function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b) }

export default function AspectRatioTool() {
  const [w, setW] = useState('16'); const [h, setH] = useState('9')
  const nw = parseFloat(w), nh = parseFloat(h)
  const ok = !isNaN(nw) && !isNaN(nh) && nw > 0 && nh > 0
  const g = ok ? gcd(Math.round(nw * 100), Math.round(nh * 100)) : 1
  const ratio = ok ? `${Math.round(nw * 100 / g)}:${Math.round(nh * 100 / g)}` : ''
  return (<div className="max-w-sm mx-auto animate-fadeInUp"><ToolHeader name="宽高比" accent="计算" desc="计算最简整数比"/><Card>
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1"><Label>宽度</Label><Input value={w} onChange={e=>setW(e.target.value)} type="number" placeholder="16"/></div>
      <div className="space-y-1"><Label>高度</Label><Input value={h} onChange={e=>setH(e.target.value)} type="number" placeholder="9"/></div>
    </div>
    {ratio && <div className="p-4 rounded-xl bg-cyber-bg-deep border border-neon-cyan/20 text-center"><span className="text-2xl text-neon-cyan font-mono font-bold">{ratio}</span><p className="text-xs text-gray-500 mt-1">原值: {w}:{h}</p></div>}
    <div className="grid grid-cols-4 gap-2 mt-2">{[['16:9',16,9],['4:3',4,3],['21:9',21,9],['1:1',1,1],['3:2',3,2],['16:10',16,10],['9:16',9,16],['2.35:1',235,100]].map(([l,aw,ah])=><button key={l as string} onClick={()=>{setW(String(aw));setH(String(ah))}} className="px-2 py-1.5 rounded-lg text-xs bg-cyber-bg-deep border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors">{l}</button>)}</div>
  </Card></div>)
}
