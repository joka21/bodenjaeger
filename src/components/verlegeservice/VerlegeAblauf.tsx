import { VERLEGE_ABLAUF } from '@/content/verlegeservice'
import CtaButton from '@/components/shared/CtaButton'
import Reveal from '@/components/shared/Reveal'
import Timeline from '@/components/shared/Timeline'

/**
 * Ablauf in 7 Schritten. Dunkler Block, geteilte Timeline (variant 'dark').
 * Hintergrundbild folgt (siehe BILDER-BEDARF.md) — bis dahin anthrazitfarbene Fläche.
 */
export default function VerlegeAblauf() {
  const { headline, schritte, cta } = VERLEGE_ABLAUF

  return (
    <section className="bg-dark py-28 text-white md:py-40">
      <div className="content-container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-bold" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            {headline}
          </h2>
        </Reveal>

        <Timeline steps={[...schritte]} variant="dark" className="mt-16" />

        <Reveal className="mt-14 text-center">
          <CtaButton cta={cta} size="lg" />
        </Reveal>
      </div>
    </section>
  )
}
