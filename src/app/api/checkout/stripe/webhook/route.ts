/**
 * API Route: Stripe Webhook
 *
 * POST /api/checkout/stripe/webhook
 *
 * Empfängt Webhooks von Stripe für Zahlungsbestätigungen
 *
 * WICHTIG:
 * - Diese Route muss den RAW request body erhalten (nicht JSON-geparsed)
 * - Stripe-Signature Header wird zur Verifizierung benötigt
 * - Webhook muss in Stripe Dashboard konfiguriert werden
 */

import { NextRequest, NextResponse } from 'next/server';
import { handleStripeWebhook } from '@/lib/stripe';
import { updateOrderStatus, addOrderNote } from '@/lib/woocommerce-checkout';

// ============================================================================
// POST Handler
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // 1. Raw request body holen (WICHTIG: nicht JSON-geparsed!)
    const payload = await request.text();

    // 2. Stripe-Signature Header
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('❌ Stripe webhook: Missing signature header');
      return NextResponse.json(
        { error: 'Missing signature header' },
        { status: 400 }
      );
    }

    // 3. Webhook verarbeiten
    const result = await handleStripeWebhook(payload, signature);

    console.log(
      `✅ Stripe webhook received for order ${result.orderId}: ${result.status}`
    );

    // 4. Order-Status aktualisieren
    if (result.status === 'paid') {
      // Zahlung erfolgreich → Status auf "processing"
      await updateOrderStatus(result.orderId, 'processing');
      await addOrderNote(
        result.orderId,
        `Stripe payment successful. Session ID: ${result.sessionId}`,
        false
      );
      console.log(`✅ Order ${result.orderId} marked as processing`);
    } else if (result.status === 'failed') {
      // Zahlung fehlgeschlagen → Status auf "failed"
      await updateOrderStatus(result.orderId, 'failed');
      await addOrderNote(
        result.orderId,
        `Stripe payment failed or expired. Session ID: ${result.sessionId}`,
        false
      );
      console.log(`❌ Order ${result.orderId} marked as failed`);
    }

    // 5. Stripe bestätigen, dass Webhook empfangen wurde
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Stripe webhook error:', error);

    // Bei Webhook-Fehlern muss Stripe ein 400/500 erhalten,
    // damit es den Webhook erneut sendet
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Webhook processing failed',
      },
      { status: 400 }
    );
  }
}

// ============================================================================
// Config: Raw Body
// ============================================================================

// WICHTIG: Next.js soll den Body NICHT als JSON parsen
export const config = {
  api: {
    bodyParser: false,
  },
};
