'use client'

import { TRUST_STATS } from '@/content/fachmarkt'
import { useInView } from './useInView'
import { useCountUp } from './useCountUp'

function StatCard({
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
    <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-ash">
      <div className="font-bold text-navy" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
        {display}
        <span className="text-brand">{suffix}</span>
      </div>
      <div className="mt-2 text-sm font-medium text-mid">{label}</div>
    </div>
  )
}

/** Sektion 2: 6 Kennzahl-Karten mit Count-up beim Scrollen. */
export default function TrustStats() {
  const [ref, inView] = useInView<HTMLDivElement>()

  return (
    <section className="bg-pale py-16 md:py-20">
      <div ref={ref} className="content-container">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {TRUST_STATS.map((stat) => (
            <StatCard
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
