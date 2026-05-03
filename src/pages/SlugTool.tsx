import { useState } from 'react'
import { ToolHeader, Card, Textarea, Label, CopyBtn } from '../components/ui'
import { useAutoProcess } from '../hooks/useAutoProcess'

function toSlug(text: string) { return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') }

export default function SlugTool() {
  const [input, setInput] = useState(''); const [output, setOutput] = useState('')
  useAutoProcess(input, () => setOutput(toSlug(input)))
  return (<div className="max-w-4xl mx-auto animate-fadeInUp"><ToolHeader name="文本" accent="URL化" desc="文本转 URL 友好格式 (slug)"/><Card><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="space-y-2"><Label>输入</Label><Textarea value={input} onChange={e=>setInput(e.target.value)} rows={8} placeholder="Hello World! 你好"/></div><div className="space-y-2"><div className="flex justify-between"><Label>Slug</Label><CopyBtn copied={false} onCopy={async()=>{await navigator.clipboard.writeText(output)}}/></div><Textarea value={output} readOnly rows={8} className="text-neon-green result-flash"/></div></div></Card></div>)
}
