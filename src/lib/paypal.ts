/**
 * PayPal Payment Integration
 *
 * Unterstützt PayPal Checkout für sichere Online-Zahlungen
 */

// ============================================================================
// PayPal Configuration
// ============================================================================

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_MODE = process.env.PAYPAL_MODE || 'sandbox'; // 'sandbox' oder 'live'
const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
  throw new Error('PayPal credentials are not configured');
}

if (!NEXT_PUBLIC_SITE_URL) {
  throw new Error('NEXT_PUBLIC_SITE_URL is not configured');
}

const PAYPAL_API_URL =
  PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

// ============================================================================
// TypeScript Interfaces
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
}

// ============================================================================
// PayPal Access Token
// ============================================================================

/**
 * Holt einen Access Token von PayPal für API-Calls
 *
 * WICHTIG: Der Access Token ist nur für kurze Zeit gültig (ca. 9 Stunden).
 * In Production sollte dieser gecached werden.
 *
 * @returns Access Token
 *
 * @example
 * ```typescript
 * const token = await getPayPalAccessToken();
 * // Verwende token in API Calls
 * ```
 */
async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString('base64');

  try {
    const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error(
        `PayPal token request failed: ${response.status} ${response.statusText}`
      );
    }

    const data: PayPalAccessToken = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Failed to get PayPal access token:', error);
    throw new Error(
      `Failed to get PayPal access token: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

// ============================================================================
// PayPal Order erstellen
// ============================================================================

/**
 * Erstellt eine PayPal Order für Checkout
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
 *     { name: 'Dämmung', quantity: 10, unit_amount: '4.99' },
 *   ],
 * });
 *
 * // Redirect zu: result.approvalUrl
 * ```
 */
export async function createPayPalOrder(
  params: CreatePayPalOrderParams
): Promise<PayPalOrderResult> {
  const { orderId, orderKey, amount, lineItems } = params;

  try {
    const accessToken = await getPayPalAccessToken();

    // Line Items für PayPal formatieren
    const paypalItems = lineItems.map((item) => ({
      name: item.name.substring(0, 127), // PayPal max 127 chars
      quantity: item.quantity.toString(),
      unit_amount: {
        currency_code: 'EUR',
        value: item.unit_amount,
      },
    }));

    // PayPal Order erstellen
    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: orderId.toString(),
            custom_id: orderKey,
            amount: {
              currency_code: 'EUR',
              value: amount,
              breakdown: {
                item_total: {
                  currency_code: 'EUR',
                  value: amount,
                },
              },
            },
            items: paypalItems,
          },
        ],
        application_context: {
          brand_name: 'Bodenjäger',
          locale: 'de-DE',
          landing_page: 'LOGIN',
          shipping_preference: 'NO_SHIPPING', // Wir handhaben Versand selbst
          user_action: 'PAY_NOW',
          return_url: `${NEXT_PUBLIC_SITE_URL}/api/checkout/paypal/capture?order=${orderId}`,
          cancel_url: `${NEXT_PUBLIC_SITE_URL}/checkout?cancelled=true&order=${orderId}`,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('PayPal API Error:', errorData);
      throw new Error(
        `PayPal order creation failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Approval URL finden
    const approvalUrl = data.links?.find(
      (link: any) => link.rel === 'approve'
    )?.href;

    if (!approvalUrl) {
      throw new Error('PayPal approval URL not found in response');
    }

    return {
      paypalOrderId: data.id,
      approvalUrl,
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
 * Erfasst die Zahlung nach Rückkehr vom PayPal Checkout
 *
 * WICHTIG: Diese Funktion muss aufgerufen werden, nachdem der Kunde
 * von PayPal zurück zur return_url weitergeleitet wurde
 *
 * @param paypalOrderId - Die PayPal Order ID (wird als "token" Query-Parameter zurückgegeben)
 * @returns Erfolg und Transaction ID
 *
 * @example
 * ```typescript
 * // Kunde kommt zurück von PayPal mit ?token=xxx&order=123
 * const result = await capturePayPalOrder(token);
 *
 * if (result.success) {
 *   await updateOrderStatus(orderId, 'processing');
 *   await addOrderNote(orderId, `PayPal Payment: ${result.transactionId}`);
 * }
 * ```
 */
export async function capturePayPalOrder(
  paypalOrderId: string
): Promise<CapturePayPalOrderResult> {
  try {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(
      `${PAYPAL_API_URL}/v2/checkout/orders/${paypalOrderId}/capture`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('PayPal capture error:', errorData);
      throw new Error(
        `PayPal capture failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Prüfen ob Zahlung erfolgreich
    if (data.status === 'COMPLETED') {
      const capture = data.purchase_units?.[0]?.payments?.captures?.[0];
      const transactionId = capture?.id;
      const payerEmail = data.payer?.email_address;
      const payerName = `${data.payer?.name?.given_name || ''} ${
        data.payer?.name?.surname || ''
      }`.trim();

      return {
        success: true,
        transactionId,
        payerEmail,
        payerName,
      };
    }

    // Zahlung nicht erfolgreich
    console.warn('PayPal payment not completed:', data.status);
    return {
      success: false,
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
 * Ruft Details einer PayPal Order ab
 *
 * Nützlich für Debugging oder Verifizierung
 *
 * @param paypalOrderId - Die PayPal Order ID
 * @returns Die vollständige PayPal Order
 *
 * @example
 * ```typescript
 * const order = await getPayPalOrder('5O190127TN364715T');
 * console.log(`Order status: ${order.status}`);
 * ```
 */
export async function getPayPalOrder(paypalOrderId: string): Promise<any> {
  try {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(
      `${PAYPAL_API_URL}/v2/checkout/orders/${paypalOrderId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch PayPal order: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to get PayPal order:', error);
    throw new Error(
      `Failed to get PayPal order: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}
