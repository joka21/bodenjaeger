/**
 * PayPal Payment Integration
 *
 * Ruft den WordPress Proxy auf statt PayPal direkt.
 * Credentials (PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET) bleiben auf dem WordPress-Server.
 */

// ============================================================================
// Proxy Configuration
// ============================================================================

const PROXY_URL = process.env.PAYMENT_PROXY_URL; // https://2025.bodenjaeger.de/wp-json/bodenjaeger/v1
const PROXY_KEY = process.env.PAYMENT_PROXY_KEY;
const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

function checkProxyConfig() {
  if (!PROXY_URL) throw new Error('PAYMENT_PROXY_URL is not configured');
  if (!PROXY_KEY) throw new Error('PAYMENT_PROXY_KEY is not configured');
  if (!NEXT_PUBLIC_SITE_URL) throw new Error('NEXT_PUBLIC_SITE_URL is not configured');
}

function proxyHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'X-Bodenjaeger-Key': PROXY_KEY!,
  };
}

// ============================================================================
// TypeScript Interfaces (unveraendert – identisch zum Original)
// ============================================================================

export interface PayPalAccessToken {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface CreatePayPalOrderParams {
  orderId: number;
  orderKey: string;
  amount: string; // z.B. "2661.61"
  lineItems: Array<{
    name: string;
    quantity: number;
    unit_amount: string;
  }>;
}

export interface PayPalOrderResult {
  paypalOrderId: string;
  approvalUrl: string;
}

export interface CapturePayPalOrderResult {
  success: boolean;
  transactionId?: string;
  payerEmail?: string;
  payerName?: string;
  referenceId?: string;
}

// ============================================================================
// PayPal Order erstellen
// ============================================================================

/**
 * Erstellt eine PayPal Order über den WordPress Proxy.
 *
 * @param params - Order Details (ID, Betrag, Line Items)
 * @returns PayPal Order ID und Approval URL (für Redirect)
 *
 * @example
 * ```typescript
 * const result = await createPayPalOrder({
 *   orderId: 123,
 *   orderKey: 'wc_order_abc123',
 *   amount: '2661.61',
 *   lineItems: [
 *     { name: 'Laminat Premium', quantity: 10, unit_amount: '249.99' },
 *   ],
 * });
 * // Redirect zu: result.approvalUrl
 * ```
 */
export async function createPayPalOrder(
  params: CreatePayPalOrderParams
): Promise<PayPalOrderResult> {
  checkProxyConfig();

  const { orderId, orderKey, amount, lineItems } = params;

  try {
    const res = await fetch(`${PROXY_URL}/paypal/create-order`, {
      method: 'POST',
      headers: proxyHeaders(),
      body: JSON.stringify({
        orderId,
        orderKey,
        amount,
        lineItems,
        returnUrl: `${NEXT_PUBLIC_SITE_URL}/api/checkout/paypal/capture?order=${orderId}`,
        cancelUrl: `${NEXT_PUBLIC_SITE_URL}/checkout?cancelled=true&order=${orderId}`,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `Proxy error: ${res.status}`);
    }

    if (!data.approvalUrl) {
      throw new Error('PayPal approval URL not found in proxy response');
    }

    return {
      paypalOrderId: data.paypalOrderId,
      approvalUrl: data.approvalUrl,
    };
  } catch (error) {
    console.error('Failed to create PayPal order:', error);
    throw new Error(
      `Failed to create PayPal order: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

// ============================================================================
// PayPal Zahlung erfassen (Capture)
// ============================================================================

/**
 * Erfasst die PayPal Zahlung über den WordPress Proxy.
 *
 * Der Proxy übernimmt zusätzlich die WooCommerce Order-Aktualisierung direkt.
 *
 * @param paypalOrderId - Die PayPal Order ID (Query-Parameter "token" von PayPal)
 * @param wcOrderId - Die WooCommerce Order ID (für den Proxy zur Order-Aktualisierung)
 * @returns Erfolg, Transaction ID, Payer-Daten
 *
 * @example
 * ```typescript
 * // Kunde kommt zurück von PayPal mit ?token=xxx&order=123
 * const result = await capturePayPalOrder(token, orderId);
 *
 * if (result.success) {
 *   // WooCommerce Order wurde bereits vom Proxy auf "processing" gesetzt
 *   redirect('/checkout/success?order=123&paypal=success');
 * }
 * ```
 */
export async function capturePayPalOrder(
  paypalOrderId: string,
  wcOrderId: number
): Promise<CapturePayPalOrderResult> {
  checkProxyConfig();

  try {
    const res = await fetch(`${PROXY_URL}/paypal/capture`, {
      method: 'POST',
      headers: proxyHeaders(),
      body: JSON.stringify({
        paypalOrderId,
        wcOrderId,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `Proxy error: ${res.status}`);
    }

    return {
      success:       data.success       ?? false,
      transactionId: data.transactionId,
      payerEmail:    data.payerEmail,
      payerName:     data.payerName,
      referenceId:   data.referenceId,
    };
  } catch (error) {
    console.error('Failed to capture PayPal order:', error);
    throw new Error(
      `Failed to capture PayPal order: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

// ============================================================================
// PayPal Order abrufen (optional, für Debugging)
// ============================================================================

/**
 * Ruft Details einer PayPal Order ab.
 * HINWEIS: Diese Funktion ruft PayPal weiterhin direkt auf (nur für Debugging).
 * Im Produktionsbetrieb wird sie nicht verwendet.
 *
 * @deprecated Nur für Debugging. Credentials sind nicht auf diesem Server.
 */
export async function getPayPalOrder(_paypalOrderId: string): Promise<unknown> {
  throw new Error(
    'getPayPalOrder is not available via the proxy. ' +
    'Use the PayPal Developer Dashboard for debugging.'
  );
}
