import { useState } from 'react'
import { ToolHeader, Card, Textarea, Label, CopyBtn, Alert } from '../components/ui'
import { useAutoProcess } from '../hooks/useAutoProcess'

function generateSchema(obj: unknown): Record<string,unknown> {
  if (obj === null) return { type: 'null' }
  if (Array.isArray(obj)) return { type: 'array', items: obj.length ? generateSchema(obj[0]) : {} }
  if (typeof obj === 'object') {
    const props: Record<string,unknown> = {}
    const required: string[] = []
    for (const [k,v] of Object.entries(obj as Record<string,unknown>)) { props[k] = generateSchema(v); required.push(k) }
    return { type: 'object', properties: props, required }
  }
  return { type: typeof obj, example: obj }
}

export default function JsonSchemaTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const gen = () => {
    setError(''); if(!input.trim()){ setOutput(''); return }
    try {
      const obj = JSON.parse(input); const schema = { $schema: 'https://json-schema.org/draft/2020-12/schema', ...generateSchema(obj) }
      setOutput(JSON.stringify(schema, null, 2))
    } catch (e) { setError((e as Error).message); setOutput('') }
  }

  useAutoProcess(input, gen, [], 400)

  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp">
      <ToolHeader name="JSON" accent="Schema" desc="从 JSON 数据自动生成 JSON Schema · 实时生成" />
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>JSON 数据</Label><Textarea value={input} onChange={e=>setInput(e.target.value)} placeholder='{"name":"test","age":25}' rows={12} /></div>
          <div className="space-y-2"><div className="flex justify-between"><Label>JSON Schema</Label><CopyBtn copied={copied} onCopy={async()=>{await navigator.clipboard.writeText(output);setCopied(true);setTimeout(()=>setCopied(false),1500)}} /></div><Textarea value={output} readOnly rows={12} className="text-neon-green result-flash" /></div>
        </div>
        {error && <Alert>{error}</Alert>}
      </Card>
    </div>
  )
}
