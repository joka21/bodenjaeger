import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { clearProductCache, clearAllProductCaches } from '@/lib/cache';
import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Webhook API Route: Cache Revalidation
 *
 * Supports two authentication methods:
 *
 * 1. WooCommerce Webhook (recommended):
 *    - Authenticates via X-WC-Webhook-Signature (HMAC-SHA256)
 *    - Secret is set in WooCommerce > Settings > Advanced > Webhooks
 *    - Payload is the full WooCommerce product object
 *    - Topic comes from X-WC-Webhook-Topic header
 *
 * 2. Manual trigger (for testing/scripts):
 *    - Authenticates via ?secret= query parameter
 *    - Payload: { product_slug?, product_id?, clear_all? }
 *
 * WordPress Webhook Setup:
 * 1. WooCommerce > Einstellungen > Erweitert > Webhooks > Webhook hinzufuegen
 * 2. Name: "Cache Revalidation - Produkt aktualisiert"
 * 3. Status: Aktiv
 * 4. Thema: Produkt aktualisiert (bzw. erstellt / geloescht)
 * 5. Auslieferungs-URL: https://bodenjaeger.vercel.app/api/revalidate
 * 6. Geheimnis: Gleicher Wert wie REVALIDATE_SECRET in Vercel Environment
 * 7. API-Version: WP REST API Integration v3
 */

function verifyWooCommerceSignature(rawBody: string, signature: string, secret: string): boolean {
  try {
    const expectedSignature = createHmac('sha256', secret)
      .update(rawBody, 'utf8')
      .digest('base64');

    const sigBuffer = Buffer.from(signature, 'base64');
    const expectedBuffer = Buffer.from(expectedSignature, 'base64');

    if (sigBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return timingSafeEqual(sigBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.REVALIDATE_SECRET;
    if (!secret) {
      console.error('❌ REVALIDATE_SECRET not configured');
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    // Read raw body once (needed for signature verification)
    const rawBody = await request.text();

    // Determine authentication method
    const wcSignature = request.headers.get('x-wc-webhook-signature');
    const wcTopic = request.headers.get('x-wc-webhook-topic');
    const querySecret = request.nextUrl.searchParams.get('secret');

    let isAuthenticated = false;
    let isWooCommerceWebhook = false;

    if (wcSignature) {
      // Method 1: WooCommerce Webhook signature
      isAuthenticated = verifyWooCommerceSignature(rawBody, wcSignature, secret);
      isWooCommerceWebhook = true;

      if (!isAuthenticated) {
        // Fallback: also accept if query secret matches (belt and suspenders)
        if (querySecret && querySecret === secret) {
          isAuthenticated = true;
          console.log('⚠️ WC signature failed but query secret valid — accepting');
        } else {
          console.error('❌ Invalid WooCommerce webhook signature');
          return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }
      }

      // Handle WooCommerce ping (sent when webhook is first created)
      if (wcTopic === 'action.woocommerce_webhook_ping') {
        console.log('🏓 WooCommerce webhook ping received — OK');
        return NextResponse.json({ success: true, message: 'Pong' });
      }
    } else if (querySecret) {
      // Method 2: Query parameter (manual trigger or WC webhook with ?secret=)
      isAuthenticated = querySecret === secret;

      if (!isAuthenticated) {
        console.error('❌ Invalid revalidate secret');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    } else {
      return NextResponse.json({ error: 'No authentication provided' }, { status: 401 });
    }

    // Handle WooCommerce ping even without signature header (some WC versions)
    const wcTopicFallback = request.headers.get('x-wc-webhook-topic');
    if (wcTopicFallback === 'action.woocommerce_webhook_ping') {
      console.log('🏓 WooCommerce webhook ping received — OK');
      return NextResponse.json({ success: true, message: 'Pong' });
    }

    // Parse payload
    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      payload = {};
    }

    // Extract product info based on source
    let productSlug: string | undefined;
    let productId: number | undefined;
    let action: string;
    let clearAll = false;

    if (isWooCommerceWebhook) {
      // WooCommerce sends the full product object
      productId = payload.id;
      productSlug = payload.slug;
      action = wcTopic || 'unknown';

      console.log(`📬 WooCommerce Webhook: ${action} — Produkt: "${payload.name || 'unbekannt'}" (ID: ${productId}, Slug: ${productSlug})`);
    } else {
      // Manual trigger
      productId = payload.product_id;
      productSlug = payload.product_slug;
      action = payload.action || 'manual';
      clearAll = payload.clear_all === true;
    }

    // Clear KV cache
    if (clearAll) {
      console.log('🗑️ Clearing ALL product caches');
      await clearAllProductCaches();
    } else if (productSlug) {
      console.log(`🗑️ Clearing KV cache for: ${productSlug}`);
      await clearProductCache(productSlug);
    }

    // Revalidate Next.js ISR paths
    const revalidatedPaths: string[] = [];

    if (clearAll) {
      revalidatePath('/products/[slug]', 'page');
      revalidatePath('/category/[slug]', 'page');
      revalidatePath('/', 'page');
      revalidatePath('/bestseller', 'page');
      revalidatePath('/sale', 'page');
      revalidatedPaths.push('/products/*', '/category/*', '/', '/bestseller', '/sale');
    } else if (productSlug) {
      const productPath = `/products/${productSlug}`;
      revalidatePath(productPath, 'page');
      revalidatedPaths.push(productPath);

      // Homepage too — product could be featured/bestseller/sale
      revalidatePath('/', 'page');
      revalidatedPaths.push('/');
    } else {
      // No slug available — revalidate broadly
      revalidatePath('/products/[slug]', 'page');
      revalidatePath('/', 'page');
      revalidatedPaths.push('/products/*', '/');
    }

    const timestamp = new Date().toISOString();
    console.log(`✅ Revalidation complete | ${action} | Paths: ${revalidatedPaths.join(', ')} | ${timestamp}`);

    return NextResponse.json({
      success: true,
      message: 'Cache cleared and pages revalidated',
      timestamp,
      revalidated: revalidatedPaths,
      product_id: productId,
      product_slug: productSlug,
      source: isWooCommerceWebhook ? 'woocommerce-webhook' : 'manual',
    });

  } catch (error) {
    console.error('❌ Revalidation error:', error);
    return NextResponse.json(
      { success: false, error: 'Revalidation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET for health check / manual testing
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    message: 'Revalidation webhook endpoint is ready',
    supports: [
      'WooCommerce Webhooks (X-WC-Webhook-Signature)',
      'Manual trigger (?secret=...)',
    ],
    woocommerce_setup: {
      url: 'https://bodenjaeger.vercel.app/api/revalidate',
      topics: ['product.created', 'product.updated', 'product.deleted'],
      secret: 'Same as REVALIDATE_SECRET environment variable',
      api_version: 'WP REST API Integration v3',
    },
    manual_usage: {
      method: 'POST',
      url: '/api/revalidate?secret=YOUR_SECRET',
      body_examples: {
        specific_product: { product_slug: 'vinylboden-eiche-natur', product_id: 123 },
        clear_all: { clear_all: true },
      },
    },
  });
}
