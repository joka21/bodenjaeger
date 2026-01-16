/**
 * API Route: Order erstellen + Payment Session
 *
 * POST /api/checkout/create-order
 *
 * Erstellt eine WooCommerce Order und initiiert den Payment-Flow
 * je nach ausgewählter Zahlungsmethode
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  createWooCommerceOrder,
  updateOrderStatus,
  type WooCommerceOrderData,
} from '@/lib/woocommerce-checkout';
import { createStripeCheckoutSession, euroToCents } from '@/lib/stripe';
import { createPayPalOrder } from '@/lib/paypal';

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
    total?: string;
    name?: string;
    meta_data?: Array<{
      key: string;
      value: string;
    }>;
  }>;
  payment_method: 'stripe' | 'paypal' | 'sofort' | 'bacs';
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
    const { billing, shipping, line_items, payment_method, customer_note, shipping_cost } =
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

    // 3. Payment Method für WooCommerce festlegen
    const wcPaymentMethod = payment_method === 'sofort' ? 'stripe_sofort' : payment_method;

    // 4. WooCommerce Order erstellen (Status: pending)
    const orderData: WooCommerceOrderData = {
      payment_method: wcPaymentMethod,
      payment_method_title: getPaymentMethodTitle(payment_method),
      set_paid: false,
      status: 'pending',
      billing,
      shipping,
      line_items,
      customer_note,
      shipping_lines: shipping_cost
        ? [
            {
              method_id: 'flat_rate',
              method_title: 'Standardversand',
              total: shipping_cost.toFixed(2),
            },
          ]
        : undefined,
    };

    const order = await createWooCommerceOrder(orderData);

    console.log(`✅ WooCommerce Order created: ${order.id}`);

    // 5. Je nach Zahlungsmethode: Payment Session erstellen oder direkt zur Success-Page
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
          price: euroToCents(parseFloat(item.total || '0')),
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
          price: euroToCents(parseFloat(item.total || '0')),
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
        error:
          error instanceof Error
            ? error.message
            : 'Bestellung konnte nicht erstellt werden. Bitte versuchen Sie es erneut.',
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
