import { useState, useRef } from 'react'
import { Play, Square, Download } from 'lucide-react'
import { ToolHeader, Card, Button } from '../components/ui'

export default function ScreenRecorderTool() {
  const [recording, setRecording] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [error, setError] = useState('')
  const mediaRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const start = async () => {
    setError('')
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
      const recorder = new MediaRecorder(stream); mediaRef.current = recorder; chunksRef.current = []
      recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      recorder.onstop = () => { setVideoUrl(URL.createObjectURL(new Blob(chunksRef.current, { type: 'video/webm' }))); stream.getTracks().forEach(t => t.stop()) }
      recorder.start(); setRecording(true)
    } catch (e) { setError('无法启动录屏: ' + (e as Error).message) }
  }

  const stop = () => { mediaRef.current?.stop(); setRecording(false) }

  return (<div className="max-w-md mx-auto animate-fadeInUp"><ToolHeader name="屏幕" accent="录制" desc="浏览器原生录屏 · WebM 格式"/><Card>
    {!videoUrl ? (
      <div className="text-center space-y-4">
        {recording ? (
          <div className="flex items-center justify-center gap-2 py-8"><span className="w-4 h-4 rounded-full bg-red-500 animate-pulse"/> <span className="text-red-400 font-mono text-lg">录屏中...</span></div>
        ) : <p className="text-sm text-gray-400 py-8">点击开始，选择要录制的屏幕/窗口</p>}
        <Button onClick={recording ? stop : start} className="w-full">{recording ? <Square size={16} /> : <Play size={16} />}{recording ? '停止录制' : '开始录制'}</Button>
      </div>
    ) : (
      <div className="space-y-3">
        <video src={videoUrl} controls className="w-full rounded-xl border border-white/10"/>
        <Button onClick={() => { const a = document.createElement('a'); a.href = videoUrl; a.download = 'recording.webm'; a.click() }} className="w-full"><Download size={14} />下载视频</Button>
        <Button variant="ghost" onClick={() => setVideoUrl(null)} className="w-full text-xs">重新录制</Button>
      </div>
    )}
    {error && <div className="text-sm text-red-400">{error}</div>}
  </Card></div>)
}
