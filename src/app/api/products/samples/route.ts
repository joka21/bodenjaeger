import { NextResponse } from 'next/server';

/**
 * API route to fetch all sample (Muster) products
 * Uses WooCommerce REST API v3 with category filter (category ID 66 = "Muster")
 */
export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://plan-dein-ding.de';
    const consumerKey = process.env.WC_CONSUMER_KEY;
    const consumerSecret = process.env.WC_CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
      throw new Error('WooCommerce credentials not configured');
    }

    // Fetch all products from category 66 (Muster)
    // Using per_page=100 to get all sample products (there are typically < 100 samples)
    const url = new URL('/wp-json/wc/v3/products', baseUrl);
    url.searchParams.append('category', '66'); // Muster category ID
    url.searchParams.append('per_page', '100');
    url.searchParams.append('consumer_key', consumerKey);
    url.searchParams.append('consumer_secret', consumerSecret);

    console.log('🔍 Fetching sample products from WooCommerce REST API...');

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`WooCommerce API error: ${response.status} ${response.statusText}`);
    }

    const products = await response.json();

    console.log(`✅ Loaded ${products.length} sample products`);

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching sample products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sample products' },
      { status: 500 }
    );
  }
}
