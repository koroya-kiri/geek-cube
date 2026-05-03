import { useState } from 'react'
import { TerminalCard, GlitchTitle, ScanTextarea, SysClock, DataTraffic } from '../components/MatrixUI'
import { useAutoProcess } from '../hooks/useAutoProcess'

const CYAN = '#00f2ff'

export default function HexTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode'|'decode'>('encode')

  const convert = () => {
    try {
      if (mode==='encode') setOutput(Array.from(new TextEncoder().encode(input),b=>b.toString(16).padStart(2,'0')).join(''))
      else setOutput(new TextDecoder().decode(new Uint8Array(input.match(/.{1,2}/g)?.map(b=>parseInt(b,16))||[])))
    } catch { setOutput('转换失败') }
  }

  useAutoProcess(input, convert, [mode])

  return (
    <div className="animate-fadeInUp py-6">
      <TerminalCard>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {([{k:'encode',l:'文本 → 十六进制'},{k:'decode',l:'十六进制 → 文本'}] as const).map(({k,l})=>(
              <button key={k} onClick={()=>{setMode(k);setInput('');setOutput('')}}
                className="font-mono text-[10px] tracking-[0.1em] px-3 py-1 transition-colors"
                style={{ color: mode===k?CYAN:'#444', borderBottom: mode===k?`1px solid ${CYAN}`:'1px solid transparent' }}>{l}</button>
            ))}
          </div>
          <div className="flex items-center gap-4"><DataTraffic /><SysClock /></div>
        </div>
        <GlitchTitle>十六进制编解码 <span className="text-[10px] text-gray-600 font-normal ml-2">· 实时</span></GlitchTitle>
        <ScanTextarea label="[ 输入 ]" value={input} onChange={setInput} placeholder={mode==='encode'?'hello → 68656c6c6f':'68656c6c6f → hello'} rows={5} />
        <ScanTextarea label="[ 输出 ]" value={output} placeholder="结果将显示在这里..." readOnly rows={5} />
      </TerminalCard>
    </div>
  )
}
