import { describe, it, expect } from 'vitest'

/* ─── Base32 RFC 4648 ─── */
const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
const B32_MAP: Record<string, number> = {}
for (let i = 0; i < B32.length; i++) B32_MAP[B32[i]] = i
for (let i = 0; i < B32.length; i++) B32_MAP[B32[i].toLowerCase()] = i

function base32Encode(input: string): string {
  const bytes = new TextEncoder().encode(input)
  let bits = 0, value = 0, result = ''
  for (let i = 0; i < bytes.length; i++) { value = (value << 8) | bytes[i]; bits += 8; while (bits >= 5) { result += B32[(value >>> (bits - 5)) & 31]; bits -= 5 } }
  if (bits > 0) result += B32[(value << (5 - bits)) & 31]
  return result
}

function base32Decode(input: string): string {
  const clean = input.replace(/[=]/g, '').replace(/[^A-Za-z2-7]/g, '')
  let bits = 0, value = 0; const bytes: number[] = []
  for (let i = 0; i < clean.length; i++) { const v = B32_MAP[clean[i]]; if (v === undefined) continue; value = (value << 5) | v; bits += 5; if (bits >= 8) { bytes.push((value >>> (bits - 8)) & 255); bits -= 8 } }
  return new TextDecoder().decode(new Uint8Array(bytes))
}

describe('Base32 encode/decode', () => {
  it('should encode simple text', () => { expect(base32Encode('hello')).toBe('NBSWY3DP') })
  it('should decode back to original', () => { expect(base32Decode('NBSWY3DP')).toBe('hello') })
  it('should round-trip Unicode', () => { const input = 'Hello 你好'; expect(base32Decode(base32Encode(input))).toBe(input) })
  it('should handle empty string', () => { expect(base32Decode(base32Encode(''))).toBe('') })
  it('should handle uppercase input', () => { expect(base32Decode('NBSWY3DP')).toBe('hello') })
  it('should ignore padding characters', () => { expect(base32Decode('NBSWY3DP====')).toBe('hello') })
})

/* ─── Base58 Bitcoin ─── */
const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

function base58Encode(input: string): string {
  if (!input) return ''
  const bytes = new TextEncoder().encode(input)
  let zeros = 0; while (zeros < bytes.length && bytes[zeros] === 0) zeros++
  const digits = [0]
  for (let i = 0; i < bytes.length; i++) { let carry = bytes[i]; for (let j = 0; j < digits.length; j++) { carry += digits[j] * 256; digits[j] = carry % 58; carry = Math.floor(carry / 58) } while (carry > 0) { digits.push(carry % 58); carry = Math.floor(carry / 58) } }
  return B58[0].repeat(zeros) + digits.reverse().map(d => B58[d]).join('')
}

function base58Decode(input: string): string {
  if (!input) return ''
  const clean = input.replace(/[^1-9A-HJ-NP-Za-km-z]/g, '')
  let zeros = 0; while (zeros < clean.length && clean[zeros] === '1') zeros++
  const bytes = [0]
  for (let i = 0; i < clean.length; i++) { const d = B58.indexOf(clean[i]); if (d < 0) continue; let carry = d; for (let j = 0; j < bytes.length; j++) { carry += bytes[j] * 58; bytes[j] = carry & 255; carry = Math.floor(carry / 256) } while (carry > 0) { bytes.push(carry & 255); carry = Math.floor(carry / 256) } }
  return new TextDecoder().decode(new Uint8Array(new Array(zeros).fill(0).concat(bytes.reverse())))
}

describe('Base58 encode/decode', () => {
  it('should encode simple text', () => { expect(base58Encode('hello')).toBe('Cn8eVZg') })
  it('should decode back to original', () => { expect(base58Decode('Cn8eVZg')).toBe('hello') })
  it('should round-trip', () => { const input = 'Hello World!'; expect(base58Decode(base58Encode(input))).toBe(input) })
  it('should handle empty', () => { expect(base58Encode('')).toBe(''); expect(base58Decode(base58Encode('helloworld'))).toBe('helloworld') })
  it('should not contain ambiguous chars', () => { for (let i = 0; i < 100; i++) { const e = base58Encode(String(i)); expect(e).not.toMatch(/[0OIl]/) } })
})

/* ─── JWT decoding ─── */
function decodeJWT(token: string) {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('Invalid')
  return { header: JSON.parse(atob(parts[0])), payload: JSON.parse(atob(parts[1])) }
}

describe('JWT decoder', () => {
  const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  it('should decode header', () => { const r = decodeJWT(jwt); expect(r.header).toEqual({ alg: 'HS256', typ: 'JWT' }) })
  it('should decode payload', () => { const r = decodeJWT(jwt); expect(r.payload).toMatchObject({ sub: '1234567890', name: 'John Doe' }) })
  it('should reject malformed tokens', () => { expect(() => decodeJWT('abc')).toThrow() })
  it('should reject empty', () => { expect(() => decodeJWT('')).toThrow() })
})

/* ─── HTML entity encode/decode ─── */
function htmlEncode(text: string) { return text.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!)) }
function htmlDecode(text: string) { const t = document.createElement('textarea'); t.innerHTML = text; return t.value }

describe('HTML entity encode/decode', () => {
  it('should encode <>&"\'', () => { expect(htmlEncode('<div class="x">&</div>')).toBe('&lt;div class=&quot;x&quot;&gt;&amp;&lt;/div&gt;') })
  it('should decode entities', () => { expect(htmlDecode('&lt;div&gt;Hello&lt;/div&gt;')).toBe('<div>Hello</div>') })
  it('should leave plain text unchanged', () => { expect(htmlEncode('hello')).toBe('hello') })
  it('should handle round-trip', () => { const input = '<p>Hello & "World"</p>'; expect(htmlDecode(htmlEncode(input))).toBe(input) })
})

/* ─── Unicode escape/unescape ─── */
function unicodeEscape(text: string) { return text.split('').map(c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')).join('') }
function unicodeUnescape(text: string) { return text.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16))) }

describe('Unicode escape/unescape', () => {
  it('should escape Chinese', () => { expect(unicodeEscape('你好')).toBe('\\u4f60\\u597d') })
  it('should unescape', () => { expect(unicodeUnescape('\\u4f60\\u597d')).toBe('你好') })
  it('should round-trip ASCII', () => { const input = 'Hello World'; expect(unicodeUnescape(unicodeEscape(input))).toBe(input) })
  it('should round-trip emoji', () => { const input = '🌍'; expect(unicodeUnescape(unicodeEscape(input))).toBe(input) })
  it('should handle mixed content', () => { expect(unicodeEscape('A你好')).toBe('\\u0041\\u4f60\\u597d') })
})
