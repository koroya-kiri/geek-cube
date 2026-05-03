import { useState } from 'react'
import { ToolHeader, Card, Chip, Textarea, Label, CopyBtn } from '../components/ui'
import { useAutoProcess } from '../hooks/useAutoProcess'

export default function BinaryTextTool() {
  const [input, setInput] = useState(''); const [output, setOutput] = useState(''); const [mode, setMode] = useState<'to' | 'from'>('to')
  const convert = () => {
    try { setOutput(mode === 'to' ? input.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ') : input.replace(/\s/g, '').match(/.{1,8}/g)?.map(b => String.fromCharCode(parseInt(b, 2))).join('') || '') } catch { setOutput('') }
  }
  useAutoProcess(input, convert, [mode])
  return (<div className="max-w-4xl mx-auto animate-fadeInUp"><ToolHeader name="二进制" accent="文本" desc="文本与二进制互转" /><Card><div className="flex gap-2"><Chip active={mode==='to'} onClick={()=>setMode('to')}>文本→二进制</Chip><Chip active={mode==='from'} onClick={()=>setMode('from')}>二进制→文本</Chip></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="space-y-2"><Label>输入</Label><Textarea value={input} onChange={e=>setInput(e.target.value)} rows={8} placeholder={mode==='to'?'Hello':'01001000 01100101'}/></div><div className="space-y-2"><div className="flex justify-between"><Label>输出</Label><CopyBtn copied={false} onCopy={async()=>{await navigator.clipboard.writeText(output)}}/></div><Textarea value={output} readOnly rows={8} className="text-neon-green result-flash"/></div></div></Card></div>)
}
