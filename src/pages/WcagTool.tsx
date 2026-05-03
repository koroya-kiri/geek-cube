import { useState } from 'react'
import { ToolHeader, Card, Input, Label } from '../components/ui'

function hexToRgb(h: string) { const c = h.replace('#',''); if(!/^[0-9A-Fa-f]{6}$/.test(c)) return null; return {r:parseInt(c.substring(0,2),16),g:parseInt(c.substring(2,4),16),b:parseInt(c.substring(4,6),16)} }
function luminance(r:number,g:number,b:number) { const f=(x:number)=>{x/=255;return x<=0.03928?x/12.92:Math.pow((x+0.055)/1.055,2.4)}; return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b) }
function contrast(a:number,b:number) { const l=Math.max(a,b),d=Math.min(a,b); return (l+0.05)/(d+0.05) }

export default function WcagTool() {
  const [fg, setFg] = useState('#ffffff')
  const [bg, setBg] = useState('#0a0a0f')
  const [ratio, setRatio] = useState<number|null>(null)

  const calc = () => {
    const f = hexToRgb(fg), b = hexToRgb(bg); if(!f||!b) return
    const r = contrast(luminance(f.r,f.g,f.b), luminance(b.r,b.g,b.b)); setRatio(Math.round(r*100)/100)
  }

  return (
    <div className="max-w-sm mx-auto animate-fadeInUp">
      <ToolHeader name="WCAG" accent="对比度" accentColor="text-neon-magenta" desc="WCAG 2.1 颜色对比度检测" />
      <Card>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label>前景色</Label><div className="flex gap-2"><input type="color" value={fg} onChange={e=>{setFg(e.target.value);calc()}} className="w-10 h-10 rounded-lg cursor-pointer" /><Input value={fg} onChange={e=>{setFg(e.target.value);calc()}} className="font-mono" /></div></div>
          <div className="space-y-2"><Label>背景色</Label><div className="flex gap-2"><input type="color" value={bg} onChange={e=>{setBg(e.target.value);calc()}} className="w-10 h-10 rounded-lg cursor-pointer" /><Input value={bg} onChange={e=>{setBg(e.target.value);calc()}} className="font-mono" /></div></div>
        </div>
        <div className="p-6 rounded-xl text-center" style={{backgroundColor:bg,color:fg}}>
          <p className="text-lg font-bold">示例文本 Aa</p>
          <p className="text-sm mt-1">前景 {fg} / 背景 {bg}</p>
        </div>
        {ratio !== null && (
          <div className="space-y-2">
            <div className="text-center"><span className="text-3xl font-bold text-neon-cyan">{ratio}</span><span className="text-sm text-gray-500 ml-1">:1</span></div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {[
                {l:'AA 正文',ok:ratio>=4.5},{l:'AA 大文本',ok:ratio>=3},{l:'AAA 正文',ok:ratio>=7},
              ].map(({l,ok})=><div key={l} className={`p-2 rounded-lg ${ok?'bg-neon-green/10 text-neon-green border border-neon-green/20':'bg-red-500/10 text-red-400 border border-red-500/20'}`}>{ok?'✓':'✗'} {l}</div>)}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
