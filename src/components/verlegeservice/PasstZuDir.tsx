import { Check } from 'lucide-react'
import { VERLEGE_PASST } from '@/content/verlegeservice'
import Reveal from '@/components/shared/Reveal'

/** "Der Verlegeservice passt zu dir, wenn …" — 7 Checkliste-Punkte. */
export default function PasstZuDir() {
  const { headline, punkte } = VERLEGE_PASST

  return (
    <section className="py-24 md:py-32">
      <div className="content-container">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-bold text-dark" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            {headline}
          </h2>
        </Reveal>

        <Reveal className="mx-auto max-w-3xl">
          <ul className="space-y-4">
            {punkte.map((p) => (
              <li key={p} className="flex items-start gap-3 rounded-2xl border border-ash bg-white p-5 shadow-sm">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand" strokeWidth={3} />
                <span className="text-dark">{p}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
