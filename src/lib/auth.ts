/**
 * Auth Library - JWT Authentication mit WordPress/WooCommerce
 *
 * Kommuniziert über API Routes (nicht direkt mit WordPress),
 * damit Credentials serverseitig bleiben.
 */

export interface AuthUser {
  id: number;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  user?: AuthUser;
  token?: string;
  error?: string;
}

export interface RegisterResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

// ============================================================================
// Client-side Auth Functions (call our API routes)
// ============================================================================

export async function loginUser(
  email: string,
  password: string,
  website?: string
): Promise<LoginResponse> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email, password, website }),
  });

  return res.json();
}

export async function registerUser(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  website?: string;
}): Promise<RegisterResponse> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function fetchCurrentUser(): Promise<LoginResponse> {
  const res = await fetch('/api/auth/me', {
    method: 'GET',
  });

  return res.json();
}

export async function logoutUser(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST' });
}

// ============================================================================
// Server-side JWT helpers (used in API routes only)
// ============================================================================

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;

export async function wpJwtLogin(
  username: string,
  password: string
): Promise<{ token: string; user_email: string; user_display_name: string } | null> {
  const res = await fetch(`${WP_URL}/wp-json/jwt-auth/v1/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) return null;
  return res.json();
}

export async function wpValidateToken(token: string): Promise<boolean> {
  const res = await fetch(`${WP_URL}/wp-json/jwt-auth/v1/token/validate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.ok;
}

export async function wpGetCurrentUser(token: string): Promise<AuthUser | null> {
  // Get WordPress user info via JWT
  const wpRes = await fetch(`${WP_URL}/wp-json/wp/v2/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!wpRes.ok) return null;
  const wpUser = await wpRes.json();

  // Get WooCommerce customer data for full profile
  const wcRes = await fetch(
    `${WP_URL}/wp-json/wc/v3/customers/${wpUser.id}`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64')}`,
      },
    }
  );

  if (!wcRes.ok) {
    return {
      id: wpUser.id,
      email: wpUser.slug,
      displayName: wpUser.name,
      firstName: '',
      lastName: '',
      role: 'customer',
    };
  }

  const wcCustomer = await wcRes.json();

  return {
    id: wcCustomer.id,
    email: wcCustomer.email,
    displayName: `${wcCustomer.first_name} ${wcCustomer.last_name}`.trim() || wcCustomer.username,
    firstName: wcCustomer.first_name || '',
    lastName: wcCustomer.last_name || '',
    role: wcCustomer.role || 'customer',
  };
}

export async function wcCreateCustomer(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<AuthUser | null> {
  const res = await fetch(`${WP_URL}/wp-json/wc/v3/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64')}`,
    },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
      first_name: data.firstName,
      last_name: data.lastName,
      username: data.email,
    }),
  });

  if (!res.ok) return null;
  const customer = await res.json();

  return {
    id: customer.id,
    email: customer.email,
    displayName: `${customer.first_name} ${customer.last_name}`.trim(),
    firstName: customer.first_name,
    lastName: customer.last_name,
    role: 'customer',
  };
}
