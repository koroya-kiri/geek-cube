import { useState } from 'react'
import { ToolHeader, Card, Textarea, Label, CopyBtn } from '../components/ui'
import { useAutoProcess } from '../hooks/useAutoProcess'

export default function StripHtmlTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  const strip = () => { const d = document.createElement('div'); d.innerHTML = input; setOutput(d.textContent || '') }

  useAutoProcess(input, strip)

  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp">
      <ToolHeader name="HTML" accent="清理" accentColor="text-neon-red" desc="移除 HTML 标签，提取纯文本 · 实时处理" />
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>HTML 源码</Label><Textarea value={input} onChange={e=>setInput(e.target.value)} placeholder='<div><p>Hello</p></div>' rows={10} /></div>
          <div className="space-y-2"><div className="flex justify-between"><Label>纯文本</Label><CopyBtn copied={false} onCopy={async()=>{await navigator.clipboard.writeText(output)}} /></div><Textarea value={output} readOnly rows={10} className="text-neon-green result-flash" /></div>
        </div>
      </Card>
    </div>
  )
}
