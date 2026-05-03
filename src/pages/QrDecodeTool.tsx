import { useState, useRef } from 'react'
import { ScanLine } from 'lucide-react'
import jsQR from 'jsqr'
import { ToolHeader, Card, Textarea, Label, CopyBtn, Alert } from '../components/ui'

export default function QrDecodeTool() {
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const decode = (file: File) => {
    setError(''); setResult('')
    if (!file.type.startsWith('image/')) { setError('请上传图片文件'); return }

    const img = new Image()
    img.onload = () => {
      const c = canvasRef.current
      if (!c) return
      // Scale to reasonable size for QR detection
      const maxDim = 1024
      let w = img.width, h = img.height
      if (w > maxDim || h > maxDim) {
        const ratio = Math.min(maxDim / w, maxDim / h)
        w = Math.floor(w * ratio); h = Math.floor(h * ratio)
      }
      c.width = w; c.height = h
      const ctx = c.getContext('2d')
      if (!ctx) return
      ctx.drawImage(img, 0, 0, w, h)
      const imageData = ctx.getImageData(0, 0, w, h)
      const code = jsQR(imageData.data, w, h)
      if (code) {
        setResult(code.data)
      } else {
        setError('未检测到二维码，请确保图片中包含清晰的二维码')
      }
    }
    img.onerror = () => setError('图片加载失败')
    img.src = URL.createObjectURL(file)
  }

  return (
    <div className="max-w-md mx-auto animate-fadeInUp">
      <ToolHeader name="二维码" accent="解码" accentColor="text-neon-green" glowClass="text-glow-green" desc="上传二维码图片并解码内容" />
      <Card>
        <div
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) decode(f) }}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${dragging ? 'border-neon-cyan bg-neon-cyan/5' : 'border-white/10 hover:border-white/20'}`}
        >
          <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) decode(f) }} className="absolute inset-0 opacity-0 cursor-pointer" />
          <ScanLine size={28} className="mx-auto text-gray-500 mb-3" />
          <p className="text-sm text-white font-medium">上传二维码图片</p>
          <p className="text-xs text-gray-500 mt-1">支持 PNG · JPG · WebP</p>
        </div>
        <canvas ref={canvasRef} className="hidden" />
        {result && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>解码结果</Label>
              <CopyBtn copied={copied} onCopy={async () => { await navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 1500) }} />
            </div>
            <Textarea value={result} readOnly rows={4} className="text-neon-green" />
          </div>
        )}
        {error && <Alert>{error}</Alert>}
      </Card>
    </div>
  )
}
