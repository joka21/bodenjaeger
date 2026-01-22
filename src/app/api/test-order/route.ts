/**
 * Test-Route für WooCommerce Order Creation
 * POST /api/test-order
 */

import { NextResponse } from 'next/server';

export async function POST() {
  const WC_BASE_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
  const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

  console.log('🧪 Testing WooCommerce Order Creation...');

  if (!WC_BASE_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
    return NextResponse.json({
      success: false,
      error: 'Environment variables not set'
    }, { status: 500 });
  }

  // Basic Auth
  const credentials = Buffer.from(
    `${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`
  ).toString('base64');

  // Test Order Data
  const testOrderData = {
    payment_method: 'bacs',
    payment_method_title: 'Vorkasse - TEST',
    set_paid: false,
    status: 'pending',
    billing: {
      first_name: 'Test',
      last_name: 'Kunde',
      address_1: 'Teststraße 123',
      city: 'Berlin',
      postcode: '10115',
      country: 'DE',
      email: 'test@example.com',
      phone: '030123456789'
    },
    shipping: {
      first_name: 'Test',
      last_name: 'Kunde',
      address_1: 'Teststraße 123',
      city: 'Berlin',
      postcode: '10115',
      country: 'DE'
    },
    line_items: [
      {
        product_id: 1234, // Dummy Product ID for testing
        quantity: 1
      }
    ],
    meta_data: [
      {
        key: '_test_order',
        value: 'true'
      }
    ]
  };

  const url = `${WC_BASE_URL}/wp-json/wc/v3/orders`;
  console.log('POST URL:', url);
  console.log('Order Data:', JSON.stringify(testOrderData, null, 2));

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`,
      },
      body: JSON.stringify(testOrderData),
    });

    console.log('Response Status:', response.status, response.statusText);

    const responseText = await response.text();
    console.log('Response Body:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `WooCommerce API returned ${response.status}`,
        statusCode: response.status,
        statusText: response.statusText,
        responseBody: responseData,
      }, { status: response.status });
    }

    console.log('✅ Order created successfully!');
    console.log('Order ID:', responseData.id);

    return NextResponse.json({
      success: true,
      message: 'Test order created successfully',
      orderId: responseData.id,
      orderKey: responseData.order_key,
      status: responseData.status,
    });

  } catch (error) {
    console.error('❌ Failed to create test order:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
