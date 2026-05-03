import { useState, useCallback } from 'react'
import { Upload, X, Download } from 'lucide-react'
import { ToolHeader, Card, Chip, Textarea, Label, Button, CopyBtn, Alert } from '../components/ui'
import { useAutoProcess } from '../hooks/useAutoProcess'

export default function Base64Tool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text')

  const convert = () => {
    setError('')
    try {
      if (mode === 'encode') {
        const bytes = new TextEncoder().encode(input)
        const bin = Array.from(bytes, b => String.fromCodePoint(b)).join('')
        setOutput(btoa(bin))
      } else {
        const bin = atob(input)
        const bytes = Uint8Array.from(bin, c => c.codePointAt(0)!)
        setOutput(new TextDecoder().decode(bytes))
      }
    } catch {
      setError(mode === 'decode' ? '无效的 Base64 字符串' : '编码失败')
      setOutput('')
    }
  }

  useAutoProcess(input, convert, [mode, activeTab])

  const swap = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode')
    setInput(output)
    setOutput('')
    setError('')
  }

  const uploadImage = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) { setError('请上传图片文件'); return }
    const reader = new FileReader()
    reader.onload = e => {
      const result = e.target?.result as string
      setImagePreview(result)
      setOutput(result.split(',')[1])
      setError('')
    }
    reader.readAsDataURL(file)
  }, [])

  const handlePaste = useCallback(async () => {
    try {
      const items = await navigator.clipboard.read()
      for (const item of items) {
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            const blob = await item.getType(type)
            uploadImage(new File([blob], 'pasted.png', { type }))
            return
          }
        }
      }
      setError('剪贴板中没有图片')
    } catch { setError('无法访问剪贴板') }
  }, [uploadImage])

  const clear = () => { setInput(''); setOutput(''); setImagePreview(null); setError('') }

  return (
    <div className="max-w-5xl mx-auto animate-fadeInUp">
      <ToolHeader name="Base64" accent="编解码" accentColor="text-neon-cyan" glowClass="text-glow-cyan" desc="文本与 Base64 互转，支持图片上传、拖拽和粘贴" />

      <div className="flex gap-2 mb-6">
        <Chip active={activeTab === 'text'} onClick={() => { setActiveTab('text'); clear() }}>文本编解码</Chip>
        <Chip active={activeTab === 'image'} onClick={() => { setActiveTab('image'); clear() }}>图片转换</Chip>
      </div>

      {activeTab === 'text' ? (
        <Card>
          <div className="flex items-center gap-2">
            <Chip active={mode === 'encode'} onClick={() => { setMode('encode'); setError('') }}>编码 → Base64</Chip>
            <Chip active={mode === 'decode'} onClick={() => { setMode('decode'); setError('') }}>解码 ← Base64</Chip>
            <span className="ml-auto text-[10px] text-gray-500 font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" /> 实时
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-start">
            <div className="space-y-2">
              <Label>{mode === 'encode' ? '原始文本' : 'Base64'}</Label>
              <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={mode === 'encode' ? '输入要编码的文本...' : '输入 Base64 字符串...'} rows={10} />
            </div>

            <div className="flex md:flex-col items-center justify-center gap-2 py-4">
              <Button onClick={swap} variant="ghost" className="p-2.5 rounded-xl" title="交换输入输出">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="rotate-90"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{mode === 'encode' ? 'Base64' : '原始文本'}</Label>
                <CopyBtn copied={copied} onCopy={async () => { if (!output) return; await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500) }} />
              </div>
              <Textarea value={output} readOnly placeholder="结果将显示在这里..." rows={10} className="text-neon-green result-flash" />
            </div>
          </div>

          {error && <Alert>{error}</Alert>}
        </Card>
      ) : (
        <Card>
          <div
            onDrop={e => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) uploadImage(f) }}
            onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={e => { e.preventDefault(); setIsDragging(false) }}
            className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all ${isDragging ? 'border-neon-cyan bg-neon-cyan/5' : 'border-white/10 hover:border-white/20'}`}
          >
            <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f) }} className="absolute inset-0 opacity-0 cursor-pointer" />
            <Upload size={32} className="mx-auto text-gray-500 mb-3" />
            <p className="text-sm text-white font-medium">点击或拖拽上传图片</p>
            <p className="text-xs text-gray-500 mt-1">支持 PNG · JPG · GIF · WebP</p>
            <Button onClick={handlePaste} variant="secondary" className="mt-4 text-xs">
              从剪贴板粘贴
            </Button>
          </div>

          {imagePreview && (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden border border-white/10">
                <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-contain bg-cyber-bg-deep" />
                <button onClick={() => { setImagePreview(null); setOutput('') }} className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"><X size={14} /></button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Base64 结果</Label>
                  <div className="flex gap-3">
                    <button onClick={() => { if (!imagePreview) return; const a = document.createElement('a'); a.href = imagePreview; a.download = 'image.png'; a.click() }} className="flex items-center gap-1 text-xs text-gray-400 hover:text-neon-cyan transition-colors"><Download size={13} />下载</button>
                    <CopyBtn copied={copied} onCopy={async () => { if (!output) return; await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500) }} />
                  </div>
                </div>
                <Textarea value={output} readOnly placeholder="Base64 结果..." rows={5} className="text-xs text-neon-green" />
              </div>
            </div>
          )}

          {error && <Alert>{error}</Alert>}
        </Card>
      )}
    </div>
  )
}
