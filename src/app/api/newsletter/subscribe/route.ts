import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' },
        { status: 400 }
      );
    }

    const wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
    const consumerKey = process.env.WC_CONSUMER_KEY;
    const consumerSecret = process.env.WC_CONSUMER_SECRET;

    if (!wordpressUrl || !consumerKey || !consumerSecret) {
      throw new Error('WordPress credentials not configured');
    }

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
      console.error('Newsletter subscription failed — WordPress endpoint not available', {
        status: response.status,
        email,
      });

      return NextResponse.json(
        {
          error:
            'Die Newsletter-Anmeldung ist derzeit nicht verfügbar. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt.',
        },
        { status: 503 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message:
        'Fast geschafft! Wir haben Ihnen eine Bestätigungs-E-Mail geschickt. Bitte klicken Sie auf den Link darin, um die Anmeldung abzuschließen (Double-Opt-In).',
      data,
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);

    return NextResponse.json(
      {
        error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
      },
      { status: 500 }
    );
  }
}
