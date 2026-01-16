# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bodenjäger is a Next.js 15.5.3 headless e-commerce shop for flooring products (Laminat, Vinyl, Parkett) with WooCommerce backend. The core feature is a **Set-Angebot System** (Bundle System) that allows customers to purchase flooring bundles (Boden + Dämmung + Sockelleiste) with automatic discounts and price calculations.

**Backend**: WordPress + WooCommerce + Custom Jäger Plugin (plan-dein-ding.de)
**Frontend**: Next.js 15.5.3 with App Router, React 19, TypeScript, Tailwind CSS v4
**Deployment**: Vercel (bodenjaeger.vercel.app)

### Tech Stack
- **Framework**: Next.js 15.5.3 (App Router, Server Components)
- **React**: 19.1.0 (latest)
- **TypeScript**: 5.x (strict mode enabled)
- **Styling**: Tailwind CSS v4 (using @import "tailwindcss" in globals.css)
- **Icons**: lucide-react
- **Payments**: Stripe (@stripe/stripe-js, stripe SDK)
- **State Management**: React Context API (CartContext)
- **Storage**: localStorage (cart), Vercel KV (optional sessions)
- **Build Tool**: Turbopack (Next.js default)

## Development Commands

### Run Development Server
```bash
npm run dev
# Starts Next.js with Turbopack on http://localhost:3000
```

### Build & Production
```bash
npm run build      # Build production bundle
npm start          # Start production server
```

### Linting
```bash
npm run lint       # Run ESLint (ESLint 9 with flat config)
```

## Architecture Overview

### Data Flow Architecture

**Backend → Frontend Data Flow:**
1. WordPress Jäger Plugin exposes Custom API: `/wp-json/jaeger/v1/products`
2. 41 custom fields delivered at root level (not nested) for performance
3. All prices pre-calculated by backend (setangebot_* fields)
4. Frontend ONLY calculates quantities, NEVER prices

**Key Principle**: Frontend fetches backend-calculated prices and displays them. Price logic lives in backend.

### API Integration

**Custom Jäger API Endpoint:**
- Base: `https://plan-dein-ding.de/wp-json/jaeger/v1/`
- Main endpoint: `/products?per_page=20&category=sale`
- Authentication: WooCommerce Consumer Key/Secret (stored in `.env.local`)

**Important**: This project uses a CUSTOM API endpoint, not standard WooCommerce REST API. All custom fields (paketinhalt, verschnitt, setangebot_*, etc.) come from root level of API response.

**TypeScript Interface**: See `src/lib/woocommerce.ts` for complete `StoreApiProduct` type definition with all 41 custom fields.

### Set-Angebot System (Bundle Pricing)

The heart of this shop. Customers configure bundles with automatic discount calculation.

**Bundle Components:**
1. **Floor (Boden)** - Main product, required
2. **Insulation (Dämmung)** - Optional, standard or premium
3. **Baseboard (Sockelleiste)** - Optional, standard or premium

**Product Categorization Logic:**
- **Standard Article**: `verrechnung === 0` → Free in bundle (rounds down)
- **Premium Article**: `verrechnung > 0` → Only difference charged (rounds up)
- **Cheaper Alternative**: `price < standardPrice` → Free, no refund (rounds down)

**Key Field: `verrechnung`**
```typescript
// Backend should provide this, frontend has fallback
const verrechnung = product.verrechnung ?? Math.max(0, productPrice - standardPrice);
```

**Quantity Calculation Functions:**
- `src/lib/setCalculations.ts` - Core quantity logic (NO price calculations)
- `calculatePackages()` - Package rounding (floor vs ceil logic)
- `calculateFloorQuantity()` - Floor with Verschnitt (waste)
- `calculateBaseboard_lfm()` - Baseboard linear meters (m² × 1.0 = lfm)

**Price Display Components:**
- `ProductPageContent.tsx` - Main calculation orchestrator (reads backend prices)
- `SetAngebot.tsx` - Top section showing per-unit prices (uses `setangebot_einzelpreis`, `setangebot_gesamtpreis`)
- `TotalPrice.tsx` - Bottom section showing total bundle price
- `QuantityDisplay.tsx` - Package quantities display

### File Structure

