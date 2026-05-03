import { useState } from 'react'
import { ToolHeader, Card, Textarea, Label, Alert } from '../components/ui'

function decodeJWT(token: string) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) throw new Error('无效的 JWT 格式')
    const header = JSON.parse(atob(parts[0]))
    const payload = JSON.parse(atob(parts[1]))
    return { header, payload, signature: parts[2] }
  } catch (e) { throw new Error('JWT 解码失败: ' + (e as Error).message) }
}

export default function JwtTool() {
  const [token, setToken] = useState('')
  const [header, setHeader] = useState('')
  const [payload, setPayload] = useState('')
  const [error, setError] = useState('')

  const decode = () => {
    setError(''); setHeader(''); setPayload('')
    if (!token.trim()) return
    try {
      const r = decodeJWT(token.trim())
      setHeader(JSON.stringify(r.header, null, 2))
      setPayload(JSON.stringify(r.payload, null, 2))
    } catch (e) { setError((e as Error).message) }
  }

  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp">
      <ToolHeader name="JWT" accent="解码" desc="解码 JWT Token，查看 Header 和 Payload" />
      <Card>
        <div className="space-y-2">
          <Label>JWT Token</Label>
          <Textarea value={token} onChange={e => { setToken(e.target.value); decode() }} placeholder="eyJhbGciOiJIUzI1NiIs..." rows={4} />
        </div>
        {error && <Alert>{error}</Alert>}
        {header && <div className="space-y-2"><Label>Header</Label><Textarea value={header} readOnly rows={5} className="text-neon-green" /></div>}
        {payload && <div className="space-y-2"><Label>Payload</Label><Textarea value={payload} readOnly rows={10} className="text-neon-green" /></div>}
      </Card>
    </div>
  )
}
