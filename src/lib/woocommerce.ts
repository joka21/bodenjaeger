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
   * Get a single product by ID from WooCommerce REST API (v3)
   * Using REST API instead of Store API for better access to all products
   */
  async getProductById(id: number): Promise<StoreApiProduct | null> {
    if (!id || id <= 0) {
      throw new Error('Valid product ID is required');
    }

    this.initializeConfig();

    if (!this.restApiUrl || !this.config) {
      throw new Error('WooCommerce client not properly initialized');
    }

    const url = `${this.restApiUrl}/products/${id}`;
    const auth = btoa(`${this.config.consumerKey}:${this.config.consumerSecret}`);

    try {
      console.log(`Fetching product ${id} from REST API: ${url}`);
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`,
        },
      });

      console.log(`Response status for product ${id}: ${response.status}`);

      if (!response.ok) {
        if (response.status === 404) {
          console.log(`Product ${id} not found (404)`);
          return null;
        }
        const errorText = await response.text();
        console.log(`Error response for product ${id}:`, errorText);

        let errorData: StoreApiError;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = {
            code: 'unknown_error',
            message: `HTTP ${response.status}: ${response.statusText}`,
          };
        }
        throw new Error(`WooCommerce API Error: ${errorData.message} (Code: ${errorData.code})`);
      }

      const product = await response.json();
      console.log(`Successfully loaded product ${id}: ${product.name}`);

      // Transform REST API product to Store API format
      return this.transformRestApiProduct(product);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      console.error(`Error fetching product with ID "${id}":`, error);
      throw error;
    }
  }

  /**
   * Transform REST API product response to Store API format
   */
  private transformRestApiProduct(restProduct: any): StoreApiProduct {
    return {
      id: restProduct.id,
      name: restProduct.name,
      slug: restProduct.slug,
      permalink: restProduct.permalink,
      description: restProduct.description,
      short_description: restProduct.short_description,
      sku: restProduct.sku,
      price: restProduct.price,
      regular_price: restProduct.regular_price,
      sale_price: restProduct.sale_price,
      price_html: restProduct.price_html,
      prices: restProduct.prices,
      on_sale: restProduct.on_sale,
      purchasable: restProduct.purchasable,
      total_sales: restProduct.total_sales,
      virtual: restProduct.virtual,
      downloadable: restProduct.downloadable,
      tax_status: restProduct.tax_status,
      tax_class: restProduct.tax_class,
      manage_stock: restProduct.manage_stock,
      stock_quantity: restProduct.stock_quantity,
      stock_status: restProduct.stock_status,
      backorders: restProduct.backorders,
      backorders_allowed: restProduct.backorders_allowed,
      backordered: restProduct.backordered,
      low_stock_amount: restProduct.low_stock_amount,
      sold_individually: restProduct.sold_individually,
      weight: restProduct.weight,
      dimensions: restProduct.dimensions,
      shipping_required: restProduct.shipping_required,
      shipping_taxable: restProduct.shipping_taxable,
      shipping_class: restProduct.shipping_class,
      shipping_class_id: restProduct.shipping_class_id,
      reviews_allowed: restProduct.reviews_allowed,
      average_rating: restProduct.average_rating,
      rating_count: restProduct.rating_count,
      upsell_ids: restProduct.upsell_ids || [],
      cross_sell_ids: restProduct.cross_sell_ids || [],
      parent_id: restProduct.parent_id,
      purchase_note: restProduct.purchase_note,
      categories: restProduct.categories || [],
      tags: restProduct.tags || [],
      images: restProduct.images || [],
      attributes: restProduct.attributes || [],
      default_attributes: restProduct.default_attributes || [],
      variations: restProduct.variations || [],
      grouped_products: restProduct.grouped_products || [],
      menu_order: restProduct.menu_order,
      related_ids: restProduct.related_ids || [],
      has_options: restProduct.has_options,
      extensions: restProduct.extensions || {},
      jaeger_meta: restProduct.meta_data ? this.extractJaegerMeta(restProduct.meta_data) : undefined,
    };
  }

  /**
   * Extract jaeger_meta from REST API meta_data array
   */
  private extractJaegerMeta(metaData: any[]): JaegerMeta | undefined {
    const jaegerFields: any = {};

    metaData.forEach((meta: any) => {
      // Remove leading underscore from key
      const key = meta.key.startsWith('_') ? meta.key.substring(1) : meta.key;

      // Map known jaeger meta fields
      const jaegerKeys = [
        'uvp', 'show_uvp', 'paketpreis', 'paketpreis_s', 'paketinhalt',
        'einheit_short', 'verpackungsart_short', 'verschnitt',
        'text_produktuebersicht', 'show_text_produktuebersicht',
        'lieferzeit', 'show_lieferzeit', 'setangebot_titel', 'show_setangebot',
        'standard_addition_daemmung', 'standard_addition_sockelleisten',
        'option_products_daemmung', 'option_products_sockelleisten',
        'aktion', 'show_aktion', 'angebotspreis_hinweis', 'show_angebotspreis_hinweis'
      ];

      if (jaegerKeys.includes(key)) {
        jaegerFields[key] = meta.value;
      }
    });

    return Object.keys(jaegerFields).length > 0 ? jaegerFields : undefined;
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