import { useState, useEffect } from 'react'
import { ToolHeader, Card, Textarea, Label } from '../components/ui'

export default function TextStatsTool() {
  const [text, setText] = useState('')
  const [stats, setStats] = useState<{label:string;value:string}[]>([])

  useEffect(() => {
    if (!text) { setStats([]); return }
    const chars = text.length
    const charsNoSpaces = text.replace(/\s/g, '').length
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const lines = text ? text.split('\n').length : 0
    const paragraphs = text.trim() ? text.trim().split(/\n\s*\n/).length : 0
    const cn = (text.match(/[\u4e00-\u9fff]/g) || []).length
    const en = (text.match(/[a-zA-Z]/g) || []).length
    const digits = (text.match(/\d/g) || []).length
    setStats([
      {label:'总字符数',value:String(chars)},{label:'不含空格',value:String(charsNoSpaces)},
      {label:'单词数',value:String(words)},{label:'行数',value:String(lines)},
      {label:'段落数',value:String(paragraphs)},{label:'中文字符',value:String(cn)},
      {label:'英文字母',value:String(en)},{label:'数字',value:String(digits)},
    ])
  }, [text])

  return (
    <div className="max-w-2xl mx-auto animate-fadeInUp">
      <ToolHeader name="文本" accent="统计" accentColor="text-neon-cyan" desc="统计字符数、单词数、行数等" />
      <Card>
        <div className="space-y-2"><Label>输入文本</Label><Textarea value={text} onChange={e => setText(e.target.value)} placeholder="输入或粘贴文本..." rows={8} /></div>
        {stats.length > 0 && <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map(({label,value}) => <div key={label} className="p-3 rounded-xl bg-cyber-bg-deep border border-white/10 text-center"><div className="text-2xl text-neon-cyan font-mono font-bold">{value}</div><div className="text-xs text-gray-500 mt-1">{label}</div></div>)}
        </div>}
      </Card>
    </div>
  )
}
