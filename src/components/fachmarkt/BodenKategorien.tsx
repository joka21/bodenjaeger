import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { BODEN_KATEGORIEN } from '@/content/fachmarkt'
import CtaButton from '@/components/shared/CtaButton'
import Reveal from '@/components/shared/Reveal'

/** Sektion 7: 6 große Bildkarten mit Hover-Zoom, dunklem Overlay, rotem Akzent. */
export default function BodenKategorien() {
  const { kicker, headline, kategorien, cta } = BODEN_KATEGORIEN

  return (
    <section id="bodenkategorien" className="scroll-mt-24 bg-pale py-24 md:py-32">
      <div className="content-container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-brand">{kicker}</p>
          <h2 className="font-bold text-dark" style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)' }}>
            {headline}
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {kategorien.map((k, i) => (
            <Reveal key={k.titel} delay={i * 80}>
              <Link
                href={k.href}
                className="group relative block aspect-[4/5] overflow-hidden rounded-3xl"
              >
                <Image
                  src={k.image}
                  alt={k.titel}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                {/* Dunkler Overlay — dauerhaft (auch ohne Hover für Touch lesbar) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  {/* Roter Akzent: Linie, wächst bei Hover */}
                  <span className="block h-1 w-10 rounded-full bg-brand transition-all duration-300 group-hover:w-16" />
                  <div className="mt-4 flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-white md:text-3xl">{k.titel}</h3>
                    <ArrowRight className="h-6 w-6 text-white transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 text-center">
          <CtaButton cta={cta} size="lg" />
        </div>
      </div>
    </section>
  )
}
