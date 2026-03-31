import { NextRequest, NextResponse } from 'next/server';
import { wpJwtLogin, wpGetCurrentUser } from '@/lib/auth';
import { cookies } from 'next/headers';
import { isRateLimited, getClientIp } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (isRateLimited(ip, 5, 60 * 1000)) {
      return NextResponse.json(
        { success: false, error: 'Zu viele Versuche. Bitte warten Sie eine Minute.' },
        { status: 429 }
      );
    }

    const { username, password, website } = await req.json();

    // Honeypot: if the hidden "website" field is filled, it's a bot
    if (website) {
      // Silently accept to not reveal the trap
      return NextResponse.json({ success: true, user: null });
    }

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'E-Mail und Passwort sind erforderlich' },
        { status: 400 }
      );
    }

    // Authenticate with WordPress JWT
    const jwtResult = await wpJwtLogin(username, password);

    if (!jwtResult) {
      return NextResponse.json(
        { success: false, error: 'E-Mail oder Passwort ist falsch' },
        { status: 401 }
      );
    }

    // Get full user profile (try WooCommerce, fallback to JWT data)
    let user = await wpGetCurrentUser(jwtResult.token);

    if (!user) {
      // Final fallback: use data directly from JWT login response
      user = {
        id: 0,
        email: jwtResult.user_email,
        displayName: jwtResult.user_display_name || jwtResult.user_email,
        firstName: '',
        lastName: '',
        role: 'customer',
      };
    }

    // Allow all roles including admin (for testing)

    // Set JWT token as httpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set('auth_token', jwtResult.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
