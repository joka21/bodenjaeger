/**
 * API Route: Order erstellen + Payment Session
 *
 * POST /api/checkout/create-order
 *
 * Erstellt eine WooCommerce Order und initiiert den Payment-Flow
 * je nach ausgewählter Zahlungsmethode
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  createWooCommerceOrder,
  updateOrderStatus,
  type WooCommerceOrderData,
} from '@/lib/woocommerce-checkout';
import { createStripeCheckoutSession, euroToCents } from '@/lib/stripe';
import { createPayPalOrder } from '@/lib/paypal';
import { wpValidateToken, wpGetCurrentUser } from '@/lib/auth';

// ============================================================================
// TypeScript Interfaces
// ============================================================================

interface CreateOrderRequestBody {
  billing: {
    first_name: string;
    last_name: string;
    company?: string;
    address_1: string;
    address_2?: string;
    city: string;
    state?: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    company?: string;
    address_1: string;
    address_2?: string;
    city: string;
    state?: string;
    postcode: string;
    country: string;
  };
  line_items: Array<{
    product_id: number;
    quantity: number;
    subtotal?: string;
    total?: string;
    name?: string;
    meta_data?: Array<{
      key: string;
      value: string;
    }>;
  }>;
  payment_method: 'stripe' | 'paypal' | 'sofort' | 'bacs';
  shipping_method?: 'delivery' | 'pickup';
  customer_note?: string;
  shipping_cost?: number;
}

// ============================================================================
// POST Handler
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // 1. Request Body parsen
    const body: CreateOrderRequestBody = await request.json();
    const { billing, shipping, line_items, payment_method, shipping_method, customer_note, shipping_cost } =
      body;

    // 2. Validierung
    const validation = validateOrderData(body);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.errors.join(', '),
        },
        { status: 400 }
      );
    }

    // 3. Eingeloggten Kunden erkennen (optional, Gastbestellung bleibt möglich)
    let customerId: number | undefined;
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get('auth_token')?.value;
      if (token) {
        const isValid = await wpValidateToken(token);
        if (isValid) {
          const user = await wpGetCurrentUser(token);
          if (user) {
            customerId = user.id;
            console.log(`👤 Eingeloggter Kunde: ${user.id} (${user.email})`);
          }
        }
      }
    } catch {
      // Kein Auth — Gastbestellung, kein Problem
    }

    // 4. Payment Method für WooCommerce festlegen
    const wcPaymentMethod = payment_method === 'sofort' ? 'stripe_sofort' : payment_method;

    // WooCommerce REST API interpretiert line_items.subtotal/total und
    // shipping_lines.total IMMER als Netto (ex-Tax) — unabhängig von der
    // "Preise inkl. Steuern eingeben"-Einstellung im Admin. Das Frontend
    // sendet Brutto (wie im Warenkorb angezeigt), also hier für den
    // WC-Call auf Netto umrechnen. Stripe/PayPal unten bleiben auf Brutto.
    const TAX_RATE = 1.19;
    const lineItemsNet = line_items.map((item) => ({
      ...item,
      ...(item.subtotal !== undefined
        ? { subtotal: (parseFloat(item.subtotal) / TAX_RATE).toFixed(2) }
        : {}),
      ...(item.total !== undefined
        ? { total: (parseFloat(item.total) / TAX_RATE).toFixed(2) }
        : {}),
    }));
    const shippingCostNet = shipping_cost ? shipping_cost / TAX_RATE : 0;

    // 5. WooCommerce Order erstellen (Status: pending)
    const orderData: WooCommerceOrderData = {
      ...(customerId ? { customer_id: customerId } : {}),
      payment_method: wcPaymentMethod,
      payment_method_title: getPaymentMethodTitle(payment_method),
      set_paid: false,
      status: 'pending',
      billing,
      shipping,
      line_items: lineItemsNet,
      customer_note,
      shipping_lines: shipping_method === 'pickup'
        ? [
            {
              method_id: 'local_pickup',
              method_title: 'Abholung im Fachmarkt',
              total: '0.00',
            },
          ]
        : shipping_cost
          ? [
              {
                method_id: 'flat_rate',
                method_title: 'Standardversand',
                total: shippingCostNet.toFixed(2),
              },
            ]
          : undefined,
    };

    const order = await createWooCommerceOrder(orderData);

    console.log(`✅ WooCommerce Order created: ${order.id}`);

    // 6. Kundenprofil mit Adressen aktualisieren (im Hintergrund, blockiert nicht)
    if (customerId) {
      const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
      const WC_KEY = process.env.WC_CONSUMER_KEY;
      const WC_SECRET = process.env.WC_CONSUMER_SECRET;
      fetch(`${WP_URL}/wp-json/wc/v3/customers/${customerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64')}`,
        },
        body: JSON.stringify({ billing, shipping }),
      }).catch((err) => console.error('Kundenprofil-Update fehlgeschlagen:', err));
    }

    // 7. Je nach Zahlungsmethode: Payment Session erstellen oder direkt zur Success-Page
    let redirectUrl: string | null = null;

    // ============================
    // STRIPE (Kreditkarte)
    // ============================
    if (payment_method === 'stripe') {
      const stripeSession = await createStripeCheckoutSession({
        orderId: order.id,
        orderKey: order.order_key,
        lineItems: line_items.map((item) => ({
          name: item.name || `Produkt #${item.product_id}`,
          quantity: item.quantity,
          price: euroToCents(parseFloat(item.total || '0') / item.quantity),
        })),
        customerEmail: billing.email,
        paymentMethod: 'card',
        shippingCost: shipping_cost ? euroToCents(shipping_cost) : undefined,
      });

      redirectUrl = stripeSession.url;
      console.log(`✅ Stripe Session created: ${stripeSession.sessionId}`);
    }

    // ============================
    // SOFORTÜBERWEISUNG (Stripe)
    // ============================
    if (payment_method === 'sofort') {
      const stripeSession = await createStripeCheckoutSession({
        orderId: order.id,
        orderKey: order.order_key,
        lineItems: line_items.map((item) => ({
          name: item.name || `Produkt #${item.product_id}`,
          quantity: item.quantity,
          price: euroToCents(parseFloat(item.total || '0') / item.quantity),
        })),
        customerEmail: billing.email,
        paymentMethod: 'sofort',
        shippingCost: shipping_cost ? euroToCents(shipping_cost) : undefined,
      });

      redirectUrl = stripeSession.url;
      console.log(`✅ Stripe SOFORT Session created: ${stripeSession.sessionId}`);
    }

    // ============================
    // PAYPAL
    // ============================
    if (payment_method === 'paypal') {
      // Gesamtbetrag berechnen
      const subtotal = line_items.reduce(
        (sum, item) => sum + parseFloat(item.total || '0'),
        0
      );
      const total = subtotal + (shipping_cost || 0);

      const paypalOrder = await createPayPalOrder({
        orderId: order.id,
        orderKey: order.order_key,
        amount: total.toFixed(2),
        lineItems: line_items.map((item) => ({
          name: item.name || `Produkt #${item.product_id}`,
          quantity: item.quantity,
          unit_amount: (parseFloat(item.total || '0') / item.quantity).toFixed(2),
        })),
      });

      redirectUrl = paypalOrder.approvalUrl;
      console.log(`✅ PayPal Order created: ${paypalOrder.paypalOrderId}`);
    }

    // ============================
    // VORKASSE (BACS)
    // ============================
    if (payment_method === 'bacs') {
      // Kein Redirect nötig, Status auf "on-hold" setzen (Warten auf Zahlung)
      await updateOrderStatus(order.id, 'on-hold');
      redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?order=${order.id}&key=${order.order_key}`;
      console.log(`✅ Vorkasse Order created, status set to on-hold`);
    }

    // 6. Erfolg zurückgeben
    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderKey: order.order_key,
      total: order.total,
      redirectUrl,
    });
  } catch (error) {
    console.error('❌ Checkout error:', error);

    // Error Response
    return NextResponse.json(
      {
        success: false,
        error: 'Bestellung konnte nicht erstellt werden. Bitte versuchen Sie es erneut.',
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// Hilfsfunktionen
// ============================================================================

/**
 * Validiert die Order-Daten
 */
