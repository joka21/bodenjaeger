'use client';

import { useEffect } from 'react';

/**
 * Clientseitige Trusted-Shops-Trustcard auf der Danke-Seite.
 *
 * Rendert das versteckte `#trustedShopsCheckout`-DIV mit den serverseitig
 * verlässlich ermittelten Bestelldaten und ruft danach
 * `window.trustbadge.reInitialize()` auf, damit das (global in layout.tsx über
 * src/components/TrustedShops.tsx geladene) Trustbadge das Checkout-Event
 * verarbeitet. Dieses eine Event deckt Käuferschutz UND Servicebewertung ab.
 *
 * Wichtig:
 * - Das Trustbadge wird NUR bei functional-Consent geladen (Gate in
 *   TrustedShops.tsx). Ohne Consent existiert `window.trustbadge` nie → das
 *   Polling läuft ergebnislos aus, die Trustcard erscheint nicht. So gewollt.
 * - Es erfolgt KEIN serverseitiger eTrusted-API-Call — rein clientseitig.
 */

export interface TrustedShopsOrder {
  /** WooCommerce-Bestellnummer */
  orderNr: string;
  /** Billing-E-Mail des Käufers */
  buyerEmail: string;
  /** Bruttobetrag, Punkt als Dezimaltrenner, kein Tausenderpunkt, kein Symbol (z. B. "126.75") */
  amount: string;
  /** Währungscode (z. B. "EUR") */
  currency: string;
  /** Auf TS-Enum gemappte Zahlart (z. B. "CREDIT_CARD", "PAYPAL", "PREPAYMENT") */
  paymentType: string;
  /** Optionales voraussichtliches Lieferdatum (ISO yyyy-mm-dd) */
  estDeliveryDate?: string;
}

declare global {
  interface Window {
    trustbadge?: {
      reInitialize?: () => void;
    };
  }
}

const POLL_INTERVAL_MS = 500;
const MAX_ATTEMPTS = 30; // ~15 s — danach aufgeben (z. B. wenn kein functional-Consent)

export default function TrustedShopsCheckout({ order }: { order: TrustedShopsOrder }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Nur einmal pro Order reInit auslösen.
    const flagKey = `ts_checkout_reinit_${order.orderNr}`;
    try {
      if (sessionStorage.getItem(flagKey) === '1') return;
    } catch {
      // sessionStorage nicht verfügbar — best effort, weiter ohne Flag
    }

    let attempts = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const tryReInit = () => {
      if (window.trustbadge && typeof window.trustbadge.reInitialize === 'function') {
        // Das #trustedShopsCheckout-DIV ist hier bereits im DOM (Komponente
        // gerendert), also kann das Badge die Bestelldaten einlesen.
        window.trustbadge.reInitialize();
        try {
          sessionStorage.setItem(flagKey, '1');
        } catch {
          // ignore
        }
        return;
      }

      attempts += 1;
      if (attempts >= MAX_ATTEMPTS) return;
      timer = setTimeout(tryReInit, POLL_INTERVAL_MS);
    };

    tryReInit();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [order.orderNr]);

  return (
    <div id="trustedShopsCheckout" style={{ display: 'none' }}>
      <span id="tsCheckoutOrderNr">{order.orderNr}</span>
      <span id="tsCheckoutBuyerEmail">{order.buyerEmail}</span>
      <span id="tsCheckoutOrderAmount">{order.amount}</span>
      <span id="tsCheckoutOrderCurrency">{order.currency}</span>
      <span id="tsCheckoutOrderPaymentType">{order.paymentType}</span>
      {order.estDeliveryDate && (
        <span id="tsCheckoutOrderEstDeliveryDate">{order.estDeliveryDate}</span>
      )}
    </div>
  );
}
