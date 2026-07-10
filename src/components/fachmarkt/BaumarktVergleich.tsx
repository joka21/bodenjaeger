import { Check, X } from 'lucide-react'
import { VERGLEICH } from '@/content/fachmarkt'
import Reveal from './Reveal'

/** Sektion 8: Zwei-Spalten-Vergleich. Mobil gestapelt, keine Tabelle. */
export default function BaumarktVergleich() {
  return (
    <section className="py-16 md:py-24">
      <div className="content-container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-brand">
            {VERGLEICH.kicker}
          </p>
          <h2 className="font-bold text-dark" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            {VERGLEICH.headline}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Bodenjäger — hervorgehoben */}
          <Reveal className="rounded-3xl bg-dark p-8 text-white shadow-lg">
            <h3 className="text-2xl font-bold">{VERGLEICH.bodenjaeger.titel}</h3>
            <ul className="mt-6 space-y-4">
              {VERGLEICH.bodenjaeger.punkte.map((p) => (
                <li key={p} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand">
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                  </span>
                  <span className="text-white/90">{p}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Baumarkt — zurückhaltend */}
          <Reveal delay={120} className="rounded-3xl border border-ash bg-white p-8">
            <h3 className="text-2xl font-bold text-mid">{VERGLEICH.baumarkt.titel}</h3>
            <ul className="mt-6 space-y-4">
              {VERGLEICH.baumarkt.punkte.map((p) => (
                <li key={p} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-ash">
                    <X className="h-4 w-4 text-mid" strokeWidth={3} />
                  </span>
                  <span className="text-mid">{p}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
