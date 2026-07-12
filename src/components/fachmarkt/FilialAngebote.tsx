import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { FILIAL_ANGEBOTE } from '@/content/fachmarkt'
import type { FilialBanner } from '@/types/fachmarkt'
import Reveal from '@/components/shared/Reveal'

interface FilialAngeboteProps {
  banners: FilialBanner[]
}

/** Einzelner Banner (Bild-Fläche mit Verlauf + Text unten). `big` steuert Textgröße. */
function BannerCard({
  banner,
  big = false,
  sizes,
}: {
  banner: FilialBanner
  big?: boolean
  sizes: string
}) {
  const card = (
    <div className="group relative h-full min-h-[280px] overflow-hidden rounded-3xl">
      <Image
        src={banner.bild}
        alt={banner.bildAlt || banner.titel}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <h3 className={big ? 'text-3xl font-bold md:text-4xl' : 'text-2xl font-bold'}>
          {banner.titel}
        </h3>
        {banner.untertitel && <p className="mt-2 text-white/85">{banner.untertitel}</p>}
        {banner.ctaLabel && banner.ctaUrl && (
          <span className="mt-4 inline-flex items-center gap-2 font-bold text-brand">
            {banner.ctaLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        )}
      </div>
    </div>
  )

  return banner.ctaUrl ? (
    <Link href={banner.ctaUrl} className="block h-full">
      {card}
    </Link>
  ) : (
    card
  )
}

/**
 * Sektion "Aktuelle Angebote". Layout-Logik (einfachste saubere Lösung):
 *  - 1 Banner  → volle Breite
 *  - 2 Banner  → zwei gleich große Spalten
 *  - ≥3 Banner → Banner 1 groß (2/3) links, Banner 2+3 kleiner rechts gestapelt;
 *                jeder weitere Banner (ab 4) als volle Breite darunter.
 * Bewusst KEIN Slider (weniger JS, bessere UX — siehe Abschlussbericht).
 * Fallback: 0 aktive Banner → Sektion wird komplett ausgeblendet.
 */
export default function FilialAngebote({ banners }: FilialAngeboteProps) {
  if (!banners || banners.length === 0) return null

  const featured = banners.slice(0, 3)
  const rest = banners.slice(3)

  return (
    <section id="angebote" className="scroll-mt-24 bg-dark py-28 text-white md:py-40">
      <div className="content-container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-brand">
            {FILIAL_ANGEBOTE.kicker}
          </p>
          <h2 className="font-bold" style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)' }}>
            {FILIAL_ANGEBOTE.headline}
          </h2>
        </Reveal>

        <Reveal className="mt-14">
          {featured.length === 1 && (
            <div className="min-h-[360px]">
              <BannerCard banner={featured[0]} big sizes="100vw" />
            </div>
          )}

          {featured.length === 2 && (
            <div className="grid gap-4 md:grid-cols-2 md:gap-6">
              {featured.map((b) => (
                <div key={b.id} className="min-h-[320px]">
                  <BannerCard banner={b} big sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
              ))}
            </div>
          )}

          {featured.length >= 3 && (
            <div className="grid gap-4 md:gap-6 lg:min-h-[640px] lg:grid-cols-3 lg:grid-rows-2">
              <div className="lg:col-span-2 lg:row-span-2">
                <BannerCard
                  banner={featured[0]}
                  big
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>
              <BannerCard banner={featured[1]} sizes="(max-width: 1024px) 100vw, 33vw" />
              <BannerCard banner={featured[2]} sizes="(max-width: 1024px) 100vw, 33vw" />
            </div>
          )}

          {rest.length > 0 && (
            <div className="mt-4 grid gap-4 md:mt-6 md:gap-6">
              {rest.map((b) => (
                <div key={b.id} className="min-h-[320px]">
                  <BannerCard banner={b} big sizes="100vw" />
                </div>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  )
}
