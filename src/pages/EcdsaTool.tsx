import { useState } from 'react'
import { KeyRound } from 'lucide-react'
import { ToolHeader, Card, Button, Chip, Label } from '../components/ui'

const CURVES = [
  { k: 'P-256', l: 'P-256', d: '256 位 · 最常用' },
  { k: 'P-384', l: 'P-384', d: '384 位 · 高安全性' },
  { k: 'P-521', l: 'P-521', d: '521 位 · 最高安全性' },
] as const

function formatPem(b64: string, label: string): string {
  const lines = b64.match(/.{1,64}/g) || [b64]
  return `-----BEGIN ${label}-----\n${lines.join('\n')}\n-----END ${label}-----`
}

export default function EcdsaTool() {
  const [curve, setCurve] = useState<'P-256' | 'P-384' | 'P-521'>('P-256')
  const [publicKey, setPublicKey] = useState('')
  const [privateKey, setPrivateKey] = useState('')
  const [jwk, setJwk] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedPub, setCopiedPub] = useState(false)
  const [copiedPriv, setCopiedPriv] = useState(false)

  const generate = async () => {
    setLoading(true); setError('')
    try {
      const pair = await crypto.subtle.generateKey(
        { name: 'ECDSA', namedCurve: curve },
        true,
        ['sign', 'verify']
      )

      const pubRaw = await crypto.subtle.exportKey('spki', pair.publicKey)
      const privRaw = await crypto.subtle.exportKey('pkcs8', pair.privateKey)
      const pubB64 = btoa(String.fromCharCode(...new Uint8Array(pubRaw)))
      const privB64 = btoa(String.fromCharCode(...new Uint8Array(privRaw)))
      setPublicKey(formatPem(pubB64, 'PUBLIC KEY'))
      setPrivateKey(formatPem(privB64, 'PRIVATE KEY'))

      const j = await crypto.subtle.exportKey('jwk', pair.publicKey)
      setJwk(JSON.stringify(j, null, 2))
    } catch (e) {
      setError((e as Error).message)
      setPublicKey(''); setPrivateKey(''); setJwk('')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-2xl mx-auto animate-fadeInUp">
      <ToolHeader name="ECDSA" accent="密钥生成" accentColor="text-neon-magenta" desc="生成椭圆曲线数字签名算法密钥对" />

      <Card>
        <div className="flex flex-wrap gap-2 mb-4">
          {CURVES.map(({ k, l, d }) => (
            <Chip key={k} active={curve === k} onClick={() => setCurve(k)}>
              <span className="flex flex-col items-start">
                <span className="text-xs font-semibold">{l}</span>
                <span className="text-[10px] opacity-60">{d}</span>
              </span>
            </Chip>
          ))}
        </div>

        <Button onClick={generate} disabled={loading} className="w-full">
          <KeyRound size={15} />{loading ? '生成中...' : `生成 ${curve} 密钥对`}
        </Button>

        {error && <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">{error}</div>}

        {publicKey && (
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between"><Label>公钥 (SPKI / PEM)</Label><button onClick={async()=>{await navigator.clipboard.writeText(publicKey);setCopiedPub(true);setTimeout(()=>setCopiedPub(false),1500)}} className="text-xs text-gray-500 hover:text-neon-cyan">{copiedPub?'已复制':'复制'}</button></div>
              <pre className="p-4 rounded-xl bg-cyber-bg-deep border border-white/10 text-xs text-neon-green font-mono overflow-x-auto whitespace-pre max-h-40">{publicKey}</pre>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between"><Label>私钥 (PKCS#8 / PEM)</Label><button onClick={async()=>{await navigator.clipboard.writeText(privateKey);setCopiedPriv(true);setTimeout(()=>setCopiedPriv(false),1500)}} className="text-xs text-gray-500 hover:text-neon-cyan">{copiedPriv?'已复制':'复制'}</button></div>
              <pre className="p-4 rounded-xl bg-cyber-bg-deep border border-red-500/20 text-xs text-red-400 font-mono overflow-x-auto whitespace-pre max-h-40">{privateKey}</pre>
            </div>

            {jwk && (
              <div className="space-y-1">
                <Label>公钥 JWK</Label>
                <pre className="p-4 rounded-xl bg-cyber-bg-deep border border-white/10 text-xs text-gray-400 font-mono overflow-x-auto whitespace-pre max-h-32">{jwk}</pre>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              {CURVES.map(({ k, l, d }) => (
                <div key={k} className="text-center p-3 rounded-xl bg-cyber-bg-deep">
                  <span className="text-sm font-semibold text-neon-cyan">{l}</span>
                  <p className="text-xs text-gray-500 mt-1">{d}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
