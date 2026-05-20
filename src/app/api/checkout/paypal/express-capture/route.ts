/**
 * API Route: PayPal Express Capture
 *
 * POST /api/checkout/paypal/express-capture
 *
 * Body (vom Browser im onApprove-Callback des PayPal-Smart-Buttons):
 * {
 *   paypalOrderId: string,           // data.orderID aus dem SDK
 *   items: [{ name, quantity, price, product_id? }],
 *   subtotal: number,                // Brutto, EUR
 *   shipping_cost: number,           // Brutto, EUR
 *   customer_note?: string,
 * }
 *
 * Flow:
 * 1. Body validieren
 * 2. PayPal capturen via WP-Proxy /paypal/express-capture
 *    -> liefert Adresse, Email, Name, Phone, Amount, Transaction-ID
 * 3. WooCommerce-Order erstellen mit set_paid: false + status: 'processing'
 *    (Pattern aus create-order/route.ts; set_paid: true würde einen separaten
 *    WC-Payment-Vorgang anstoßen, was wir nicht wollen, da PayPal bereits captured hat)
 * 4. Transaction-ID + PayPal-Order-ID in meta_data + lesbare Order-Note
 * 5. Response: { success, wcOrderId, wcOrderKey, redirectUrl }
 */

import { NextRequest, NextResponse } from 'next/server';
import { capturePayPalExpressOrder } from '@/lib/paypal';
import { createWooCommerceOrder, addOrderNote } from '@/lib/woocommerce-checkout';
import type { WooCommerceOrderData } from '@/lib/woocommerce-checkout';

