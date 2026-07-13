import { Check } from 'lucide-react'
import { VERLEGE_LEISTUNGEN } from '@/content/verlegeservice'
import Reveal from '@/components/shared/Reveal'

/** Mögliche Leistungen: 11 Punkte + Hinweistext. */
export default function LeistungenListe() {
  const { headline, items, hinweis } = VERLEGE_LEISTUNGEN

  return (
    <section className="bg-pale py-24 md:py-32">
      <div className="content-container">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-bold text-dark" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            {headline}
          </h2>
        </Reveal>

        <Reveal className="mx-auto max-w-4xl">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-2xl border border-ash bg-white p-5 shadow-sm">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand" strokeWidth={3} />
                <span className="text-dark">{item}</span>
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-8 max-w-2xl text-center text-mid">{hinweis}</p>
        </Reveal>
      </div>
    </section>
  )
}
