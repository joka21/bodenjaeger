import Image from 'next/image'
import Link from 'next/link'
import { LEISTUNGEN } from '@/content/fachmarkt'
import Reveal from '@/components/shared/Reveal'

/** Sektion 9: 8 Leistungen als Bild + Titel + 1 Satz (statt Icon-Karten). */
export default function LeistungenSection() {
  const { kicker, headline, items } = LEISTUNGEN

  return (
    <section id="leistungen" className="scroll-mt-24 bg-pale py-24 md:py-32">
      <div className="content-container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-brand">{kicker}</p>
          <h2 className="font-bold text-dark" style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)' }}>
            {headline}
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.titel} delay={i * 60}>
              <Link href={item.href} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={item.bild}
                    alt={item.titel}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-4 text-lg font-bold text-dark group-hover:text-brand">
                  {item.titel}
                </h3>
                <p className="mt-1 text-mid">{item.text}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
