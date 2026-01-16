# WooCommerce Checkout-Integration - Implementierungsplan

**Projekt:** Bodenjäger E-Commerce Shop
**Stand:** 12. Januar 2026
**Priorität:** 🔴 KRITISCH
**Aufwand:** Hoch (80-120 Stunden)

---

## 📋 Inhaltsverzeichnis

1. [Übersicht](#übersicht)
2. [Aktueller Status](#aktueller-status)
3. [Ziel-Architektur](#ziel-architektur)
4. [Implementierungsplan](#implementierungsplan)
5. [WooCommerce API Integration](#woocommerce-api-integration)
6. [Warenkorb-Backend Sync](#warenkorb-backend-sync)
7. [Checkout-Prozess](#checkout-prozess)
8. [Zahlungs-Integration](#zahlungs-integration)
9. [Order-Management](#order-management)
10. [Testing-Strategie](#testing-strategie)
11. [Sicherheit](#sicherheit)
12. [Deployment-Checklist](#deployment-checklist)

---

## 🎯 Übersicht

### Was fehlt aktuell?

Die Frontend-UI für Warenkorb und Checkout ist **komplett vorhanden**, aber es gibt **keine Backend-Integration**. Produkte können nicht bestellt werden, keine Orders werden erstellt, keine Zahlungen verarbeitet.

### Was muss implementiert werden?

1. ✅ **Warenkorb-UI** (vorhanden)
2. ✅ **Checkout-UI** (vorhanden)
3. ❌ **Warenkorb → WooCommerce Sync** (fehlt)
4. ❌ **Order-Erstellung über WooCommerce API** (fehlt)
5. ❌ **Zahlungs-Gateway Integration** (fehlt)
6. ❌ **Bestellbestätigung E-Mails** (fehlt)
7. ❌ **Admin-Benachrichtigungen** (fehlt)

---

## 📊 Aktueller Status

### ✅ Was bereits funktioniert:

```
src/
├── contexts/
│   ├── CartContext.tsx           ✅ Warenkorb State Management (localStorage)
│   └── CheckoutContext.tsx       ✅ Checkout State Management
├── app/
│   ├── cart/page.tsx             ✅ Warenkorb UI komplett
│   └── checkout/page.tsx         ✅ Checkout UI komplett
└── components/
    ├── cart/                     ✅ Warenkorb Komponenten
    └── checkout/                 ✅ Checkout Komponenten
        ├── TrustBadges.tsx
        ├── ExpressCheckout.tsx
        ├── ContactForm.tsx
        ├── ShippingForm.tsx
        ├── PaymentOptions.tsx
        └── OrderSummary.tsx
```

### ❌ Was fehlt:

1. **API Integration** - Keine WooCommerce Order API Calls
2. **Backend Sync** - Warenkorb nur in localStorage, nicht in Session
3. **Payment Processing** - Keine Zahlungs-Gateway Integration
4. **Order Confirmation** - Keine E-Mails, keine Order-Tracking
5. **Error Handling** - Keine Fehlerbehandlung für API-Fails
6. **Inventory Management** - Keine Stock-Reduktion bei Bestellung

---

## 🏗️ Ziel-Architektur

### Datenfluss: Warenkorb → Bestellung

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Warenkorb (CartContext)                                  │
│     ├─ Set-Angebote (Floor + Dämmung + Sockelleiste)        │
│     ├─ Einzelprodukte                                        │
│     └─ Mengen & Preise                                       │
│                          ↓                                    │
│  2. Checkout-Formular                                        │
│     ├─ Kundendaten (E-Mail, Name)                           │
│     ├─ Lieferadresse                                         │
│     ├─ Rechnungsadresse                                      │
│     └─ Zahlungsmethode                                       │
│                          ↓                                    │
│  3. API Route Handler                                        │
│     └─ /api/checkout/create-order                           │
│                                                               │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP POST
                        │ (Order Data + Line Items)
                        ↓
┌─────────────────────────────────────────────────────────────┐
│              WOOCOMMERCE REST API (Backend)                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  4. Order-Erstellung                                         │
│     POST /wp-json/wc/v3/orders                              │
│     ├─ Customer Data                                         │
│     ├─ Line Items (Produkte)                                │
│     ├─ Shipping Address                                      │
│     ├─ Billing Address                                       │
│     └─ Payment Method                                        │
│                          ↓                                    │
│  5. Payment Gateway                                          │
│     ├─ PayPal                                                │
│     ├─ Stripe                                                │
│     ├─ Klarna                                                │
│     └─ Rechnung / Vorkasse                                   │
│                          ↓                                    │
│  6. Order Processing                                         │
│     ├─ Stock Reduction                                       │
│     ├─ E-Mail: Bestellbestätigung (Kunde)                   │
│     ├─ E-Mail: Neue Bestellung (Admin)                      │
│     └─ Order Status: processing                              │
│                                                               │
└───────────────────────┬─────────────────────────────────────┘
                        │ Response
                        │ (Order ID + Payment URL)
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  7. Order Success                                            │
│     ├─ Redirect zu Payment Gateway (falls nötig)            │
│     ├─ Oder: Success-Page mit Order-Details                 │
│     ├─ Warenkorb leeren                                      │
│     └─ Order-Tracking Link                                   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 Implementierungsplan

### Phase 1: API Integration Setup (Tag 1-2)

#### 1.1 WooCommerce Order API Wrapper erstellen

**Datei:** `src/lib/woocommerce-checkout.ts`

```typescript
// Neu zu erstellen
import type { StoreApiProduct } from './woocommerce';

interface WooCommerceOrderLineItem {
  product_id: number;
  quantity: number;
  total: string;
  meta_data?: Array<{
    key: string;
    value: string;
  }>;
}

interface WooCommerceOrderData {
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  billing: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city: string;
    state?: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city: string;
    state?: string;
    postcode: string;
    country: string;
  };
  line_items: WooCommerceOrderLineItem[];
  shipping_lines: Array<{
    method_id: string;
    method_title: string;
    total: string;
  }>;
  customer_note?: string;
}

interface WooCommerceOrder {
  id: number;
  order_key: string;
  status: string;
  total: string;
  date_created: string;
  payment_url?: string;
  line_items: Array<any>;
  billing: any;
  shipping: any;
}

export async function createWooCommerceOrder(
  orderData: WooCommerceOrderData
): Promise<WooCommerceOrder> {
  const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const consumerKey = process.env.WC_CONSUMER_KEY;
  const consumerSecret = process.env.WC_CONSUMER_SECRET;

  if (!baseUrl || !consumerKey || !consumerSecret) {
    throw new Error('WooCommerce API credentials missing');
  }

  const url = `${baseUrl}/wp-json/wc/v3/orders`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64'),
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`WooCommerce Order Creation Failed: ${error.message}`);
  }

  return response.json();
}

export async function getOrderStatus(orderId: number): Promise<WooCommerceOrder> {
  const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const consumerKey = process.env.WC_CONSUMER_KEY;
  const consumerSecret = process.env.WC_CONSUMER_SECRET;

  const url = `${baseUrl}/wp-json/wc/v3/orders/${orderId}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64'),
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch order status');
  }

  return response.json();
}
```

**Todo-Liste Phase 1.1:**
- [ ] Datei `src/lib/woocommerce-checkout.ts` erstellen
- [ ] TypeScript Interfaces für Order-Daten definieren
- [ ] `createWooCommerceOrder()` Funktion implementieren
- [ ] `getOrderStatus()` Funktion implementieren
- [ ] Error-Handling für API-Fehler
- [ ] Logging für Debugging

---

#### 1.2 Next.js API Route für Order-Erstellung

**Datei:** `src/app/api/checkout/create-order/route.ts`

```typescript
// Neu zu erstellen
import { NextRequest, NextResponse } from 'next/server';
import { createWooCommerceOrder } from '@/lib/woocommerce-checkout';
import type { CartItem } from '@/contexts/CartContext';

interface CheckoutRequestBody {
  cartItems: CartItem[];
  customerData: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  shippingAddress: {
    address1: string;
    address2?: string;
    city: string;
    postcode: string;
    country: string;
    state?: string;
  };
  billingAddress: {
    address1: string;
    address2?: string;
    city: string;
    postcode: string;
    country: string;
    state?: string;
  };
  paymentMethod: string;
  customerNote?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequestBody = await request.json();

    // Validierung
    if (!body.cartItems || body.cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Warenkorb ist leer' },
        { status: 400 }
      );
    }

    if (!body.customerData.email) {
      return NextResponse.json(
        { error: 'E-Mail-Adresse fehlt' },
        { status: 400 }
      );
    }

    // Line Items erstellen
    const lineItems = body.cartItems.map(item => {
      const metaData = [];

      // Set-Angebot Meta-Daten
      if (item.isSetItem) {
        metaData.push({ key: '_is_set_item', value: 'true' });
        metaData.push({ key: '_set_item_type', value: item.setItemType || '' });

        if (item.actualM2) {
          metaData.push({ key: '_actual_m2', value: item.actualM2.toString() });
        }

        if (item.setPricePerUnit) {
          metaData.push({ key: '_set_price_per_unit', value: item.setPricePerUnit.toString() });
        }
      }

      return {
        product_id: item.product.id,
        quantity: item.quantity,
        total: (item.quantity * (item.setPricePerUnit || item.product.price)).toFixed(2),
        meta_data: metaData,
      };
    });

    // WooCommerce Order erstellen
    const orderData = {
      payment_method: body.paymentMethod,
      payment_method_title: getPaymentMethodTitle(body.paymentMethod),
      set_paid: false, // false = Zahlung steht noch aus
      billing: {
        first_name: body.customerData.firstName,
        last_name: body.customerData.lastName,
        email: body.customerData.email,
        phone: body.customerData.phone,
        address_1: body.billingAddress.address1,
        address_2: body.billingAddress.address2 || '',
        city: body.billingAddress.city,
        postcode: body.billingAddress.postcode,
        country: body.billingAddress.country,
        state: body.billingAddress.state || '',
      },
      shipping: {
        first_name: body.customerData.firstName,
        last_name: body.customerData.lastName,
        address_1: body.shippingAddress.address1,
        address_2: body.shippingAddress.address2 || '',
        city: body.shippingAddress.city,
        postcode: body.shippingAddress.postcode,
        country: body.shippingAddress.country,
        state: body.shippingAddress.state || '',
      },
      line_items: lineItems,
      shipping_lines: [
        {
          method_id: 'flat_rate',
          method_title: 'Standard Versand',
          total: '0.00', // TODO: Versandkosten berechnen
        },
      ],
      customer_note: body.customerNote,
    };

    const order = await createWooCommerceOrder(orderData);

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderKey: order.order_key,
        status: order.status,
        total: order.total,
        paymentUrl: order.payment_url,
      },
    });

  } catch (error: any) {
    console.error('Order creation failed:', error);

    return NextResponse.json(
      {
        error: 'Bestellung konnte nicht erstellt werden',
        details: error.message
      },
      { status: 500 }
    );
  }
}

function getPaymentMethodTitle(methodId: string): string {
  const methods: Record<string, string> = {
    'paypal': 'PayPal',
    'stripe': 'Kreditkarte (Stripe)',
    'klarna': 'Klarna',
    'bacs': 'Überweisung',
    'cod': 'Nachnahme',
  };
  return methods[methodId] || methodId;
}
```

**Todo-Liste Phase 1.2:**
- [ ] Verzeichnis `src/app/api/checkout/` erstellen
- [ ] Route Handler `create-order/route.ts` implementieren
- [ ] Request-Body Validierung
- [ ] Line Items Konvertierung (CartItem → WooCommerce Format)
- [ ] Set-Angebot Meta-Daten korrekt übergeben
- [ ] Error-Handling & Logging
- [ ] Response-Format definieren

---

### Phase 2: Checkout-Formular Integration (Tag 3-4)

#### 2.1 Checkout-Context erweitern

**Datei:** `src/contexts/CheckoutContext.tsx` (erweitern)

```typescript
// Bestehende Datei erweitern
import { createContext, useContext, useState, ReactNode } from 'react';
import { useCart } from './CartContext';

interface CheckoutContextType {
  // ... bestehende Felder ...

  // Neu:
  isProcessing: boolean;
  error: string | null;
  orderId: number | null;
  submitOrder: () => Promise<void>;
}

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const { cartItems, clearCart, totalPrice } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);

  // ... bestehender State ...

  const submitOrder = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Validierung
      if (cartItems.length === 0) {
        throw new Error('Warenkorb ist leer');
      }

      if (!customerData.email) {
        throw new Error('E-Mail-Adresse fehlt');
      }

      // API Call
      const response = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems,
          customerData,
          shippingAddress,
          billingAddress,
          paymentMethod,
          customerNote,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Bestellung fehlgeschlagen');
      }

      const result = await response.json();

      if (result.success) {
        setOrderId(result.order.id);

        // Warenkorb leeren
        clearCart();

        // Zu Payment-URL weiterleiten (wenn vorhanden)
        if (result.order.paymentUrl) {
          window.location.href = result.order.paymentUrl;
        } else {
          // Oder zu Success-Page
          window.location.href = `/checkout/success?order=${result.order.id}`;
        }
      }

    } catch (err: any) {
      setError(err.message);
      console.error('Order submission failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <CheckoutContext.Provider value={{
      // ... bestehende values ...
      isProcessing,
      error,
      orderId,
      submitOrder,
    }}>
      {children}
    </CheckoutContext.Provider>
  );
}
```

**Todo-Liste Phase 2.1:**
- [ ] `isProcessing` State hinzufügen
- [ ] `error` State hinzufügen
- [ ] `submitOrder()` Funktion implementieren
- [ ] API Call zu `/api/checkout/create-order`
- [ ] Validierung vor Absenden
- [ ] Error-Handling
- [ ] Success-Handling (Redirect oder Success-Page)
- [ ] Warenkorb leeren nach erfolgreicher Bestellung

---

#### 2.2 Checkout-Page Submit-Button integrieren

**Datei:** `src/app/checkout/page.tsx` (anpassen)

```typescript
'use client';

