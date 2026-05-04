// GA4 / GTM Event-Typen für Bodenjäger.
// Schema folgt GA4-Standard mit `ecommerce`-Wrapper (siehe GTM_REFERENZ.md Abschnitt 5).

export interface GA4Item {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
  item_category?: string;
  item_brand?: string;
  item_variant?: string;
}

export interface EcommercePayload {
  transaction_id?: string | number;
  value: number;
  currency: 'EUR';
  coupon?: string;
  shipping?: number;
  tax?: number;
  payment_type?: string;
  items: GA4Item[];
}

export type PaymentType = 'stripe' | 'paypal' | 'bacs';

export interface ConsentCategories {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

// Im Checkout vor der Order-Erstellung in localStorage gepuffert,
// damit die Success-Page das `purchase`-Event ohne API-Refetch feuern kann.
export interface PurchaseTrackingPayload {
  items: GA4Item[];
  value: number;
  currency: 'EUR';
  paymentType: PaymentType;
  shipping?: number;
  tax?: number;
}

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: unknown[]) => void;
  }
}
