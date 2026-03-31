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
    console.log('[customer GET] token valid:', isValid, 'token prefix:', token.substring(0, 20));
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Sitzung abgelaufen' }, { status: 401 });
    }

    const user = await wpGetCurrentUser(token);
    console.log('[customer GET] user result:', JSON.stringify(user));
    if (!user) {
      return NextResponse.json({ success: false, error: 'Benutzer nicht gefunden' }, { status: 404 });
    }

    const authHeader = `Basic ${Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64')}`;

    // First try by ID
    let customer = null;
    if (user.id > 0) {
      const res = await fetch(`${WP_URL}/wp-json/wc/v3/customers/${user.id}`, {
        headers: { Authorization: authHeader },
        cache: 'no-store',
      });
      if (res.ok) customer = await res.json();
    }

    // Fallback: search by email
    if (!customer && user.email) {
      const searchRes = await fetch(`${WP_URL}/wp-json/wc/v3/customers?email=${encodeURIComponent(user.email)}`, {
        headers: { Authorization: authHeader },
        cache: 'no-store',
      });
      if (searchRes.ok) {
        const customers = await searchRes.json();
        if (customers.length > 0) customer = customers[0];
      }
    }

    // If still no customer, create one in WooCommerce
    if (!customer) {
      const createRes = await fetch(`${WP_URL}/wp-json/wc/v3/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: authHeader },
        body: JSON.stringify({
          email: user.email,
          first_name: user.firstName || '',
          last_name: user.lastName || '',
          username: user.email,
        }),
      });
      if (createRes.ok) {
        customer = await createRes.json();
      } else {
        return NextResponse.json({ success: false, error: 'Kundenprofil konnte nicht erstellt werden' }, { status: 500 });
      }
    }

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

    const authHeader = `Basic ${Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64')}`;

    // Find correct WooCommerce customer ID
    let customerId = user.id;
    if (user.email) {
      const searchRes = await fetch(`${WP_URL}/wp-json/wc/v3/customers?email=${encodeURIComponent(user.email)}`, {
        headers: { Authorization: authHeader },
        cache: 'no-store',
      });
      if (searchRes.ok) {
        const customers = await searchRes.json();
        if (customers.length > 0) customerId = customers[0].id;
      }
    }

    const updateData = await req.json();

    const res = await fetch(
      `${WP_URL}/wp-json/wc/v3/customers/${customerId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
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