import { useCheckout } from '@/contexts/CheckoutContext';
// ... imports ...

export default function CheckoutPage() {
  const { submitOrder, isProcessing, error } = useCheckout();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitOrder();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ... bestehender Content ... */}

      <form onSubmit={handleSubmit}>
        {/* ... Formular-Felder ... */}

        {/* Error-Anzeige */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full h-14 mt-6 text-base font-semibold text-white bg-[#ed1b24] rounded-lg hover:bg-[#d11920] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Bestellung wird verarbeitet...
            </span>
          ) : (
            'Kostenpflichtig bestellen'
          )}
        </button>
      </form>
    </div>
  );
}
```

**Todo-Liste Phase 2.2:**
- [ ] Checkout-Page zu `<form>` umbauen
- [ ] `handleSubmit` implementieren
- [ ] Submit-Button mit Loading-State
- [ ] Error-Anzeige hinzufügen
- [ ] Button disabled während Processing
- [ ] UX: Loading-Spinner

---

#### 2.3 Success-Page erstellen

**Datei:** `src/app/checkout/success/page.tsx` (neu)

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface OrderDetails {
  id: number;
  orderKey: string;
  status: string;
  total: string;
  dateCreated: string;
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    }
  }, [orderId]);

  const fetchOrderDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/checkout/order-status?id=${id}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      }
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <p>Lade Bestelldetails...</p>
    </div>;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-light)' }}>
      <div className="content-container py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          {/* Success Icon */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Vielen Dank für Ihre Bestellung!
            </h1>
            <p style={{ color: 'var(--color-text-dark)' }}>
              Ihre Bestellung wurde erfolgreich aufgegeben.
            </p>
          </div>

          {/* Order Details */}
          {order && (
            <div className="border-t border-b py-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>Bestellnummer</p>
                  <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>#{order.id}</p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>Gesamtbetrag</p>
                  <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>€{order.total}</p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>Status</p>
                  <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{order.status}</p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>Datum</p>
                  <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    {new Date(order.dateCreated).toLocaleDateString('de-DE')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
              Wie geht es weiter?
            </h2>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--color-text-dark)' }}>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Sie erhalten in Kürze eine Bestellbestätigung per E-Mail</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Wir bereiten Ihre Bestellung vor und informieren Sie über den Versand</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Bei Fragen erreichen Sie uns über unser Kontaktformular</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/"
              className="flex-1 text-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Zurück zur Startseite
            </Link>
            <Link
              href="/kontakt"
              className="flex-1 text-center px-6 py-3 border-2 hover:bg-gray-50 font-medium rounded-lg transition-colors"
              style={{
                borderColor: 'var(--color-primary)',
                color: 'var(--color-primary)'
              }}
            >
              Kontakt aufnehmen
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Todo-Liste Phase 2.3:**
- [ ] Success-Page erstellen (`/checkout/success`)
- [ ] Order-Details von API laden
- [ ] Success-Icon & Messaging
- [ ] Bestellübersicht anzeigen
- [ ] "Nächste Schritte" Info-Box
- [ ] Links zu Startseite & Kontakt

---

### Phase 3: Zahlungs-Gateway Integration (Tag 5-7)

#### 3.1 PayPal Integration

**Voraussetzungen:**
- PayPal Business Account
- PayPal REST API Credentials
- WooCommerce PayPal Plugin konfiguriert

**Implementierung:**

```typescript
// src/lib/payment/paypal.ts (neu erstellen)

