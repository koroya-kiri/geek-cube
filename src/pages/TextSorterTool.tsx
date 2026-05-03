import { useState, useMemo } from 'react'
import { ArrowUpDown, Trash2, Shuffle, ArrowDownUp, Copy } from 'lucide-react'
import { ToolHeader, Card, Button, Chip, Textarea, Label, CopyBtn } from '../components/ui'

type Op = 'sort-asc' | 'sort-desc' | 'reverse' | 'shuffle' | 'dedupe' | 'trim'

const OPS: { k: Op; l: string; icon: typeof ArrowUpDown }[] = [
  { k: 'sort-asc', l: '升序 A→Z', icon: ArrowUpDown },
  { k: 'sort-desc', l: '降序 Z→A', icon: ArrowDownUp },
  { k: 'dedupe', l: '去重', icon: Trash2 },
  { k: 'reverse', l: '翻转', icon: ArrowDownUp },
  { k: 'shuffle', l: '乱序', icon: Shuffle },
  { k: 'trim', l: '去空格', icon: Trash2 },
]

function process(text: string, op: Op): string {
  const lines = text.split('\n')
  let result: string[]

  switch (op) {
    case 'sort-asc':
      result = [...lines].sort((a, b) => a.localeCompare(b, 'zh-CN'))
      break
    case 'sort-desc':
      result = [...lines].sort((a, b) => b.localeCompare(a, 'zh-CN'))
      break
    case 'dedupe':
      result = [...new Set(lines)]
      break
    case 'reverse':
      result = [...lines].reverse()
      break
    case 'shuffle':
      result = [...lines]
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]]
      }
      break
    case 'trim':
      result = lines.map(l => l.trim()).filter(l => l !== '')
      break
    default:
      result = lines
  }

  return result.join('\n')
}

export default function TextSorterTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [activeOp, setActiveOp] = useState<Op | null>(null)
  const [copied, setCopied] = useState(false)

  const stats = useMemo(() => {
    if (!input.trim()) return null
    const lines = input.split('\n')
    const nonEmpty = lines.filter(l => l.trim()).length
    return { total: lines.length, nonEmpty }
  }, [input])

  const apply = (op: Op) => {
    setActiveOp(op)
    setOutput(process(input, op))
  }

  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp">
      <ToolHeader name="文本" accent="排序去重" desc="行排序、去重、翻转、乱序处理" />

      <Card>
        <div className="flex flex-wrap gap-2">
          {OPS.map(({ k, l }) => (
            <Chip key={k} active={activeOp === k} onClick={() => apply(k)}>{l}</Chip>
          ))}
        </div>

        {stats && (
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>{stats.total} 行</span>
            <span>{stats.nonEmpty} 行非空</span>
            {activeOp && <span className="text-neon-cyan">已应用: {OPS.find(o => o.k === activeOp)?.l}</span>}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>输入</Label>
              <button onClick={() => { setInput(''); setOutput(''); setActiveOp(null) }} className="text-xs text-gray-500 hover:text-white">清空</button>
            </div>
            <Textarea value={input} onChange={e => setInput(e.target.value)} rows={12} placeholder="每行一个条目..." />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>输出</Label>
              <CopyBtn copied={copied} onCopy={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500) }} />
            </div>
            <Textarea value={output} readOnly rows={12} placeholder="选择上方操作..." className="text-neon-green result-flash" />
          </div>
        </div>

        <Button onClick={() => { setOutput(process(input, activeOp || 'sort-asc')); setActiveOp(activeOp || 'sort-asc') }} disabled={!input.trim()} className="w-full">
          <Copy size={14} />应用{activeOp ? ` · ${OPS.find(o => o.k === activeOp)?.l}` : ''}
        </Button>
      </Card>
    </div>
  )
}
