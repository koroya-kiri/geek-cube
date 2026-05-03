import { useState, useEffect } from 'react'
import { marked } from 'marked'
import { ToolHeader, Textarea, Label } from '../components/ui'

export default function MarkdownTool() {
  const [md, setMd] = useState('# Hello\n\nThis is **markdown**\n\n- item 1\n- item 2\n\n`inline code`\n\n```js\nconsole.log("hello")\n```')
  const [html, setHtml] = useState('')
  useEffect(() => { setHtml(marked.parse(md) as string) }, [md])

  return (
    <div className="max-w-5xl mx-auto animate-fadeInUp">
      <ToolHeader name="Markdown" accent="预览" desc="实时预览 Markdown 渲染效果" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Markdown</Label>
          <Textarea value={md} onChange={e => setMd(e.target.value)} rows={20} />
        </div>
        <div className="space-y-2">
          <Label>预览</Label>
          <div className="rounded-2xl border border-white/10 bg-cyber-bg-surface p-6 min-h-[400px] prose prose-invert prose-sm max-w-none overflow-auto" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  )
}
