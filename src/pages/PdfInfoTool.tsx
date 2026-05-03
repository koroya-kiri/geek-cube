import { useState, useRef } from 'react'
import { Upload, Loader2, Info } from 'lucide-react'
import { PDFDocument } from 'pdf-lib'
import { ToolHeader, Card, Button, Alert } from '../components/ui'

interface PdfInfo {
  pages: number
  size: string
  name: string
  encrypted: boolean
  title?: string
  author?: string
  subject?: string
  creator?: string
  producer?: string
  created?: string
  modified?: string
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

export default function PdfInfoTool() {
  const [info, setInfo] = useState<PdfInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const inpRef = useRef<HTMLInputElement>(null)

  const analyze = async (file: File) => {
    setLoading(true); setError(''); setInfo(null)

    try {
      const buf = await file.arrayBuffer()
      const doc = await PDFDocument.load(buf, { ignoreEncryption: true })

      const data: PdfInfo = {
        pages: doc.getPageCount(),
        size: formatSize(file.size),
        name: file.name,
        encrypted: false,
      }

      /* Try to extract metadata */
      try {
        data.title = doc.getTitle() || undefined
        data.author = doc.getAuthor() || undefined
        data.subject = doc.getSubject() || undefined
        data.creator = doc.getCreator() || undefined
        data.producer = doc.getProducer() || undefined
      } catch { /* metadata extraction is optional */ }

      /* Try creation/modification dates */
      try {
        const creation = doc.getCreationDate()
        if (creation) data.created = creation.toLocaleString('zh-CN')
        const mod = doc.getModificationDate()
        if (mod) data.modified = mod.toLocaleString('zh-CN')
      } catch { /* dates are optional */ }

      setInfo(data)
    } catch {
      setError('无法读取 PDF 文件，文件可能已损坏或加密')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto animate-fadeInUp">
      <ToolHeader name="PDF" accent="信息" accentColor="text-neon-orange" glowClass="text-glow-magenta" desc="查看 PDF 文件的页数、大小和元数据" />

      <Card>
        {/* Upload area */}
        <div
          onClick={() => inpRef.current?.click()}
          onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDragging(true) }}
          onDragEnter={e => { e.preventDefault(); e.stopPropagation(); setDragging(true) }}
          onDragLeave={e => { e.preventDefault(); e.stopPropagation(); setDragging(false) }}
          onDrop={e => {
            e.preventDefault(); e.stopPropagation(); setDragging(false)
            const f = e.dataTransfer.files?.[0]
            if (f) analyze(f)
          }}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            dragging ? 'border-neon-cyan bg-neon-cyan/5' : 'border-white/15 hover:border-neon-cyan/50 hover:bg-cyber-bg-hover/40'
          }`}
        >
          <input
            ref={inpRef}
            type="file"
            accept=".pdf,application/pdf"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={e => { const f = e.target.files?.[0]; if (f) analyze(f); e.target.value = '' }}
          />
          <Upload size={28} className="mx-auto text-gray-500 mb-3" />
          <p className="text-sm text-white font-medium">点击或拖拽上传 PDF 文件</p>
          <p className="text-xs text-gray-500 mt-1">支持 .pdf 格式</p>
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 py-8 text-gray-400">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">正在分析...</span>
          </div>
        )}

        {error && <Alert>{error}</Alert>}

        {info && (
          <div className="space-y-3">
            {/* Summary card */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-cyber-bg-deep border border-white/10 text-center">
                <div className="text-2xl font-bold text-neon-cyan font-mono">{info.pages}</div>
                <div className="text-xs text-gray-500 mt-1">页数</div>
              </div>
              <div className="p-4 rounded-xl bg-cyber-bg-deep border border-white/10 text-center">
                <div className="text-2xl font-bold text-neon-green font-mono">{info.size.split(' ')[0]}</div>
                <div className="text-xs text-gray-500 mt-1">{info.size.split(' ')[1] || '大小'}</div>
              </div>
              <div className="p-4 rounded-xl bg-cyber-bg-deep border border-white/10 text-center">
                <div className="text-2xl font-bold text-neon-yellow font-mono truncate px-1" title={info.name}>{info.name.length > 12 ? info.name.slice(0,10) + '..' : info.name.split('.')[0]}</div>
                <div className="text-xs text-gray-500 mt-1">格式</div>
              </div>
            </div>

            {/* Metadata table */}
            <div className="rounded-xl bg-cyber-bg-deep border border-white/10 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.05] bg-cyber-bg-surface/50">
                <Info size={13} className="text-gray-500" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">元数据</span>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {[
                  { l: '标题', v: info.title },
                  { l: '作者', v: info.author },
                  { l: '主题', v: info.subject },
                  { l: '创建工具', v: info.creator },
                  { l: 'PDF 生成器', v: info.producer },
                  { l: '创建时间', v: info.created },
                  { l: '修改时间', v: info.modified },
                ]
                  .filter(({ v }) => v)
                  .map(({ l, v }) => (
                    <div key={l} className="flex items-center px-4 py-2.5">
                      <span className="text-xs text-gray-500 w-20 shrink-0">{l}</span>
                      <span className="text-xs text-white font-mono truncate">{v}</span>
                    </div>
                  ))}
              </div>
            </div>

            <Button onClick={() => { setInfo(null); setError('') }} variant="ghost" className="w-full text-xs">
              重新上传
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
