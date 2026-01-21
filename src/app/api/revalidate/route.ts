import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { clearProductCache } from '@/lib/cache';

/**
 * Webhook API Route: Cache Revalidation
 *
 * This endpoint is called by WordPress when products are updated.
 * It clears all relevant caches and triggers ISR revalidation.
 *
 * WordPress Webhook Setup:
 * 1. Install plugin "WP Webhooks" or "WooCommerce Webhooks"
 * 2. Configure webhook URL: https://yourdomain.com/api/revalidate
 * 3. Add secret parameter: ?secret=YOUR_REVALIDATE_SECRET
 * 4. Trigger on: Product Updated, Product Created, Product Deleted
 *
 * Manual trigger:
 * curl -X POST "https://yourdomain.com/api/revalidate?secret=YOUR_SECRET" \
 *   -H "Content-Type: application/json" \
 *   -d '{"product_id": 123, "product_slug": "example-product"}'
 */

interface WebhookPayload {
  product_id?: number;
  product_slug?: string;
  action?: 'updated' | 'created' | 'deleted';
  clear_all?: boolean; // Force clear all caches
}

export async function POST(request: NextRequest) {
  try {
    // 1. Verify secret token
    const searchParams = request.nextUrl.searchParams;
    const secret = searchParams.get('secret');

    if (!secret || secret !== process.env.REVALIDATE_SECRET) {
      console.error('❌ Invalid revalidate secret');
      return NextResponse.json(
        { error: 'Unauthorized - Invalid secret' },
        { status: 401 }
      );
    }

    console.log('✅ Webhook authenticated successfully');

    // 2. Parse webhook payload
    let payload: WebhookPayload = {};
    try {
      payload = await request.json();
      console.log('📦 Webhook payload:', payload);
    } catch {
      // If no body provided, clear all caches
      payload = { clear_all: true };
    }

    const { product_id, product_slug, action, clear_all } = payload;

    // 3. Clear Vercel KV Cache
    if (product_slug) {
      console.log(`🗑️ Clearing KV cache for product: ${product_slug}`);
      await clearProductCache(product_slug);
    }

    // 4. Revalidate Next.js ISR paths
    const revalidatedPaths: string[] = [];

    if (clear_all) {
      // Clear all product pages and category pages
      console.log('🔄 Clearing ALL product caches (full revalidation)');

      revalidatePath('/products/[slug]', 'page');
      revalidatePath('/category/[slug]', 'page');
      revalidatePath('/', 'page'); // Homepage (bestsellers, sale products)

      revalidatedPaths.push('/products/*', '/category/*', '/');
    } else if (product_slug) {
      // Clear specific product page
      const productPath = `/products/${product_slug}`;
      console.log(`🔄 Revalidating product page: ${productPath}`);
      revalidatePath(productPath, 'page');
      revalidatedPaths.push(productPath);

      // Also revalidate homepage in case this product is featured/bestseller/sale
      revalidatePath('/', 'page');
      revalidatedPaths.push('/');
    }

    // 5. Log the action
    const timestamp = new Date().toISOString();
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║  CACHE REVALIDATION SUCCESSFUL                                 ║
╠════════════════════════════════════════════════════════════════╣
║  Timestamp:      ${timestamp}                             ║
║  Product ID:     ${product_id || 'N/A'}                                             ║
║  Product Slug:   ${product_slug || 'N/A'}                                    ║
║  Action:         ${action || 'manual'}                                        ║
║  Clear All:      ${clear_all ? 'Yes' : 'No'}                                             ║
║  Paths:          ${revalidatedPaths.join(', ')}                    ║
╚════════════════════════════════════════════════════════════════╝
    `);

    // 6. Return success response
    return NextResponse.json({
      success: true,
      message: 'Cache cleared and pages revalidated successfully',
      timestamp,
      revalidated: revalidatedPaths,
      product_id,
      product_slug,
    });

  } catch (error) {
    console.error('❌ Revalidation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Revalidation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Also support GET for manual testing
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get('secret');

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid secret' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    message: 'Revalidation webhook endpoint is ready',
    usage: {
      method: 'POST',
      url: '/api/revalidate?secret=YOUR_SECRET',
      body: {
        product_id: 'number (optional)',
        product_slug: 'string (optional)',
        action: 'updated | created | deleted (optional)',
        clear_all: 'boolean (optional) - clears all caches'
      }
    },
    examples: {
      specific_product: {
        method: 'POST',
        body: { product_slug: 'vinylboden-eiche-natur', product_id: 123 }
      },
      clear_all: {
        method: 'POST',
        body: { clear_all: true }
      }
    }
  });
}
