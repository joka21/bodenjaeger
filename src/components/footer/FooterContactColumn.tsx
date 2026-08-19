import { Clock3, MapPin, Phone } from 'lucide-react'
import { FOOTER_FOCUS_RING } from './FooterLinkList'
import FooterSocial from './FooterSocial'
import {
  FIRMIERUNG,
  FOOTER_ADRESSE,
  FOOTER_OEFFNUNGSZEITEN,
  FOOTER_TELEFON,
} from '@/lib/footer-nav'

/**
 * Spalte 1: Firmierung, Anschrift, Telefon, Öffnungszeiten, Social.
 * Kein Logo — das steht bereits im Header.
 *
 * Bewusst OHNE Aktionslinks („Anrufen", „Route planen", „Kontaktformular"):
 * Sie doppelten Telefon und Adresse, die direkt darüber schon anklickbar sind.
 *
 * `showHeading={false}` im Mobile-Accordion, dort liefert der Accordion-Button
 * die Überschrift.
 */
export default function FooterContactColumn({
  showHeading = true,
}: {
  showHeading?: boolean
}) {
  return (
    <div>
      {showHeading && (
        <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.08em] text-white">
          Kontakt
        </h3>
      )}

      {/* Icon-Spalte: MapPin, Phone und Clock3 stehen alle auf derselben
          Grundlinie links, damit Anschrift, Telefon und Öffnungszeiten als drei
          gleichwertige Blöcke lesbar bleiben. */}
      <address className="not-italic">
        <div className="flex gap-2">
          <MapPin aria-hidden="true" className="mt-1 h-[18px] w-[18px] shrink-0 text-white" />
          <div>
            <p className="text-[15px] font-bold leading-6 text-white">{FIRMIERUNG}</p>
            <p className="text-[15px] leading-6 text-ash">{FOOTER_ADRESSE.strasse}</p>
            <p className="text-[15px] leading-6 text-ash">{FOOTER_ADRESSE.plzOrt}</p>
          </div>
        </div>

        <a
          href={FOOTER_TELEFON.href}
          className={`mt-3 inline-flex min-h-11 items-center gap-2 rounded-sm text-lg font-bold text-white transition-colors hover:text-ash ${FOOTER_FOCUS_RING}`}
        >
          <Phone aria-hidden="true" className="h-[18px] w-[18px] shrink-0" />
          {FOOTER_TELEFON.anzeige}
        </a>
      </address>

      <div className="mt-1 flex gap-2">
        <Clock3 aria-hidden="true" className="mt-1 h-[18px] w-[18px] shrink-0 text-white" />
        <dl className="space-y-0.5 text-[15px] leading-6 text-ash">
          {FOOTER_OEFFNUNGSZEITEN.map((zeile) => (
            <div key={zeile.tag} className="flex gap-2">
              <dt className="min-w-[5.5rem]">{zeile.tag}</dt>
              <dd>{zeile.zeit}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-5">
        <FooterSocial />
      </div>
    </div>
  )
}
