import { useState, useCallback } from 'react'
import { ToolHeader, Card, Textarea, Label, CopyBtn } from '../components/ui'

type Radix = 2|8|10|16
const LABELS: Record<Radix, { name: string; dot: string }> = { 2:{name:'二进制 Binary',dot:'bg-neon-cyan'},8:{name:'八进制 Octal',dot:'bg-neon-green'},10:{name:'十进制 Decimal',dot:'bg-neon-yellow'},16:{name:'十六进制 Hex',dot:'bg-neon-magenta'} }

export default function RadixTool() {
  const [values, setValues] = useState<Record<Radix,string>>({2:'',8:'',10:'',16:''})
  const [active, setActive] = useState<Radix>(10)
  const [copied, setCopied] = useState<Radix|null>(null)
  const [error, setError] = useState('')

  const valid: Record<Radix,RegExp> = { 2:/^[01]+$/, 8:/^[0-7]+$/, 10:/^\d+$/, 16:/^[0-9a-fA-F]+$/ }

  const convert = useCallback((v: string, from: Radix) => {
    setError(''); if(!v.trim()){ setValues({2:'',8:'',10:'',16:''}); return }
    if(!valid[from].test(v)){ setError(`无效的 ${LABELS[from].name} 数值`); return }
    const d = parseInt(v, from); if(isNaN(d)){ setError('转换失败'); return }
    setValues({ 2:d.toString(2), 8:d.toString(8), 10:d.toString(10), 16:d.toString(16).toUpperCase() })
  }, [])

  return (
    <div className="max-w-xl mx-auto animate-fadeInUp">
      <ToolHeader name="进制" accent="转换器" accentColor="text-neon-yellow" glowClass="text-glow-yellow" desc="二进制、八进制、十进制、十六进制实时互转" />

      <Card>
        {([2,8,10,16] as Radix[]).map(r => (
          <div key={r} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label><span className={`inline-block w-2 h-2 rounded-full ${LABELS[r].dot} mr-2`} />{LABELS[r].name}</Label>
              <CopyBtn copied={copied===r} onCopy={async () => { if(!values[r]) return; await navigator.clipboard.writeText(values[r]); setCopied(r); setTimeout(() => setCopied(null), 1500) }} />
            </div>
            <Textarea value={values[r]} onChange={e => { setActive(r); convert(e.target.value, r) }} placeholder={`输入${LABELS[r].name.split(' ')[0]}数值...`} rows={2} className={active===r?'border-neon-yellow/50 ring-2 ring-neon-yellow/10':''} />
          </div>
        ))}
        {error && <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">{error}</div>}
      </Card>

      <div className="mt-6 rounded-2xl border border-white/10 bg-cyber-bg-surface/50 p-5">
        <h3 className="text-sm font-semibold text-white mb-3">进制对照表</h3>
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="text-gray-500 border-b border-white/10"><th className="text-left py-2 px-3">十进制</th><th className="text-left py-2 px-3">二进制</th><th className="text-left py-2 px-3">八进制</th><th className="text-left py-2 px-3">十六进制</th></tr></thead>
          <tbody className="text-gray-300">
            {[0,1,2,7,8,10,15,16,255,256].map(n => (<tr key={n} className="border-b border-white/5 hover:bg-white/5"><td className="py-2 px-3 font-mono text-neon-yellow">{n}</td><td className="py-2 px-3 font-mono text-neon-cyan">{n.toString(2)}</td><td className="py-2 px-3 font-mono text-neon-green">{n.toString(8)}</td><td className="py-2 px-3 font-mono text-neon-magenta">{n.toString(16).toUpperCase()}</td></tr>))}
          </tbody>
        </table></div>
      </div>
    </div>
  )
}
