import { CreditCard, MapPin, ShieldCheck, Store, Truck, type LucideIcon } from 'lucide-react'
import BadgeGrid from './BadgeGrid'
import { PAYMENT_BADGES, SHIPPING_BADGES, TRUST_ZONE_TEXTE } from '@/lib/footer-nav'

const BLOCK_TITLE =
  'mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-white'

/**
 * Blocküberschrift mit vorangestelltem Lucide-Icon. Das Icon ist eine Stufe
 * größer als die Versalien daneben (16px zu 12px), sonst wirkt es gequetscht.
 */
function BlockTitle({ icon: Icon, children }: { icon: LucideIcon; children: string }) {
  return (
    <h3 className={BLOCK_TITLE}>
      <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-white" />
      {children}
    </h3>
  )
}

/**
 * Eigene horizontale Zone unter den Spalten.
 *
 * Der Footer ist durchgehend `bg-dark` — der frühere hellere Untergrund
 * (`bg-mid`) ist entfallen. Abgesetzt wird die Zone stattdessen nur noch über
 * eine dezente Trennlinie, wie sie auch die Bottom-Bar nutzt.
 *
 * Trusted Shops bleibt bewusst ein ruhiger statischer Block ohne Note und
 * ohne Sterne — die Bewertung liefert allein das bestehende Floating-Widget
 * (components/TrustedShops.tsx), das hier nicht angefasst wird.
 */
export default function FooterTrustZone() {
  return (
    <div className="w-full bg-dark">
      <div className="content-container">
        <div className="grid gap-8 border-t border-white/10 py-8 md:grid-cols-2 lg:grid-cols-12">
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
            <BlockTitle icon={CreditCard}>{TRUST_ZONE_TEXTE.zahlung.titel}</BlockTitle>
            {/* Durchgehend 4 Spalten: Die 8 aktiven Badges gehen damit auf
                jeder Breite in genau 2 vollen Zeilen auf — keine Zeile endet
                mit einem einzelnen Badge. Bei der reduzierten Kachelhöhe (36px)
                bleibt selbst auf 320px Viewport genug Kachelbreite (~67px) für
                die 22px hohen Logos. */}
            <BadgeGrid badges={PAYMENT_BADGES} columnsClassName="grid-cols-4" />
          </div>

          {/* 3 — Schnelle Lieferung */}
          <div className="lg:col-span-3">
            <BlockTitle icon={Truck}>{TRUST_ZONE_TEXTE.lieferung.titel}</BlockTitle>
            <BadgeGrid badges={SHIPPING_BADGES} columnsClassName="grid-cols-3" />
            <p className="mt-2 text-[13px] leading-5 text-ash">
              {TRUST_ZONE_TEXTE.lieferung.zusatz}
            </p>
          </div>

          {/* 4 — Fachmarkt vor Ort */}
          <div className="lg:col-span-3">
            <BlockTitle icon={Store}>{TRUST_ZONE_TEXTE.fachmarkt.titel}</BlockTitle>
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
