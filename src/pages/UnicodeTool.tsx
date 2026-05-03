import { useState } from 'react'
import { ToolHeader, Card, Chip, Textarea, Label, CopyBtn } from '../components/ui'
import { useAutoProcess } from '../hooks/useAutoProcess'

export default function UnicodeTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'escape'|'unescape'>('escape')

  const convert = () => {
    try {
      setOutput(mode === 'escape' ? input.split('').map(c => '\\u' + c.charCodeAt(0).toString(16).padStart(4,'0')).join('') : input.replace(/\\u([0-9a-fA-F]{4})/g, (_,h) => String.fromCharCode(parseInt(h,16))))
    } catch { setOutput('') }
  }

  useAutoProcess(input, convert, [mode])

  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp">
      <ToolHeader name="Unicode" accent="转换" desc="Unicode 转义与反转义 · 实时处理" />
      <Card>
        <div className="flex items-center gap-2 flex-wrap">
          <Chip active={mode==='escape'} onClick={()=>setMode('escape')}>转义 \\uXXXX</Chip>
          <Chip active={mode==='unescape'} onClick={()=>setMode('unescape')}>反转义</Chip>
          <span className="ml-auto text-[10px] text-gray-500 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" /> 实时
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>输入</Label><Textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={mode==='escape'?'你好世界':'\\u4f60\\u597d\\u4e16\\u754c'} rows={8} /></div>
          <div className="space-y-2"><div className="flex justify-between"><Label>输出</Label><CopyBtn copied={false} onCopy={async()=>{await navigator.clipboard.writeText(output)}} /></div><Textarea value={output} readOnly rows={8} className="text-neon-green result-flash" /></div>
        </div>
      </Card>
    </div>
  )
}
