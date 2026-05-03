import { useState } from 'react'
import { ToolHeader, Card, Chip, Textarea, Label, CopyBtn } from '../components/ui'

/* ─── Pure JS Base58 (Bitcoin alphabet, no 0OIl) ─── */
const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

function base58Encode(input: string): string {
  if (!input) return ''
  const bytes = new TextEncoder().encode(input)
  /* Count leading zeros */
  let zeros = 0
  while (zeros < bytes.length && bytes[zeros] === 0) zeros++
  /* Convert to base58 */
  const digits = [0]
  for (let i = 0; i < bytes.length; i++) {
    let carry = bytes[i]
    for (let j = 0; j < digits.length; j++) {
      carry += digits[j] * 256
      digits[j] = carry % 58
      carry = Math.floor(carry / 58)
    }
    while (carry > 0) {
      digits.push(carry % 58)
      carry = Math.floor(carry / 58)
    }
  }
  return B58[0].repeat(zeros) + digits.reverse().map(d => B58[d]).join('')
}

function base58Decode(input: string): string {
  if (!input) return ''
  const clean = input.replace(/[^1-9A-HJ-NP-Za-km-z]/g, '')
  /* Count leading ones (represent leading zeros) */
  let zeros = 0
  while (zeros < clean.length && clean[zeros] === '1') zeros++
  /* Convert from base58 */
  const bytes = [0]
  for (let i = 0; i < clean.length; i++) {
    const d = B58.indexOf(clean[i])
    if (d < 0) continue
    let carry = d
    for (let j = 0; j < bytes.length; j++) {
      carry += bytes[j] * 58
      bytes[j] = carry & 255
      carry = Math.floor(carry / 256)
    }
    while (carry > 0) {
      bytes.push(carry & 255)
      carry = Math.floor(carry / 256)
    }
  }
  return new TextDecoder().decode(new Uint8Array(new Array(zeros).fill(0).concat(bytes.reverse())))
}

export default function Base58Tool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [copied, setCopied] = useState(false)

  const convert = () => {
    try { setOutput(mode === 'encode' ? base58Encode(input) : base58Decode(input)) } catch { setOutput('') }
  }

  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp">
      <ToolHeader name="Base58" accent="编解码" accentColor="text-neon-yellow" desc="Base58 Bitcoin 编码表 · 无 0OIl 字符" />
      <Card>
        <div className="flex gap-2">
          <Chip active={mode === 'encode'} onClick={() => setMode('encode')}>编码</Chip>
          <Chip active={mode === 'decode'} onClick={() => setMode('decode')}>解码</Chip>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>输入</Label><Textarea value={input} onChange={e => { setInput(e.target.value); convert() }} rows={10} placeholder={mode === 'encode' ? '输入文本...' : '输入 Base58 字符串...'} /></div>
          <div className="space-y-2"><div className="flex justify-between"><Label>输出</Label><CopyBtn copied={copied} onCopy={async()=>{await navigator.clipboard.writeText(output);setCopied(true);setTimeout(()=>setCopied(false),1500)}} /></div><Textarea value={output} readOnly rows={10} className="text-neon-green result-flash" /></div>
        </div>
      </Card>
    </div>
  )
}
