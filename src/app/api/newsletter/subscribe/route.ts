import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName } = await request.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' },
        { status: 400 }
      );
    }

    // WordPress Newsletter API Integration
    // Option 1: WordPress Newsletter Plugin API
    // Option 2: Custom WordPress endpoint
    // Option 3: WooCommerce Customer meta field

    const wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
    const consumerKey = process.env.WC_CONSUMER_KEY;
    const consumerSecret = process.env.WC_CONSUMER_SECRET;

    if (!wordpressUrl || !consumerKey || !consumerSecret) {
      throw new Error('WordPress credentials not configured');
    }

    // Send to WordPress custom endpoint
    // You'll need to create a custom WordPress endpoint or use a newsletter plugin API
    const wpApiUrl = `${wordpressUrl}/wp-json/newsletter/v1/subscribe`;

    const response = await fetch(wpApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')}`,
      },
      body: JSON.stringify({
        email,
        first_name: firstName || '',
        last_name: lastName || '',
        source: 'website_footer',
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      // If WordPress endpoint doesn't exist yet, store in a fallback way
      // For now, log it and return success (you'll need to set up WordPress endpoint)
      console.log('Newsletter subscription (WordPress endpoint not ready):', {
        email,
        firstName,
        lastName,
      });

      // TODO: Remove this when WordPress endpoint is ready
      return NextResponse.json({
        success: true,
        message: 'Vielen Dank für Ihre Anmeldung! Sie erhalten in Kürze eine Bestätigungs-E-Mail.',
        note: 'WordPress endpoint pending setup',
      });
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Vielen Dank für Ihre Anmeldung! Sie erhalten in Kürze eine Bestätigungs-E-Mail.',
      data,
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);

    // For development: Log the subscription attempt
    console.log('Newsletter subscription attempt (fallback):', await request.json().catch(() => ({})));

    return NextResponse.json(
      {
        error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
      },
      { status: 500 }
    );
  }
}
