// WordPress REST API Client
// Using the WordPress REST API endpoints: /wp-json/wp/v2/

interface WordPressConfig {
  baseUrl: string;
  consumerKey: string;
  consumerSecret: string;
}

export interface WordPressPage {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  parent: number;
  menu_order: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: Record<string, unknown>;
  yoast_head?: string;
  yoast_head_json?: Record<string, unknown>;
  _links: Record<string, unknown>;
}

export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: Record<string, unknown>;
  categories: number[];
  tags: number[];
  yoast_head?: string;
  yoast_head_json?: Record<string, unknown>;
  _links: Record<string, unknown>;
  _embedded?: {
    author?: Array<{
      id: number;
      name: string;
      url: string;
      description: string;
      link: string;
      slug: string;
      avatar_urls: Record<string, string>;
    }>;
    'wp:featuredmedia'?: Array<{
      id: number;
      date: string;
      slug: string;
      type: string;
      link: string;
      title: {
        rendered: string;
      };
      author: number;
      caption: {
        rendered: string;
      };
      alt_text: string;
      media_type: string;
      mime_type: string;
      media_details: {
        width: number;
        height: number;
        file: string;
        sizes: Record<string, {
          file: string;
          width: number;
          height: number;
          mime_type: string;
          source_url: string;
        }>;
      };
      source_url: string;
    }>;
  };
}

export interface WordPressPostsResponse {
  posts: WordPressPost[];
  total: number;
  totalPages: number;
}

interface WordPressError {
  code: string;
  message: string;
  data?: {
    status: number;
  };
}

class WordPressClient {
  private config: WordPressConfig | null = null;
  private apiUrl: string | null = null;

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

    this.apiUrl = `${this.config.baseUrl.replace(/\/$/, '')}/wp-json/wp/v2`;
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    this.initializeConfig();

    if (!this.apiUrl || !this.config) {
      throw new Error('WordPress client not properly initialized');
    }

    const url = `${this.apiUrl}${endpoint}`;

    // Add basic auth for WordPress API
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
        next: {
          revalidate: 30, // 30 seconds - products change frequently
        },
      });

      if (!response.ok) {
        const errorData: WordPressError = await response.json().catch(() => ({
          code: 'unknown_error',
          message: `HTTP ${response.status}: ${response.statusText}`,
          data: { status: response.status },
        }));

        throw new Error(`WordPress API Error: ${errorData.message} (Code: ${errorData.code})`);
      }

      // For posts list, extract pagination headers
      if (endpoint.includes('/posts')) {
        const total = response.headers.get('X-WP-Total');
        const totalPages = response.headers.get('X-WP-TotalPages');
        const data = await response.json();

        return {
          posts: data,
          total: total ? parseInt(total, 10) : 0,
          totalPages: totalPages ? parseInt(totalPages, 10) : 0,
        } as T;
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
   * Get a single WordPress page by slug
   */
  async getPageBySlug(slug: string): Promise<WordPressPage | null> {
    if (!slug) {
      throw new Error('Page slug is required');
    }

    try {
      const pages = await this.makeRequest<WordPressPage[]>(`/pages?slug=${slug}`);

      if (pages.length === 0) {
        return null;
      }

      return pages[0];
    } catch (error) {
      console.error(`Error fetching page with slug "${slug}":`, error);
      return null;
    }
  }

  /**
   * Get WordPress posts with pagination
   */
  async getPosts(page: number = 1, perPage: number = 10): Promise<WordPressPostsResponse> {
    try {
      const response = await this.makeRequest<WordPressPostsResponse>(
        `/posts?page=${page}&per_page=${perPage}&_embed=true`
      );

      return response;
    } catch (error) {
      console.error('Error fetching posts:', error);
      return {
        posts: [],
        total: 0,
        totalPages: 0,
      };
    }
  }

  /**
   * Get a single WordPress post by slug
   */
  async getPostBySlug(slug: string): Promise<WordPressPost | null> {
    if (!slug) {
      throw new Error('Post slug is required');
    }

    try {
      const response = await this.makeRequest<WordPressPost[]>(`/posts?slug=${slug}&_embed=true`);

      if (response.length === 0) {
        return null;
      }

      return response[0];
    } catch (error) {
      console.error(`Error fetching post with slug "${slug}":`, error);
      return null;
    }
  }
}

// Export singleton instance
export const wordPressClient = new WordPressClient();
