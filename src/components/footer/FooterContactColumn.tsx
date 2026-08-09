import FooterLinkList, { FOOTER_FOCUS_RING } from './FooterLinkList'
import FooterSocial from './FooterSocial'
import {
  FIRMIERUNG,
  FOOTER_ADRESSE,
  FOOTER_KONTAKT_AKTIONEN,
  FOOTER_OEFFNUNGSZEITEN,
  FOOTER_TELEFON,
} from '@/lib/footer-nav'

/**
 * Spalte 1: Firmierung, Anschrift, Telefon, Öffnungszeiten, Aktionslinks, Social.
 * Kein Logo — das steht bereits im Header.
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

      <address className="not-italic">
        <p className="text-[15px] font-bold leading-6 text-white">{FIRMIERUNG}</p>
        <p className="mt-1 text-[15px] leading-6 text-ash">{FOOTER_ADRESSE.strasse}</p>
        <p className="text-[15px] leading-6 text-ash">{FOOTER_ADRESSE.plzOrt}</p>

        <a
          href={FOOTER_TELEFON.href}
          className={`mt-3 inline-flex min-h-11 items-center rounded-sm text-lg font-bold text-white transition-colors hover:text-ash ${FOOTER_FOCUS_RING}`}
        >
          {FOOTER_TELEFON.anzeige}
        </a>
      </address>

      <dl className="mt-1 space-y-0.5 text-[15px] leading-6 text-ash">
        {FOOTER_OEFFNUNGSZEITEN.map((zeile) => (
          <div key={zeile.tag} className="flex gap-2">
            <dt className="min-w-[5.5rem]">{zeile.tag}</dt>
            <dd>{zeile.zeit}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4">
        <FooterLinkList links={FOOTER_KONTAKT_AKTIONEN} ariaLabel="Kontaktmöglichkeiten" />
      </div>

      <div className="mt-5">
        <FooterSocial />
      </div>
    </div>
  )
}
