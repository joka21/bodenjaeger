# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Arbeitsweise (Wichtig)

- **Nur das tun, was explizit verlangt wird.** Keine zusätzlichen Themen oder Dateien anfassen, die nicht Teil der Aufgabe sind.
- Keine ungefragten Refactorings, keine "Aufräumarbeiten" nebenbei, keine vorausschauenden Änderungen an anderen Stellen.
- Bei Unsicherheit über den Umfang: **erst nachfragen**, dann handeln.

## Project Overview

Bodenjäger is a Next.js headless e-commerce shop for flooring products (Laminat, Vinyl, Parkett) with a WooCommerce backend. The core feature is a **Set-Angebot System** (Bundle System) allowing customers to purchase flooring bundles (Boden + Dämmung + Sockelleiste) with automatic discounts.

- **Backend**: WordPress + WooCommerce + Custom Jäger Plugin (`2025.bodenjaeger.de`)
- **Frontend**: Next.js 15.5.9 (App Router), React 19, TypeScript, Tailwind CSS v4
- **Deployment**: Vercel — live unter `bodenjaeger.de` (seit 27.04.2026)
- **Payments**: Stripe, PayPal, Bank Transfer (BACS)
- **No test framework** — there are no unit/integration tests in this project

## Development Commands

```bash
npm run dev        # Dev server with Turbopack on http://localhost:3000
npm run build      # Production build
npm start          # Production server
npm run lint       # ESLint 9 (flat config, ignores test/**)
npm run check-env  # Verify environment variables
```

## Architecture

### Data Flow: Backend Prices, Frontend Quantities

**Key Principle**: Frontend NEVER calculates prices from scratch. All prices come pre-calculated from the backend via `setangebot_*` fields. Frontend ONLY calculates quantities (packages, m², lfm).

1. WordPress Jäger Plugin exposes Custom API: `/wp-json/jaeger/v1/products`
2. 41 custom fields delivered at **root level** (not nested) for performance
3. Frontend displays backend-calculated prices and computes quantities only

### Two Separate API Clients (NOT interchangeable)

**`src/lib/woocommerce.ts`** — Product fetching (SSR):
- Uses **custom Jaeger API** at `/wp-json/jaeger/v1/products` (NOT WooCommerce REST API)
- Returns all 41 custom fields at root level
- Basic Auth with `btoa()` (browser-compatible)
- Singleton `wooCommerceClient` class with lazy config init
- Optional Redis/KV cache via `@vercel/kv` (30s TTL, fails gracefully)
- Always access custom fields at root level: `product.paketinhalt` (NOT `product.jaeger_meta?.paketinhalt`)

**`src/lib/woocommerce-checkout.ts`** — Order management (server-side ONLY):
- Uses **WooCommerce REST API v3** at `/wp-json/wc/v3/orders`
- Uses `Buffer.from()` for auth — will crash in browser
- Exported as plain async functions (no class)

**`src/lib/api/`** — A planned-but-not-primary optimized API layer. The actual product page uses `wooCommerceClient` directly.

### Set-Angebot System (Bundle Pricing)

The heart of this shop. Bundle components:
1. **Floor (Boden)** — Required
2. **Insulation (Dämmung)** — Optional, standard or premium
3. **Baseboard (Sockelleiste)** — Optional, standard or premium

**Product categorization** via `verrechnung` field:
- `verrechnung === 0` → Standard (free in bundle, rounds down with `Math.floor`)
- `verrechnung > 0` → Premium (only difference charged, rounds up with `Math.ceil`)
- `price < standardPrice` → Cheaper alternative (free, no refund, rounds down)
- Regular purchase always uses `Math.ceil` (customer buys full packages)
- Frontend fallback for missing field: `product.verrechnung ?? Math.max(0, price - standardPrice)`

**Quantity calculation**: `src/lib/setCalculations.ts` — NO price logic here.
**Baseboard lfm formula**: `floorM2 * 1.0` (perimeter-equals-area rule of thumb).

### Two Independent Price Displays (MUST remain separate)

1. **"Gesamt" (`SetAngebot.tsx` - Top)**: Static per-unit price (€/m²). Changes only when user selects different Dämmung/Sockelleiste. Does NOT change with m² input.
2. **"Gesamtsumme" (`TotalPrice.tsx` - Bottom)**: Dynamic total package price. Changes when m² quantity changes.

