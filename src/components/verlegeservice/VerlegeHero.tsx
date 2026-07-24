import Image from 'next/image'
import { Check, Phone } from 'lucide-react'
import { VERLEGE_HERO } from '@/content/verlegeservice'
import CtaButton from '@/components/shared/CtaButton'
import Reveal from '@/components/shared/Reveal'
import BildPlatzhalter from '@/components/shared/BildPlatzhalter'

/** Hero: zweispaltig (Text/CTAs links, Verlegebild rechts), einspaltig mobil. */
export default function VerlegeHero() {
  const { headline, subline, trustZeile, badges, image, imageAlt, ctaPrimaer, ctaSekundaer, telefonText, telefonLink } = VERLEGE_HERO

  return (
    <section className="py-20 md:py-28">
      <div className="content-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <h1 className="font-bold leading-[1.08] text-dark" style={{ fontSize: 'clamp(2.25rem, 5vw, 3.75rem)' }}>
            {headline}
          </h1>
          <p className="mt-6 text-lg text-mid md:text-xl">{subline}</p>

          {/* Trust-Zeile */}
          <p className="mt-5 text-sm font-medium text-mid">
            {trustZeile.join(' · ')}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <CtaButton cta={ctaPrimaer} size="lg" />
            <CtaButton cta={ctaSekundaer} size="lg" />
          </div>

          <a href={telefonLink} className="mt-6 inline-flex items-center gap-2 font-bold text-dark hover:text-brand">
            <Phone className="h-5 w-5 text-brand" />
            {telefonText}
          </a>

          {/* Vorteil-Badges */}
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {badges.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm font-medium text-dark">
                <Check className="h-4 w-4 flex-shrink-0 text-brand" strokeWidth={3} />
                {b}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120}>
          {image ? (
            <div
              className="relative w-full overflow-hidden rounded-2xl shadow-sm"
              style={{ aspectRatio: '4 / 3' }}
            >
              <Image
                src={image}
                alt={imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <BildPlatzhalter ratio="4 / 3" label="Platzhalter — Bild folgt" hinweis={imageAlt} />
          )}
        </Reveal>
      </div>
    </section>
  )
}
