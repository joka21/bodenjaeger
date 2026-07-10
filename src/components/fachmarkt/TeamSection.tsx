import Image from 'next/image'
import { TEAM } from '@/content/fachmarkt'
import Reveal from './Reveal'

/** Sektion 11: Teamfoto + Namen/Funktionen. */
export default function TeamSection() {
  const { kicker, headline, foto, fotoAlt, mitglieder } = TEAM

  return (
    <section className="bg-pale py-16 md:py-24">
      <div className="content-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-ash">
          {/* TODO(kunde): echtes Teamfoto unter public/fachmarkt/ ablegen */}
          <Image
            src={foto}
            alt={fotoAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </Reveal>

        <Reveal delay={120}>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-brand">{kicker}</p>
          <h2 className="font-bold text-dark" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            {headline}
          </h2>
          <ul className="mt-8 divide-y divide-ash">
            {mitglieder.map((m, i) => (
              <li key={i} className="flex items-center justify-between py-4">
                <span className="font-bold text-dark">{m.name}</span>
                <span className="text-mid">{m.funktion}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
