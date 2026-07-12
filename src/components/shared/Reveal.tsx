'use client'

import { useInView, usePrefersReducedMotion } from './useInView'

interface RevealProps {
  children: React.ReactNode
  className?: string
  /** Verzögerung in ms (für gestaffelte Effekte in Grids) */
  delay?: number
  as?: 'div' | 'section' | 'li' | 'article'
}

/**
 * Dezenter Fade-in beim Scrollen. Respektiert `prefers-reduced-motion`
 * (dann sofort sichtbar, ohne Transform). Geteilt: Fachmarkt + Service.
 */
export default function Reveal({ children, className = '', delay = 0, as = 'div' }: RevealProps) {
  const [ref, inView] = useInView<HTMLDivElement>()
  const reduced = usePrefersReducedMotion()
  const Tag = as as 'div'

  const visible = reduced || inView

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible || reduced ? 'none' : 'translateY(24px)',
        transition: reduced
          ? 'none'
          : 'opacity 0.6s ease-out, transform 0.6s ease-out',
        transitionDelay: reduced ? '0ms' : `${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </Tag>
  )
}
