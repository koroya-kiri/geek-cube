import { useState } from 'react'
import { RefreshCw, FileText, AlignLeft, Type } from 'lucide-react'
import { ToolHeader, Card, Button, Chip, Label, CopyBtn } from '../components/ui'

type LT = 'paragraphs'|'sentences'|'words'
const LW = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(' ')
const CW = '这是 一段 中文 假文 用于 测试 排版 效果 在 实际 项目 中 可以 替换 为 真实 内容 设计 开发 前端 后端 数据 接口 组件 样式 布局 响应式 动画 交互 体验 优化 性能 安全'.split(' ')

function gen(type: LT, count: number, cn: boolean): string {
  const pool = cn ? CW : LW; const rw = () => pool[Math.floor(Math.random()*pool.length)]
  const rs = () => { const l=5+Math.floor(Math.random()*11); const w=Array.from({length:l},rw); w[0]=w[0].charAt(0).toUpperCase()+w[0].slice(1); return w.join(' ')+'。' }
  const rp = () => Array.from({length:3+Math.floor(Math.random()*5)},rs).join(' ')
  switch(type){ case 'words': return Array.from({length:count},rw).join(' ').replace(/^./,c=>c.toUpperCase())+'。'; case 'sentences': return Array.from({length:count},rs).join(' '); case 'paragraphs': return Array.from({length:count},rp).join('\n\n') }
}

export default function LoremTool() {
  const [out, setOut] = useState(''); const [type, setType] = useState<LT>('paragraphs')
  const [count, setCount] = useState(3); const [cn, setCn] = useState(false); const [copied, setCopied] = useState(false)

  return (
    <div className="max-w-2xl mx-auto animate-fadeInUp">
      <ToolHeader name="Lorem" accent="Ipsum" accentColor="text-neon-magenta" glowClass="text-glow-magenta" desc="生成占位文本，支持中文和英文" />

      <Card>
        <div className="flex flex-wrap gap-2">
          <Chip active={type==='paragraphs'} onClick={() => setType('paragraphs')}><FileText size={13} />段落</Chip>
          <Chip active={type==='sentences'} onClick={() => setType('sentences')}><AlignLeft size={13} />句子</Chip>
          <Chip active={type==='words'} onClick={() => setType('words')}><Type size={13} />单词</Chip>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2"><Label>数量:</Label><input type="number" min={1} max={100} value={count} onChange={e => setCount(Math.min(100,Math.max(1,+e.target.value||1)))} className="w-20 px-3 py-1.5 rounded-lg bg-cyber-bg-deep border border-white/10 text-white text-sm text-center focus:outline-none focus:border-[rgba(0,240,255,0.5)] transition-colors" style={{caretColor:'#00f0ff'}} /></div>
          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer"><input type="checkbox" checked={cn} onChange={e => setCn(e.target.checked)} className="rounded" />中文</label>
        </div>

        <Button onClick={() => setOut(gen(type, count, cn))} className="w-full"><RefreshCw size={16} />生成 {type==='paragraphs'?'段落':type==='sentences'?'句子':'单词'}</Button>

        {out && <div className="space-y-2">
          <div className="flex justify-between"><Label>生成结果</Label><CopyBtn copied={copied} onCopy={async () => { await navigator.clipboard.writeText(out); setCopied(true); setTimeout(() => setCopied(false), 1500) }} /></div>
          <div className="px-4 py-3 rounded-xl bg-cyber-bg-deep border border-white/10 text-white text-sm leading-relaxed font-mono max-h-80 overflow-y-auto whitespace-pre-wrap">{out}</div>
        </div>}

        <div className="p-4 rounded-xl bg-cyber-bg-deep border border-white/10">
          <h3 className="text-sm font-semibold text-white mb-2">关于 Lorem Ipsum</h3>
          <p className="text-sm text-gray-400 leading-relaxed">Lorem Ipsum 是排版和设计领域广泛使用的占位文本，源自公元前 45 年西塞罗的著作。使用假文可以在内容尚未确定时预览排版效果。</p>
        </div>
      </Card>
    </div>
  )
}
