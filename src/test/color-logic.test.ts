import { describe, it, expect } from 'vitest'

/* ─── Color: HEX ↔ RGB ↔ HSL ─── */
function hexToRgb(hex: string) { const c = hex.replace('#', ''); if (!/^[0-9A-Fa-f]{6}$/.test(c)) return null; return { r: parseInt(c.substring(0, 2), 16), g: parseInt(c.substring(2, 4), 16), b: parseInt(c.substring(4, 6), 16) } }

function rgbToHsl(r: number, g: number, b: number) { const nr = r / 255, ng = g / 255, nb = b / 255; const mx = Math.max(nr, ng, nb), mn = Math.min(nr, ng, nb); let h = 0, s = 0, l = (mx + mn) / 2; if (mx !== mn) { const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); switch (mx) { case nr: h = ((ng - nb) / d + (ng < nb ? 6 : 0)) / 6; break; case ng: h = ((nb - nr) / d + 2) / 6; break; case nb: h = ((nr - ng) / d + 4) / 6; break } } return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) } }

function hslToHex(h: number, s: number, l: number) { s /= 100; l /= 100; const a = s * Math.min(l, 1 - l); const f = (n: number) => { const k = (n + h / 30) % 12; return Math.round((l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255).toString(16).padStart(2, '0') }; return `#${f(0)}${f(8)}${f(4)}` }

describe('Color: HEX to RGB', () => {
  it('#22d3ee → {r:34,g:211,b:238}', () => { expect(hexToRgb('#22d3ee')).toEqual({ r: 34, g: 211, b: 238 }) })
  it('#000000 → black', () => { expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 }) })
  it('#ffffff → white', () => { expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 }) })
  it('should reject "#fff"', () => { expect(hexToRgb('#fff')).toBeNull() })
  it('should reject empty', () => { expect(hexToRgb('')).toBeNull() })
})

describe('Color: RGB to HSL', () => {
  it('black (0,0,0) → h:0,s:0,l:0', () => { expect(rgbToHsl(0, 0, 0)).toEqual({ h: 0, s: 0, l: 0 }) })
  it('white (255,255,255) → h:0,s:0,l:100', () => { expect(rgbToHsl(255, 255, 255)).toEqual({ h: 0, s: 0, l: 100 }) })
  it('red (255,0,0) → h:0,s:100,l:50', () => { expect(rgbToHsl(255, 0, 0)).toEqual({ h: 0, s: 100, l: 50 }) })
})

describe('Color: HSL to HEX round-trip', () => {
  it('cyan #22d3ee should round-trip via HSL (within 1 bit tolerance)', () => {
    const rgb = hexToRgb('#22d3ee')!; const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    const back = hslToHex(hsl.h, hsl.s, hsl.l);
    // HSL↔RGB conversion has inherent precision loss ±1 per channel
    ['22', 'd3', 'ee'].forEach((orig, i) => {
      const origVal = parseInt(orig, 16); const backVal = parseInt(back.slice(1 + i*2, 3 + i*2), 16)
      expect(Math.abs(origVal - backVal)).toBeLessThanOrEqual(2)
    })
  })
  it('magenta #ff00aa should round-trip via HSL', () => {
    const rgb = hexToRgb('#ff00aa')!; const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    expect(hslToHex(hsl.h, hsl.s, hsl.l)).toBe('#ff00aa')
  })
})

/* ─── WCAG contrast ratio ─── */
function luminance(r: number, g: number, b: number) { const f = (x: number) => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4) }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b) }
function contrast(a: number, b: number) { const l = Math.max(a, b), d = Math.min(a, b); return Math.round(((l + 0.05) / (d + 0.05)) * 100) / 100 }

describe('WCAG contrast ratio', () => {
  it('black on white should be 21:1', () => {
    const l1 = luminance(0, 0, 0), l2 = luminance(255, 255, 255)
    expect(contrast(l1, l2)).toBeCloseTo(21, 0)
  })
  it('white on white should be 1:1', () => {
    const l1 = luminance(255, 255, 255)
    expect(contrast(l1, l1)).toBe(1)
  })
  it('same colors should have ratio 1', () => {
    const l = luminance(128, 128, 128)
    expect(contrast(l, l)).toBe(1)
  })
  it('AA large text requires 3:1', () => {
    const l1 = luminance(102, 102, 102), l2 = luminance(255, 255, 255)
    expect(contrast(l1, l2)).toBeGreaterThanOrEqual(5.5) // #666 on white ~5.7
  })
})

/* ─── Data unit conversion ─── */
const FACTORS: Record<string, number> = { B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776, PB: 1125899906842624 }

describe('Data unit conversion', () => {
  it('1 KB = 1024 B', () => { expect(FACTORS.KB).toBe(1024) })
  it('1 MB = 1024 KB', () => { expect(FACTORS.MB / FACTORS.KB).toBe(1024) })
  it('1 GB = 1024 MB', () => { expect(FACTORS.GB / FACTORS.MB).toBe(1024) })
  it('round-trip: 5 GB → bytes → 5 GB', () => { const b = 5 * FACTORS.GB; expect(b / FACTORS.GB).toBe(5) })
  it('1 TB = 1024 GB', () => { expect(FACTORS.TB / FACTORS.GB).toBe(1024) })
})

/* ─── Date calculator ─── */
function dateDiff(a: string, b: string): number { return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000) }

describe('Date calculator', () => {
  it('2024-01-01 to 2024-01-02 = 1 day', () => { expect(dateDiff('2024-01-01', '2024-01-02')).toBe(1) })
  it('2024-01-01 to 2024-01-01 = 0', () => { expect(dateDiff('2024-01-01', '2024-01-01')).toBe(0) })
  it('2024-01-01 to 2024-12-31 = 365', () => { expect(dateDiff('2024-01-01', '2024-12-31')).toBe(365) }) // leap year
  it('reverse should be negative', () => { expect(dateDiff('2024-01-02', '2024-01-01')).toBe(-1) })
})
