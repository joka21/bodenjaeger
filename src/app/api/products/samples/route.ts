import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to fetch sample (Muster) products.
 *
 * - With `?slug=muster-xyz`: targeted lookup, returns array with 0 or 1 items.
 *   Das ist der schnelle Pfad (1 DB-Query statt alle 173 Muster laden).
 * - Ohne Query-Parameter: paginiertes Laden aller Muster (Legacy).
 */
export async function GET(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://2025.bodenjaeger.de';
    const consumerKey = process.env.WC_CONSUMER_KEY;
    const consumerSecret = process.env.WC_CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
      throw new Error('WooCommerce credentials not configured');
    }

    const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    const authHeader = { 'Authorization': `Basic ${credentials}` };

    const slug = request.nextUrl.searchParams.get('slug');

    if (slug) {
      const url = new URL('/wp-json/wc/v3/products', baseUrl);
      url.searchParams.set('slug', slug);

      const response = await fetch(url.toString(), { headers: authHeader });
      if (!response.ok) {
        throw new Error(`WooCommerce API error: ${response.status} ${response.statusText}`);
      }

      const products = await response.json();
      return NextResponse.json(products);
    }

    // Fallback: paginiert ALLE Muster laden (kann langsam sein bei >100 Mustern).
    const PER_PAGE = 100;
    const all: unknown[] = [];
    for (let page = 1; page <= 20; page++) {
      const url = new URL('/wp-json/wc/v3/products', baseUrl);
      url.searchParams.set('category', '66');
      url.searchParams.set('per_page', String(PER_PAGE));
      url.searchParams.set('page', String(page));

      const response = await fetch(url.toString(), { headers: authHeader });
      if (!response.ok) {
        throw new Error(`WooCommerce API error: ${response.status} ${response.statusText}`);
      }

      const products = await response.json();
      if (!Array.isArray(products) || products.length === 0) break;
      all.push(...products);
      if (products.length < PER_PAGE) break;
    }

    return NextResponse.json(all);
  } catch (error) {
    console.error('Error fetching sample products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sample products' },
      { status: 500 }
    );
  }
}
