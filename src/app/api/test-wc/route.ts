/**
 * Test-Route für WooCommerce API-Verbindung
 * GET /api/test-wc
 */

import { NextResponse } from 'next/server';

export async function GET() {
  const WC_BASE_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
  const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

  console.log('🔍 Testing WooCommerce API Connection...');
  console.log('Base URL:', WC_BASE_URL);
  console.log('Consumer Key:', WC_CONSUMER_KEY ? `${WC_CONSUMER_KEY.substring(0, 10)}...` : 'NOT SET');
  console.log('Consumer Secret:', WC_CONSUMER_SECRET ? `${WC_CONSUMER_SECRET.substring(0, 10)}...` : 'NOT SET');

  if (!WC_BASE_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
    return NextResponse.json({
      success: false,
      error: 'Environment variables not set',
      details: {
        WC_BASE_URL: !!WC_BASE_URL,
        WC_CONSUMER_KEY: !!WC_CONSUMER_KEY,
        WC_CONSUMER_SECRET: !!WC_CONSUMER_SECRET,
      }
    }, { status: 500 });
  }

  // Test 1: Basic Auth Header
  const credentials = Buffer.from(
    `${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`
  ).toString('base64');

  console.log('Basic Auth Credentials (Base64):', credentials.substring(0, 20) + '...');

  // Test 2: Ping WooCommerce API
  const url = `${WC_BASE_URL}/wp-json/wc/v3/orders?per_page=1`;
  console.log('Test URL:', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`,
      },
      cache: 'no-store',
    });

    console.log('Response Status:', response.status, response.statusText);

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });
    console.log('Response Headers:', responseHeaders);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error Response:', errorText);

      return NextResponse.json({
        success: false,
        error: `WooCommerce API returned ${response.status}`,
        statusCode: response.status,
        statusText: response.statusText,
        responseText: errorText,
        headers: responseHeaders,
      }, { status: response.status });
    }

    const data = await response.json();
    console.log('✅ WooCommerce API connection successful!');
    console.log('Orders found:', Array.isArray(data) ? data.length : 'N/A');

    return NextResponse.json({
      success: true,
      message: 'WooCommerce API connection successful',
      statusCode: response.status,
      ordersCount: Array.isArray(data) ? data.length : 0,
      sampleOrder: Array.isArray(data) && data.length > 0 ? {
        id: data[0].id,
        status: data[0].status,
        total: data[0].total,
      } : null,
    });

  } catch (error) {
    console.error('❌ Failed to connect to WooCommerce API:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
