import { Suspense } from 'react';
import { getOrderStatus } from '@/lib/woocommerce-checkout';
import CheckoutSuccessContent from './CheckoutSuccessContent';
import TrustedShopsCheckout, { type TrustedShopsOrder } from './TrustedShopsCheckout';

// Order-Daten werden pro Request live geladen — keine statische/gecachte Ausgabe.
export const dynamic = 'force-dynamic';

type SearchParams = Record<string, string | string[] | undefined>;

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Mappt die interne WooCommerce-Zahlart auf einen von Trusted Shops empfohlenen
 * Payment-Type-String.
 */
function mapPaymentType(method: string): string {
  switch (method) {
    case 'stripe':
      return 'CREDIT_CARD';
    case 'stripe_sofort':
      return 'DIRECT_DEBIT';
    case 'stripe_klarna':
      return 'FINANCING';
    case 'paypal':
      return 'PAYPAL';
    case 'bacs':
      return 'PREPAYMENT';
    default:
      return 'OTHER';
  }
}

/**
 * Lädt die WooCommerce-Order serverseitig über den bestehenden Helper und leitet
 * die für die Trustcard nötigen Felder ab. E-Mail und Betrag stammen ausschließlich
 * aus der Order (nicht aus localStorage), damit sie verlässlich sind.
 *
 * Soft-Guard: Ist ein `key`-Parameter vorhanden (Stripe/Vorkasse), muss er zum
 * `order_key` passen. PayPal-Redirects liefern keinen Key → dann ohne Key-Prüfung.
 */
async function loadTrustedShopsOrder(
  sp: SearchParams
): Promise<TrustedShopsOrder | null> {
  const orderIdRaw = firstParam(sp.order);
  const orderId = Number(orderIdRaw);
  if (!orderIdRaw || !Number.isInteger(orderId) || orderId <= 0) return null;

  try {
    const order = await getOrderStatus(orderId);

    const key = firstParam(sp.key);
    if (key && order.order_key && key !== order.order_key) {
      return null;
    }

    const email = order.billing?.email;
    const amount = parseFloat(order.total);
    if (!email || !Number.isFinite(amount)) return null;

    return {
      orderNr: String(order.id),
      buyerEmail: email,
      // Brutto, Punkt-Dezimaltrenner, kein Tausenderpunkt, kein Währungssymbol.
      amount: amount.toFixed(2),
      currency: order.currency || 'EUR',
      paymentType: mapPaymentType(order.payment_method || ''),
    };
  } catch (error) {
    console.error('[checkout/success] Trusted Shops order load failed:', error);
    return null;
  }
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const tsOrder = await loadTrustedShopsOrder(sp);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark"></div>
        </div>
      }
    >
      <CheckoutSuccessContent />
      {tsOrder && <TrustedShopsCheckout order={tsOrder} />}
    </Suspense>
  );
}
