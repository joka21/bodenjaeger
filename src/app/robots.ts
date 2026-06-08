import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

const BASE_URL = SITE_URL;

/**
 * robots.txt für https://bodenjaeger.de
 *
 * Ausgeschlossen vom Crawl:
 *   - /api/* (Backend-API, keine Suchergebnis-Seiten)
 *   - /konto/* (Kundenkonto, sensibel & nicht-public)
 *   - /checkout, /cart (transaktional, kein SEO-Wert)
 *   - /login, /passwort-vergessen (Auth)
 *   - /search (interne Suche, vermeidet Duplicate Content)
 *   - Test- und Setup-Seiten
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/konto/',
          '/checkout',
          '/checkout/',
          '/cart',
          '/cart/',
          '/login',
          '/passwort-vergessen',
          '/search',
          '/api-test',
          '/payment-setup',
          '/woocommerce-setup',
          '/product-cards',
          '/styleguide',
          '/todo',
          '/todo/',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
