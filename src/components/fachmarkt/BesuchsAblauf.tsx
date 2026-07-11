import { BESUCHS_ABLAUF } from '@/content/fachmarkt'
import Reveal from './Reveal'

/** Sektion 5: Ablauf in 5 Schritten. Desktop horizontal, Mobile vertikal. */
export default function BesuchsAblauf() {
  const { kicker, headline, schritte } = BESUCHS_ABLAUF

  return (
    <section className="py-24 md:py-32">
      <div className="content-container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-brand">{kicker}</p>
          <h2 className="font-bold text-dark" style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)' }}>
            {headline}
          </h2>
        </Reveal>

        {/* Desktop: horizontale Timeline */}
        <div className="relative mt-16 hidden md:block">
          <div className="absolute left-0 right-0 top-6 h-0.5 bg-ash" aria-hidden />
          <ol className="relative grid grid-cols-5 gap-6">
            {schritte.map((s, i) => (
              <Reveal as="li" key={s.nr} delay={i * 120} className="text-center">
                <span className="relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
                  {s.nr}
                </span>
                <h3 className="mt-4 font-bold text-dark">{s.titel}</h3>
                <p className="mt-2 text-sm text-mid">{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>

        {/* Mobile: vertikale Timeline */}
        <ol className="relative mt-12 space-y-8 md:hidden">
          <div className="absolute bottom-4 left-6 top-4 w-0.5 bg-ash" aria-hidden />
          {schritte.map((s) => (
            <li key={s.nr} className="relative flex gap-4">
              <span className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
                {s.nr}
              </span>
              <div className="pt-1">
                <h3 className="font-bold text-dark">{s.titel}</h3>
                <p className="mt-1 text-mid">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
