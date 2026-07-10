import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import {
  STANDORT,
  STANDORT_SEKTION,
  OEFFNUNGSZEITEN,
  MAPS_ROUTE_URL,
  MAPS_EMBED_URL,
} from '@/content/fachmarkt'
import CtaButton from './CtaButton'
import Reveal from './Reveal'

/** Sektion 12: Adresse, Öffnungszeiten, Telefon, Maps, Route-CTA. */
export default function StandortSection() {
  return (
    <section id="standort" className="py-16 md:py-24">
      <div className="content-container">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-brand">
            {STANDORT_SEKTION.kicker}
          </p>
          <h2 className="font-bold text-dark" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            {STANDORT_SEKTION.headline}
          </h2>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal className="flex flex-col gap-8 rounded-3xl bg-pale p-8">
            <div>
              <h3 className="flex items-center gap-2 text-xl font-bold text-dark">
                <MapPin className="h-5 w-5 text-brand" />
                {STANDORT.name}
              </h3>
              <address className="mt-3 not-italic text-mid">
                {STANDORT.strasse}
                <br />
                {STANDORT.plz} {STANDORT.ort}
              </address>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <a href={STANDORT.telefonLink} className="flex items-center gap-3 text-mid hover:text-brand">
                <Phone className="h-5 w-5 flex-shrink-0 text-brand" />
                <span className="font-bold">{STANDORT.telefonAnzeige}</span>
              </a>
              <a href={`mailto:${STANDORT.email}`} className="flex items-center gap-3 text-mid hover:text-brand">
                <Mail className="h-5 w-5 flex-shrink-0 text-brand" />
                <span>{STANDORT.email}</span>
              </a>
            </div>

            <div>
              <h4 className="flex items-center gap-2 font-bold text-dark">
                <Clock className="h-5 w-5 text-brand" />
                Öffnungszeiten
              </h4>
              <ul className="mt-3 space-y-1 text-mid">
                {OEFFNUNGSZEITEN.map((o) => (
                  <li key={o.tag} className="flex justify-between gap-4">
                    <span>{o.tag}</span>
                    <span className="text-right">
                      {o.zeit}
                      {'hinweis' in o && o.hinweis && (
                        <span className="block text-xs font-medium text-brand">{o.hinweis}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <CtaButton
              cta={{ label: 'Route planen', href: MAPS_ROUTE_URL, variant: 'primary', external: true }}
              size="lg"
              className="w-full sm:w-auto"
            />
          </Reveal>

          <Reveal delay={120} className="min-h-[360px] overflow-hidden rounded-3xl">
            <iframe
              src={MAPS_EMBED_URL}
              title={`Standort ${STANDORT.name}`}
              aria-label={`Karte: ${STANDORT.name}`}
              className="h-full min-h-[360px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
