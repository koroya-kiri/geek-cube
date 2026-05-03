import { useState } from 'react'
import { ToolHeader, Card, Chip, Textarea, Label, CopyBtn } from '../components/ui'
import { useAutoProcess } from '../hooks/useAutoProcess'

function toCamel(s: string) { return s.replace(/[_-](.)/g, (_,c) => c.toUpperCase()).replace(/^./, c => c.toLowerCase()) }
function toPascal(s: string) { return s.replace(/[_-](.)/g, (_,c) => c.toUpperCase()).replace(/^./, c => c.toUpperCase()) }
function toSnake(s: string) { return s.replace(/([A-Z])/g, '_$1').replace(/[-\s]+/g, '_').replace(/^_/, '').toLowerCase() }
function toKebab(s: string) { return s.replace(/([A-Z])/g, '-$1').replace(/[_\s]+/g, '-').replace(/^-/, '').toLowerCase() }
function toConstant(s: string) { return toSnake(s).toUpperCase() }
function toTitle(s: string) { return s.replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }

const MODES = [
  {k:'upper',l:'大写 UPPER',fn:(s:string)=>s.toUpperCase()},
  {k:'lower',l:'小写 lower',fn:(s:string)=>s.toLowerCase()},
  {k:'title',l:'首字母大写 Title',fn:toTitle},
  {k:'camel',l:'驼峰 camelCase',fn:toCamel},
  {k:'pascal',l:'帕斯卡 PascalCase',fn:toPascal},
  {k:'snake',l:'蛇形 snake_case',fn:toSnake},
  {k:'kebab',l:'短横 kebab-case',fn:toKebab},
  {k:'constant',l:'常量 CONSTANT',fn:toConstant},
]

export default function CaseConvertTool() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState('lower')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const convert = () => {
    const fn = MODES.find(m => m.k===mode)?.fn; if (fn) setOutput(fn(input))
  }

  useAutoProcess(input, convert, [mode])

  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp">
      <ToolHeader name="大小写" accent="转换" accentColor="text-neon-orange" desc="大写、小写、驼峰、蛇形等命名转换 · 实时处理" />
      <Card>
        <div className="flex flex-wrap items-center gap-2">
          {MODES.map(({k,l}) => <Chip key={k} active={mode===k} onClick={() => setMode(k)}>{l}</Chip>)}
          <span className="ml-auto text-[10px] text-gray-500 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" /> 实时
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>输入</Label><Textarea value={input} onChange={e => setInput(e.target.value)} placeholder="输入文本..." rows={8} /></div>
          <div className="space-y-2"><div className="flex justify-between"><Label>输出</Label><CopyBtn copied={copied} onCopy={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(()=>setCopied(false),1500) }} /></div><Textarea value={output} readOnly rows={8} className="text-neon-green result-flash" /></div>
        </div>
      </Card>
    </div>
  )
}
