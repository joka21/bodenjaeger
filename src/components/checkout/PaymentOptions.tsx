'use client';

import { useState } from 'react';

export default function PaymentOptions() {
  const [selectedPayment, setSelectedPayment] = useState('vorkasse');

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-[#2e2d32] mb-4">Zahlung</h2>

      <div className="space-y-0">
        {/* Vorkasse - Aktiv */}
        <div
          className={`p-4 cursor-pointer transition-colors ${
            selectedPayment === 'vorkasse'
              ? 'bg-[#2e2d32] text-white rounded-t-lg'
              : 'bg-white border border-[#e5e5e5] border-t-0'
          }`}
          onClick={() => setSelectedPayment('vorkasse')}
        >
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="vorkasse"
              checked={selectedPayment === 'vorkasse'}
              onChange={(e) => setSelectedPayment(e.target.value)}
              className={`w-5 h-5 ${
                selectedPayment === 'vorkasse'
                  ? 'text-[#ed1b24] border-white'
                  : 'text-[#ed1b24] border-[#e5e5e5]'
              } focus:ring-[#ed1b24]`}
            />
            <span className="text-sm font-medium">
              Vorkasse per Überweisung (2% Skonto)
            </span>
          </label>

          {selectedPayment === 'vorkasse' && (
            <p className="mt-3 ml-8 text-xs text-gray-300">
              Bei Überweisung innerhalb von 7 Tagen nach Bestelleingang gewähren wir dir 2%
              Skonto. Die Bankdaten erhältst du nach Bestellung per E-Mail.
            </p>
          )}
        </div>

        {/* Kreditkarte */}
        <div
          className={`p-4 cursor-pointer transition-colors ${
            selectedPayment === 'kreditkarte'
              ? 'bg-[#2e2d32] text-white'
              : 'bg-white border border-[#e5e5e5] border-t-0'
          }`}
          onClick={() => setSelectedPayment('kreditkarte')}
        >
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="payment"
                value="kreditkarte"
                checked={selectedPayment === 'kreditkarte'}
                onChange={(e) => setSelectedPayment(e.target.value)}
                className={`w-5 h-5 ${
                  selectedPayment === 'kreditkarte'
                    ? 'text-[#ed1b24] border-white'
                    : 'text-[#ed1b24] border-[#e5e5e5]'
                } focus:ring-[#ed1b24]`}
              />
              <span className="text-sm">Kreditkarte</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold">VISA</span>
              <span className="text-xs font-bold">MC</span>
            </div>
          </label>
        </div>

        {/* PayPal */}
        <div
          className={`p-4 cursor-pointer transition-colors ${
            selectedPayment === 'paypal'
              ? 'bg-[#2e2d32] text-white'
              : 'bg-white border border-[#e5e5e5] border-t-0'
          }`}
          onClick={() => setSelectedPayment('paypal')}
        >
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="payment"
                value="paypal"
                checked={selectedPayment === 'paypal'}
                onChange={(e) => setSelectedPayment(e.target.value)}
                className={`w-5 h-5 ${
                  selectedPayment === 'paypal'
                    ? 'text-[#ed1b24] border-white'
                    : 'text-[#ed1b24] border-[#e5e5e5]'
                } focus:ring-[#ed1b24]`}
              />
              <span className="text-sm">PayPal</span>
            </div>
            <span className="text-xs font-bold text-[#ffc439]">PayPal</span>
          </label>
        </div>

        {/* Klarna */}
        <div
          className={`p-4 cursor-pointer transition-colors ${
            selectedPayment === 'klarna'
              ? 'bg-[#2e2d32] text-white rounded-b-lg'
              : 'bg-white border border-[#e5e5e5] border-t-0 rounded-b-lg'
          }`}
          onClick={() => setSelectedPayment('klarna')}
        >
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="payment"
                value="klarna"
                checked={selectedPayment === 'klarna'}
                onChange={(e) => setSelectedPayment(e.target.value)}
                className={`w-5 h-5 ${
                  selectedPayment === 'klarna'
                    ? 'text-[#ed1b24] border-white'
                    : 'text-[#ed1b24] border-[#e5e5e5]'
                } focus:ring-[#ed1b24]`}
              />
              <span className="text-sm">Klarna Sofortüberweisung</span>
            </div>
            <span className="text-xs font-bold text-[#FFB3C7]">klarna</span>
          </label>
        </div>
      </div>
    </div>
  );
}
