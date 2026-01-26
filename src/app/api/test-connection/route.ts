import { NextResponse } from 'next/server';
import { wooCommerceClient } from '@/lib/woocommerce';

export async function GET() {
  try {
    // Test: Kategorien abrufen
    console.log('🔍 Fetching categories...');
    const categories = await wooCommerceClient.getCategories({ per_page: 5 });
    console.log('✅ Categories loaded:', categories.length);

    // Test: Produkte abrufen (verschiedene Varianten testen)
    console.log('🔍 Fetching products (simple)...');
    let products = await wooCommerceClient.getProducts({ per_page: 5 });
    console.log('Products (simple):', products.length);

    // Wenn keine Produkte, versuche mit category
    if (products.length === 0) {
      console.log('🔍 Trying with category filter...');
      products = await wooCommerceClient.getProducts({
        per_page: 10,
        category: 'laminat'
      });
      console.log('Products (laminat):', products.length);
    }

    // Wenn immer noch keine Produkte, versuche mit Sale
    if (products.length === 0) {
      console.log('🔍 Trying with sale filter...');
      products = await wooCommerceClient.getProducts({
        per_page: 10,
        category: 'sale'
      });
      console.log('Products (sale):', products.length);
    }

    return NextResponse.json({
      success: true,
      connection: 'OK',
      apiUrl: process.env.NEXT_PUBLIC_WORDPRESS_URL,
      data: {
        categoriesCount: categories.length,
        productsCount: products.length,
        sampleCategory: categories[0]?.name || 'Keine Kategorie gefunden',
        sampleProduct: products[0]?.name || 'Kein Produkt gefunden',
        categories: categories.slice(0, 3), // Nur erste 3 Kategorien
        products: products.slice(0, 3) // Nur erste 3 Produkte
      }
    });
  } catch (error: any) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      {
        success: false,
        connection: 'FAILED',
        error: error.message || 'Unknown error',
        details: error.toString(),
        stack: error.stack
      },
      { status: 500 }
    );
  }
}
