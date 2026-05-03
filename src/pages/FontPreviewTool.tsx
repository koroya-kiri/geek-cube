import { useState } from 'react'
import { ToolHeader, Card, Label } from '../components/ui'

const FONTS = [
  { n: 'JetBrains Mono', f: '"JetBrains Mono", monospace' },
  { n: 'Fira Code', f: '"Fira Code", monospace' },
  { n: 'Orbitron', f: '"Orbitron", sans-serif' },
  { n: 'DM Sans', f: '"DM Sans", sans-serif' },
  { n: 'Arial', f: 'Arial, sans-serif' },
  { n: 'Georgia', f: 'Georgia, serif' },
  { n: 'Courier New', f: '"Courier New", monospace' },
  { n: 'Verdana', f: 'Verdana, sans-serif' },
]

export default function FontPreviewTool() {
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog · 敏捷的棕狐狸跳过懒狗')
  const [size, setSize] = useState(18)
  return (<div className="max-w-2xl mx-auto animate-fadeInUp"><ToolHeader name="字体" accent="预览" desc="实时预览系统字体效果"/><Card>
    <div className="flex items-end gap-3">
      <div className="space-y-1 flex-1"><Label>预览文本</Label><input value={text} onChange={e=>setText(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-cyber-bg-deep border border-white/10 text-white text-sm focus:outline-none focus:border-neon-cyan/60" style={{caretColor:'#00f0ff'}}/></div>
      <div className="space-y-1"><Label>字号</Label><input type="number" value={size} onChange={e=>setSize(+e.target.value||16)} className="w-16 px-2 py-2 rounded-lg bg-cyber-bg-deep border border-white/10 text-white text-sm text-center focus:outline-none focus:border-neon-cyan/60" style={{caretColor:'#00f0ff'}}/></div>
    </div>
    <div className="space-y-4">{FONTS.map(({n,f}) => <div key={n} className="space-y-1">
      <Label>{n}</Label>
      <div className="p-3 rounded-xl bg-cyber-bg-deep border border-white/10" style={{ fontFamily: f, fontSize: size, color: '#e8e8f0', lineHeight: 1.6 }}>{text}</div>
    </div>)}</div>
  </Card></div>)
}
