import { useState } from 'react'
import { ToolHeader, Card, Label, CopyBtn, Textarea } from '../components/ui'

export default function TextRepeatTool() {
  const [input, setInput] = useState(''); const [count, setCount] = useState(5); const [sep, setSep] = useState(''); const [output, setOutput] = useState('')
  const repeat = () => { const arr = Array.from({ length: count }, () => input); setOutput(arr.join(sep)) }
  return (<div className="max-w-4xl mx-auto animate-fadeInUp"><ToolHeader name="文本" accent="重复" desc="将文本重复 N 次"/><Card>
    <div className="flex items-end gap-3">
      <div className="space-y-1 flex-1"><Label>文本</Label><Textarea value={input} onChange={e => setInput(e.target.value)} rows={4} placeholder="要重复的文本..."/></div>
      <div className="space-y-1"><Label>次数</Label><input type="number" min={1} max={1000} value={count} onChange={e=>setCount(+e.target.value||1)} className="w-20 px-3 py-2 rounded-lg bg-cyber-bg-deep border border-white/10 text-white text-sm focus:outline-none focus:border-neon-cyan/60 font-mono" style={{caretColor:'#00f0ff'}}/></div>
      <div className="space-y-1"><Label>分隔符</Label><input value={sep} onChange={e=>setSep(e.target.value)} placeholder="无" className="w-24 px-3 py-2 rounded-lg bg-cyber-bg-deep border border-white/10 text-white text-sm focus:outline-none focus:border-neon-cyan/60 font-mono" style={{caretColor:'#00f0ff'}}/></div>
      <button onClick={repeat} className="px-4 py-2 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-sm font-medium hover:bg-neon-cyan/20 transition-colors">生成</button>
    </div>
    {output && <div className="space-y-2"><div className="flex justify-between"><Label>结果 ({count}次 · {output.length}字符)</Label><CopyBtn copied={false} onCopy={async()=>{await navigator.clipboard.writeText(output)}}/></div><Textarea value={output} readOnly rows={8} className="text-neon-green result-flash"/></div>}
  </Card></div>)
}
