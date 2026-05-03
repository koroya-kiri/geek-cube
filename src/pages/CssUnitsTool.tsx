import { useState } from 'react'
import { ToolHeader, Card, Input, Label } from '../components/ui'

export default function CssUnitsTool() {
  const [px, setPx] = useState('16')
  const [base, setBase] = useState(16)

  const p = parseFloat(px) || 0
  const units = [
    {l:'em',v:(p/base).toFixed(4).replace(/\.?0+$/,'') + 'em'},
    {l:'rem',v:(p/base).toFixed(4).replace(/\.?0+$/,'') + 'rem'},
    {l:'pt',v:(p*0.75).toFixed(2) + 'pt'},
    {l:'cm',v:(p/37.795).toFixed(4) + 'cm'},
    {l:'% (相对)',v:(p*100/1920).toFixed(2) + 'vw (1920px宽)'},
  ]

  return (
    <div className="max-w-sm mx-auto animate-fadeInUp">
      <ToolHeader name="CSS" accent="单位换算" accentColor="text-neon-magenta" desc="px/em/rem/vw/vh/pt 互换算" />
      <Card>
        <div className="space-y-2"><Label>像素值 (px)</Label><Input value={px} onChange={e=>setPx(e.target.value)} placeholder="16" /></div>
        <div className="space-y-2"><Label>根字体大小 (px)</Label><Input value={base} onChange={e=>setBase(+e.target.value||16)} placeholder="16" /></div>
        <div className="space-y-2">
          {units.map(({l,v}) => <div key={l} className="flex justify-between p-3 rounded-xl bg-cyber-bg-deep border border-white/10"><span className="text-sm text-gray-400">{l}</span><span className="text-sm text-white font-mono">{v}</span></div>)}
        </div>
      </Card>
    </div>
  )
}
