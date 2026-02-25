# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bodenjäger is a Next.js headless e-commerce shop for flooring products (Laminat, Vinyl, Parkett) with a WooCommerce backend. The core feature is a **Set-Angebot System** (Bundle System) allowing customers to purchase flooring bundles (Boden + Dämmung + Sockelleiste) with automatic discounts.

- **Backend**: WordPress + WooCommerce + Custom Jäger Plugin (`plan-dein-ding.de`)
- **Frontend**: Next.js 15.5.9 (App Router), React 19, TypeScript, Tailwind CSS v4
- **Deployment**: Vercel (`bodenjaeger.vercel.app`)
- **Payments**: Stripe, PayPal, Bank Transfer (BACS)

## Development Commands

```bash
npm run dev        # Dev server with Turbopack on http://localhost:3000
npm run build      # Production build
npm start          # Production server
npm run lint       # ESLint 9 (flat config)
npm run check-env  # Verify environment variables
```

## Architecture

### Data Flow: Backend Prices, Frontend Quantities

**Key Principle**: Frontend NEVER calculates prices. All prices come pre-calculated from the backend via `setangebot_*` fields. Frontend ONLY calculates quantities (packages, m², lfm).

1. WordPress Jäger Plugin exposes Custom API: `/wp-json/jaeger/v1/products`
2. 41 custom fields delivered at **root level** (not nested) for performance
3. Frontend displays backend-calculated prices and computes quantities only

**Custom API** (NOT standard WooCommerce REST API):
- Base: `https://plan-dein-ding.de/wp-json/jaeger/v1/`
- Auth: WooCommerce Consumer Key/Secret in `.env.local`
- Product types defined in `src/lib/woocommerce.ts` (`StoreApiProduct`)
- Always access custom fields at root level: `product.paketinhalt` (NOT `product.jaeger_meta?.paketinhalt`)

### Set-Angebot System (Bundle Pricing)

The heart of this shop. Bundle components:
1. **Floor (Boden)** - Required
2. **Insulation (Dämmung)** - Optional, standard or premium
3. **Baseboard (Sockelleiste)** - Optional, standard or premium

**Product categorization** via `verrechnung` field:
- `verrechnung === 0` → Standard (free in bundle, rounds down with `Math.floor`)
- `verrechnung > 0` → Premium (only difference charged, rounds up with `Math.ceil`)
- `price < standardPrice` → Cheaper alternative (free, no refund, rounds down)
- Regular purchase always uses `Math.ceil` (customer buys full packages)

**Quantity calculation**: `src/lib/setCalculations.ts` — NO price logic here.

### Two Independent Price Displays (MUST remain separate)

1. **"Gesamt" (`SetAngebot.tsx` - Top)**: Static per-unit price (€/m²). Changes only when user selects different Dämmung/Sockelleiste. Does NOT change with m² input.
2. **"Gesamtsumme" (`TotalPrice.tsx` - Bottom)**: Dynamic total package price. Changes when m² quantity changes.

All prices calculated once in `ProductPageContent.tsx` (Single Source of Truth) and passed as props to children. Never mix these two concepts.

### State Management

Three React Context providers (all in `src/contexts/`):
- **`CartContext.tsx`** — Cart state with localStorage (`woocommerce-cart` key). Supports single products and Set-Angebote. `useCart()` hook.
- **`CheckoutContext.tsx`** — Multi-step checkout flow state
- **`WishlistContext.tsx`** — Favorites/wishlist state

### API Layer

Two separate API clients (different auth, different endpoints):
- **`src/lib/woocommerce.ts`** — Product fetching (`fetchProducts`, `fetchProductBySlug`). Includes full `StoreApiProduct` type.
- **`src/lib/woocommerce-checkout.ts`** — Order management (`createWooCommerceOrder`, `getOrderStatus`, `updateOrderStatus`). Server-side only.
- **`src/lib/api/`** — Additional API utilities: `jaegerApi.ts`, `adapters.ts`, `product-full.ts`, `product-options.ts`, `products-critical.ts`

### Styling

**Tailwind CSS v4** — configured in CSS, not `tailwind.config.js`:
- Import: `@import "tailwindcss"` in `globals.css`
- Theme: `@theme inline` block in `globals.css`
- PostCSS: `postcss.config.mjs` with `@tailwindcss/postcss`
- Font: Poppins (Regular + Bold via CSS variables `--font-poppins-regular`, `--font-poppins-bold`)

**CSS Custom Properties** (in `src/app/globals.css`):
```css
--color-primary: #ed1b24;        /* Bodenjäger Red */
--color-text-primary: #2e2d32;   /* Dark gray */
--color-bg-light: #f9f9fb;
--color-bg-darkest: #2e2d32;
--gradient-mid-to-sky: radial-gradient(circle at center, #a8dcf4 0%, #5095cb 100%);
```

Use inline styles for CSS variables: `style={{ background: 'var(--gradient-mid-to-sky)' }}`

### Key Files

| File | Purpose |
|------|---------|
| `src/components/product/ProductPageContent.tsx` | Core Set-Angebot orchestrator — all price/quantity logic starts here |
| `src/lib/setCalculations.ts` | Quantity calculations (packages, m², lfm) — NO prices |
| `src/lib/woocommerce.ts` | Product API client + `StoreApiProduct` type definition |
| `src/lib/woocommerce-checkout.ts` | Order API client (server-side only) |
| `src/contexts/CartContext.tsx` | Cart state management with localStorage |
| `src/app/globals.css` | Tailwind v4 config + CSS custom properties |

### Page Structure

- Product pages: `src/app/products/[slug]/page.tsx` (SSR)
- Category pages: `src/app/category/[slug]/page.tsx`
- Fachmarkt subpages: `src/app/fachmarkt-hueckelhoven/` (9 subpages)
- Legal pages: `/agb`, `/datenschutz`, `/impressum`, `/widerruf`, `/versand-lieferzeit`
- Checkout flow: `/cart` → `/checkout` → `/checkout/success`

### Component Patterns

- Product page components are **client components** (`'use client'`)
- Product data comes from **server-side props** (SSR in `page.tsx`)
- Use `useMemo` for expensive calculations
- All custom fields are optional (`field?: type | null`) — always use fallbacks: `product.field || defaultValue`
- Navigation: `src/components/navigation/` (MobileMenu with 3 levels)
- Path aliases: `@/*` maps to `src/*`

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_WORDPRESS_URL=https://plan-dein-ding.de
WC_CONSUMER_KEY=ck_...
WC_CONSUMER_SECRET=cs_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
REVALIDATE_SECRET=...
```

Optional: `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`

## Known Issues

- **Missing `verrechnung` field**: Frontend fallback in `ProductPageContent.tsx` — `product.verrechnung ?? Math.max(0, price - standardPrice)`. Backend should add this field.
- **Cart persistence**: localStorage only, not synced across devices.

## Documentation

- `backend/ROOT_LEVEL_FIELDS.md` — Complete list of 41 custom fields
- `backend/VERRECHNUNG_FELD_BACKEND.md` — Missing field documentation
- `PROJEKT_ZUSAMMENFASSUNG.md` — Project overview with Set-Angebot math
- `WOOCOMMERCE_CHECKOUT_INTEGRATION.md` — Checkout implementation plan
- `FEHLENDE_FEATURES.md` — Missing features and roadmap
