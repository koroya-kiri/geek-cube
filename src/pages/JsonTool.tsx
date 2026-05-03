import { useState } from 'react'
import { Minimize2 } from 'lucide-react'
import { ToolHeader, Card, Button, Textarea, Label, CopyBtn, Alert } from '../components/ui'

export default function JsonTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const format = (minify: boolean) => {
    setError('')
    try {
      const obj = JSON.parse(input)
      setOutput(JSON.stringify(obj, null, minify ? 0 : 2))
    } catch (e) {
      setError((e as Error).message)
      setOutput('')
    }
  }

  return (
    <div className="max-w-5xl mx-auto animate-fadeInUp">
      <ToolHeader name="JSON" accent="格式化" accentColor="text-neon-cyan" glowClass="text-glow-cyan" desc="JSON 美化、压缩与语法校验" />

      <Card>
        <div className="flex items-center gap-2 flex-wrap">
          <Button onClick={() => format(false)} variant="primary" className="text-xs px-4 py-2">
            美化
          </Button>
          <Button onClick={() => format(true)} variant="secondary" className="text-xs px-4 py-2">
            <Minimize2 size={13} />
            压缩
          </Button>
          <div className="flex-1" />
          <CopyBtn copied={copied} onCopy={async () => { if (!output) return; await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500) }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>输入 JSON</Label>
            <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder='{"hello": "world"}' rows={14} />
          </div>
          <div className="space-y-2">
            <Label>结果</Label>
            <Textarea value={output} readOnly placeholder="格式化后的 JSON 将显示在这里..." rows={14} className="text-neon-green" />
          </div>
        </div>

        {error && <Alert>{error}</Alert>}
      </Card>
    </div>
  )
}
