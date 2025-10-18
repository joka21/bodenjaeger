'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  CheckoutStep,
  CheckoutFormData,
  CheckoutValidationErrors,
  CheckoutContextType,
  ShippingMethod,
  PaymentMethod,
  ShippingAddress,
  BillingAddress,
} from '@/types/checkout';
import { useCart } from './CartContext';

const CHECKOUT_STORAGE_KEY = 'bodenjager_checkout_data';

const initialFormData: CheckoutFormData = {
  email: '',
  shippingAddress: {
    firstName: '',
    lastName: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postcode: '',
    country: 'DE', // Default to Germany
    phone: '',
  },
  billingAddressSameAsShipping: true,
  acceptTerms: false,
  acceptPrivacy: false,
  newsletter: false,
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('contact');
  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData);
  const [validationErrors, setValidationErrors] = useState<CheckoutValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [availableShippingMethods, setAvailableShippingMethods] = useState<ShippingMethod[]>([]);
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState<PaymentMethod[]>([]);

  const { clearCart } = useCart();

  // Load checkout data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(CHECKOUT_STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
      } catch (error) {
        console.error('Failed to load checkout data from localStorage:', error);
      }
    }
  }, []);

  // Save checkout data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const updateFormData = (data: Partial<CheckoutFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  // Validation Functions
  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'E-Mail-Adresse ist erforderlich';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Ungültige E-Mail-Adresse';
    return undefined;
  };

  const validateShippingAddress = (address: ShippingAddress): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!address.firstName || address.firstName.length < 2) {
      errors.firstName = 'Vorname muss mindestens 2 Zeichen lang sein';
    }
    if (!address.lastName || address.lastName.length < 2) {
      errors.lastName = 'Nachname muss mindestens 2 Zeichen lang sein';
    }
    if (!address.address1) {
      errors.address1 = 'Straße und Hausnummer sind erforderlich';
    }
    if (!address.city) {
      errors.city = 'Stadt ist erforderlich';
    }
    if (!address.postcode) {
      errors.postcode = 'Postleitzahl ist erforderlich';
    } else if (address.country === 'DE' && !/^\d{5}$/.test(address.postcode)) {
      errors.postcode = 'Ungültige deutsche Postleitzahl (5 Ziffern)';
    }
    if (!address.country) {
      errors.country = 'Land ist erforderlich';
    }
    if (address.phone && !/^[+\d\s\-()]+$/.test(address.phone)) {
      errors.phone = 'Ungültige Telefonnummer';
    }

    return errors;
  };

  const validateBillingAddress = (address: BillingAddress): Record<string, string> => {
    const errors = validateShippingAddress(address);
    const emailError = validateEmail(address.email);
    if (emailError) {
      errors.email = emailError;
    }
    return errors;
  };

  const validateStep = (step: CheckoutStep): boolean => {
    const errors: CheckoutValidationErrors = {};

    switch (step) {
      case 'contact':
        // Validate email
        const emailError = validateEmail(formData.email);
        if (emailError) {
          errors.email = emailError;
        }

        // Validate shipping address
        const shippingErrors = validateShippingAddress(formData.shippingAddress);
        if (Object.keys(shippingErrors).length > 0) {
          errors.shippingAddress = shippingErrors;
        }

        // Validate shipping method selected
        if (!formData.selectedShippingMethod) {
          errors.selectedShippingMethod = 'Bitte wählen Sie eine Versandmethode';
        }
        break;

      case 'payment':
        // Validate payment method selected
        if (!formData.selectedPaymentMethod) {
          errors.selectedPaymentMethod = 'Bitte wählen Sie eine Zahlungsmethode';
        }

        // Validate billing address if different from shipping
        if (!formData.billingAddressSameAsShipping && formData.billingAddress) {
          const billingErrors = validateBillingAddress(formData.billingAddress);
          if (Object.keys(billingErrors).length > 0) {
            errors.billingAddress = billingErrors;
          }
        }
        break;

      case 'review':
        // Validate terms and privacy acceptance
        if (!formData.acceptTerms) {
          errors.acceptTerms = 'Sie müssen die AGB akzeptieren';
        }
        if (!formData.acceptPrivacy) {
          errors.acceptPrivacy = 'Sie müssen die Datenschutzerklärung akzeptieren';
        }
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      const steps: CheckoutStep[] = ['contact', 'payment', 'review'];
      const currentIndex = steps.indexOf(currentStep);
      if (currentIndex < steps.length - 1) {
        setCurrentStep(steps[currentIndex + 1]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const previousStep = () => {
    const steps: CheckoutStep[] = ['contact', 'payment', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const fetchShippingMethods = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://plan-dein-ding.de/wp-json/wc/store/v1/shipping/methods', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch shipping methods');
      }

      const data = await response.json();

      // Transform WooCommerce response to our ShippingMethod format
      const methods: ShippingMethod[] = data.map((method: any) => ({
        id: method.rate_id || method.id,
        title: method.name || method.title,
        cost: method.price || '0',
        description: method.description || '',
        methodId: method.method_id || method.id,
        methodTitle: method.name || method.title,
      }));

      setAvailableShippingMethods(methods);
    } catch (error) {
      console.error('Error fetching shipping methods:', error);
      // Set fallback shipping methods
      setAvailableShippingMethods([
        {
          id: 'flat_rate',
          title: 'Standardversand',
          cost: '4.90',
          description: 'Lieferung in 3-5 Werktagen',
          methodId: 'flat_rate',
          methodTitle: 'Standardversand',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://plan-dein-ding.de/wp-json/wc/store/v1/payment-methods', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
      }

      const data = await response.json();

      // Transform WooCommerce response to our PaymentMethod format
      const methods: PaymentMethod[] = data
        .filter((method: any) => method.enabled)
        .map((method: any) => ({
          id: method.id,
          title: method.title,
          description: method.description || '',
          enabled: method.enabled,
        }));

      setAvailablePaymentMethods(methods);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      // Set fallback payment methods
      setAvailablePaymentMethods([
        {
          id: 'bacs',
          title: 'Banküberweisung',
          description: 'Zahlung per Überweisung',
          enabled: true,
        },
        {
          id: 'cod',
          title: 'Nachnahme',
          description: 'Zahlung bei Lieferung',
          enabled: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const submitOrder = async (): Promise<{ success: boolean; orderId?: number; error?: string }> => {
    // Validate all steps before submitting
    if (!validateStep('contact') || !validateStep('payment') || !validateStep('review')) {
      return { success: false, error: 'Bitte füllen Sie alle erforderlichen Felder aus' };
    }

    setIsLoading(true);

    try {
      // Prepare billing address
      const billingAddress = formData.billingAddressSameAsShipping
        ? { ...formData.shippingAddress, email: formData.email }
        : formData.billingAddress!;

      const checkoutData = {
        billing_address: {
          first_name: billingAddress.firstName,
          last_name: billingAddress.lastName,
          company: billingAddress.company || '',
          address_1: billingAddress.address1,
          address_2: billingAddress.address2 || '',
          city: billingAddress.city,
          state: billingAddress.state || '',
          postcode: billingAddress.postcode,
          country: billingAddress.country,
          email: formData.email,
          phone: billingAddress.phone || '',
        },
        shipping_address: {
          first_name: formData.shippingAddress.firstName,
          last_name: formData.shippingAddress.lastName,
          company: formData.shippingAddress.company || '',
          address_1: formData.shippingAddress.address1,
          address_2: formData.shippingAddress.address2 || '',
          city: formData.shippingAddress.city,
          state: formData.shippingAddress.state || '',
          postcode: formData.shippingAddress.postcode,
          country: formData.shippingAddress.country,
        },
        payment_method: formData.selectedPaymentMethod!.id,
        shipping_method: [formData.selectedShippingMethod!.id],
      };

      const response = await fetch('https://plan-dein-ding.de/wp-json/wc/store/v1/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Bestellung konnte nicht abgeschlossen werden');
      }

      const data = await response.json();

      // Clear cart and checkout data on success
      clearCart();
      resetCheckout();

      return { success: true, orderId: data.order_id };
    } catch (error) {
      console.error('Error submitting order:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const resetCheckout = () => {
    setFormData(initialFormData);
    setCurrentStep('contact');
    setValidationErrors({});
    localStorage.removeItem(CHECKOUT_STORAGE_KEY);
  };

  const value: CheckoutContextType = {
    currentStep,
    formData,
    validationErrors,
    isLoading,
    availableShippingMethods,
    availablePaymentMethods,
    setCurrentStep,
    updateFormData,
    setValidationErrors,
    validateStep,
    nextStep,
    previousStep,
    resetCheckout,
    fetchShippingMethods,
    fetchPaymentMethods,
    submitOrder,
  };

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}
