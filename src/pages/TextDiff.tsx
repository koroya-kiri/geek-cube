import { useState, useMemo } from 'react'
import { ToolHeader, Card, Textarea, Label, CopyBtn } from '../components/ui'

type DiffOp = { type: 'equal' | 'insert' | 'delete'; text: string; lineA?: number; lineB?: number }

/** Compute LCS-based line diff using dynamic programming */
function computeDiff(a: string[], b: string[]): DiffOp[] {
  // Build LCS table
  const m = a.length, n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
    }
  }

  // Backtrack to produce diff
  const ops: DiffOp[] = []
  let i = m, j = n
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      ops.unshift({ type: 'equal', text: a[i - 1], lineA: i, lineB: j })
      i--; j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      ops.unshift({ type: 'insert', text: b[j - 1], lineB: j })
      j--
    } else {
      ops.unshift({ type: 'delete', text: a[i - 1], lineA: i })
      i--
    }
  }
  return ops
}

export default function TextDiff() {
  const [left, setLeft] = useState('')
  const [right, setRight] = useState('')
  const [copied, setCopied] = useState(false)

  const diffs = useMemo(() => {
    if (!left && !right) return []
    const al = left.split('\n'), bl = right.split('\n')
    return computeDiff(al, bl)
  }, [left, right])

  return (
    <div className="max-w-5xl mx-auto animate-fadeInUp">
      <ToolHeader name="文本" accent="对比" accentColor="text-neon-magenta" glowClass="text-glow-magenta" desc="基于 LCS 算法的行级文本差异对比" />

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>原文本 A</Label><Textarea value={left} onChange={e => setLeft(e.target.value)} placeholder="输入第一段文本..." rows={8} /></div>
          <div className="space-y-2"><Label>原文本 B</Label><Textarea value={right} onChange={e => setRight(e.target.value)} placeholder="输入第二段文本..." rows={8} /></div>
        </div>

        <div className="flex items-center gap-2">
          <CopyBtn copied={copied} onCopy={async () => {
            const t = diffs.map(d => d.type === 'insert' ? `+ ${d.text}` : d.type === 'delete' ? `- ${d.text}` : `  ${d.text}`).join('\n')
            await navigator.clipboard.writeText(t); setCopied(true); setTimeout(() => setCopied(false), 1500)
          }} />
        </div>

        {diffs.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-cyber-bg-deep overflow-hidden">
            <div className="flex text-[10px] text-gray-500 uppercase tracking-wider px-4 py-2 border-b border-white/[0.05] bg-cyber-bg-surface/50">
              <span className="w-12 shrink-0 text-center">行号</span>
              <span className="flex-1">差异结果</span>
            </div>
            <div className="max-h-96 overflow-y-auto text-sm font-mono">
              {diffs.map((d, i) => (
                <div key={i} className={`flex px-4 py-1 ${d.type === 'insert' ? 'bg-green-500/10' : d.type === 'delete' ? 'bg-red-500/10' : ''}`}>
                  <span className="w-12 shrink-0 text-center text-xs text-gray-600 select-none">
                    {d.type === 'insert' ? `+${d.lineB ?? ''}` : d.type === 'delete' ? `-${d.lineA ?? ''}` : ` ${d.lineA}`}
                  </span>
                  <span className={`${d.type === 'insert' ? 'text-green-400' : d.type === 'delete' ? 'text-red-400' : 'text-gray-400'}`}>
                    {d.type === 'insert' ? '+ ' : d.type === 'delete' ? '- ' : '  '}
                  </span>
                  <span className={`break-all ${d.type === 'insert' ? 'text-green-300' : d.type === 'delete' ? 'text-red-300/60 line-through' : 'text-gray-300'}`}>
                    {d.text || ' '}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        {left || right ? null : <p className="text-sm text-gray-500 text-center py-4">输入两段文本以查看差异</p>}
      </Card>
    </div>
  )
}
