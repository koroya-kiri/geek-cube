import { useState, useEffect } from 'react'
import { ToolHeader, Card } from '../components/ui'

export default function ScreenInfoTool() {
  const [info, setInfo] = useState<Record<string,string>>({})
  useEffect(() => {
    setInfo({
      '分辨率': `${window.screen.width} × ${window.screen.height}`,
      '可用区域': `${window.screen.availWidth} × ${window.screen.availHeight}`,
      '像素比': `${window.devicePixelRatio}x`,
      '色深': `${window.screen.colorDepth}-bit`,
      '视口': `${window.innerWidth} × ${window.innerHeight}`,
      '方向': window.screen.orientation?.type || '未知',
    })
  }, [])
  return (<div className="max-w-xs mx-auto animate-fadeInUp"><ToolHeader name="屏幕" accent="信息" desc="查看当前屏幕参数"/><Card>
    <div className="space-y-2">{Object.entries(info).map(([k,v]) => <div key={k} className="flex justify-between p-3 rounded-xl bg-cyber-bg-deep border border-white/10"><span className="text-sm text-gray-400">{k}</span><span className="text-sm text-white font-mono">{v}</span></div>)}</div>
  </Card></div>)
}
