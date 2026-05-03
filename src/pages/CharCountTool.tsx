import { useState } from 'react'
import { ToolHeader, Card, Textarea, Label } from '../components/ui'

export default function CharCountTool() {
  const [input, setInput] = useState('')
  const stats = input ? { chars: input.length, noSpace: input.replace(/\s/g, '').length, words: input.trim() ? input.trim().split(/\s+/).length : 0, lines: input.split('\n').length, bytes: new TextEncoder().encode(input).length } : null
  return (<div className="max-w-2xl mx-auto animate-fadeInUp"><ToolHeader name="字符" accent="计数" desc="实时字符、单词、行数、字节统计"/><Card>
    <div className="space-y-2"><Label>输入文本</Label><Textarea value={input} onChange={e=>setInput(e.target.value)} rows={10} placeholder="输入文本..."/></div>
    {stats && <div className="grid grid-cols-2 md:grid-cols-5 gap-3">{[
      {l:'字符数',v:stats.chars},{l:'无空格',v:stats.noSpace},{l:'单词数',v:stats.words},{l:'行数',v:stats.lines},{l:'字节数',v:stats.bytes}
    ].map(({l,v}) => <div key={l} className="p-3 rounded-xl bg-cyber-bg-deep border border-white/10 text-center"><div className="text-xl text-neon-cyan font-mono font-bold">{v}</div><div className="text-xs text-gray-500 mt-1">{l}</div></div>)}</div>}
  </Card></div>)
}
