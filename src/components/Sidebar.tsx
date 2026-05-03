import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Boxes, Search, Star, Puzzle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toolCategories } from '../utils/tools.ts'
import { useFavorites } from '../hooks/useFavorites.ts'
import { usePlugins } from '../hooks/usePlugins.tsx'

interface SidebarProps {
  onSearchOpen: () => void
}

export default function Sidebar({ onSearchOpen }: SidebarProps) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { favorites, toggle, isFavorite } = useFavorites()
  const { plugins } = usePlugins()
  const enabledPlugins = plugins.filter(p => p.enabled)

  useEffect(() => { setOpen(false) }, [location.pathname])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-cyber-bg-surface/80 backdrop-blur-md border border-white/[0.08] text-neon-cyan hover:border-white/20 transition-all"
        aria-label="切换侧边栏"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && <div className="fixed inset-0 bg-black/80 z-30 lg:hidden backdrop-blur-xl" onClick={() => setOpen(false)} />}

      <aside className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-[#07070e]/90 backdrop-blur-xl border-r border-white/[0.05] flex flex-col transition-transform duration-300 ease-out ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.05]">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-green shadow-lg shadow-neon-cyan/25">
            <Boxes size={20} className="text-cyber-bg-deep" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white">极客魔方</h1>
            <p className="text-[10px] font-mono text-gray-500 tracking-wider">GEEK CUBE</p>
          </div>
        </div>

        {/* Search + Home */}
        <div className="px-3 pt-4 pb-2 space-y-1">
          <Link to="/" className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${location.pathname==='/'?'bg-neon-cyan/8 text-neon-cyan':'text-gray-400 hover:text-white hover:bg-white/[0.03]'}`}>
            {location.pathname==='/'&&<span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-neon-cyan shadow-glow-cyan" />}
            <span className="text-base">仪表盘</span>
          </Link>
          <button
            onClick={onSearchOpen}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/[0.03] transition-all duration-200"
          >
            <Search size={15} className="text-gray-500" />
            <span>搜索工具</span>
            <kbd className="ml-auto px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-[10px] font-mono text-gray-500">⌘K</kbd>
          </button>

          {/* Plugin Manager — standout at top */}
          <Link
            to="/tools/plugin-manager"
            className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              location.pathname === '/tools/plugin-manager'
                ? 'bg-neon-purple/10 text-neon-purple border border-neon-purple/20'
                : 'text-gray-400 hover:text-white hover:bg-neon-purple/5 border border-transparent'
            }`}
          >
            <Puzzle size={16} className={location.pathname === '/tools/plugin-manager' ? 'text-neon-purple' : 'text-gray-500'} />
            <span>插件工坊</span>
            <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-md font-mono"
              style={{
                background: 'rgba(184,71,240,.15)',
                color: '#b847f0',
                border: '1px solid rgba(184,71,240,.3)',
              }}>BETA</span>
          </Link>
        </div>

        {/* Favorites section */}
        {favorites.length > 0 && (
          <div className="px-3 pb-2">
            <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
              <Star size={10} className="text-neon-yellow" /> 收藏
            </p>
            <div className="space-y-0.5">
              {favorites.map(id => {
                const tool = toolCategories.flatMap(c => c.tools).find(t => t.id === id)
                if (!tool) return null
                const Icon = tool.icon
                const isActive = location.pathname === tool.path
                return (
                  <div key={tool.id} className="relative group">
                    <Link to={tool.path} className={`relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${isActive?'bg-neon-cyan/8 text-neon-cyan':'text-gray-400 hover:text-white hover:bg-white/[0.03]'}`}>
                      {isActive&&<span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full bg-neon-cyan shadow-glow-cyan" />}
                      <Icon size={15} className={isActive?'text-neon-cyan':'text-gray-500'} />
                      <span className="font-medium text-[13px]">{tool.name}</span>
                    </Link>
                    <button
                      onClick={() => toggle(tool.id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-600 hover:text-neon-yellow opacity-0 group-hover:opacity-100 transition-opacity"
                      title="取消收藏"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Tool categories */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          {toolCategories.map(category => (
            <div key={category.id}>
              <div className="flex items-center justify-between px-3 mb-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">{category.name}</p>
              </div>
              <div className="space-y-0.5">
                {category.tools.map(tool => {
                  const isActive = location.pathname === tool.path
                  const Icon = tool.icon
                  const fav = isFavorite(tool.id)
                  return (
                    <div key={tool.id} className="relative group">
                      <Link to={tool.path} className={`relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${isActive?'bg-neon-cyan/8 text-neon-cyan':'text-gray-400 hover:text-white hover:bg-white/[0.03]'}`}>
                        {isActive&&<span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full bg-neon-cyan shadow-glow-cyan" />}
                        <Icon size={15} className={isActive?'text-neon-cyan':'text-gray-500'} />
                        <span className="font-medium text-[13px]">{tool.name}</span>
                        {fav && <Star size={10} className="ml-auto text-neon-yellow fill-neon-yellow" />}
                      </Link>
                      {/* Favorite toggle on hover */}
                      <button
                        onClick={() => toggle(tool.id)}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md transition-opacity ${fav ? 'text-neon-yellow hover:text-gray-500' : 'text-gray-600 hover:text-neon-yellow opacity-0 group-hover:opacity-100'}`}
                        title={fav ? '取消收藏' : '收藏'}
                      >
                        <Star size={10} className={fav ? 'fill-current' : ''} />
          </button>

          {/* Plugin Manager — standout */}
          <Link
            to="/tools/plugin-manager"
            className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              location.pathname === '/tools/plugin-manager'
                ? 'bg-neon-purple/10 text-neon-purple border border-neon-purple/20'
                : 'text-gray-400 hover:text-white hover:bg-neon-purple/5 border border-transparent'
            }`}
          >
            <Puzzle size={16} className={location.pathname === '/tools/plugin-manager' ? 'text-neon-purple' : 'text-gray-500'} />
            <span>插件工坊</span>
            <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-md font-mono"
              style={{
                background: 'rgba(184,71,240,.15)',
                color: '#b847f0',
                border: '1px solid rgba(184,71,240,.3)',
              }}>BETA</span>
          </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Plugin tools */}
          {enabledPlugins.length > 0 && (
            <div>
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1.5" style={{ color: '#b847f0' }}>
                <Puzzle size={10} /> 我的插件
              </p>
              <div className="space-y-0.5">
                {enabledPlugins.map(p => {
                  const isActive = location.pathname === `/plugins/${p.id}`
                  return (
                    <Link key={p.id} to={`/plugins/${p.id}`}
                      className={`relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${isActive ? 'bg-neon-purple/8 text-neon-purple' : 'text-gray-400 hover:text-white hover:bg-neon-purple/5'}`}>
                      {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full bg-neon-purple" />}
                      <Puzzle size={14} className={isActive ? 'text-neon-purple' : 'text-gray-500'} />
                      <span className="font-medium text-[13px] truncate">{p.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </nav>

        <div className="px-5 py-4 border-t border-white/[0.05]">
          <p className="text-[10px] text-gray-600 font-mono">v1.0.0 · 极客魔方</p>
        </div>
      </aside>
    </>
  )
}
