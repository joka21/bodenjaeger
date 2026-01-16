/**
 * API Route: Order Status abrufen
 *
 * GET /api/checkout/order/[id]?email=kunde@example.com
 *
 * Ruft Order-Details ab und verifiziert mit E-Mail-Adresse
 * (Sicherheit: Kunde kann nur eigene Orders abrufen)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOrderByIdAndEmail } from '@/lib/woocommerce-checkout';

// ============================================================================
// GET Handler
// ============================================================================

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Params auflösen (Next.js 15 Promise-basiert)
    const params = await context.params;
    const orderId = parseInt(params.id);

    // 2. E-Mail aus Query-Parameter
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    // 3. Validierung
    if (isNaN(orderId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Ungültige Order-ID',
        },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: 'E-Mail-Adresse erforderlich',
        },
        { status: 400 }
      );
    }

    // 4. Order abrufen + E-Mail verifizieren
    const order = await getOrderByIdAndEmail(orderId, email);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: 'Bestellung nicht gefunden oder E-Mail-Adresse stimmt nicht überein',
        },
        { status: 404 }
      );
    }

    // 5. Order-Details zurückgeben
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        order_key: order.order_key,
        status: order.status,
        total: order.total,
        currency: order.currency,
        date_created: order.date_created,
        line_items: order.line_items,
        billing: order.billing,
        shipping: order.shipping,
      },
    });
  } catch (error) {
    console.error('❌ Error fetching order:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Fehler beim Abrufen der Bestellung',
      },
      { status: 500 }
    );
  }
}
