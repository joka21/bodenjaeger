import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { BODEN_KATEGORIEN } from '@/content/fachmarkt'
import CtaButton from './CtaButton'
import Reveal from './Reveal'

/** Sektion 7: 6 Bildkarten + CTA. */
export default function BodenKategorien() {
  const { kicker, headline, kategorien, cta } = BODEN_KATEGORIEN

  return (
    <section className="bg-pale py-16 md:py-24">
      <div className="content-container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-brand">{kicker}</p>
          <h2 className="font-bold text-dark" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            {headline}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {kategorien.map((k, i) => (
            <Reveal key={k.titel} delay={i * 80}>
              <Link
                href={k.href}
                className="group relative block aspect-[4/3] overflow-hidden rounded-3xl"
              >
                <Image
                  src={k.image}
                  alt={k.titel}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-6">
                  <h3 className="text-2xl font-bold text-white">{k.titel}</h3>
                  <ArrowRight className="h-6 w-6 text-white transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 text-center">
          <CtaButton cta={cta} size="lg" />
        </div>
      </div>
    </section>
  )
}
