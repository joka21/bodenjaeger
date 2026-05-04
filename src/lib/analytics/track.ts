import type { StoreApiProduct } from '@/lib/woocommerce';
import { mapProductToItem } from './mapItem';
import type {
  ConsentCategories,
  EcommercePayload,
  GA4Item,
  PaymentType,
} from './types';

const isBrowser = (): boolean => typeof window !== 'undefined';

function ensureDataLayer(): Record<string, unknown>[] | null {
  if (!isBrowser()) return null;
  if (!Array.isArray(window.dataLayer)) {
    window.dataLayer = [];
  }
  return window.dataLayer;
}

function pushEcommerce(event: string, ecommerce: EcommercePayload): void {
  const dl = ensureDataLayer();
  if (!dl) return;
  // GA4-Best-Practice: ecommerce-Objekt zwischen Events resetten,
  // sonst „klebt" das letzte Payload an späteren Events.
  dl.push({ ecommerce: null });
  dl.push({ event, ecommerce });
}

function gtagPush(...args: unknown[]): void {
  const dl = ensureDataLayer();
  if (!dl) return;
  // Klassische gtag-Signatur: pusht das `arguments`-Objekt; GTM/Consent-Mode-API erwartet genau das.
  dl.push(args as unknown as Record<string, unknown>);
}

export const track = {
  pageView(url: string, title: string): void {
    const dl = ensureDataLayer();
    if (!dl) return;
    dl.push({
      event: 'page_view',
      page_location: url,
      page_path: typeof window !== 'undefined' ? window.location.pathname : '',
      page_title: title,
    });
  },

  viewItem(product: StoreApiProduct, quantity: number = 1): void {
    if (!isBrowser()) return;
    const item = mapProductToItem(product, quantity);
    pushEcommerce('view_item', {
      value: item.price * item.quantity,
      currency: 'EUR',
      items: [item],
    });
  },

  addToCart(items: GA4Item[], totalValue: number): void {
    if (!isBrowser() || items.length === 0) return;
    pushEcommerce('add_to_cart', {
      value: Number(totalValue),
      currency: 'EUR',
      items,
    });
  },

  viewCart(items: GA4Item[], totalValue: number): void {
    if (!isBrowser() || items.length === 0) return;
    pushEcommerce('view_cart', {
      value: Number(totalValue),
      currency: 'EUR',
      items,
    });
  },

  removeFromCart(items: GA4Item[], totalValue?: number): void {
    if (!isBrowser() || items.length === 0) return;
    const value =
      typeof totalValue === 'number'
        ? totalValue
        : items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    pushEcommerce('remove_from_cart', {
      value: Number(value),
      currency: 'EUR',
      items,
    });
  },

  beginCheckout(items: GA4Item[], totalValue: number): void {
    if (!isBrowser() || items.length === 0) return;
    pushEcommerce('begin_checkout', {
      value: Number(totalValue),
      currency: 'EUR',
      items,
    });
  },

  addPaymentInfo(items: GA4Item[], totalValue: number, paymentType: PaymentType): void {
    if (!isBrowser() || items.length === 0) return;
    pushEcommerce('add_payment_info', {
      value: Number(totalValue),
      currency: 'EUR',
      payment_type: paymentType,
      items,
    });
  },

  purchase(args: {
    orderId: number;
    items: GA4Item[];
    value: number;
    currency: 'EUR';
    paymentType: PaymentType;
    shipping?: number;
    tax?: number;
  }): void {
    if (!isBrowser()) return;
    const payload: EcommercePayload = {
      transaction_id: Number(args.orderId),
      value: Number(args.value),
      currency: args.currency,
      payment_type: args.paymentType,
      items: args.items,
    };
    if (typeof args.shipping === 'number') payload.shipping = Number(args.shipping);
    if (typeof args.tax === 'number') payload.tax = Number(args.tax);
    pushEcommerce('purchase', payload);
  },
};

// Consent Mode v2
// Wir pushen direkt im gtag-Stil ins dataLayer (kein gtag()-Wrapper nötig),
// damit das funktioniert, bevor der GTM-Container geladen ist.

const DEFAULT_DENIED = {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'denied',
  personalization_storage: 'denied',
  security_storage: 'granted',
  wait_for_update: 500,
} as const;

export const consent = {
  setDefault(): void {
    if (!isBrowser()) return;
    gtagPush('consent', 'default', DEFAULT_DENIED);
  },

  update(c: ConsentCategories): void {
    if (!isBrowser()) return;
    gtagPush('consent', 'update', {
      analytics_storage: c.analytics ? 'granted' : 'denied',
      ad_storage: c.marketing ? 'granted' : 'denied',
      ad_user_data: c.marketing ? 'granted' : 'denied',
      ad_personalization: c.marketing ? 'granted' : 'denied',
      functionality_storage: c.functional ? 'granted' : 'denied',
      personalization_storage: c.functional ? 'granted' : 'denied',
      security_storage: 'granted',
    });
  },
};
