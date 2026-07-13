import { Phone, Clock, MapPin } from 'lucide-react'
import { VERLEGE_KONTAKT } from '@/content/verlegeservice'
import CtaButton from '@/components/shared/CtaButton'
import Reveal from '@/components/shared/Reveal'

/** Kontakt-Alternative neben/unter dem Formular: Telefon, Öffnungszeiten, Adresse, Route-CTA. */
export default function KontaktAlternative() {
  const { headline, text, telefonAnzeige, telefonLink, oeffnungszeiten, adresse, cta } = VERLEGE_KONTAKT

  return (
    <section className="pb-24 md:pb-32">
      <div className="content-container">
        <Reveal className="mx-auto max-w-3xl rounded-2xl border border-ash bg-pale p-6 shadow-sm md:p-8">
          <h2 className="font-bold text-dark" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
            {headline}
          </h2>
          <p className="mt-3 text-mid">{text}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <a href={telefonLink} className="flex items-center gap-3 font-bold text-dark hover:text-brand">
              <Phone className="h-5 w-5 flex-shrink-0 text-brand" />
              {telefonAnzeige}
            </a>
            <p className="flex items-center gap-3 text-mid">
              <Clock className="h-5 w-5 flex-shrink-0 text-brand" />
              {oeffnungszeiten}
            </p>
            <p className="flex items-start gap-3 text-mid sm:col-span-2">
              <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand" />
              {adresse}
            </p>
          </div>

          <div className="mt-6">
            <CtaButton cta={cta} size="md" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
