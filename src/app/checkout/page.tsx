'use client';

import TrustBadges from '@/components/checkout/TrustBadges';
import ExpressCheckout from '@/components/checkout/ExpressCheckout';
import ContactForm from '@/components/checkout/ContactForm';
import ShippingForm from '@/components/checkout/ShippingForm';
import PaymentOptions from '@/components/checkout/PaymentOptions';
import OrderSummary from '@/components/checkout/OrderSummary';

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Trust Badges Header */}
      <TrustBadges />

      {/* Main Content - Two Column Layout */}
      <div className="w-full max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LINKE SPALTE (60%) */}
          <div className="w-full lg:w-3/5 order-2 lg:order-1">
            {/* Express Checkout */}
            <ExpressCheckout />

            {/* Kontakt */}
            <ContactForm />

            {/* Lieferadresse */}
            <ShippingForm />

            {/* Zahlung */}
            <PaymentOptions />

            {/* Rechnungsadresse */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-[#2e2d32] mb-4">Rechnungsadresse</h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-[#e5e5e5] rounded-lg cursor-pointer hover:border-[#ed1b24] transition-colors">
                  <input
                    type="radio"
                    name="billing"
                    defaultChecked
                    className="w-5 h-5 text-[#ed1b24] border-[#e5e5e5] focus:ring-[#ed1b24]"
                  />
                  <span className="text-sm text-[#2e2d32]">Gleich wie Lieferadresse</span>
                </label>

                <label className="flex items-center gap-3 p-4 border border-[#e5e5e5] rounded-lg cursor-pointer hover:border-[#ed1b24] transition-colors">
                  <input
                    type="radio"
                    name="billing"
                    className="w-5 h-5 text-[#ed1b24] border-[#e5e5e5] focus:ring-[#ed1b24]"
                  />
                  <span className="text-sm text-[#2e2d32]">Andere Rechnungsadresse verwenden</span>
                </label>
              </div>
            </div>

            {/* CTA Button */}
            <button className="w-full h-14 mt-6 text-base font-semibold text-white bg-[#ed1b24] rounded-lg hover:bg-[#d11920] transition-colors">
              Bestellung überprüfen
            </button>

            {/* Footer Links */}
            <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-[#ed1b24]">
              <a href="/widerruf" className="hover:underline">Widerrufsrecht</a>
              <a href="/versand" className="hover:underline">Versand</a>
              <a href="/datenschutz" className="hover:underline">Datenschutzerklärung</a>
              <a href="/agb" className="hover:underline">AGB</a>
              <a href="/impressum" className="hover:underline">Impressum</a>
            </div>
          </div>

          {/* RECHTE SPALTE (40%) */}
          <div className="w-full lg:w-2/5 order-1 lg:order-2">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
