import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface PipelineEntry {
  data: string
  fromTool: string
  fromToolName: string
  timestamp: number
}

interface PipelineContextType {
  entry: PipelineEntry | null
  push: (data: string, toolId: string, toolName: string) => void
  consume: () => PipelineEntry | null
  clear: () => void
}

const PipelineContext = createContext<PipelineContextType>({
  entry: null,
  push: () => {},
  consume: () => null,
  clear: () => {},
})

export function PipelineProvider({ children }: { children: ReactNode }) {
  const [entry, setEntry] = useState<PipelineEntry | null>(null)

  const push = useCallback((data: string, toolId: string, toolName: string) => {
    setEntry({ data, fromTool: toolId, fromToolName: toolName, timestamp: Date.now() })
  }, [])

  const consume = useCallback(() => {
    const e = entry; setEntry(null); return e
  }, [entry])

  const clear = useCallback(() => setEntry(null), [])

  return (
    <PipelineContext.Provider value={{ entry, push, consume, clear }}>
      {children}
    </PipelineContext.Provider>
  )
}

export function usePipeline() { return useContext(PipelineContext) }
