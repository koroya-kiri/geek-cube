import { useState } from 'react'
import { ToolHeader, Card, Textarea, Label, CopyBtn } from '../components/ui'
import { useAutoProcess } from '../hooks/useAutoProcess'

function addLineNumbers(text: string) { return text.split('\n').map((l, i) => `${String(i + 1).padStart(4, ' ')} | ${l}`).join('\n') }

export default function LineNumberTool() {
  const [input, setInput] = useState(''); const [output, setOutput] = useState('')
  useAutoProcess(input, () => setOutput(addLineNumbers(input)))
  return (<div className="max-w-4xl mx-auto animate-fadeInUp"><ToolHeader name="文本" accent="行号" desc="为每行添加行号"/><Card><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="space-y-2"><Label>输入</Label><Textarea value={input} onChange={e=>setInput(e.target.value)} rows={10} placeholder="第一行..."/></div><div className="space-y-2"><div className="flex justify-between"><Label>带行号</Label><CopyBtn copied={false} onCopy={async()=>{await navigator.clipboard.writeText(output)}}/></div><Textarea value={output} readOnly rows={10} className="text-neon-green result-flash"/></div></div></Card></div>)
}
