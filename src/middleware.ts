import { NextResponse, type NextRequest } from 'next/server';
import { kv } from '@vercel/kv';

export const config = {
  matcher: '/product/:slug',
};

const CACHE_KEY_PREFIX = 'redirect:product:';
const POSITIVE_TTL_SECONDS = 60 * 60 * 24 * 7;
const NEGATIVE_TTL_SECONDS = 60 * 60 * 24;
const NEGATIVE_MARKER = '__none__';
const FETCH_TIMEOUT_MS = 2000;

interface JaegerProductLookupResult {
  slug?: string;
}

const isKvAvailable = (): boolean => {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
};

async function getCachedRedirect(slug: string): Promise<string | null | undefined> {
  if (!isKvAvailable()) return undefined;
  try {
    const value = await kv.get<string>(`${CACHE_KEY_PREFIX}${slug}`);
    if (value === null) return undefined;
    if (value === NEGATIVE_MARKER) return null;
    return value;
  } catch (error) {
    console.warn('[redirect-middleware] KV read failed:', error);
    return undefined;
  }
}

async function setCachedRedirect(slug: string, value: string | null): Promise<void> {
  if (!isKvAvailable()) return;
  try {
    if (value === null) {
      await kv.set(`${CACHE_KEY_PREFIX}${slug}`, NEGATIVE_MARKER, { ex: NEGATIVE_TTL_SECONDS });
    } else {
      await kv.set(`${CACHE_KEY_PREFIX}${slug}`, value, { ex: POSITIVE_TTL_SECONDS });
    }
  } catch (error) {
    console.warn('[redirect-middleware] KV write failed:', error);
  }
}

async function fetchSearchResults(url: string): Promise<JaegerProductLookupResult[] | 'error'> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      console.warn(`[redirect-middleware] Backend ${response.status} for ${url}`);
      return 'error';
    }
    const data: unknown = await response.json();
    if (
      data !== null &&
      typeof data === 'object' &&
      Array.isArray((data as { products?: unknown }).products)
    ) {
      return (data as { products: JaegerProductLookupResult[] }).products;
    }
    return [];
  } catch (error) {
    console.warn(`[redirect-middleware] Backend fetch failed for ${url}:`, error);
    return 'error';
  } finally {
    clearTimeout(timeoutId);
  }
}

function pickBestMatch(
  originalSlug: string,
  products: JaegerProductLookupResult[],
): string | null {
  let best: { slug: string; index: number } | null = null;

  for (let i = 0; i < products.length; i++) {
    const candidate = products[i]?.slug;
    if (typeof candidate !== 'string' || candidate.length === 0) continue;
    if (candidate.startsWith('muster-')) continue;
    if (!candidate.includes(originalSlug)) continue;

    if (best === null || candidate.length < best.slug.length) {
      best = { slug: candidate, index: i };
    }
  }

  return best?.slug ?? null;
}

async function resolveNewSlug(slug: string, wpUrl: string): Promise<string | null | 'error'> {
  const searchTerm = slug.replace(/-/g, ' ');
  const searchUrl = `${wpUrl}/wp-json/jaeger/v1/products?search=${encodeURIComponent(searchTerm)}&per_page=10`;

  const products = await fetchSearchResults(searchUrl);
  if (products === 'error') return 'error';

  return pickBestMatch(slug, products);
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const rawSlug = pathname.replace(/^\/product\//, '');

  let slug: string;
  try {
    slug = decodeURIComponent(rawSlug).trim();
  } catch {
    return NextResponse.next();
  }

  if (!slug) return NextResponse.next();

  const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  if (!wpUrl) {
    console.warn('[redirect-middleware] NEXT_PUBLIC_WORDPRESS_URL not set — passthrough');
    return NextResponse.next();
  }

  const cached = await getCachedRedirect(slug);

  if (cached === null) {
    return NextResponse.next();
  }

  if (typeof cached === 'string' && cached.length > 0) {
    const response = NextResponse.redirect(
      new URL(`/products/${cached}`, request.url),
      301,
    );
    response.headers.set('X-Redirect-Cache', 'HIT');
    return response;
  }

  const resolved = await resolveNewSlug(slug, wpUrl);

  if (resolved === 'error') {
    return NextResponse.next();
  }

  if (resolved) {
    console.info(`[redirect-middleware] Resolved /product/${slug} -> /products/${resolved}`);
    await setCachedRedirect(slug, resolved);
    const response = NextResponse.redirect(
      new URL(`/products/${resolved}`, request.url),
      301,
    );
    response.headers.set('X-Redirect-Cache', 'MISS');
    return response;
  }

  await setCachedRedirect(slug, null);
  return NextResponse.next();
}
