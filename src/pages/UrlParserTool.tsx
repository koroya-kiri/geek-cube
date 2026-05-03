import { useState } from 'react'
import { ToolHeader, Card, Textarea, Label, CopyBtn } from '../components/ui'
import { useAutoProcess } from '../hooks/useAutoProcess'

export default function UrlParserTool() {
  const [input, setInput] = useState('')
  const [parsed, setParsed] = useState<Record<string,string>|null>(null)
  const [error, setError] = useState('')

  const parse = () => {
    setError(''); setParsed(null)
    if (!input.trim()) return
    try {
      const u = new URL(input.trim())
      const params = [...u.searchParams.entries()].map(([k,v]) => `${k}=${v}`).join('\n')
      setParsed({
        '协议': u.protocol, '主机': u.hostname, '端口': u.port || '(默认)',
        '路径': u.pathname, '哈希': u.hash || '(无)', '查询参数': params || '(无)',
        '完整 URL': u.href,
      })
    } catch { setError('无效的 URL 格式') }
  }

  useAutoProcess(input, parse)

  return (
    <div className="max-w-lg mx-auto animate-fadeInUp">
      <ToolHeader name="URL" accent="解析" desc="解析 URL 的协议、主机、路径、参数 · 实时处理" />
      <Card>
        <div className="space-y-2"><Label>输入 URL</Label><Textarea value={input} onChange={e => setInput(e.target.value)} placeholder="https://example.com/path?key=value#hash" rows={3} /></div>
        {error && <div className="text-sm text-red-400">{error}</div>}
        {parsed && <div className="space-y-2">
          {Object.entries(parsed).map(([k,v]) => (
            <div key={k} className="space-y-1">
              <Label>{k}</Label>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyber-bg-deep border border-white/10 result-flash">
                <span className="text-sm text-white font-mono flex-1 break-all whitespace-pre-wrap">{v}</span>
                <CopyBtn copied={false} onCopy={async () => { await navigator.clipboard.writeText(v) }} />
              </div>
            </div>
          ))}
        </div>}
      </Card>
    </div>
  )
}
