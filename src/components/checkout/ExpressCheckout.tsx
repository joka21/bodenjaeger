'use client';

import { useEffect, useRef, useState } from 'react';
import { loadScript } from '@paypal/paypal-js';
import { useCart } from '@/contexts/CartContext';
import { cartItemsToOrderItems } from '@/lib/cart-utils';
import { calculateShippingCost } from '@/lib/shippingConfig';

/**
 * Express Checkout — PayPal Smart Button oben im /checkout-Layout.
 *
 * Flow:
 * 1. Browser zeigt Button (nach SDK-Load)
 * 2. Klick → createOrder-Callback → POST /api/checkout/paypal/express-create
 *    (mit Cart-Items, FREE-Items gefiltert)
 * 3. PayPal-Popup öffnet sich, Kunde bestätigt Adresse + Zahlung
 * 4. onApprove-Callback → POST /api/checkout/paypal/express-capture
 *    (mit allen Items inkl. Free, für vollständige WC-Order)
 * 5. Bei Erfolg: window.location.href = /checkout/success?order=...&paypal=success
 *    (Success-Page räumt den Cart auf)
 *
 * Erforderliche ENV (Browser): NEXT_PUBLIC_PAYPAL_CLIENT_ID
 *
 * Cart-Daten werden via Refs zur Submit-Zeit gelesen, NICHT zur SDK-Render-Zeit,
 * sonst hätte der PayPal-Button stale Closure-Daten, wenn der User nach dem
 * SDK-Load noch Items hinzufügt/entfernt.
 */
