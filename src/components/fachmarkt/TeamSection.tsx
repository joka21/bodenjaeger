import Image from 'next/image'
import { Phone } from 'lucide-react'
import { TEAM } from '@/content/fachmarkt'
import CtaButton from '@/components/shared/CtaButton'
import Reveal from '@/components/shared/Reveal'

/** Sektion 11: Großes Teamfoto, darunter Ansprechpartner (Name/Funktion/Telefon) + CTA. */
export default function TeamSection() {
  const { kicker, headline, foto, fotoAlt, mitglieder, cta } = TEAM

  return (
    <section id="team" className="scroll-mt-24 py-24 md:py-32">
      <div className="content-container">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-brand">{kicker}</p>
          <h2 className="font-bold text-dark" style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)' }}>
            {headline}
          </h2>
        </Reveal>

        {/* Großes Teamfoto oben */}
        <Reveal className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl bg-ash md:aspect-[21/9]">
          {/* TODO(kunde): echtes Teamfoto unter public/fachmarkt/ ablegen */}
          <Image
            src={foto}
            alt={fotoAlt}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </Reveal>

        {/* Ansprechpartner */}
        <Reveal className="mt-14">
          <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {mitglieder.map((m, i) => (
              <li key={i} className="text-center sm:text-left">
                <p className="text-xl font-bold text-dark">{m.name}</p>
                <p className="mt-1 text-mid">{m.funktion}</p>
                <a
                  href={m.telefon}
                  className="mt-3 inline-flex items-center justify-center gap-2 font-bold text-brand hover:underline sm:justify-start"
                >
                  <Phone className="h-4 w-4" />
                  Anrufen
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-14 text-center">
            <CtaButton cta={cta} size="lg" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
