import { useState } from 'react'
import { ToolHeader, Card, Chip, Textarea, Label, CopyBtn, Alert } from '../components/ui'
import { useAutoProcess } from '../hooks/useAutoProcess'

/** Parse a single CSV line respecting quoted fields */
function parseCsvLine(line: string): string[] {
  const fields: string[] = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') { field += '"'; i++ }
        else { inQuotes = false }
      } else { field += ch }
    } else {
      if (ch === '"') { inQuotes = true }
      else if (ch === ',') { fields.push(field.trim()); field = '' }
      else { field += ch }
    }
  }
  fields.push(field.trim())
  return fields
}

function escapeCsvValue(val: string): string {
  if (val.includes(',') || val.includes('"') || val.includes('\n')) return `"${val.replace(/"/g, '""')}"`
  return val
}

export default function CsvJsonTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'csv2json'|'json2csv'>('csv2json')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const convert = () => {
    setError(''); if(!input.trim()){ setOutput(''); return }
    try {
      if (mode === 'csv2json') {
        const lines = input.trim().split('\n'); if (lines.length < 2) { setOutput('[]'); return }
        const headers = parseCsvLine(lines[0]); if (headers.length === 0) { setOutput('[]'); return }
        setOutput(JSON.stringify(lines.slice(1).filter(l => l.trim()).map(l => {
          const vals = parseCsvLine(l); const o: Record<string, string> = {}
          headers.forEach((h, i) => { o[h] = vals[i] ?? '' })
          return o
        }), null, 2))
      } else {
        const arr = JSON.parse(input); if (!Array.isArray(arr)||!arr.length) { setOutput(''); return }
        const keys = Object.keys(arr[0]); setOutput(keys.map(k => escapeCsvValue(k)).join(',') + '\n' + arr.map((o: Record<string, unknown>) => keys.map(k => escapeCsvValue(String(o[k] ?? ''))).join(',')).join('\n'))
      }
    } catch (e) { setError((e as Error).message || '转换失败'); setOutput('') }
  }

  useAutoProcess(input, convert, [mode])

  return (
    <div className="max-w-5xl mx-auto animate-fadeInUp">
      <ToolHeader name="CSV ↔ JSON" accent="转换" accentColor="text-neon-green" desc="CSV 数据与 JSON 数组互相转换 · 实时处理" />
      <Card>
        <div className="flex items-center gap-2">
          <Chip active={mode==='csv2json'} onClick={()=>setMode('csv2json')}>CSV → JSON</Chip>
          <Chip active={mode==='json2csv'} onClick={()=>setMode('json2csv')}>JSON → CSV</Chip>
          <span className="ml-auto text-[10px] text-gray-500 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" /> 实时
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>输入</Label><Textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={mode==='csv2json'?'name,age\nJohn,30':'[{"name":"John","age":"30"}]'} rows={12} /></div>
          <div className="space-y-2"><div className="flex justify-between"><Label>输出</Label><CopyBtn copied={copied} onCopy={async()=>{await navigator.clipboard.writeText(output);setCopied(true);setTimeout(()=>setCopied(false),1500)}} /></div><Textarea value={output} readOnly rows={12} className="text-neon-green result-flash" /></div>
        </div>
        {error && <Alert>{error}</Alert>}
      </Card>
    </div>
  )
}
