import { Check } from 'lucide-react'
import { VERLEGE_AUFMASS } from '@/content/verlegeservice'
import Reveal from '@/components/shared/Reveal'

/** Aufmaß-Checkliste: 8 Prüfpunkte + Kurztext. */
export default function AufmassCheckliste() {
  const { headline, punkte, kurztext } = VERLEGE_AUFMASS

  return (
    <section className="py-24 md:py-32">
      <div className="content-container">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-bold text-dark" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            {headline}
          </h2>
        </Reveal>

        <Reveal className="mx-auto max-w-3xl rounded-2xl border border-ash bg-white p-6 shadow-sm md:p-8">
          <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {punkte.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand" strokeWidth={3} />
                <span className="text-dark">{p}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-mid">{kurztext}</p>
        </Reveal>
      </div>
    </section>
  )
}
