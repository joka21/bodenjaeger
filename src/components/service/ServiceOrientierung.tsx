import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SERVICE_ORIENTIERUNG } from '@/content/service'
import Reveal from '@/components/shared/Reveal'

/**
 * "Welcher Service passt zu dir?" — Kartenliste (KEINE Tabelle):
 * Situation → Empfehlung als Link. Als Block gedacht (Page ordnet neben FAQ an).
 */
export default function ServiceOrientierung() {
  const { headline, paare } = SERVICE_ORIENTIERUNG

  return (
    <div>
      <h2 className="font-bold text-dark" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}>
        {headline}
      </h2>

      <ul className="mt-8 space-y-4">
        {paare.map((p, i) => (
          <Reveal as="li" key={p.situation} delay={i * 60}>
            <div className="rounded-2xl border border-ash bg-white p-5 shadow-sm md:p-6">
              <p className="font-bold text-dark">{p.situation}</p>
              <Link
                href={p.href}
                className="group mt-2 inline-flex items-center gap-2 font-medium text-brand hover:underline"
              >
                <ArrowRight className="h-4 w-4 flex-shrink-0 transition-transform group-hover:translate-x-1" />
                {p.empfehlung}
              </Link>
            </div>
          </Reveal>
        ))}
      </ul>
    </div>
  )
}
