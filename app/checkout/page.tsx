'use client';

import React from 'react';
import { CheckoutProvider, useCheckout } from '@/contexts/CheckoutContext';
import CheckoutLayout from '@/components/checkout/CheckoutLayout';
import ContactStep from '@/components/checkout/ContactStep';
import PaymentStep from '@/components/checkout/PaymentStep';
import ReviewStep from '@/components/checkout/ReviewStep';

function CheckoutContent() {
  const { currentStep } = useCheckout();

  const renderStep = () => {
    switch (currentStep) {
      case 'contact':
        return <ContactStep />;
      case 'payment':
        return <PaymentStep />;
      case 'review':
        return <ReviewStep />;
      default:
        return <ContactStep />;
    }
  };

  return <CheckoutLayout>{renderStep()}</CheckoutLayout>;
}

export default function CheckoutPage() {
  return (
    <CheckoutProvider>
      <CheckoutContent />
    </CheckoutProvider>
  );
}
