import { useState, useRef } from 'react'
import { Upload, Download } from 'lucide-react'
import { ToolHeader, Card, Button, Label } from '../components/ui'

export default function ImageCompressorTool() {
  const [src, setSrc] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [origSize, setOrigSize] = useState(0)
  const [compSize, setCompSize] = useState(0)
  const [quality, setQuality] = useState(80)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [scale, setScale] = useState(100)
  const [format, setFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg')
  const [dragging, setDragging] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const inpRef = useRef<HTMLInputElement>(null)

  const loadImage = (file: File) => {
    const reader = new FileReader()
    reader.onload = e => {
      const url = e.target?.result as string
      setSrc(url); setOrigSize(file.size); setPreview(null)
      const img = new window.Image()
      img.onload = () => { setWidth(img.width); setHeight(img.height); compress(url, img.width, img.height, quality, scale, format) }
      img.src = url
    }
    reader.readAsDataURL(file)
  }

  const compress = (imgSrc: string, w: number, h: number, q: number, s: number, fmt: string) => {
    const canvas = canvasRef.current; if (!canvas) return
    const nw = Math.round(w * s / 100), nh = Math.round(h * s / 100)
    canvas.width = nw; canvas.height = nh
    const ctx = canvas.getContext('2d'); if (!ctx) return
    const img = new window.Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0, nw, nh)
      canvas.toBlob(blob => {
        if (!blob) return
        setCompSize(blob.size)
        setPreview(URL.createObjectURL(blob))
      }, fmt, fmt === 'image/png' ? undefined : q / 100)
    }
    img.src = imgSrc
  }

  const download = () => {
    if (!preview) return
    const ext = format.split('/')[1].replace('jpeg', 'jpg')
    const a = document.createElement('a'); a.href = preview; a.download = `compressed.${ext}`; a.click()
  }

  const ratio = origSize > 0 && compSize > 0 ? ((1 - compSize / origSize) * 100).toFixed(0) : null

  return (
    <div className="max-w-lg mx-auto animate-fadeInUp">
      <ToolHeader name="图片" accent="压缩" accentColor="text-neon-magenta" desc="Canvas 纯前端压缩 · 调整尺寸和质量" />
      <canvas ref={canvasRef} className="hidden" />
      <Card>
        <div
          onClick={() => inpRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) loadImage(f) }}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${dragging ? 'border-neon-cyan bg-neon-cyan/5' : 'border-white/10 hover:border-white/20'}`}
        >
          <input ref={inpRef} type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => { const f = e.target.files?.[0]; if (f) loadImage(f) }} />
          <Upload size={28} className="mx-auto text-gray-500 mb-3" />
          <p className="text-sm text-white">点击或拖拽上传图片</p>
          <p className="text-xs text-gray-500 mt-1">PNG · JPG · WebP</p>
        </div>

        {src && (
          <>
            <div className="grid grid-cols-3 gap-3">
              {([
                { l: 'JPEG', k: 'image/jpeg' as const },
                { l: 'PNG', k: 'image/png' as const },
                { l: 'WebP', k: 'image/webp' as const },
              ]).map(({ l, k }) => (
                <button key={k} onClick={() => { setFormat(k); compress(src, width, height, quality, scale, k) }}
                  className={`p-2 rounded-xl text-xs font-medium transition-colors ${format === k ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20' : 'text-gray-400 border border-transparent hover:text-white'}`}>{l}</button>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between"><Label>质量: {quality}%</Label><span className="text-xs text-gray-500">{format === 'image/png' ? 'PNG 无损，质量滑块不生效' : ''}</span></div>
              <input type="range" min={10} max={100} value={quality} onChange={e => { const q = +e.target.value; setQuality(q); compress(src, width, height, q, scale, format) }} className="w-full accent-neon-cyan" disabled={format === 'image/png'} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between"><Label>缩放: {scale}%</Label><span className="text-xs text-gray-500">{Math.round(width*scale/100)}×{Math.round(height*scale/100)}</span></div>
              <div className="flex items-center gap-2">
                {[25, 50, 75, 100].map(p => (
                  <button key={p} onClick={() => { setScale(p); compress(src, width, height, quality, p, format) }}
                    className={`px-3 py-1 rounded-lg text-xs border transition-colors ${scale === p ? 'bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan' : 'border-white/10 text-gray-400 hover:text-white'}`}>{p}%</button>
                ))}
              </div>
            </div>

            {ratio !== null && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-cyber-bg-deep border border-white/10">
                <div className="text-xs text-gray-400">
                  <span>{(compSize/1024).toFixed(1)} KB</span>
                  <span className="mx-2">←</span>
                  <span className="text-gray-500">{(origSize/1024).toFixed(1)} KB</span>
                </div>
                <div className="text-sm font-bold text-neon-green">{ratio}% 缩减</div>
              </div>
            )}

            {preview && (
              <div className="rounded-xl border border-white/10 overflow-hidden">
                <img src={preview} alt="Preview" className="w-full max-h-48 object-contain bg-cyber-bg-deep" />
              </div>
            )}

            <Button onClick={download} disabled={!preview} className="w-full"><Download size={14} />下载压缩图</Button>
          </>
        )}
      </Card>
    </div>
  )
}
