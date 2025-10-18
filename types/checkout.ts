// Checkout TypeScript Types for Bodenjäger E-Commerce

export type CheckoutStep = 'contact' | 'payment' | 'review';

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  postcode: string;
  country: string;
  phone?: string;
}

export interface BillingAddress extends ShippingAddress {
  email: string;
}

export interface ShippingMethod {
  id: string;
  title: string;
  cost: string;
  description?: string;
  methodId: string;
  methodTitle: string;
}

export interface PaymentMethod {
  id: string;
  title: string;
  description?: string;
  enabled: boolean;
}

export interface CheckoutFormData {
  // Contact & Shipping (Step 1)
  email: string;
  shippingAddress: ShippingAddress;
  selectedShippingMethod?: ShippingMethod;

  // Payment (Step 2)
  selectedPaymentMethod?: PaymentMethod;
  billingAddressSameAsShipping: boolean;
  billingAddress?: BillingAddress;

  // Review (Step 3)
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  newsletter?: boolean;
}

export interface CheckoutValidationErrors {
  email?: string;
  shippingAddress?: {
    firstName?: string;
    lastName?: string;
    address1?: string;
    city?: string;
    postcode?: string;
    country?: string;
    phone?: string;
  };
  billingAddress?: {
    firstName?: string;
    lastName?: string;
    address1?: string;
    city?: string;
    postcode?: string;
    country?: string;
  };
  selectedShippingMethod?: string;
  selectedPaymentMethod?: string;
  acceptTerms?: string;
  acceptPrivacy?: string;
}

export interface CheckoutContextType {
  // State
  currentStep: CheckoutStep;
  formData: CheckoutFormData;
  validationErrors: CheckoutValidationErrors;
  isLoading: boolean;

  // Available Options
  availableShippingMethods: ShippingMethod[];
  availablePaymentMethods: PaymentMethod[];

  // Actions
  setCurrentStep: (step: CheckoutStep) => void;
  updateFormData: (data: Partial<CheckoutFormData>) => void;
  setValidationErrors: (errors: CheckoutValidationErrors) => void;
  validateStep: (step: CheckoutStep) => boolean;
  nextStep: () => void;
  previousStep: () => void;
  resetCheckout: () => void;

  // API Actions
  fetchShippingMethods: () => Promise<void>;
  fetchPaymentMethods: () => Promise<void>;
  submitOrder: () => Promise<{ success: boolean; orderId?: number; error?: string }>;
}

// WooCommerce API Types
export interface WooCommerceCheckoutRequest {
  billing_address: {
    first_name: string;
    last_name: string;
    company?: string;
    address_1: string;
    address_2?: string;
    city: string;
    state?: string;
    postcode: string;
    country: string;
    email: string;
    phone?: string;
  };
  shipping_address: {
    first_name: string;
    last_name: string;
    company?: string;
    address_1: string;
    address_2?: string;
    city: string;
    state?: string;
    postcode: string;
    country: string;
  };
  payment_method: string;
  shipping_method: string[];
  customer_note?: string;
}

export interface WooCommerceCheckoutResponse {
  order_id: number;
  status: string;
  order_key: string;
  customer_id: number;
  billing_address: BillingAddress;
  shipping_address: ShippingAddress;
  payment_method: string;
  payment_result: {
    payment_status: string;
    payment_details: any[];
    redirect_url: string;
  };
}

export interface WooCommerceShippingMethodResponse {
  rate_id: string;
  name: string;
  description: string;
  delivery_time: string;
  price: string;
  taxes: string;
  instance_id: number;
  method_id: string;
  meta_data: any[];
}

export interface WooCommercePaymentMethodResponse {
  id: string;
  title: string;
  description: string;
  order: number;
  enabled: boolean;
  method_title: string;
  method_description: string;
  method_supports: string[];
  settings: any;
}
