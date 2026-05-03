import { useState } from 'react'
import { Puzzle, Plus, Trash2, Power, PowerOff, Code2, Play } from 'lucide-react'
import { ToolHeader, Card, Button, Input, Textarea, Label, Alert, Chip } from '../components/ui'
import { usePlugins, type PluginMeta } from '../hooks/usePlugins'
import { DynamicComponent } from '../components/DynamicComponent'

const DEFAULT_CODE = `// 用 api.createElement 创建组件，with(api) 后可直接用 createElement
// 可用: createElement, useState, useEffect, useRef, Fragment
function() {
  const [count, setCount] = useState(0)
  return createElement('div', { style: { textAlign: 'center', padding: '20px' } },
    createElement('h3', { style: { color: '#00f0ff', fontSize: '18px', marginBottom: '10px' } }, '我的插件'),
    createElement('p', { style: { color: '#999', fontSize: '14px' } }, '点击次数: ' + count),
    createElement('button', {
      onClick: function() { setCount(count + 1) },
      style: {
        padding: '8px 20px', borderRadius: '12px', border: '1px solid rgba(0,240,255,.3)',
        background: 'rgba(0,240,255,.1)', color: '#00f0ff', cursor: 'pointer', marginTop: '10px', fontFamily: 'inherit'
      }
    }, '点我 +1')
  )
}`

export default function PluginManager() {
  const { plugins, addPlugin, removePlugin, togglePlugin, updateCode } = usePlugins()
  const [showCreate, setShowCreate] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ id: '', name: '', description: '', version: '1.0.0', author: '', code: DEFAULT_CODE })
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [previewError, setPreviewError] = useState('')
  const [msg, setMsg] = useState('')

  const resetForm = () => setForm({ id: '', name: '', description: '', version: '1.0.0', author: '', code: DEFAULT_CODE })

  const handleCreate = () => {
    const id = form.id.trim() || `plugin-${Date.now()}`
    if (plugins.find(p => p.id === id)) { setMsg('ID 已存在'); return }
    addPlugin({ id, name: form.name || '未命名', description: form.description || '', version: form.version, author: form.author, code: form.code, enabled: true })
    setShowCreate(false); resetForm(); setMsg('')
  }

  const handleEdit = (p: PluginMeta) => {
    setEditingId(p.id)
    setForm({ id: p.id, name: p.name, description: p.description, version: p.version, author: p.author, code: p.code })
    setShowCreate(true)
  }

  const handleSaveEdit = () => {
    if (editingId) updateCode(editingId, form.code)
    setEditingId(null); setShowCreate(false); resetForm()
  }

  return (
    <div className="max-w-3xl mx-auto animate-fadeInUp">
      <ToolHeader name="插件" accent="工坊" accentColor="text-neon-purple" desc="创建、管理和预览自定义插件" />

      <div className="flex items-center gap-3 mb-6">
        <Button onClick={() => { resetForm(); setEditingId(null); setShowCreate(!showCreate) }}>
          <Plus size={14} />{showCreate ? '关闭' : '新建插件'}
        </Button>
        <span className="text-xs text-gray-500">{plugins.length} 个插件</span>
      </div>

      {msg && <Alert>{msg}</Alert>}

      {/* Create / Edit form */}
      {showCreate && (
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">{editingId ? '编辑插件' : '新建插件'}</h3>
            <button onClick={() => { setShowCreate(false); setEditingId(null) }} className="text-gray-500 hover:text-white text-xs">取消</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>ID（英文唯一）</Label>
              <Input value={form.id} onChange={e => setForm({ ...form, id: e.target.value })} placeholder="my-plugin" disabled={!!editingId} />
            </div>
            <div className="space-y-1">
              <Label>名称</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="我的插件" />
            </div>
            <div className="space-y-1">
              <Label>描述</Label>
              <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="插件描述..." />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><Label>版本</Label><Input value={form.version} onChange={e => setForm({ ...form, version: e.target.value })} /></div>
              <div className="space-y-1"><Label>作者</Label><Input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} /></div>
            </div>
          </div>
          <div className="space-y-1">
            <Label>代码 (React 组件)</Label>
            <Textarea value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} rows={10} className="text-xs" />
          </div>
          <Button onClick={editingId ? handleSaveEdit : handleCreate} className="w-full">
            <Code2 size={14} />{editingId ? '保存修改' : '创建插件'}
          </Button>
        </Card>
      )}

      {/* Plugin list */}
      <div className="space-y-3">
        {plugins.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Puzzle size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">暂无插件，点击"新建插件"开始</p>
          </div>
        )}
        {plugins.map(p => (
          <Card key={p.id} className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">{p.name}</span>
                  <span className="text-[10px] text-gray-500 font-mono">{p.id}</span>
                  <Chip active={p.enabled} onClick={() => togglePlugin(p.id)}>
                    {p.enabled ? <Power size={12} /> : <PowerOff size={12} />}
                    {p.enabled ? '启用' : '禁用'}
                  </Chip>
                </div>
                {p.description && <p className="text-xs text-gray-500 mt-1 truncate">{p.description}</p>}
                <p className="text-[10px] text-gray-600 mt-1">v{p.version} · {p.author || '未知作者'}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" onClick={() => setPreviewId(previewId === p.id ? null : p.id)} className="text-xs px-2 py-1"><Play size={12} /></Button>
                <Button variant="ghost" onClick={() => handleEdit(p)} className="text-xs px-2 py-1"><Code2 size={12} /></Button>
                <Button variant="ghost" onClick={() => removePlugin(p.id)} className="text-xs px-2 py-1 text-red-400"><Trash2 size={12} /></Button>
              </div>
            </div>

            {/* Preview */}
            {previewId === p.id && (
              <div className="rounded-xl bg-cyber-bg-deep border border-white/10 p-4">
                <div className="text-[10px] text-gray-500 mb-2">实时预览</div>
                <DynamicComponent code={p.code} onError={setPreviewError} />
                {previewError && <div className="text-xs text-red-400 mt-2">{previewError}</div>}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
