import { useState } from 'react'
import { ToolHeader, Card, Chip, Textarea, Label, Input, Alert } from '../components/ui'
import { useAutoProcess } from '../hooks/useAutoProcess'

export default function RegexTool() {
  const [pattern, setPattern] = useState('[a-zA-Z0-9]+')
  const [flags, setFlags] = useState('g')
  const [testText, setTestText] = useState('Hello World 123')
  const [matches, setMatches] = useState<string[]>([])
  const [error, setError] = useState('')
  const [highlighted, setHighlighted] = useState<{ text: string; isMatch: boolean }[]>([])

  const run = () => {
    setError(''); setMatches([]); setHighlighted([])
    if (!pattern.trim()) return
    try {
      const r = new RegExp(pattern, flags)
      const found = testText.match(r); setMatches(found && found[0]!=='' ? Array.from(found) : [])
      const segs: { text: string; isMatch: boolean }[] = []; let last = 0
      const gr = new RegExp(pattern, flags.includes('g')?flags:flags+'g'); let m: RegExpExecArray|null
      while ((m = gr.exec(testText)) !== null) {
        if (m[0]==='') { gr.lastIndex++; continue }
        if (m.index > last) segs.push({ text: testText.slice(last, m.index), isMatch: false })
        segs.push({ text: m[0], isMatch: true }); last = m.index + m[0].length
        if (!flags.includes('g')) break
      }
      if (last < testText.length) segs.push({ text: testText.slice(last), isMatch: false })
      setHighlighted(segs)
    } catch (e) { setError((e as Error).message) }
  }

  useAutoProcess(testText, run, [pattern, flags])

  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp">
      <ToolHeader name="正则" accent="测试" desc="实时编写和测试正则表达式，高亮匹配结果 · 实时处理" />

      <Card>
        <div className="space-y-2">
          <Label>正则表达式</Label>
          <div className="flex gap-2">
            <span className="flex items-center px-3 rounded-xl bg-cyber-bg-hover border border-white/10 text-gray-500 text-sm font-mono">/</span>
            <Input value={pattern} onChange={e => setPattern(e.target.value)} placeholder="输入正则表达式..." className="flex-1" />
            <span className="flex items-center px-3 rounded-xl bg-cyber-bg-hover border border-white/10 text-gray-500 text-sm font-mono">/{flags}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {[{l:'全局 g',v:'g'},{l:'忽略大小写 i',v:'i'},{l:'多行 m',v:'m'},{l:'单行 s',v:'s'}].map(f => (
            <Chip key={f.v} active={flags.includes(f.v)} onClick={() => setFlags(p => p.includes(f.v) ? p.replace(f.v,'') : p+f.v)}>{f.l}</Chip>
          ))}
          <span className="ml-auto text-[10px] text-gray-500 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" /> 实时
          </span>
        </div>

        <div className="space-y-2"><Label>测试文本</Label><Textarea value={testText} onChange={e => setTestText(e.target.value)} placeholder="输入要匹配的文本..." rows={5} /></div>

        {error && <Alert>{error}</Alert>}

        {highlighted.length > 0 && !error && (
          <div className="space-y-2">
            <Label>高亮结果</Label>
            <div className="px-4 py-3 rounded-xl bg-cyber-bg-deep border border-white/10 text-sm font-mono leading-relaxed whitespace-pre-wrap">
              {highlighted.map((s,i) => <span key={i} className={s.isMatch?'bg-neon-cyan/20 text-neon-cyan px-0.5 rounded':'text-gray-400'}>{s.text}</span>)}
            </div>
          </div>
        )}

        {matches.length > 0 && !error && (
          <div className="space-y-2">
            <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" /><Label>匹配结果</Label><span className="text-xs text-neon-cyan font-mono">({matches.length})</span></div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {matches.map((m,i) => <div key={i} className="px-3 py-2 rounded-lg bg-cyber-bg-deep border border-white/10 text-xs font-mono text-white">{m}</div>)}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
