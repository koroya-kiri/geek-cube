import { useState } from 'react'
import { ChevronRight, ChevronDown, Copy } from 'lucide-react'
import { ToolHeader, Card, Textarea, Label, CopyBtn, Button, Alert } from '../components/ui'

type TreeNode =
  | { type: 'primitive'; value: unknown; path: string }
  | { type: 'object'; entries: { key: string; node: TreeNode }[]; path: string }
  | { type: 'array'; items: TreeNode[]; path: string }

function buildTree(data: unknown, path = '$'): TreeNode {
  if (data === null) return { type: 'primitive', value: 'null', path }
  if (typeof data !== 'object') {
    if (typeof data === 'string') return { type: 'primitive', value: data, path }
    return { type: 'primitive', value: String(data), path }
  }
  if (Array.isArray(data)) {
    return {
      type: 'array',
      items: data.map((item, i) => buildTree(item, `${path}[${i}]`)),
      path,
    }
  }
  return {
    type: 'object',
    entries: Object.entries(data as Record<string, unknown>).map(([k, v]) => ({
      key: k,
      node: buildTree(v, `${path}.${k}`),
    })),
    path,
  }
}

function typeColor(type: string): string {
  switch (type) {
    case 'string': return 'text-neon-green'
    case 'number': return 'text-neon-yellow'
    case 'boolean': return 'text-neon-magenta'
    default: return 'text-gray-400'
  }
}

function TreeNodeView({ node, depth = 0 }: { node: TreeNode; depth: number }) {
  const [collapsed, setCollapsed] = useState(depth > 2)
  const pad = depth * 16

  if (node.type === 'primitive') {
    const v = node.value
    const t = typeof v === 'string' ? 'string'
      : typeof v === 'number' ? 'number'
      : typeof v === 'boolean' ? 'boolean'
      : 'null'
    return (
      <div className="flex items-center gap-1" style={{ paddingLeft: pad + 16 }}>
        <span className={`text-xs font-mono ${typeColor(t)}`}>
          {t === 'string' ? `"${v}"` : String(v)}
        </span>
      </div>
    )
  }

  const isArray = node.type === 'array'
  const items = isArray ? node.items.map((n, i) => ({ key: String(i), node: n })) : node.entries
  const count = items.length
  const bracket = isArray ? ['[', ']'] : ['{', '}']

  return (
    <div>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-1 text-xs font-mono text-gray-300 hover:text-white transition-colors py-0.5"
        style={{ paddingLeft: pad }}
      >
        {collapsed ? <ChevronRight size={12} className="text-gray-500 shrink-0" /> : <ChevronDown size={12} className="text-gray-500 shrink-0" />}
        <span className="text-gray-500">{bracket[0]}</span>
        {collapsed && (
          <>
            <span className="text-gray-600">{count} items</span>
            <span className="text-gray-500">{bracket[1]}</span>
          </>
        )}
      </button>
      {!collapsed && items.map(({ key, node: n }) => (
        <div key={key}>
          <div className="flex items-center gap-1" style={{ paddingLeft: pad + 16 }}>
            {!isArray && <span className="text-xs font-mono text-neon-cyan">{key}</span>}
            {!isArray && <span className="text-gray-600 text-xs">:</span>}
            {isArray && <span className="text-gray-600 text-xs w-5 text-right shrink-0">{key}</span>}
            {n.type === 'primitive' ? (
              <span className={`text-xs font-mono ${typeColor(typeof n.value === 'string' ? 'string' : typeof n.value === 'number' ? 'number' : 'boolean')}`}>
                {typeof n.value === 'string' ? `"${n.value}"` : String(n.value)}
              </span>
            ) : (
              <TreeNodeView node={n} depth={depth + 1} />
            )}
          </div>
        </div>
      ))}
      {!collapsed && (
        <div style={{ paddingLeft: pad }} className="text-xs font-mono text-gray-500">{bracket[1]}</div>
      )}
    </div>
  )
}

export default function JsonTreeViewer() {
  const [input, setInput] = useState('')
  const [tree, setTree] = useState<TreeNode | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const parse = () => {
    setError(''); setTree(null)
    if (!input.trim()) return
    try {
      const data = JSON.parse(input)
      setTree(buildTree(data))
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return (
    <div className="max-w-5xl mx-auto animate-fadeInUp">
      <ToolHeader name="JSON" accent="树形查看" desc="交互式 JSON 树形视图，支持折叠展开" />

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>JSON 数据</Label>
            <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder='{"name":"test","items":[1,2,3]}' rows={18} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>树形视图</Label>
              <CopyBtn copied={copied} onCopy={async () => { await navigator.clipboard.writeText(input); setCopied(true); setTimeout(() => setCopied(false), 1500) }} />
            </div>
            <div className="rounded-xl bg-cyber-bg-deep border border-white/10 p-4 min-h-[400px] max-h-[500px] overflow-auto font-mono">
              {tree ? (
                <TreeNodeView node={tree} depth={0} />
              ) : (
                <p className="text-sm text-gray-500 py-8 text-center">输入 JSON 数据后点击解析</p>
              )}
            </div>
          </div>
        </div>

        <Button onClick={parse} disabled={!input.trim()} className="w-full">
          <Copy size={14} />解析 JSON
        </Button>
        {error && <Alert>{error}</Alert>}
      </Card>
    </div>
  )
}
