import { useState } from 'react'
import { ToolHeader, Card, Textarea, Label } from '../components/ui'
import { useAutoProcess } from '../hooks/useAutoProcess'

export default function Base64ImageTool() {
  const [input, setInput] = useState('')
  const [src, setSrc] = useState('')
  const [error, setError] = useState('')

  const preview = () => {
    setError(''); setSrc('')
    if (!input.trim()) return
    try { setSrc(input.startsWith('data:') ? input : `data:image/png;base64,${input}`) } catch { setError('无效的 Base64') }
  }

  useAutoProcess(input, preview)

  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp">
      <ToolHeader name="Base64" accent="图片预览" accentColor="text-neon-cyan" desc="Base64 字符串转图片预览 · 实时预览" />
      <Card>
        <div className="space-y-2"><Label>Base64 字符串</Label><Textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="data:image/png;base64,iVBOR..." rows={6} /></div>
        {src && <div className="rounded-2xl border border-white/10 p-4 bg-cyber-bg-deep flex justify-center result-flash"><img src={src} alt="Preview" className="max-h-64 max-w-full object-contain rounded-lg" /></div>}
        {error && <div className="text-sm text-red-400">{error}</div>}
      </Card>
    </div>
  )
}
