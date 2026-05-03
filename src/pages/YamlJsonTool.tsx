import { useState } from 'react'
import YAML from 'yaml'
import { ToolHeader, Card, Chip, Textarea, Label, CopyBtn, Alert } from '../components/ui'
import { useAutoProcess } from '../hooks/useAutoProcess'

export default function YamlJsonTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'y2j'|'j2y'>('y2j')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const convert = () => {
    setError(''); if(!input.trim()){ setOutput(''); return }
    try {
      if (mode === 'y2j') setOutput(JSON.stringify(YAML.parse(input), null, 2))
      else setOutput(YAML.stringify(JSON.parse(input)))
    } catch (e) { setError((e as Error).message); setOutput('') }
  }

  useAutoProcess(input, convert, [mode], 400)

  return (
    <div className="max-w-5xl mx-auto animate-fadeInUp">
      <ToolHeader name="YAML ↔ JSON" accent="转换" accentColor="text-neon-orange" desc="YAML 与 JSON 互相转换 · 实时处理" />
      <Card>
        <div className="flex items-center gap-2">
          <Chip active={mode==='y2j'} onClick={()=>setMode('y2j')}>YAML → JSON</Chip>
          <Chip active={mode==='j2y'} onClick={()=>setMode('j2y')}>JSON → YAML</Chip>
          <span className="ml-auto text-[10px] text-gray-500 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" /> 实时
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>{mode==='y2j'?'YAML':'JSON'}</Label><Textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={mode==='y2j'?'name: John\nage: 30':'{"name":"John","age":30}'} rows={14} /></div>
          <div className="space-y-2"><div className="flex justify-between"><Label>{mode==='y2j'?'JSON':'YAML'}</Label><CopyBtn copied={copied} onCopy={async()=>{await navigator.clipboard.writeText(output);setCopied(true);setTimeout(()=>setCopied(false),1500)}} /></div><Textarea value={output} readOnly rows={14} className="text-neon-green result-flash" /></div>
        </div>
        {error && <Alert>{error}</Alert>}
      </Card>
    </div>
  )
}