export default function ExpressCheckout() {
  const { cartItems, totalPrice, customerNote, deliveryNote } = useCart();
  console.log('[ExpressCheckout] mounting — cartItems:', cartItems?.length ?? 'undef');
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonsRenderedRef = useRef(false);
  const [sdkStatus, setSdkStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Live-Refs für Submit-Zeit-Werte (kein stale Closure in PayPal-Callbacks)
  const cartItemsRef = useRef(cartItems);
  const totalPriceRef = useRef(totalPrice);
  const customerNoteRef = useRef(customerNote);
  const deliveryNoteRef = useRef(deliveryNote);

  useEffect(() => {
    cartItemsRef.current = cartItems;
    totalPriceRef.current = totalPrice;
    customerNoteRef.current = customerNote;
    deliveryNoteRef.current = deliveryNote;
  });

  // SDK genau EINMAL laden (Cart-Daten kommen via Refs)
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId) {
      console.warn(
        '[ExpressCheckout] NEXT_PUBLIC_PAYPAL_CLIENT_ID nicht gesetzt — Button deaktiviert.'
      );
      setSdkStatus('error');
      return;
    }

    let cancelled = false;

    loadScript({
      clientId,
      currency: 'EUR',
      intent: 'capture',
      components: 'buttons',
      locale: 'de_DE',
    })
      .then((paypal) => {
        console.log('[ExpressCheckout] SDK loaded, paypal:', !!paypal, 'Buttons:', !!paypal?.Buttons, 'container:', !!containerRef.current);
        if (cancelled) return;
        if (!paypal || !paypal.Buttons || !containerRef.current) {
          console.warn('[ExpressCheckout] silent fail: paypal.Buttons or containerRef missing');
          setSdkStatus('error');
          return;
        }
        if (buttonsRenderedRef.current) return;

        const buttons = paypal.Buttons({
          style: {
            layout: 'horizontal',
            color: 'gold',
            shape: 'rect',
            label: 'paypal',
            height: 48,
            tagline: false,
          },

          createOrder: async () => {
            setErrorMsg(null);

            const allItems = cartItemsToOrderItems(cartItemsRef.current);
            const billableItems = allItems.filter((item) => item.price > 0);

            if (billableItems.length === 0) {
              const msg = 'Keine bezahlbaren Artikel im Warenkorb.';
              setErrorMsg(msg);
              throw new Error(msg);
            }

            const shippingCost = calculateShippingCost(
              totalPriceRef.current,
              cartItemsRef.current
            );

            const res = await fetch('/api/checkout/paypal/express-create', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                items: billableItems,
                subtotal: totalPriceRef.current,
                shipping_cost: shippingCost,
              }),
            });

            const data = await res.json();
            if (!data.success || !data.paypalOrderId) {
              const msg = data.error || 'Bestellung konnte nicht angelegt werden.';
              setErrorMsg(msg);
              throw new Error(msg);
            }
            return data.paypalOrderId as string;
          },

          onApprove: async (data) => {
            try {
              // Für WC: ALLE Items (auch Free) — WC braucht die volle Set-Darstellung
              const allItems = cartItemsToOrderItems(cartItemsRef.current);
              const shippingCost = calculateShippingCost(
                totalPriceRef.current,
                cartItemsRef.current
              );

              const note = [
                deliveryNoteRef.current.trim() && `Lieferwunsch: ${deliveryNoteRef.current.trim()}`,
                customerNoteRef.current.trim() && `Anmerkung: ${customerNoteRef.current.trim()}`,
              ]
                .filter(Boolean)
                .join('\n\n');

              const res = await fetch('/api/checkout/paypal/express-capture', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  paypalOrderId: data.orderID,
                  items: allItems,
                  subtotal: totalPriceRef.current,
                  shipping_cost: shippingCost,
                  customer_note: note,
                }),
              });

              const result = await res.json();

              if (result.success && result.redirectUrl) {
                window.location.href = result.redirectUrl;
                return;
              }

              setErrorMsg(
                result.error ||
                  'Zahlung erfolgt, Bestellung konnte aber nicht angelegt werden. Bitte kontaktieren Sie uns.'
              );
            } catch (err) {
              const msg = err instanceof Error ? err.message : 'Express-Capture fehlgeschlagen.';
              setErrorMsg(msg);
            }
          },

          onError: (err) => {
            console.error('[ExpressCheckout] PayPal SDK Error:', err);
            setErrorMsg('Bei der PayPal-Zahlung ist ein Fehler aufgetreten.');
          },

          onCancel: () => {
            // User hat im PayPal-Popup abgebrochen — keine UI-Aktion, kein Error.
          },
        });

        if (!buttons.isEligible()) {
          console.warn('[ExpressCheckout] silent fail: buttons.isEligible() returned false');
          setSdkStatus('error');
          return;
        }

        buttons
          .render(containerRef.current)
          .then(() => {
            if (cancelled) return;
            buttonsRenderedRef.current = true;
            setSdkStatus('ready');
          })
          .catch((err) => {
            if (cancelled) return;
            console.error('[ExpressCheckout] PayPal render failed:', err);
            setSdkStatus('error');
          });
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('[ExpressCheckout] PayPal SDK load failed:', err);
        setSdkStatus('error');
      });

    return () => {
      cancelled = true;
    };
    // SDK nur EINMAL laden — Cart-Updates fließen via Refs ein.
  }, []);

  // Bei leerem Cart oder SDK-Error: Komponente komplett ausblenden
  if (cartItems.length === 0) {
    console.log('[ExpressCheckout] render skipped: cart empty');
    return null;
  }
  if (sdkStatus === 'error') {
    console.log('[ExpressCheckout] render skipped: sdkStatus is error');
    return null;
  }

  return (
    <div className="mb-6">
      <p className="text-center text-sm text-mid mb-4">Express Checkout</p>

      {sdkStatus === 'loading' ? (
        <div
          className="h-12 bg-pale animate-pulse rounded-lg"
          aria-label="PayPal wird geladen"
        />
      ) : (
        <div ref={containerRef} className="w-full" />
      )}

      {errorMsg && (
        <p className="mt-3 text-sm text-brand text-center" role="alert">
          {errorMsg}
        </p>
      )}

      {/* Trennlinie zum Standard-Checkout darunter */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-ash" />
        <span className="text-sm text-mid">ODER</span>
        <div className="flex-1 h-px bg-ash" />
      </div>
    </div>
  );
}
