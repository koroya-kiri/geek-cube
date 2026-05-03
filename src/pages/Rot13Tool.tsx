import { useState } from 'react'
import { TerminalCard, GlitchTitle, ScanTextarea, SysClock, DataTraffic } from '../components/MatrixUI'
import { useAutoProcess } from '../hooks/useAutoProcess'

const CYAN = '#00f2ff'

export default function Rot13Tool() {
  const [input, setInput] = useState('')
  const [shift, setShift] = useState(13)
  const [output, setOutput] = useState('')

  const convert = () => {
    setOutput(input.replace(/[a-zA-Z]/g, c=>{const code=c.charCodeAt(0);const base=code<=90?65:97;return String.fromCharCode(((code-base+shift)%26)+base)}))
  }

  useAutoProcess(input, convert, [shift])

  return (
    <div className="animate-fadeInUp py-6">
      <TerminalCard>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] tracking-[0.2em]" style={{color:CYAN}}>
              ROT{shift} <span className="text-[10px] text-gray-600 ml-2 font-normal">· 实时</span>
            </span>
            <input type="range" min={1} max={25} value={shift} onChange={e=>setShift(+e.target.value)} className="accent-cyan-400 w-24" />
          </div>
          <div className="flex items-center gap-4"><DataTraffic /><SysClock /></div>
        </div>
        <GlitchTitle>凯撒密码</GlitchTitle>
        <ScanTextarea label="[ 明文 ]" value={input} onChange={setInput} placeholder="输入文本..." rows={5} />
        <ScanTextarea label="[ 密文 ]" value={output} placeholder="结果将显示在这里..." readOnly rows={5} />
      </TerminalCard>
    </div>
  )
}
