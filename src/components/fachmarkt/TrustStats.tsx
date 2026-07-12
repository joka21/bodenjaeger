'use client'

import { TRUST_STATS } from '@/content/fachmarkt'
import { useInView } from '@/components/shared/useInView'
import { useCountUp } from './useCountUp'

function Stat({
  value,
  suffix,
  label,
  decimals,
  start,
}: {
  value: number
  suffix: string
  label: string
  decimals?: number
  start: boolean
}) {
  const display = useCountUp(value, start, { decimals: decimals ?? 0 })
  return (
    <div className="text-center">
      <div
        className="font-bold leading-none text-navy"
        style={{ fontSize: 'clamp(3rem, 7vw, 5rem)' }}
      >
        {display}
        <span className="text-brand">{suffix}</span>
      </div>
      <div className="mt-3 text-sm font-medium uppercase tracking-wide text-mid">
        {label}
      </div>
    </div>
  )
}

/** Sektion 2: 6 Kennzahlen ohne Karten-Optik, Count-up beim Scrollen. */
export default function TrustStats() {
  const [ref, inView] = useInView<HTMLDivElement>()

  return (
    <section className="py-24 md:py-32">
      <div ref={ref} className="content-container">
        <div className="grid grid-cols-2 gap-x-8 gap-y-14 md:grid-cols-3 md:gap-y-20">
          {TRUST_STATS.map((stat) => (
            <Stat
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              decimals={'decimals' in stat ? stat.decimals : 0}
              start={inView}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
