import { Phone, Clock } from 'lucide-react'
import { SERVICE_KONTAKT } from '@/content/service'
import CtaButton from '@/components/shared/CtaButton'
import Reveal from '@/components/shared/Reveal'

/** Kontakt-CTA am Seitenende (dunkles Band): Headline, Telefon, Öffnungszeiten, CTAs. */
export default function ServiceKontaktCta() {
  const { headline, text, telefonAnzeige, telefonLink, oeffnungszeiten, cta, ctaSekundaer } =
    SERVICE_KONTAKT

  return (
    <section id="kontakt" className="scroll-mt-24 bg-dark py-28 text-white md:py-40">
      <Reveal className="content-container text-center">
        <h2 className="mx-auto max-w-3xl font-bold" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
          {headline}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-white/80">{text}</p>

        <a
          href={telefonLink}
          className="mt-8 inline-flex items-center gap-3 text-2xl font-bold hover:text-brand md:text-3xl"
        >
          <Phone className="h-7 w-7 text-brand" />
          {telefonAnzeige}
        </a>

        <p className="mt-4 flex items-center justify-center gap-2 text-white/70">
          <Clock className="h-4 w-4 text-brand" />
          {oeffnungszeiten}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <CtaButton cta={cta} size="lg" />
          <CtaButton cta={ctaSekundaer} size="lg" />
        </div>
      </Reveal>
    </section>
  )
}
