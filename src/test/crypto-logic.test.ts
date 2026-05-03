import { describe, it, expect } from 'vitest'
import CryptoJS from 'crypto-js'

/* ─── MD5 via crypto-js ─── */
describe('MD5 hash', () => {
  it('should hash "hello" correctly', () => { expect(CryptoJS.MD5('hello').toString()).toBe('5d41402abc4b2a76b9719d911017c592') })
  it('should hash empty string', () => { expect(CryptoJS.MD5('').toString()).toBe('d41d8cd98f00b204e9800998ecf8427e') })
  it('should hash Chinese text', () => { expect(CryptoJS.MD5('你好').toString()).toBe('7eca689f0d3389d9dea66ae112e5cfd7') })
  it('should produce consistent output', () => { expect(CryptoJS.MD5('test').toString()).toBe(CryptoJS.MD5('test').toString()) })
  it('should produce 32-char hex string', () => { expect(CryptoJS.MD5('abc').toString()).toHaveLength(32) })
  it('should differ for different inputs', () => { expect(CryptoJS.MD5('a').toString()).not.toBe(CryptoJS.MD5('b').toString()) })
})

/* ─── CRC32 ─── */
const CRC_TABLE: number[] = (() => { const t: number[] = []; for (let i = 0; i < 256; i++) { let c = i; for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1); t.push(c) } return t })()

function crc32(input: string): string { let crc = 0xFFFFFFFF; for (let i = 0; i < input.length; i++) { crc = CRC_TABLE[(crc ^ input.charCodeAt(i)) & 255] ^ (crc >>> 8) } return ((crc ^ 0xFFFFFFFF) >>> 0).toString(16).padStart(8, '0') }

describe('CRC32 checksum', () => {
  it('should compute known value for "hello"', () => { expect(crc32('hello')).toBe('3610a686') })
  it('should compute known value for empty', () => { expect(crc32('')).toBe('00000000') })
  it('should be 8 hex chars', () => { expect(crc32('test')).toHaveLength(8) })
  it('should produce different results for different inputs', () => { expect(crc32('a')).not.toBe(crc32('b')) })
  it('should be deterministic', () => { expect(crc32('abc')).toBe(crc32('abc')) })
})

/* ─── Password strength scoring ─── */
function scoreStrength(pw: string): number {
  if (!pw) return 0; let s = 0
  if (/[a-z]/.test(pw)) s++; if (/[A-Z]/.test(pw)) s++; if (/[0-9]/.test(pw)) s++; if (/[^a-zA-Z0-9]/.test(pw)) s++; if (pw.length >= 12) s++
  return s
}

describe('Password strength scoring', () => {
  it('should score empty as 0', () => { expect(scoreStrength('')).toBe(0) })
  it('should score lowercase only as 1', () => { expect(scoreStrength('abcdef')).toBe(1) })
  it('should score lowercase+digits as 2', () => { expect(scoreStrength('abc123')).toBe(2) })
  it('should score strong password (lower+upper+digits+special+length) as 5', () => {
    expect(scoreStrength('AbC123!@#$%^XYZ')).toBe(5)
  })
  it('should detect special chars', () => { expect(scoreStrength('aB1!')).toBe(4) })
  it('should add point for length >=12', () => { expect(scoreStrength('abcd1234!@#$')).toBe(4); expect(scoreStrength('Abcdef123!@#')).toBe(5) })
})

/* ─── Hex encode/decode ─── */
function hexEncode(text: string): string { return Array.from(new TextEncoder().encode(text), b => b.toString(16).padStart(2, '0')).join('') }
function hexDecode(hex: string): string { return new TextDecoder().decode(new Uint8Array(hex.match(/.{1,2}/g)?.map(b => parseInt(b, 16)) || [])) }

describe('Hex encode/decode', () => {
  it('should encode "hello" to hex', () => { expect(hexEncode('hello')).toBe('68656c6c6f') })
  it('should decode hex to "hello"', () => { expect(hexDecode('68656c6c6f')).toBe('hello') })
  it('should round-trip Unicode', () => { const input = 'Hello 世界!'; expect(hexDecode(hexEncode(input))).toBe(input) })
  it('should encode single char', () => { expect(hexEncode('A')).toBe('41') })
})

/* ─── ROT13 / Caesar cipher ─── */
function caesar(text: string, shift: number): string {
  return text.replace(/[a-zA-Z]/g, c => { const code = c.charCodeAt(0); const base = code <= 90 ? 65 : 97; return String.fromCharCode(((code - base + shift) % 26) + base) })
}

describe('ROT13 / Caesar cipher', () => {
  it('ROT13 of "Hello" should be "Uryyb"', () => { expect(caesar('Hello', 13)).toBe('Uryyb') })
  it('ROT13 twice should return original', () => { const input = 'Hello World 123!'; expect(caesar(caesar(input, 13), 13)).toBe(input) })
  it('should leave non-alpha chars unchanged', () => { expect(caesar('123!@#', 13)).toBe('123!@#') })
  it('ROT1 of ABC should be BCD', () => { expect(caesar('ABC', 1)).toBe('BCD') })
  it('ROT3 of XYZ should be ABC', () => { expect(caesar('XYZ', 3)).toBe('ABC') })
  it('should handle mix case', () => { expect(caesar('AbC', 1)).toBe('BcD') })
})
