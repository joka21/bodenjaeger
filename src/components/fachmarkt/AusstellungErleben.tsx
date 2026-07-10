import Image from 'next/image'
import { AUSSTELLUNG } from '@/content/fachmarkt'
import CtaButton from './CtaButton'
import Reveal from './Reveal'

/** Sektion 3: Großes Bild + Text + 360°-CTA. */
export default function AusstellungErleben() {
  return (
    <section className="py-16 md:py-24">
      <div className="content-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl">
          <Image
            src={AUSSTELLUNG.image}
            alt={AUSSTELLUNG.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </Reveal>

        <Reveal delay={120}>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-brand">
            {AUSSTELLUNG.kicker}
          </p>
          <h2 className="font-bold text-dark" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            {AUSSTELLUNG.headline}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-mid">{AUSSTELLUNG.text}</p>
          <div className="mt-8">
            {/* TODO(360): echten Rundgang-Link einsetzen, sobald Quelle geklärt */}
            <CtaButton cta={AUSSTELLUNG.cta} size="lg" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
