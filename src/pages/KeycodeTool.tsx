import { useState, useEffect } from 'react'
import { Keyboard } from 'lucide-react'
import { ToolHeader, Card, Label } from '../components/ui'

export default function KeycodeTool() {
  const [last, setLast] = useState<{key:string;code:string;keyCode:number;ctrl:boolean;alt:boolean;shift:boolean;meta:boolean}|null>(null)
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      e.preventDefault()
      setLast({key:e.key,code:e.code,keyCode:e.keyCode,ctrl:e.ctrlKey,alt:e.altKey,shift:e.shiftKey,meta:e.metaKey})
      setHistory(p => [`${e.key} (${e.code})`, ...p].slice(0, 20))
    }
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h)
  }, [])

  return (
    <div className="max-w-sm mx-auto animate-fadeInUp">
      <ToolHeader name="键盘" accent="测试" accentColor="text-neon-yellow" glowClass="text-glow-yellow" desc="按下键盘查看 keyCode 和 code 值" />
      <Card>
        <div className="flex items-center justify-center py-6 border-2 border-dashed border-white/10 rounded-2xl">
          <div className="text-center">
            <Keyboard size={40} className="mx-auto text-gray-500 mb-3" />
            <p className="text-sm text-gray-400">按下任意键...</p>
          </div>
        </div>
        {last && (
          <div className="space-y-2">
            {[
              {l:'按键 (key)',v:last.key},{l:'代码 (code)',v:last.code},{l:'键码 (keyCode)',v:String(last.keyCode)},
              {l:'修饰键',v:[last.ctrl&&'Ctrl',last.alt&&'Alt',last.shift&&'Shift',last.meta&&'Meta'].filter(Boolean).join(' + ')||'无'},
            ].map(({l,v}) => <div key={l} className="flex justify-between p-3 rounded-xl bg-cyber-bg-deep border border-white/10"><span className="text-xs text-gray-500">{l}</span><span className="text-sm text-white font-mono">{v}</span></div>)}
          </div>
        )}
        {history.length > 0 && <div className="space-y-1"><Label>历史记录</Label><div className="max-h-40 overflow-y-auto space-y-1">{history.map((h,i) => <div key={i} className="px-3 py-1.5 rounded-lg bg-cyber-bg-deep border border-white/10 text-xs text-gray-400 font-mono">{h}</div>)}</div></div>}
      </Card>
    </div>
  )
}
