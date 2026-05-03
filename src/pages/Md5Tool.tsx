import { useState } from 'react'
import { Upload } from 'lucide-react'
import CryptoJS from 'crypto-js'
import { ToolHeader, Card, Textarea, Label, CopyBtn } from '../components/ui'
import { useAutoProcess } from '../hooks/useAutoProcess'

export default function Md5Tool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [uppercase, setUppercase] = useState(false)
  const [copied, setCopied] = useState(false)

  const calc = () => {
    if (!input.trim()) { setOutput(''); return }
    try {
      const h = CryptoJS.MD5(input).toString()
      setOutput(uppercase ? h.toUpperCase() : h)
    } catch { setOutput('计算失败') }
  }

  useAutoProcess(input, calc, [uppercase], 200)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setInput(ev.target?.result as string)
    reader.readAsText(file)
  }

  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp">
      <ToolHeader name="MD5" accent="哈希" accentColor="text-neon-yellow" desc="MD5 消息摘要算法 · 128 位 · 支持文件上传" />
      <Card>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>输入文本</Label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer hover:text-white">
                <input type="checkbox" checked={uppercase} onChange={e => setUppercase(e.target.checked)} className="rounded" />大写
              </label>
              <label className="flex items-center gap-1 cursor-pointer text-gray-400 hover:text-white">
                <Upload size={13} /><span className="text-xs">上传文件</span>
                <input type="file" onChange={handleFile} className="hidden" />
              </label>
              <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />实时
              </span>
            </div>
          </div>
          <Textarea value={input} onChange={e => setInput(e.target.value)} rows={4} placeholder="输入文本..." />
        </div>
        {output && (
          <div className="space-y-2">
            <div className="flex justify-between"><Label>MD5 结果</Label><CopyBtn copied={copied} onCopy={async()=>{await navigator.clipboard.writeText(output);setCopied(true);setTimeout(()=>setCopied(false),1500)}} /></div>
            <Textarea value={output} readOnly rows={1} className="text-neon-green result-flash" />
          </div>
        )}
      </Card>
    </div>
  )
}