```
src/
├── app/
│   ├── page.tsx                      # Homepage
│   ├── products/[slug]/page.tsx      # Product detail pages (SSR)
│   ├── category/[slug]/page.tsx      # Category pages
│   ├── cart/page.tsx                 # Shopping cart page
│   ├── checkout/
│   │   ├── page.tsx                  # Checkout form
│   │   └── success/page.tsx          # Order success page
│   ├── api/
│   │   ├── products/                 # Product API routes (proxy to WooCommerce)
│   │   ├── checkout/
│   │   │   ├── create-order/route.ts # Order creation endpoint
│   │   │   ├── order/[id]/route.ts   # Order status retrieval
│   │   │   ├── stripe/webhook/route.ts # Stripe payment webhook
│   │   │   └── paypal/capture/route.ts # PayPal capture endpoint
│   │   └── revalidate/route.ts       # On-demand revalidation
│   └── globals.css                   # Global styles + CSS custom properties
│
├── components/
│   ├── product/
│   │   ├── ProductPageContent.tsx    # ⭐ CORE - Set-Angebot orchestration
│   │   ├── ProductInfo.tsx           # Product details & input
│   │   ├── SetAngebot.tsx            # Top price display
│   │   ├── TotalPrice.tsx            # Bottom total display
│   │   └── ImageGallery.tsx          # Product images
│   ├── cart/
│   │   ├── CartItem.tsx              # Individual cart item display
│   │   └── CartSummary.tsx           # Cart totals and checkout button
│   ├── checkout/
│   │   ├── TrustBadges.tsx           # Trust signals (SSL, payment icons)
│   │   ├── OrderSummary.tsx          # Order summary sidebar
│   │   └── PaymentMethodSelector.tsx # Payment method selection
│   ├── sections/home/
│   │   ├── BestsellerSlider.tsx      # Homepage bestsellers
│   │   └── SaleProductSlider.tsx     # Homepage sale products
│   ├── ProductCard.tsx               # Product grid card
│   ├── Header.tsx                    # Site header with cart
│   └── Footer.tsx                    # Site footer
│
├── contexts/
│   └── CartContext.tsx               # ⭐ Cart state management (localStorage)
│
├── lib/
│   ├── woocommerce.ts                # ⭐ Product API client + TypeScript types
│   ├── woocommerce-checkout.ts       # ⭐ Order API client
│   ├── setCalculations.ts            # ⭐ Quantity calculations (no prices)
│   ├── stripe.ts                     # Stripe payment integration
│   ├── paypal.ts                     # PayPal payment integration
│   └── imageUtils.ts                 # Image optimization helpers
│
└── types/
    └── product.ts                    # Product type definitions
```

### Design System

**Tailwind CSS v4 Configuration:**
- **IMPORTANT**: This project uses Tailwind CSS v4, not v3
- No `tailwind.config.js` file - configuration is done in CSS
- Import in `globals.css`: `@import "tailwindcss";`
- PostCSS config: `postcss.config.mjs` with `@tailwindcss/postcss`
- Use `@theme inline` for custom theme values in CSS

**CSS Custom Properties** (defined in `src/app/globals.css`):

```css
/* Brand Colors */
--color-primary: #ed1b24;        /* Bodenjäger Red */
--color-accent: #ed1b24;

/* Text Colors */
--color-text-primary: #2e2d32;   /* Dark gray */
--color-text-light: #ffffff;
--color-text-dark: #4c4c4c;

/* Background Colors */
--color-bg-white: #ffffff;
--color-bg-light: #f9f9fb;
--color-bg-gray: #e5e5e5;
--color-bg-dark: #4c4c4c;
--color-bg-darkest: #2e2d32;

/* Gradients */
--gradient-mid-to-sky: radial-gradient(circle at center, #a8dcf4 0%, #5095cb 100%);
```

Usage:
- Tailwind utilities: `className="bg-white text-gray-900 rounded-lg"`
- Custom properties: `style={{ backgroundColor: 'var(--color-primary)' }}`
- Inline backgrounds: `style={{ background: 'var(--gradient-mid-to-sky)' }}`

### Environment Variables

Required in `.env.local` (NOT in git):
```
# WooCommerce API
NEXT_PUBLIC_WORDPRESS_URL=https://plan-dein-ding.de
WC_CONSUMER_KEY=ck_...
WC_CONSUMER_SECRET=cs_...

# Stripe Payment
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...

# PayPal Payment (optional)
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...

# Cache Revalidation
REVALIDATE_SECRET=...

# Vercel KV (optional - for rate limiting/sessions)
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
```

### Important TypeScript Patterns

**Path Aliases**: Use `@/*` for `src/*` imports
```typescript
import { fetchProducts } from '@/lib/woocommerce';
```

