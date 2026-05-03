import { useState } from 'react'
import { ArrowRight, RefreshCw } from 'lucide-react'
import { ToolHeader, Card, Button, Chip, Label, Input } from '../components/ui'

function fmt(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function add(d: Date, value: number, unit: 'days' | 'months' | 'years'): Date {
  const n = new Date(d)
  if (unit === 'days') n.setDate(n.getDate() + value)
  else if (unit === 'months') n.setMonth(n.getMonth() + value)
  else n.setFullYear(n.getFullYear() + value)
  return n
}

function daysBetween(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime()
  return Math.round(ms / 86400000)
}

export default function DateCalculatorTool() {
  const today = fmt(new Date())
  const [date, setDate] = useState(today)
  const [value, setValue] = useState(1)
  const [unit, setUnit] = useState<'days' | 'months' | 'years'>('days')
  const [result, setResult] = useState('')

  /* Date diff mode */
  const [diffMode, setDiffMode] = useState(false)
  const [dateA, setDateA] = useState(today)
  const [dateB, setDateB] = useState(today)
  const [diffResult, setDiffResult] = useState('')

  const calc = () => {
    const d = new Date(date)
    if (isNaN(d.getTime())) { setResult('无效日期'); return }
    setResult(fmt(add(d, value, unit)))
  }

  const calcDiff = () => {
    const a = new Date(dateA), b = new Date(dateB)
    if (isNaN(a.getTime()) || isNaN(b.getTime())) { setDiffResult('无效日期'); return }
    const days = daysBetween(a, b)
    const abs = Math.abs(days)
    const weeks = (abs / 7).toFixed(1)
    const months = (abs / 30.44).toFixed(1)
    const years = (abs / 365.25).toFixed(2)
    setDiffResult(`${abs} 天 · ${weeks} 周 · ${months} 月 · ${years} 年`)
  }

  return (
    <div className="max-w-md mx-auto animate-fadeInUp">
      <ToolHeader name="日期" accent="计算器" accentColor="text-neon-yellow" desc="日期加减运算与日期差计算" />

      <div className="flex gap-2 mb-6">
        <Chip active={!diffMode} onClick={() => setDiffMode(false)}>日期运算</Chip>
        <Chip active={diffMode} onClick={() => setDiffMode(true)}>日期差</Chip>
      </div>

      {!diffMode ? (
        <Card>
          <div className="space-y-2">
            <Label>基准日期</Label>
            <Input value={date} onChange={e => setDate(e.target.value)} type="date" />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 space-y-1">
              <Label>数量</Label>
              <Input value={String(value)} onChange={v => setValue(Math.max(1, +v || 1))} type="number" min={1} />
            </div>
            <div className="flex gap-1 pt-5">
              {(['days', 'months', 'years'] as const).map(u => (
                <Chip key={u} active={unit === u} onClick={() => setUnit(u)}>
                  {u === 'days' ? '天' : u === 'months' ? '月' : '年'}
                </Chip>
              ))}
            </div>
          </div>

          <Button onClick={calc} className="w-full"><ArrowRight size={16} />计算</Button>

          {result && (
            <div className="p-4 rounded-xl bg-cyber-bg-deep border border-white/10 text-center">
              <p className="text-xs text-gray-500 mb-1">结果日期</p>
              <p className="text-xl font-bold text-neon-cyan font-mono">{result}</p>
              <p className="text-xs text-gray-500 mt-1">
                {date} {value > 0 ? '+' : ''}{value} {unit === 'days' ? '天' : unit === 'months' ? '月' : '年'}
              </p>
            </div>
          )}

          <Button onClick={() => { setDate(today); setValue(1); setUnit('days'); setResult('') }} variant="ghost" className="w-full text-xs">
            <RefreshCw size={13} />重置为今天
          </Button>
        </Card>
      ) : (
        <Card>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>日期 A</Label>
              <Input value={dateA} onChange={e => setDateA(e.target.value)} type="date" />
            </div>
            <div className="space-y-2">
              <Label>日期 B</Label>
              <Input value={dateB} onChange={e => setDateB(e.target.value)} type="date" />
            </div>
          </div>

          <Button onClick={calcDiff} className="w-full"><ArrowRight size={16} />计算差值</Button>

          {diffResult && (
            <div className="p-4 rounded-xl bg-cyber-bg-deep border border-white/10 text-center">
              <p className="text-xs text-gray-500 mb-1">相差</p>
              <p className="text-lg font-bold text-neon-cyan font-mono whitespace-pre-line">{diffResult}</p>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
