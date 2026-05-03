import { useState } from 'react'
import { TerminalCard, GlitchTitle, ScanTextarea, PulseButton, TerminalError, SysClock, DataTraffic } from '../components/MatrixUI'

const CYAN = '#00f2ff'

function b64ToBuf(b64: string): ArrayBuffer {
  const bin = atob(b64)
  return Uint8Array.from(bin, c => c.charCodeAt(0)).buffer
}

function bufToB64(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
}

export default function RsaTool() {
  /* ─── Key generation ─── */
  const [publicKey, setPublicKey] = useState('')
  const [privateKey, setPrivateKey] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'generate' | 'sign'>('generate')

  const generate = async () => {
    setLoading(true); setError('')
    try {
      const signPair = await crypto.subtle.generateKey(
        { name: 'RSA-PSS', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
        true,
        ['sign', 'verify']
      )
      const pub = await crypto.subtle.exportKey('spki', signPair.publicKey)
      const priv = await crypto.subtle.exportKey('pkcs8', signPair.privateKey)
      setPublicKey(bufToB64(pub))
      setPrivateKey(bufToB64(priv))
    } catch (e) { setError((e as Error).message) }
    setLoading(false)
  }

  /* ─── Sign / Verify ─── */
  const [signMode, setSignMode] = useState<'sign' | 'verify'>('sign')
  const [keyB64, setKeyB64] = useState('')
  const [message, setMessage] = useState('')
  const [sigB64, setSigB64] = useState('')
  const [result, setResult] = useState('')

  const doSign = async () => {
    setError(''); setResult('')
    try {
      const key = await crypto.subtle.importKey('pkcs8', b64ToBuf(keyB64), { name: 'RSA-PSS', hash: 'SHA-256' }, false, ['sign'])
      const sig = await crypto.subtle.sign({ name: 'RSA-PSS', saltLength: 32 }, key, new TextEncoder().encode(message))
      setSigB64(bufToB64(sig))
      setResult('签名成功')
    } catch (e) { setError((e as Error).message) }
  }

  const doVerify = async () => {
    setError(''); setResult('')
    try {
      const key = await crypto.subtle.importKey('spki', b64ToBuf(keyB64), { name: 'RSA-PSS', hash: 'SHA-256' }, false, ['verify'])
      const ok = await crypto.subtle.verify({ name: 'RSA-PSS', saltLength: 32 }, key, b64ToBuf(sigB64), new TextEncoder().encode(message))
      setResult(ok ? '✓ 验签通过 — 签名有效' : '✗ 验签失败 — 签名无效或消息不匹配')
    } catch (e) { setError((e as Error).message) }
  }

  return (
    <div className="animate-fadeInUp py-6">
      <TerminalCard>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {([
              { k: 'generate' as const, l: '生成密钥' },
              { k: 'sign' as const, l: '签名 / 验签' },
            ]).map(({ k, l }) => (
              <button key={k} onClick={() => { setMode(k); setError('') }} className="font-mono text-[10px] tracking-[0.1em] px-3 py-1 transition-colors"
                style={{ color: mode === k ? CYAN : '#444', borderBottom: mode === k ? `1px solid ${CYAN}` : '1px solid transparent' }}>{l}</button>
            ))}
          </div>
          <div className="flex items-center gap-4"><DataTraffic /><SysClock /></div>
        </div>
        <GlitchTitle>RSA-PSS</GlitchTitle>

        {mode === 'generate' ? (
          <>
            <PulseButton onClick={generate} disabled={loading}>{loading ? '生成中...' : '生成 RSA-PSS 密钥对'}</PulseButton>
            {publicKey && <ScanTextarea label="[ 公钥 · SPKI · Base64 ]" value={publicKey} readOnly rows={4} />}
            {privateKey && <ScanTextarea label="[ 私钥 · PKCS#8 · Base64 ]" value={privateKey} readOnly rows={4} />}
            {publicKey && (
              <p className="text-xs" style={{ color: '#555' }}>
                提示：密钥支持 RSA-PSS 签名与验签。
              </p>
            )}
          </>
        ) : (
          <>
            <div className="flex gap-2">
              {([
                { k: 'sign' as const, l: '签名' },
                { k: 'verify' as const, l: '验签' },
              ]).map(({ k, l }) => (
                <button key={k} onClick={() => { setSignMode(k); setError(''); setResult('') }} className="font-mono text-[10px] tracking-[0.1em] px-3 py-1 transition-colors"
                  style={{ color: signMode === k ? CYAN : '#444', borderBottom: signMode === k ? `1px solid ${CYAN}` : '1px solid transparent' }}>{l}</button>
              ))}
            </div>
            <ScanTextarea
              label={signMode === 'sign' ? '[ 私钥 · PKCS#8 · Base64 ]' : '[ 公钥 · SPKI · Base64 ]'}
              value={keyB64} onChange={setKeyB64}
              placeholder={signMode === 'sign' ? '粘贴私钥...' : '粘贴公钥...'} rows={4}
            />
            <ScanTextarea label="[ 消息 ]" value={message} onChange={setMessage} placeholder="输入要签名/验证的消息..." rows={3} />
            {signMode === 'verify' && (
              <ScanTextarea label="[ 签名 Base64 ]" value={sigB64} onChange={setSigB64} placeholder="输入签名..." rows={3} />
            )}
            {signMode === 'sign' && sigB64 && (
              <ScanTextarea label="[ 签名结果 · Base64 ]" value={sigB64} readOnly rows={3} />
            )}
            <PulseButton onClick={signMode === 'sign' ? doSign : doVerify} disabled={!keyB64.trim() || !message.trim()}>
              {signMode === 'sign' ? '签 名' : '验 签'}
            </PulseButton>
            {result && (
              <div className="px-4 py-3 font-mono text-xs rounded" style={{
                background: result.startsWith('✓') ? 'rgba(0,255,136,0.08)' : 'rgba(255,0,85,0.08)',
                borderLeft: `2px solid ${result.startsWith('✓') ? '#00ff88' : '#ff0055'}`,
                color: result.startsWith('✓') ? '#00ff88' : '#ff0055',
              }}>{result}</div>
            )}
          </>
        )}
        {error && <TerminalError>{error}</TerminalError>}
      </TerminalCard>
    </div>
  )
}
