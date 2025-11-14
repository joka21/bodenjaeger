/**
 * API WRAPPER: PRODUCTS CRITICAL
 *
 * Lädt minimale Produktdaten für Listings (Startseite, Kategorieseiten)
 * - Nur kritische Felder für Above-the-Fold Content
 * - Mit Error Handling und Retry Logic
 * - Type-Safe
 */

import type {
  ProductCritical,
  ProductsResponse,
  ProductQueryParams
} from '@/types/product-optimized';

// ============================================
// CONFIGURATION
// ============================================

const API_BASE_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || 'https://plan-dein-ding.de';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms
const REQUEST_TIMEOUT = 10000; // 10s

// ============================================
// ERROR TYPES
// ============================================

export class ProductsApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = 'ProductsApiError';
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
        throw new ProductsApiError(
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
      if (error instanceof ProductsApiError && error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
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
  throw new ProductsApiError(
    `Failed after ${retries} retries: ${lastError?.message}`,
    undefined,
    url
  );
}

// ============================================
// MAIN FUNCTION: GET PRODUCTS CRITICAL
// ============================================

export interface GetProductsCriticalOptions extends ProductQueryParams {
  category?: string;
  search?: string;
  on_sale?: boolean;
  in_stock?: boolean;
}

export async function getProductsCritical(
  options: GetProductsCriticalOptions = {}
): Promise<ProductsResponse<ProductCritical>> {
  const {
    page = 1,
    per_page = 12,
    category,
    search,
    orderby = 'date',
    order = 'desc',
    on_sale,
    in_stock,
  } = options;

  // Build query parameters
  const params = new URLSearchParams({
    fields: 'critical',
    page: page.toString(),
    per_page: per_page.toString(),
    orderby,
    order,
  });

  if (category) params.append('category', category);
  if (search) params.append('search', search);
  if (on_sale !== undefined) params.append('on_sale', on_sale.toString());
  if (in_stock !== undefined) params.append('in_stock', in_stock.toString());

  // Construct URL
  const url = `${API_BASE_URL}/wp-json/jaeger/v1/products?${params.toString()}`;

  try {
    // Fetch with retry logic
    const response = await fetchWithRetry<{
      products: ProductCritical[];
      pagination: {
        total: number;
        total_pages: number;
        current_page: number;
        per_page: number;
      };
    }>(url);

    // Return standardized response
    return {
      products: response.products || [],
      pagination: response.pagination || {
        total: 0,
        total_pages: 0,
        current_page: page,
        per_page,
      },
    };

  } catch (error) {
    console.error('Error fetching critical products:', error);

    // Re-throw with context
    if (error instanceof ProductsApiError) {
      throw error;
    }

    throw new ProductsApiError(
      `Failed to fetch critical products: ${error instanceof Error ? error.message : 'Unknown error'}`,
      undefined,
      url
    );
  }
}

// ============================================
// SPECIALIZED FUNCTIONS
// ============================================

/**
 * Get sale products (for homepage slider)
 */
export async function getSaleProductsCritical(
  per_page = 12
): Promise<ProductCritical[]> {
  const response = await getProductsCritical({
    per_page,
    on_sale: true,
    orderby: 'date',
    order: 'desc',
  });

  return response.products;
}

/**
 * Get products by category (for category pages)
 */
export async function getCategoryProductsCritical(
  categorySlug: string,
  page = 1,
  per_page = 12
): Promise<ProductsResponse<ProductCritical>> {
  return getProductsCritical({
    category: categorySlug,
    page,
    per_page,
    orderby: 'date',
    order: 'desc',
  });
}

/**
 * Search products (for search page)
 */
export async function searchProductsCritical(
  searchTerm: string,
  page = 1,
  per_page = 12
): Promise<ProductsResponse<ProductCritical>> {
  return getProductsCritical({
    search: searchTerm,
    page,
    per_page,
    orderby: 'date',
    order: 'desc',
  });
}
