import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { toolCategories } from '../utils/tools.ts'
import type { LucideIcon } from 'lucide-react'
import { Code2, Braces, Dice5, Globe, AlignLeft, Image, Shield, Eye, Server, Lock, Boxes, LayoutGrid, Gauge, X, Minus, Plus, Settings, Puzzle } from 'lucide-react'
import NodeGraph, { generateNodeLayout, type GraphNode, LAYOUT_NAMES, LAYOUTS } from '../components/NodeGraph'
import { BreathingDot } from '../components/HUD'
import { useBg, type ThemeName } from '../hooks/useBg.tsx'
import { usePlugins } from '../hooks/usePlugins.tsx'
import { useNavigate } from 'react-router-dom'

const CAT_ICONS: Record<string, LucideIcon> = {
  pdf: Lock, codec: Code2, format: Braces, generator: Dice5,
  network: Globe, text: AlignLeft, image: Image, crypto: Shield,
  preview: Eye, reference: Server, other: Boxes, more: Boxes,
}

interface DistanceRow {
  idA: string; labelA: string
  idB: string; labelB: string
  distance: number
}

const HOME_STATE_KEY = 'geek-cube-home-state'

interface HomeState {
  layoutIdx: number
  spreadFactor: number
  nodeOverrides: Record<string, { x: number; y: number }>
}

