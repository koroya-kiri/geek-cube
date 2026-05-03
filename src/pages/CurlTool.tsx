import { useState } from 'react'
import { ToolHeader, Card, Chip, Input, Label, CopyBtn, Textarea } from '../components/ui'
import { useAutoProcess } from '../hooks/useAutoProcess'

export default function CurlTool() {
  const [method, setMethod] = useState('GET')
  const [url, setUrl] = useState('')
  const [headers, setHeaders] = useState('')
  const [body, setBody] = useState('')
  const [cmd, setCmd] = useState('')
  const [copied, setCopied] = useState(false)

  const build = () => {
    if (!url.trim()) { setCmd(''); return }
    let c = `curl -X ${method} "${url}"`
    if (headers.trim()) headers.trim().split('\n').forEach(h => { if(h.trim()) c += ` \\\n  -H "${h.trim()}"` })
    if (body.trim() && method !== 'GET') c += ` \\\n  -d '${body.trim().replace(/'/g,"\\'")}'`
    setCmd(c)
  }

  useAutoProcess(url, build, [method, headers, body])

  return (
    <div className="max-w-xl mx-auto animate-fadeInUp">
      <ToolHeader name="cURL" accent="生成器" accentColor="text-neon-magenta" desc="可视化构建 cURL 命令 · 实时生成" />
      <Card>
        <div className="flex items-center gap-2">{['GET','POST','PUT','DELETE','PATCH'].map(m=><Chip key={m} active={method===m} onClick={()=>setMethod(m)}>{m}</Chip>)}
          <span className="ml-auto text-[10px] text-gray-500 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" /> 实时
          </span>
        </div>
        <div className="space-y-2"><Label>URL</Label><Input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://api.example.com/users" /></div>
        <div className="space-y-2"><Label>Headers（每行一个）</Label><Textarea value={headers} onChange={e=>setHeaders(e.target.value)} placeholder="Content-Type: application/json" rows={3} /></div>
        {method !== 'GET' && <div className="space-y-2"><Label>Body</Label><Textarea value={body} onChange={e=>setBody(e.target.value)} placeholder='{"name":"test"}' rows={4} /></div>}
        <div className="flex items-center gap-2">
          <CopyBtn copied={copied} onCopy={async()=>{if(cmd){await navigator.clipboard.writeText(cmd);setCopied(true);setTimeout(()=>setCopied(false),1500)}}} />
        </div>
        {cmd && <pre className="p-4 rounded-xl bg-cyber-bg-deep border border-white/10 text-sm text-neon-green font-mono overflow-x-auto whitespace-pre-wrap result-flash">{cmd}</pre>}
      </Card>
    </div>
  )
}
