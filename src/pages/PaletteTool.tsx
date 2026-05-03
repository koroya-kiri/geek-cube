import { useState } from 'react'
import { RefreshCw, Copy, Pipette } from 'lucide-react'
import { ToolHeader, Card, Button, Chip } from '../components/ui'

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100; l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => { const k = (n + h / 30) % 12; return Math.round((l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255) }
  return [f(0), f(8), f(4)]
}

function hslToHex(h: number, s: number, l: number): string {
  const [r, g, b] = hslToRgb(h, s, l)
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b)
  let h = 0, s = 0, l = (mx + mn) / 2
  if (mx !== mn) {
    const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn)
    switch (mx) { case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break; case g: h = ((b - r) / d + 2) / 6; break; case b: h = ((r - g) / d + 4) / 6; break }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

interface ColorInfo { hex: string; rgb: [number, number, number]; hsl: [number, number, number] }

const SCHEMES = [
  { k: 'complementary', l: '互补色', offsets: [0, 180, 0, 180, 0] },
  { k: 'analogous', l: '类似色', offsets: [0, 30, 60, 90, 120] },
  { k: 'triadic', l: '三角色', offsets: [0, 120, 240, 0, 240] },
  { k: 'tetradic', l: '矩形色', offsets: [0, 60, 180, 240, 0] },
  { k: 'mono', l: '单色系', offsets: [0, 0, 0, 0, 0] },
] as const

function generatePalette(hue: number, schemeIdx: number): { colors: ColorInfo[]; scheme: string } {
  const scheme = SCHEMES[schemeIdx]
  if (scheme.k === 'mono') {
    const s = 55, lBase = [20, 35, 50, 65, 80]
      return { colors: lBase.map(l => ({ hex: hslToHex(hue, s, l), rgb: hslToRgb(hue, s, l), hsl: [hue, s, l] as [number, number, number] })), scheme: scheme.l }
  }
  const colors = scheme.offsets.map((off, i) => {
    const s = 50 + (i * 5) % 30
    const l = 40 + (i * 8) % 30
    const h = ((hue + off) % 360 + 360) % 360
    return { hex: hslToHex(h, s, l), rgb: hslToRgb(h, s, l), hsl: [h, s, l] as [number, number, number] }
  })
  return { colors, scheme: scheme.l }
}

export default function PaletteTool() {
  const [hue, setHue] = useState(Math.floor(Math.random() * 360))
  const [schemeIdx, setSchemeIdx] = useState(0)
  const [{ colors, scheme }, setState] = useState(() => generatePalette(hue, 0))
  const [customHex, setCustomHex] = useState('')
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  const refresh = (newHue: number, newIdx: number) => {
    setHue(newHue); setSchemeIdx(newIdx); setState(generatePalette(newHue, newIdx))
  }

  const pickBaseColor = (hex: string) => {
    const c = hex.replace('#', '')
    if (!/^[0-9A-Fa-f]{6}$/.test(c)) return
    const r = parseInt(c.slice(0, 2), 16), g = parseInt(c.slice(2, 4), 16), b = parseInt(c.slice(4, 6), 16)
    const [h] = rgbToHsl(r, g, b)
    refresh(h, schemeIdx)
  }

  const copyAll = async () => {
    await navigator.clipboard.writeText(colors.map(c => c.hex).join(', '))
  }

  return (
    <div className="max-w-lg mx-auto animate-fadeInUp">
      <ToolHeader name="调色板" accent="生成" accentColor="text-neon-magenta" glowClass="text-glow-magenta" desc={`${scheme}方案 · 色相 ${hue}°`} />

      <Card>
        {/* Color strip preview */}
        <div className="flex rounded-2xl overflow-hidden h-20 border border-white/10">
          {colors.map((c, i) => (
            <div key={i} className="flex-1 transition-all hover:flex-[1.5] cursor-pointer"
              style={{ backgroundColor: c.hex }}
              onClick={async () => { await navigator.clipboard.writeText(c.hex); setCopiedIdx(i); setTimeout(() => setCopiedIdx(null), 1500) }} />
          ))}
        </div>

        {/* Color cards */}
        <div className="flex gap-2">
          {colors.map((c, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
              <button
                className="w-full aspect-square rounded-xl border border-white/10 shadow-lg hover:scale-110 transition-transform cursor-pointer"
                style={{ backgroundColor: c.hex, minHeight: 60 }}
                onClick={async () => { await navigator.clipboard.writeText(c.hex); setCopiedIdx(i); setTimeout(() => setCopiedIdx(null), 1500) }}
              />
              <span className="text-[11px] font-mono text-white">{c.hex.toUpperCase()}</span>
              <span className="text-[9px] text-gray-500 font-mono">RGB({c.rgb.join(',')})</span>
              <span className="text-[9px] text-gray-600 font-mono">HSL({c.hsl[0]}°,{c.hsl[1]}%,{c.hsl[2]}%)</span>
              {copiedIdx === i && <span className="text-[10px] text-neon-cyan">已复制</span>}
            </div>
          ))}
        </div>

        {/* Scheme selectors */}
        <div className="flex flex-wrap gap-2">
          {SCHEMES.map((s, i) => (
            <Chip key={s.k} active={schemeIdx === i} onClick={() => refresh(hue, i)}>{s.l}</Chip>
          ))}
        </div>

        {/* Hue slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500"><span>色相 {hue}°</span></div>
          <div className="relative h-6 rounded-full cursor-pointer"
            style={{ background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)' }}
            onClick={e => {
              const rect = e.currentTarget.getBoundingClientRect()
              const pct = (e.clientX - rect.left) / rect.width
              refresh(Math.round(pct * 360), schemeIdx)
            }}>
            <div className="absolute top-0 w-3 h-6 rounded-full border-2 border-white shadow-md transition-left"
              style={{ left: `calc(${(hue / 360) * 100}% - 6px)` }} />
          </div>
        </div>

        {/* Base color picker + refresh */}
        <div className="flex gap-2">
          <div className="flex items-center gap-2 flex-1">
            <input type="color" value={colors[0].hex} onChange={e => pickBaseColor(e.target.value)}
              className="w-9 h-9 rounded-lg cursor-pointer border-0 bg-transparent" />
            <input
              value={customHex} onChange={e => setCustomHex(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { pickBaseColor(customHex); setCustomHex('') } }}
              placeholder="自定义基色 #hex"
              className="flex-1 px-3 py-2 rounded-lg bg-cyber-bg-deep border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-neon-magenta/60"
              style={{ caretColor: '#ff00aa' }}
            />
            <button onClick={() => { pickBaseColor(customHex); setCustomHex('') }} disabled={!customHex.trim()}
              className="px-3 py-2 rounded-lg bg-neon-magenta/10 border border-neon-magenta/20 text-neon-magenta text-xs font-medium hover:bg-neon-magenta/20 disabled:opacity-30 transition-colors">
              <Pipette size={14} />
            </button>
          </div>
          <Button onClick={() => refresh(Math.floor(Math.random() * 360), schemeIdx)} variant="secondary" className="text-xs">
            <RefreshCw size={14} />随机
          </Button>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
          <span className="text-[10px] text-gray-500">{colors.length} 色 · {scheme}方案 · 色相{hue}°</span>
          <button onClick={copyAll} className="text-[10px] text-gray-500 hover:text-neon-cyan transition-colors flex items-center gap-1">
            <Copy size={10} />复制全部
          </button>
        </div>
      </Card>
    </div>
  )
}