function loadHomeState(): HomeState {
  try {
    const raw = localStorage.getItem(HOME_STATE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* localStorage unavailable – use defaults */ }
  return { layoutIdx: 0, spreadFactor: 1.0, nodeOverrides: {} }
}

function saveHomeState(state: HomeState) {
  try { localStorage.setItem(HOME_STATE_KEY, JSON.stringify(state)) } catch { /* localStorage unavailable */ }
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const hasDragged = useRef(false)
  const [dims, setDims] = useState({ w: 1200, h: 800 })
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const [saved] = useState(loadHomeState)
  const [nodeOverrides, setNodeOverrides] = useState<Record<string, { x: number; y: number }>>(saved.nodeOverrides)
  const [layoutIdx, setLayoutIdx] = useState(saved.layoutIdx)
  const [spreadFactor, setSpreadFactor] = useState(saved.spreadFactor)

  const [layoutPanelOpen, setLayoutPanelOpen] = useState(false)
  const [distancePanelOpen, setDistancePanelOpen] = useState(false)
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false)
  const { settings, set } = useBg()
  const { plugins } = usePlugins()
  const navigate = useNavigate()
  const enabledPlugins = plugins.filter(p => p.enabled)

  // Persist state on change
  useEffect(() => {
    saveHomeState({ layoutIdx, spreadFactor, nodeOverrides })
  }, [layoutIdx, spreadFactor, nodeOverrides])

  const ids = useMemo(() => toolCategories.map(c => c.id), [])
  const labels = useMemo(() => toolCategories.map(c => c.name), [])

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setDims({ w: containerRef.current.clientWidth, h: containerRef.current.clientHeight })
      }
    }
    update(); window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Reset spread when layout changes
  const selectLayout = (idx: number) => {
    setLayoutIdx(idx)
    setNodeOverrides({})
    setSpreadFactor(1.0)
    setLayoutPanelOpen(false)
  }

  const baseNodes = useMemo(() => generateNodeLayout(ids, labels, dims.w, dims.h, LAYOUTS[layoutIdx]), [dims, ids, labels, layoutIdx])

  // Scale node positions by spread factor (relative to center)
  const scaledNodes: GraphNode[] = useMemo(() => {
    const cx = dims.w / 2
    const cy = dims.h / 2
    return baseNodes.map(n => ({
      ...n,
      x: cx + (n.x - cx) * spreadFactor,
      y: cy + (n.y - cy) * spreadFactor,
    }))
  }, [baseNodes, spreadFactor, dims])

  // Merge overrides on top of scaled positions
  const liveNodes: GraphNode[] = useMemo(() => {
    return scaledNodes.map(n => {
      const override = nodeOverrides[n.id]
      if (override) return { ...n, x: override.x, y: override.y }
      return n
    })
  }, [scaledNodes, nodeOverrides])

  // Compute connected-pair distances for the distance panel
  const distanceRows: DistanceRow[] = useMemo(() => {
    const seen = new Set<string>()
    const rows: DistanceRow[] = []
    for (let i = 0; i < liveNodes.length; i++) {
      const a = liveNodes[i]
      const catA = toolCategories.find(c => c.id === a.id)
      for (const j of a.connections) {
        if (j >= liveNodes.length) continue
        const b = liveNodes[j]
        const key = [i, j].sort().join('-')
        if (seen.has(key)) continue
        seen.add(key)
        const catB = toolCategories.find(c => c.id === b.id)
        const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
        rows.push({
          idA: a.id, labelA: catA?.name ?? a.id,
          idB: b.id, labelB: catB?.name ?? b.id,
          distance: Math.round(dist),
        })
      }
    }
    rows.sort((a, b) => b.distance - a.distance)
    return rows
  }, [liveNodes])

  const maxDistance = useMemo(() => {
    if (distanceRows.length === 0) return 1
    return Math.max(...distanceRows.map(r => r.distance))
  }, [distanceRows])

  // ─── Drag Handlers ───
  const handlePointerDown = useCallback((e: React.PointerEvent, nodeId: string) => {
    e.preventDefault(); e.stopPropagation()
    hasDragged.current = false
    const node = liveNodes.find(n => n.id === nodeId)
    if (!node) return
    setDraggedId(nodeId)
    setDragOffset({ x: e.clientX - node.x, y: e.clientY - node.y })
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [liveNodes])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!draggedId) return
    hasDragged.current = true
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left - dragOffset.x
    const y = e.clientY - rect.top - dragOffset.y
    setNodeOverrides(prev => ({ ...prev, [draggedId]: { x, y } }))
  }, [draggedId, dragOffset])

  const handlePointerUp = useCallback(() => {
    setTimeout(() => { hasDragged.current = false }, 0)
    setDraggedId(null)
  }, [])

  const spreadPct = Math.round(spreadFactor * 100)

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: 'calc(100vh - 0px)', touchAction: 'none' }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Sci-fi header */}
      <div className="absolute top-4 left-16 z-20 pointer-events-none">
        <h1 className="font-display text-2xl md:text-3xl tracking-[0.2em] uppercase gradient-text"
          style={{ textShadow: '0 0 25px rgba(0,242,255,0.6), 0 0 50px rgba(0,242,255,0.3)' }}>
          GEEK CUBE
        </h1>
        <p className="font-mono text-[10px] tracking-widest mt-1" style={{ color: '#444' }}>
          SYS::ONLINE · 拖拽节点
        </p>
      </div>

      {/* ─── Left toolbar ─── */}
      <div className="absolute left-4 z-20 pointer-events-auto" style={{ top: '42%', transform: 'translateY(-50%)' }}>
        <div className="flex flex-col gap-0.5 rounded-2xl overflow-hidden" style={{
          background: 'rgba(8,8,16,.75)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,.06)',
          boxShadow: '0 8px 32px rgba(0,0,0,.4), 0 0 30px rgba(0,240,255,.04)',
        }}>
          {/* Layout */}
          <button onClick={() => { setLayoutPanelOpen(!layoutPanelOpen); setDistancePanelOpen(false); setSettingsPanelOpen(false) }}
            className="group flex items-center gap-3 px-5 py-4 transition-all duration-300 hover:bg-white/[0.04]"
            title="布局切换">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 group-hover:scale-110"
              style={{
                background: layoutPanelOpen ? 'rgba(0,242,255,.15)' : 'rgba(0,242,255,.06)',
                boxShadow: layoutPanelOpen ? '0 0 16px rgba(0,242,255,.25)' : 'none',
              }}>
              <LayoutGrid size={22} style={{ color: layoutPanelOpen ? '#00f2ff' : '#555', transition: 'color 0.3s', filter: layoutPanelOpen ? 'drop-shadow(0 0 6px rgba(0,242,255,.5))' : 'none' }} />
            </div>
            <div className="hidden group-hover:block absolute left-full ml-3 z-50">
              <span className="text-xs font-mono tracking-wider whitespace-nowrap px-3 py-1.5 rounded-lg"
                style={{ background: 'rgba(0,0,0,.8)', border: '1px solid rgba(0,242,255,.2)', color: '#00f2ff' }}>布局</span>
            </div>
          </button>

          <div className="h-px mx-3" style={{ background: 'rgba(255,255,255,.04)' }} />

          {/* Distance */}
          <button onClick={() => { setDistancePanelOpen(!distancePanelOpen); setLayoutPanelOpen(false); setSettingsPanelOpen(false) }}
            className="group flex items-center gap-3 px-5 py-4 transition-all duration-300 hover:bg-white/[0.04]"
            title="间距缩放">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 group-hover:scale-110"
              style={{
                background: distancePanelOpen ? 'rgba(0,255,136,.15)' : 'rgba(0,255,136,.06)',
                boxShadow: distancePanelOpen ? '0 0 16px rgba(0,255,136,.25)' : 'none',
              }}>
              <Gauge size={22} style={{ color: distancePanelOpen ? '#00ff88' : '#555', transition: 'color 0.3s', filter: distancePanelOpen ? 'drop-shadow(0 0 6px rgba(0,255,136,.5))' : 'none' }} />
            </div>
          </button>

          <div className="h-px mx-3" style={{ background: 'rgba(255,255,255,.04)' }} />

          {/* Settings */}
          <button onClick={() => { setSettingsPanelOpen(!settingsPanelOpen); setLayoutPanelOpen(false); setDistancePanelOpen(false) }}
            className="group flex items-center gap-3 px-5 py-4 transition-all duration-300 hover:bg-white/[0.04]"
            title="背景设置">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 group-hover:scale-110"
              style={{
                background: settingsPanelOpen ? 'rgba(255,0,170,.15)' : 'rgba(255,0,170,.06)',
                boxShadow: settingsPanelOpen ? '0 0 16px rgba(255,0,170,.25)' : 'none',
              }}>
              <Settings size={22} style={{ color: settingsPanelOpen ? '#ff00aa' : '#555', transition: 'color 0.3s', filter: settingsPanelOpen ? 'drop-shadow(0 0 6px rgba(255,0,170,.5))' : 'none' }} />
            </div>
          </button>

          <div className="h-px mx-3" style={{ background: 'rgba(255,255,255,.04)' }} />

          {/* Plugin Workshop */}
          <button onClick={() => navigate('/tools/plugin-manager')}
            className="group flex items-center gap-3 px-5 py-4 transition-all duration-300 hover:bg-white/[0.04]"
            title="插件工坊">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 group-hover:scale-110"
              style={{ background: 'rgba(184,71,240,.06)' }}>
              <Puzzle size={22} style={{ color: '#555', transition: 'color 0.3s', filter: 'none' }}
                className="group-hover:![color:#b847f0] group-hover:![filter:drop-shadow(0_0_6px_rgba(184,71,240,.5))]" />
            </div>
          </button>
        </div>
      </div>

      {/* ─── Layout Panel ─── */}
      {layoutPanelOpen && (
        <div className="fixed inset-0 z-30" onClick={() => setLayoutPanelOpen(false)}>
          <div className="absolute left-20 z-40 animate-scaleIn" style={{ top: '50%', transform: 'translateY(-50%)' }} onClick={e => e.stopPropagation()}>
            <div className="rounded-2xl p-5 w-56" style={{
              background: 'rgba(8,8,20,.92)', backdropFilter: 'blur(30px)',
              border: '1px solid rgba(0,242,255,.12)',
              boxShadow: '0 20px 60px rgba(0,0,0,.5), 0 0 30px rgba(0,242,255,.06)',
            }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <LayoutGrid size={14} style={{ color: '#00f2ff' }} />
                  <span className="text-sm font-semibold text-white tracking-wide">布局模式</span>
                </div>
                <button onClick={() => setLayoutPanelOpen(false)} className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.06] transition-colors"><X size={14} /></button>
              </div>
              <div className="space-y-1.5">
                {LAYOUTS.map((layout, idx) => (
                  <button key={layout} onClick={() => selectLayout(idx)} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 group"
                    style={{
                      background: idx === layoutIdx ? 'rgba(0,242,255,.1)' : 'transparent',
                      border: idx === layoutIdx ? '1px solid rgba(0,242,255,.2)' : '1px solid transparent',
                    }}>
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg transition-all group-hover:scale-105"
                      style={{ background: idx === layoutIdx ? 'rgba(0,242,255,.15)' : 'rgba(255,255,255,.03)' }}>
                      <LayoutGrid size={14} style={{ color: idx === layoutIdx ? '#00f2ff' : '#555' }} />
                    </div>
                    <span className="text-sm font-medium" style={{ color: idx === layoutIdx ? '#00f2ff' : '#999' }}>{LAYOUT_NAMES[layout]}</span>
                    {idx === layoutIdx && <span className="ml-auto w-2 h-2 rounded-full" style={{ background: '#00f2ff', boxShadow: '0 0 6px #00f2ff' }} />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Distance / Spacing Panel ─── */}
      {distancePanelOpen && (
        <div className="fixed inset-0 z-30" onClick={() => setDistancePanelOpen(false)}>
          <div className="absolute left-20 z-40 animate-scaleIn" style={{ top: '50%', transform: 'translateY(-50%)', maxHeight: '85vh' }} onClick={e => e.stopPropagation()}>
            <div className="rounded-2xl p-5 w-72" style={{
              background: 'rgba(8,8,20,.92)', backdropFilter: 'blur(30px)',
              border: '1px solid rgba(0,255,136,.12)',
              boxShadow: '0 20px 60px rgba(0,0,0,.5), 0 0 30px rgba(0,255,136,.06)',
            }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Gauge size={14} style={{ color: '#00ff88' }} />
                  <span className="text-sm font-semibold text-white tracking-wide">间距缩放</span>
                </div>
                <button onClick={() => setDistancePanelOpen(false)} className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.06] transition-colors"><X size={14} /></button>
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500">缩放比例</span>
                <span className="text-lg font-bold font-mono" style={{ color: '#00ff88', textShadow: '0 0 10px rgba(0,255,136,.3)' }}>{spreadPct}%</span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <button onClick={() => setSpreadFactor(Math.max(0.3, spreadFactor - 0.05))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/[0.06] transition-colors"
                  style={{ color: '#888' }}><Minus size={14} /></button>
                <input type="range" min="30" max="300" value={spreadPct} onChange={e => setSpreadFactor(Number(e.target.value) / 100)}
                  className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: '#00ff88' }} />
                <button onClick={() => setSpreadFactor(Math.min(3.0, spreadFactor + 0.05))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/[0.06] transition-colors"
                  style={{ color: '#888' }}><Plus size={14} /></button>
              </div>

              <div className="flex gap-1.5 mb-4">
                {[{ label: '紧凑', val: 0.5 }, { label: '默认', val: 1.0 }, { label: '松散', val: 1.5 }, { label: '分散', val: 2.5 }]
                  .map(p => (
                    <button key={p.label} onClick={() => setSpreadFactor(p.val)}
                      className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                      style={{
                        background: spreadFactor === p.val ? 'rgba(0,255,136,.12)' : 'rgba(255,255,255,.02)',
                        border: `1px solid ${spreadFactor === p.val ? 'rgba(0,255,136,.25)' : 'rgba(255,255,255,.05)'}`,
                        color: spreadFactor === p.val ? '#00ff88' : '#777',
                      }}>{p.label}</button>))}
              </div>

              <div className="h-px mb-4" style={{ background: 'rgba(0,255,136,.06)' }} />

              <div className="max-h-[35vh] overflow-y-auto space-y-2">
                {distanceRows.length === 0 ? (
                  <p className="text-sm text-gray-600 text-center py-4">无连接数据</p>
                ) : (
                  distanceRows.map(row => {
                    const pct = (row.distance / maxDistance) * 100
                    const barColor = pct > 70 ? '#ff3366' : pct > 40 ? '#e6b800' : '#00ff88'
                    return (
                      <div key={`${row.idA}-${row.idB}`} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] text-gray-400 truncate">{row.labelA} ↔ {row.labelB}</span>
                          <span className="text-[10px] font-mono text-gray-500">{row.distance}px</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(pct, 3)}%`, background: barColor, boxShadow: `0 0 6px ${barColor}40` }} />
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Settings Panel ─── */}
      {settingsPanelOpen && (
        <div className="fixed inset-0 z-30" onClick={() => setSettingsPanelOpen(false)}>
          <div className="absolute left-20 z-40 animate-scaleIn" style={{ top: '50%', transform: 'translateY(-50%)' }} onClick={e => e.stopPropagation()}>
            <div className="rounded-2xl p-5 w-56" style={{
              background: 'rgba(8,8,20,.92)', backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255,0,170,.12)',
              boxShadow: '0 20px 60px rgba(0,0,0,.5), 0 0 30px rgba(255,0,170,.06)',
            }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Settings size={14} style={{ color: '#ff00aa' }} />
                  <span className="text-sm font-semibold text-white tracking-wide">背景主题</span>
                </div>
                <button onClick={() => setSettingsPanelOpen(false)} className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.06] transition-colors"><X size={14} /></button>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 px-3">霓虹主题</div>
                {([
                  { k: 'cyan' as ThemeName, l: '青 Cyber', c: '#00f0ff' },
                  { k: 'green' as ThemeName, l: '绿 Matrix', c: '#00ff41' },
                  { k: 'amber' as ThemeName, l: '琥珀 Warm', c: '#ffaa00' },
                  { k: 'magenta' as ThemeName, l: '品红 Neo', c: '#ff00aa' },
                ]).map(({ k, l, c }) => (
                  <button key={k} onClick={() => set({ theme: k })} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200"
                    style={{
                      background: settings.theme === k ? `${c}12` : 'transparent',
                      border: settings.theme === k ? `1px solid ${c}30` : '1px solid transparent',
                    }}>
                    <span className="w-3 h-3 rounded-full" style={{ background: c, boxShadow: settings.theme === k ? `0 0 8px ${c}` : 'none' }} />
                    <span className="text-sm font-medium" style={{ color: settings.theme === k ? c : '#999' }}>{l}</span>
                  </button>
                ))}
              </div>

              <div className="h-px mx-1" style={{ background: 'rgba(255,255,255,.04)' }} />

              <div className="space-y-1">
                <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 px-3">背景效果</div>
                {[
                  { k: 'particles' as const, l: '粒子连线' },
                  { k: 'grid' as const, l: '网格' },
                  { k: 'matrixBg' as const, l: '矩阵数据流' },
                  { k: 'binaryRain' as const, l: '二进制雨' },
                  { k: 'starfield' as const, l: '星空' },
                  { k: 'circuit' as const, l: '电路板' },
                  { k: 'matrixRain' as const, l: '矩阵雨 Canvas' },
                  { k: 'crtScanlines' as const, l: 'CRT 扫描线' },
                ].map(({ k, l }) => (
                  <button key={k} onClick={() => {
                    if (k === 'binaryRain' || k === 'matrixBg' || k === 'circuit') {
                      set({ binaryRain: k === 'binaryRain' ? !settings.binaryRain : false, matrixBg: k === 'matrixBg' ? !settings.matrixBg : false, circuit: k === 'circuit' ? !settings.circuit : false })
                    } else if (k === 'particles') set({ particles: !settings.particles })
                    else if (k === 'grid') set({ grid: !settings.grid })
                    else if (k === 'crtScanlines') set({ crtScanlines: !settings.crtScanlines })
                    else if (k === 'starfield') set({ starfield: !settings.starfield })
                    else if (k === 'matrixRain') set({ matrixRain: !settings.matrixRain })
                  }} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 group"
                    style={{
                      background: settings[k] ? 'rgba(255,0,170,.08)' : 'transparent',
                      border: settings[k] ? '1px solid rgba(255,0,170,.18)' : '1px solid transparent',
                    }}>
                    <div className="flex-1 text-left">
                      <span className="text-sm font-medium" style={{ color: settings[k] ? '#ff00aa' : '#999' }}>{l}</span>
                    </div>
                    <div className="w-8 h-5 rounded-full relative transition-colors"
                      style={{ background: settings[k] ? 'rgba(255,0,170,.3)' : 'rgba(255,255,255,.06)' }}>
                      <div className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
                        style={{
                          left: settings[k] ? '14px' : '2px',
                          background: settings[k] ? '#ff00aa' : '#555',
                          boxShadow: settings[k] ? '0 0 6px rgba(255,0,170,.4)' : 'none',
                        }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Canvas connections */}
      <NodeGraph
        nodes={liveNodes}
        hoveredId={hoveredId}
        containerRef={containerRef}
      />

      {/* Floating nodes with drag */}
      {liveNodes.map((node) => {
        const cat = toolCategories.find(c => c.id === node.id)
        if (!cat) return null
        const Icon = CAT_ICONS[cat.id] || Boxes
        const isHovered = hoveredId === node.id
        const isDragged = draggedId === node.id

        return (
          <Link
            key={node.id}
            to={`/category/${cat.id}`}
            draggable={false}
            className="absolute z-10 flex flex-col items-center gap-2 select-none"
            style={{
              left: node.x, top: node.y,
              transform: `translate(-50%, -50%) ${isHovered || isDragged ? 'scale(1.15)' : 'scale(1)'}`,
              transition: isDragged ? 'none' : 'transform 0.3s cubic-bezier(0.175,0.885,0.32,1.275)',
              cursor: isDragged ? 'grabbing' : 'grab',
              zIndex: isDragged ? 50 : 10,
            }}
            onPointerDown={(e) => handlePointerDown(e, node.id)}
            onMouseEnter={() => { if (!draggedId) setHoveredId(node.id) }}
            onMouseLeave={() => { if (!draggedId) setHoveredId(null) }}
            onClick={(e) => { if (hasDragged.current) { e.preventDefault(); hasDragged.current = false } }}
          >
            <div
              className="flex items-center justify-center w-16 h-16 transition-all duration-300"
              style={{
                borderRadius: '30%',
                background: isHovered || isDragged
                  ? 'rgba(0,242,255,0.12)'
                  : 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: isHovered || isDragged
                  ? '1px solid rgba(0,242,255,0.4)'
                  : '1px solid rgba(255,255,255,0.06)',
                boxShadow: isHovered || isDragged
                  ? '0 0 25px rgba(0,242,255,0.3), 0 0 50px rgba(0,242,255,0.1), inset 0 0 15px rgba(0,242,255,0.05)'
                  : 'none',
              }}
            >
              <Icon size={26} style={{
                color: isHovered || isDragged ? '#00f2ff' : '#888',
                filter: isHovered || isDragged ? 'drop-shadow(0 0 8px rgba(0,242,255,0.6))' : 'none',
                transition: 'all 0.3s',
              }} />
            </div>
            <span
              className="font-mono text-[10px] tracking-wider uppercase text-center transition-colors duration-300"
              style={{
                color: isHovered || isDragged ? '#00f2ff' : '#555',
                textShadow: isHovered || isDragged ? '0 0 8px rgba(0,242,255,0.4)' : 'none',
              }}
            >
              {cat.name}
            </span>
          </Link>
        )
      })}

      {/* Plugin widgets */}
      {enabledPlugins.length > 0 && (
        <div className="absolute bottom-16 left-4 right-4 z-20 flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
          {enabledPlugins.map(p => (
            <Link key={p.id} to={`/plugins/${p.id}`}
              className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all hover:scale-105"
              style={{
                background: 'rgba(184,71,240,.1)',
                border: '1px solid rgba(184,71,240,.2)',
                backdropFilter: 'blur(12px)',
              }}>
              <Puzzle size={14} style={{ color: '#b847f0' }} />
              <span className="text-xs font-medium whitespace-nowrap" style={{ color: '#d0a0f0' }}>{p.name}</span>
              <span className="text-[9px] font-mono" style={{ color: 'rgba(184,71,240,.4)' }}>v{p.version}</span>
            </Link>
          ))}
        </div>
      )}

      {/* Status bar */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <BreathingDot size={5} color="#0f0" />
          <span className="font-mono text-[10px] tracking-wider" style={{ color: '#555' }}>
            NODES: {ids.length} · 缩放: {spreadPct}% · {draggedId ? '拖拽中' : '运行中'}
          </span>
        </div>
        <span className="font-mono text-[10px] tracking-wider" style={{ color: '#444' }}>
          {toolCategories.reduce((s, c) => s + c.tools.length, 0)} TOOLS
        </span>
      </div>
    </div>
  )
}
