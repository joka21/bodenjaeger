// WooCommerce Store API Client
// Using the Store API endpoints: /wp-json/wc/store/v1/

interface WooCommerceConfig {
  baseUrl: string;
  consumerKey: string;
  consumerSecret: string;
}

interface JaegerMeta {
  uvp?: number | null;
  show_uvp?: boolean;
  paketpreis?: number | null;
  paketpreis_s?: number | null;
  paketinhalt?: number | null;
  einheit_short?: string | null;
  verpackungsart_short?: string | null;
  verschnitt?: number | null;
  text_produktuebersicht?: string | null;
  show_text_produktuebersicht?: boolean;
  lieferzeit?: string | null;
  show_lieferzeit?: boolean;
  setangebot_titel?: string | null;
  show_setangebot?: boolean;
  // Standard-Zusatzprodukte (Produkt-IDs)
  standard_addition_daemmung?: number | null;
  standard_addition_sockelleisten?: number | null;
  // Optionale Zusatzprodukte (Kommagetrennte Produkt-IDs)
  option_products_daemmung?: string | null;
  option_products_sockelleisten?: string | null;
  aktion?: string | null;
  show_aktion?: boolean;
  angebotspreis_hinweis?: string | null;
  show_angebotspreis_hinweis?: boolean;
}

interface StoreApiProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  price_html: string;
  prices?: {
    price: string;
    regular_price: string;
    sale_price: string;
    price_range?: null;
    currency_code: string;
    currency_symbol: string;
    currency_minor_unit: number;
    currency_decimal_separator: string;
    currency_thousand_separator: string;
    currency_prefix: string;
    currency_suffix: string;
  };
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  virtual: boolean;
  downloadable: boolean;
  tax_status: string;
  tax_class: string;
  manage_stock: boolean;
  stock_quantity: number | null;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  backorders: 'no' | 'notify' | 'yes';
  backorders_allowed: boolean;
  backordered: boolean;
  low_stock_amount: number | null;
  sold_individually: boolean;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  shipping_required: boolean;
  shipping_taxable: boolean;
  shipping_class: string;
  shipping_class_id: number;
  reviews_allowed: boolean;
  average_rating: string;
  rating_count: number;
  upsell_ids: number[];
  cross_sell_ids: number[];
  parent_id: number;
  purchase_note: string;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  images: Array<{
    id: number;
    src: string;
    name: string;
    alt: string;
  }>;
  attributes: Array<{
    id: number;
    name: string;
    position: number;
    visible: boolean;
    variation: boolean;
    options: string[];
  }>;
  default_attributes: Array<{
    id: number;
    name: string;
    option: string;
  }>;
  variations: number[];
  grouped_products: number[];
  menu_order: number;
  related_ids: number[];
  has_options: boolean;
  is_purchasable?: boolean;
  is_in_stock?: boolean;
  is_on_backorder?: boolean;
  low_stock_remaining?: number | null;
  stock_availability?: {
    text: string;
    class: string;
  };
  add_to_cart?: {
    text: string;
    description: string;
    url: string;
    single_text: string;
    minimum: number;
    maximum: number;
    multiple_of: number;
  };
  extensions: Record<string, unknown>;
  jaeger_meta?: JaegerMeta;
}

interface StoreApiProductsResponse {
  data: StoreApiProduct[];
  total: number;
  total_pages: number;
}

interface StoreApiError {
  code: string;
  message: string;
  data?: unknown;
}

interface StoreApiCategory {
  id: number;
  name: string;
  slug: string;
  parent?: number;
  description?: string;
  image?: {
    id: number;
    src: string;
    name: string;
    alt: string;
  } | null;
  menu_order?: number;
  count?: number;
}

class WooCommerceClient {
  private config: WooCommerceConfig | null = null;
  private baseApiUrl: string | null = null;
  private restApiUrl: string | null = null;

