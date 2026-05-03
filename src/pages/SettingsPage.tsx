import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, MonitorSmartphone, Palette, Info } from 'lucide-react'
import { useBg, type BgSettings } from '../hooks/useBg.tsx'
import { Card, Label } from '../components/ui'
import { allTools } from '../utils/tools'

type Section = 'background' | 'appearance' | 'general'

const SECTIONS: { id: Section; label: string; icon: typeof MonitorSmartphone }[] = [
  { id: 'background', label: '背景', icon: MonitorSmartphone },
  { id: 'appearance', label: '外观', icon: Palette },
  { id: 'general', label: '通用', icon: Info },
]

export default function SettingsPage() {
  const [section, setSection] = useState<Section>('background')
  const { settings, set } = useBg()

  return (
    <div className="max-w-4xl mx-auto animate-fadeInUp">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6">
        <ArrowLeft size={16} />返回
      </Link>

      <h2 className="text-2xl font-bold font-display text-white mb-1">设置</h2>
      <p className="text-sm text-gray-400 mb-8">自定义你的极客魔方体验</p>

      <div className="flex gap-6">
        {/* Sidebar */}
        <nav className="w-44 shrink-0 space-y-1">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSection(id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                section === id
                  ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {section === 'background' && <BackgroundSection settings={settings} set={set} />}
          {section === 'appearance' && <AppearanceSection />}
          {section === 'general' && <GeneralSection set={set} />}
        </div>
      </div>
    </div>
  )
}

function BackgroundSection({ settings, set }: { settings: BgSettings; set: (s: Partial<BgSettings>) => void }) {
  return (
    <Card className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-white mb-1">背景设置</h3>
        <p className="text-xs text-gray-500">调整粒子效果、网格和视觉元素</p>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white font-medium">粒子效果</p>
            <p className="text-xs text-gray-500">显示动态粒子背景</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={settings.particles} onChange={e => set({ particles: e.target.checked })} className="sr-only peer" />
            <div className="w-11 h-6 rounded-full peer bg-white/[0.08] peer-checked:bg-neon-cyan/30 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-5 after:h-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full peer-checked:after:bg-neon-cyan" />
          </label>
        </div>

        {settings.particles && (
          <div className="space-y-2 pl-1">
            <div className="flex justify-between"><Label>粒子数量</Label><span className="text-xs font-mono text-neon-cyan">{settings.particleCount}</span></div>
            <input type="range" min={20} max={100} step={10} value={settings.particleCount} onChange={e => set({ particleCount: +e.target.value })} className="w-full accent-neon-cyan" />
          </div>
        )}

        <div className="h-px bg-white/[0.05]" />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white font-medium">网格背景</p>
            <p className="text-xs text-gray-500">显示底层网格纹理</p>
          </div>
          <Toggle checked={settings.grid} onChange={v => set({ grid: v })} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white font-medium">扫描线效果</p>
            <p className="text-xs text-gray-500">CRT 显示器复古扫描线</p>
          </div>
          <Toggle checked={settings.scanlines} onChange={v => set({ scanlines: v })} />
        </div>

        <div className="h-px bg-white/[0.05]" />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white font-medium">矩阵数据流</p>
            <p className="text-xs text-gray-500">《黑客帝国》风格绿色数据流背景</p>
          </div>
          <Toggle checked={settings.matrixBg} onChange={v => set({ matrixBg: v })} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white font-medium">CRT 增强扫描线</p>
            <p className="text-xs text-gray-500">更强的 CRT 显示器效果 + 暗角</p>
          </div>
          <Toggle checked={settings.crtScanlines} onChange={v => set({ crtScanlines: v })} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white font-medium">HUD 状态栏</p>
            <p className="text-xs text-gray-500">底部终端风格系统信息条</p>
          </div>
          <Toggle checked={settings.hud} onChange={v => set({ hud: v })} />
        </div>

        <div className="h-px bg-white/[0.05]" />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white font-medium">二进制雨</p>
            <p className="text-xs text-gray-500">密集 0/1 字符倾泻动画</p>
          </div>
          <Toggle checked={settings.binaryRain} onChange={v => set({ binaryRain: v, matrixBg: false, circuit: false })} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white font-medium">星空背景</p>
            <p className="text-xs text-gray-500">闪烁星场粒子效果</p>
          </div>
          <Toggle checked={settings.starfield} onChange={v => set({ starfield: v })} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white font-medium">矩阵雨 Canvas</p>
            <p className="text-xs text-gray-500">Canvas 实时渲染二进制雨，高性能拖尾效果</p>
          </div>
          <Toggle checked={settings.matrixRain} onChange={v => set({ matrixRain: v })} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white font-medium">电路板纹路</p>
            <p className="text-xs text-gray-500">PCB 走线风格底层纹路</p>
          </div>
          <Toggle checked={settings.circuit} onChange={v => set({ circuit: v, binaryRain: false, matrixBg: false })} />
        </div>
      </div>
    </Card>
  )
}

function AppearanceSection() {
  return (
    <Card className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-white mb-1">外观设置</h3>
        <p className="text-xs text-gray-500">主题和视觉偏好</p>
      </div>
      <p className="text-sm text-gray-500 py-6 text-center">更多外观选项即将推出</p>
    </Card>
  )
}

function GeneralSection({ set }: { set: (s: Partial<BgSettings>) => void }) {
  return (
    <Card className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-white mb-1">通用设置</h3>
        <p className="text-xs text-gray-500">应用信息和重置</p>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between p-3 rounded-xl bg-white/[0.02]"><span className="text-sm text-gray-400">版本</span><span className="text-sm text-white font-mono">1.0.0</span></div>
        <div className="flex justify-between p-3 rounded-xl bg-white/[0.02]"><span className="text-sm text-gray-400">工具数量</span><span className="text-sm text-white font-mono">{allTools.length}</span></div>
        <div className="flex justify-between p-3 rounded-xl bg-white/[0.02]"><span className="text-sm text-gray-400">技术栈</span><span className="text-sm text-white font-mono">React 19 + Vite 8</span></div>
      </div>

      <button
        onClick={() => set({ particles: true, particleCount: 60, grid: true, scanlines: false, matrixBg: false, crtScanlines: false, hud: true, binaryRain: false, starfield: false, circuit: false, matrixRain: false })}
        className="w-full px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors"
      >
        恢复默认背景设置
      </button>
    </Card>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only peer" />
      <div className="w-11 h-6 rounded-full peer bg-white/[0.08] peer-checked:bg-neon-cyan/30 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-5 after:h-5 after:rounded-full after:bg-white after:transition-all after:duration-200 peer-checked:after:translate-x-full peer-checked:after:bg-neon-cyan" />
    </label>
  )
}
