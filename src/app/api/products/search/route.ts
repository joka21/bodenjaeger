import { NextRequest, NextResponse } from 'next/server';
import { wooCommerceClient } from '@/lib/woocommerce';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    if (!query || query.trim().length === 0) {
      return NextResponse.json([]);
    }

    const products = await wooCommerceClient.getProducts({
      per_page: 50,
      search: query.trim(),
      status: 'publish',
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}