**Root-Level Custom Fields**: Access directly on product object
```typescript
// ✅ Correct (root level)
product.paketinhalt
product.setangebot_gesamtpreis

// ❌ Wrong (nested access not needed)
product.jaeger_meta?.paketinhalt
```

**Type Safety**: All custom fields are optional (`field?: type | null`) because not all products have all fields.

## Critical Implementation Rules

### Price Calculations
1. **NEVER calculate prices in frontend** - Always use `product.setangebot_*` fields from backend
2. Frontend ONLY calculates quantities (packages, m², lfm)
3. Use `setCalculations.ts` functions for quantity logic
4. Display backend-provided prices: `setangebot_einzelpreis`, `setangebot_gesamtpreis`, `setangebot_ersparnis_euro`

### Rounding Rules
- **Regular purchase**: Always `Math.ceil()` (customer buys full packages)
- **Free in bundle** (Standard/Cheaper): `Math.floor()` (customer friendly)
- **Premium in bundle**: `Math.ceil()` (fair charging for difference)

### Component Development
- Product page components are client components (`'use client'`)
- Cart and checkout pages are client components (use localStorage and form state)
- Use `useMemo` for expensive calculations
- Product data comes from server-side props (SSR in page.tsx)
- Images use Next.js Image component with configured remote patterns
- Wrap app in CartProvider (in root layout) for cart state access

### API Usage
```typescript
// Product API - Fetch products with custom fields
import { fetchProducts, fetchProductBySlug } from '@/lib/woocommerce';

// All fields available at root level
const product = await fetchProductBySlug('rigid-vinyl-egmont');
const paketinhalt = product.paketinhalt || 1;  // ✅ Root level access

// Order API - Create and manage orders
import { createWooCommerceOrder } from '@/lib/woocommerce-checkout';

const order = await createWooCommerceOrder({
  payment_method: 'stripe',
  payment_method_title: 'Kreditkarte',
  set_paid: false,
  billing: { /* customer data */ },
  shipping: { /* shipping address */ },
  line_items: [{ product_id: 123, quantity: 2, total: "99.99" }]
});
```

## E-Commerce Features

### Cart System
- **Location**: `src/contexts/CartContext.tsx`
- **Storage**: localStorage (key: `woocommerce-cart`)
- **Features**:
  - Add single products or complete Set-Angebote
  - Persistent across page reloads
  - Tracks Set-Angebot pricing (setPricePerUnit, actualM2)
  - Distinguishes between regular items and set items
- **Usage**:
  ```typescript
  const { addToCart, addSetToCart, cartItems, totalPrice } = useCart();
  ```

### Checkout Flow
1. **Cart Page** (`/cart`) - Review items, adjust quantities
2. **Checkout Page** (`/checkout`) - Customer info, shipping, billing, payment method
3. **API Route** (`/api/checkout/create-order`) - Creates WooCommerce order
4. **Payment Gateway** - Stripe, PayPal, or bank transfer
5. **Success Page** (`/checkout/success`) - Order confirmation

### Payment Integration
**Stripe:**
- Checkout sessions for card payments
- Webhook handler for payment confirmation: `/api/checkout/stripe/webhook`
- Requires STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

**PayPal:**
- PayPal Checkout integration
- Capture endpoint: `/api/checkout/paypal/capture`
- Requires PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET

**Bank Transfer (BACS):**
- No external integration needed
- Order created with status "on-hold"
- Payment confirmed manually by admin

### Order Management
- **API Client**: `src/lib/woocommerce-checkout.ts`
- **Functions**:
  - `createWooCommerceOrder()` - Create new order
  - `getOrderStatus()` - Retrieve order by ID
  - `getOrderByIdAndEmail()` - Secure order lookup with email verification
  - `updateOrderStatus()` - Update order status (used by webhooks)
  - `addOrderNote()` - Add notes to orders

## Common Development Tasks

### Adding a New Custom Field
1. Add to `JaegerMeta` interface in `src/lib/woocommerce.ts`
2. Backend must expose field via Jäger API at root level
3. Access directly on product object: `product.new_field`

### Creating a New Product Component
1. Import product type: `import type { StoreApiProduct } from '@/lib/woocommerce';`
2. Use CSS custom properties for styling
3. Handle optional fields with fallbacks: `product.field || defaultValue`
4. For prices, use backend-calculated values only