All prices calculated once in `ProductPageContent.tsx` (Single Source of Truth) and passed as props to children. Never mix these two concepts.

### Product Page Architecture

**`src/app/products/[slug]/page.tsx`** (Server Component, `revalidate = 30`):
1. Fetches product via `wooCommerceClient.getProduct(slug)`
2. Separately fetches WooCommerce REST API v3 description (contains `<table>` HTML for Eigenschaften tab, `revalidate: 300`) — this is a different endpoint from the Jaeger API
3. Reads addon IDs from root-level fields (`daemmung_id`, `sockelleisten_id`, `daemmung_option_ids`, `sockelleisten_option_ids`)
4. Batch-loads all addon products with `getProductsByIds()`
5. Passes everything to `ProductPageContent` (client component)

**`ProductPageContent.tsx`** (~600+ lines, client component) — The orchestrator:
- State: `wantedM2`, `selectedDaemmung`, `selectedSockelleiste`
- `quantities` (useMemo) → calls `calculateSetQuantities()`
- `prices` (useMemo) → all price derivation from backend fields
- `handleProductSelection` wrapped in `useCallback` — prevents race condition between `SetAngebot` (desktop) and `SetAngebotMobile` (mobile) both trying to update state
- Product type detection by category slug (`vinylboden`, `laminat`, `parkett` → shows SetAngebot; `zubehoer` → simpler layout)

### Provider Hierarchy (`layout.tsx`)

```
CartProvider
  WishlistProvider
    HeaderWrapper (contains CartDrawer trigger)
    FloatingContactButton
    {children}
    Footer
```

**Note**: `CheckoutContext.tsx` exists but is NOT in the provider tree and NOT used by the checkout page. It is dead code.

### Cart System

**`CartContext.tsx`** — canonical cart state:
- `cartItems: CartItem[]` — flat array; set bundles are stored as multiple items linked by shared `setId`
- `addSetToCart()` generates `setId = set-${Date.now()}-${random}`, stores floor/insulation/baseboard as separate entries
- `removeSet()` filters out all items with matching `setId`
- Persistent to `localStorage` under `woocommerce-cart` (hydration-safe: only writes after `isCartLoaded = true`)
- `customerNote` and `deliveryNote` persisted separately
- Sample pricing: first 3 free, then 3€ each — position-based dynamic calculation (recounted every render, stored `samplePrice` field is not authoritative)
- `isCartDrawerOpen` lives in CartContext (no separate context)

**`CartDrawer.tsx`** converts flat `CartItem[]` to `CartDrawerItem[]` (discriminated union of `CartSetItem | CartSingleItem`). Groups set items by `setId`.

### Checkout Flow

**`/checkout/page.tsx`** — single-page form with its own `useState` (does NOT use `CheckoutContext`):
- Submits to `/api/checkout/create-order`
- Branches by payment: stripe → Stripe Checkout Session, paypal → PayPal approval URL, bacs → order set to `on-hold`
- `/checkout/success/page.tsx` reads query params (`?order=`, `?paypal=`, `?session_id=`), clears localStorage

### Shipping Discrepancy

- **`cart-utils.ts`**: `calculateShipping()` always returns 0 — used in CartDrawer (shows "Kostenlos")
- **`shippingConfig.ts`**: real tiered shipping (free ≥200€, 6€ ≥49€, 50€ <49€) — used at checkout only
- Real shipping cost only appears at checkout, not in the cart drawer

### Styling

**Tailwind CSS v4** — configured entirely in CSS (`globals.css`), no `tailwind.config.js`:
- Import: `@import "tailwindcss"` in `globals.css`
- Theme: `@theme inline` block maps CSS vars to utilities
- PostCSS: `postcss.config.mjs` with `@tailwindcss/postcss` only (no autoprefixer)
- Font: Poppins (Regular + Bold via CSS variables `--font-poppins-regular`, `--font-poppins-bold`)

**Available Tailwind color utilities** (defined in `@theme inline`):
- `text-brand / bg-brand` → `#ed1b24` (Bodenjäger Red)
- `text-dark / bg-dark` → `#2e2d32`, `text-mid / bg-mid` → `#4c4c4c`
- `text-ash / bg-ash / border-ash` → `#e5e5e5`, `bg-pale` → `#f9f9fb`
- `text-navy / bg-navy` → `#1e40af`, `text-ocean / bg-ocean` → `#5095cb`
- `text-success / bg-success` → `#28a745`

