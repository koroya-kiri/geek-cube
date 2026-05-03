import { useState, useEffect } from 'react'
import { Textarea, Label } from '../components/ui'

export default function HtmlPreviewTool() {
  const [html, setHtml] = useState('<style>body{color:#e8e8f0;font-family:sans-serif;padding:20px;background:#0a0a0f}h1{color:#00f0ff}</style><h1>Hello World</h1><p>这是一段 <strong>HTML</strong> 代码预览。</p>')
  const [srcDoc, setSrcDoc] = useState('')

  useEffect(() => { setSrcDoc(html) }, [html])

  return (
    <div className="max-w-5xl mx-auto animate-fadeInUp">
      <h2 className="text-2xl font-bold font-display text-white mb-1.5">HTML <span className="text-neon-orange">预览</span></h2>
      <p className="text-sm text-gray-400 mb-6">实时预览 HTML 代码渲染效果</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2"><Label>HTML 代码</Label><Textarea value={html} onChange={e=>setHtml(e.target.value)} rows={18} /></div>
        <div className="space-y-2"><Label>预览</Label><div className="rounded-2xl border border-white/10 bg-white overflow-hidden min-h-[400px]"><iframe srcDoc={srcDoc} className="w-full h-[400px] border-0" sandbox="allow-scripts" title="preview" /></div></div>
      </div>
    </div>
  )
}
