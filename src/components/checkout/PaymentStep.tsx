'use client';

import React, { useEffect } from 'react';
import { useCheckout } from '@/contexts/CheckoutContext';
import { PaymentMethod, BillingAddress } from '@/types/checkout';

export default function PaymentStep() {
  const {
    formData,
    validationErrors,
    updateFormData,
    nextStep,
    previousStep,
    availablePaymentMethods,
    fetchPaymentMethods,
    isLoading,
  } = useCheckout();

  useEffect(() => {
    if (availablePaymentMethods.length === 0) {
      fetchPaymentMethods();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    updateFormData({ selectedPaymentMethod: method });
  };

  const handleBillingAddressToggle = (sameAsShipping: boolean) => {
    updateFormData({ billingAddressSameAsShipping: sameAsShipping });

    // If toggling to "same as shipping", copy shipping address to billing
    if (sameAsShipping) {
      updateFormData({
        billingAddress: {
          ...formData.shippingAddress,
          email: formData.email,
        },
      });
    }
  };

  const handleBillingInputChange = (field: string, value: string) => {
    const billingAddress: BillingAddress = formData.billingAddress || {
      ...formData.shippingAddress,
      email: formData.email,
    };

    updateFormData({
      billingAddress: {
        ...billingAddress,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Payment Methods */}
      <section>
        <h2 className="text-2xl font-bold text-[#2e2d32] mb-6">Zahlungsmethode</h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2e2d32]"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {availablePaymentMethods.map((method) => (
              <label
                key={method.id}
                className={`
                  flex items-start p-4 border rounded-lg cursor-pointer transition-all
                  ${
                    formData.selectedPaymentMethod?.id === method.id
                      ? 'border-[#2e2d32] bg-[#2e2d32]/5 ring-2 ring-[#2e2d32]'
                      : 'border-gray-300 hover:border-gray-400'
                  }
                `}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={formData.selectedPaymentMethod?.id === method.id}
                  onChange={() => handlePaymentMethodSelect(method)}
                  className="w-4 h-4 mt-1 text-[#2e2d32] focus:ring-[#2e2d32]"
                />
                <div className="ml-3 flex-1">
                  <div className="font-medium text-[#2e2d32]">{method.title}</div>
                  {method.description && (
                    <div
                      className="text-sm text-gray-500 mt-1"
                      dangerouslySetInnerHTML={{ __html: method.description }}
                    />
                  )}
                </div>
              </label>
            ))}
          </div>
        )}

        {validationErrors.selectedPaymentMethod && (
          <p className="mt-2 text-sm text-red-600">{validationErrors.selectedPaymentMethod}</p>
        )}
      </section>

      {/* Billing Address */}
      <section>
        <h2 className="text-2xl font-bold text-[#2e2d32] mb-6">Rechnungsadresse</h2>

        {/* Same as Shipping Toggle */}
        <div className="mb-6">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.billingAddressSameAsShipping}
              onChange={(e) => handleBillingAddressToggle(e.target.checked)}
              className="w-5 h-5 text-[#2e2d32] rounded focus:ring-[#2e2d32] mt-0.5"
            />
            <span className="text-sm font-medium text-gray-700">
              Rechnungsadresse ist identisch mit Versandadresse
            </span>
          </label>
        </div>

        {/* Billing Address Form (shown if different from shipping) */}
        {!formData.billingAddressSameAsShipping && (
          <div className="space-y-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="billing-firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Vorname *
                </label>
                <input
                  type="text"
                  id="billing-firstName"
                  value={formData.billingAddress?.firstName || ''}
                  onChange={(e) => handleBillingInputChange('firstName', e.target.value)}
                  className={`
                    w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e2d32] transition-all
                    ${validationErrors.billingAddress?.firstName ? 'border-red-500' : 'border-gray-300'}
                  `}
                  placeholder="Max"
                />
                {validationErrors.billingAddress?.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.billingAddress.firstName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="billing-lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nachname *
                </label>
                <input
                  type="text"
                  id="billing-lastName"
                  value={formData.billingAddress?.lastName || ''}
                  onChange={(e) => handleBillingInputChange('lastName', e.target.value)}
                  className={`
                    w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e2d32] transition-all
                    ${validationErrors.billingAddress?.lastName ? 'border-red-500' : 'border-gray-300'}
                  `}
                  placeholder="Mustermann"
                />
                {validationErrors.billingAddress?.lastName && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.billingAddress.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Company (Optional) */}
            <div>
              <label
                htmlFor="billing-company"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Firma (optional)
              </label>
              <input
                type="text"
                id="billing-company"
                value={formData.billingAddress?.company || ''}
                onChange={(e) => handleBillingInputChange('company', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e2d32] transition-all"
                placeholder="Muster GmbH"
              />
            </div>

            {/* Address Line 1 */}
            <div>
              <label
                htmlFor="billing-address1"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Straße und Hausnummer *
              </label>
              <input
                type="text"
                id="billing-address1"
                value={formData.billingAddress?.address1 || ''}
                onChange={(e) => handleBillingInputChange('address1', e.target.value)}
                className={`
                  w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e2d32] transition-all
                  ${validationErrors.billingAddress?.address1 ? 'border-red-500' : 'border-gray-300'}
                `}
                placeholder="Musterstraße 123"
              />
              {validationErrors.billingAddress?.address1 && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.billingAddress.address1}
                </p>
              )}
            </div>

            {/* Address Line 2 (Optional) */}
            <div>
              <label
                htmlFor="billing-address2"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Adresszusatz (optional)
              </label>
              <input
                type="text"
                id="billing-address2"
                value={formData.billingAddress?.address2 || ''}
                onChange={(e) => handleBillingInputChange('address2', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e2d32] transition-all"
                placeholder="Wohnung 4B"
              />
            </div>

            {/* Postcode & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="billing-postcode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Postleitzahl *
                </label>
                <input
                  type="text"
                  id="billing-postcode"
                  value={formData.billingAddress?.postcode || ''}
                  onChange={(e) => handleBillingInputChange('postcode', e.target.value)}
                  className={`
                    w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e2d32] transition-all
                    ${validationErrors.billingAddress?.postcode ? 'border-red-500' : 'border-gray-300'}
                  `}
                  placeholder="12345"
                />
                {validationErrors.billingAddress?.postcode && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.billingAddress.postcode}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="billing-city"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Stadt *
                </label>
                <input
                  type="text"
                  id="billing-city"
                  value={formData.billingAddress?.city || ''}
                  onChange={(e) => handleBillingInputChange('city', e.target.value)}
                  className={`
                    w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e2d32] transition-all
                    ${validationErrors.billingAddress?.city ? 'border-red-500' : 'border-gray-300'}
                  `}
                  placeholder="Berlin"
                />
                {validationErrors.billingAddress?.city && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.billingAddress.city}
                  </p>
                )}
              </div>
            </div>

            {/* Country */}
            <div>
              <label
                htmlFor="billing-country"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Land *
              </label>
              <select
                id="billing-country"
                value={formData.billingAddress?.country || 'DE'}
                onChange={(e) => handleBillingInputChange('country', e.target.value)}
                className={`
                  w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e2d32] transition-all
                  ${validationErrors.billingAddress?.country ? 'border-red-500' : 'border-gray-300'}
                `}
              >
                <option value="DE">Deutschland</option>
                <option value="AT">Österreich</option>
                <option value="CH">Schweiz</option>
              </select>
              {validationErrors.billingAddress?.country && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.billingAddress.country}
                </p>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button
          onClick={previousStep}
          className="text-[#2e2d32] font-medium hover:underline focus:outline-none focus:underline"
        >
          Zurück
        </button>
        <button
          onClick={nextStep}
          className="px-8 py-3 bg-[#4CAF50] text-white font-semibold rounded-lg hover:bg-[#45a049] focus:outline-none focus:ring-4 focus:ring-[#4CAF50]/30 transition-all"
        >
          Weiter zur Überprüfung
        </button>
      </div>
    </div>
  );
}
