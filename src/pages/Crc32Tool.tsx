import { useState } from 'react'
import { ToolHeader, Card, Textarea, Label, CopyBtn } from '../components/ui'
import { useAutoProcess } from '../hooks/useAutoProcess'

/* ─── CRC32 lookup table ─── */
const CRC_TABLE: number[] = (() => {
  const t: number[] = []
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)
    t.push(c)
  }
  return t
})()

function crc32(input: string): string {
  let crc = 0xFFFFFFFF
  for (let i = 0; i < input.length; i++) {
    crc = CRC_TABLE[(crc ^ input.charCodeAt(i)) & 255] ^ (crc >>> 8)
  }
  return ((crc ^ 0xFFFFFFFF) >>> 0).toString(16).padStart(8, '0')
}

export default function Crc32Tool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [uppercase, setUppercase] = useState(false)
  const [copied, setCopied] = useState(false)

  const calc = () => {
    if (!input.trim()) { setOutput(''); return }
    const h = crc32(input)
    setOutput(uppercase ? h.toUpperCase() : h)
  }

  useAutoProcess(input, calc, [uppercase], 200)

  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp">
      <ToolHeader name="CRC32" accent="校验" accentColor="text-neon-green" desc="CRC32 循环冗余校验 · 实时计算" />
      <Card>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>输入文本</Label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer hover:text-white">
                <input type="checkbox" checked={uppercase} onChange={e => setUppercase(e.target.checked)} className="rounded" />大写
              </label>
              <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />实时
              </span>
            </div>
          </div>
          <Textarea value={input} onChange={e => setInput(e.target.value)} rows={6} placeholder="输入文本..." />
        </div>
        {output && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>CRC32 结果 <span className="text-xs text-gray-500">({output.length} hex)</span></Label>
              <CopyBtn copied={copied} onCopy={async()=>{await navigator.clipboard.writeText(output);setCopied(true);setTimeout(()=>setCopied(false),1500)}} />
            </div>
            <Textarea value={output} readOnly rows={1} className="text-neon-green result-flash" />
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-cyber-bg-deep border border-white/10">
                <div className="text-lg text-neon-cyan font-mono">{parseInt(output.slice(0,4) || '0', 16)}</div>
                <div className="text-[10px] text-gray-500">十进制</div>
              </div>
              <div className="p-3 rounded-xl bg-cyber-bg-deep border border-white/10">
                <div className="text-lg text-neon-cyan font-mono">{output}</div>
                <div className="text-[10px] text-gray-500">十六进制</div>
              </div>
              <div className="p-3 rounded-xl bg-cyber-bg-deep border border-white/10">
                <div className="text-lg text-neon-cyan font-mono">0x{output.slice(0,4)}</div>
                <div className="text-[10px] text-gray-500">0x 前缀</div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
