import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { FILIAL_ANGEBOTE } from '@/content/fachmarkt'
import type { FilialBanner } from '@/types/fachmarkt'
import Reveal from './Reveal'

interface FilialAngeboteProps {
  banners: FilialBanner[]
}

/**
 * Sektion 6: CMS-gepflegte Angebots-Banner.
 * Fallback: 0 aktive Banner → Sektion wird komplett ausgeblendet (kein Leerraum).
 */
export default function FilialAngebote({ banners }: FilialAngeboteProps) {
  if (!banners || banners.length === 0) return null

  return (
    <section className="bg-dark py-16 text-white md:py-24">
      <div className="content-container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-brand">
            {FILIAL_ANGEBOTE.kicker}
          </p>
          <h2 className="font-bold" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            {FILIAL_ANGEBOTE.headline}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {banners.map((b, i) => {
            const Card = (
              <div className="group relative aspect-[16/9] overflow-hidden rounded-3xl">
                <Image
                  src={b.bild}
                  alt={b.bildAlt || b.titel}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <h3 className="text-2xl font-bold">{b.titel}</h3>
                  {b.untertitel && <p className="mt-2 text-white/85">{b.untertitel}</p>}
                  {b.ctaLabel && b.ctaUrl && (
                    <span className="mt-4 inline-flex items-center gap-2 font-bold text-brand">
                      {b.ctaLabel}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  )}
                </div>
              </div>
            )

            return (
              <Reveal key={b.id} delay={i * 100}>
                {b.ctaUrl ? (
                  <Link href={b.ctaUrl} className="block">
                    {Card}
                  </Link>
                ) : (
                  Card
                )}
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
