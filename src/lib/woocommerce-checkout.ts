// WooCommerce Checkout API Helper Functions

import {
  WooCommerceCheckoutRequest,
  WooCommerceCheckoutResponse,
  WooCommerceShippingMethodResponse,
  WooCommercePaymentMethodResponse,
  ShippingMethod,
  PaymentMethod,
} from '@/types/checkout';

const WC_API_BASE_URL = 'https://plan-dein-ding.de/wp-json/wc/store/v1';

/**
 * Fetch available shipping methods from WooCommerce
 */
export async function fetchShippingMethods(): Promise<ShippingMethod[]> {
  try {
    const response = await fetch(`${WC_API_BASE_URL}/shipping/methods`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch shipping methods: ${response.status}`);
    }

    const data: WooCommerceShippingMethodResponse[] = await response.json();

    // Transform WooCommerce response to our ShippingMethod format
    return data.map((method) => ({
      id: method.rate_id || method.method_id,
      title: method.name,
      cost: method.price || '0',
      description: method.description || method.delivery_time || '',
      methodId: method.method_id,
      methodTitle: method.name,
    }));
  } catch (error) {
    console.error('Error fetching shipping methods:', error);

    // Return fallback shipping methods
    return [
      {
        id: 'flat_rate',
        title: 'Standardversand',
        cost: '4.90',
        description: 'Lieferung in 3-5 Werktagen',
        methodId: 'flat_rate',
        methodTitle: 'Standardversand',
      },
      {
        id: 'free_shipping',
        title: 'Kostenloser Versand',
        cost: '0',
        description: 'Ab 100€ Bestellwert',
        methodId: 'free_shipping',
        methodTitle: 'Kostenloser Versand',
      },
    ];
  }
}

/**
 * Fetch available payment methods from WooCommerce
 */
export async function fetchPaymentMethods(): Promise<PaymentMethod[]> {
  try {
    const response = await fetch(`${WC_API_BASE_URL}/payment-methods`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch payment methods: ${response.status}`);
    }

    const data: WooCommercePaymentMethodResponse[] = await response.json();

    // Filter and transform WooCommerce response to our PaymentMethod format
    return data
      .filter((method) => method.enabled)
      .map((method) => ({
        id: method.id,
        title: method.title,
        description: method.description || '',
        enabled: method.enabled,
      }));
  } catch (error) {
    console.error('Error fetching payment methods:', error);

    // Return fallback payment methods
    return [
      {
        id: 'bacs',
        title: 'Banküberweisung',
        description: 'Zahlung per Überweisung auf unser Bankkonto.',
        enabled: true,
      },
      {
        id: 'cod',
        title: 'Nachnahme',
        description: 'Zahlung bei Lieferung.',
        enabled: true,
      },
      {
        id: 'cheque',
        title: 'Rechnung',
        description: 'Zahlung per Rechnung.',
        enabled: true,
      },
    ];
  }
}

/**
 * Submit checkout order to WooCommerce
 */
export async function submitCheckoutOrder(
  checkoutData: WooCommerceCheckoutRequest
): Promise<WooCommerceCheckoutResponse> {
  try {
    const response = await fetch(`${WC_API_BASE_URL}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkoutData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit checkout order');
    }

    const data: WooCommerceCheckoutResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting checkout order:', error);
    throw error;
  }
}

/**
 * Validate checkout data before submission
 */
export function validateCheckoutData(data: WooCommerceCheckoutRequest): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate billing address
  if (!data.billing_address.first_name) {
    errors.push('Billing first name is required');
  }
  if (!data.billing_address.last_name) {
    errors.push('Billing last name is required');
  }
  if (!data.billing_address.email) {
    errors.push('Email is required');
  }
  if (!data.billing_address.address_1) {
    errors.push('Billing address is required');
  }
  if (!data.billing_address.city) {
    errors.push('Billing city is required');
  }
  if (!data.billing_address.postcode) {
    errors.push('Billing postcode is required');
  }
  if (!data.billing_address.country) {
    errors.push('Billing country is required');
  }

  // Validate shipping address
  if (!data.shipping_address.first_name) {
    errors.push('Shipping first name is required');
  }
  if (!data.shipping_address.last_name) {
    errors.push('Shipping last name is required');
  }
  if (!data.shipping_address.address_1) {
    errors.push('Shipping address is required');
  }
  if (!data.shipping_address.city) {
    errors.push('Shipping city is required');
  }
  if (!data.shipping_address.postcode) {
    errors.push('Shipping postcode is required');
  }
  if (!data.shipping_address.country) {
    errors.push('Shipping country is required');
  }

  // Validate payment method
  if (!data.payment_method) {
    errors.push('Payment method is required');
  }

  // Validate shipping method
  if (!data.shipping_method || data.shipping_method.length === 0) {
    errors.push('Shipping method is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Format price for display (add € symbol)
 */
export function formatPrice(price: string | number): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return `${numPrice.toFixed(2)} €`;
}

/**
 * Calculate tax amount from subtotal
 */
export function calculateTax(subtotal: number, taxRate: number = 0.19): number {
  return subtotal * taxRate;
}

/**
 * Calculate total including shipping
 */
export function calculateTotal(subtotal: number, shippingCost: number): number {
  return subtotal + shippingCost;
}
