'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckout } from '@/contexts/CheckoutContext';

export default function ReviewStep() {
  const router = useRouter();
  const { formData, validationErrors, updateFormData, previousStep, submitOrder, isLoading } =
    useCheckout();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const billingAddress = formData.billingAddressSameAsShipping
    ? formData.shippingAddress
    : formData.billingAddress;

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);

    const result = await submitOrder();

    if (result.success) {
      // Redirect to success page
      router.push(`/checkout/success?orderId=${result.orderId}`);
    } else {
      // Show error message
      alert(`Fehler beim Abschließen der Bestellung: ${result.error}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Order Review */}
      <section>
        <h2 className="text-2xl font-bold text-[#2e2d32] mb-6">Bestellung überprüfen</h2>

        {/* Contact Information */}
        <div className="bg-gray-50 rounded-lg p-6 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-[#2e2d32]">Kontaktdaten</h3>
            <button
              onClick={() => previousStep()}
              className="text-sm text-[#4CAF50] hover:underline focus:outline-none"
            >
              Ändern
            </button>
          </div>
          <p className="text-gray-700">{formData.email}</p>
        </div>

        {/* Shipping Address */}
        <div className="bg-gray-50 rounded-lg p-6 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-[#2e2d32]">Versandadresse</h3>
            <button
              onClick={() => previousStep()}
              className="text-sm text-[#4CAF50] hover:underline focus:outline-none"
            >
              Ändern
            </button>
          </div>
          <div className="text-gray-700 space-y-1">
            <p>
              {formData.shippingAddress.firstName} {formData.shippingAddress.lastName}
            </p>
            {formData.shippingAddress.company && <p>{formData.shippingAddress.company}</p>}
            <p>{formData.shippingAddress.address1}</p>
            {formData.shippingAddress.address2 && <p>{formData.shippingAddress.address2}</p>}
            <p>
              {formData.shippingAddress.postcode} {formData.shippingAddress.city}
            </p>
            <p>{formData.shippingAddress.country}</p>
            {formData.shippingAddress.phone && <p>{formData.shippingAddress.phone}</p>}
          </div>
        </div>

        {/* Shipping Method */}
        <div className="bg-gray-50 rounded-lg p-6 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-[#2e2d32]">Versandmethode</h3>
            <button
              onClick={() => previousStep()}
              className="text-sm text-[#4CAF50] hover:underline focus:outline-none"
            >
              Ändern
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">{formData.selectedShippingMethod?.title}</span>
            <span className="font-semibold text-[#2e2d32]">
              {formData.selectedShippingMethod?.cost &&
              parseFloat(formData.selectedShippingMethod.cost) === 0
                ? 'Kostenlos'
                : `${formData.selectedShippingMethod?.cost} €`}
            </span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-gray-50 rounded-lg p-6 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-[#2e2d32]">Zahlungsmethode</h3>
            <button
              onClick={() => previousStep()}
              className="text-sm text-[#4CAF50] hover:underline focus:outline-none"
            >
              Ändern
            </button>
          </div>
          <p className="text-gray-700">{formData.selectedPaymentMethod?.title}</p>
        </div>

        {/* Billing Address */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-[#2e2d32]">Rechnungsadresse</h3>
            <button
              onClick={() => previousStep()}
              className="text-sm text-[#4CAF50] hover:underline focus:outline-none"
            >
              Ändern
            </button>
          </div>
          {formData.billingAddressSameAsShipping ? (
            <p className="text-gray-700">Identisch mit Versandadresse</p>
          ) : (
            <div className="text-gray-700 space-y-1">
              <p>
                {billingAddress?.firstName} {billingAddress?.lastName}
              </p>
              {billingAddress?.company && <p>{billingAddress.company}</p>}
              <p>{billingAddress?.address1}</p>
              {billingAddress?.address2 && <p>{billingAddress.address2}</p>}
              <p>
                {billingAddress?.postcode} {billingAddress?.city}
              </p>
              <p>{billingAddress?.country}</p>
            </div>
          )}
        </div>
      </section>

      {/* Terms and Conditions */}
      <section>
        <h2 className="text-2xl font-bold text-[#2e2d32] mb-6">
          Allgemeine Geschäftsbedingungen
        </h2>

        <div className="space-y-4">
          {/* Accept Terms */}
          <div>
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => updateFormData({ acceptTerms: e.target.checked })}
                className={`
                  w-5 h-5 text-[#2e2d32] rounded focus:ring-[#2e2d32] mt-0.5
                  ${validationErrors.acceptTerms ? 'border-red-500' : ''}
                `}
              />
              <span className="text-sm text-gray-700">
                Ich habe die{' '}
                <a
                  href="/agb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4CAF50] hover:underline"
                >
                  Allgemeinen Geschäftsbedingungen
                </a>{' '}
                gelesen und akzeptiere diese. *
              </span>
            </label>
            {validationErrors.acceptTerms && (
              <p className="mt-1 ml-8 text-sm text-red-600">{validationErrors.acceptTerms}</p>
            )}
          </div>

          {/* Accept Privacy */}
          <div>
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.acceptPrivacy}
                onChange={(e) => updateFormData({ acceptPrivacy: e.target.checked })}
                className={`
                  w-5 h-5 text-[#2e2d32] rounded focus:ring-[#2e2d32] mt-0.5
                  ${validationErrors.acceptPrivacy ? 'border-red-500' : ''}
                `}
              />
              <span className="text-sm text-gray-700">
                Ich habe die{' '}
                <a
                  href="/datenschutz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4CAF50] hover:underline"
                >
                  Datenschutzerklärung
                </a>{' '}
                zur Kenntnis genommen. *
              </span>
            </label>
            {validationErrors.acceptPrivacy && (
              <p className="mt-1 ml-8 text-sm text-red-600">{validationErrors.acceptPrivacy}</p>
            )}
          </div>

          {/* Withdrawal Right Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-[#2e2d32] mb-2">Widerrufsbelehrung</h4>
            <p className="text-sm text-gray-700 mb-2">
              Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu
              widerrufen.
            </p>
            <a
              href="/widerruf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#4CAF50] hover:underline"
            >
              Vollständige Widerrufsbelehrung lesen
            </a>
          </div>

          {/* Newsletter (Optional) */}
          <div>
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.newsletter || false}
                onChange={(e) => updateFormData({ newsletter: e.target.checked })}
                className="w-5 h-5 text-[#2e2d32] rounded focus:ring-[#2e2d32] mt-0.5"
              />
              <span className="text-sm text-gray-700">
                Ich möchte den Newsletter abonnieren und über Angebote und Neuheiten informiert
                werden. (optional)
              </span>
            </label>
          </div>
        </div>
      </section>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button
          onClick={previousStep}
          disabled={isSubmitting}
          className="text-[#2e2d32] font-medium hover:underline focus:outline-none focus:underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Zurück
        </button>
        <button
          onClick={handleSubmitOrder}
          disabled={isSubmitting || isLoading}
          className="px-8 py-3 bg-[#4CAF50] text-white font-semibold rounded-lg hover:bg-[#45a049] focus:outline-none focus:ring-4 focus:ring-[#4CAF50]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Bestellung wird verarbeitet...</span>
            </>
          ) : (
            <span>Jetzt kostenpflichtig bestellen</span>
          )}
        </button>
      </div>

      {/* Security Info */}
      <div className="text-center text-sm text-gray-500 pt-4">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span>Sichere SSL-verschlüsselte Übertragung</span>
        </div>
        <p>Ihre Daten werden sicher übertragen und nicht an Dritte weitergegeben.</p>
      </div>
    </div>
  );
}
