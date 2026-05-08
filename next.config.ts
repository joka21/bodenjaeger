import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '2025.bodenjaeger.de',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'bodenjaeger.de',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plan-dein-ding.de',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
    ],
    // Optimize image formats - Next.js will automatically serve AVIF/WebP where supported
    formats: ['image/avif', 'image/webp'],
    // Define device breakpoints for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Minimize layout shift with placeholder support
    minimumCacheTTL: 60,
  },

  // 301-Redirects für Migrations-404er (alter WordPress/WooCommerce-Shop → neuer Next.js-Shop)
  // ⚠️ Reihenfolge wichtig: Next.js nutzt FIRST MATCH — spezifische Regeln zuerst.
  async redirects() {
    return [
      // ============================================================
      // PRODUKTE
      // ============================================================
      // Victoria XL — Hauptprodukt fehlt im Backend, temporär in die Kategorie.
      // 302 (permanent: false) — sobald das Produkt wieder existiert, kann diese Regel raus.
      {
        source: '/product/victoria-xl',
        destination: '/category/parkett',
        permanent: false,
      },
      // /product/:slug → wird von src/middleware.ts behandelt (smarter Backend-Lookup
      // mit Präfix-Stripping für migrierte Slugs). Eine generische next.config-Regel
      // würde die Middleware shadowen, da next.config-redirects in Next.js VOR der
      // Middleware laufen. Nicht wieder reinpacken — sonst bekommen User wieder 404er
      // auf migrierte Slugs (z. B. /product/vinylboden-rigid-vinyl-coretec-forest).

      // ============================================================
      // VERSCHACHTELTE PRODUKT-KATEGORIEN (WP hatte Subkategorien-Pfade)
      // → letzter Slug = konkretere Subkategorie. Reihenfolge: längere Pfade zuerst.
      // ============================================================
      {
        source: '/product-category/zubehoer/zubehoer-fuer-sockelleisten/werkzeug',
        destination: '/category/werkzeug',
        permanent: true,
      },
      {
        source: '/product-category/zubehoer/zubehoer-fuer-sockelleisten',
        destination: '/category/zubehoer-fuer-sockelleisten',
        permanent: true,
      },
      {
        source: '/product-category/zubehoer/montagekleber-silikon-und-acryl',
        destination: '/category/montagekleber-silikon',
        permanent: true,
      },
      {
        source: '/product-category/parkett/fertigparkett',
        destination: '/category/fertigparkett',
        permanent: true,
      },
      {
        source: '/product-category/vinylboden/rigid-vinyl',
        destination: '/category/rigid-vinyl',
        permanent: true,
      },
      {
        source: '/product-category/vinylboden/klebe-vinyl',
        destination: '/category/klebe-vinyl',
        permanent: true,
      },
      {
        source: '/product-category/teppichboden/sedna-teppichboden',
        destination: '/category/teppichboden',
        permanent: true,
      },

      // ============================================================
      // PAGINATION (alte WP-Kategorie-/Shop-Pagination existiert nicht)
      // ============================================================
      // /product-category/<slug>/page/<n>/ → /category/<slug> (Pagination weg)
      {
        source: '/product-category/:slug/page/:n*',
        destination: '/category/:slug',
        permanent: true,
      },
      // /shop/page/<n>/ (auch mit ?add-to-cart=…) → Homepage
      {
        source: '/shop/page/:n*',
        destination: '/',
        permanent: true,
      },

      // ============================================================
      // KATEGORIEN (generisch — muss NACH den verschachtelten Spezial-Regeln stehen)
      // ============================================================
      // WooCommerce-Default war /product-category/{slug}, neue Route ist /category/{slug}
      {
        source: '/product-category/:slug*',
        destination: '/category/:slug*',
        permanent: true,
      },
      // Alte WordPress-Marketing-Landingpage → passende Kategorie
      {
        source: '/klebe-vinyl-sparpaket',
        destination: '/category/klebe-vinyl',
        permanent: true,
      },

      // ============================================================
      // KONTO
      // ============================================================
      {
        source: '/my-account',
        destination: '/konto',
        permanent: true,
      },
      {
        source: '/mein-konto',
        destination: '/konto',
        permanent: true,
      },

      // ============================================================
      // SHOP
      // ============================================================
      {
        source: '/shop',
        destination: '/',
        permanent: true,
      },

      // ============================================================
      // SERVICEBEREICH (alte WP-Subseiten → neue Fachmarkt-Subseiten)
      // ============================================================
      {
        source: '/servicebereich/lagerservice',
        destination: '/fachmarkt-hueckelhoven/warenlagerung',
        permanent: true,
      },
      {
        source: '/servicebereich/schausonntag',
        destination: '/fachmarkt-hueckelhoven/schausonntag',
        permanent: true,
      },
      // Catch-all für unbekannte Servicebereich-Subseiten → /service
      {
        source: '/servicebereich/:slug*',
        destination: '/service',
        permanent: true,
      },

      // ============================================================
      // FILIALANGEBOTE (alte URL-Struktur)
      // ============================================================
      {
        source: '/filialangebote/:slug*',
        destination: '/fachmarkt-hueckelhoven',
        permanent: true,
      },

      // ============================================================
      // AKTIONSSEITEN
      // ============================================================
      {
        source: '/aktion-premium-boeden-inkl-verlegung',
        destination: '/sale',
        permanent: true,
      },

      // ============================================================
      // RATGEBER-ARTIKEL ("vor-und-nachteile")
      // Blog existiert aktuell nicht — leiten auf jeweilige Kategorie um.
      // Wenn der Blog später kommt, hier auf /blog/<slug> umstellen.
      // ============================================================
      {
        source: '/laminat-vor-und-nachteile',
        destination: '/category/laminat',
        permanent: true,
      },
      {
        source: '/rigid-vinyl-vor-und-nachteile',
        destination: '/category/rigid-vinyl',
        permanent: true,
      },
      {
        source: '/klebe-vinyl-vor-und-nachteile',
        destination: '/category/klebe-vinyl',
        permanent: true,
      },

      // ============================================================
      // RSS-FEEDS (existieren im Headless-Shop nicht mehr)
      // → Homepage als Fallback. Pragmatisch ok; korrekt wäre 410 Gone via Middleware.
      // ============================================================
      {
        source: '/:path*/feed',
        destination: '/',
        permanent: true,
      },
      {
        source: '/feed',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
