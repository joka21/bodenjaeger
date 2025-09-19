import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  console.log('🚀 Store API proxy called');

  try {
    // Simple hardcoded test first
    const storeApiUrl = 'https://plan-dein-ding.de/wp-json/wc/store/v1/products?per_page=1';

    console.log('🔗 Calling Store API:', storeApiUrl);

    // Make request to WooCommerce Store API
    const response = await fetch(storeApiUrl);

    console.log('📡 Store API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Store API error: ${response.status} - ${errorText}`);
      return NextResponse.json(
        {
          error: `Store API returned ${response.status}`,
          details: errorText
        },
        { status: 500 }
      );
    }

    const data = await response.json();

    console.log(`✅ Store API returned ${data.length} products`);
    if (data[0]) {
      console.log('🔍 First product jaeger_meta check:', data[0].jaeger_meta ? 'Found' : 'Missing');
      console.log('📝 First product name:', data[0].name);
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ Store API proxy error:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch from Store API',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}