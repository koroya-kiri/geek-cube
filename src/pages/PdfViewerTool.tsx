import { useState, useRef, useEffect, useCallback } from 'react'
import { Upload, FileText, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Minimize2, Loader2 } from 'lucide-react'
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { ToolHeader, Card, Button, Alert } from '../components/ui'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

interface DocState {
  doc: pdfjsLib.PDFDocumentProxy
  pages: number
  name: string
}

export default function PdfViewerTool() {
  const [docState, setDocState] = useState<DocState | null>(null)
  const [loading, setLoading] = useState(false)
  const [pageNum, setPageNum] = useState(1)
  const [scale, setScale] = useState(1.5)
  const [fullscreen, setFullscreen] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const inpRef = useRef<HTMLInputElement>(null)
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null)

  const renderPage = useCallback(async (doc: pdfjsLib.PDFDocumentProxy, num: number) => {
    const canvas = canvasRef.current; if (!canvas) return
    if (renderTaskRef.current) { try { renderTaskRef.current.cancel() } catch { /* ignore */ } }
    try {
      const page = await doc.getPage(num)
      const viewport = page.getViewport({ scale })
      canvas.width = viewport.width; canvas.height = viewport.height
      const task = page.render({ canvas, viewport })
      renderTaskRef.current = task; await task.promise
    } catch (e) { if ((e as Error).name !== 'RenderingCancelledException') console.error(e) }
  }, [scale])

  const loadFile = async (f: File) => {
    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) { setError('请选择 PDF 文件'); return }
    setError(''); setLoading(true); setDocState(null); setPageNum(1)
    try { const buf = await f.arrayBuffer(); const doc = await pdfjsLib.getDocument({ data: buf }).promise; setDocState({ doc, pages: doc.numPages, name: f.name }) }
    catch { setError('PDF 解析失败，文件可能已损坏') }
    finally { setLoading(false) }
  }

  useEffect(() => { if (docState) renderPage(docState.doc, pageNum) }, [docState, pageNum, scale, renderPage])

  const goTo = (n: number) => { if (!docState) return; setPageNum(Math.max(1, Math.min(n, docState.pages))) }

  const clear = () => {
    if (renderTaskRef.current) try { renderTaskRef.current.cancel() } catch { /* ignore */ }
    setDocState(null); setPageNum(1); setError('')
  }

  return (
    <div className={`max-w-6xl mx-auto animate-fadeInUp ${fullscreen ? 'fixed inset-0 z-50 bg-[#050508] p-4 overflow-auto' : ''}`}>
      <ToolHeader name="PDF" accent="阅读器" accentColor="text-neon-orange" desc="基于 PDF.js 引擎 · Canvas 分页渲染 · 不卡 UI" />
      {!docState && !loading && (
        <Card>
          <div onClick={() => inpRef.current?.click()} onDragOver={e => { e.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) loadFile(f) }}
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${dragging ? 'border-neon-cyan bg-neon-cyan/5' : 'border-white/15 hover:border-neon-cyan/50'}`}>
            <input ref={inpRef} type="file" accept=".pdf,application/pdf" className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = '' }} />
            <Upload size={36} className="mx-auto text-gray-500 mb-4" />
            <p className="text-base text-white font-medium">点击或拖拽上传 PDF 文件</p>
            <p className="text-sm text-gray-500 mt-2">PDF.js 引擎 · 分页渲染 · 流畅不卡</p>
          </div>
          {error && <Alert>{error}</Alert>}
        </Card>
      )}
      {loading && (<Card><div className="flex items-center justify-center gap-2 py-16 text-gray-400"><Loader2 size={18} className="animate-spin" /><span className="text-sm">解析中...</span></div></Card>)}
      {docState && (
        <Card className="p-3 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <FileText size={16} className="text-neon-yellow shrink-0" /><span className="text-sm text-white truncate">{docState.name}</span><div className="flex-1" />
            <Button variant="ghost" onClick={() => setScale(s => Math.max(0.5, s - 0.25))} className="text-xs px-2"><ZoomOut size={14} /></Button>
            <span className="text-xs text-gray-400 font-mono w-10 text-center">{Math.round(scale * 100)}%</span>
            <Button variant="ghost" onClick={() => setScale(s => Math.min(3, s + 0.25))} className="text-xs px-2"><ZoomIn size={14} /></Button>
            <Button variant="ghost" onClick={() => goTo(pageNum - 1)} disabled={pageNum <= 1} className="text-xs px-2"><ChevronLeft size={14} /></Button>
            <span className="text-xs text-gray-400 font-mono">{pageNum} / {docState.pages}</span>
            <Button variant="ghost" onClick={() => goTo(pageNum + 1)} disabled={pageNum >= docState.pages} className="text-xs px-2"><ChevronRight size={14} /></Button>
            <input type="number" min={1} max={docState.pages} value={pageNum} onChange={e => goTo(+e.target.value || 1)}
              className="w-14 px-2 py-1.5 rounded-lg bg-cyber-bg-deep border border-white/10 text-white text-xs text-center font-mono focus:outline-none focus:border-neon-cyan/60"
              style={{ caretColor: '#00f0ff' }} />
            <Button variant="ghost" onClick={() => { setScale(1.5); setPageNum(1) }} className="text-xs px-2">重置</Button>
            <Button variant="ghost" onClick={() => setFullscreen(!fullscreen)} className="text-xs px-2">{fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}</Button>
            <Button variant="ghost" onClick={clear} className="text-xs px-3">关闭</Button>
          </div>
          <div className={`flex justify-center bg-cyber-bg-deep rounded-xl border border-white/10 overflow-auto ${fullscreen ? 'flex-1' : 'max-h-[70vh]'}`}>
            <canvas ref={canvasRef} className="shadow-2xl" />
          </div>
        </Card>
      )}
    </div>
  )
}
