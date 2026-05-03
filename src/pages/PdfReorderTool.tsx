import { useState, useRef, useCallback } from 'react'
import { Upload, FileText, Loader2, ChevronUp, ChevronDown, MoveVertical } from 'lucide-react'
import { PDFDocument } from 'pdf-lib'
import { ToolHeader, Card, Button, Input, Alert } from '../components/ui'

interface PageEntry { id: number; originalIndex: number; label: string }

export default function PdfReorderTool() {
  const [file, setFile] = useState<File | null>(null)
  const [entries, setEntries] = useState<PageEntry[]>([])
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [moveFrom, setMoveFrom] = useState('')
  const [moveTo, setMoveTo] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [ok, setOk] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [dropIdx, setDropIdx] = useState<number | null>(null)
  const inpRef = useRef<HTMLInputElement>(null)

  const onFile = useCallback(async (f: File) => {
    if (f.type !== 'application/pdf' && !f.name.endsWith('.pdf')) { setMsg('请选择 PDF'); setOk(false); return }
    setFile(f); setMsg(''); setOk(false); setSelectedIdx(null); setMoveFrom(''); setMoveTo('')
    try {
      const buf = await f.arrayBuffer(); const doc = await PDFDocument.load(buf, { ignoreEncryption: true })
      const total = doc.getPageCount()
      setEntries(Array.from({ length: total }, (_, i) => ({ id: i + 1, originalIndex: i, label: `第 ${i + 1} 页` })))
    } catch { setEntries([]) }
  }, [])

  const movePage = (fromIdx: number, toIdx: number) => {
    if (fromIdx === toIdx) return
    const next = [...entries]; const [moved] = next.splice(fromIdx, 1); next.splice(toIdx, 0, moved)
    setEntries(next); setSelectedIdx(null)
  }

  const handlePageClick = (idx: number) => {
    if (selectedIdx === null) { setSelectedIdx(idx) }
    else if (selectedIdx === idx) { setSelectedIdx(null) }
    else { movePage(selectedIdx, idx) }
  }

  const handleDragStart = (idx: number) => setDragIdx(idx)
  const handleDragOver = (e: React.DragEvent, idx: number) => { e.preventDefault(); setDropIdx(idx) }
  const handleDragLeave = () => setDropIdx(null)
  const handleDrop = (idx: number) => {
    setDropIdx(null)
    if (dragIdx !== null && dragIdx !== idx) movePage(dragIdx, idx)
    setDragIdx(null)
  }

  const handleMoveByInput = () => {
    const from = parseInt(moveFrom) - 1; const to = parseInt(moveTo) - 1
    if (isNaN(from) || isNaN(to) || from<0||from>=entries.length||to<0||to>entries.length) { setMsg('请输入有效页码'); setOk(false); return }
    movePage(from, to); setMoveFrom(''); setMoveTo(''); setMsg('')
  }

  const reset = () => {
    setEntries(Array.from({ length: entries.length }, (_, i) => ({ id: i + 1, originalIndex: i, label: `第 ${i + 1} 页` })))
    setSelectedIdx(null)
  }

  const exportPdf = async () => {
    if (!file || entries.length < 2) { setMsg('至少需要 2 页'); return }
    setLoading(true); setMsg('')
    try {
      const buf = await file.arrayBuffer(); const src = await PDFDocument.load(buf, { ignoreEncryption: true })
      const doc = await PDFDocument.create()
      for (const entry of entries) { const [copied] = await doc.copyPages(src, [entry.originalIndex]); doc.addPage(copied) }
      const bytes = await doc.save()
      const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' }); const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = `reordered.pdf`
      document.body.appendChild(a); a.click(); document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      setMsg(`已按新顺序导出 ${entries.length} 页`); setOk(true)
    } catch (e) { setMsg(e instanceof Error ? e.message : '操作失败'); setOk(false) }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-3xl mx-auto animate-fadeInUp">
      <ToolHeader name="PDF" accent="页面重排" accentColor="text-neon-orange" desc="点击选中 → 点击插入 · 拖拽重排 · 快捷键移动" />
      <Card>
        <div onClick={() => inpRef.current?.click()} onDragOver={e => { e.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) onFile(f) }}
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${dragging ? 'border-neon-cyan bg-neon-cyan/5' : 'border-white/15 hover:border-neon-cyan/50'}`}>
          <input ref={inpRef} type="file" accept=".pdf,application/pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = '' }} />
          <Upload size={24} className="mx-auto text-gray-500 mb-2" />
          <p className="text-sm text-white">点击或拖拽上传 PDF</p>
        </div>
        {file && <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-cyber-bg-deep border border-white/10"><FileText size={16} className="text-neon-yellow" /><span className="text-sm text-white truncate">{file.name}</span><span className="text-xs text-gray-500 ml-auto">{entries.length} 页</span></div>}

        {entries.length > 0 && (
          <div className="flex items-end gap-2 p-3 rounded-xl bg-cyber-bg-deep border border-white/10">
            <div className="space-y-1"><span className="text-[10px] text-gray-500">移动第</span><Input value={moveFrom} onChange={e => setMoveFrom(e.target.value)} placeholder="" className="w-12 text-center text-sm" /></div>
            <span className="text-gray-500 text-sm pb-2">页到</span>
            <div className="space-y-1"><span className="text-[10px] text-gray-500">第</span><Input value={moveTo} onChange={e => setMoveTo(e.target.value)} placeholder="" className="w-12 text-center text-sm" /></div>
            <span className="text-gray-500 text-sm pb-2">页前</span>
            <Button onClick={handleMoveByInput} disabled={!moveFrom||!moveTo} variant="secondary" className="text-xs py-2"><MoveVertical size={13} />插入</Button>
            <div className="flex-1" />
            <Button onClick={reset} variant="ghost" className="text-xs">重置</Button>
          </div>
        )}

        {entries.length > 0 && (
          <>
            {selectedIdx !== null && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-cyan/5 border border-neon-cyan/20 text-xs text-neon-cyan font-mono">
                已选中「第 {selectedIdx + 1} 页」— 点击目标位置插入
                <button onClick={e => { e.stopPropagation(); setSelectedIdx(null) }} className="ml-auto text-gray-500 hover:text-white">取消</button>
              </div>
            )}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
              {entries.map((e, i) => (
                <div key={e.id} draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={(ev) => handleDragOver(ev, i)}
                  onDragLeave={handleDragLeave}
                  onDrop={() => handleDrop(i)}
                  onClick={() => handlePageClick(i)}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all select-none ${
                    i === selectedIdx ? 'bg-neon-cyan/10 border-neon-cyan/40 ring-2 ring-neon-cyan/20 scale-105'
                    : i === dropIdx ? 'bg-neon-cyan/5 border-neon-cyan/30 border-dashed'
                    : 'bg-cyber-bg-deep border-white/10 hover:border-white/20 hover:bg-cyber-bg-hover'}`}
                >
                  <span className="text-[10px] font-mono text-gray-500">#{i + 1}</span>
                  <div className="w-10 h-14 my-1 rounded border border-white/10 flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.05))' }}>
                    <span className="text-[11px] text-gray-500 font-mono">{e.id}</span>
                  </div>
                  <div className="flex gap-0.5 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(ev) => { ev.stopPropagation(); const t = i - 1; if (t >= 0) { const next = [...entries]; [next[i], next[t]] = [next[t], next[i]]; setEntries(next) } }} disabled={i === 0}
                      className="p-0.5 rounded text-gray-600 hover:text-white disabled:opacity-20"><ChevronUp size={10} /></button>
                    <button onClick={(ev) => { ev.stopPropagation(); const t = i + 1; if (t < entries.length) { const next = [...entries]; [next[i], next[t]] = [next[t], next[i]]; setEntries(next) } }} disabled={i === entries.length - 1}
                      className="p-0.5 rounded text-gray-600 hover:text-white disabled:opacity-20"><ChevronDown size={10} /></button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <Button onClick={exportPdf} disabled={loading || entries.length < 2} className="w-full">
          {loading ? <><Loader2 size={15} className="animate-spin" />导出中...</> : `导出新顺序 (${entries.length} 页)`}
        </Button>
        {msg && !ok && <Alert>{msg}</Alert>}
        {msg && ok && <div className="px-4 py-3 rounded-xl bg-neon-green/10 border border-neon-green/20 text-sm text-neon-green">{msg}</div>}
      </Card>
    </div>
  )
}
