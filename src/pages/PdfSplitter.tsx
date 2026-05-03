import { useState, useRef, useCallback } from 'react'
import { Upload, Trash2, FileText, Loader2 } from 'lucide-react'
import { PDFDocument } from 'pdf-lib'
import { ToolHeader, Card, Button, Input, Label, Alert } from '../components/ui'

function parsePages(input: string, total: number): number[] {
  const s = new Set<number>()
  for (const p of input.split(',')) {
    const t = p.trim()
    if (t.includes('-')) {
      const [a,b] = t.split('-').map(Number); if (isNaN(a)||isNaN(b)||a<1||b>total||a>b) throw new Error(`无效范围: ${t} (1-${total})`)
      for (let i=a;i<=b;i++) s.add(i)
    } else { const n=+t; if(isNaN(n)||n<1||n>total) throw new Error(`无效页码: ${t} (1-${total})`); s.add(n) }
  }
  if (!s.size) throw new Error('请输入页码范围')
  return [...s].sort((a,b)=>a-b)
}

function acceptPdfFile(f: File): File | null {
  if (!f) return null
  if (f.type === 'application/pdf') return f
  if (f.name.toLowerCase().endsWith('.pdf')) return f
  return null
}

export default function PdfSplitter() {
  const [file, setFile] = useState<File|null>(null)
  const [range, setRange] = useState('')
  const [msg, setMsg] = useState('')
  const [ok, setOk] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const inpRef = useRef<HTMLInputElement>(null)

  const onFile = useCallback((f: File | null) => {
    const pdf = f ? acceptPdfFile(f) : null
    if (pdf) { setFile(pdf); setMsg(''); setOk(false) }
    else if (f) { setMsg('请选择 PDF 文件'); setOk(false) }
  }, [])

  const handleSplit = useCallback(async () => {
    if (!file) { setMsg('请先上传 PDF'); setOk(false); return }
    if (!range.trim()) { setMsg('请输入页码范围'); setOk(false); return }
    setLoading(true); setMsg('')
    try {
      const buf = await file.arrayBuffer()
      const src = await PDFDocument.load(buf)
      const total = src.getPageCount()
      if (!total) { setMsg('PDF 无页面'); setOk(false); setLoading(false); return }
      const pages = parsePages(range, total)
      const doc = await PDFDocument.create()
      const copied = await doc.copyPages(src, pages.map(p => p-1))
      copied.forEach(p => doc.addPage(p))
      const bytes = await doc.save()
      const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${file.name.replace(/\.pdf$/i,'')}_pages_${range.replace(/[^a-zA-Z0-9,\-]/g,'')}.pdf`
      document.body.appendChild(a); a.click(); document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      setMsg(`成功提取 ${pages.length} / ${total} 页`); setOk(true)
    } catch(e) { setMsg(e instanceof Error ? e.message : '拆分失败'); setOk(false) }
    finally { setLoading(false) }
  }, [file, range])

  return (
    <div className="max-w-xl mx-auto animate-fadeInUp">
      <ToolHeader name="PDF" accent="拆分" accentColor="text-neon-orange" glowClass="text-glow-magenta" desc="按页码范围提取 PDF 页面为独立文件" />

      <Card>
        {/* Upload area – click OR drag */}
        <div
          onClick={() => inpRef.current?.click()}
          onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDragging(true) }}
          onDragEnter={e => { e.preventDefault(); e.stopPropagation(); setDragging(true) }}
          onDragLeave={e => { e.preventDefault(); e.stopPropagation(); setDragging(false) }}
          onDrop={e => {
            e.preventDefault(); e.stopPropagation(); setDragging(false)
            const f = e.dataTransfer.files?.[0]
            if (f) onFile(f)
          }}
          className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
            dragging ? 'border-neon-cyan bg-neon-cyan/5' : 'border-white/15 hover:border-neon-cyan/50 hover:bg-cyber-bg-hover/40'
          }`}
        >
          <input
            ref={inpRef}
            type="file"
            accept=".pdf,application/pdf"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={e => {
              const f = e.target.files?.[0]
              if (f) onFile(f)
              e.target.value = ''
            }}
          />
          <Upload size={28} className="mx-auto text-gray-500 mb-3" />
          <p className="text-sm text-white font-medium">点击或拖拽上传 PDF 文件</p>
          <p className="text-xs text-gray-500 mt-1">支持 .pdf 格式文件</p>
        </div>

        {file && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-cyber-bg-deep border border-white/10">
            <FileText size={16} className="text-neon-yellow shrink-0" />
            <div className="flex-1 min-w-0"><p className="text-sm text-white truncate">{file.name}</p><p className="text-xs text-gray-500">{(file.size/1024).toFixed(1)} KB</p></div>
            <button onClick={() => { setFile(null); setMsg(''); setOk(false) }} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"><Trash2 size={14} /></button>
          </div>
        )}

        <div className="space-y-2">
          <Label>页码范围</Label>
          <Input value={range} onChange={e => setRange(e.target.value)} placeholder="例如：1-5, 8, 10-12" />
          <p className="text-xs text-gray-500">支持格式：单页 5、连续 1-5、组合 1-5, 8, 10-12</p>
        </div>

        <Button onClick={handleSplit} disabled={loading || !file || !range.trim()} className="w-full">
          {loading ? <><Loader2 size={15} className="animate-spin" />正在拆分...</> : '开始拆分'}
        </Button>

        {msg && !ok && <Alert>{msg}</Alert>}
        {msg && ok && <div className="px-4 py-3 rounded-xl bg-neon-green/10 border border-neon-green/20 text-sm text-neon-green">{msg}</div>}
      </Card>
    </div>
  )
}
