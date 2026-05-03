import { describe, it, expect } from 'vitest'

/* ─── CSV line parsing state machine ─── */
function parseCsvLine(line: string): string[] {
  const fields: string[] = []; let field = ''; let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"') { if (i + 1 < line.length && line[i + 1] === '"') { field += '"'; i++ } else { inQuotes = false } }
      else { field += ch }
    } else {
      if (ch === '"') { inQuotes = true } else if (ch === ',') { fields.push(field.trim()); field = '' } else { field += ch }
    }
  }
  fields.push(field.trim())
  return fields
}

describe('CSV line parser', () => {
  it('should parse simple CSV', () => { expect(parseCsvLine('a,b,c')).toEqual(['a', 'b', 'c']) })
  it('should handle quoted fields', () => { expect(parseCsvLine('"hello,world",b')).toEqual(['hello,world', 'b']) })
  it('should handle escaped quotes', () => { expect(parseCsvLine('"say ""hi""",b')).toEqual(['say "hi"', 'b']) })
  it('should handle empty fields', () => { expect(parseCsvLine('a,,c')).toEqual(['a', '', 'c']) })
  it('should handle whitespace', () => { expect(parseCsvLine(' a , b , c ')).toEqual(['a', 'b', 'c']) })
  it('should handle single field', () => { expect(parseCsvLine('hello')).toEqual(['hello']) })
})

/* ─── LCS-based text diff ─── */
type DiffOp = { type: 'equal' | 'insert' | 'delete'; text: string }

function computeDiff(a: string[], b: string[]): DiffOp[] {
  const m = a.length, n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) { if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1; else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]) }
  const ops: DiffOp[] = []; let i = m, j = n
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) { ops.unshift({ type: 'equal', text: a[i - 1] }); i--; j-- }
    else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) { ops.unshift({ type: 'insert', text: b[j - 1] }); j-- }
    else { ops.unshift({ type: 'delete', text: a[i - 1] }); i-- }
  }
  return ops
}

describe('LCS text diff', () => {
  it('should find no diff for identical texts', () => {
    const diff = computeDiff(['a', 'b', 'c'], ['a', 'b', 'c'])
    expect(diff.every(d => d.type === 'equal')).toBe(true)
  })
  it('should detect insertion', () => {
    const diff = computeDiff(['a', 'c'], ['a', 'b', 'c'])
    expect(diff.find(d => d.type === 'insert' && d.text === 'b')).toBeTruthy()
  })
  it('should detect deletion', () => {
    const diff = computeDiff(['a', 'b', 'c'], ['a', 'c'])
    expect(diff.find(d => d.type === 'delete' && d.text === 'b')).toBeTruthy()
  })
  it('should handle empty arrays', () => {
    const diff = computeDiff([], ['new'])
    expect(diff).toHaveLength(1); expect(diff[0].type).toBe('insert')
  })
  it('should handle complete replacement', () => {
    const diff = computeDiff(['old'], ['new'])
    expect(diff.find(d => d.type === 'delete')).toBeTruthy()
    expect(diff.find(d => d.type === 'insert')).toBeTruthy()
  })
})

/* ─── Case conversion ─── */
function toCamel(s: string) { return s.replace(/[_-](.)/g, (_, c) => c.toUpperCase()).replace(/^./, c => c.toLowerCase()) }
function toSnake(s: string) { return s.replace(/([A-Z])/g, '_$1').replace(/[-\s]+/g, '_').replace(/^_/, '').toLowerCase() }
function toKebab(s: string) { return s.replace(/([A-Z])/g, '-$1').replace(/[_\s]+/g, '-').replace(/^-/, '').toLowerCase() }
function toConstant(s: string) { return toSnake(s).toUpperCase() }

describe('Case conversion', () => {
  describe('toCamelCase', () => {
    it('snake_case → camelCase', () => { expect(toCamel('hello_world')).toBe('helloWorld') })
    it('kebab-case → camelCase', () => { expect(toCamel('hello-world')).toBe('helloWorld') })
    it('PascalCase → camelCase', () => { expect(toCamel('HelloWorld')).toBe('helloWorld') })
  })
  describe('toSnakeCase', () => {
    it('camelCase → snake_case', () => { expect(toSnake('helloWorld')).toBe('hello_world') })
    it('kebab-case → snake_case', () => { expect(toSnake('hello-world')).toBe('hello_world') })
  })
  describe('toKebabCase', () => {
    it('camelCase → kebab-case', () => { expect(toKebab('helloWorld')).toBe('hello-world') })
    it('snake_case → kebab-case', () => { expect(toKebab('hello_world')).toBe('hello-world') })
  })
  describe('toConstantCase', () => {
    it('camelCase → CONSTANT_CASE', () => { expect(toConstant('helloWorld')).toBe('HELLO_WORLD') })
  })
})

/* ─── Text statistics ─── */
function analyze(text: string) {
  const chars = text.length; const charsNoSpaces = text.replace(/\s/g, '').length
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const lines = text ? text.split('\n').length : 0
  const cn = (text.match(/[\u4e00-\u9fff]/g) || []).length
  return { chars, charsNoSpaces, words, lines, cn }
}

describe('Text statistics', () => {
  it('hello → 5 chars, 1 word', () => { const s = analyze('hello'); expect(s.chars).toBe(5); expect(s.words).toBe(1) })
  it('hello world → 11 chars, 2 words', () => { const s = analyze('hello world'); expect(s.chars).toBe(11); expect(s.words).toBe(2) })
  it('multiline → correct line count', () => { expect(analyze('a\nb\nc').lines).toBe(3) })
  it('Chinese detection', () => { expect(analyze('你好世界ABC').cn).toBe(4) })
  it('empty → all zeros', () => { const s = analyze(''); expect(s.chars).toBe(0); expect(s.words).toBe(0) })
})

/* ─── Find & Replace ─── */
function findReplace(text: string, find: string, replace: string, useRegex: boolean, caseSensitive: boolean): string {
  if (!find.trim()) return text
  if (useRegex) { const flags = caseSensitive ? 'g' : 'gi'; return text.replace(new RegExp(find, flags), replace) }
  const flags = caseSensitive ? 'g' : 'gi'; return text.replace(new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags), replace)
}

describe('Find & Replace', () => {
  it('should replace all occurrences', () => { expect(findReplace('hello hello', 'hello', 'hi', false, false)).toBe('hi hi') })
  it('should be case-insensitive by default', () => { expect(findReplace('Hello hello', 'hello', 'hi', false, false)).toBe('hi hi') })
  it('should be case-sensitive when enabled', () => { expect(findReplace('Hello hello', 'hello', 'hi', false, true)).toBe('Hello hi') })
  it('should support regex mode', () => { expect(findReplace('abc123', '\\d+', 'NUM', true, false)).toBe('abcNUM') })
  it('should handle special regex chars in non-regex mode', () => { expect(findReplace('a.b', '.', '-', false, false)).toBe('a-b') })
})
