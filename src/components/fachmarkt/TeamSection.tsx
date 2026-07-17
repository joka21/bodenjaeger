import Image from 'next/image'
import { Phone } from 'lucide-react'
import { TEAM } from '@/content/fachmarkt'
import CtaButton from '@/components/shared/CtaButton'
import Reveal from '@/components/shared/Reveal'

/** Sektion 11: Einzelne Mitarbeiter mit Porträtfoto (Name/Funktion/Telefon) + CTA. */
export default function TeamSection() {
  const { kicker, headline, mitglieder, cta } = TEAM

  return (
    <section id="team" className="scroll-mt-24 py-24 md:py-32">
      <div className="content-container">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-brand">{kicker}</p>
          <h2 className="font-bold text-dark" style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)' }}>
            {headline}
          </h2>
        </Reveal>

        {/* Einzelne Mitarbeiter mit Porträtfoto */}
        <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {mitglieder.map((m, i) => (
            <Reveal key={i} as="li" delay={i * 80} className="text-center">
              <div className="relative mx-auto aspect-[3/4] w-full overflow-hidden rounded-3xl bg-ash">
                <Image
                  src={m.foto}
                  alt={`${m.name} – ${m.funktion} im Bodenjäger Fachmarkt Hückelhoven`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <p className="mt-5 text-xl font-bold text-dark">{m.name}</p>
              <p className="mt-1 text-mid">{m.funktion}</p>
              <a
                href={m.telefon}
                className="mt-3 inline-flex items-center justify-center gap-2 font-bold text-brand hover:underline"
              >
                <Phone className="h-4 w-4" />
                Anrufen
              </a>
            </Reveal>
          ))}
        </ul>

        <div className="mt-16 text-center">
          <CtaButton cta={cta} size="lg" />
        </div>
      </div>
    </section>
  )
}
