import Image from 'next/image'
import { Check } from 'lucide-react'
import { WARUM } from '@/content/fachmarkt'
import Reveal from '@/components/shared/Reveal'

/** Sektion 4: Bild links, 6 Vorteile rechts. */
export default function WarumBodenjaeger() {
  return (
    <section className="bg-pale py-24 md:py-32">
      <div className="content-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative order-1 aspect-[3/4] w-full overflow-hidden rounded-3xl lg:aspect-[4/5]">
          <Image
            src={WARUM.image}
            alt={WARUM.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </Reveal>

        <div className="order-2">
          <Reveal>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-brand">
              {WARUM.kicker}
            </p>
            <h2 className="font-bold text-dark" style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)' }}>
              {WARUM.headline}
            </h2>
          </Reveal>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {WARUM.vorteile.map((v, i) => (
              <Reveal key={v.titel} delay={i * 80}>
                <div className="flex gap-3">
                  <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand">
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                  </span>
                  <div>
                    <h3 className="font-bold text-dark">{v.titel}</h3>
                    <p className="mt-1 text-mid">{v.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
