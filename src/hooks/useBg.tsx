import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

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
