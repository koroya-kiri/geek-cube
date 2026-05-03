import { useState } from 'react'
import { TerminalCard, GlitchTitle, ScanInput, ScanTextarea, PulseButton, TerminalError, SysClock, DataTraffic } from '../components/MatrixUI'

const CYAN = '#00f2ff'

export default function AesTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [key, setKey] = useState('')
  const [mode, setMode] = useState<'encrypt'|'decrypt'>('encrypt')
  const [error, setError] = useState('')

  const process = async () => {
    setError('')
    try {
      const enc = new TextEncoder(); const keyBytes = enc.encode(key.padEnd(32,'0').slice(0,32))
      const ck = await crypto.subtle.importKey('raw', keyBytes, { name:'AES-GCM' }, false, mode==='encrypt'?['encrypt']:['decrypt'])
      if (mode==='encrypt') {
        const iv = crypto.getRandomValues(new Uint8Array(12))
        const ct = await crypto.subtle.encrypt({ name:'AES-GCM', iv }, ck, enc.encode(input))
        const r = new Uint8Array(iv.length+ct.byteLength); r.set(iv); r.set(new Uint8Array(ct), iv.length)
        setOutput(btoa(String.fromCharCode(...r)))
      } else {
        const raw = Uint8Array.from(atob(input), c=>c.charCodeAt(0))
        setOutput(new TextDecoder().decode(await crypto.subtle.decrypt({ name:'AES-GCM', iv:raw.slice(0,12) }, ck, raw.slice(12))))
      }
    } catch(e) { setError((e as Error).message); setOutput('') }
  }

  return (
    <div className="animate-fadeInUp py-6">
      <TerminalCard>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {([{k:'encrypt',l:'加密'},{k:'decrypt',l:'解密'}] as const).map(({k,l}) => (
              <button key={k} onClick={()=>{setMode(k);setInput('');setOutput('');setError('')}}
                className="font-mono text-[10px] tracking-[0.2em] uppercase px-3 py-1 transition-colors"
                style={{ color: mode===k?CYAN:'#444', borderBottom: mode===k?`1px solid ${CYAN}`:'1px solid transparent' }}>
                {l}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4"><DataTraffic /><SysClock /></div>
        </div>
        <GlitchTitle>AES-GCM</GlitchTitle>
        <ScanInput label="[ 加密密钥 ]" value={key} onChange={setKey} isPassword placeholder="输入 32 位密钥..." />
        <ScanTextarea label="[ 输入 ]" value={input} onChange={setInput} placeholder={mode==='encrypt'?'输入明文...':'输入 Base64 密文...'} rows={5} />
        <ScanTextarea label="[ 输出 ]" value={output} placeholder="结果将显示在这里..." readOnly rows={5} />
        <PulseButton onClick={process} disabled={!input.trim()||!key.trim()}>执 行</PulseButton>
        {error && <TerminalError>{error}</TerminalError>}
      </TerminalCard>
    </div>
  )
}
