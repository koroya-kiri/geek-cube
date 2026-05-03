import { useState, useRef, useEffect } from 'react'
import { Textarea, Label } from '../components/ui'

function sanitizeSvg(svg: string): string {
  // Remove script tags and event handlers from SVG
  return svg
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\son\w+\s*=\s*[^\s/>]+/gi, '')
}

export default function SvgPreviewTool() {
  const [svg, setSvg] = useState('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="80" fill="#00f0ff" opacity="0.5"/><rect x="60" y="60" width="80" height="80" fill="#ff00aa" rx="10"/><text x="100" y="115" text-anchor="middle" fill="white" font-size="20" font-family="sans-serif">SVG</text></svg>')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    const doc = iframe.contentDocument
    if (!doc) return
    doc.open()
    doc.write(sanitizeSvg(svg))
    doc.close()
  }, [svg])

  return (
    <div className="max-w-5xl mx-auto animate-fadeInUp">
      <h2 className="text-2xl font-bold font-display text-white mb-1.5">SVG <span className="text-neon-magenta">预览</span></h2>
      <p className="text-sm text-gray-400 mb-6">实时预览 SVG 代码</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2"><Label>SVG 代码</Label><Textarea value={svg} onChange={e=>setSvg(e.target.value)} rows={14} /></div>
        <div className="space-y-2"><Label>预览</Label><div className="rounded-2xl border border-white/10 bg-white p-6 flex items-center justify-center min-h-[300px]"><iframe ref={iframeRef} className="w-full h-full min-h-[280px] border-0" sandbox="allow-same-origin" title="SVG Preview" /></div></div>
      </div>
    </div>
  )
}
