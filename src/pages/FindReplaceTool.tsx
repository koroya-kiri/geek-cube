import { useState } from 'react'
import { ToolHeader, Card, Chip, Textarea, Label, CopyBtn, Input } from '../components/ui'
import { useAutoProcess } from '../hooks/useAutoProcess'

export default function FindReplaceTool() {
  const [text, setText] = useState('')
  const [find, setFind] = useState('')
  const [replace, setReplace] = useState('')
  const [output, setOutput] = useState('')
  const [useRegex, setUseRegex] = useState(false)
  const [caseSensitive, setCaseSensitive] = useState(false)

  const process = () => {
    try {
      if (!find.trim()) { setOutput(text); return }
      if (useRegex) {
        const flags = caseSensitive ? 'g' : 'gi'; setOutput(text.replace(new RegExp(find,flags), replace))
      } else {
        const flags = caseSensitive ? 'g' : 'gi'; setOutput(text.replace(new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),flags), replace))
      }
    } catch { setOutput('正则表达式错误') }
  }

  useAutoProcess(text, process, [find, replace, useRegex, caseSensitive])

  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp">
      <ToolHeader name="查找" accent="替换" desc="文本批量查找替换（支持正则）· 实时处理" />
      <Card>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label>查找</Label><Input value={find} onChange={e=>setFind(e.target.value)} placeholder="查找内容..." /></div>
          <div className="space-y-1"><Label>替换为</Label><Input value={replace} onChange={e=>setReplace(e.target.value)} placeholder="替换为..." /></div>
        </div>
        <div className="flex items-center gap-2">
          <Chip active={useRegex} onClick={()=>setUseRegex(!useRegex)}>正则模式</Chip>
          <Chip active={caseSensitive} onClick={()=>setCaseSensitive(!caseSensitive)}>区分大小写</Chip>
          <span className="ml-auto text-[10px] text-gray-500 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" /> 实时
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>原文本</Label><Textarea value={text} onChange={e=>setText(e.target.value)} rows={10} /></div>
          <div className="space-y-2"><div className="flex justify-between"><Label>结果</Label><CopyBtn copied={false} onCopy={async()=>{await navigator.clipboard.writeText(output)}} /></div><Textarea value={output} readOnly rows={10} className="text-neon-green result-flash" /></div>
        </div>
      </Card>
    </div>
  )
}
