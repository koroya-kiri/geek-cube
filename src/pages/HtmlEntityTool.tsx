import { useState } from 'react'
import { ToolHeader, Card, Chip, Textarea, Label, CopyBtn } from '../components/ui'
import { useAutoProcess } from '../hooks/useAutoProcess'

export default function HtmlEntityTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode'|'decode'>('encode')

  function encode(text: string) { return text.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!)) }
  function decode(text: string) { const t = document.createElement('textarea'); t.innerHTML = text; return t.value }

  const convert = () => {
    try { setOutput(mode === 'encode' ? encode(input) : decode(input)) } catch { setOutput('') }
  }

  useAutoProcess(input, convert, [mode])

  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp">
      <ToolHeader name="HTML Entity" accent="编解码" desc="HTML 实体编码与解码 · 实时处理" />
      <Card>
        <div className="flex items-center gap-2 flex-wrap">
          <Chip active={mode==='encode'} onClick={() => setMode('encode')}>编码</Chip>
          <Chip active={mode==='decode'} onClick={() => setMode('decode')}>解码</Chip>
          <span className="ml-auto text-[10px] text-gray-500 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" /> 实时
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>输入</Label><Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={mode==='encode'?'<div class="test">Hello</div>':'&lt;div&gt;Hello&lt;/div&gt;'} rows={10} /></div>
          <div className="space-y-2"><div className="flex justify-between"><Label>输出</Label><CopyBtn copied={false} onCopy={async()=>{await navigator.clipboard.writeText(output)}} /></div><Textarea value={output} readOnly rows={10} className="text-neon-green result-flash" /></div>
        </div>
      </Card>
    </div>
  )
}
