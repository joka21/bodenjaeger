import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SERVICE_HERO } from '@/content/service'
import CtaButton from '@/components/shared/CtaButton'
import Reveal from '@/components/shared/Reveal'

/** Hero: Desktop zweispaltig (Text links, Bild rechts), mobil einspaltig. */
export default function ServiceHero() {
  return (
    <section className="py-20 md:py-28">
      <div className="content-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <h1
            className="font-bold leading-[1.08] text-dark"
            style={{ fontSize: 'clamp(2.25rem, 5vw, 3.75rem)' }}
          >
            {SERVICE_HERO.headline}
          </h1>
          <p className="mt-6 text-lg text-mid md:text-xl">{SERVICE_HERO.subline}</p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            {SERVICE_HERO.ctas.map((cta) => (
              <CtaButton key={cta.label} cta={cta} size="lg" />
            ))}
          </div>

          <Link
            href={SERVICE_HERO.sekundaerLink.href}
            className="mt-6 inline-flex items-center gap-2 font-bold text-brand hover:underline"
          >
            {SERVICE_HERO.sekundaerLink.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <Reveal delay={120} className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-md">
          <Image
            src={SERVICE_HERO.image}
            alt={SERVICE_HERO.imageAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </Reveal>
      </div>
    </section>
  )
}
