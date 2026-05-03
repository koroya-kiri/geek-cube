import { useState } from 'react'
import { TerminalCard, GlitchTitle, ScanInput, ScanTextarea, PulseButton, TerminalError, SysClock, DataTraffic } from '../components/MatrixUI'

const CYAN = '#00f2ff'

export default function Pbkdf2Tool() {
  const [password, setPassword] = useState('')
  const [salt, setSalt] = useState('')
  const [iterations, setIterations] = useState(100000)
  const [keyLen, setKeyLen] = useState(32)
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const derive = async () => {
    setError('')
    try {
      const enc = new TextEncoder()
      const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
      const bits = await crypto.subtle.deriveBits({ name:'PBKDF2', salt:enc.encode(salt||'默认盐值'), iterations, hash:'SHA-256' }, key, keyLen*8)
      setOutput(Array.from(new Uint8Array(bits), b=>b.toString(16).padStart(2,'0')).join(''))
    } catch(e) { setError((e as Error).message); setOutput('') }
  }

  return (
    <div className="animate-fadeInUp py-6">
      <TerminalCard>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-[0.2em]" style={{color:CYAN}}>PBKDF2</span>
          <div className="flex items-center gap-4"><DataTraffic /><SysClock /></div>
        </div>
        <GlitchTitle>密钥派生</GlitchTitle>
        <div className="grid grid-cols-2 gap-4">
          {[
            {l:'[ 密码 ]',v:password,s:setPassword,ph:'输入密码...',pw:true},
            {l:'[ 盐值 ]',v:salt,s:setSalt,ph:'可选',pw:false},
            {l:'[ 迭代次数 ]',v:String(iterations),s:(v:string)=>setIterations(+v),ph:'100000',pw:false},
            {l:'[ 密钥长度(字节) ]',v:String(keyLen),s:(v:string)=>setKeyLen(+v),ph:'32',pw:false},
          ].map(({l,v,s,ph,pw})=>(
            <ScanInput key={l} label={l} value={v} onChange={s} placeholder={ph} isPassword={pw} />
          ))}
        </div>
        <ScanTextarea label="[ 派生密钥 ]" value={output} readOnly rows={3} />
        <PulseButton onClick={derive} disabled={!password.trim()}>派 生</PulseButton>
        {error && <TerminalError>{error}</TerminalError>}
      </TerminalCard>
    </div>
  )
}
