import { useState, useRef, useEffect } from 'react'
import { Download, Scan } from 'lucide-react'
import QRCode from 'qrcode'
import { ToolHeader, Card, Button, Textarea, Label, CopyBtn, Alert } from '../components/ui'

export default function QrTool() {
  const [text, setText] = useState('https://github.com')
  const [size, setSize] = useState(280)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = canvasRef.current; if (!c) return
    if (!text.trim()) { setError(''); return }
    setError('')
    QRCode.toCanvas(c, text, { width: size, margin: 1, color: { dark: '#e8e8f0', light: '#050508' } }).catch(() => setError('二维码生成失败'))
  }, [text, size])

  return (
    <div className="max-w-2xl mx-auto animate-fadeInUp">
      <ToolHeader name="二维码" accent="生成" accentColor="text-neon-green" glowClass="text-glow-green" desc="将文本或链接转换为标准二维码" />

      <Card>
        <div className="space-y-2">
          <Label>内容</Label>
          <div className="relative"><Scan size={14} className="absolute top-3.5 right-3.5 text-gray-600" /><Textarea value={text} onChange={e => setText(e.target.value)} placeholder="输入文本或链接..." rows={3} className="pr-10" /></div>
        </div>

        <div className="space-y-2">
          <Label>尺寸: {size}px</Label>
          <input type="range" min={128} max={512} step={16} value={size} onChange={e => setSize(+e.target.value)} className="w-full accent-neon-cyan" />
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-2xl bg-white border border-white/10">
            {text.trim() ? <canvas ref={canvasRef} className="block" /> : <div className="flex items-center justify-center text-gray-400 text-sm" style={{width:size,height:size}}>输入内容后自动生成</div>}
          </div>
          {error && <Alert>{error}</Alert>}
          <div className="flex gap-2">
            <Button onClick={() => { const c=canvasRef.current; if(!c) return; const a=document.createElement('a'); a.download='qrcode.png'; a.href=c.toDataURL('image/png'); a.click() }} disabled={!text.trim()} className="text-xs"><Download size={14} />下载 PNG</Button>
            <CopyBtn copied={copied} onCopy={async () => { const c=canvasRef.current; if(!c) return; c.toBlob(async b => { if(!b) return; await navigator.clipboard.write([new ClipboardItem({'image/png':b})]); setCopied(true); setTimeout(() => setCopied(false), 1500) }) }} />
          </div>
        </div>
      </Card>
    </div>
  )
}
