import { useState } from 'react'
import { RefreshCcw } from 'lucide-react'
import { ToolHeader, Card, Button, Label, CopyBtn } from '../components/ui'

export default function RandomTool() {
  const [min, setMin] = useState(1)
  const [max, setMax] = useState(100)
  const [count, setCount] = useState(5)
  const [decimal, setDecimal] = useState(0)
  const [results, setResults] = useState<number[]>([])
  const [copied, setCopied] = useState(false)

  const gen = () => {
    const arr: number[] = []
    for (let i = 0; i < count; i++) {
      const r = Math.random() * (max - min) + min
      arr.push(parseFloat(r.toFixed(decimal)))
    }
    setResults(arr)
  }

  return (
    <div className="max-w-sm mx-auto animate-fadeInUp">
      <ToolHeader name="随机数" accent="生成" accentColor="text-neon-red" desc="生成指定范围内的随机数" />
      <Card>
        <div className="grid grid-cols-2 gap-3">
          {[{l:'最小值',v:min,s:setMin},{l:'最大值',v:max,s:setMax},{l:'数量',v:count,s:(v:number)=>setCount(Math.min(50,v))},{l:'小数位',v:decimal,s:setDecimal}].map(({l,v,s}) => (
            <div key={l} className="space-y-1"><Label>{l}</Label><input type="number" value={v} onChange={e => s(+e.target.value)} className="w-full px-3 py-2 rounded-lg bg-cyber-bg-deep border border-white/10 text-white text-sm focus:outline-none focus:border-[rgba(0,240,255,0.5)] font-mono transition-colors" style={{caretColor:'#00f0ff'}} /></div>
          ))}
        </div>
        <Button onClick={gen} className="w-full"><RefreshCcw size={16} />生成</Button>
        {results.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between"><Label>结果</Label><CopyBtn copied={copied} onCopy={async () => { await navigator.clipboard.writeText(results.join(', '));setCopied(true);setTimeout(()=>setCopied(false),1500) }} /></div>
            <div className="flex flex-wrap gap-2">{results.map((r,i) => <span key={i} className="px-3 py-1.5 rounded-lg bg-cyber-bg-deep border border-white/10 text-neon-green font-mono text-sm">{r}</span>)}</div>
          </div>
        )}
      </Card>
    </div>
  )
}
