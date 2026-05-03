import { useState, useEffect, useRef, useCallback, useMemo, createElement, Fragment, type ReactNode } from 'react'

/**
 * Dynamically renders a React component from a code string.
 */
export function DynamicComponent({ code, onError }: { code: string; onError?: (err: string) => void }) {
  const [Comp, setComp] = useState<(() => ReactNode) | null>(null)

  useEffect(() => {
    try {
      const api = { createElement, useState, useEffect, useRef, useCallback, useMemo, Fragment }
      const fn = new Function('api', `with(api) { return (${code}) }`)
      const comp = fn(api)
      setComp(() => comp)
      onError?.('')
    } catch (e) {
      onError?.((e as Error).message)
      setComp(null)
    }
  }, [code])

  if (!Comp) return null
  try {
    return <Comp />
  } catch (e) {
    return <div className="text-red-400 text-sm">渲染错误: {(e as Error).message}</div>
  }
}
