/**
 * Test WooCommerce API Authentication
 * GET /api/test-wc-auth
 */

import { NextResponse } from 'next/server';

export async function GET() {
  const WC_BASE_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
  const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

  // Check if environment variables are set
  if (!WC_BASE_URL) {
    return NextResponse.json({
      success: false,
      error: 'NEXT_PUBLIC_WORDPRESS_URL is not set',
    }, { status: 500 });
  }

  if (!WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
    return NextResponse.json({
      success: false,
      error: 'WC_CONSUMER_KEY or WC_CONSUMER_SECRET is not set',
    }, { status: 500 });
  }

  // Test authentication with different endpoints
  const results = {
    baseUrl: WC_BASE_URL,
    credentialsSet: true,
    tests: {} as Record<string, { success: boolean; status?: number; error?: string; data?: unknown }>
  };

  // Test 1: GET /wc/v3/system_status (read-only endpoint)
  try {
    const credentials = Buffer.from(
      `${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`
    ).toString('base64');

    const systemStatusUrl = `${WC_BASE_URL}/wp-json/wc/v3/system_status`;
    const systemStatusResponse = await fetch(systemStatusUrl, {
      headers: {
        'Authorization': `Basic ${credentials}`,
      },
    });

    results.tests.systemStatus = {
      success: systemStatusResponse.ok,
      status: systemStatusResponse.status,
    };

    if (!systemStatusResponse.ok) {
      const errorText = await systemStatusResponse.text();
      results.tests.systemStatus.error = errorText;
    }
  } catch (error) {
    results.tests.systemStatus = {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }

  // Test 2: GET /wc/v3/orders (list orders - requires read permission)
  try {
    const credentials = Buffer.from(
      `${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`
    ).toString('base64');

    const ordersUrl = `${WC_BASE_URL}/wp-json/wc/v3/orders?per_page=1`;
    const ordersResponse = await fetch(ordersUrl, {
      headers: {
        'Authorization': `Basic ${credentials}`,
      },
    });

    results.tests.listOrders = {
      success: ordersResponse.ok,
      status: ordersResponse.status,
    };

    if (!ordersResponse.ok) {
      const errorText = await ordersResponse.text();
      results.tests.listOrders.error = errorText;
    } else {
      const orders = await ordersResponse.json();
      results.tests.listOrders.data = { orderCount: orders.length };
    }
  } catch (error) {
    results.tests.listOrders = {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }

  // Test 3: GET /wc/v3/products (list products - requires read permission)
  try {
    const credentials = Buffer.from(
      `${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`
    ).toString('base64');

    const productsUrl = `${WC_BASE_URL}/wp-json/wc/v3/products?per_page=1`;
    const productsResponse = await fetch(productsUrl, {
      headers: {
        'Authorization': `Basic ${credentials}`,
      },
    });

    results.tests.listProducts = {
      success: productsResponse.ok,
      status: productsResponse.status,
    };

    if (!productsResponse.ok) {
      const errorText = await productsResponse.text();
      results.tests.listProducts.error = errorText;
    } else {
      const products = await productsResponse.json();
      results.tests.listProducts.data = { productCount: products.length };
    }
  } catch (error) {
    results.tests.listProducts = {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }

  // Summary
  const allTestsPassed = Object.values(results.tests).every(test => test.success);

  return NextResponse.json({
    success: allTestsPassed,
    message: allTestsPassed
      ? 'All WooCommerce API tests passed!'
      : 'Some WooCommerce API tests failed. Check the details below.',
    results,
  });
}
