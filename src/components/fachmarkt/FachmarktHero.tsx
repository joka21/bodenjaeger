import Image from 'next/image'
import { Check } from 'lucide-react'
import { HERO } from '@/content/fachmarkt'
import CtaButton from './CtaButton'

/** Sektion 1: Vollbild-Hero mit Verlauf links, Headline, 3 CTAs, 4 Vorteils-Checks. */
export default function FachmarktHero() {
  return (
    <section className="relative min-h-[88vh] w-full overflow-hidden bg-dark">
      <Image
        src={HERO.image}
        alt={HERO.imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Verlauf links → rechts für Lesbarkeit */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(90deg, rgba(46,45,50,0.92) 0%, rgba(46,45,50,0.7) 40%, rgba(46,45,50,0.15) 100%)' }}
      />

      <div className="content-container relative flex min-h-[88vh] items-center">
        <div className="max-w-2xl py-24 text-white">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-white/80">
            {HERO.kicker}
          </p>
          <h1
            className="font-bold leading-[1.05]"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
          >
            {HERO.headline}
          </h1>
          <p
            className="mt-6 text-white/85"
            style={{ fontSize: 'clamp(1.125rem, 2vw, 1.375rem)' }}
          >
            {HERO.subline}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            {HERO.ctas.map((cta) => (
              <CtaButton key={cta.label} cta={cta} size="lg" />
            ))}
          </div>

          <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {HERO.checks.map((check) => (
              <li key={check} className="flex items-center gap-3 text-white/90">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand">
                  <Check className="h-4 w-4 text-white" strokeWidth={3} />
                </span>
                <span className="font-medium">{check}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
