import { ABSCHLUSS } from '@/content/fachmarkt'
import CtaButton from './CtaButton'
import Reveal from './Reveal'

/** Sektion 13: Dunkles Vollbild-Band mit 2 CTAs. */
export default function AbschlussCta() {
  return (
    <section className="bg-dark py-20 text-white md:py-28">
      <Reveal className="content-container text-center">
        <h2 className="mx-auto max-w-3xl font-bold" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
          {ABSCHLUSS.headline}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-white/80">{ABSCHLUSS.subline}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {ABSCHLUSS.ctas.map((cta) => (
            <CtaButton key={cta.label} cta={cta} size="lg" />
          ))}
        </div>
      </Reveal>
    </section>
  )
}
