import { NextRequest, NextResponse } from 'next/server';
import { wcCreateCustomer, wpJwtLogin } from '@/lib/auth';
import { cookies } from 'next/headers';
import { isRateLimited, getClientIp } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (isRateLimited(ip, 3, 60 * 1000)) {
      return NextResponse.json(
        { success: false, error: 'Zu viele Versuche. Bitte warten Sie eine Minute.' },
        { status: 429 }
      );
    }

    const { email, password, firstName, lastName, website } = await req.json();

    // Honeypot
    if (website) {
      return NextResponse.json({ success: true, user: null });
    }

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { success: false, error: 'Alle Felder sind erforderlich' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Passwort muss mindestens 8 Zeichen lang sein' },
        { status: 400 }
      );
    }

    // Create WooCommerce customer
    const user = await wcCreateCustomer({ email, password, firstName, lastName });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Registrierung fehlgeschlagen. Möglicherweise existiert diese E-Mail bereits.' },
        { status: 400 }
      );
    }

    // Auto-login after registration
    const jwtResult = await wpJwtLogin(email, password);

    if (jwtResult) {
      const cookieStore = await cookies();
      cookieStore.set('auth_token', jwtResult.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { success: false, error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