interface PayPalCreateOrderResponse {
  id: string;
  status: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

export async function createPayPalOrder(
  amount: string,
  currency: string = 'EUR'
): Promise<PayPalCreateOrderResponse> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const mode = process.env.PAYPAL_MODE || 'sandbox'; // sandbox oder live

  const baseUrl = mode === 'sandbox'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';

  // 1. Access Token holen
  const authResponse = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
    },
    body: 'grant_type=client_credentials',
  });

  const { access_token } = await authResponse.json();

  // 2. Order erstellen
  const orderResponse = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: amount,
        },
      }],
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,
      },
    }),
  });

  return orderResponse.json();
}
```

**Todo-Liste Phase 3.1:**
- [ ] PayPal Business Account einrichten
- [ ] PayPal REST API Credentials (Client ID + Secret)
- [ ] Environment Variables hinzufügen:
  - `PAYPAL_CLIENT_ID`
  - `PAYPAL_CLIENT_SECRET`
  - `PAYPAL_MODE` (sandbox/live)
- [ ] PayPal SDK implementieren
- [ ] WooCommerce PayPal Plugin konfigurieren
- [ ] Test-Zahlungen im Sandbox-Mode

---

#### 3.2 Stripe Integration

**Voraussetzungen:**
- Stripe Account
- Stripe API Keys
- WooCommerce Stripe Plugin

**Implementierung:**

```bash
npm install stripe @stripe/stripe-js
```

```typescript
// src/lib/payment/stripe.ts (neu erstellen)
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function createStripePaymentIntent(
  amount: number, // in cents
  currency: string = 'eur',
  metadata: Record<string, string>
): Promise<Stripe.PaymentIntent> {
  return await stripe.paymentIntents.create({
    amount,
    currency,
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  });
}

