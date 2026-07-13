import { Check } from 'lucide-react'
import { VERLEGE_VERTRAUEN } from '@/content/verlegeservice'
import Reveal from '@/components/shared/Reveal'

/** Vertrauensbereich (dunkel/anthrazit): 7 Vorteile. Keine Bewertungen (nicht vorhanden). */
export default function VertrauenSection() {
  const { headline, vorteile } = VERLEGE_VERTRAUEN

  return (
    <section className="bg-dark py-28 text-white md:py-40">
      <div className="content-container">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-bold" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            {headline}
          </h2>
        </Reveal>

        <Reveal className="mx-auto max-w-3xl">
          <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {vorteile.map((v) => (
              <li key={v} className="flex items-start gap-3">
                <Check className="mt-0.5 h-6 w-6 flex-shrink-0 text-brand" strokeWidth={3} />
                <span className="text-lg text-white/90">{v}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
