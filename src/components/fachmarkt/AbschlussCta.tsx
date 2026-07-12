'use client'

import Image from 'next/image'
import { MapPin, Phone, Mail, Clock, Map as MapIcon } from 'lucide-react'
import {
  ABSCHLUSS,
  STANDORT,
  OEFFNUNGSZEITEN,
  MAPS_ROUTE_URL,
  MAPS_EMBED_URL,
} from '@/content/fachmarkt'
import { useCookieConsent } from '@/contexts/CookieConsentContext'
import CtaButton from '@/components/shared/CtaButton'
import Reveal from '@/components/shared/Reveal'

/**
 * Sektion 12 + 13 zusammengeführt: dunkles Abschluss-Band mit Hintergrundbild,
 * Headline + CTAs, darunter Standortdaten (Adresse, Kontakt, Öffnungszeiten)
 * und eine Google-Maps-Karte.
 *
 * Consent: Das Maps-Embed lädt externe Google-Inhalte und wird daher erst nach
 * funktionaler Einwilligung gerendert (bestehender CookieConsentContext). Ohne
 * Einwilligung: statischer Platzhalter mit „Karte aktivieren" (öffnet den
 * Consent-Banner) und direktem Google-Maps-Link.
 */
export default function AbschlussCta() {
  const { isAllowed, openBanner } = useCookieConsent()
  const mapsAllowed = isAllowed('functional')

  return (
    <section
      id="kontakt"
      className="relative scroll-mt-24 overflow-hidden bg-dark text-white"
    >
      <Image
        src={ABSCHLUSS.image}
        alt={ABSCHLUSS.imageAlt}
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(46,45,50,0.92) 0%, rgba(46,45,50,0.88) 55%, rgba(46,45,50,0.94) 100%)' }}
      />

      <div className="content-container relative py-28 md:py-40">
        {/* Abschluss-CTA */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="font-bold" style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)' }}>
            {ABSCHLUSS.headline}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/80 md:text-xl">
            {ABSCHLUSS.subline}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {ABSCHLUSS.ctas.map((cta) => (
              <CtaButton key={cta.label} cta={cta} size="lg" />
            ))}
          </div>
        </Reveal>

        {/* Standort */}
        <div className="mt-20 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal className="flex flex-col gap-8">
            <div>
              <h3 className="flex items-center gap-2 text-xl font-bold">
                <MapPin className="h-5 w-5 text-brand" />
                {STANDORT.name}
              </h3>
              <address className="mt-3 not-italic text-white/80">
                {STANDORT.strasse}
                <br />
                {STANDORT.plz} {STANDORT.ort}
              </address>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <a href={STANDORT.telefonLink} className="flex items-center gap-3 text-white/80 hover:text-brand">
                <Phone className="h-5 w-5 flex-shrink-0 text-brand" />
                <span className="font-bold">{STANDORT.telefonAnzeige}</span>
              </a>
              <a href={`mailto:${STANDORT.email}`} className="flex items-center gap-3 text-white/80 hover:text-brand">
                <Mail className="h-5 w-5 flex-shrink-0 text-brand" />
                <span>{STANDORT.email}</span>
              </a>
            </div>

            <div>
              <h4 className="flex items-center gap-2 font-bold">
                <Clock className="h-5 w-5 text-brand" />
                Öffnungszeiten
              </h4>
              <ul className="mt-3 space-y-1 text-white/80">
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
          </Reveal>

          {/* Google-Maps — consent-gated */}
          <Reveal delay={120} className="min-h-[360px] overflow-hidden rounded-3xl">
            {mapsAllowed ? (
              <iframe
                src={MAPS_EMBED_URL}
                title={`Standort ${STANDORT.name}`}
                aria-label={`Karte: ${STANDORT.name}`}
                className="h-full min-h-[360px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="flex h-full min-h-[360px] flex-col items-center justify-center gap-4 bg-white/5 p-8 text-center ring-1 ring-white/15">
                <MapIcon className="h-10 w-10 text-white/60" />
                <p className="max-w-sm text-sm text-white/70">
                  Die Google-Maps-Karte wird aus Datenschutzgründen erst nach Ihrer
                  Einwilligung geladen.
                </p>
                <button
                  type="button"
                  onClick={openBanner}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand px-6 py-3 font-bold text-white transition-colors hover:bg-[#c8161e]"
                >
                  Karte aktivieren
                </button>
                <a
                  href={MAPS_ROUTE_URL}
                  className="text-sm font-bold text-white/80 underline hover:text-brand"
                >
                  Stattdessen in Google Maps öffnen
                </a>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