function validateOrderData(data: CreateOrderRequestBody): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Billing Validierung
  if (!data.billing?.email) {
    errors.push('E-Mail ist erforderlich');
  } else if (!isValidEmail(data.billing.email)) {
    errors.push('Ungültige E-Mail-Adresse');
  }

  if (!data.billing?.first_name) {
    errors.push('Vorname (Rechnung) ist erforderlich');
  }

  if (!data.billing?.last_name) {
    errors.push('Nachname (Rechnung) ist erforderlich');
  }

  if (!data.billing?.address_1) {
    errors.push('Straße (Rechnung) ist erforderlich');
  }

  if (!data.billing?.city) {
    errors.push('Stadt (Rechnung) ist erforderlich');
  }

  if (!data.billing?.postcode) {
    errors.push('Postleitzahl (Rechnung) ist erforderlich');
  }

  if (!data.billing?.country) {
    errors.push('Land (Rechnung) ist erforderlich');
  }

  if (!data.billing?.phone) {
    errors.push('Telefon ist erforderlich');
  }

  // Shipping Validierung
  if (!data.shipping?.first_name) {
    errors.push('Vorname (Versand) ist erforderlich');
  }

  if (!data.shipping?.last_name) {
    errors.push('Nachname (Versand) ist erforderlich');
  }

  if (!data.shipping?.address_1) {
    errors.push('Straße (Versand) ist erforderlich');
  }

  if (!data.shipping?.city) {
    errors.push('Stadt (Versand) ist erforderlich');
  }

  if (!data.shipping?.postcode) {
    errors.push('Postleitzahl (Versand) ist erforderlich');
  }

  if (!data.shipping?.country) {
    errors.push('Land (Versand) ist erforderlich');
  }

  // Line Items Validierung
  if (!data.line_items || data.line_items.length === 0) {
    errors.push('Warenkorb ist leer');
  }

  if (data.line_items) {
    data.line_items.forEach((item, index) => {
      if (!item.product_id || typeof item.product_id !== 'number') {
        errors.push(`Produkt ${index + 1}: Ungültige Produkt-ID`);
      }

      if (!item.quantity || item.quantity < 1) {
        errors.push(`Produkt ${index + 1}: Ungültige Menge`);
      }
    });
  }

  // Payment Method Validierung
  if (!data.payment_method) {
    errors.push('Zahlungsmethode ist erforderlich');
  }

  const validPaymentMethods = ['stripe', 'paypal', 'sofort', 'bacs'];
  if (data.payment_method && !validPaymentMethods.includes(data.payment_method)) {
    errors.push('Ungültige Zahlungsmethode');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * E-Mail Validierung (einfache Regex)
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Gibt den Titel der Zahlungsmethode zurück
 */
function getPaymentMethodTitle(method: string): string {
  const titles: Record<string, string> = {
    stripe: 'Kreditkarte (Visa, Mastercard, Amex)',
    paypal: 'PayPal',
    sofort: 'Sofortüberweisung',
    bacs: 'Vorkasse / Überweisung',
  };
  return titles[method] || method;
}
