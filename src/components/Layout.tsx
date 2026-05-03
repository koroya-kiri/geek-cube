import { useState, useEffect, useMemo } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar.tsx'
import Header from './Header.tsx'
import ParticleBackground from './ParticleBackground.tsx'
import GlowOrbs from './GlowOrbs.tsx'
import MatrixRain from './MatrixRain.tsx'
import SearchModal from './SearchModal.tsx'
import { useBg } from '../hooks/useBg.tsx'
import { useShortcuts } from '../hooks/useShortcuts.ts'
import { useRecentTools } from '../hooks/useRecentTools.ts'
import { allTools } from '../utils/tools.ts'

export default function Layout() {
  const { settings } = useBg()
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()
  const { addRecent } = useRecentTools()

  /* Track tool visits for "recent" */
  useEffect(() => {
    const tool = allTools.find(t => t.path === location.pathname)
    if (tool) addRecent(tool.id)
  }, [location.pathname, addRecent])

  useShortcuts({ onSearch: () => setSearchOpen(true) })

  /* Build status bar text */
  const statusText = useMemo(() => {
    const now = new Date()
    const t = now.toLocaleTimeString('zh-CN', { hour12: false })
    const tool = allTools.find(t => t.path === location.pathname)
    return `SYS::ONLINE · ${t} · ${tool ? tool.name : 'GEEK CUBE'} · TOOLS:${allTools.length}`
  }, [location.pathname])

  return (
    <div className={`flex min-h-screen bg-transparent relative ${settings.scanlines ? 'scanlines' : ''} ${settings.crtScanlines ? 'scanlines-enhanced' : ''} ${settings.binaryRain ? 'bg-binary-rain' : ''} ${settings.starfield ? 'bg-starfield' : ''} ${settings.circuit ? 'bg-circuit' : ''}`}>
      <GlowOrbs />
      {settings.particles && <ParticleBackground />}
      {settings.matrixRain && <MatrixRain />}
      {settings.matrixBg && <div className="fixed inset-0 pointer-events-none bg-matrix" style={{ zIndex: 0 }} />}
      <Sidebar onSearchOpen={() => setSearchOpen(true)} />
      <div className="flex-1 flex flex-col min-w-0 relative z-[1]">
        <Header onSearchOpen={() => setSearchOpen(true)} />
        <main className={`flex-1 p-6 overflow-auto ${settings.grid ? 'bg-grid' : ''}`}>
          <Outlet />
        </main>
        {/* HUD Status Bar */}
        {settings.hud && (
          <div className="term-status px-4 py-1.5 flex items-center justify-between sticky bottom-0 z-20">
            <span>⚡ {statusText}</span>
            <span className="opacity-50">GEEK CUBE v1.0</span>
          </div>
        )}
      </div>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
