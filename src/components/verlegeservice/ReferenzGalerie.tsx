import { VERLEGE_REFERENZEN } from '@/content/verlegeservice'
import CtaButton from '@/components/shared/CtaButton'
import Reveal from '@/components/shared/Reveal'
import BildPlatzhalter from '@/components/shared/BildPlatzhalter'

/**
 * Referenzen / Vorher-Nachher. Bilder liegen noch nicht vor → sichtbare
 * Platzhalter im korrekten Seitenverhältnis (4:3), damit der Kunde Format und
 * Bildbedarf beurteilen kann.
 */
export default function ReferenzGalerie() {
  const { headline, karten, platzhalterLabel, cta } = VERLEGE_REFERENZEN

  return (
    <section className="py-24 md:py-32">
      <div className="content-container">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="font-bold text-dark" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            {headline}
          </h2>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {karten.map((k, i) => (
            <Reveal key={k.titel} delay={i * 80}>
              <figure>
                <BildPlatzhalter ratio="4 / 3" label={platzhalterLabel} hinweis={k.titel} />
                <figcaption className="mt-3 text-sm font-medium text-dark">{k.titel}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center">
          <CtaButton cta={cta} size="lg" />
        </Reveal>
      </div>
    </section>
  )
}
