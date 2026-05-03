import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, CornerDownLeft } from 'lucide-react'
import { allTools, type ToolItem } from '../utils/tools'
import { useFavorites } from '../hooks/useFavorites'
import { useRecentTools } from '../hooks/useRecentTools'

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { favorites } = useFavorites()
  const { recent } = useRecentTools()

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return allTools.filter(
      t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)
    )
  }, [query])

  /* When no query, show recent + favorites */
  const suggestions = useMemo(() => {
    if (query.trim()) return []
    const items: (ToolItem & { badge?: string })[] = []
    for (const id of recent.slice(0, 4)) {
      const t = allTools.find(t => t.id === id)
      if (t) items.push({ ...t, badge: '最近' })
    }
    for (const id of favorites) {
      const t = allTools.find(t => t.id === id)
      if (t && !items.find(i => i.id === t.id)) items.push({ ...t, badge: '收藏' })
    }
    return items
  }, [query, recent, favorites])

  const list = query.trim() ? results : suggestions

  const go = useCallback((tool: ToolItem) => {
    navigate(tool.path)
    onClose()
  }, [navigate, onClose])

  useEffect(() => { if (open) { setQuery(''); setActiveIdx(0); setTimeout(() => inputRef.current?.focus(), 50) } }, [open])
  useEffect(() => { setActiveIdx(0) }, [query])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, list.length - 1)) }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)) }
      else if (e.key === 'Enter' && list[activeIdx]) { e.preventDefault(); go(list[activeIdx]) }
      else if (e.key === 'Escape') { e.preventDefault(); onClose() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, list, activeIdx, go, onClose])

  /* Scroll active item into view */
  useEffect(() => {
    const el = listRef.current?.querySelector('[data-active="true"]')
    el?.scrollIntoView({ block: 'nearest' })
  }, [activeIdx])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        className="relative w-full max-w-lg animate-fadeInUp"
        onClick={e => e.stopPropagation()}
      >
        <div className="rounded-2xl border border-white/10 bg-[#0a0a14]/95 backdrop-blur-xl shadow-2xl overflow-hidden"
          style={{ boxShadow: '0 0 60px rgba(0,240,255,0.08), 0 25px 50px -12px rgba(0,0,0,0.5)' }}>

          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
            <Search size={18} className="text-gray-500 shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="搜索工具..."
              className="flex-1 bg-transparent text-white text-sm placeholder:text-gray-500 focus:outline-none" style={{caretColor:'#00f0ff'}}
            />
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/10 text-[10px] text-gray-500 font-mono">
              <CornerDownLeft size={10} />
            </kbd>
          </div>

          {/* Results */}
          <div ref={listRef} className="max-h-72 overflow-y-auto py-2">
            {list.length === 0 && query.trim() && (
              <div className="px-4 py-8 text-center text-sm text-gray-500">
                未找到匹配的工具
              </div>
            )}
            {list.length === 0 && !query.trim() && (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                输入关键词搜索工具，或从建议中选择
              </div>
            )}
            {list.map((tool, i) => {
              const Icon = tool.icon
              const isActive = i === activeIdx
              const badge = 'badge' in tool ? (tool as ToolItem & { badge?: string }).badge : undefined
              return (
                <button
                  key={tool.id}
                  data-active={isActive}
                  onClick={() => go(tool)}
                  onMouseEnter={() => setActiveIdx(i)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    isActive ? 'bg-neon-cyan/8 text-white' : 'text-gray-300 hover:bg-white/[0.03]'
                  }`}
                >
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                    style={{
                      backgroundColor: `${tool.color || '#00f0ff'}12`,
                      border: `1px solid ${tool.color || '#00f0ff'}20`,
                    }}
                  >
                    <Icon size={15} style={{ color: tool.color || '#00f0ff' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{tool.name}</div>
                    <div className="text-[11px] text-gray-500 truncate">{tool.description}</div>
                  </div>
                  {badge && (
                    <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] text-gray-500 font-mono shrink-0">
                      {badge}
                    </span>
                  )}
                  {isActive && (
                    <CornerDownLeft size={14} className="text-gray-500 shrink-0" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-4 px-4 py-2.5 border-t border-white/[0.06] text-[10px] text-gray-500 font-mono">
            <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-white/[0.06] border border-white/10">↑↓</kbd> 导航</span>
            <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-white/[0.06] border border-white/10">↵</kbd> 打开</span>
            <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-white/[0.06] border border-white/10">esc</kbd> 关闭</span>
            <span className="ml-auto">{allTools.length} 个工具</span>
          </div>
        </div>
      </div>
    </div>
  )
}
