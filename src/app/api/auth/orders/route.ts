import { NextResponse } from 'next/server';
import { wpValidateToken, wpGetCurrentUser } from '@/lib/auth';
import { cookies } from 'next/headers';

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;

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

    // Fetch orders for this customer
    const res = await fetch(
      `${WP_URL}/wp-json/wc/v3/orders?customer=${user.id}&per_page=50&orderby=date&order=desc`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64')}`,
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      return NextResponse.json({ success: false, error: 'Bestellungen konnten nicht geladen werden' }, { status: 500 });
    }

    const orders = await res.json();
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json({ success: false, error: 'Ein Fehler ist aufgetreten' }, { status: 500 });
  }
}
