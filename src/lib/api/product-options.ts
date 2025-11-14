/**
 * API WRAPPER: PRODUCT OPTIONS
 *
 * Lädt leichtgewichtige Daten für Zusatzprodukte (Dämmung, Sockelleisten)
 * - Nur 7 essenzielle Felder
 * - On-Demand Loading (beim Öffnen von Modals)
 * - Mit SWR-kompatiblem Caching
 * - Type-Safe
 */

import type { ProductOption } from '@/types/product-optimized';

// ============================================
// CONFIGURATION
// ============================================

const API_BASE_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || 'https://plan-dein-ding.de';
const MAX_RETRIES = 2; // Fewer retries for on-demand data
const RETRY_DELAY = 500; // ms - faster retry for better UX
const REQUEST_TIMEOUT = 8000; // 8s - shorter timeout for add-on products

// ============================================
// ERROR TYPES
// ============================================

export class ProductOptionsApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = 'ProductOptionsApiError';
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
        throw new ProductOptionsApiError(
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
      if (error instanceof ProductOptionsApiError && error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
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
  throw new ProductOptionsApiError(
    `Failed after ${retries} retries: ${lastError?.message}`,
    undefined,
    url
  );
}

// ============================================
// MAIN FUNCTION: GET PRODUCT OPTIONS
// ============================================

export async function getProductOptions(ids: number[]): Promise<ProductOption[]> {
  // Validate input
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return [];
  }

  // Filter out invalid IDs
  const validIds = ids.filter(id => typeof id === 'number' && id > 0);

  if (validIds.length === 0) {
    return [];
  }

  // Construct URL with comma-separated IDs
  const idsString = validIds.join(',');
  const url = `${API_BASE_URL}/wp-json/jaeger/v1/products?include=${idsString}&fields=minimal`;

  try {
    // Fetch with retry logic
    const response = await fetchWithRetry<{
      products: ProductOption[];
      pagination?: unknown;
    }>(url);

    // Extract products array
    const products = response.products || [];

    // Filter out any invalid responses
    const validProducts = products.filter(
      product => product.id && product.name && typeof product.price === 'number'
    );

    return validProducts;

  } catch (error) {
    console.error(`Error fetching product options for IDs [${idsString}]:`, error);

    // For on-demand data, we can return empty array instead of throwing
    // This allows the UI to gracefully handle missing add-on products
    if (error instanceof ProductOptionsApiError && error.statusCode === 404) {
      console.warn('Some product options not found, returning available products');
      return [];
    }

    // Re-throw other errors
    throw new ProductOptionsApiError(
      `Failed to fetch product options: ${error instanceof Error ? error.message : 'Unknown error'}`,
      undefined,
      url
    );
  }
}

// ============================================
// SPECIALIZED FUNCTIONS
// ============================================

/**
 * Get single product option by ID
 */
export async function getProductOption(id: number): Promise<ProductOption | null> {
  const products = await getProductOptions([id]);
  return products[0] || null;
}

/**
 * Parse comma-separated ID string and fetch products
 * Used for parsing backend fields like "123,456,789"
 */
export async function getProductOptionsFromString(
  idsString: string | null
): Promise<ProductOption[]> {
  if (!idsString || typeof idsString !== 'string') {
    return [];
  }

  // Parse comma-separated IDs
  const ids = idsString
    .split(',')
    .map(id => parseInt(id.trim(), 10))
    .filter(id => !isNaN(id) && id > 0);

  return getProductOptions(ids);
}

/**
 * Fetch Dämmung options for a product
 */
export async function getDaemmungOptions(
  standardId: number | null,
  optionIds: string | null
): Promise<ProductOption[]> {
  const ids: number[] = [];

  // Add standard Dämmung ID if exists
  if (standardId && standardId > 0) {
    ids.push(standardId);
  }

  // Parse option IDs string
  if (optionIds && typeof optionIds === 'string') {
    const parsed = optionIds
      .split(',')
      .map(id => parseInt(id.trim(), 10))
      .filter(id => !isNaN(id) && id > 0);
    ids.push(...parsed);
  }

  // Remove duplicates
  const uniqueIds = [...new Set(ids)];

  return getProductOptions(uniqueIds);
}

/**
 * Fetch Sockelleisten options for a product
 */
export async function getSockelleistenOptions(
  standardId: number | null,
  optionIds: string | null
): Promise<ProductOption[]> {
  const ids: number[] = [];

  // Add standard Sockelleiste ID if exists
  if (standardId && standardId > 0) {
    ids.push(standardId);
  }

  // Parse option IDs string
  if (optionIds && typeof optionIds === 'string') {
    const parsed = optionIds
      .split(',')
      .map(id => parseInt(id.trim(), 10))
      .filter(id => !isNaN(id) && id > 0);
    ids.push(...parsed);
  }

  // Remove duplicates
  const uniqueIds = [...new Set(ids)];

  return getProductOptions(uniqueIds);
}

// ============================================
// CLIENT-SIDE SWR HOOK HELPER
// ============================================

/**
 * Generate SWR key for caching
 * Usage with SWR: useSWR(getProductOptionsKey([1,2,3]), () => getProductOptions([1,2,3]))
 */
export function getProductOptionsKey(ids: number[]): string | null {
  if (!ids || ids.length === 0) return null;
  const validIds = ids.filter(id => typeof id === 'number' && id > 0);
  if (validIds.length === 0) return null;
  return `product-options-${validIds.sort().join(',')}`;
}

// ============================================
// IN-MEMORY CACHE (Optional)
// ============================================

const optionsCache = new Map<string, { data: ProductOption[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get product options with in-memory cache
 * Useful for repeated requests within the same session
 */
export async function getProductOptionsCached(ids: number[]): Promise<ProductOption[]> {
  const cacheKey = getProductOptionsKey(ids);
  if (!cacheKey) return [];

  // Check cache
  const cached = optionsCache.get(cacheKey);
  const now = Date.now();

  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    return cached.data;
  }

  // Fetch fresh data
  const data = await getProductOptions(ids);

  // Update cache
  optionsCache.set(cacheKey, { data, timestamp: now });

  return data;
}

/**
 * Clear options cache (useful for testing or after product updates)
 */
export function clearProductOptionsCache(): void {
  optionsCache.clear();
}
