import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SERVICE_PROJEKT } from '@/content/service'
import Reveal from '@/components/shared/Reveal'

/** "Was brauchst du für dein Projekt?" — 4 große Karten mit rotem Pfeil-Link. */
export default function ProjektEntscheidung() {
  const { headline, karten } = SERVICE_PROJEKT

  return (
    <section className="py-24 md:py-32">
      <div className="content-container">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="font-bold text-dark" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            {headline}
          </h2>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {karten.map((k, i) => (
            <Reveal key={k.titel} delay={i * 80}>
              <Link
                href={k.href}
                className="group flex h-full flex-col rounded-2xl border border-ash bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-md"
              >
                <h3 className="text-xl font-bold text-dark">{k.titel}</h3>
                <p className="mt-3 flex-1 text-mid">{k.text}</p>
                <span className="mt-5 inline-flex items-center gap-2 font-bold text-brand">
                  Mehr erfahren
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
