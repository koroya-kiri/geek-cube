import { useState } from 'react'
import { ToolHeader, Card, Textarea, Label, CopyBtn, Chip } from '../components/ui'

export default function RobotsTool() {
  const [allowAll, setAllowAll] = useState(true); const [sitemap, setSitemap] = useState('')
  const [disallow, setDisallow] = useState('/admin/\n/api/')
  const robot = [
    allowAll ? 'User-agent: *\nAllow: /' : 'User-agent: *\nDisallow: /',
    ...disallow.split('\n').filter(l => l.trim()).map(l => `Disallow: ${l.trim()}`),
    sitemap ? `Sitemap: ${sitemap}` : '',
  ].join('\n')

  return (<div className="max-w-lg mx-auto animate-fadeInUp"><ToolHeader name="Robots" accent=".txt" desc="生成 robots.txt 文件"/><Card>
    <div className="flex gap-2"><Chip active={allowAll} onClick={()=>setAllowAll(true)}>允许所有</Chip><Chip active={!allowAll} onClick={()=>setAllowAll(false)}>禁止所有</Chip></div>
    {allowAll && <div className="space-y-1"><Label>禁止路径（每行一个）</Label><Textarea value={disallow} onChange={e=>setDisallow(e.target.value)} rows={3} placeholder="/admin/"/></div>}
    <div className="space-y-1"><Label>Sitemap URL（可选）</Label><input value={sitemap} onChange={e=>setSitemap(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-cyber-bg-deep border border-white/10 text-white text-sm focus:outline-none focus:border-neon-cyan/60 font-mono" style={{caretColor:'#00f0ff'}} placeholder="https://example.com/sitemap.xml"/></div>
    <div className="space-y-2"><div className="flex justify-between"><Label>robots.txt</Label><CopyBtn copied={false} onCopy={async()=>{await navigator.clipboard.writeText(robot)}}/></div><pre className="p-4 rounded-xl bg-cyber-bg-deep border border-white/10 text-neon-green text-xs font-mono overflow-auto">{robot}</pre></div>
  </Card></div>)
}
