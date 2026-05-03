import { useState } from 'react'
import { ArrowRightLeft } from 'lucide-react'
import { ToolHeader, Card, Chip, Textarea, Label, CopyBtn } from '../components/ui'
import { useAutoProcess } from '../hooks/useAutoProcess'

export default function UrlTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [copied, setCopied] = useState(false)

  const convert = () => {
    try {
      setOutput(mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input))
    } catch { setOutput('') }
  }

  useAutoProcess(input, convert, [mode])

  const swap = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode')
    setInput(output); setOutput('')
  }

  return (
    <div className="max-w-5xl mx-auto animate-fadeInUp">
      <ToolHeader name="URL" accent="编解码" desc="URL 编码（percent-encoding）与解码 · 实时处理" />

      <Card>
        <div className="flex items-center gap-2 flex-wrap">
          <Chip active={mode === 'encode'} onClick={() => setMode('encode')}>编码 → URL</Chip>
          <Chip active={mode === 'decode'} onClick={() => setMode('decode')}>解码 ← URL</Chip>
          <span className="ml-auto text-[10px] text-gray-500 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" /> 实时
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-start">
          <div className="space-y-2">
            <Label>{mode === 'encode' ? '原始文本' : '已编码'}</Label>
            <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={mode === 'encode' ? '输入要编码的文本...' : '输入 URL 编码字符串...'} rows={10} />
          </div>

          <div className="flex md:flex-col items-center justify-center gap-2 py-4">
            <button onClick={swap} className="p-2.5 rounded-xl text-gray-500 hover:text-white hover:bg-white/[0.04] transition-all" title="交换方向"><ArrowRightLeft size={18} /></button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{mode === 'encode' ? '已编码' : '原始文本'}</Label>
              <CopyBtn copied={copied} onCopy={async () => { if (!output) return; await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500) }} />
            </div>
            <Textarea value={output} readOnly placeholder="结果将显示在这里..." rows={10} className="text-neon-green break-all result-flash" />
          </div>
        </div>
      </Card>
    </div>
  )
}
