import { useEffect, useState } from 'react'
import { Globe, MapPin, Server, Clock, Wifi, Search, Loader2 } from 'lucide-react'
import { ToolHeader, Card, Button, Input, Alert } from '../components/ui'

interface IpData {
  ip: string
  country: string
  region: string
  city: string
  isp: string
  org: string
  timezone: string
  lat: number
  lon: number
}

const API_BASE = 'http://ip-api.com/json'

/** Check if IP is in a private/reserved range */
function isPrivateIp(ip: string): string | null {
  const parts = ip.split('.').map(Number)
  if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) return null
  const [a, b] = parts
  if (a === 10) return 'A 类私有地址 (10.x.x.x)'
  if (a === 172 && b >= 16 && b <= 31) return 'B 类私有地址 (172.16-31.x.x)'
  if (a === 192 && b === 168) return 'C 类私有地址 (192.168.x.x)'
  if (a === 127) return '本地回环地址 (127.x.x.x)'
  if (a === 169 && b === 254) return '链路本地地址 (169.254.x.x)'
  if (a >= 224) return '多播/保留地址'
  if (a === 198 && (b === 18 || b === 19)) return '基准测试保留地址 (198.18-19.x.x)'
  if (a === 100 && b >= 64 && b <= 127) return '运营商级 NAT 地址 (100.64-127.x.x)'
  return null
}

function buildMapUrl(lat: number, lon: number): string {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}&zoom=10`
}

export default function IpLookupTool() {
  const [mode, setMode] = useState<'my' | 'lookup'>('my')
  const [data, setData] = useState<IpData | null>(null)
  const [customIp, setCustomIp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchIpData = async (ip?: string) => {
    setLoading(true); setError('')

    /* Check if manually entered IP is private */
    if (ip) {
      const privateNote = isPrivateIp(ip)
      if (privateNote) {
        setData({
          ip,
          country: '私有/保留地址',
          region: privateNote,
          city: '无法定位',
          isp: '本地网络',
          org: '该 IP 属于私有或保留地址段，无公网地理位置信息',
          timezone: 'N/A',
          lat: 0,
          lon: 0,
        })
        setLoading(false)
        return
      }
    }

    try {
      const url = ip ? `${API_BASE}/${ip}` : API_BASE
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const json = await res.json()
      if (json.status === 'fail') {
        /* Check if it's a private IP that the API can't locate */
        const privateNote = isPrivateIp(json.query || ip || '')
        if (privateNote) {
          setData({
            ip: json.query || ip || '',
            country: '私有/保留地址',
            region: privateNote,
            city: '无法定位',
            isp: '本地网络',
            org: '该 IP 属于私有或保留地址段',
            timezone: 'N/A',
            lat: 0,
            lon: 0,
          })
        } else {
          setError(json.message || '查询失败，请检查 IP 地址')
          setData(null)
        }
        return
      }

      setData({
        ip: json.query,
        country: json.country || '未知',
        region: json.regionName || '未知',
        city: json.city || '未知',
        isp: json.isp || '未知',
        org: json.org || (json.as || ''),
        timezone: json.timezone || '未知',
        lat: json.lat,
        lon: json.lon,
      })
    } catch {
      setError('网络请求失败，请检查网络连接')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (mode === 'my') fetchIpData()
  }, [mode])

  return (
    <div className="max-w-lg mx-auto animate-fadeInUp">
      <ToolHeader name="IP" accent="查询" desc="查询 IP 地址的地理位置、ISP、时区等详细信息" />

      <Card>
        {/* Mode switch */}
        <div className="flex items-center gap-3">
          <button onClick={() => { setMode('my'); setData(null); setError('') }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${mode === 'my' ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20' : 'text-gray-400 hover:text-white'}`}>
            <Wifi size={14} />我的 IP
          </button>
          <button onClick={() => { setMode('lookup'); setData(null); setError('') }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${mode === 'lookup' ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20' : 'text-gray-400 hover:text-white'}`}>
            <Search size={14} />查询 IP
          </button>
        </div>

        {/* Manual IP input */}
        {mode === 'lookup' && (
          <div className="flex gap-2">
            <Input value={customIp} onChange={e => setCustomIp(e.target.value)} placeholder="输入 IP 如 8.8.8.8" />
            <Button onClick={() => fetchIpData(customIp.trim())} disabled={!customIp.trim() || loading}><Search size={14} /></Button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center gap-2 py-8 text-gray-500">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">查询中...</span>
          </div>
        )}

        {error && <Alert>{error}</Alert>}

        {/* Results */}
        {data && !loading && (
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-cyber-bg-deep border border-neon-cyan/20 text-center">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">IP 地址</div>
              <div className="text-2xl font-bold text-neon-cyan font-mono tracking-wider">{data.ip}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-cyber-bg-deep border border-white/10 text-center">
                <Globe size={16} className="mx-auto text-gray-500 mb-1" />
                <div className="text-sm text-white">{data.country}</div>
                <div className="text-[10px] text-gray-500">国家</div>
              </div>
              <div className="p-3 rounded-xl bg-cyber-bg-deep border border-white/10 text-center">
                <MapPin size={16} className="mx-auto text-gray-500 mb-1" />
                <div className="text-sm text-white truncate">{data.region}</div>
                <div className="text-[10px] text-gray-500">地区</div>
              </div>
              <div className="p-3 rounded-xl bg-cyber-bg-deep border border-white/10 text-center">
                <MapPin size={16} className="mx-auto text-gray-500 mb-1" />
                <div className="text-sm text-white truncate">{data.city}</div>
                <div className="text-[10px] text-gray-500">城市</div>
              </div>
              <div className="p-3 rounded-xl bg-cyber-bg-deep border border-white/10 text-center">
                <Clock size={16} className="mx-auto text-gray-500 mb-1" />
                <div className="text-sm text-white truncate">{data.timezone}</div>
                <div className="text-[10px] text-gray-500">时区</div>
              </div>
            </div>

            {(data.isp || data.org) && (
              <div className="p-4 rounded-xl bg-cyber-bg-deep border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Server size={14} className="text-gray-500" />
                  <span className="text-xs text-gray-500 uppercase tracking-wider">ISP</span>
                </div>
                <div className="text-sm text-white font-mono">{data.isp}</div>
                {data.org && <div className="text-xs text-gray-500 font-mono mt-1">{data.org}</div>}
              </div>
            )}

            <div className="p-3 rounded-xl bg-cyber-bg-deep border border-white/10 text-center">
              <div className="text-xs text-gray-400 font-mono">
                {data.lat.toFixed(4)}, {data.lon.toFixed(4)}
              </div>
              <a href={buildMapUrl(data.lat, data.lon)} target="_blank" rel="noopener noreferrer"
                className="text-xs text-neon-cyan hover:text-white transition-colors mt-1 inline-block">
                在 OpenStreetMap 查看 →
              </a>
            </div>
            <p className="text-[10px] text-gray-600 text-center">数据来源: ip-api.com</p>
            {data.country === '私有/保留地址' && (
              <p className="text-[10px] text-gray-600 text-center">提示：本机运行在开发/容器环境中，显示的是内部网络地址。部署到公网后可查询真实 IP。</p>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
