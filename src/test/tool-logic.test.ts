import { describe, it, expect } from 'vitest'

/**
 * Tests for tool logic extracted from page components.
 * Pure function tests – no React rendering required.
 */

/* ─── URL encode/decode ─── */
describe('URL encode/decode', () => {
  it('should encode special characters', () => {
    expect(encodeURIComponent('hello world')).toBe('hello%20world')
    expect(encodeURIComponent('a=b&c=d')).toBe('a%3Db%26c%3Dd')
  })
  it('should decode back to original', () => {
    const input = 'https://example.com/search?q=你好 世界'
    expect(decodeURIComponent(encodeURIComponent(input))).toBe(input)
  })
  it('should handle already-encoded strings', () => {
    expect(decodeURIComponent('hello%20world')).toBe('hello world')
  })
})

/* ─── Color conversion ─── */
describe('HEX ↔ RGB ↔ HSL', () => {
  function hexToRgb(hex: string) {
    const c = hex.replace('#', '')
    if (!/^[0-9A-Fa-f]{6}$/.test(c)) return null
    return { r: parseInt(c.substring(0,2),16), g: parseInt(c.substring(2,4),16), b: parseInt(c.substring(4,6),16) }
  }

  it('should parse valid hex colors', () => {
    expect(hexToRgb('#22d3ee')).toEqual({ r: 34, g: 211, b: 238 })
    expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 })
    expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 })
  })
  it('should reject invalid hex colors', () => {
    expect(hexToRgb('invalid')).toBeNull()
    expect(hexToRgb('#fff')).toBeNull()
    expect(hexToRgb('')).toBeNull()
  })
})

/* ─── Case conversion ─── */
describe('Case conversion', () => {
  function toCamel(s: string) { return s.replace(/[_-](.)/g, (_,c) => c.toUpperCase()).replace(/^./, c => c.toLowerCase()) }
  function toPascal(s: string) { return s.replace(/[_-](.)/g, (_,c) => c.toUpperCase()).replace(/^./, c => c.toUpperCase()) }
  function toSnake(s: string) { return s.replace(/([A-Z])/g, '_$1').replace(/[-\s]+/g, '_').replace(/^_/, '').toLowerCase() }
  function toKebab(s: string) { return s.replace(/([A-Z])/g, '-$1').replace(/[_\s]+/g, '-').replace(/^-/, '').toLowerCase() }
  function toConstant(s: string) { return toSnake(s).toUpperCase() }

  it('should convert to camelCase', () => {
    expect(toCamel('hello_world')).toBe('helloWorld')
    expect(toCamel('hello-world')).toBe('helloWorld')
    expect(toCamel('HelloWorld')).toBe('helloWorld')
  })
  it('should convert to PascalCase', () => {
    expect(toPascal('hello_world')).toBe('HelloWorld')
    expect(toPascal('hello-world')).toBe('HelloWorld')
  })
  it('should convert to snake_case', () => {
    expect(toSnake('helloWorld')).toBe('hello_world')
    expect(toSnake('HelloWorld')).toBe('hello_world')
  })
  it('should convert to kebab-case', () => {
    expect(toKebab('helloWorld')).toBe('hello-world')
    expect(toKebab('hello_world')).toBe('hello-world')
  })
  it('should convert to CONSTANT_CASE', () => {
    expect(toConstant('helloWorld')).toBe('HELLO_WORLD')
  })
})

/* ─── Password strength scoring ─── */
describe('Password strength', () => {
  function scoreStrength(pw: string): number {
    if (!pw) return 0
    let s = 0
    if (/[a-z]/.test(pw)) s++
    if (/[A-Z]/.test(pw)) s++
    if (/[0-9]/.test(pw)) s++
    if (/[^a-zA-Z0-9]/.test(pw)) s++
    if (pw.length >= 12) s++
    return s
  }

  it('should score weak passwords low', () => {
    expect(scoreStrength('abc')).toBe(1)
    expect(scoreStrength('1234')).toBe(1)
  })
  it('should score mixed passwords medium', () => {
    expect(scoreStrength('abcd1234')).toBe(2) // lowercase + digits
    expect(scoreStrength('Abcd1234')).toBe(3) // lowercase + uppercase + digits
  })
  it('should score strong passwords high', () => {
    expect(scoreStrength('Abcdef123!@#')).toBe(5) // all 4 checks + length>=12
  })
  it('should return 0 for empty', () => {
    expect(scoreStrength('')).toBe(0)
  })
})

/* ─── Text statistics ─── */
describe('Text statistics', () => {
  function analyze(text: string) {
    const chars = text.length
    const charsNoSpaces = text.replace(/\s/g, '').length
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const lines = text ? text.split('\n').length : 0
    const cn = (text.match(/[\u4e00-\u9fff]/g) || []).length
    return { chars, charsNoSpaces, words, lines, cn }
  }

  it('should count characters correctly', () => {
    expect(analyze('hello').chars).toBe(5)
    expect(analyze('hello world').charsNoSpaces).toBe(10)
  })
  it('should count words correctly', () => {
    expect(analyze('hello world').words).toBe(2)
    expect(analyze('  ').words).toBe(0)
  })
  it('should count lines correctly', () => {
    expect(analyze('line1\nline2\nline3').lines).toBe(3)
  })
  it('should count Chinese characters', () => {
    expect(analyze('你好世界').cn).toBe(4)
    expect(analyze('Hello你好').cn).toBe(2)
  })
})

