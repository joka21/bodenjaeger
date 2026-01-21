/**
 * API WRAPPER: PRODUCT FULL
 *
 * Lädt vollständige Produktdaten für Produktdetailseite
 * - Alle 40+ Felder inklusive Beschreibung, Bilder, Set-Angebot Details
 * - Mit ISR Caching und Error Handling
 * - Type-Safe
 */

import type { ProductFull } from '@/types/product-optimized';

// ============================================
// CONFIGURATION
// ============================================

const API_BASE_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || 'https://plan-dein-ding.de';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms
const REQUEST_TIMEOUT = 15000; // 15s (longer for full data)

// ============================================
// ERROR TYPES
// ============================================

export class ProductFullApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = 'ProductFullApiError';
  }
}

// ============================================
// HELPER: DELAY FUNCTION
// ============================================

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================
// HELPER: FETCH WITH TIMEOUT
// ============================================

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = REQUEST_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      // Enable ISR caching
      next: {
        revalidate: 3600, // 1 hour
        tags: ['product-full'],
      },
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// ============================================
// HELPER: RETRY LOGIC
// ============================================

async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  retries = MAX_RETRIES
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, options);

      // Check for HTTP errors
      if (!response.ok) {
        throw new ProductFullApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          url
        );
      }

      // Parse JSON response
      const data = await response.json();
      return data as T;

    } catch (error) {
      lastError = error as Error;

      // Don't retry on 4xx errors (client errors)
      if (error instanceof ProductFullApiError && error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
        throw error;
      }

      // If not last attempt, wait and retry
      if (attempt < retries) {
        const waitTime = RETRY_DELAY * Math.pow(2, attempt); // Exponential backoff
        console.warn(`Retry ${attempt + 1}/${retries} after ${waitTime}ms for ${url}`);
        await delay(waitTime);
      }
    }
  }

  // All retries failed
  throw new ProductFullApiError(
    `Failed after ${retries} retries: ${lastError?.message}`,
    undefined,
    url
  );
}

// ============================================
// MAIN FUNCTION: GET PRODUCT FULL BY SLUG
// ============================================

export async function getProductFull(slug: string): Promise<ProductFull> {
  if (!slug || typeof slug !== 'string') {
    throw new ProductFullApiError('Invalid product slug provided');
  }

  // Construct URL
  const url = `${API_BASE_URL}/wp-json/jaeger/v1/products/${encodeURIComponent(slug)}?fields=full`;

  try {
    // Fetch with retry logic and ISR caching
    const response = await fetchWithRetry<ProductFull>(url);

    // Validate response has required fields
    if (!response.id || !response.name || !response.slug) {
      throw new ProductFullApiError(
        'Invalid product data received from API',
        undefined,
        url
      );
    }

    return response;

  } catch (error) {
    console.error(`Error fetching full product data for "${slug}":`, error);

    // Re-throw with context
    if (error instanceof ProductFullApiError) {
      throw error;
    }

    throw new ProductFullApiError(
      `Failed to fetch full product data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      undefined,
      url
    );
  }
}

// ============================================
// MAIN FUNCTION: GET PRODUCT FULL BY ID
// ============================================

export async function getProductFullById(id: number): Promise<ProductFull> {
  if (!id || typeof id !== 'number' || id <= 0) {
    throw new ProductFullApiError('Invalid product ID provided');
  }

  // Construct URL
  const url = `${API_BASE_URL}/wp-json/jaeger/v1/products?include=${id}&fields=full`;

  try {
    // Fetch with retry logic and ISR caching
    const response = await fetchWithRetry<{
      products: ProductFull[];
      pagination: unknown;
    }>(url);

    // Extract first product from array
    const product = response.products?.[0];

    if (!product) {
      throw new ProductFullApiError(
        `Product with ID ${id} not found`,
        404,
        url
      );
    }

    // Validate response has required fields
    if (!product.id || !product.name || !product.slug) {
      throw new ProductFullApiError(
        'Invalid product data received from API',
        undefined,
        url
      );
    }

    return product;

  } catch (error) {
    console.error(`Error fetching full product data for ID ${id}:`, error);

    // Re-throw with context
    if (error instanceof ProductFullApiError) {
      throw error;
    }

    throw new ProductFullApiError(
      `Failed to fetch full product data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      undefined,
      url
    );
  }
}

// ============================================
// HELPER: REVALIDATE PRODUCT CACHE
// ============================================

/**
 * Force revalidation of product cache (for use in admin/webhook scenarios)
 * Note: This is a server-side only function
 */
export async function revalidateProductCache(slug: string): Promise<void> {
  if (typeof window !== 'undefined') {
    console.warn('revalidateProductCache can only be called server-side');
    return;
  }

  try {
    // Use Next.js revalidateTag if available
    const { revalidateTag } = await import('next/cache');
    revalidateTag('product-full');
    console.log(`Cache revalidated for product: ${slug}`);
  } catch (error) {
    console.error('Error revalidating cache:', error);
  }
}

// ============================================
// HELPER: PREFETCH PRODUCT DATA
// ============================================

/**
 * Prefetch product data for faster subsequent loads
 * Can be used in Link components or on page navigation
 */
export function prefetchProductFull(slug: string): void {
  if (typeof window === 'undefined') return;

  const url = `${API_BASE_URL}/wp-json/jaeger/v1/products/${encodeURIComponent(slug)}?fields=full`;

  // Use browser prefetch
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  document.head.appendChild(link);
}
