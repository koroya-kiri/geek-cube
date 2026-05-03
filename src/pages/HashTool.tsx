import { useState, useCallback } from 'react'
import { Upload } from 'lucide-react'
import { ToolHeader, Card, Chip, Textarea, Label, CopyBtn, Alert } from '../components/ui'
import { useAutoProcess } from '../hooks/useAutoProcess'

type Algorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'

const ALGOS: { key: Algorithm; desc: string }[] = [
  { key: 'SHA-256', desc: '最常用 · 256 位 · 安全性高' },
  { key: 'SHA-1', desc: '160 位 · 已不推荐安全场景' },
  { key: 'SHA-384', desc: '384 位 · 较高安全性' },
  { key: 'SHA-512', desc: '512 位 · 最高安全性' },
]

export default function HashTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [algorithm, setAlgorithm] = useState<Algorithm>('SHA-256')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [isUppercase, setIsUppercase] = useState(false)

  const calculate = useCallback(async () => {
    setError('')
    if (!input.trim()) { setOutput(''); return }
    try {
      const data = new TextEncoder().encode(input)
      const buf = await crypto.subtle.digest(algorithm, data)
      const hex = Array.from(new Uint8Array(buf), b => b.toString(16).padStart(2, '0')).join('')
      setOutput(isUppercase ? hex.toUpperCase() : hex)
    } catch {
      setError('计算哈希失败')
      setOutput('')
    }
  }, [input, algorithm, isUppercase])

  useAutoProcess(input, calculate, [algorithm, isUppercase], 500)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => { setInput(ev.target?.result as string) }
    reader.readAsText(file)
  }

  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp">
      <ToolHeader name="哈希" accent="计算器" accentColor="text-neon-green" glowClass="text-glow-green" desc="计算文本的 SHA 系列哈希值，支持文件上传 · 实时计算" />

      <Card>
        <div className="flex flex-wrap gap-2">
          {ALGOS.map(({ key, desc }) => (
            <Chip key={key} active={algorithm === key} onClick={() => setAlgorithm(key)}>
              <span className="flex flex-col items-start">
                <span className="text-xs font-semibold">{key}</span>
                <span className="text-[10px] opacity-60">{desc}</span>
              </span>
            </Chip>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>输入文本</Label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer hover:text-white transition-colors">
                <input type="checkbox" checked={isUppercase} onChange={e => setIsUppercase(e.target.checked)} className="rounded border-white/20" />
                大写
              </label>
              <label className="flex items-center gap-1 cursor-pointer text-gray-400 hover:text-white transition-colors">
                <Upload size={13} />
                <span className="text-xs">上传文件</span>
                <input type="file" onChange={handleFile} className="hidden" />
              </label>
              <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" /> 实时
              </span>
            </div>
          </div>
          <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder="输入要计算哈希的文本..." rows={5} />
        </div>

        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>哈希结果</Label>
              <CopyBtn copied={copied} onCopy={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500) }} />
            </div>
            <Textarea value={output} readOnly rows={2} className="text-neon-green result-flash" />
            <p className="text-[11px] text-gray-500">长度: {output.length} 字符 · 算法: {algorithm}</p>
          </div>
        )}

        {error && <Alert>{error}</Alert>}
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        {ALGOS.map(({ key, desc }) => (
          <div key={key} className="p-4 rounded-xl border border-white/10 bg-cyber-bg-surface/50 hover:border-white/20 transition-colors text-center">
            <div className="text-sm font-semibold text-neon-green">{key}</div>
            <div className="text-[11px] text-gray-500 mt-1">{desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
