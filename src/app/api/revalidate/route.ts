import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { clearProductCache, clearAllProductCaches } from '@/lib/cache';

/**
 * Webhook API Route: Cache Revalidation
 *
 * Authenticates via ?secret= query parameter.
 * Accepts both WooCommerce webhook payloads and manual triggers.
 *
 * WordPress Webhook Setup:
 * 1. WooCommerce > Einstellungen > Erweitert > Webhooks > Webhook hinzufuegen
 * 2. Name: z.B. "Cache Revalidation - Produkt aktualisiert"
 * 3. Status: Aktiv
 * 4. Thema: Produkt aktualisiert (bzw. erstellt / geloescht)
 * 5. Auslieferungs-URL: https://bodenjaeger.de/api/revalidate?secret=DEIN_SECRET
 * 6. API-Version: WP REST API Integration v3
 */

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate via query parameter
    const secret = process.env.REVALIDATE_SECRET;
    const querySecret = request.nextUrl.searchParams.get('secret');

    if (!secret || !querySecret || querySecret !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Check for WooCommerce ping (sent when webhook is first created)
    const wcTopic = request.headers.get('x-wc-webhook-topic');
    if (wcTopic === 'action.woocommerce_webhook_ping') {
      console.log('🏓 WooCommerce webhook ping — OK');
      return NextResponse.json({ success: true, message: 'Pong' });
    }

    // 3. Parse payload
    let payload;
    try {
      const rawBody = await request.text();
      payload = rawBody ? JSON.parse(rawBody) : {};
    } catch {
      payload = {};
    }

    // 4. Extract product info — WooCommerce sends full product object, manual sends { product_slug, product_id }
    const isWooCommerce = !!wcTopic;
    const productSlug: string | undefined = isWooCommerce ? payload.slug : payload.product_slug;
    const productId: number | undefined = isWooCommerce ? payload.id : payload.product_id;
    const action = wcTopic || payload.action || 'manual';
    const clearAll = payload.clear_all === true;

    if (isWooCommerce) {
      console.log(`📬 WooCommerce Webhook: ${action} — "${payload.name || 'unbekannt'}" (ID: ${productId}, Slug: ${productSlug})`);
    }

    // 5. Clear KV cache
    if (clearAll) {
      await clearAllProductCaches();
    } else if (productSlug) {
      await clearProductCache(productSlug);
    }

    // 6. Revalidate Next.js ISR paths
    const revalidatedPaths: string[] = [];

    if (clearAll) {
      revalidatePath('/products/[slug]', 'page');
      revalidatePath('/category/[slug]', 'page');
      revalidatePath('/', 'page');
      revalidatePath('/bestseller', 'page');
      revalidatePath('/sale', 'page');
      revalidatedPaths.push('/products/*', '/category/*', '/', '/bestseller', '/sale');
    } else if (productSlug) {
      revalidatePath(`/products/${productSlug}`, 'page');
      revalidatedPaths.push(`/products/${productSlug}`);
      revalidatePath('/', 'page');
      revalidatedPaths.push('/');
    } else {
      revalidatePath('/products/[slug]', 'page');
      revalidatePath('/', 'page');
      revalidatedPaths.push('/products/*', '/');
    }

    const timestamp = new Date().toISOString();
    console.log(`✅ Revalidation | ${action} | ${revalidatedPaths.join(', ')} | ${timestamp}`);

    return NextResponse.json({
      success: true,
      message: 'Cache cleared and pages revalidated',
      timestamp,
      revalidated: revalidatedPaths,
      product_id: productId,
      product_slug: productSlug,
      source: isWooCommerce ? 'woocommerce-webhook' : 'manual',
    });

  } catch (error) {
    console.error('❌ Revalidation error:', error);
    return NextResponse.json(
      { success: false, error: 'Revalidation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET for health check
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    message: 'Revalidation webhook endpoint is ready',
    woocommerce_setup: {
      url: 'https://bodenjaeger.de/api/revalidate?secret=YOUR_REVALIDATE_SECRET',
      topics: ['product.created', 'product.updated', 'product.deleted'],
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
