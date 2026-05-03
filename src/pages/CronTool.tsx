import { useState, useCallback } from 'react'
import { Clock, Calendar, Info } from 'lucide-react'
import { CronExpressionParser } from 'cron-parser'
import { ToolHeader, Card, Button, Input, Label, CopyBtn, Alert } from '../components/ui'

const PRESETS = [
  {l:'每分钟',e:'* * * * *'},{l:'每5分钟',e:'*/5 * * * *'},{l:'每小时',e:'0 * * * *'},
  {l:'每天午夜',e:'0 0 * * *'},{l:'每天中午',e:'0 12 * * *'},{l:'工作日 9:00',e:'0 9 * * 1-5'},
  {l:'每周一 8:00',e:'0 8 * * 1'},{l:'每月1号',e:'0 0 1 * *'},{l:'每年1月1日',e:'0 0 1 1 *'},
]

function explain(expr: string): string {
  const p = expr.trim().split(/\s+/); if(p.length!==5) return '请输入 5 位标准 Cron 表达式'
  const d = (v:string,u:string) => { if(v==='*') return `每${u}`; if(v.startsWith('*/')) return `每${v.slice(2)}${u}`; if(v.includes(',')) return `${v}${u}`; if(v.includes('-')) return `${v.replace('-','到')}${u}`; return `在${v}${u}` }
  return [d(p[0],'分钟'),d(p[1],'小时'),d(p[2],'日'),d(p[3],'月'),d(p[4],'周')].join('，')
}

function getNextRuns(expr: string, count: number): Date[] {
  try {
    const interval = CronExpressionParser.parse(expr)
    const runs: Date[] = []
    for (let i = 0; i < count; i++) {
      runs.push(interval.next().toDate())
    }
    return runs
  } catch {
    return []
  }
}

export default function CronTool() {
  const [expr, setExpr] = useState('')
  const [explanation, setExplanation] = useState('')
  const [nextRuns, setNextRuns] = useState<Date[]>([])
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const parse = useCallback(() => {
    setError(''); const e = expr.trim(); if(!e){ setExplanation(''); setNextRuns([]); return }
    try {
      CronExpressionParser.parse(e) // validate expression
    } catch {
      setError('无效的 Cron 表达式，请检查格式（分 时 日 月 周）')
      setExplanation(''); setNextRuns([])
      return
    }
    setExplanation(explain(e))
    setNextRuns(getNextRuns(e, 5))
  }, [expr])

  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp">
      <ToolHeader name="Cron" accent="表达式" accentColor="text-neon-yellow" glowClass="text-glow-yellow" desc="生成和解析 Linux Cron 定时任务表达式" />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        <Card>
          <div className="space-y-2">
            <div className="flex justify-between"><Label><Clock size={12} className="inline mr-1" />Cron 表达式</Label><CopyBtn copied={copied} onCopy={async () => { if(!expr) return; await navigator.clipboard.writeText(expr); setCopied(true); setTimeout(() => setCopied(false), 1500) }} /></div>
            <Input value={expr} onChange={e => setExpr(e.target.value)} onKeyDown={e => e.key==='Enter'&&parse()} placeholder="* * * * *" className="text-lg text-neon-yellow tracking-widest" />
          </div>

          <div className="grid grid-cols-5 gap-2">
            {['分','时','日','月','周'].map((n,i) => <div key={n} className="text-center p-2 rounded-lg bg-cyber-bg-deep border border-white/10"><div className="text-xs text-gray-500">{n}</div><div className="text-[10px] text-gray-600">{['0-59','0-23','1-31','1-12','0-7'][i]}</div></div>)}
          </div>

          <Button onClick={parse} disabled={!expr.trim()} className="w-full">解析表达式</Button>
          {error && <Alert>{error}</Alert>}

          {explanation && <div className="px-4 py-3 rounded-xl bg-neon-cyan/5 border border-neon-cyan/20 text-sm text-neon-cyan"><Info size={13} className="inline mr-1.5" />{explanation}</div>}

          {nextRuns.length > 0 && <div className="space-y-2">
            <Label>下次执行时间（精确计算）</Label>
            <div className="space-y-1.5">{nextRuns.map((d,i) => <div key={i} className="flex items-center gap-3 px-4 py-2 rounded-lg bg-cyber-bg-deep border border-white/10 text-sm"><Calendar size={13} className="text-neon-green" /><span className="text-white font-mono text-xs">{d.toLocaleString('zh-CN',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit'})}</span></div>)}</div>
            <p className="text-xs text-gray-500">基于 cron-parser 库精确计算</p>
          </div>}
        </Card>

        <div className="rounded-2xl border border-white/10 bg-cyber-bg-surface/70 p-5 space-y-2">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2"><Clock size={13} className="text-neon-yellow" />常用预设</h3>
          {PRESETS.map(p => <button key={p.l} onClick={() => { setExpr(p.e); setError('') }} className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${expr===p.e?'bg-neon-yellow/10 border border-neon-yellow/30 text-neon-yellow':'text-gray-400 hover:text-white hover:bg-cyber-bg-hover border border-transparent'}`}><div className="font-medium text-xs">{p.l}</div><code className="text-[10px] text-gray-500 font-mono">{p.e}</code></button>)}
        </div>
      </div>
    </div>
  )
}
