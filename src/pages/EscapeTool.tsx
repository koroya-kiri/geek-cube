import { useState } from 'react'
import { ToolHeader, Card, Chip, Textarea, Label, CopyBtn } from '../components/ui'
import { useAutoProcess } from '../hooks/useAutoProcess'

const ESCAPERS: Record<string,{encode:(s:string)=>string;decode:(s:string)=>string}> = {
  json: {encode:s=>JSON.stringify(s).slice(1,-1),decode:s=>JSON.parse('"'+s+'"')},
  js: {encode:s=>s.replace(/[\\'"\n\r\t\b\f]/g,c=>({'\\':'\\\\',"'":"\\'",'"':'\\"','\n':'\\n','\r':'\\r','\t':'\\t','\b':'\\b','\f':'\\f'} as Record<string,string>)[c]||c),decode:s=>s.replace(/\\(.)/g,(_,c)=>({n:'\n',r:'\r',t:'\t',b:'\b',f:'\f'} as Record<string,string>)[c]||c)},
  html: {encode:s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!)),decode:s=>{const t=document.createElement('textarea');t.innerHTML=s;return t.value}},
  sql: {encode:s=>s.replace(/'/g,"''").replace(/\\/g,'\\\\'),decode:s=>s},
  url: {encode:s=>encodeURIComponent(s),decode:s=>decodeURIComponent(s)},
}

export default function EscapeTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [lang, setLang] = useState('json')
  const [mode, setMode] = useState<'encode'|'decode'>('encode')

  const convert = () => {
    try { setOutput(ESCAPERS[lang][mode](input)) } catch { setOutput('转换失败') }
  }

  useAutoProcess(input, convert, [lang, mode])

  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp">
      <ToolHeader name="转义字符" accent="处理" desc="JSON/JS/HTML/SQL/URL 字符串转义 · 实时处理" />
      <Card>
        <div className="flex flex-wrap items-center gap-2">
          {Object.keys(ESCAPERS).map(k=><Chip key={k} active={lang===k} onClick={()=>setLang(k)}>{k.toUpperCase()}</Chip>)}
          <div className="w-px h-5 bg-white/10 mx-1" />
          <Chip active={mode==='encode'} onClick={()=>setMode('encode')}>转义</Chip>
          <Chip active={mode==='decode'} onClick={()=>setMode('decode')}>反转义</Chip>
          <span className="ml-auto text-[10px] text-gray-500 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" /> 实时
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>输入</Label><Textarea value={input} onChange={e=>setInput(e.target.value)} rows={8} /></div>
          <div className="space-y-2"><div className="flex justify-between"><Label>输出</Label><CopyBtn copied={false} onCopy={async()=>{await navigator.clipboard.writeText(output)}} /></div><Textarea value={output} readOnly rows={8} className="text-neon-green result-flash" /></div>
        </div>
      </Card>
    </div>
  )
}
