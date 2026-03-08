import { NextRequest, NextResponse } from 'next/server';
import { wpValidateToken, wpGetCurrentUser } from '@/lib/auth';
import { cookies } from 'next/headers';

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Fetch single order
    const res = await fetch(
      `${WP_URL}/wp-json/wc/v3/orders/${id}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64')}`,
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      return NextResponse.json({ success: false, error: 'Bestellung nicht gefunden' }, { status: 404 });
    }

    const order = await res.json();

    // Verify this order belongs to the logged-in user
    if (order.customer_id !== user.id) {
      return NextResponse.json({ success: false, error: 'Zugriff verweigert' }, { status: 403 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json({ success: false, error: 'Ein Fehler ist aufgetreten' }, { status: 500 });
  }
}
