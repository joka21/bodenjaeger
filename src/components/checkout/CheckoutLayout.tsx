'use client';

import React from 'react';
import Link from 'next/link';
import ProgressIndicator from './ProgressIndicator';
import OrderSummary from './OrderSummary';
import { useCheckout } from '@/contexts/CheckoutContext';

interface CheckoutLayoutProps {
  children: React.ReactNode;
}

export default function CheckoutLayout({ children }: CheckoutLayoutProps) {
  const { currentStep } = useCheckout();

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white overflow-hidden">
        <div className="container mx-auto px-4 py-6 max-w-full">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="font-bold text-2xl text-[#2e2d32]">Bodenjäger</div>
            </Link>

            {/* Secure Checkout Badge */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <svg
                className="w-5 h-5 text-[#4CAF50]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span className="hidden sm:inline">Sichere Bestellung</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="border-b border-gray-200 bg-white overflow-hidden">
        <div className="container mx-auto px-4 max-w-full">
          <ProgressIndicator currentStep={currentStep} />
        </div>
      </div>

      {/* Mobile Order Summary (Collapsible) */}
      <OrderSummary />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 lg:py-12 max-w-full overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Checkout Form - Left Side */}
          <div className="lg:col-span-7">{children}</div>

          {/* Order Summary - Right Side (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-5">
            <OrderSummary />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 mt-12 overflow-hidden">
        <div className="container mx-auto px-4 py-8 max-w-full">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <Link href="/agb" className="hover:text-[#2e2d32] transition-colors">
              AGB
            </Link>
            <Link href="/datenschutz" className="hover:text-[#2e2d32] transition-colors">
              Datenschutz
            </Link>
            <Link href="/widerruf" className="hover:text-[#2e2d32] transition-colors">
              Widerrufsbelehrung
            </Link>
            <Link href="/impressum" className="hover:text-[#2e2d32] transition-colors">
              Impressum
            </Link>
          </div>
          <div className="text-center text-sm text-gray-500 mt-4">
            © {new Date().getFullYear()} Bodenjäger. Alle Rechte vorbehalten.
          </div>
        </div>
      </footer>
    </div>
  );
}
