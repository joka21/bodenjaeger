import { BESUCHS_ABLAUF } from '@/content/fachmarkt'
import Reveal from '@/components/shared/Reveal'
import Timeline from '@/components/shared/Timeline'

/** Sektion 5: Ablauf in 5 Schritten. Nutzt die geteilte Timeline (light). */
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

        <Timeline steps={[...schritte]} variant="light" className="mt-16" />
      </div>
    </section>
  )
}
