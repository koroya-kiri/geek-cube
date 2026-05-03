import { useState } from 'react'
import { ToolHeader, Card, Textarea, Label, CopyBtn } from '../components/ui'
import { useAutoProcess } from '../hooks/useAutoProcess'

export default function ReverseTextTool() {
  const [input, setInput] = useState(''); const [output, setOutput] = useState('')
  useAutoProcess(input, () => setOutput(input.split('').reverse().join('')))
  return (<div className="max-w-4xl mx-auto animate-fadeInUp"><ToolHeader name="文本" accent="反转" desc="逐字符反转文本"/><Card><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="space-y-2"><Label>输入</Label><Textarea value={input} onChange={e=>setInput(e.target.value)} rows={8} placeholder="Hello World"/></div><div className="space-y-2"><div className="flex justify-between"><Label>输出</Label><CopyBtn copied={false} onCopy={async()=>{await navigator.clipboard.writeText(output)}}/></div><Textarea value={output} readOnly rows={8} className="text-neon-green result-flash"/></div></div></Card></div>)
}
