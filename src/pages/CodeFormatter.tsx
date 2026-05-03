import { useState } from 'react'
import { Wand2, Minimize2, Code2, Loader2 } from 'lucide-react'
import * as prettier from 'prettier'
import * as prettierPluginBabel from 'prettier/plugins/babel'
import * as prettierPluginEstree from 'prettier/plugins/estree'
import * as prettierPluginHtml from 'prettier/plugins/html'
import * as prettierPluginPostcss from 'prettier/plugins/postcss'
import { format as formatSql } from 'sql-formatter'
import formatXml from 'xml-formatter'
import { Card, Chip, Textarea, Label, CopyBtn, Alert } from '../components/ui'
import { useAutoProcess } from '../hooks/useAutoProcess'

type Lang = 'json'|'javascript'|'html'|'css'|'sql'|'xml'
type Mode = 'format'|'minify'

const LC: Record<Lang,{n:string;c:string;p:string}> = {
  json:{n:'JSON',c:'text-neon-cyan',p:'{"name":"example"}'},
  javascript:{n:'JavaScript',c:'text-neon-yellow',p:'const foo={bar:()=>1}'},
  html:{n:'HTML',c:'text-neon-orange',p:'<div class="c"><p>Hi</p></div>'},
  css:{n:'CSS',c:'text-neon-magenta',p:'.a{display:flex;gap:10px}'},
  sql:{n:'SQL',c:'text-neon-green',p:'SELECT id FROM users WHERE s=1'},
  xml:{n:'XML',c:'text-neon-purple',p:'<root><item id="1">X</item></root>'},
}

async function fmt(code: string, parser: string) {
  return prettier.format(code, {
    parser: parser as prettier.BuiltInParserName,
    plugins: parser==='javascript'||parser==='babel'?[prettierPluginBabel,prettierPluginEstree]:parser==='html'?[prettierPluginHtml]:parser==='css'?[prettierPluginPostcss]:undefined,
  })
}

function safeMinify(code: string, lang: Lang): string {
  if (lang === 'json') return JSON.stringify(JSON.parse(code))
  if (lang === 'sql') return formatSql(code, { language: 'sql', keywordCase: 'lower', linesBetweenQueries: 0 })
  if (lang === 'xml') return formatXml(code, { indentation: '', collapseContent: true })
  let result = ''
  let i = 0
  const len = code.length
  while (i < len) {
    if (code[i] === '"' || code[i] === "'" || code[i] === '`') {
      const quote = code[i]; result += quote; i++
      while (i < len && code[i] !== quote) {
        if (code[i] === '\\' && i + 1 < len) { result += code[i] + code[i + 1]; i += 2 }
        else { result += code[i]; i++ }
      }
      if (i < len) { result += code[i]; i++ }
      continue
    }
    if (code[i] === '/' && code[i + 1] === '/') { i += 2; while (i < len && code[i] !== '\n') i++; result += ' '; continue }
    if (code[i] === '/' && code[i + 1] === '*') { i += 2; while (i + 1 < len && !(code[i] === '*' && code[i + 1] === '/')) i++; i += 2; result += ' '; continue }
    if (code[i] === '<' && code[i + 1] === '!' && code[i + 2] === '-' && code[i + 3] === '-') { i += 4; while (i + 2 < len && !(code[i] === '-' && code[i + 1] === '-' && code[i + 2] === '>')) i++; i += 3; result += ' '; continue }
    if (lang === 'css' && code[i] === '/' && code[i + 1] === '/') { i += 2; while (i < len && code[i] !== '\n') i++; result += ' '; continue }
    if (/\s/.test(code[i])) { result += ' '; while (i < len && /\s/.test(code[i])) i++; continue }
    result += code[i]; i++
  }
  return result.replace(/\s*([{};,:><])\s*/g, '$1').replace(/\s+/g, ' ').replace(/;\s*}/g, '}').replace(/>\s+</g, '><').trim()
}

export default function CodeFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [lang, setLang] = useState<Lang>('json')
  const [mode, setMode] = useState<Mode>('format')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [working, setWorking] = useState(false)

  const handle = async () => {
    setError(''); if(!input.trim()){ setOutput(''); return }
    setWorking(true)
    try {
      if(mode==='minify') setOutput(safeMinify(input, lang))
      else if(lang==='sql') setOutput(formatSql(input))
      else if(lang==='xml') setOutput(formatXml(input, {indentation:'  ', collapseContent:true}))
      else setOutput(await fmt(input, lang==='javascript'?'babel':lang))
    } catch(e) { setError((e as Error).message||'格式化失败'); setOutput('') }
    finally { setWorking(false) }
  }

  useAutoProcess(input, handle, [lang, mode], 800)

  return (
    <div className="max-w-6xl mx-auto animate-fadeInUp">
      <div className="flex items-center justify-between mb-8">
        <div><h2 className="text-2xl font-bold font-display text-white mb-1.5">代码 <span className="text-neon-purple text-glow-magenta">格式化</span></h2><p className="text-sm text-gray-400">Prettier · SQL Formatter · XML Formatter · 自动处理</p></div>
        <Code2 size={22} className="text-neon-purple" />
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider mr-1">语言</span>
          {(Object.keys(LC) as Lang[]).map(l => <Chip key={l} active={lang===l} onClick={() => { setLang(l); setOutput(''); setError('') }}><span className={LC[l].c}>{LC[l].n}</span></Chip>)}
        </div>

        <div className="flex items-center gap-2">
          <Chip active={mode==='format'} onClick={() => setMode('format')}><Wand2 size={13} />格式化</Chip>
          <Chip active={mode==='minify'} onClick={() => setMode('minify')}><Minimize2 size={13} />压缩</Chip>
          {working && <span className="ml-auto flex items-center gap-1.5 text-[10px] text-gray-500 font-mono"><Loader2 size={12} className="animate-spin" />处理中...</span>}
          <span className="ml-auto text-[10px] text-gray-500 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" /> 自动
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between"><Label>输入代码</Label><button onClick={()=>{setInput('');setOutput('');setError('')}} className="text-xs text-gray-500 hover:text-white">清空</button></div>
            <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={LC[lang].p} rows={16} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between"><Label>输出结果</Label><CopyBtn copied={copied} onCopy={async () => { if(!output) return; await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500) }} /></div>
            <Textarea value={output} readOnly placeholder="格式化后的代码将显示在这里..." rows={16} className="text-neon-green result-flash" />
          </div>
        </div>

        {error && <Alert>{error}</Alert>}
      </Card>
    </div>
  )
}
