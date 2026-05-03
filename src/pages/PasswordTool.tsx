import { useState } from 'react'
import { RefreshCcw, Lock } from 'lucide-react'
import { ToolHeader, Card, Button, Label, CopyBtn } from '../components/ui'

export default function PasswordTool() {
  const [len, setLen] = useState(16)
  const [upper, setUpper] = useState(true); const [lower, setLower] = useState(true)
  const [nums, setNums] = useState(true); const [syms, setSyms] = useState(true)
  const [pw, setPw] = useState(''); const [copied, setCopied] = useState(false)

  const gen = () => {
    let ch = ''
    if (upper) ch += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (lower) ch += 'abcdefghijklmnopqrstuvwxyz'
    if (nums) ch += '0123456789'
    if (syms) ch += '!@#$%^&*()_+-=[]{}|;:,.<>?'
    if (!ch) ch = 'abcdefghijklmnopqrstuvwxyz'
    setPw(Array.from({length:len}, () => ch[Math.floor(Math.random()*ch.length)]).join(''))
  }

  const strength = (() => { if(!pw) return 0; let s=0; if(/[a-z]/.test(pw))s++; if(/[A-Z]/.test(pw))s++; if(/[0-9]/.test(pw))s++; if(/[^a-zA-Z0-9]/.test(pw))s++; if(pw.length>=12)s++; return s })()
  const sl = ['极弱','弱','一般','强','极强'][strength]||''
  const sc = ['bg-red-500','bg-orange-500','bg-amber-500','bg-teal-400','bg-neon-cyan'][strength]||'bg-white/15'

  return (
    <div className="max-w-xl mx-auto animate-fadeInUp">
      <ToolHeader name="密码" accent="生成器" accentColor="text-neon-red" glowClass="text-glow-magenta" desc="生成高强度随机密码，支持自定义字符集" />

      <Card>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-cyber-bg-deep border border-white/10">
          <Lock size={16} className="text-neon-cyan shrink-0" />
          <input type="text" readOnly value={pw} placeholder="点击生成按钮..." className="flex-1 bg-transparent text-white text-sm font-mono focus:outline-none" style={{caretColor:'transparent'}} />
          <CopyBtn copied={copied} onCopy={async () => { if(!pw) return; await navigator.clipboard.writeText(pw); setCopied(true); setTimeout(() => setCopied(false), 1500) }} />
        </div>

        {pw && <div className="space-y-1.5"><div className="flex justify-between text-xs"><span className="text-gray-500">强度</span><span className="text-white font-medium">{sl}</span></div><div className="h-1.5 rounded-full bg-white/10"><div className={`h-full rounded-full transition-all duration-500 ${sc}`} style={{width:`${(strength/5)*100}%`}} /></div></div>}

        <div className="space-y-2">
          <div className="flex justify-between"><Label>长度</Label><span className="text-xs font-mono text-neon-cyan">{len}</span></div>
          <input type="range" min={4} max={64} value={len} onChange={e => setLen(+e.target.value)} className="w-full accent-neon-cyan" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[{l:'大写字母 A-Z',v:upper,s:setUpper},{l:'小写字母 a-z',v:lower,s:setLower},{l:'数字 0-9',v:nums,s:setNums},{l:'特殊符号',v:syms,s:setSyms}].map(i => (
            <label key={i.l} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-cyber-bg-deep border border-white/10 cursor-pointer hover:border-white/20 transition-colors">
              <input type="checkbox" checked={i.v} onChange={e => i.s(e.target.checked)} className="rounded accent-neon-cyan" />
              <span className="text-sm text-gray-400">{i.l}</span>
            </label>
          ))}
        </div>

        <Button onClick={gen} className="w-full"><RefreshCcw size={16} />生成密码</Button>
      </Card>
    </div>
  )
}
