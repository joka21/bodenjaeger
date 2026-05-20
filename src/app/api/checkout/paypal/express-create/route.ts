/**
 * API Route: PayPal Express Create
 *
 * POST /api/checkout/paypal/express-create
 *
 * Body (vom Express-Button im Browser):
 * {
 *   items: [{ name, quantity, price }]   // Brutto-Einzelpreise in EUR
 *   subtotal: number                      // Brutto-Summe der Items (ohne Versand)
 *   shipping_cost: number                 // geschätzte Versandkosten in EUR
 * }
 *
 * Response (Erfolg):
 * {
 *   success: true,
 *   approvalUrl: string,       // Redirect-URL zu PayPal
 *   paypalOrderId: string,
 *   referenceId: string,
 * }
 *
 * Erstellt NUR die PayPal-Order. Die WooCommerce-Order entsteht
 * erst nach erfolgreichem Capture in /api/checkout/paypal/express-capture.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createPayPalExpressOrder } from '@/lib/paypal';

interface ExpressCreateBody {
  items: Array<{
    name: string;
    quantity: number;
    price: number; // Brutto-Einzelpreis in EUR
  }>;
  subtotal: number;
  shipping_cost: number;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Body parsen
    let body: ExpressCreateBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    // 2. Server-Side Validation
    const errors: string[] = [];

    if (!Array.isArray(body.items) || body.items.length === 0) {
      errors.push('Keine Artikel im Warenkorb');
    } else {
      body.items.forEach((item, idx) => {
        if (!item.name || typeof item.name !== 'string') {
          errors.push(`Artikel ${idx + 1}: Name fehlt`);
        }
        if (typeof item.quantity !== 'number' || item.quantity <= 0) {
          errors.push(`Artikel ${idx + 1}: Menge ungültig`);
        }
        if (typeof item.price !== 'number' || item.price < 0) {
          errors.push(`Artikel ${idx + 1}: Preis ungültig`);
        }
      });
    }

    if (typeof body.subtotal !== 'number' || body.subtotal <= 0) {
      errors.push('Zwischensumme ungültig');
    }
    if (typeof body.shipping_cost !== 'number' || body.shipping_cost < 0) {
      errors.push('Versandkosten ungültig');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: errors.join('; ') },
        { status: 400 }
      );
    }

    // 3. Line Items für PayPal (Stückpreise als String mit 2 Decimals)
    const paypalLineItems = body.items.map((item) => ({
      name: item.name.slice(0, 127), // PayPal max length 127
      quantity: item.quantity,
      unit_amount: item.price.toFixed(2),
    }));

    // 4. Gesamtbetrag inkl. (geschätzter) Versandkosten
    //    Folgt dem Pattern aus create-order/route.ts (Standard-PayPal-Flow):
    //    amount = subtotal + shipping_cost, Versand ist KEIN separates Line-Item.
    const totalAmount = (body.subtotal + body.shipping_cost).toFixed(2);

    // 5. PayPal Express Order beim Proxy erstellen
    const result = await createPayPalExpressOrder({
      amount: totalAmount,
      lineItems: paypalLineItems,
    });

    console.log(
      `✅ PayPal Express Order created: ${result.paypalOrderId} (ref: ${result.referenceId})`
    );

    return NextResponse.json({
      success: true,
      approvalUrl: result.approvalUrl,
      paypalOrderId: result.paypalOrderId,
      referenceId: result.referenceId,
    });
  } catch (error) {
    console.error('❌ PayPal Express Create error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'PayPal Express creation failed',
      },
      { status: 500 }
    );
  }
}