  private initializeConfig() {
    if (this.config) return; // Already initialized

    if (!process.env.NEXT_PUBLIC_WORDPRESS_URL) {
      throw new Error('NEXT_PUBLIC_WORDPRESS_URL environment variable is required');
    }
    if (!process.env.WC_CONSUMER_KEY) {
      throw new Error('WC_CONSUMER_KEY environment variable is required');
    }
    if (!process.env.WC_CONSUMER_SECRET) {
      throw new Error('WC_CONSUMER_SECRET environment variable is required');
    }

    this.config = {
      baseUrl: process.env.NEXT_PUBLIC_WORDPRESS_URL,
      consumerKey: process.env.WC_CONSUMER_KEY,
      consumerSecret: process.env.WC_CONSUMER_SECRET,
    };

    this.baseApiUrl = `${this.config.baseUrl.replace(/\/$/, '')}/wp-json/wc/store/v1`;
    this.restApiUrl = `${this.config.baseUrl.replace(/\/$/, '')}/wp-json/wc/v3`;
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    this.initializeConfig();

    if (!this.baseApiUrl || !this.config) {
      throw new Error('WooCommerce client not properly initialized');
    }

    const url = `${this.baseApiUrl}${endpoint}`;

    // Add basic auth for WooCommerce API
    const auth = btoa(`${this.config.consumerKey}:${this.config.consumerSecret}`);

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${auth}`,
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData: StoreApiError = await response.json().catch(() => ({
          code: 'unknown_error',
          message: `HTTP ${response.status}: ${response.statusText}`,
        }));

        throw new Error(`WooCommerce API Error: ${errorData.message} (Code: ${errorData.code})`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Network error: ${String(error)}`);
    }
  }

  /**
   * Get all products from WooCommerce Store API
   */
  async getProducts(params: {
    per_page?: number;
    page?: number;
    search?: string;
    category?: string;
    tag?: string;
    featured?: boolean;
    on_sale?: boolean;
    min_price?: string;
    max_price?: string;
    include?: string; // Comma-separated list of product IDs
    orderby?: 'date' | 'id' | 'include' | 'title' | 'slug' | 'price' | 'popularity' | 'rating' | 'menu_order';
    order?: 'asc' | 'desc';
  } = {}): Promise<StoreApiProduct[]> {
    const searchParams = new URLSearchParams();

    // Add parameters to the request
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const endpoint = `/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

    try {
      const products = await this.makeRequest<StoreApiProduct[]>(endpoint);
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  /**
   * Get a single product by slug from WooCommerce Store API
   * With Redis/KV caching for improved performance
   */
  async getProduct(slug: string): Promise<StoreApiProduct | null> {
    if (!slug) {
      throw new Error('Product slug is required');
    }

    try {
      // Try cache first (if available)
      if (typeof window === 'undefined') { // Server-side only
        try {
          const { getCachedProduct, setCachedProduct } = await import('./cache');
          const cached = await getCachedProduct(slug);
          if (cached) {
            return cached;
          }
        } catch (cacheError) {
          // Cache not available (e.g., no KV configured) - continue without cache
          console.log('Cache not available, fetching from API');
        }
      }

      // First try: Search by slug directly
      const searchResults = await this.getProducts({ search: slug, per_page: 100 });
      const exactMatch = searchResults.find(p => p.slug === slug);

      if (exactMatch) {
        // Cache the result (server-side only)
        if (typeof window === 'undefined') {
          try {
            const { setCachedProduct } = await import('./cache');
            await setCachedProduct(slug, exactMatch);
          } catch {
            // Cache write failed - not critical
          }
        }
        return exactMatch;
      }

      // Second try: Load more products if not found
      let page = 1;
      const maxPages = 10; // Limit to prevent infinite loops

      while (page <= maxPages) {
        const products = await this.getProducts({ per_page: 100, page });

        if (products.length === 0) {
          break; // No more products
        }

        const found = products.find(p => p.slug === slug);
        if (found) {
          // Cache the result
          if (typeof window === 'undefined') {
            try {
              const { setCachedProduct } = await import('./cache');
              await setCachedProduct(slug, found);
            } catch {
              // Cache write failed - not critical
            }
          }
          return found;
        }

        page++;
      }

      return null;
    } catch (error) {
      console.error(`Error fetching product with slug "${slug}":`, error);
      return null;
    }
  }

  /**
   * Get multiple products by IDs in batches
   * Uses Store API include parameter to load multiple products efficiently
   * With Redis/KV caching for improved performance
   */
  async getProductsByIds(ids: number[]): Promise<Map<number, StoreApiProduct>> {
    const productsMap = new Map<number, StoreApiProduct>();

    if (ids.length === 0) {
      return productsMap;
    }

    // Remove duplicates
    const uniqueIds = Array.from(new Set(ids));

    console.log(`📦 Loading ${uniqueIds.length} products by ID...`);

    try {
      // Try cache first (server-side only)
      if (typeof window === 'undefined') {
        try {
          const { getCachedProductsBatch, setCachedProductsBatch } = await import('./cache');
          const cached = await getCachedProductsBatch(uniqueIds);

          if (cached) {
            return cached;
          }
        } catch (cacheError) {
          // Cache not available - continue without cache
          console.log('Cache not available, fetching from API');
        }
      }

      // Load all products at once using the include parameter
      // Store API supports up to 100 products per request
      const batchSize = 100;
      const batches: number[][] = [];

      for (let i = 0; i < uniqueIds.length; i += batchSize) {
        batches.push(uniqueIds.slice(i, i + batchSize));
      }

      // Load all batches in parallel
      const batchResults = await Promise.all(
        batches.map(async (batch) => {
          const includeParam = batch.join(',');
          const products = await this.getProducts({
            per_page: batchSize,
            include: includeParam
          });
          return products;
        })
      );

      // Flatten results and create map
      batchResults.flat().forEach(product => {
        productsMap.set(product.id, product);
      });

      console.log(`✅ Successfully loaded ${productsMap.size} products`);

      // Cache the result (server-side only)
      if (typeof window === 'undefined' && productsMap.size > 0) {
        try {
          const { setCachedProductsBatch } = await import('./cache');
          await setCachedProductsBatch(productsMap);
        } catch {
          // Cache write failed - not critical
        }
      }

      return productsMap;
    } catch (error) {
      console.error('❌ Error loading products by IDs:', error);
      // Return partial results if any
      return productsMap;
    }
  }

  /**
   * Get a single product by ID from WooCommerce Store API
   * Fallback method for single product loading
   */
  async getProductById(id: number): Promise<StoreApiProduct | null> {
    if (!id || id <= 0) {
      throw new Error('Valid product ID is required');
    }

    try {
      // Use batch loading for consistency
      const productsMap = await this.getProductsByIds([id]);
      return productsMap.get(id) || null;
    } catch (error) {
      console.error(`Error fetching product with ID "${id}":`, error);
      return null;
    }
  }

  /**
   * Get product categories
   */
  async getCategories(params: {
    per_page?: number;
    page?: number;
    search?: string;
    parent?: number;
    orderby?: 'id' | 'include' | 'name' | 'slug' | 'term_group' | 'description' | 'count';
    order?: 'asc' | 'desc';
    hide_empty?: boolean;
  } = {}): Promise<StoreApiCategory[]> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const endpoint = `/products/categories${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

    try {
      return await this.makeRequest<StoreApiCategory[]>(endpoint);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const wooCommerceClient = new WooCommerceClient();

// Export types for use in other files
export type { StoreApiProduct, StoreApiProductsResponse, StoreApiError, StoreApiCategory, JaegerMeta };