/* ─── HTML entity encode/decode ─── */
describe('HTML entity encode/decode', () => {
  function encode(text: string) {
    return text.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!))
  }

  it('should encode HTML special characters', () => {
    expect(encode('<div class="test">')).toBe('&lt;div class=&quot;test&quot;&gt;')
    expect(encode("it's & <b>bold</b>")).toBe('it&#39;s &amp; &lt;b&gt;bold&lt;/b&gt;')
  })
  it('should leave plain text unchanged', () => {
    expect(encode('hello world')).toBe('hello world')
  })
})

/* ─── Unicode escape/unescape ─── */
describe('Unicode escape/unescape', () => {
  function escape(text: string) {
    return text.split('').map(c => '\\u' + c.charCodeAt(0).toString(16).padStart(4,'0')).join('')
  }
  function unescape(text: string) {
    return text.replace(/\\u([0-9a-fA-F]{4})/g, (_,h) => String.fromCharCode(parseInt(h,16)))
  }

  it('should escape Chinese characters', () => {
    expect(escape('你好')).toBe('\\u4f60\\u597d')
  })
  it('should unescape back', () => {
    expect(unescape('\\u4f60\\u597d')).toBe('你好')
  })
  it('should round-trip', () => {
    const input = 'Hello 你好 🌍'
    expect(unescape(escape(input))).toBe(input)
  })
})

/* ─── Data unit conversion ─── */
describe('Data unit conversion', () => {
  const factors: Record<string,number> = {B:1,KB:1024,MB:1048576,GB:1073741824,TB:1099511627776,PB:1125899906842624}

  it('should convert 1 MB to bytes', () => {
    expect(1 * factors.MB).toBe(1048576)
  })
  it('should convert 1 GB to MB', () => {
    expect(factors.GB / factors.MB).toBe(1024)
  })
  it('should maintain round-trip consistency', () => {
    const bytes = 5 * factors.GB
    expect(bytes / factors.GB).toBe(5)
    expect(bytes / factors.MB).toBe(5 * 1024)
  })
})

/* ─── Hex encode/decode ─── */
describe('Hex encode/decode', () => {
  function hexEncode(text: string): string {
    return Array.from(new TextEncoder().encode(text), b => b.toString(16).padStart(2,'0')).join('')
  }
  function hexDecode(hex: string): string {
    return new TextDecoder().decode(new Uint8Array(hex.match(/.{1,2}/g)?.map(b => parseInt(b,16)) || []))
  }

  it('should encode text to hex', () => {
    expect(hexEncode('hello')).toBe('68656c6c6f')
    expect(hexEncode('AB')).toBe('4142')
  })
  it('should decode hex back to text', () => {
    expect(hexDecode('68656c6c6f')).toBe('hello')
  })
  it('should round-trip', () => {
    const input = 'Hello, 世界!'
    expect(hexDecode(hexEncode(input))).toBe(input)
  })
})

/* ─── ROT13 / Caesar cipher ─── */
describe('ROT13 / Caesar cipher', () => {
  function caesar(text: string, shift: number): string {
    return text.replace(/[a-zA-Z]/g, c => {
      const code = c.charCodeAt(0)
      const base = code <= 90 ? 65 : 97
      return String.fromCharCode(((code - base + shift) % 26) + base)
    })
  }

  it('should apply ROT13 correctly', () => {
    expect(caesar('Hello', 13)).toBe('Uryyb')
    expect(caesar('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 13)).toBe('NOPQRSTUVWXYZABCDEFGHIJKLM')
  })
  it('should be self-inverse (ROT13 twice = identity)', () => {
    const input = 'Hello World 123!'
    expect(caesar(caesar(input, 13), 13)).toBe(input)
  })
  it('should leave non-alpha characters unchanged', () => {
    expect(caesar('123!@#', 13)).toBe('123!@#')
  })
  it('should support custom shift values', () => {
    expect(caesar('ABC', 1)).toBe('BCD')
    expect(caesar('XYZ', 3)).toBe('ABC')
  })
})

/* ─── tools.ts registration integrity ─── */
import { toolCategories, allTools, toolRoutes } from '../utils/tools'

describe('Tool registration integrity', () => {

  it('every tool should have a unique id', () => {
    const ids = allTools.map((t: any) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
  it('every tool should have a valid path starting with /tools/', () => {
    for (const tool of allTools) {
      expect(tool.path).toMatch(/^\/tools\//)
    }
  })
  it('toolRoutes should map every tool id to its path', () => {
    for (const tool of allTools) {
      expect(toolRoutes[tool.id]).toBe(tool.path)
    }
  })
  it('every category should have at least one tool', () => {
    for (const cat of toolCategories) {
      expect(cat.tools.length).toBeGreaterThan(0)
    }
  })
})
