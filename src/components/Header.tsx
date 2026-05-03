import { Link, useLocation } from 'react-router-dom'
import { Boxes, ChevronRight, Search, Settings } from 'lucide-react'
import { allTools } from '../utils/tools.ts'

interface HeaderProps {
  onSearchOpen: () => void
}

export default function Header({ onSearchOpen }: HeaderProps) {
  const location = useLocation()
  const currentTool = allTools.find((t) => t.path === location.pathname)

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-3.5 glass border-b border-white/[0.05]">
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <Boxes size={18} className="text-neon-cyan" />
          <span className="text-sm font-medium">首页</span>
        </Link>
        {currentTool && (
          <>
            <ChevronRight size={14} className="text-gray-600" />
            <span className="text-sm font-semibold text-white">{currentTool.name}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        {currentTool && (
          <p className="hidden md:block text-xs text-gray-500">{currentTool.description}</p>
        )}

        {/* Search button */}
        <button
          onClick={onSearchOpen}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-gray-400 hover:text-white hover:border-white/[0.15] transition-all text-xs"
          title="搜索工具 (Ctrl+K)"
        >
          <Search size={13} />
          <span className="hidden sm:inline">搜索</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 ml-1 px-1 py-0.5 rounded bg-white/[0.06] border border-white/10 text-[10px] font-mono">⌘K</kbd>
        </button>

        <Link
          to="/settings"
          className={`p-2 rounded-lg transition-colors ${location.pathname === '/settings' ? 'bg-neon-cyan/10 text-neon-cyan' : 'text-gray-500 hover:text-white hover:bg-cyber-bg-hover'}`}
          title="设置"
        >
          <Settings size={16} />
        </Link>
      </div>
    </header>
  )
}
