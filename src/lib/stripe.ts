/**
 * Stripe Payment Integration
 *
 * Unterstützt:
 * - Kreditkartenzahlungen (Visa, Mastercard, Amex)
 * - Sofortüberweisung (SOFORT)
 */

import Stripe from 'stripe';

// ============================================================================
// Stripe Configuration
// ============================================================================

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

if (!STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not configured');
}

if (!NEXT_PUBLIC_SITE_URL) {
  throw new Error('NEXT_PUBLIC_SITE_URL is not configured');
}

// Stripe SDK initialisieren
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

// ============================================================================
// TypeScript Interfaces
// ============================================================================

export interface CreateCheckoutSessionParams {
  orderId: number;
  orderKey: string;
  lineItems: Array<{
    name: string;
    quantity: number;
    price: number;  // in Cent!
  }>;
  customerEmail: string;
  paymentMethod: 'card' | 'sofort';
  shippingCost?: number;
}

export interface StripeCheckoutSession {
  sessionId: string;
  url: string;
}

export interface StripeWebhookResult {
  orderId: number;
  status: 'paid' | 'failed';
  sessionId: string;
}

// ============================================================================
// Stripe Checkout Session erstellen
// ============================================================================

/**
 * Erstellt eine Stripe Checkout Session für Kreditkarte oder Sofortüberweisung
 *
 * @param params - Line Items, Customer Info, Payment Method
 * @returns Session ID und Redirect URL
 *
 * @example
 * ```typescript
 * const session = await createStripeCheckoutSession({
 *   orderId: 123,
 *   orderKey: 'wc_order_abc123',
 *   lineItems: [
 *     { name: 'Laminat Premium', quantity: 10, price: 24999 }, // 249.99 EUR = 24999 Cent
 *     { name: 'Trittschalldämmung', quantity: 10, price: 499 }, // 4.99 EUR = 499 Cent
 *   ],
 *   customerEmail: 'kunde@example.com',
 *   paymentMethod: 'card',
 *   shippingCost: 490, // 4.90 EUR
 * });
 *
 * // Redirect zu: session.url
 * ```
 */
export async function createStripeCheckoutSession(
  params: CreateCheckoutSessionParams
): Promise<StripeCheckoutSession> {
  const {
    orderId,
    orderKey,
    lineItems,
    customerEmail,
    paymentMethod,
    shippingCost,
  } = params;

  try {
    // Line Items für Stripe formatieren
    const stripeLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      lineItems.map((item) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
          },
          unit_amount: item.price, // Stripe erwartet Cent!
        },
        quantity: item.quantity,
      }));

    // Versandkosten hinzufügen falls vorhanden
    if (shippingCost && shippingCost > 0) {
      stripeLineItems.push({
        price_data: {
          currency: 'eur',
          product_data: { name: 'Versandkosten' },
          unit_amount: shippingCost,
        },
        quantity: 1,
      });
    }

    // Payment Method Types
    const paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] =
      paymentMethod === 'sofort' ? ['sofort'] : ['card'];

    // Checkout Session erstellen
    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethodTypes,
      line_items: stripeLineItems,
      mode: 'payment',
      customer_email: customerEmail,
      success_url: `${NEXT_PUBLIC_SITE_URL}/checkout/success?order=${orderId}&key=${orderKey}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${NEXT_PUBLIC_SITE_URL}/checkout?cancelled=true&order=${orderId}`,
      metadata: {
        order_id: orderId.toString(),
        order_key: orderKey,
        payment_method: paymentMethod,
      },
      // Für Sofortüberweisung: Land auf DE beschränken
      ...(paymentMethod === 'sofort' && {
        payment_method_options: {
          sofort: {
            preferred_language: 'de',
          },
        },
      }),
    });

    if (!session.url) {
      throw new Error('Stripe session URL is missing');
    }

    return {
      sessionId: session.id,
      url: session.url,
    };
  } catch (error) {
    console.error('Stripe checkout session creation failed:', error);
    throw new Error(
      `Failed to create Stripe checkout session: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

// ============================================================================
// Stripe Webhook Handler
// ============================================================================

/**
 * Verarbeitet Stripe Webhooks für Zahlungsbestätigungen
 *
 * WICHTIG: Diese Funktion muss in einer API Route aufgerufen werden,
 * die den raw request body erhält (nicht JSON geparsed!)
 *
 * @param payload - Raw request body (string)
 * @param signature - Stripe-Signature Header
 * @returns Order ID und Status
 *
 * @example
 * ```typescript
 * // In API Route:
 * const payload = await request.text();
 * const signature = request.headers.get('stripe-signature')!;
 *
 * const result = await handleStripeWebhook(payload, signature);
 * if (result.status === 'paid') {
 *   await updateOrderStatus(result.orderId, 'processing');
 * }
 * ```
 */
export async function handleStripeWebhook(
  payload: string,
  signature: string
): Promise<StripeWebhookResult> {
  if (!STRIPE_WEBHOOK_SECRET) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
  }

  try {
    // Webhook Event verifizieren und konstruieren
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      STRIPE_WEBHOOK_SECRET
    );

    // Checkout Session Completed (Zahlung erfolgreich)
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = parseInt(session.metadata?.order_id || '0');

      if (!orderId) {
        throw new Error('Order ID not found in session metadata');
      }

      return {
        orderId,
        status: 'paid',
        sessionId: session.id,
      };
    }

    // Checkout Session Expired (Zahlung abgelaufen/abgebrochen)
    if (event.type === 'checkout.session.expired') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = parseInt(session.metadata?.order_id || '0');

      if (!orderId) {
        throw new Error('Order ID not found in session metadata');
      }

      return {
        orderId,
        status: 'failed',
        sessionId: session.id,
      };
    }

    throw new Error(`Unhandled event type: ${event.type}`);
  } catch (error) {
    console.error('Stripe webhook processing failed:', error);
    throw new Error(
      `Failed to process Stripe webhook: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

// ============================================================================
// Stripe Session abrufen (optional, für Success-Page)
// ============================================================================

/**
 * Ruft Details einer Stripe Checkout Session ab
 *
 * Nützlich für die Success-Page, um zu verifizieren,
 * dass die Zahlung tatsächlich erfolgt ist
 *
 * @param sessionId - Die Stripe Session ID
 * @returns Die vollständige Stripe Session
 *
 * @example
 * ```typescript
 * const session = await getStripeSession('cs_test_xxx');
 * if (session.payment_status === 'paid') {
 *   console.log('Payment successful');
 * }
 * ```
 */
export async function getStripeSession(
  sessionId: string
): Promise<Stripe.Checkout.Session> {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  } catch (error) {
    console.error('Failed to retrieve Stripe session:', error);
    throw new Error(
      `Failed to retrieve Stripe session: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

// ============================================================================
// Hilfsfunktionen
// ============================================================================

/**
 * Konvertiert Euro in Cent für Stripe
 *
 * @param euros - Betrag in Euro
 * @returns Betrag in Cent (gerundet)
 *
 * @example
 * ```typescript
 * euroToCents(249.99) // 24999
 * euroToCents(4.90) // 490
 * ```
 */
export function euroToCents(euros: number): number {
  return Math.round(euros * 100);
}

/**
 * Konvertiert Cent in Euro für Anzeige
 *
 * @param cents - Betrag in Cent
 * @returns Betrag in Euro (formatiert)
 *
 * @example
 * ```typescript
 * centsToEuro(24999) // "249.99"
 * centsToEuro(490) // "4.90"
 * ```
 */
export function centsToEuro(cents: number): string {
  return (cents / 100).toFixed(2);
}
