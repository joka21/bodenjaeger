import { NextRequest, NextResponse } from 'next/server';
import { wooCommerceClient } from '@/lib/woocommerce';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const per_page = parseInt(searchParams.get('per_page') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';

    const products = await wooCommerceClient.getProducts({
      per_page,
      page,
      search: search || undefined,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}