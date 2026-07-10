'use client'

import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from './useInView'

/**
 * Zählt eine Zahl animiert von 0 auf `target` hoch, sobald `start` true wird.
 * Bei `prefers-reduced-motion` wird der Zielwert sofort gesetzt.
 */
export function useCountUp(
  target: number,
  start: boolean,
  { duration = 1600, decimals = 0 }: { duration?: number; decimals?: number } = {},
): string {
  const [value, setValue] = useState(0)
  const reduced = usePrefersReducedMotion()
  const rafRef = useRef<number | null>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    if (!start || startedRef.current) return
    startedRef.current = true

    if (reduced) {
      setValue(target)
      return
    }

    const startTime = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(target * eased)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setValue(target)
      }
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [start, target, duration, reduced])

  return value.toLocaleString('de-DE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}
