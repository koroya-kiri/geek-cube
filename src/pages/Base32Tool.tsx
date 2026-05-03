import { useState } from 'react'
import { ToolHeader, Card, Chip, Textarea, Label, CopyBtn } from '../components/ui'

/* ─── Pure JS Base32 (RFC 4648, no padding) ─── */
const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
const B32_MAP: Record<string, number> = {}
for (let i = 0; i < B32.length; i++) B32_MAP[B32[i]] = i
for (let i = 0; i < B32.length; i++) B32_MAP[B32[i].toLowerCase()] = i

function base32Encode(input: string): string {
  const bytes = new TextEncoder().encode(input)
  let bits = 0, value = 0, result = ''
  for (let i = 0; i < bytes.length; i++) {
    value = (value << 8) | bytes[i]
    bits += 8
    while (bits >= 5) {
      result += B32[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }
  if (bits > 0) result += B32[(value << (5 - bits)) & 31]
  return result
}

function base32Decode(input: string): string {
  const clean = input.replace(/[=]/g, '').replace(/[^A-Za-z2-7]/g, '')
  let bits = 0, value = 0
  const bytes: number[] = []
  for (let i = 0; i < clean.length; i++) {
    const v = B32_MAP[clean[i]]
    if (v === undefined) continue
    value = (value << 5) | v
    bits += 5
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255)
      bits -= 8
    }
  }
  return new TextDecoder().decode(new Uint8Array(bytes))
}

export default function Base32Tool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [copied, setCopied] = useState(false)

  const convert = () => {
    try { setOutput(mode === 'encode' ? base32Encode(input) : base32Decode(input)) } catch { setOutput('') }
  }

  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp">
      <ToolHeader name="Base32" accent="编解码" desc="Base32 RFC 4648 编码与解码" />
      <Card>
        <div className="flex gap-2">
          <Chip active={mode === 'encode'} onClick={() => setMode('encode')}>编码</Chip>
          <Chip active={mode === 'decode'} onClick={() => setMode('decode')}>解码</Chip>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>输入</Label><Textarea value={input} onChange={e => { setInput(e.target.value); convert() }} rows={10} placeholder={mode === 'encode' ? '输入文本...' : '输入 Base32 字符串...'} /></div>
          <div className="space-y-2"><div className="flex justify-between"><Label>输出</Label><CopyBtn copied={copied} onCopy={async()=>{await navigator.clipboard.writeText(output);setCopied(true);setTimeout(()=>setCopied(false),1500)}} /></div><Textarea value={output} readOnly rows={10} className="text-neon-green result-flash" /></div>
        </div>
      </Card>
    </div>
  )
}