interface ExpressCaptureBody {
  paypalOrderId: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number; // Brutto-Einzelpreis in EUR
    product_id: number;
  }>;
  subtotal: number;
  shipping_cost: number;
  customer_note?: string;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Body parsen + validieren
    let body: ExpressCaptureBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    if (!body.paypalOrderId || typeof body.paypalOrderId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'paypalOrderId fehlt' },
        { status: 400 }
      );
    }
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Keine Artikel im Warenkorb' },
        { status: 400 }
      );
    }

    // Per-Item-Validation: product_id ist zwingend für WC-Order-Linking
    // (Inventory-Tracking, Set-Angebot-Verknüpfung, Backoffice-Sicht)
    for (const [idx, item] of body.items.entries()) {
      if (typeof item.product_id !== 'number' || item.product_id <= 0) {
        return NextResponse.json(
          {
            success: false,
            error: `Artikel ${idx + 1}: product_id fehlt oder ungültig`,
          },
          { status: 400 }
        );
      }
    }
    if (typeof body.subtotal !== 'number' || body.subtotal <= 0) {
      return NextResponse.json(
        { success: false, error: 'Zwischensumme ungültig' },
        { status: 400 }
      );
    }
    if (typeof body.shipping_cost !== 'number' || body.shipping_cost < 0) {
      return NextResponse.json(
        { success: false, error: 'Versandkosten ungültig' },
        { status: 400 }
      );
    }

    // 2. PayPal capturen via WP-Plugin /paypal/express-capture
    console.log(`🔄 Capturing PayPal Express Order: ${body.paypalOrderId}`);
    const capture = await capturePayPalExpressOrder(body.paypalOrderId);

    if (!capture.success) {
      console.error(`❌ PayPal Express capture failed: status=${capture.status}`);
      return NextResponse.json(
        {
          success: false,
          error: `PayPal capture nicht erfolgreich (Status: ${capture.status ?? 'unknown'})`,
        },
        { status: 502 }
      );
    }

    if (!capture.payerEmail || !capture.shippingAddress) {
      console.error('❌ PayPal Capture: missing email or shippingAddress');
      return NextResponse.json(
        {
          success: false,
          error: 'PayPal lieferte unvollständige Daten (Adresse oder E-Mail fehlen)',
        },
        { status: 502 }
      );
    }

    // 3. Adresse aus PayPal-Daten -> WC-Format
    const shippingNameRaw = (capture.shippingName ?? '').trim();
    const fullName =
      shippingNameRaw ||
      `${capture.payerGivenName ?? ''} ${capture.payerSurname ?? ''}`.trim();
    const nameParts = fullName.split(/\s+/).filter(Boolean);
    const firstName = (capture.payerGivenName ?? nameParts[0] ?? '').trim();
    const lastName = (capture.payerSurname ?? nameParts.slice(1).join(' ') ?? '').trim();

    const shipping = {
      first_name: firstName,
      last_name:  lastName,
      address_1:  capture.shippingAddress.address_line_1,
      address_2:  capture.shippingAddress.address_line_2 || '',
      city:       capture.shippingAddress.admin_area_2,
      state:      capture.shippingAddress.admin_area_1 || '',
      postcode:   capture.shippingAddress.postal_code,
      country:    capture.shippingAddress.country_code, // ISO 2-Letter (z.B. 'DE')
    };

    const billing = {
      ...shipping,
      email: capture.payerEmail,
      phone: capture.payerPhone || '',
    };

    // 4. Line Items Brutto -> Netto (Pattern aus create-order/route.ts:131-141, TAX_RATE = 1.19)
    const TAX_RATE = 1.19;
    const lineItemsNet = body.items.map((item) => {
      const grossSubtotal = item.price * item.quantity;
      const netSubtotal = (grossSubtotal / TAX_RATE).toFixed(2);
      return {
        product_id: item.product_id,
        quantity:   item.quantity,
        subtotal:   netSubtotal,
        total:      netSubtotal,
      };
    });

    const shippingCostNet =
      body.shipping_cost > 0 ? (body.shipping_cost / TAX_RATE).toFixed(2) : '0.00';

    // 5. WC-Order anlegen
    const orderData: WooCommerceOrderData = {
      payment_method: 'paypal',
      payment_method_title: 'PayPal Express',
      set_paid: false,
      status: 'processing',
      billing,
      shipping,
      line_items: lineItemsNet,
      customer_note: body.customer_note || '',
      shipping_lines:
        body.shipping_cost > 0
          ? [
              {
                method_id: 'flat_rate',
                method_title: 'Standardversand',
                total: shippingCostNet,
              },
            ]
          : undefined,
      meta_data: [
        { key: '_transaction_id', value: capture.transactionId ?? '' },
        { key: '_paypal_order_id', value: body.paypalOrderId },
        { key: '_paypal_express', value: 'yes' },
      ],
    };

    const wcOrder = await createWooCommerceOrder(orderData);

    if (!wcOrder || !wcOrder.id) {
      console.error(
        '❌ WC Order creation FAILED AFTER successful PayPal capture — Zahlung erfasst, Order nicht erstellt!'
      );
      return NextResponse.json(
        {
          success: false,
          error:
            'Bestellung konnte nicht angelegt werden, obwohl die Zahlung bei PayPal bereits erfasst wurde. Bitte kontaktieren Sie uns mit der PayPal-Transaktionsnummer.',
          paypalOrderId: body.paypalOrderId,
          transactionId: capture.transactionId,
        },
        { status: 500 }
      );
    }

    // 6. Lesbare Order-Note (interne Notiz, customer-visible: false)
    await addOrderNote(
      wcOrder.id,
      `PayPal Express Zahlung erfolgreich. PayPal Order ID: ${body.paypalOrderId}, Transaction ID: ${
        capture.transactionId ?? '–'
      }, Betrag: ${capture.amount?.value ?? '?'} ${capture.amount?.currency_code ?? 'EUR'}.`,
      false
    );

    console.log(`✅ WC Order ${wcOrder.id} created from PayPal Express capture`);

    return NextResponse.json({
      success: true,
      wcOrderId: wcOrder.id,
      wcOrderKey: wcOrder.order_key,
      redirectUrl: `/checkout/success?order=${wcOrder.id}&paypal=success`,
    });
  } catch (error) {
    console.error('❌ PayPal Express Capture error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Express capture failed',
      },
      { status: 500 }
    );
  }
}
