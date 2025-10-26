import { NextRequest, NextResponse } from 'next/server';
import { wooCommerceClient } from '@/lib/woocommerce';

/**
 * API Route: Load multiple products by IDs
 * POST /api/products/by-ids
 * Body: { ids: number[] }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or missing ids parameter' },
        { status: 400 }
      );
    }

    // Validate all IDs are numbers
    const validIds = ids.filter((id) => typeof id === 'number' && id > 0);

    if (validIds.length === 0) {
      return NextResponse.json(
        { error: 'No valid product IDs provided' },
        { status: 400 }
      );
    }

    console.log(`📦 API: Loading ${validIds.length} products by IDs...`);

    // Load products using WooCommerce client (server-side)
    const productsMap = await wooCommerceClient.getProductsByIds(validIds);
    const products = Array.from(productsMap.values());

    console.log(`✅ API: Loaded ${products.length} products`);

    return NextResponse.json(products);
  } catch (error) {
    console.error('❌ API Error loading products by IDs:', error);
    return NextResponse.json(
      { error: 'Failed to load products' },
      { status: 500 }
    );
  }
}
