import { useState, useRef, useCallback } from 'react'
import { Trash2, FileText, Loader2, ChevronUp, ChevronDown, Plus } from 'lucide-react'
import { PDFDocument } from 'pdf-lib'
import { ToolHeader, Card, Button, Alert } from '../components/ui'

interface PdfFile {
  id: string
  file: File
  name: string
  size: string
  pages: number
  status: 'ready' | 'loading' | 'error'
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

let fileId = 0
function nextId(): string { return `pdf-${++fileId}` }

export default function PdfMergeTool() {
  const [files, setFiles] = useState<PdfFile[]>([])
  const [msg, setMsg] = useState('')
  const [ok, setOk] = useState(false)
  const [merging, setMerging] = useState(false)
  const [dragging, setDragging] = useState(false)
  const inpRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback(async (fileList: FileList | null) => {
    if (!fileList) return
    setMsg('')

    const newFiles: PdfFile[] = []
    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i]
      if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) continue

      const entry: PdfFile = {
        id: nextId(),
        file: f,
        name: f.name,
        size: formatSize(f.size),
        pages: 0,
        status: 'loading',
      }
      newFiles.push(entry)

      /* Count pages asynchronously */
      try {
        const buf = await f.arrayBuffer()
        const doc = await PDFDocument.load(buf, { ignoreEncryption: true })
        entry.pages = doc.getPageCount()
        entry.status = 'ready'
      } catch {
        entry.status = 'error'
      }
      /* Trigger re-render to update page counts */
      setFiles(prev => [...prev])
    }

    if (newFiles.length === 0) {
      setMsg('未找到有效的 PDF 文件')
      setOk(false)
      return
    }

    setFiles(prev => [...prev, ...newFiles])
  }, [])

  const remove = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
    setMsg(''); setOk(false)
  }

  const move = (id: string, dir: -1 | 1) => {
    setFiles(prev => {
      const idx = prev.findIndex(f => f.id === id)
      if (idx < 0) return prev
      const target = idx + dir
      if (target < 0 || target >= prev.length) return prev
      const next = [...prev]
      ;[next[idx], next[target]] = [next[target], next[idx]]
      return next
    })
  }

  const merge = async () => {
    const ready = files.filter(f => f.status === 'ready')
    if (ready.length < 2) {
      setMsg('请至少添加 2 个有效的 PDF 文件')
      setOk(false)
      return
    }

    setMerging(true); setMsg('')
    try {
      const merged = await PDFDocument.create()
      for (const entry of ready) {
        const buf = await entry.file.arrayBuffer()
        const src = await PDFDocument.load(buf, { ignoreEncryption: true })
        const copied = await merged.copyPages(src, src.getPageIndices())
        copied.forEach(p => merged.addPage(p))
      }

      const bytes = await merged.save()
      const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `merged_${ready.length}files.pdf`
      document.body.appendChild(a); a.click(); document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 1000)

      const totalPages = ready.reduce((s, f) => s + f.pages, 0)
      setMsg(`成功合并 ${ready.length} 个文件，共 ${totalPages} 页`)
      setOk(true)
    } catch (e) {
      setMsg(e instanceof Error ? e.message : '合并失败')
      setOk(false)
    } finally {
      setMerging(false)
    }
  }

  const totalPages = files.filter(f => f.status === 'ready').reduce((s, f) => s + f.pages, 0)

  return (
    <div className="max-w-xl mx-auto animate-fadeInUp">
      <ToolHeader name="PDF" accent="合并" accentColor="text-neon-orange" glowClass="text-glow-magenta" desc="合并多个 PDF 文件为一个" />

      <Card>
        {/* Upload area */}
        <div
          onClick={() => inpRef.current?.click()}
          onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDragging(true) }}
          onDragEnter={e => { e.preventDefault(); e.stopPropagation(); setDragging(true) }}
          onDragLeave={e => { e.preventDefault(); e.stopPropagation(); setDragging(false) }}
          onDrop={e => {
            e.preventDefault(); e.stopPropagation(); setDragging(false)
            addFiles(e.dataTransfer.files)
          }}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            dragging ? 'border-neon-cyan bg-neon-cyan/5' : 'border-white/15 hover:border-neon-cyan/50 hover:bg-cyber-bg-hover/40'
          }`}
        >
          <input
            ref={inpRef}
            type="file"
            accept=".pdf,application/pdf"
            multiple
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={e => { addFiles(e.target.files); e.target.value = '' }}
          />
          <Plus size={28} className="mx-auto text-gray-500 mb-3" />
          <p className="text-sm text-white font-medium">点击或拖拽上传 PDF 文件</p>
          <p className="text-xs text-gray-500 mt-1">支持多选 · 可重复添加</p>
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="space-y-1.5">
            {files.map((f, i) => (
              <div key={f.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-cyber-bg-deep border border-white/10">
                <FileText size={16} className={`shrink-0 ${f.status === 'error' ? 'text-red-400' : 'text-neon-yellow'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{f.name}</p>
                  <p className="text-xs text-gray-500">
                    {f.size}
                    {f.status === 'ready' && ` · ${f.pages} 页`}
                    {f.status === 'loading' && ' · 读取中...'}
                    {f.status === 'error' && ' · 读取失败'}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => move(f.id, -1)} disabled={i === 0} className="p-1 rounded text-gray-500 hover:text-white disabled:opacity-20 transition-colors" title="上移"><ChevronUp size={14} /></button>
                  <button onClick={() => move(f.id, 1)} disabled={i === files.length - 1} className="p-1 rounded text-gray-500 hover:text-white disabled:opacity-20 transition-colors" title="下移"><ChevronDown size={14} /></button>
                  <button onClick={() => remove(f.id)} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors" title="移除"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {totalPages > 0 && (
          <div className="text-center text-sm text-gray-400">
            {files.filter(f => f.status === 'ready').length} 个文件 · 共 {totalPages} 页
          </div>
        )}

        <Button onClick={merge} disabled={merging || files.filter(f => f.status === 'ready').length < 2} className="w-full">
          {merging ? <><Loader2 size={15} className="animate-spin" />合并中...</> : `合并 ${files.filter(f => f.status === 'ready').length} 个文件`}
        </Button>

        {msg && !ok && <Alert>{msg}</Alert>}
        {msg && ok && <div className="px-4 py-3 rounded-xl bg-neon-green/10 border border-neon-green/20 text-sm text-neon-green">{msg}</div>}
      </Card>
    </div>
  )
}
