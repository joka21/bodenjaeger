import FooterAccordion from './footer/FooterAccordion'
import FooterBottomBar from './footer/FooterBottomBar'
import FooterColumn, { FooterColumnBody } from './footer/FooterColumn'
import FooterContactColumn from './footer/FooterContactColumn'
import FooterTrustZone from './footer/FooterTrustZone'
import { FOOTER_COLUMNS } from '@/lib/footer-nav'

/**
 * Globaler Footer.
 *
 * Aufbau: obere Zone (Kontakt · Kundenservice · Über Bodenjäger · Fachmarkt
 * Hückelhoven) → Trust-/Zahlungs-/Lieferzone → Bottom-Bar.
 *
 * Inhalte kommen vollständig aus `lib/footer-nav.ts`. Server Component;
 * Client sind nur das Mobile-Accordion und der Cookie-Button.
 *
 * Unter lg werden dieselben Spalten als Accordion ausgegeben — „Kontakt" ist
 * dort initial offen, damit Telefonnummer und „Route planen" sofort sichtbar
 * sind. Die jeweils andere Variante ist per CSS ausgeblendet.
 */
export default function Footer() {
  const accordionItems = [
    {
      id: 'kontakt',
      title: 'Kontakt',
      content: <FooterContactColumn showHeading={false} />,
    },
    ...FOOTER_COLUMNS.map((column) => ({
      id: column.id,
      title: column.title,
      content: <FooterColumnBody column={column} />,
    })),
  ]

  return (
    <footer className="mt-auto w-full overflow-hidden">
      <div className="w-full bg-dark">
        <div className="content-container">
          {/* Mobile & Tablet */}
          <div className="py-8 lg:hidden">
            <FooterAccordion items={accordionItems} defaultOpenId="kontakt" />
          </div>

          {/* Desktop: 4 Spalten mit dezenten vertikalen Trennlinien.
              Ungleiche Spaltenbreiten, weil „Über Bodenjäger" nur drei Einträge
              hat und Kundenservice/Fachmarkt lange Labels tragen.
              Die Trennlinie sitzt links an Spalte 2–4 — die linke Außenkante
              der ersten Spalte bleibt bewusst ohne Linie. */}
          <div className="hidden py-12 lg:grid lg:grid-cols-[1.2fr_1fr_0.8fr_1.1fr]">
            <div className="min-w-0 pr-8">
              <FooterContactColumn />
            </div>
            {FOOTER_COLUMNS.map((column) => (
              <div
                key={column.id}
                className="min-w-0 border-l border-white/10 pl-8 pr-8 last:pr-0"
              >
                <FooterColumn column={column} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <FooterTrustZone />
      <FooterBottomBar />
    </footer>
  )
}
