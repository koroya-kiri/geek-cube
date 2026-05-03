import { useState } from 'react'
import { TerminalCard, GlitchTitle, ScanInput, PulseButton, TerminalError, SysClock, DataTraffic } from '../components/MatrixUI'
import { CopyBtn } from '../components/ui'

const CYAN = '#00f2ff'
const ALGOS = ['SHA-256', 'SHA-384', 'SHA-512'] as const

function bytesToHex(b: ArrayBuffer): string {
  return Array.from(new Uint8Array(b), x => x.toString(16).padStart(2, '0')).join('')
}

export default function HkdfTool() {
  const [ikm, setIkm] = useState('')
  const [salt, setSalt] = useState('')
  const [info, setInfo] = useState('')
  const [algo, setAlgo] = useState<'SHA-256' | 'SHA-384' | 'SHA-512'>('SHA-256')
  const [keyLen, setKeyLen] = useState(32)
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const derive = async () => {
    setError('')
    try {
      const enc = new TextEncoder()
      const ikmKey = await crypto.subtle.importKey('raw', enc.encode(ikm), 'HKDF', false, ['deriveBits'])
      const bits = await crypto.subtle.deriveBits(
        { name: 'HKDF', hash: algo, salt: enc.encode(salt), info: enc.encode(info) },
        ikmKey,
        keyLen * 8
      )
      setOutput(bytesToHex(bits))
    } catch (e) { setError((e as Error).message); setOutput('') }
  }

  return (
    <div className="animate-fadeInUp py-6">
      <TerminalCard>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {ALGOS.map(a => (
              <button key={a} onClick={() => setAlgo(a)} className="font-mono text-[10px] tracking-[0.2em] uppercase px-3 py-1 transition-colors"
                style={{ color: algo === a ? CYAN : '#444', borderBottom: algo === a ? `1px solid ${CYAN}` : '1px solid transparent' }}>{a}</button>
            ))}
          </div>
          <div className="flex items-center gap-4"><DataTraffic /><SysClock /></div>
        </div>
        <GlitchTitle>HKDF</GlitchTitle>
        <div className="grid grid-cols-2 gap-4">
          {[
            { l: '[ IKM · 输入密钥材料 ]', v: ikm, s: setIkm, ph: '输入密钥材料...' },
            { l: '[ Salt · 盐值 ]', v: salt, s: setSalt, ph: '可选' },
            { l: '[ Info · 上下文信息 ]', v: info, s: setInfo, ph: '可选' },
            { l: '[ 输出长度 (字节) ]', v: String(keyLen), s: (v: string) => setKeyLen(+v || 32), ph: '32' },
          ].map(({ l, v, s, ph }) => (
            <ScanInput key={l} label={l} value={v} onChange={s} placeholder={ph} />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-[0.15em]" style={{ color: `${CYAN}70` }}>[ 派生密钥 ]</span>
          <CopyBtn copied={copied} onCopy={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500) }} />
        </div>
        <div className="p-4 rounded-lg font-mono text-xs break-all" style={{ background: 'rgba(0,0,0,0.4)', color: CYAN, border: `1px solid ${CYAN}15` }}>{output || '结果将显示在这里...'}</div>
        <PulseButton onClick={derive} disabled={!ikm.trim()}>派 生</PulseButton>
        {error && <TerminalError>{error}</TerminalError>}
      </TerminalCard>
    </div>
  )
}
