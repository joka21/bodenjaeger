import { NextResponse } from 'next/server';
import { wpValidateToken, wpGetCurrentUser } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Nicht eingeloggt' }, { status: 401 });
    }

    // Validate token
    const isValid = await wpValidateToken(token);
    if (!isValid) {
      // Clear invalid token
      cookieStore.delete('auth_token');
      return NextResponse.json({ success: false, error: 'Sitzung abgelaufen' }, { status: 401 });
    }

    // Get user profile
    const user = await wpGetCurrentUser(token);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Benutzer nicht gefunden' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ success: false, error: 'Ein Fehler ist aufgetreten' }, { status: 500 });
  }
}
