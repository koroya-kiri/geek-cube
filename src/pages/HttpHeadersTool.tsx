import { useEffect, useState } from 'react'
import { Globe, Server, Shield } from 'lucide-react'
import { ToolHeader, Card } from '../components/ui'

export default function HttpHeadersTool() {
  const [headers, setHeaders] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    /* Collect all available client-side info */
    const info: Record<string, string> = {
      'User-Agent': navigator.userAgent,
      'Platform': navigator.platform || '未知',
      'Language': navigator.language,
      'Languages': [...navigator.languages].join(', '),
      'Cookie Enabled': navigator.cookieEnabled ? 'Yes' : 'No',
      'Online': navigator.onLine ? 'Yes' : 'No',
      'Do Not Track': navigator.doNotTrack || 'unspecified',
      'Screen Resolution': `${window.screen.width}×${window.screen.height}`,
      'Device Pixel Ratio': `${window.devicePixelRatio}x`,
      'Color Depth': `${window.screen.colorDepth}-bit`,
      'Hardware Concurrency': navigator.hardwareConcurrency ? String(navigator.hardwareConcurrency) : '未知',
      'Max Touch Points': String(navigator.maxTouchPoints),
      'Connection': (navigator as unknown as { connection?: { effectiveType?: string; downlink?: number } }).connection?.effectiveType || '未知',
    }
    setHeaders(info)
    setLoading(false)
  }, [])

  const groups = [
    { title: '浏览器信息', icon: Globe, keys: ['User-Agent', 'Platform', 'Language', 'Languages', 'Cookie Enabled'] },
    { title: '网络状态', icon: Server, keys: ['Online', 'Do Not Track', 'Connection'] },
    { title: '设备信息', icon: Shield, keys: ['Screen Resolution', 'Device Pixel Ratio', 'Color Depth', 'Hardware Concurrency', 'Max Touch Points'] },
  ]

  return (
    <div className="max-w-lg mx-auto animate-fadeInUp">
      <ToolHeader name="HTTP" accent="请求头" desc="查看当前浏览器环境和 HTTP 请求头信息" />

      {loading ? (
        <div className="text-center py-12 text-gray-500">采集中...</div>
      ) : (
        <div className="space-y-4">
          {groups.map(({ title, icon: Icon, keys }) => (
            <Card key={title}>
              <div className="flex items-center gap-2 mb-3">
                <Icon size={14} className="text-neon-cyan" />
                <h3 className="text-sm font-semibold text-white">{title}</h3>
              </div>
              <div className="space-y-2">
                {keys.map(k => headers[k] && (
                  <div key={k} className="flex justify-between items-start gap-4 p-2.5 rounded-lg bg-cyber-bg-deep border border-white/[0.04]">
                    <span className="text-xs text-gray-500 shrink-0">{k}</span>
                    <span className="text-xs text-white font-mono text-right break-all">{headers[k]}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