### Adding a New Payment Method
1. Create lib file: `src/lib/[payment-provider].ts`
2. Add API route: `src/app/api/checkout/[provider]/route.ts`
3. Update checkout page to include new payment option
4. Add webhook handler if needed
5. Configure environment variables

### Testing Order Flow
```bash
# Development: Use Stripe test mode
# Test cards: 4242 4242 4242 4242 (success), 4000 0000 0000 9995 (decline)

# Check order in WooCommerce admin
# Verify email sending (check spam folder in dev)
```

## Known Issues & Workarounds

### Missing `verrechnung` Field
**Status**: Frontend fallback implemented
**Location**: `ProductPageContent.tsx:77`
```typescript
const verrechnung = product.verrechnung ?? Math.max(0, price - standardPrice);
```
**Backend Task**: Add `verrechnung` field to API (see `backend/VERRECHNUNG_FELD_BACKEND.md`)

### Cart Persistence
**Current**: Cart stored in localStorage only (client-side)
**Limitation**: Cart not synced across devices or after browser data clearing
**Future**: Consider WooCommerce Session API for server-side cart persistence

### Image Configuration
Next.js Image component configured for:
- `plan-dein-ding.de/wp-content/uploads/**`
- `images.unsplash.com/**` (placeholder)
- `via.placeholder.com/**` (placeholder)

Formats: AVIF, WebP (auto-optimization)

## Documentation Files

**Backend Integration:**
- `backend/ROOT_LEVEL_FIELDS.md` - Complete list of 41 custom fields
- `backend/VERRECHNUNG_FELD_BACKEND.md` - Missing field documentation
- `backend/FRONTEND_BACKEND_DATENFLUSS.md` - Data flow architecture

**Checkout & Orders:**
- `WOOCOMMERCE_CHECKOUT_INTEGRATION.md` - Complete checkout implementation plan
- `FEHLENDE_FEATURES.md` - Missing features and roadmap

**Project Status:**
- `PROJEKT_ZUSAMMENFASSUNG.md` - Comprehensive project overview with Set-Angebot math
- Various `*_COMPLETE.md` files - Completed feature documentation

## Architectural Decisions

### Why No TypeScript Config Export?
The `StoreApiProduct` interface in `woocommerce.ts` is NOT exported because it's used internally. Access the type using:
```typescript
import type { StoreApiProduct } from '@/lib/woocommerce';
```

### Why Client-Side Cart?
Cart uses localStorage instead of WooCommerce session API because:
1. **Performance**: Instant cart updates without API calls
2. **Offline Support**: Cart persists without internet connection
3. **Simplicity**: No session management complexity
4. **Trade-off**: Not synced across devices (acceptable for MVP)

### Why Separate Checkout API Client?
`woocommerce-checkout.ts` is separate from `woocommerce.ts` because:
1. Different API endpoints (Store API vs REST API v3)
2. Different authentication methods
3. Server-side only (contains credentials)
4. Clear separation of concerns (products vs orders)

### Why Vercel KV Optional?
Vercel KV is used for rate limiting and session storage but is optional because:
1. Cart works with localStorage
2. Order creation doesn't require sessions
3. Only needed for advanced features (rate limiting, saved carts)

## Best Practices

### Code Style
- TypeScript strict mode enabled
- Prefer functional components with hooks
- Use semantic HTML elements
- Tailwind CSS utilities for layout, CSS variables for brand colors
- Avoid inline styles except for CSS custom properties

### Performance
- Use Next.js Image component for all images
- Implement proper loading states
- Memoize expensive calculations
- Server-side render product pages for SEO

### Data Access
- ALWAYS check for optional fields: `product.field || fallback`
- Use root-level field access (not nested `jaeger_meta`)
- Never mutate product objects
- Cache API responses when appropriate (Next.js built-in caching)

### Debugging
- Console logs in `ProductPageContent.tsx` show calculation details
- Check browser console for "🔧" prefixed logs during development
- Use `DEBUG=true` logs in setCalculations.ts if needed

## Additional Context

### Baseboard Calculation Formula
```typescript
// Industry standard: perimeter ≈ floor area for typical room proportions
const baseboardLfm = floorM2 * 1.0;
```

### Package Size Examples
- **Floor**: 2.67 m²/package, 2.22 m²/package (varies by product)
- **Insulation**: Often same as floor paketinhalt
- **Baseboard**: 2.5 m/package (linear meters)

### Product Categories
Main categories: Laminat, Vinyl, Parkett, Dämmung, Sockelleisten, Zubehör
