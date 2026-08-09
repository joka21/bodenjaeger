import { MapPin, ShieldCheck } from 'lucide-react'
import BadgeGrid from './BadgeGrid'
import { PAYMENT_BADGES, SHIPPING_BADGES, TRUST_ZONE_TEXTE } from '@/lib/footer-nav'

const BLOCK_TITLE = 'mb-3 text-xs font-bold uppercase tracking-[0.08em] text-white'

/**
 * Eigene horizontale Zone unter den Spalten, durch helleren Untergrund
 * (`bg-mid`) klar von der oberen Zone abgesetzt.
 *
 * Trusted Shops bleibt bewusst ein ruhiger statischer Block ohne Note und
 * ohne Sterne — die Bewertung liefert allein das bestehende Floating-Widget
 * (components/TrustedShops.tsx), das hier nicht angefasst wird.
 */
export default function FooterTrustZone() {
  return (
    <div className="w-full bg-mid">
      <div className="content-container">
        <div className="grid gap-8 py-8 md:grid-cols-2 lg:grid-cols-12">
          {/* 1 — Trusted Shops */}
          <div className="lg:col-span-2">
            <h3 className={BLOCK_TITLE}>Geprüfter Shop</h3>
            <div className="flex items-start gap-3">
              <ShieldCheck aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-white" />
              <div>
                <p className="text-[15px] font-bold leading-6 text-white">
                  {TRUST_ZONE_TEXTE.trustedShops.titel}
                </p>
                <p className="text-[15px] leading-6 text-ash">
                  {TRUST_ZONE_TEXTE.trustedShops.text}
                </p>
              </div>
            </div>
          </div>

          {/* 2 — Sichere Zahlung */}
          <div className="lg:col-span-4">
            <h3 className={BLOCK_TITLE}>{TRUST_ZONE_TEXTE.zahlung.titel}</h3>
            {/* 3 → 4 Spalten. Bei 2 Spalten wären die Kacheln auf 390 px ~175 px
                breit und das 48-px-Logo würde darin verloren wirken. Mit 3
                Spalten entspricht die Kachelbreite (~111 px) der Desktop-Optik
                (~108 px); die letzte Zeile trägt dann 2 Badges — nie eines. */}
            <BadgeGrid badges={PAYMENT_BADGES} columnsClassName="grid-cols-3 sm:grid-cols-4" />
          </div>

          {/* 3 — Schnelle Lieferung */}
          <div className="lg:col-span-3">
            <h3 className={BLOCK_TITLE}>{TRUST_ZONE_TEXTE.lieferung.titel}</h3>
            <BadgeGrid badges={SHIPPING_BADGES} columnsClassName="grid-cols-3" />
            <p className="mt-2 text-[13px] leading-5 text-ash">
              {TRUST_ZONE_TEXTE.lieferung.zusatz}
            </p>
          </div>

          {/* 4 — Fachmarkt vor Ort */}
          <div className="lg:col-span-3">
            <h3 className={BLOCK_TITLE}>{TRUST_ZONE_TEXTE.fachmarkt.titel}</h3>
            <div className="flex items-start gap-3">
              <MapPin aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-white" />
              <p className="text-[15px] leading-6 text-ash">
                {TRUST_ZONE_TEXTE.fachmarkt.text}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
