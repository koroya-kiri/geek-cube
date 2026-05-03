import { useState } from 'react'
import { ToolHeader, Card, Label, CopyBtn } from '../components/ui'

export default function MetaTagTool() {
  const [title, setTitle] = useState('My Website'); const [desc, setDesc] = useState('A great website'); const [keywords, setKeywords] = useState('web, site')
  const [ogTitle, setOgTitle] = useState(''); const [ogDesc, setOgDesc] = useState(''); const [ogImage, setOgImage] = useState('')
  const tags = [
    `<title>${title}</title>`,
    `<meta name="description" content="${desc}">`,
    `<meta name="keywords" content="${keywords}">`,
    `<meta property="og:title" content="${ogTitle || title}">`,
    `<meta property="og:description" content="${ogDesc || desc}">`,
    ogImage ? `<meta property="og:image" content="${ogImage}">` : '',
    `<meta name="twitter:card" content="summary">`,
  ].filter(Boolean).join('\n')

  return (<div className="max-w-lg mx-auto animate-fadeInUp"><ToolHeader name="Meta" accent="标签" desc="生成 HTML Meta 标签"/><Card>
    <div className="space-y-3">
      {[{l:'标题',v:title,s:setTitle},{l:'描述',v:desc,s:setDesc},{l:'关键词',v:keywords,s:setKeywords},{l:'OG 标题',v:ogTitle,s:setOgTitle},{l:'OG 描述',v:ogDesc,s:setOgDesc},{l:'OG 图片 URL',v:ogImage,s:setOgImage}].map(({l,v,s})=><div key={l} className="space-y-1"><Label>{l}</Label><input value={v} onChange={e=>s(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-cyber-bg-deep border border-white/10 text-white text-sm focus:outline-none focus:border-neon-cyan/60 font-mono" style={{caretColor:'#00f0ff'}}/></div>)}
    </div>
    <div className="space-y-2"><div className="flex justify-between"><Label>输出</Label><CopyBtn copied={false} onCopy={async()=>{await navigator.clipboard.writeText(tags)}}/></div><pre className="p-4 rounded-xl bg-cyber-bg-deep border border-white/10 text-neon-green text-xs font-mono overflow-auto">{tags}</pre></div>
  </Card></div>)
}
