/**
 * API Route: PayPal Capture
 *
 * GET /api/checkout/paypal/capture?order=123&token=xxx
 *
 * Erfasst die PayPal-Zahlung nachdem Kunde von PayPal zurückkommt
 *
 * WICHTIG:
 * - "token" ist die PayPal Order ID (wird von PayPal als Query-Parameter gesendet)
 * - "order" ist unsere WooCommerce Order ID
 */

import { NextRequest, NextResponse } from 'next/server';
import { capturePayPalOrder } from '@/lib/paypal';
import { updateOrderStatus, addOrderNote } from '@/lib/woocommerce-checkout';

// ============================================================================
// GET Handler
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // 1. Query-Parameter auslesen
    const searchParams = request.nextUrl.searchParams;
    const wcOrderId = searchParams.get('order');
    const paypalOrderId = searchParams.get('token'); // PayPal sendet als "token"

    // 2. Validierung
    if (!wcOrderId || !paypalOrderId) {
      console.error('❌ PayPal capture: Missing parameters');
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?error=missing_params`,
        { status: 302 }
      );
    }

    const orderId = parseInt(wcOrderId);
    if (isNaN(orderId)) {
      console.error('❌ PayPal capture: Invalid order ID');
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?error=invalid_order_id`,
        { status: 302 }
      );
    }

    console.log(
      `🔄 Capturing PayPal payment for WC Order ${orderId}, PayPal Order ${paypalOrderId}`
    );

    // 3. PayPal Zahlung erfassen (capture)
    const result = await capturePayPalOrder(paypalOrderId);

    // 4. Erfolg: Order-Status aktualisieren
    if (result.success) {
      await updateOrderStatus(orderId, 'processing');

      const note = `PayPal payment successful. Transaction ID: ${result.transactionId}. Payer: ${result.payerName} (${result.payerEmail})`;
      await addOrderNote(orderId, note, false);

      console.log(`✅ Order ${orderId} marked as processing`);

      // Redirect zur Success-Page
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?order=${orderId}&paypal=success`,
        { status: 302 }
      );
    }

    // 5. Fehler: Zahlung fehlgeschlagen
    await updateOrderStatus(orderId, 'failed');
    await addOrderNote(
      orderId,
      `PayPal payment failed. PayPal Order ID: ${paypalOrderId}`,
      false
    );

    console.log(`❌ Order ${orderId} marked as failed`);

    // Redirect zurück zum Checkout mit Error
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?error=payment_failed&order=${orderId}`,
      { status: 302 }
    );
  } catch (error) {
    console.error('❌ PayPal capture error:', error);

    // Bei Fehler: Redirect zurück zum Checkout
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?error=payment_error`,
      { status: 302 }
    );
  }
}
