import { useState } from 'react'
import { TerminalCard, GlitchTitle, ScanInput, ScanTextarea, PulseButton, TerminalError, SysClock, DataTraffic } from '../components/MatrixUI'

const CYAN = '#00f2ff'

export default function HmacTool() {
  const [input, setInput] = useState('')
  const [key, setKey] = useState('')
  const [algo, setAlgo] = useState<'SHA-1'|'SHA-256'|'SHA-512'>('SHA-256')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const calc = async () => {
    setError('')
    try {
      const enc = new TextEncoder()
      const ck = await crypto.subtle.importKey('raw', enc.encode(key), { name:'HMAC',hash:algo }, false, ['sign'])
      setOutput(Array.from(new Uint8Array(await crypto.subtle.sign('HMAC', ck, enc.encode(input))), b=>b.toString(16).padStart(2,'0')).join(''))
    } catch(e) { setError((e as Error).message); setOutput('') }
  }

  return (
    <div className="animate-fadeInUp py-6">
      <TerminalCard>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {(['SHA-256','SHA-1','SHA-512'] as const).map(a => (
              <button key={a} onClick={()=>setAlgo(a)} className="font-mono text-[10px] tracking-[0.2em] uppercase px-3 py-1 transition-colors"
                style={{ color: algo===a?CYAN:'#444', borderBottom: algo===a?`1px solid ${CYAN}`:'1px solid transparent' }}>{a}</button>
            ))}
          </div>
          <div className="flex items-center gap-4"><DataTraffic /><SysClock /></div>
        </div>
        <GlitchTitle>HMAC</GlitchTitle>
        <ScanInput label="[ 密钥 ]" value={key} onChange={setKey} isPassword placeholder="输入签名密钥..." />
        <ScanTextarea label="[ 消息 ]" value={input} onChange={setInput} placeholder="输入要签名的消息..." rows={4} />
        <ScanTextarea label="[ 签名结果 ]" value={output} placeholder="HMAC 签名..." readOnly rows={3} />
        <PulseButton onClick={calc} disabled={!input.trim()||!key.trim()}>签 名</PulseButton>
        {error && <TerminalError>{error}</TerminalError>}
      </TerminalCard>
    </div>
  )
}
