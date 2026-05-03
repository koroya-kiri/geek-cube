import { useState, useCallback } from 'react'
import { RefreshCw, Settings } from 'lucide-react'
import { v1, v4, v7 } from 'uuid'
import { ToolHeader, Card, Button, Chip, Label, CopyBtn } from '../components/ui'

type Ver = 'v1'|'v4'|'v7'
const VERS: {k:Ver;l:string;d:string}[] = [{k:'v1',l:'UUID v1',d:'时间戳'},{k:'v4',l:'UUID v4',d:'随机·最常用'},{k:'v7',l:'UUID v7',d:'时间排序'}]

export default function UuidTool() {
  const [uuids, setUuids] = useState<string[]>([])
  const [ver, setVer] = useState<Ver>('v4')
  const [count, setCount] = useState(1)
  const [upper, setUpper] = useState(false)
  const [noDash, setNoDash] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState<number|null>(null)
  const [show, setShow] = useState(false)

  const gen = useCallback(() => {
    const genFn: Record<Ver,()=>string> = { v1, v4, v7 }
    setUuids(Array.from({length:count}, () => {
      let u = genFn[ver](); if(upper) u=u.toUpperCase(); if(noDash) u=u.replace(/-/g,''); return u
    }))
  }, [ver, count, upper, noDash])

  return (
    <div className="max-w-xl mx-auto animate-fadeInUp">
      <ToolHeader name="UUID" accent="生成器" desc="生成符合 RFC 4122 标准的 UUID" />

      <Card>
        <div className="flex flex-wrap gap-2">
          {VERS.map(({k,l}) => <Chip key={k} active={ver===k} onClick={() => setVer(k)}>{l}</Chip>)}
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => setShow(!show)} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"><Settings size={15} />设置</button>
          <div className="flex items-center gap-2"><Label>数量:</Label><input type="number" min={1} max={100} value={count} onChange={e => setCount(Math.min(100,Math.max(1,+e.target.value||1)))} className="w-16 px-2 py-1.5 rounded-lg bg-cyber-bg-deep border border-white/10 text-white text-sm text-center focus:outline-none focus:border-[rgba(0,240,255,0.5)] transition-colors" style={{caretColor:'#00f0ff'}} /></div>
        </div>

        {show && <div className="p-4 rounded-xl bg-cyber-bg-deep border border-white/10 space-y-3">
          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer"><input type="checkbox" checked={upper} onChange={e => setUpper(e.target.checked)} className="rounded" />大写字母</label>
          <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer"><input type="checkbox" checked={noDash} onChange={e => setNoDash(e.target.checked)} className="rounded" />移除连字符</label>
        </div>}

        <Button onClick={gen} className="w-full"><RefreshCw size={16} />生成 UUID</Button>

        {uuids.length > 0 && <div className="space-y-2">
          <div className="flex items-center justify-between"><Label>生成结果 ({uuids.length})</Label><CopyBtn copied={copiedIdx===-1} onCopy={async () => { await navigator.clipboard.writeText(uuids.join('\n')); setCopiedIdx(-1); setTimeout(() => setCopiedIdx(null), 1500) }} /></div>
          <div className="space-y-1.5 max-h-80 overflow-y-auto">
            {uuids.map((u,i) => (
              <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-cyber-bg-deep border border-white/10 group hover:border-white/20 transition-colors">
                <span className="text-xs text-gray-500 w-6">{i+1}.</span>
                <code className="flex-1 text-xs font-mono text-neon-cyan break-all">{u}</code>
                <CopyBtn copied={copiedIdx===i} onCopy={async () => { await navigator.clipboard.writeText(u); setCopiedIdx(i); setTimeout(() => setCopiedIdx(null), 1500) }} />
              </div>
            ))}
          </div>
        </div>}

        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
          {VERS.map(({k,l,d}) => <div key={k} className="text-center p-3 rounded-xl bg-cyber-bg-deep"><span className="text-sm font-semibold text-neon-cyan">{l}</span><p className="text-xs text-gray-500 mt-1">{d}</p></div>)}
        </div>
      </Card>
    </div>
  )
}
