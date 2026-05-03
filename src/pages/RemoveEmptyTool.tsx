import { useState } from 'react'
import { ToolHeader, Card, Textarea, Label, CopyBtn } from '../components/ui'
import { useAutoProcess } from '../hooks/useAutoProcess'

function removeEmpty(text: string) { return text.split('\n').filter(l => l.trim()).join('\n') }

export default function RemoveEmptyTool() {
  const [input, setInput] = useState(''); const [output, setOutput] = useState('')
  useAutoProcess(input, () => setOutput(removeEmpty(input)))
  return (<div className="max-w-4xl mx-auto animate-fadeInUp"><ToolHeader name="文本" accent="去空行" desc="移除空行和纯空格行"/><Card><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="space-y-2"><Label>输入</Label><Textarea value={input} onChange={e=>setInput(e.target.value)} rows={10} placeholder="包含空行的文本..."/></div><div className="space-y-2"><div className="flex justify-between"><Label>去空行后</Label><CopyBtn copied={false} onCopy={async()=>{await navigator.clipboard.writeText(output)}}/></div><Textarea value={output} readOnly rows={10} className="text-neon-green result-flash"/></div></div></Card></div>)
}
