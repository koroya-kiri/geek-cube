import { useState } from 'react'
import { Clock } from 'lucide-react'
import { ToolHeader, Card, Input, Label, CopyBtn } from '../components/ui'

export default function TimestampTool() {
  const [ts, setTs] = useState(String(Math.floor(Date.now()/1000)))
  const [dt, setDt] = useState(new Date().toISOString().slice(0,19))
  const [copied, setCopied] = useState(false)
  const [last, setLast] = useState<'ts'|'dt'|null>(null)

  const handleTs = (v: string) => {
    setTs(v); setLast('ts')
    const n=+v; if(isNaN(n)){ setDt(''); return }
    const d=new Date(n>9999999999?n:n*1000); const pad=(x:number,s=2)=>String(x).padStart(s,'0')
    setDt(`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`)
  }

  const handleDt = (v: string) => {
    setDt(v); setLast('dt')
    const d=new Date(v); if(isNaN(d.getTime())){ setTs(''); return }
    setTs(String(Math.floor(d.getTime()/1000)))
  }

  const now = () => {
    const t = Math.floor(Date.now()/1000)
    setTs(String(t))
    const d = new Date(); const pad=(x:number,s=2)=>String(x).padStart(s,'0')
    setDt(`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`)
    setLast('ts')
  }

  return (
    <div className="max-w-lg mx-auto animate-fadeInUp">
      <ToolHeader name="时间戳" accent="转换" accentColor="text-neon-yellow" glowClass="text-glow-yellow" desc="Unix 时间戳与日期时间互相转换 · 实时处理" />

      <Card>
        <button onClick={now} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyber-bg-hover border border-white/10 text-gray-400 hover:text-white text-sm transition-colors">
          <Clock size={13} />当前时间
        </button>

        <div className="space-y-2">
          <div className="flex justify-between"><Label>Unix 时间戳（秒）</Label><CopyBtn copied={copied&&last==='ts'} onCopy={async () => { await navigator.clipboard.writeText(ts); setCopied(true); setLast('ts'); setTimeout(() => setCopied(false), 1500) }} /></div>
          <Input value={ts} onChange={e => handleTs(e.target.value)} placeholder="例如：1710000000" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between"><Label>日期时间</Label><CopyBtn copied={copied&&last==='dt'} onCopy={async () => { await navigator.clipboard.writeText(dt); setCopied(true); setLast('dt'); setTimeout(() => setCopied(false), 1500) }} /></div>
          <Input value={dt} onChange={e => handleDt(e.target.value)} placeholder="例如：2024-03-10 12:00:00" />
        </div>
      </Card>
    </div>
  )
}
