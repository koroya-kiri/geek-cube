import { useEffect, useState } from 'react'
import { ToolHeader, Card, Label } from '../components/ui'

export default function UserAgentTool() {
  const [info, setInfo] = useState<Record<string,string>>({})

  useEffect(() => {
    const ua = navigator.userAgent
    const platform = navigator.platform
    const lang = navigator.language
    const cookies = navigator.cookieEnabled ? '启用' : '禁用'
    const online = navigator.onLine ? '在线' : '离线'
    const screen = `${window.screen.width}×${window.screen.height}`
    const dpr = `${window.devicePixelRatio}x`

    const browser = ua.includes('Chrome') ? 'Chrome' : ua.includes('Firefox') ? 'Firefox' : ua.includes('Safari') ? 'Safari' : ua.includes('Edge') ? 'Edge' : '未知'
    const os = platform.includes('Win') ? 'Windows' : platform.includes('Mac') ? 'macOS' : platform.includes('Linux') ? 'Linux' : platform

    setInfo({
      '浏览器': browser, '操作系统': os, '平台': platform, '语言': lang,
      '屏幕分辨率': screen, '设备像素比': dpr, 'Cookie': cookies, '网络状态': online,
      'User-Agent': ua,
    })
  }, [])

  return (
    <div className="max-w-md mx-auto animate-fadeInUp">
      <ToolHeader name="UA" accent="解析" desc="解析 User-Agent，查看浏览器和系统信息" />
      <Card>
        {Object.entries(info).map(([k,v]) => (
          <div key={k} className="space-y-1">
            <Label>{k}</Label>
            <div className="px-4 py-2.5 rounded-xl bg-cyber-bg-deep border border-white/10 text-sm text-white font-mono break-all">{v}</div>
          </div>
        ))}
      </Card>
    </div>
  )
}
