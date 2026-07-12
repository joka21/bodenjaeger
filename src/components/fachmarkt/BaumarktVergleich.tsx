import { Check, X } from 'lucide-react'
import { VERGLEICH } from '@/content/fachmarkt'
import Reveal from '@/components/shared/Reveal'

/** Sektion 8: Zwei gegenüberliegende Flächen (keine Tabelle). Mobil gestapelt. */
export default function BaumarktVergleich() {
  return (
    <section className="py-24 md:py-32">
      <div className="content-container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-brand">
            {VERGLEICH.kicker}
          </p>
          <h2 className="font-bold text-dark" style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)' }}>
            {VERGLEICH.headline}
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {/* Bodenjäger — betont (dunkle Fläche, rote Häkchen) */}
          <Reveal className="rounded-3xl bg-dark p-8 text-white md:p-10">
            <h3 className="text-2xl font-bold md:text-3xl">{VERGLEICH.bodenjaeger.titel}</h3>
            <ul className="mt-8 space-y-5">
              {VERGLEICH.bodenjaeger.punkte.map((p) => (
                <li key={p} className="flex gap-4">
                  <Check className="mt-0.5 h-6 w-6 flex-shrink-0 text-brand" strokeWidth={3} />
                  <span className="text-lg text-white/90">{p}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Baumarkt — gedämpft/anthrazit */}
          <Reveal delay={120} className="rounded-3xl bg-[#33323a] p-8 text-white/55 md:p-10">
            <h3 className="text-2xl font-bold text-white/70 md:text-3xl">
              {VERGLEICH.baumarkt.titel}
            </h3>
            <ul className="mt-8 space-y-5">
              {VERGLEICH.baumarkt.punkte.map((p) => (
                <li key={p} className="flex gap-4">
                  <X className="mt-0.5 h-6 w-6 flex-shrink-0 text-white/40" strokeWidth={3} />
                  <span className="text-lg">{p}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
