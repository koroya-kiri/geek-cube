import { useState } from 'react'
import { ToolHeader, Card, Input, Label } from '../components/ui'

function isValidIPv4(ip: string): boolean { const parts = ip.split('.'); if (parts.length !== 4) return false; return parts.every(p => { const n = +p; return !isNaN(n) && n >= 0 && n <= 255 && String(n) === p }) }
function isValidIPv6(ip: string): boolean { const r = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/; if (r.test(ip)) return true; const c = (ip.match(/::/g) || []).length; return c <= 1 && c === 1 && /^([0-9a-fA-F]{0,4}:){0,7}[0-9a-fA-F]{0,4}$/.test(ip) }

export default function IpValidatorTool() {
  const [ip, setIp] = useState('')
  const v4 = isValidIPv4(ip); const v6 = isValidIPv6(ip)
  return (<div className="max-w-sm mx-auto animate-fadeInUp"><ToolHeader name="IP" accent="验证" desc="验证 IPv4 / IPv6 地址格式"/><Card>
    <div className="space-y-1"><Label>IP 地址</Label><Input value={ip} onChange={e=>setIp(e.target.value)} placeholder="192.168.1.1"/></div>
    {ip.trim() && <div className="space-y-2">
      <div className={`p-3 rounded-xl text-center text-sm font-medium ${v4 ? 'bg-neon-green/10 text-neon-green border border-neon-green/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>IPv4: {v4 ? '✓ 有效' : '✗ 无效'}</div>
      <div className={`p-3 rounded-xl text-center text-sm font-medium ${v6 ? 'bg-neon-green/10 text-neon-green border border-neon-green/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>IPv6: {v6 ? '✓ 有效' : '✗ 无效'}</div>
    </div>}
  </Card></div>)
}
