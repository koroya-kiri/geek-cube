import { useState } from 'react'
import { RefreshCcw } from 'lucide-react'
import { ToolHeader, Card, Button, Input, Label, CopyBtn } from '../components/ui'

export default function NanoIdTool() {
  const [size, setSize] = useState(21)
  const [count, setCount] = useState(5)
  const [ids, setIds] = useState<string[]>([])
  const [copiedAt, setCopiedAt] = useState<number|null>(null)

  const gen = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'
    setIds(Array.from({length:count}, () => Array.from({length:size}, () => chars[Math.floor(Math.random()*chars.length)]).join('')))
  }

  return (
    <div className="max-w-sm mx-auto animate-fadeInUp">
      <ToolHeader name="Nano ID" accent="生成" desc="生成紧凑的唯一标识符" />
      <Card>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><Label>长度</Label><Input type="number" value={size} onChange={e=>setSize(+e.target.value)} min={4} max={64} /></div>
          <div className="space-y-1"><Label>数量</Label><Input type="number" value={count} onChange={e=>setCount(Math.min(20,+e.target.value))} min={1} /></div>
        </div>
        <Button onClick={gen} className="w-full"><RefreshCcw size={16} />生成</Button>
        {ids.length > 0 && (
          <div className="space-y-1.5">
            {ids.map((id,i) => <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-cyber-bg-deep border border-white/10"><code className="text-xs text-neon-cyan font-mono">{id}</code><CopyBtn copied={copiedAt===i} onCopy={async()=>{await navigator.clipboard.writeText(id);setCopiedAt(i);setTimeout(()=>setCopiedAt(null),1500)}} /></div>)}
          </div>
        )}
      </Card>
    </div>
  )
}
