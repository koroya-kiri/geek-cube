import { useState } from 'react'
import { ToolHeader, Card, Input, Label, Chip } from '../components/ui'

export default function PercentageTool() {
  const [a, setA] = useState(''); const [b, setB] = useState(''); const [mode, setMode] = useState<'pct' | 'value'>('pct')
  const na = parseFloat(a), nb = parseFloat(b)
  const result = !isNaN(na) && !isNaN(nb) ? (mode === 'pct' ? `${((na / nb) * 100).toFixed(2)}%` : String((na * nb) / 100)) : ''
  return (<div className="max-w-sm mx-auto animate-fadeInUp"><ToolHeader name="百分比" accent="计算器" desc="百分比计算与反算"/><Card>
    <div className="flex gap-2"><Chip active={mode==='pct'} onClick={()=>setMode('pct')}>A 是 B 的 ?%</Chip><Chip active={mode==='value'} onClick={()=>setMode('value')}>A% × B = ?</Chip></div>
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1"><Label>{mode==='pct'?'数值 A':'百分比'}</Label><Input value={a} onChange={e=>setA(e.target.value)} type="number" placeholder="0"/></div>
      <div className="space-y-1"><Label>{mode==='pct'?'数值 B':'数值 B'}</Label><Input value={b} onChange={e=>setB(e.target.value)} type="number" placeholder="0"/></div>
    </div>
    {result && <div className="p-4 rounded-xl bg-cyber-bg-deep border border-neon-cyan/20 text-center"><span className="text-2xl text-neon-cyan font-mono font-bold">{result}</span></div>}
  </Card></div>)
}
