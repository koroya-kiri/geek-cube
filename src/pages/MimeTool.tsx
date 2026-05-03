import { useState } from 'react'
import { ToolHeader, Card, Input, Label } from '../components/ui'

const MIMES: Record<string,string> = {
  'html':'text/html','css':'text/css','js':'text/javascript','json':'application/json','xml':'application/xml',
  'png':'image/png','jpg':'image/jpeg','jpeg':'image/jpeg','gif':'image/gif','webp':'image/webp','svg':'image/svg+xml','ico':'image/x-icon',
  'mp3':'audio/mpeg','wav':'audio/wav','ogg':'audio/ogg','mp4':'video/mp4','webm':'video/webm',
  'pdf':'application/pdf','zip':'application/zip','tar':'application/x-tar','gz':'application/gzip',
  'txt':'text/plain','csv':'text/csv','md':'text/markdown','yaml':'application/x-yaml','yml':'application/x-yaml',
  'ttf':'font/ttf','woff':'font/woff','woff2':'font/woff2','otf':'font/otf',
  'ts':'video/mp2t','m3u8':'application/vnd.apple.mpegurl',
  'wasm':'application/wasm',
}

export default function MimeTool() {
  const [ext, setExt] = useState('')
  const [mime, setMime] = useState('')

  const lookup = (v: string) => { setExt(v); const k = v.replace(/^\./,'').toLowerCase(); setMime(MIMES[k] || '未找到对应 MIME 类型') }

  return (
    <div className="max-w-sm mx-auto animate-fadeInUp">
      <ToolHeader name="MIME" accent="查询" desc="根据文件扩展名查询 MIME 类型" />
      <Card>
        <div className="space-y-2"><Label>文件扩展名</Label><Input value={ext} onChange={e => lookup(e.target.value)} placeholder="例如: .js, pdf, png" /></div>
        {mime && <div className="p-4 rounded-xl bg-cyber-bg-deep border border-white/10 text-center"><Label>MIME 类型</Label><div className="text-lg text-neon-cyan font-mono mt-2">{mime}</div></div>}
        <div className="flex flex-wrap gap-1.5">
          {Object.keys(MIMES).slice(0,20).map(e => <button key={e} onClick={() => lookup(e)} className="px-2.5 py-1 rounded-lg bg-cyber-bg-deep border border-white/10 text-xs text-gray-400 hover:text-white hover:border-white/20 transition-colors">{e}</button>)}
        </div>
      </Card>
    </div>
  )
}
