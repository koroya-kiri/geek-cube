import { useState, useRef } from 'react'
import { Upload, FileText, Loader2, RotateCw } from 'lucide-react'
import { PDFDocument, RotationTypes } from 'pdf-lib'
import { ToolHeader, Card, Button, Input, Label, Alert } from '../components/ui'

const ROTATIONS = [90, 180, 270] as const

export default function PdfRotateTool() {
  const [file, setFile] = useState<File | null>(null)
  const [pages, setPages] = useState('')
  const [deg, setDeg] = useState(90)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [ok, setOk] = useState(false)
  const [dragging, setDragging] = useState(false)
  const inpRef = useRef<HTMLInputElement>(null)

  const onFile = async (f: File) => {
    if (f.type !== 'application/pdf' && !f.name.endsWith('.pdf')) { setMsg('请选择 PDF'); setOk(false); return }
    setFile(f); setMsg(''); setOk(false)
    try { const buf = await f.arrayBuffer(); const doc = await PDFDocument.load(buf, { ignoreEncryption: true }); setTotalPages(doc.getPageCount()) } catch { setTotalPages(0) }
  }

  const rotate = async () => {
    if (!file) { setMsg('请先上传 PDF'); return }
    setLoading(true); setMsg('')
    try {
      const buf = await file.arrayBuffer(); const doc = await PDFDocument.load(buf, { ignoreEncryption: true })
      const indices = pages.trim() ? parsePages(pages, totalPages) : doc.getPageIndices()
      for (const i of indices) {
        const page = doc.getPage(i)
        page.setRotation({ type: RotationTypes.Degrees, angle: (page.getRotation().angle + deg) % 360 })
      }
      const bytes = await doc.save(); download(bytes, `rotated_${deg}deg.pdf`)
      setMsg(`成功旋转 ${indices.length} 页`); setOk(true)
    } catch (e) { setMsg(e instanceof Error ? e.message : '操作失败'); setOk(false) }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-xl mx-auto animate-fadeInUp">
      <ToolHeader name="PDF" accent="旋转" accentColor="text-neon-orange" desc="旋转 PDF 页面 (90° / 180° / 270°)" />
      <Card>
        <div onClick={() => inpRef.current?.click()} onDragOver={e => { e.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) onFile(f) }}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${dragging ? 'border-neon-cyan bg-neon-cyan/5' : 'border-white/15 hover:border-neon-cyan/50'}`}>
          <input ref={inpRef} type="file" accept=".pdf,application/pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = '' }} />
          <Upload size={28} className="mx-auto text-gray-500 mb-3" />
          <p className="text-sm text-white">上传 PDF</p>
        </div>
        {file && <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-cyber-bg-deep border border-white/10"><FileText size={16} className="text-neon-yellow" /><span className="text-sm text-white truncate">{file.name}</span><span className="text-xs text-gray-500 ml-auto">{totalPages} 页</span></div>}
        <div className="flex gap-2">{ROTATIONS.map(d => <Button key={d} onClick={() => setDeg(d)} variant={deg === d ? 'primary' : 'secondary'} className="text-xs"><RotateCw size={13} />{d}°</Button>)}</div>
        <div className="space-y-1"><Label>页码范围（留空=全部）</Label><Input value={pages} onChange={e => setPages(e.target.value)} placeholder="1-3, 5" /></div>
        <Button onClick={rotate} disabled={loading || !file} className="w-full">{loading ? <Loader2 size={15} className="animate-spin" /> : `旋转 ${deg}°`}</Button>
        {msg && !ok && <Alert>{msg}</Alert>}
        {msg && ok && <div className="px-4 py-3 rounded-xl bg-neon-green/10 border border-neon-green/20 text-sm text-neon-green">{msg}</div>}
      </Card>
    </div>
  )
}

function parsePages(input: string, total: number): number[] {
  const s = new Set<number>()
  for (const p of input.split(',')) {
    const t = p.trim(); if (!t) continue
    if (t.includes('-')) { const [a,b] = t.split('-').map(Number); if (isNaN(a)||isNaN(b)||a<1||b>total||a>b) throw new Error(`无效范围: ${t}`); for (let i=a;i<=b;i++) s.add(i-1) }
    else { const n=+t; if(isNaN(n)||n<1||n>total) throw new Error(`无效页码: ${t}`); s.add(n-1) }
  }
  if (!s.size) throw new Error('请输入页码范围')
  return [...s].sort((a,b)=>a-b)
}

function download(bytes: Uint8Array, name: string) {
  const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' }); const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = name
  document.body.appendChild(a); a.click(); document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
