import { useState } from 'react'
import { ToolHeader, Card, Input } from '../components/ui'

const UNITS = ['B','KB','MB','GB','TB','PB'] as const

export default function DataUnitsTool() {
  const [value, setValue] = useState('1')
  const [from, setFrom] = useState('MB')
  const [results, setResults] = useState<Record<string,string>>({})

  const convert = () => {
    const factors: Record<string,number> = {B:1,KB:1024,MB:1048576,GB:1073741824,TB:1099511627776,PB:1125899906842624}
    const bytes = parseFloat(value) * factors[from]; if (isNaN(bytes)) { setResults({}); return }
    const r: Record<string,string> = {}
    UNITS.forEach(u => { r[u] = (bytes / factors[u]).toFixed(4).replace(/\.?0+$/,'') })
    setResults(r)
  }

  return (
    <div className="max-w-sm mx-auto animate-fadeInUp">
      <ToolHeader name="数据单位" accent="换算" desc="Bytes/KB/MB/GB/TB/PB 互相换算 · 实时换算" />
      <Card>
        <div className="flex gap-2">
          <Input value={value} onChange={e => { setValue(e.target.value); convert() }} placeholder="1" className="flex-1" />
          <select value={from} onChange={e => { setFrom(e.target.value); convert() }} className="px-3 py-2 rounded-xl bg-cyber-bg-deep border border-white/10 text-white text-sm">
            {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        {Object.keys(results).length > 0 && <div className="space-y-2">
          {UNITS.map(u => <div key={u} className="flex justify-between p-3 rounded-xl bg-cyber-bg-deep border border-white/10 result-flash"><span className="text-sm text-gray-400">{u}</span><span className="text-sm text-white font-mono">{results[u]}</span></div>)}
        </div>}
      </Card>
    </div>
  )
}
