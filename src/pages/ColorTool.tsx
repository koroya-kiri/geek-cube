import { useState } from 'react'
import { ToolHeader, Card, Label, Input, CopyBtn } from '../components/ui'

export default function ColorTool() {
  const [hex, setHex] = useState('#22d3ee')
  const [rgb, setRgb] = useState({ r: 34, g: 211, b: 238 })
  const [hsl, setHsl] = useState({ h: 187, s: 85, l: 53 })
  const [copied, setCopied] = useState<string | null>(null)

  const parseHex = (v: string) => { const c = v.replace('#', ''); return /^[0-9A-Fa-f]{6}$/.test(c) ? { r: parseInt(c.substring(0,2),16), g: parseInt(c.substring(2,4),16), b: parseInt(c.substring(4,6),16) } : null }

  const rgbToHsl = (r: number, g: number, b: number) => {
    const nr = r/255, ng = g/255, nb = b/255; const mx = Math.max(nr,ng,nb), mn = Math.min(nr,ng,nb)
    let h=0, s=0, l=(mx+mn)/2; if(mx!==mn){ const d=mx-mn; s=l>.5?d/(2-mx-mn):d/(mx+mn)
      switch(mx){ case nr: h=((ng-nb)/d+(ng<nb?6:0))/6; break; case ng: h=((nb-nr)/d+2)/6; break; case nb: h=((nr-ng)/d+4)/6; break } }
    return { h: Math.round(h*360), s: Math.round(s*100), l: Math.round(l*100) }
  }

  const upHex = (v: string) => { setHex(v); const p = parseHex(v); if(p){ setRgb(p); setHsl(rgbToHsl(p.r,p.g,p.b)) } }
  const upRgb = (k: 'r'|'g'|'b', v: number) => { const n = { ...rgb, [k]: Math.min(255,Math.max(0,v)) }; setRgb(n); setHex('#'+[n.r,n.g,n.b].map(x=>x.toString(16).padStart(2,'0')).join('')); setHsl(rgbToHsl(n.r,n.g,n.b)) }
  const upHsl = (k: 'h'|'s'|'l', v: number) => {
    const clamped = k === 'h' ? v % 360 : Math.min(100, Math.max(0, v))
    const n = { ...hsl, [k]: clamped }; setHsl(n)
    const h=n.h/360, s=n.s/100, l=n.l/100
    if (s === 0) { const v = Math.round(l * 255); setRgb({r:v,g:v,b:v}); setHex('#'+[v,v,v].map(x=>x.toString(16).padStart(2,'0')).join('')); return }
    const a = s * Math.min(l, 1 - l)
    const f = (x: number) => { const k = (x + h * 12) % 12; return Math.round((l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255) }
    const r=f(0), g=f(8), b=f(4)
    setRgb({r,g,b}); setHex('#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('')) }

  const copy = async (t: string, k: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 1500) }

  return (
    <div className="max-w-2xl mx-auto animate-fadeInUp">
      <ToolHeader name="颜色" accent="转换" accentColor="text-neon-magenta" glowClass="text-glow-magenta" desc="HEX、RGB、HSL 互转，实时预览" />

      <Card>
        <div className="w-full h-28 rounded-2xl border border-white/10 shadow-inner transition-colors" style={{ backgroundColor: `rgb(${rgb.r},${rgb.g},${rgb.b})` }} />

        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between"><Label>HEX</Label><CopyBtn copied={copied==='hex'} onCopy={() => copy(hex,'hex')} /></div>
            <Input value={hex} onChange={e => upHex(e.target.value)} className="uppercase" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between"><Label>RGB</Label><CopyBtn copied={copied==='rgb'} onCopy={() => copy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,'rgb')} /></div>
            <div className="grid grid-cols-3 gap-3">
              {(['r','g','b'] as const).map(k => (<div key={k}><span className="text-[10px] text-gray-500 uppercase font-semibold">{k}</span><Input type="number" min={0} max={255} value={rgb[k]} onChange={e => upRgb(k, +e.target.value)} className="mt-1 text-sm px-3 py-2" /></div>))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between"><Label>HSL</Label><CopyBtn copied={copied==='hsl'} onCopy={() => copy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,'hsl')} /></div>
            <div className="grid grid-cols-3 gap-3">
              {(['h','s','l'] as const).map(k => (<div key={k}><span className="text-[10px] text-gray-500 uppercase font-semibold">{k}</span><Input type="number" min={0} max={k==='h'?360:100} value={hsl[k]} onChange={e => upHsl(k, +e.target.value)} className="mt-1 text-sm px-3 py-2" /></div>))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