export async function getStripePaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  return await stripe.paymentIntents.retrieve(paymentIntentId);
}
```

**Todo-Liste Phase 3.2:**
- [ ] Stripe Account einrichten
- [ ] Stripe API Keys (Publishable + Secret)
- [ ] Environment Variables:
  - `STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_SECRET_KEY`
- [ ] Stripe SDK implementieren
- [ ] Stripe Checkout Session erstellen
- [ ] WooCommerce Stripe Plugin konfigurieren
- [ ] Webhook für Payment Success
- [ ] Test-Zahlungen

---

#### 3.3 Weitere Payment Methods

**Klarna:**
- WooCommerce Klarna Plugin
- Klarna Merchant Portal Zugang
- API Integration

**Vorkasse / Überweisung:**
- Einfachste Methode
- Keine API-Integration nötig
- WooCommerce Standard-Feature
- Order Status: "on-hold" bis Zahlung eingegangen

**Rechnung:**
- Nur für B2B oder Bestandskunden
- Manuelle Freigabe erforderlich
- WooCommerce Standard-Feature

**Todo-Liste Phase 3.3:**
- [ ] Klarna Plugin installieren & konfigurieren
- [ ] Vorkasse/Überweisung aktivieren
- [ ] Rechnung für ausgewählte Kunden
- [ ] Payment-Method-Logos hinzufügen
- [ ] Payment-Beschreibungen für Kunden

---

### Phase 4: Order-Management & E-Mails (Tag 8-9)

#### 4.1 WooCommerce E-Mail Templates

WooCommerce sendet automatisch E-Mails bei:
- **Neue Bestellung** (Admin)
- **Bestellbestätigung** (Kunde)
- **Order Processing** (Kunde)
- **Order Completed** (Kunde)
- **Rechnung** (Kunde)

**Anpassung:**
1. WordPress-Backend: WooCommerce → Settings → Emails
2. Templates anpassen (optional):
   - Pfad: `wp-content/themes/dein-theme/woocommerce/emails/`
   - Kopiere: `wp-content/plugins/woocommerce/templates/emails/`

**Todo-Liste Phase 4.1:**
- [ ] E-Mail Templates im Backend prüfen
- [ ] Absender-Name & E-Mail konfigurieren
- [ ] E-Mail-Header mit Logo
- [ ] Test-E-Mails versenden
- [ ] Rechtliche Pflichtangaben (Impressum, Widerruf)
- [ ] SMTP-Konfiguration (z.B. SendGrid, Mailgun)

---

#### 4.2 Order-Tracking für Kunden

**Datei:** `src/app/order-tracking/page.tsx` (neu)

```typescript
'use client';

