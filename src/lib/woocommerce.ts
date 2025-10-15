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
   */
  async getProduct(slug: string): Promise<StoreApiProduct | null> {
    if (!slug) {
      throw new Error('Product slug is required');
    }

    try {
      // First try: Search by slug directly
      const searchResults = await this.getProducts({ search: slug, per_page: 100 });
      const exactMatch = searchResults.find(p => p.slug === slug);

      if (exactMatch) {
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
   * Get a single product by ID from WooCommerce Store API
   */
  async getProductById(id: number): Promise<StoreApiProduct | null> {
    if (!id || id <= 0) {
      throw new Error('Valid product ID is required');
    }

    try {
      const endpoint = `/products/${id}`;
      return await this.makeRequest<StoreApiProduct>(endpoint);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      console.error(`Error fetching product with ID "${id}":`, error);
      throw error;
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