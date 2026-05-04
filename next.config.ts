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
  async redirects() {
    return [
      // Victoria XL — Hauptprodukt fehlt im Backend, temporär in die Kategorie.
      // 302 (permanent: false) — sobald das Produkt wieder existiert, kann diese Regel raus.
      // MUSS vor der generischen /product/:slug*-Regel stehen.
      {
        source: '/product/victoria-xl',
        destination: '/category/parkett',
        permanent: false,
      },
      // WooCommerce-Default war /product/{slug} (Singular), neue Route ist /products/{slug}
      {
        source: '/product/:slug*',
        destination: '/products/:slug*',
        permanent: true,
      },
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
      // WooCommerce-Konto-Routen (EN + DE Default) → neue Konto-Route
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
      // WooCommerce-Hauptshop-Seite → Homepage
      {
        source: '/shop',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
