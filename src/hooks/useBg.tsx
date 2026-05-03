import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type ThemeName = 'cyan' | 'green' | 'amber' | 'magenta'

export interface BgSettings {
  particles: boolean
  particleCount: number
  grid: boolean
  scanlines: boolean
  matrixBg: boolean
  crtScanlines: boolean
  hud: boolean
  binaryRain: boolean
  starfield: boolean
  circuit: boolean
  matrixRain: boolean
  theme: ThemeName
}

const defaults: BgSettings = {
  particles: true,
  particleCount: 60,
  grid: true,
  scanlines: false,
  matrixBg: false,
  crtScanlines: false,
  hud: true,
  binaryRain: false,
  starfield: false,
  circuit: false,
  matrixRain: false,
  theme: 'cyan',
}

const KEY = 'geek-cube-bg-settings'

const BgContext = createContext<{
  settings: BgSettings
  set: (s: Partial<BgSettings>) => void
}>({ settings: defaults, set: () => {} })

export function BgProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<BgSettings>(defaults)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY)
      if (saved) setSettings({ ...defaults, ...JSON.parse(saved) })
    } catch { /* localStorage unavailable – use defaults */ }
  }, [])

  /* Apply theme to document */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme)
  }, [settings.theme])

  const set = (partial: Partial<BgSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial }
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }

  return <BgContext.Provider value={{ settings, set }}>{children}</BgContext.Provider>
}

export function useBg() { return useContext(BgContext) }
