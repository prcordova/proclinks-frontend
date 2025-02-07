import { useCallback, useRef } from 'react'

export function useDebounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
) {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      fn(...args)
    }, delay)
  }, [fn, delay])
} 