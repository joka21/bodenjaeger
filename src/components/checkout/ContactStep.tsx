'use client';

import React, { useEffect } from 'react';
import { useCheckout } from '@/contexts/CheckoutContext';
import { ShippingMethod } from '@/types/checkout';

export default function ContactStep() {
  const {
    formData,
    validationErrors,
    updateFormData,
    nextStep,
    availableShippingMethods,
    fetchShippingMethods,
    isLoading,
  } = useCheckout();

  useEffect(() => {
    if (availableShippingMethods.length === 0) {
      fetchShippingMethods();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updateFormData({
        [parent]: {
          ...formData.shippingAddress,
          [child]: value,
        },
      });
    } else {
      updateFormData({ [field]: value });
    }
  };

  const handleShippingMethodSelect = (method: ShippingMethod) => {
    updateFormData({ selectedShippingMethod: method });
  };

  return (
    <div className="space-y-8">
      {/* Contact Information */}
      <section>
        <h2 className="text-2xl font-bold text-[#2e2d32] mb-6">Kontaktdaten</h2>

        <div className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-Mail-Adresse *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`
                w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e2d32] transition-all
                ${validationErrors.email ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder="max@mustermann.de"
            />
            {validationErrors.email && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
            )}
          </div>
        </div>
      </section>

      {/* Shipping Address */}
      <section>
        <h2 className="text-2xl font-bold text-[#2e2d32] mb-6">Versandadresse</h2>

        <div className="space-y-4">
          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Vorname *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                autoComplete="given-name"
                value={formData.shippingAddress.firstName}
                onChange={(e) => handleInputChange('shippingAddress.firstName', e.target.value)}
                className={`
                  w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e2d32] transition-all
                  ${validationErrors.shippingAddress?.firstName ? 'border-red-500' : 'border-gray-300'}
                `}
                placeholder="Max"
              />
              {validationErrors.shippingAddress?.firstName && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.shippingAddress.firstName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Nachname *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                autoComplete="family-name"
                value={formData.shippingAddress.lastName}
                onChange={(e) => handleInputChange('shippingAddress.lastName', e.target.value)}
                className={`
                  w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e2d32] transition-all
                  ${validationErrors.shippingAddress?.lastName ? 'border-red-500' : 'border-gray-300'}
                `}
                placeholder="Mustermann"
              />
              {validationErrors.shippingAddress?.lastName && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.shippingAddress.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Company (Optional) */}
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              Firma (optional)
            </label>
            <input
              type="text"
              id="company"
              name="company"
              autoComplete="organization"
              value={formData.shippingAddress.company || ''}
              onChange={(e) => handleInputChange('shippingAddress.company', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e2d32] transition-all"
              placeholder="Muster GmbH"
            />
          </div>

          {/* Address Line 1 */}
          <div>
            <label htmlFor="address1" className="block text-sm font-medium text-gray-700 mb-1">
              Straße und Hausnummer *
            </label>
            <input
              type="text"
              id="address1"
              name="address1"
              autoComplete="address-line1"
              value={formData.shippingAddress.address1}
              onChange={(e) => handleInputChange('shippingAddress.address1', e.target.value)}
              className={`
                w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e2d32] transition-all
                ${validationErrors.shippingAddress?.address1 ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder="Musterstraße 123"
            />
            {validationErrors.shippingAddress?.address1 && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.shippingAddress.address1}
              </p>
            )}
          </div>

          {/* Address Line 2 (Optional) */}
          <div>
            <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-1">
              Adresszusatz (optional)
            </label>
            <input
              type="text"
              id="address2"
              name="address2"
              autoComplete="address-line2"
              value={formData.shippingAddress.address2 || ''}
              onChange={(e) => handleInputChange('shippingAddress.address2', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e2d32] transition-all"
              placeholder="Wohnung 4B"
            />
          </div>

          {/* Postcode & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 mb-1">
                Postleitzahl *
              </label>
              <input
                type="text"
                id="postcode"
                name="postcode"
                autoComplete="postal-code"
                value={formData.shippingAddress.postcode}
                onChange={(e) => handleInputChange('shippingAddress.postcode', e.target.value)}
                className={`
                  w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e2d32] transition-all
                  ${validationErrors.shippingAddress?.postcode ? 'border-red-500' : 'border-gray-300'}
                `}
                placeholder="12345"
              />
              {validationErrors.shippingAddress?.postcode && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.shippingAddress.postcode}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                Stadt *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                autoComplete="address-level2"
                value={formData.shippingAddress.city}
                onChange={(e) => handleInputChange('shippingAddress.city', e.target.value)}
                className={`
                  w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e2d32] transition-all
                  ${validationErrors.shippingAddress?.city ? 'border-red-500' : 'border-gray-300'}
                `}
                placeholder="Berlin"
              />
              {validationErrors.shippingAddress?.city && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.shippingAddress.city}</p>
              )}
            </div>
          </div>

          {/* Country */}
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
              Land *
            </label>
            <select
              id="country"
              name="country"
              autoComplete="country"
              value={formData.shippingAddress.country}
              onChange={(e) => handleInputChange('shippingAddress.country', e.target.value)}
              className={`
                w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e2d32] transition-all
                ${validationErrors.shippingAddress?.country ? 'border-red-500' : 'border-gray-300'}
              `}
            >
              <option value="DE">Deutschland</option>
              <option value="AT">Österreich</option>
              <option value="CH">Schweiz</option>
            </select>
            {validationErrors.shippingAddress?.country && (
              <p className="mt-1 text-sm text-red-600">
                {validationErrors.shippingAddress.country}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Telefon (optional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              autoComplete="tel"
              value={formData.shippingAddress.phone || ''}
              onChange={(e) => handleInputChange('shippingAddress.phone', e.target.value)}
              className={`
                w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e2d32] transition-all
                ${validationErrors.shippingAddress?.phone ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder="+49 123 456789"
            />
            {validationErrors.shippingAddress?.phone && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.shippingAddress.phone}</p>
            )}
          </div>
        </div>
      </section>

      {/* Shipping Methods */}
      <section>
        <h2 className="text-2xl font-bold text-[#2e2d32] mb-6">Versandmethode</h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2e2d32]"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {availableShippingMethods.map((method) => (
              <label
                key={method.id}
                className={`
                  flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all
                  ${
                    formData.selectedShippingMethod?.id === method.id
                      ? 'border-[#2e2d32] bg-[#2e2d32]/5 ring-2 ring-[#2e2d32]'
                      : 'border-gray-300 hover:border-gray-400'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value={method.id}
                    checked={formData.selectedShippingMethod?.id === method.id}
                    onChange={() => handleShippingMethodSelect(method)}
                    className="w-4 h-4 text-[#2e2d32] focus:ring-[#2e2d32]"
                  />
                  <div>
                    <div className="font-medium text-[#2e2d32]">{method.title}</div>
                    {method.description && (
                      <div className="text-sm text-gray-500">{method.description}</div>
                    )}
                  </div>
                </div>
                <div className="font-semibold text-[#2e2d32]">
                  {parseFloat(method.cost) === 0 ? 'Kostenlos' : `${method.cost} €`}
                </div>
              </label>
            ))}
          </div>
        )}

        {validationErrors.selectedShippingMethod && (
          <p className="mt-2 text-sm text-red-600">{validationErrors.selectedShippingMethod}</p>
        )}
      </section>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <a
          href="/cart"
          className="text-[#2e2d32] font-medium hover:underline focus:outline-none focus:underline"
        >
          Zurück zum Warenkorb
        </a>
        <button
          onClick={nextStep}
          className="px-8 py-3 bg-[#4CAF50] text-white font-semibold rounded-lg hover:bg-[#45a049] focus:outline-none focus:ring-4 focus:ring-[#4CAF50]/30 transition-all"
        >
          Weiter zur Zahlung
        </button>
      </div>
    </div>
  );
}
