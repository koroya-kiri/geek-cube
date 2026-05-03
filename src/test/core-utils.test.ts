import { describe, it, expect } from 'vitest'

/**
 * Tests for core encoding/decoding logic
 */

describe('Base64 encode/decode', () => {
  const encode = (text: string): string => {
    const bytes = new TextEncoder().encode(text)
    const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join('')
    return btoa(binString)
  }

  const decode = (base64: string): string => {
    const binString = atob(base64)
    const bytes = Uint8Array.from(binString, (c) => c.codePointAt(0)!)
    return new TextDecoder().decode(bytes)
  }

  it('should encode plain ASCII text', () => {
    expect(encode('hello')).toBe('aGVsbG8=')
    expect(encode('Hello World')).toBe('SGVsbG8gV29ybGQ=')
  })

  it('should decode Base64 back to original text', () => {
    expect(decode('aGVsbG8=')).toBe('hello')
    expect(decode('SGVsbG8gV29ybGQ=')).toBe('Hello World')
  })

  it('should handle Unicode characters (Chinese)', () => {
    const input = '你好，世界'
    const encoded = encode(input)
    expect(decode(encoded)).toBe(input)
  })

  it('should handle emoji', () => {
    const input = 'Hello 👋 World 🌍'
    const encoded = encode(input)
    expect(decode(encoded)).toBe(input)
  })

  it('should handle round-trip for empty string', () => {
    expect(decode(encode(''))).toBe('')
  })

  it('should handle special characters', () => {
    const input = '!@#$%^&*()_+-=[]{}|;:\'",./<>?'
    const encoded = encode(input)
    expect(decode(encoded)).toBe(input)
  })

  it('should throw on invalid Base64 input', () => {
    expect(() => atob('!!!invalid!!!')).toThrow()
  })
})

describe('Hash computation (SHA-256)', () => {
  const sha256 = async (text: string): Promise<string> => {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  }

  it('should produce consistent hash for same input', async () => {
    const h1 = await sha256('hello')
    const h2 = await sha256('hello')
    expect(h1).toBe(h2)
  })

  it('should produce different hash for different input', async () => {
    const h1 = await sha256('hello')
    const h2 = await sha256('world')
    expect(h1).not.toBe(h2)
  })

  it('should produce 64-char hex string (256 bits)', async () => {
    const hash = await sha256('test')
    expect(hash).toHaveLength(64)
    expect(/^[0-9a-f]+$/.test(hash)).toBe(true)
  })

  it('should produce known hash for empty string', async () => {
    const hash = await sha256('')
    expect(hash).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
  })
})

describe('Radix conversion', () => {
  const convert = (value: string, from: 2 | 8 | 10 | 16) => {
    const decimal = parseInt(value, from)
    return {
      binary: decimal.toString(2),
      octal: decimal.toString(8),
      decimal: decimal.toString(10),
      hex: decimal.toString(16).toUpperCase(),
    }
  }

  it('should convert binary to all bases', () => {
    const result = convert('1010', 2)
    expect(result).toEqual({
      binary: '1010',
      octal: '12',
      decimal: '10',
      hex: 'A',
    })
  })

  it('should convert decimal to all bases', () => {
    const result = convert('255', 10)
    expect(result).toEqual({
      binary: '11111111',
      octal: '377',
      decimal: '255',
      hex: 'FF',
    })
  })

  it('should convert hex to all bases', () => {
    const result = convert('FF', 16)
    expect(result).toEqual({
      binary: '11111111',
      octal: '377',
      decimal: '255',
      hex: 'FF',
    })
  })

  it('should handle zero', () => {
    const result = convert('0', 10)
    expect(result).toEqual({
      binary: '0',
      octal: '0',
      decimal: '0',
      hex: '0',
    })
  })
})

describe('JSON formatter', () => {
  it('should format minified JSON', () => {
    const input = '{"name":"test","value":123}'
    const parsed = JSON.parse(input)
    const formatted = JSON.stringify(parsed, null, 2)
    expect(formatted).toContain('\n')
    expect(formatted).toContain('  ')
  })

  it('should minify formatted JSON', () => {
    const input = '{"name": "test",\n  "value": 123\n}'
    const parsed = JSON.parse(input)
    const minified = JSON.stringify(parsed)
    expect(minified).not.toContain('\n')
    expect(minified).not.toContain('  ')
  })

  it('should throw on invalid JSON', () => {
    expect(() => JSON.parse('{invalid}')).toThrow()
  })

  it('should preserve data through format-minify round trip', () => {
    const original = '{"arr":[1,2,3],"nested":{"key":"value"}}'
    const parsed = JSON.parse(original)
    expect(JSON.stringify(parsed)).toBe(original)
  })
})
