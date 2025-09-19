import { NextResponse } from 'next/server';

// In-memory cache for API responses
interface CachedData {
  data: unknown[];
  timestamp: number;
  headers: { total: string; totalPages: string };
}
const cache = new Map<string, CachedData>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function GET(request: Request) {
  console.log('🚀 Store API proxy called');

  try {
    // Parse URL parameters from the request
    const { searchParams } = new URL(request.url);
    const per_page = searchParams.get('per_page') || '12';
    const page = searchParams.get('page') || '1';
    const category = searchParams.get('category');
    const orderby = searchParams.get('orderby') || 'date';
    const order = searchParams.get('order') || 'desc';

    // Build the Store API URL with parameters
    let storeApiUrl = `https://plan-dein-ding.de/wp-json/wc/store/v1/products?per_page=${per_page}&page=${page}&orderby=${orderby}&order=${order}`;

    // Add category filter if provided
    if (category) {
      storeApiUrl += `&category=${encodeURIComponent(category)}`;
    }

    // Create cache key
    const cacheKey = `${per_page}-${page}-${category || 'all'}-${orderby}-${order}`;
    const now = Date.now();

    // Check if we have cached data
    const cachedData = cache.get(cacheKey);
    if (cachedData && (now - cachedData.timestamp < CACHE_DURATION)) {
      console.log('🎯 Using cached data for:', cacheKey);
      return NextResponse.json(cachedData.data, {
        headers: {
          'X-WP-Total': cachedData.headers.total,
          'X-WP-TotalPages': cachedData.headers.totalPages,
          'Access-Control-Expose-Headers': 'X-WP-Total, X-WP-TotalPages',
          'X-Cache-Status': 'HIT',
          'Cache-Control': 'public, max-age=300' // 5 minutes browser cache
        }
      });
    }

    console.log('🔗 Calling Store API:', storeApiUrl);
    console.log('📋 Parameters:', { per_page, page, category, orderby, order });

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

    // Extract pagination information from headers
    const totalProducts = response.headers.get('X-WP-Total') || '0';
    const totalPages = response.headers.get('X-WP-TotalPages') || '1';

    console.log(`✅ Store API returned ${data.length} products (${totalProducts} total, ${totalPages} pages)`);
    if (data[0]) {
      console.log('🔍 First product jaeger_meta check:', data[0].jaeger_meta ? 'Found' : 'Missing');
      console.log('📝 First product name:', data[0].name);
    }

    // Cache the response
    cache.set(cacheKey, {
      data,
      timestamp: now,
      headers: {
        total: totalProducts,
        totalPages: totalPages
      }
    });

    // Clean up old cache entries (basic cleanup)
    if (cache.size > 100) { // Keep max 100 entries
      const oldestKey = cache.keys().next().value;
      if (oldestKey) {
        cache.delete(oldestKey);
      }
    }

    // Return the data with pagination headers
    return NextResponse.json(data, {
      headers: {
        'X-WP-Total': totalProducts,
        'X-WP-TotalPages': totalPages,
        'Access-Control-Expose-Headers': 'X-WP-Total, X-WP-TotalPages',
        'X-Cache-Status': 'MISS',
        'Cache-Control': 'public, max-age=300' // 5 minutes browser cache
      }
    });

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