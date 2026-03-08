import { NextRequest, NextResponse } from 'next/server';
import { wpValidateToken, wpGetCurrentUser } from '@/lib/auth';
import { cookies } from 'next/headers';

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;

// GET: Kundendaten laden (inkl. Adressen)
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Nicht eingeloggt' }, { status: 401 });
    }

    const isValid = await wpValidateToken(token);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Sitzung abgelaufen' }, { status: 401 });
    }

    const user = await wpGetCurrentUser(token);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Benutzer nicht gefunden' }, { status: 404 });
    }

    const res = await fetch(
      `${WP_URL}/wp-json/wc/v3/customers/${user.id}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64')}`,
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      return NextResponse.json({ success: false, error: 'Kundendaten nicht gefunden' }, { status: 404 });
    }

    const customer = await res.json();
    return NextResponse.json({ success: true, customer });
  } catch (error) {
    console.error('Customer fetch error:', error);
    return NextResponse.json({ success: false, error: 'Ein Fehler ist aufgetreten' }, { status: 500 });
  }
}

// PUT: Kundendaten aktualisieren
export async function PUT(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Nicht eingeloggt' }, { status: 401 });
    }

    const isValid = await wpValidateToken(token);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Sitzung abgelaufen' }, { status: 401 });
    }

    const user = await wpGetCurrentUser(token);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Benutzer nicht gefunden' }, { status: 404 });
    }

    const updateData = await req.json();

    const res = await fetch(
      `${WP_URL}/wp-json/wc/v3/customers/${user.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64')}`,
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, error: errorData.message || 'Aktualisierung fehlgeschlagen' },
        { status: 400 }
      );
    }

    const customer = await res.json();
    return NextResponse.json({ success: true, customer });
  } catch (error) {
    console.error('Customer update error:', error);
    return NextResponse.json({ success: false, error: 'Ein Fehler ist aufgetreten' }, { status: 500 });
  }
}
