import { describe, it, expect } from 'vitest'

/* ─── Page range parser (shared by PDF split/rotate/remove) ─── */
function parsePages(input: string, total: number): number[] {
  const s = new Set<number>()
  for (const p of input.split(',')) {
    const t = p.trim(); if (!t) continue
    if (t.includes('-')) { const [a, b] = t.split('-').map(Number); if (isNaN(a) || isNaN(b) || a < 1 || b > total || a > b) throw new Error(`无效范围: ${t}`); for (let i = a; i <= b; i++) s.add(i - 1) }
    else { const n = +t; if (isNaN(n) || n < 1 || n > total) throw new Error(`无效页码: ${t}`); s.add(n - 1) }
  }
  if (!s.size) throw new Error('请输入页码范围')
  return [...s].sort((a, b) => a - b)
}

describe('Page range parser', () => {
  it('should parse single page', () => { expect(parsePages('3', 10)).toEqual([2]) })
  it('should parse continuous range', () => { expect(parsePages('1-3', 10)).toEqual([0, 1, 2]) })
  it('should parse comma-separated', () => { expect(parsePages('1,3,5', 10)).toEqual([0, 2, 4]) })
  it('should parse mixed', () => { expect(parsePages('1-3,5,7-8', 10)).toEqual([0, 1, 2, 4, 6, 7]) })
  it('should reject page 0', () => { expect(() => parsePages('0', 10)).toThrow() })
  it('should reject page > total', () => { expect(() => parsePages('11', 10)).toThrow() })
  it('should reject reversed range', () => { expect(() => parsePages('5-3', 10)).toThrow() })
  it('should reject empty input', () => { expect(() => parsePages('', 10)).toThrow() })
  it('should handle whitespace', () => { expect(parsePages(' 1 , 3-5 ', 10)).toEqual([0, 2, 3, 4]) })
  it('should sort output', () => { expect(parsePages('5,1,3', 10)).toEqual([0, 2, 4]) })
})

/* ─── File size formatter ─── */
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

describe('File size formatter', () => {
  it('100 → 100 B', () => { expect(formatSize(100)).toBe('100 B') })
  it('1024 → 1.0 KB', () => { expect(formatSize(1024)).toBe('1.0 KB') })
  it('1536 → 1.5 KB', () => { expect(formatSize(1536)).toBe('1.5 KB') })
  it('1048576 → 1.0 MB', () => { expect(formatSize(1048576)).toBe('1.0 MB') })
  it('0 → 0 B', () => { expect(formatSize(0)).toBe('0 B') })
})

/* ─── JSON Schema generator ─── */
function generateSchema(obj: unknown): Record<string, unknown> {
  if (obj === null) return { type: 'null' }
  if (Array.isArray(obj)) return { type: 'array', items: obj.length ? generateSchema(obj[0]) : {} }
  if (typeof obj === 'object') { const props: Record<string, unknown> = {}; const required: string[] = []; for (const [k, v] of Object.entries(obj as Record<string, unknown>)) { props[k] = generateSchema(v); required.push(k) }; return { type: 'object', properties: props, required } }
  return { type: typeof obj }
}

describe('JSON Schema generator', () => {
  it('should generate schema for flat object', () => {
    const s = generateSchema({ name: 'test', age: 25 })
    expect(s).toMatchObject({ type: 'object', required: ['name', 'age'] })
    expect((s as any).properties.name).toEqual({ type: 'string' })
    expect((s as any).properties.age).toEqual({ type: 'number' })
  })
  it('should handle nested objects', () => {
    const s = generateSchema({ user: { name: 'x' } })
    expect((s as any).properties.user.type).toBe('object')
  })
  it('should handle arrays', () => {
    const s = generateSchema({ tags: ['a', 'b'] })
    expect((s as any).properties.tags.type).toBe('array')
  })
  it('should handle null', () => {
    const s = generateSchema({ v: null })
    expect((s as any).properties.v).toEqual({ type: 'null' })
  })
  it('should handle boolean', () => {
    const s = generateSchema({ active: true })
    expect((s as any).properties.active).toEqual({ type: 'boolean' })
  })
})

/* ─── JSON to TS type inference ─── */
function inferType(value: unknown): string {
  if (value === null) return 'null'
  if (Array.isArray(value)) { if (value.length === 0) return 'unknown[]'; const types = [...new Set(value.map(v => inferType(v)))]; return types.length === 1 ? `${types[0]}[]` : `(${types.join(' | ')})[]` }
  const t = typeof value
  if (t === 'string') return 'string'
  if (t === 'number') return 'number'
  if (t === 'boolean') return 'boolean'
  if (t === 'object') return 'Record<string, unknown>'
  return 'unknown'
}

describe('JSON to TS type inference', () => {
  it('string → string', () => { expect(inferType('hello')).toBe('string') })
  it('number → number', () => { expect(inferType(42)).toBe('number') })
  it('boolean → boolean', () => { expect(inferType(true)).toBe('boolean') })
  it('null → null', () => { expect(inferType(null)).toBe('null') })
  it('string array → string[]', () => { expect(inferType(['a', 'b'])).toBe('string[]') })
  it('mixed array → (string | number)[]', () => { expect(inferType(['a', 1])).toBe('(string | number)[]') })
  it('empty array → unknown[]', () => { expect(inferType([])).toBe('unknown[]') })
  it('object → Record', () => { expect(inferType({})).toBe('Record<string, unknown>') })
})
