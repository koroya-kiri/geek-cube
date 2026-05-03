import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export interface PluginMeta {
  id: string
  name: string
  description: string
  version: string
  author: string
  code: string
  enabled: boolean
  createdAt: number
}

const PLUGIN_KEY = 'geek-cube-plugins'

function loadPlugins(): PluginMeta[] {
  try {
    const raw = localStorage.getItem(PLUGIN_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function savePlugins(plugins: PluginMeta[]) {
  localStorage.setItem(PLUGIN_KEY, JSON.stringify(plugins))
}

interface PluginContextType {
  plugins: PluginMeta[]
  addPlugin: (meta: Omit<PluginMeta, 'createdAt'>) => void
  removePlugin: (id: string) => void
  togglePlugin: (id: string) => void
  updateCode: (id: string, code: string) => void
}

const PluginContext = createContext<PluginContextType>({
  plugins: [],
  addPlugin: () => {},
  removePlugin: () => {},
  togglePlugin: () => {},
  updateCode: () => {},
})

export function PluginProvider({ children }: { children: ReactNode }) {
  const [plugins, setPlugins] = useState<PluginMeta[]>(loadPlugins)

  const addPlugin = useCallback((meta: Omit<PluginMeta, 'createdAt'>) => {
    setPlugins(prev => {
      const next = [...prev.filter(p => p.id !== meta.id), { ...meta, createdAt: Date.now() }]
      savePlugins(next)
      return next
    })
  }, [])

  const removePlugin = useCallback((id: string) => {
    setPlugins(prev => {
      const next = prev.filter(p => p.id !== id)
      savePlugins(next)
      return next
    })
  }, [])

  const togglePlugin = useCallback((id: string) => {
    setPlugins(prev => {
      const next = prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p)
      savePlugins(next)
      return next
    })
  }, [])

  const updateCode = useCallback((id: string, code: string) => {
    setPlugins(prev => {
      const next = prev.map(p => p.id === id ? { ...p, code } : p)
      savePlugins(next)
      return next
    })
  }, [])

  return (
    <PluginContext.Provider value={{ plugins, addPlugin, removePlugin, togglePlugin, updateCode }}>
      {children}
    </PluginContext.Provider>
  )
}

export function usePlugins() { return useContext(PluginContext) }
