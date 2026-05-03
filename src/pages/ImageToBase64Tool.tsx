import { useState, useCallback } from 'react'
import { Upload } from 'lucide-react'
import { ToolHeader, Card, Textarea, Label, CopyBtn } from '../components/ui'

export default function ImageToBase64Tool() {
  const [result, setResult] = useState('')
  const [copied, setCopied] = useState(false)
  const [dragging, setDragging] = useState(false)

  const upload = useCallback((file: File) => {
    const r = new FileReader()
    r.onload = e => setResult(e.target?.result as string)
    r.readAsDataURL(file)
  }, [])

  return (
    <div className="max-w-xl mx-auto animate-fadeInUp">
      <ToolHeader name="图片转" accent="Base64" accentColor="text-neon-magenta" glowClass="text-glow-magenta" desc="上传图片并转换为 Base64 编码" />
      <Card>
        <div
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) upload(f) }}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${dragging ? 'border-neon-cyan bg-neon-cyan/5' : 'border-white/10 hover:border-white/20'}`}
        >
          <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) upload(f) }} className="absolute inset-0 opacity-0 cursor-pointer" />
          <Upload size={28} className="mx-auto text-gray-500 mb-3" />
          <p className="text-sm text-white font-medium">点击或拖拽上传图片</p>
          <p className="text-xs text-gray-500 mt-1">PNG · JPG · GIF · WebP</p>
        </div>
        {result && (
          <div className="space-y-3">
            <Label>Base64 结果</Label>
            <img src={result} alt="Preview" className="max-h-48 rounded-xl border border-white/10 object-contain mx-auto" />
            <div className="flex justify-between items-center">
              <Label>Base64 ({Math.round(result.length/1024)}KB)</Label>
              <CopyBtn copied={copied} onCopy={async () => { await navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 1500) }} />
            </div>
            <Textarea value={result} readOnly rows={5} className="text-xs text-neon-green" />
          </div>
        )}
      </Card>
    </div>
  )
}
