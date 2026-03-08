import { NextRequest, NextResponse } from 'next/server';
import { isRateLimited, getClientIp } from '@/lib/rate-limit';

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (isRateLimited(ip, 3, 60 * 1000)) {
      return NextResponse.json(
        { success: false, error: 'Zu viele Versuche. Bitte warten Sie eine Minute.' },
        { status: 429 }
      );
    }

    const { email, website } = await req.json();

    // Honeypot
    if (website) {
      return NextResponse.json({ success: true, message: 'OK' });
    }

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'E-Mail-Adresse ist erforderlich' },
        { status: 400 }
      );
    }

    // Use WordPress built-in password reset
    // This triggers the standard WP password reset email
    const res = await fetch(`${WP_URL}/wp-json/wp/v2/users/lost-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_login: email }),
    });

    // Always return success to prevent email enumeration
    // Even if the email doesn't exist, we don't reveal that
    if (!res.ok) {
      // Try alternative endpoint (some WP setups use this)
      await fetch(`${WP_URL}/wp-login.php?action=lostpassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `user_login=${encodeURIComponent(email)}&redirect_to=&wp-submit=Neues+Passwort`,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Falls ein Konto mit dieser E-Mail existiert, wurde eine E-Mail zum Zurücksetzen gesendet.',
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json({
      success: true,
      message: 'Falls ein Konto mit dieser E-Mail existiert, wurde eine E-Mail zum Zurücksetzen gesendet.',
    });
  }
}