**CSS Custom Properties** (in `:root`, not Tailwind theme tokens):
```css
--color-primary: #ed1b24;
--color-text-primary: #2e2d32;
--color-bg-light: #f9f9fb;
--color-bg-darkest: #2e2d32;
--gradient-mid-to-sky: radial-gradient(circle at center, #a8dcf4 0%, #5095cb 100%);
```

Use inline styles for CSS variable gradients: `style={{ background: 'var(--gradient-mid-to-sky)' }}`

**`.content-container`** — custom utility class (not Tailwind), max-width 1400px with responsive padding.

### Price Type Gotcha

`StoreApiProduct` (in `woocommerce.ts`) has `price` as a **number** (e.g., `29.99`) from the Jaeger API. There is also an optional `prices?: { price: string }` field where price is in **cents as a string** (e.g., `"2999"`) from the legacy Store API shape. Always use `product.price` (number) for Jaeger API data.

### Dual Type System (legacy)

1. **`StoreApiProduct`** (in `woocommerce.ts`) — the live type actually used everywhere
2. **`ProductCritical` / `ProductFull` / `ProductOption`** (in `types/product-optimized.ts`) — planned optimized types, not primary
3. **`adapters.ts`** reads from `product.jaeger_meta.*` (nested) instead of root-level fields — this is a migration artifact and may produce wrong values

Always use `StoreApiProduct` and access fields at root level.

### Key Files

| File | Purpose |
|------|---------|
| `src/components/product/ProductPageContent.tsx` | Core Set-Angebot orchestrator — all price/quantity logic starts here |
| `src/lib/setCalculations.ts` | Quantity calculations (packages, m², lfm) — NO prices |
| `src/lib/woocommerce.ts` | Product API client + `StoreApiProduct` type definition |
| `src/lib/woocommerce-checkout.ts` | Order API client (server-side only) |
| `src/contexts/CartContext.tsx` | Cart state management with localStorage |
| `src/lib/shippingConfig.ts` | Tiered shipping logic (used at checkout) |
| `src/app/globals.css` | Tailwind v4 config + CSS custom properties |

### Component Patterns

- Product page components are **client components** (`'use client'`)
- Product data comes from **server-side props** (SSR in `page.tsx`)
- Use `useMemo` for expensive calculations
- All custom fields are optional (`field?: type | null`) — always use fallbacks: `product.field || defaultValue`
- Price formatting: `formatPrice()` in `cart-utils.ts` uses `de-DE` locale (comma decimal, period thousands)
- Path aliases: `@/*` maps to `src/*`

### Page Structure

- Product pages: `src/app/products/[slug]/page.tsx` (SSR, `revalidate: 30`)
- Category pages: `src/app/category/[slug]/page.tsx`
- Fachmarkt subpages: `src/app/fachmarkt-hueckelhoven/` (9 subpages)
- Legal pages: `/agb`, `/datenschutz`, `/impressum`, `/widerruf`, `/versand-lieferzeit`
- Checkout flow: `/cart` → `/checkout` → `/checkout/success`

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_WORDPRESS_URL=https://2025.bodenjaeger.de
WC_CONSUMER_KEY=ck_...
WC_CONSUMER_SECRET=cs_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
REVALIDATE_SECRET=...
```

Optional: `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`

## Known Issues

- **Missing `verrechnung` field**: Backend should add this. Frontend fallback in `ProductPageContent.tsx`.
- **Cart persistence**: localStorage only, not synced across devices.
- **Shipping display gap**: Cart drawer always shows "Kostenlos"; real shipping only at checkout.
- **`CheckoutContext.tsx` is dead code**: Not mounted in provider tree, not used by checkout page.
- **`adapters.ts` reads stale paths**: Uses `product.jaeger_meta.*` instead of root-level fields.
- **Set quantity duplication**: CartDrawer re-implements floor/ceil logic inline instead of using `setCalculations.ts`.

## Documentation

- `backend/ROOT_LEVEL_FIELDS.md` — Complete list of 41 custom fields
- `backend/VERRECHNUNG_FELD_BACKEND.md` — Missing field documentation
- `PROJEKT_ZUSAMMENFASSUNG.md` — Project overview with Set-Angebot math
- `WOOCOMMERCE_CHECKOUT_INTEGRATION.md` — Checkout implementation plan
- `FEHLENDE_FEATURES.md` — Missing features and roadmap
