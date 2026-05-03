import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { ToolHeader, Card, Button, Label, CopyBtn } from '../components/ui'

const CHARS = { lower: 'abcdefghijklmnopqrstuvwxyz', upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', digits: '0123456789', symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?' }

export default function RandomStringTool() {
  const [len, setLen] = useState(16); const [pools, setPools] = useState(['lower', 'upper', 'digits'] as string[])
  const [result, setResult] = useState(''); const [copied, setCopied] = useState(false)
  const gen = () => { const chars = pools.map(k => CHARS[k as keyof typeof CHARS]).join('') || CHARS.lower; setResult(Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')) }

  return (<div className="max-w-sm mx-auto animate-fadeInUp"><ToolHeader name="随机" accent="字符串" desc="生成随机字符串"/><Card>
    <div className="space-y-1"><Label>长度: {len}</Label><input type="range" min={4} max={128} value={len} onChange={e => setLen(+e.target.value)} className="w-full accent-neon-cyan"/></div>
    <div className="flex flex-wrap gap-2">{[{k:'lower',l:'小写'},{k:'upper',l:'大写'},{k:'digits',l:'数字'},{k:'symbols',l:'符号'}].map(({k,l}) => (
      <label key={k} className="flex items-center gap-1.5 text-sm text-gray-300 cursor-pointer"><input type="checkbox" checked={pools.includes(k)} onChange={e => setPools(e.target.checked ? [...pools, k] : pools.filter(p => p !== k))} className="rounded"/>{l}</label>))}</div>
    <Button onClick={gen} className="w-full"><RefreshCw size={14} />生成</Button>
    {result && <div className="space-y-2"><div className="flex justify-between"><Label>结果</Label><CopyBtn copied={copied} onCopy={async()=>{await navigator.clipboard.writeText(result);setCopied(true);setTimeout(()=>setCopied(false),1500)}}/></div><div className="p-3 rounded-xl bg-cyber-bg-deep border border-white/10 text-neon-green font-mono text-sm break-all">{result}</div></div>}
  </Card></div>)
}
