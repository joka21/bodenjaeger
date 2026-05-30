import { NextRequest, NextResponse } from 'next/server';

interface ContactRequestBody {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  turnstileToken?: string;
  website?: string;
}

interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
}

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function POST(request: NextRequest) {
  let body: ContactRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Ungueltiger Request-Body' }, { status: 400 });
  }

  // Honeypot: gefuelltes website-Feld = Bot. Stille 200, damit der Bot nichts lernt.
  if (typeof body.website === 'string' && body.website.length > 0) {
    return NextResponse.json({ success: true });
  }

  if (!body.name || !body.email || !body.subject || !body.message) {
    return NextResponse.json({ success: false, error: 'Pflichtfelder fehlen.' }, { status: 400 });
  }

  if (!body.turnstileToken) {
    return NextResponse.json({ success: false, error: 'Sicherheitscheck fehlt.' }, { status: 400 });
  }

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!turnstileSecret) {
    console.error('[api/contact] TURNSTILE_SECRET_KEY fehlt');
    return NextResponse.json(
      { success: false, error: 'Server-Konfiguration unvollstaendig.' },
      { status: 500 },
    );
  }

  const verifyParams = new URLSearchParams();
  verifyParams.append('secret', turnstileSecret);
  verifyParams.append('response', body.turnstileToken);
  const ipHeader =
    request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || '';
  if (ipHeader) {
    verifyParams.append('remoteip', ipHeader.split(',')[0].trim());
  }

  try {
    const verifyRes = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      body: verifyParams,
    });
    const verifyJson = (await verifyRes.json()) as TurnstileVerifyResponse;
    if (!verifyJson.success) {
      console.warn('[api/contact] Turnstile verify failed:', verifyJson['error-codes']);
      return NextResponse.json(
        { success: false, error: 'Sicherheitscheck fehlgeschlagen.' },
        { status: 400 },
      );
    }
  } catch (e) {
    console.error('[api/contact] Turnstile verify error:', e);
    return NextResponse.json(
      { success: false, error: 'Sicherheitscheck nicht erreichbar.' },
      { status: 502 },
    );
  }

  const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const sharedSecret = process.env.JAEGER_CONTACT_SECRET?.trim();

  if (!wpUrl || !sharedSecret) {
    console.error('[api/contact] NEXT_PUBLIC_WORDPRESS_URL oder JAEGER_CONTACT_SECRET fehlt');
    return NextResponse.json(
      { success: false, error: 'Server-Konfiguration unvollstaendig.' },
      { status: 500 },
    );
  }

  try {
    const wpRes = await fetch(`${wpUrl}/wp-json/jaeger/v1/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Jaeger-Secret': sharedSecret,
      },
      body: JSON.stringify({
        name: body.name,
        email: body.email,
        phone: body.phone ?? '',
        subject: body.subject,
        message: body.message,
      }),
    });

    if (!wpRes.ok) {
      const text = await wpRes.text().catch(() => '');
      console.error('[api/contact] WordPress error:', wpRes.status, text);
      return NextResponse.json(
        { success: false, error: 'Nachricht konnte nicht zugestellt werden.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('[api/contact] WordPress fetch error:', e);
    return NextResponse.json(
      { success: false, error: 'Nachricht konnte nicht zugestellt werden.' },
      { status: 502 },
    );
  }
}
