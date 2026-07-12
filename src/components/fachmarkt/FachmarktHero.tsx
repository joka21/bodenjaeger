import Image from 'next/image'
import { Check } from 'lucide-react'
import { HERO } from '@/content/fachmarkt'
import CtaButton from '@/components/shared/CtaButton'

/**
 * Sektion 1: Vollbild-Hero. Ein Foto (dezenter Ken-Burns-Zoom), dunkler
 * Verlauf für Lesbarkeit, Headline, 2 CTAs, 4 schlichte Vorteils-Zeilen.
 * Keine Karten/Boxen im Hero.
 */
export default function FachmarktHero() {
  return (
    <section className="relative min-h-[90dvh] w-full overflow-hidden bg-dark md:min-h-screen">
      <Image
        src={HERO.image}
        alt={HERO.imageAlt}
        fill
        priority
        sizes="100vw"
        className="fm-kenburns object-cover"
      />
      {/* Verlauf links → rechts für Lesbarkeit */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(90deg, rgba(46,45,50,0.92) 0%, rgba(46,45,50,0.7) 40%, rgba(46,45,50,0.15) 100%)' }}
      />

      <div className="content-container relative flex min-h-[90dvh] items-center md:min-h-screen">
        <div className="max-w-2xl py-24 text-white">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-white/80">
            {HERO.kicker}
          </p>
          <h1
            className="font-bold leading-[1.03]"
            style={{ fontSize: 'clamp(2.75rem, 6.5vw, 5.75rem)' }}
          >
            {HERO.headline}
          </h1>
          <p
            className="mt-6 text-white/85"
            style={{ fontSize: 'clamp(1.125rem, 2vw, 1.5rem)' }}
          >
            {HERO.subline}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            {HERO.ctas.map((cta) => (
              <CtaButton key={cta.label} cta={cta} size="lg" />
            ))}
          </div>

          {/* Schlichte Zeilen, keine Karten-Optik */}
          <ul className="mt-12 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {HERO.checks.map((check) => (
              <li key={check} className="flex items-center gap-3 text-white/90">
                <Check className="h-5 w-5 flex-shrink-0 text-brand" strokeWidth={3} />
                <span className="text-lg font-medium">{check}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
