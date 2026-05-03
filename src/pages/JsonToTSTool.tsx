import { useState } from 'react'
import { Copy } from 'lucide-react'
import { ToolHeader, Card, Button, Textarea, Label, CopyBtn, Alert } from '../components/ui'

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

function inferType(value: JsonValue, key: string): string {
  if (value === null) return 'null'
  if (Array.isArray(value)) {
    if (value.length === 0) return 'unknown[]'
    const types = [...new Set(value.map(v => inferType(v, key)))]
    return types.length === 1 ? `${types[0]}[]` : `(${types.join(' | ')})[]`
  }
  const t = typeof value
  if (t === 'string') return 'string'
  if (t === 'number') return 'number'
  if (t === 'boolean') return 'boolean'
  if (t === 'object') {
    const entries = Object.entries(value as Record<string, JsonValue>)
    if (entries.length === 0) return 'Record<string, unknown>'
    const interfaceName = capitalize(key)
    return interfaceName
  }
  return 'unknown'
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/[^a-zA-Z0-9]/g, '')
}

function generateTS(data: Record<string, JsonValue>, rootName = 'Root'): string {
  const interfaces: Map<string, string> = new Map()
  const processed = new Set<string>()

  function buildInterface(obj: Record<string, JsonValue>, name: string): string {
    if (processed.has(name)) return name
    processed.add(name)

    const lines: string[] = []
    for (const [key, value] of Object.entries(obj)) {
      const optional = value === null || value === undefined
      const type = inferType(value, key)
      const tsType = type === capitalize(key) ? type : type
      const indent = '  '
      lines.push(`${indent}${key}${optional ? '?' : ''}: ${tsType};`)

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const subName = capitalize(key)
        buildInterface(value as Record<string, JsonValue>, subName)
      }
    }
    interfaces.set(name, lines.join('\n'))
    return name
  }

  buildInterface(data, rootName)

  const outputs: string[] = []
  for (const [name, body] of interfaces) {
    outputs.push(`export interface ${name} {\n${body}\n}`)
  }
  return outputs.join('\n\n')
}

export default function JsonToTSTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [rootName, setRootName] = useState('Root')
  const [copied, setCopied] = useState(false)

  const convert = () => {
    setError(''); if (!input.trim()) { setOutput(''); return }
    try {
      const data = JSON.parse(input)
      if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        setOutput(`type ${rootName} = ${inferType(data as JsonValue, rootName)}`)
        return
      }
      setOutput(generateTS(data as Record<string, JsonValue>, rootName))
    } catch (e) { setError((e as Error).message); setOutput('') }
  }

  return (
    <div className="max-w-5xl mx-auto animate-fadeInUp">
      <ToolHeader name="JSON →" accent="TypeScript" desc="从 JSON 数据自动生成 TypeScript interface 定义" />
      <Card>
        <div className="flex items-center gap-3">
          <div className="space-y-1 flex-1">
            <Label>根类型名</Label>
            <input value={rootName} onChange={e => setRootName(e.target.value)} placeholder="Root"
              className="w-32 px-3 py-2 rounded-lg bg-cyber-bg-deep border border-white/10 text-white text-sm focus:outline-none focus:border-neon-cyan/60 font-mono" />
          </div>
          <Button onClick={convert} disabled={!input.trim()} className="mt-5"><Copy size={14} />生成</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>JSON 数据</Label><Textarea value={input} onChange={e => setInput(e.target.value)} placeholder='{"name":"John","age":30,"tags":["dev"]}' rows={16} /></div>
          <div className="space-y-2">
            <div className="flex justify-between"><Label>TypeScript</Label><CopyBtn copied={copied} onCopy={async()=>{await navigator.clipboard.writeText(output);setCopied(true);setTimeout(()=>setCopied(false),1500)}} /></div>
            <Textarea value={output} readOnly rows={16} className="text-neon-green result-flash font-mono text-xs" />
          </div>
        </div>
        {error && <Alert>{error}</Alert>}
      </Card>
    </div>
  )
}
