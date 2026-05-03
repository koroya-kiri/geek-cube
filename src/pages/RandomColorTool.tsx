import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { ToolHeader, Card, Button } from '../components/ui'

function randomColor(): string { return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0') }
function randomHex(): string { return '#' + Array.from({ length: 6 }, () => '0123456789ABCDEF'[Math.floor(Math.random() * 16)]).join('') }

export default function RandomColorTool() {
  const [colors, setColors] = useState<string[]>(() => Array.from({ length: 10 }, randomColor))
  const [copied, setCopied] = useState<number | null>(null)

  return (<div className="max-w-lg mx-auto animate-fadeInUp"><ToolHeader name="随机" accent="颜色" desc="随机生成颜色"/><Card>
    <div className="flex flex-wrap gap-2">{colors.map((c, i) => (
      <div key={i} className="flex flex-col items-center gap-1">
        <button className="w-16 h-16 rounded-2xl border border-white/10 hover:scale-110 transition-transform cursor-pointer" style={{ backgroundColor: c }}
          onClick={async () => { await navigator.clipboard.writeText(c); setCopied(i); setTimeout(() => setCopied(null), 1500) }} />
        <span className="text-[10px] font-mono text-white">{c}</span>
        {copied === i && <span className="text-[9px] text-neon-cyan">已复制</span>}
      </div>
    ))}</div>
    <Button onClick={() => setColors(Array.from({ length: 10 }, randomHex))} className="w-full"><RefreshCw size={14} />重新生成</Button>
  </Card></div>)
}
