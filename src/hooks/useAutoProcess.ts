import { useEffect, useRef, useCallback } from 'react'

/**
 * Debounced auto-process hook.
 * Calls `fn` after `delay` ms of no input changes.
 * Properly cleans up pending timers to avoid race conditions.
 */
export function useAutoProcess(
  input: string,
  fn: () => void,
  deps: unknown[] = [],
  delay = 250,
  skipEmpty = true
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const fnRef = useRef(fn)
  fnRef.current = fn

  useEffect(() => {
    // Clear any pending timer from previous render
    if (timerRef.current !== undefined) {
      clearTimeout(timerRef.current)
      timerRef.current = undefined
    }

    if (skipEmpty && !input.trim()) {
      fnRef.current() // clear output immediately
      return
    }

    timerRef.current = setTimeout(() => fnRef.current(), delay)

    return () => {
      if (timerRef.current !== undefined) {
        clearTimeout(timerRef.current)
        timerRef.current = undefined
      }
    }
  }, [input, delay, ...deps])
}

/**
 * General debounce utility – returns a debounced version of the callback.
 */
export function useDebouncedCallback<T extends (...args: never[]) => void>(
  cb: T,
  delay: number
): T {
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const cbRef = useRef(cb)
  cbRef.current = cb

  const debounced = useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => cbRef.current(...args), delay)
    },
    [delay]
  ) as T

  useEffect(() => { return () => { if (timerRef.current) clearTimeout(timerRef.current) } }, [])
  return debounced
}