import { useState } from 'react';

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `/api/checkout/order-tracking?orderId=${orderId}&email=${email}`
      );

      if (!response.ok) {
        throw new Error('Bestellung nicht gefunden');
      }

      const data = await response.json();
      setOrderDetails(data.order);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-light)' }}>
      <div className="content-container py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
            Bestellung verfolgen
          </h1>

          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                  Bestellnummer
                </label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="z.B. 12345"
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                  E-Mail-Adresse
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ihre@email.de"
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                {loading ? 'Suche...' : 'Bestellung suchen'}
              </button>
            </form>
          </div>

          {/* Order Details anzeigen */}
          {orderDetails && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                Bestellung #{orderDetails.id}
              </h2>
              {/* ... Order Details ... */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

**Todo-Liste Phase 4.2:**
- [ ] Order-Tracking Page erstellen
- [ ] API Route für Order-Lookup
- [ ] Validierung (Order ID + E-Mail)
- [ ] Order-Details anzeigen
- [ ] Order-Status Timeline
- [ ] Tracking-Nummer (falls vorhanden)

---

### Phase 5: Testing (Tag 10-12)

#### 5.1 Test-Checkliste

**Warenkorb Tests:**
- [ ] Produkt in Warenkorb legen
- [ ] Set-Angebot in Warenkorb legen
- [ ] Mengen ändern
- [ ] Produkte entfernen
- [ ] Warenkorb leeren
- [ ] Preise korrekt berechnet

**Checkout Tests:**
- [ ] Alle Formular-Felder ausfüllen
- [ ] Validierung funktioniert
- [ ] Lieferadresse = Rechnungsadresse
- [ ] Verschiedene Lieferadresse
- [ ] Jede Zahlungsmethode testen
- [ ] Error-Handling bei API-Fehler

**Payment Tests:**
- [ ] PayPal Sandbox-Zahlung
- [ ] Stripe Test-Zahlung
- [ ] Vorkasse-Order
- [ ] Zahlung abbrechen
- [ ] Zahlung fehlschlägt

**Order Tests:**
- [ ] Order wird in WooCommerce erstellt
- [ ] Line Items korrekt
- [ ] Set-Angebot Meta-Daten gespeichert
- [ ] Preise stimmen überein
- [ ] E-Mails werden versendet
- [ ] Order-Status korrekt

**E2E Tests (Playwright/Cypress):**
```typescript
// e2e/checkout.spec.ts
test('complete checkout flow', async ({ page }) => {
  // 1. Produkt in Warenkorb
  await page.goto('/products/rigid-vinyl-egmont');
  await page.click('[data-testid="add-to-cart"]');

  // 2. Zu Checkout
  await page.goto('/checkout');

  // 3. Formular ausfüllen
  await page.fill('#email', 'test@example.com');
  await page.fill('#firstName', 'Max');
  await page.fill('#lastName', 'Mustermann');
  // ... weitere Felder ...

  // 4. Submit
  await page.click('[type="submit"]');

  // 5. Success-Page
  await expect(page).toHaveURL(/\/checkout\/success/);
  await expect(page.locator('h1')).toContainText('Vielen Dank');
});
```

**Todo-Liste Phase 5.1:**
- [ ] Playwright oder Cypress Setup
- [ ] Unit Tests für API Routes
- [ ] Integration Tests für Order-Erstellung
- [ ] E2E Test für kompletten Checkout
- [ ] Performance-Tests (Lighthouse)
- [ ] Security-Tests (OWASP)

---

## 🔒 Sicherheit

### Wichtige Sicherheitsmaßnahmen:

**1. API-Credentials absichern:**
```env
# .env.local (NICHT in Git!)
WC_CONSUMER_KEY=ck_...
WC_CONSUMER_SECRET=cs_...
STRIPE_SECRET_KEY=sk_...
PAYPAL_CLIENT_SECRET=...
```

**2. Server-Side API-Calls:**
- API-Credentials NIEMALS im Frontend
- Alle Payment-API-Calls über Next.js API Routes
- WooCommerce API-Calls nur Server-Side

**3. Input-Validierung:**
- Alle User-Inputs validieren (Client & Server)
- SQL-Injection-Schutz
- XSS-Protection

**4. HTTPS:**
- Alle Payment-Seiten über HTTPS
- SSL-Zertifikat (Let's Encrypt oder Cloudflare)

**5. GDPR / Datenschutz:**
- Datenschutzerklärung aktualisieren
- Cookie-Consent für Payment-Tracking
- Kundendaten verschlüsselt speichern

**Todo-Liste Sicherheit:**
- [ ] .env.local korrekt konfiguriert
- [ ] .gitignore prüfen (keine Secrets in Git)
- [ ] HTTPS auf Production-Server
- [ ] Input-Validierung überall
- [ ] Rate-Limiting für API Routes
- [ ] CORS-Headers konfigurieren
- [ ] Security-Headers (CSP, HSTS, etc.)

---

## 📦 Deployment-Checklist

### Vor dem Go-Live:

**1. Environment Variables auf Vercel:**
```bash
# Vercel Dashboard → Settings → Environment Variables
NEXT_PUBLIC_WORDPRESS_URL=https://plan-dein-ding.de
WC_CONSUMER_KEY=ck_live_...
WC_CONSUMER_SECRET=cs_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_MODE=live
NEXT_PUBLIC_SITE_URL=https://bodenjaeger.vercel.app
```

**2. WooCommerce Backend:**
- [ ] Payment-Gateways auf LIVE-Mode umstellen
- [ ] E-Mail-Templates finalisiert
- [ ] Versandkosten konfiguriert
- [ ] Steuersätze korrekt
- [ ] Rechtliche Seiten (AGB, Widerruf, Datenschutz)

**3. Testing:**
- [ ] Kompletter Checkout-Flow auf Production
- [ ] Test-Bestellung mit echtem Payment (klein)
- [ ] E-Mails kommen an
- [ ] Order erscheint in WooCommerce
- [ ] Inventory wird reduziert

**4. Monitoring:**
- [ ] Sentry oder Bugsnag für Error-Tracking
- [ ] Google Analytics für Conversions
- [ ] Uptime-Monitoring (UptimeRobot)
- [ ] Payment-Erfolgsrate tracken

---

## 📊 Zeitplan & Aufwandsschätzung

| Phase | Aufgaben | Aufwand | Tage |
|-------|----------|---------|------|
| **Phase 1** | API Integration Setup | 16-20h | 2-3 |
| **Phase 2** | Checkout-Formular Integration | 16-24h | 2-3 |
| **Phase 3** | Zahlungs-Gateway Integration | 24-32h | 3-4 |
| **Phase 4** | Order-Management & E-Mails | 16-20h | 2-3 |
| **Phase 5** | Testing & QA | 16-24h | 2-3 |
| **Buffer** | Bugfixes & Optimierungen | 8-16h | 1-2 |
| **GESAMT** | | **96-136h** | **12-18 Tage** |

---

## 🎯 Priorisierung

### Must-Have (MVP):
1. ✅ Order-Erstellung über WooCommerce API
2. ✅ Mindestens eine Zahlungsmethode (Vorkasse)
3. ✅ E-Mail-Bestätigung
4. ✅ Success-Page

### Should-Have:
1. PayPal Integration
2. Stripe Integration
3. Order-Tracking
4. Versandkosten-Berechnung

### Nice-to-Have:
1. Klarna Integration
2. Express-Checkout (Apple Pay, Google Pay)
3. Gutschein-Codes
4. Customer-Accounts

---

## 📚 Ressourcen & Dokumentation

### WooCommerce REST API:
- **Docs:** https://woocommerce.github.io/woocommerce-rest-api-docs/
- **Orders:** https://woocommerce.github.io/woocommerce-rest-api-docs/#orders
- **Authentication:** https://woocommerce.github.io/woocommerce-rest-api-docs/#authentication

### Payment-Gateways:
- **PayPal:** https://developer.paypal.com/docs/api/overview/
- **Stripe:** https://stripe.com/docs/api
- **Klarna:** https://docs.klarna.com/

### Next.js:
- **API Routes:** https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- **Server Actions:** https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions

---

## ✅ Abnahme-Kriterien

Die Checkout-Integration ist fertig, wenn:

1. ✅ Kunde kann Set-Angebote & Einzelprodukte in Warenkorb legen
2. ✅ Checkout-Formular ist vollständig ausgefüllt validiert
3. ✅ Order wird erfolgreich in WooCommerce erstellt
4. ✅ Mindestens eine Zahlungsmethode funktioniert (Live-Test)
5. ✅ Kunde erhält E-Mail-Bestätigung
6. ✅ Admin erhält Benachrichtigung
7. ✅ Order erscheint im WooCommerce-Backend
8. ✅ Inventory wird korrekt reduziert
9. ✅ Success-Page wird angezeigt
10. ✅ Warenkorb wird nach Bestellung geleert

---

**Letzte Aktualisierung:** 12. Januar 2026
**Verantwortlich:** Entwickler-Team
**Review:** Vor Implementierung mit Product Owner abstimmen
