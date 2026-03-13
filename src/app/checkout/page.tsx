'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { calculateShippingCost } from '@/lib/shippingConfig';
import TrustBadges from '@/components/checkout/TrustBadges';
import OrderSummary from '@/components/checkout/OrderSummary';

type PaymentMethod = 'stripe' | 'paypal' | 'sofort' | 'bacs';
type ShippingMethod = 'delivery' | 'pickup';

interface FormData {
  // Contact
  email: string;
  phone: string;
  // Shipping
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  postcode: string;
  country: string;
  // Billing (optional, falls abweichend)
  billingFirstName: string;
  billingLastName: string;
  billingCompany: string;
  billingAddress1: string;
  billingAddress2: string;
  billingCity: string;
  billingPostcode: string;
  billingCountry: string;
  // Options
  sameAsBilling: boolean;
  paymentMethod: PaymentMethod;
  acceptTerms: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, totalPrice, customerNote, deliveryNote } = useCart();
  const { isLoggedIn } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    postcode: '',
    country: 'DE',
    billingFirstName: '',
    billingLastName: '',
    billingCompany: '',
    billingAddress1: '',
    billingAddress2: '',
    billingCity: '',
    billingPostcode: '',
    billingCountry: 'DE',
    sameAsBilling: true,
    paymentMethod: 'stripe',
    acceptTerms: false,
  });

  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('delivery');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, [cartItems, router]);

  // Auto-fill from customer account
  useEffect(() => {
    if (!isLoggedIn) return;

    fetch('/api/auth/customer')
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) return;
        const c = data.customer;
        setFormData((prev) => ({
          ...prev,
          email: prev.email || c.email || '',
          phone: prev.phone || c.billing?.phone || '',
          firstName: prev.firstName || c.shipping?.first_name || c.billing?.first_name || '',
          lastName: prev.lastName || c.shipping?.last_name || c.billing?.last_name || '',
          company: prev.company || c.shipping?.company || '',
          address1: prev.address1 || c.shipping?.address_1 || '',
          address2: prev.address2 || c.shipping?.address_2 || '',
          city: prev.city || c.shipping?.city || '',
          postcode: prev.postcode || c.shipping?.postcode || '',
          country: c.shipping?.country || prev.country,
          billingFirstName: prev.billingFirstName || c.billing?.first_name || '',
          billingLastName: prev.billingLastName || c.billing?.last_name || '',
          billingCompany: prev.billingCompany || c.billing?.company || '',
          billingAddress1: prev.billingAddress1 || c.billing?.address_1 || '',
          billingAddress2: prev.billingAddress2 || c.billing?.address_2 || '',
          billingCity: prev.billingCity || c.billing?.city || '',
          billingPostcode: prev.billingPostcode || c.billing?.postcode || '',
          billingCountry: c.billing?.country || prev.billingCountry,
        }));
      })
      .catch(() => {});
  }, [isLoggedIn]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validierung
      if (!formData.email || !formData.phone || !formData.firstName || !formData.lastName) {
        setError('Bitte füllen Sie alle Pflichtfelder aus');
        setLoading(false);
        return;
      }

      if (shippingMethod === 'delivery' && (!formData.address1 || !formData.city || !formData.postcode)) {
        setError('Bitte füllen Sie alle Pflichtfelder der Lieferadresse aus');
        setLoading(false);
        return;
      }

      if (shippingMethod === 'pickup' && (!formData.billingAddress1 || !formData.billingCity || !formData.billingPostcode)) {
        setError('Bitte füllen Sie alle Pflichtfelder der Rechnungsadresse aus');
        setLoading(false);
        return;
      }

      if (!formData.acceptTerms) {
        setError('Bitte akzeptieren Sie die AGB und Datenschutzerklärung');
        setLoading(false);
        return;
      }

      // Line Items aus Cart erstellen (Items mit quantity 0 ausfiltern)
      const line_items = cartItems.filter((item) => item.quantity > 0).map((item) => {
        let totalPrice: number;

        // Preisberechnung abhängig vom Item-Typ
        if (item.isSample && item.samplePrice !== undefined) {
          // Sample/Muster: Dynamischer Preis (0€ oder 3€)
          totalPrice = item.samplePrice * item.quantity;
        } else if (item.isSetItem && item.setPricePerUnit !== undefined && item.actualM2 !== undefined) {
          // Set-Angebot Item: Verwende Set-Preis, NICHT regulären Preis!
          // setPricePerUnit ist bereits der korrekte Preis (0 für kostenlos, verrechnung für Premium)
          totalPrice = item.setPricePerUnit * item.actualM2;
        } else {
          // Reguläres Item
          const paketinhalt = item.product.paketinhalt || 1;
          // Paketpreis = Einzelpreis × Paketinhalt (gilt für ALLE Einheiten: m², lfm, kg, Liter etc.)
          totalPrice = item.product.price * paketinhalt * item.quantity;
        }

        // Metadata für Set-Angebot Items (umfassend für Rechnungen/Refunds)
        const metadata = [];
        if (item.isSetItem) {
          metadata.push(
            { key: '_set_angebot', value: 'true' },
            { key: '_set_id', value: item.setId || '' },
            { key: '_set_item_type', value: item.setItemType || '' },
            { key: '_set_price_per_unit', value: item.setPricePerUnit?.toString() || '0' },
            { key: '_regular_price_per_unit', value: item.regularPricePerUnit?.toString() || '0' },
            { key: '_actual_m2', value: item.actualM2?.toString() || '0' },
            { key: '_savings', value: ((item.regularPricePerUnit || 0) * (item.actualM2 || 0) - totalPrice).toFixed(2) }
          );
        }

        if (item.isSample) {
          metadata.push(
            { key: '_is_sample', value: 'true' },
            { key: '_sample_price', value: item.samplePrice?.toString() || '0' }
          );
        }

        return {
          product_id: item.product.id,
          quantity: item.quantity,
          total: totalPrice.toFixed(2),
          name: item.product.name,
          meta_data: metadata,
        };
      });

      // Billing Address
      let billing;
      if (shippingMethod === 'pickup') {
        // Bei Abholung: Rechnungsadresse aus den Billing-Feldern
        billing = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          company: formData.company,
          address_1: formData.billingAddress1,
          address_2: formData.billingAddress2,
          city: formData.billingCity,
          postcode: formData.billingPostcode,
          country: formData.billingCountry || 'DE',
          email: formData.email,
          phone: formData.phone,
        };
      } else if (formData.sameAsBilling) {
        billing = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          company: formData.company,
          address_1: formData.address1,
          address_2: formData.address2,
          city: formData.city,
          postcode: formData.postcode,
          country: formData.country,
          email: formData.email,
          phone: formData.phone,
        };
      } else {
        billing = {
          first_name: formData.billingFirstName,
          last_name: formData.billingLastName,
          company: formData.billingCompany,
          address_1: formData.billingAddress1,
          address_2: formData.billingAddress2,
          city: formData.billingCity,
          postcode: formData.billingPostcode,
          country: formData.billingCountry,
          email: formData.email,
          phone: formData.phone,
        };
      }

      // Shipping Address
      const shipping = shippingMethod === 'pickup'
        ? {
            first_name: formData.firstName,
            last_name: formData.lastName,
            company: 'Abholung im Fachmarkt',
            address_1: 'Neckarstraße 9',
            address_2: '',
            city: 'Hückelhoven',
            postcode: '41836',
            country: 'DE',
          }
        : {
            first_name: formData.firstName,
            last_name: formData.lastName,
            company: formData.company,
            address_1: formData.address1,
            address_2: formData.address2,
            city: formData.city,
            postcode: formData.postcode,
            country: formData.country,
          };

      // Versandkosten berechnen
      const shippingCost = shippingMethod === 'pickup' ? 0 : calculateShippingCost(totalPrice, cartItems);

      // API Call
      const response = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          billing,
          shipping,
          line_items,
          payment_method: formData.paymentMethod,
          shipping_method: shippingMethod,
          customer_note: [
            deliveryNote.trim() && `Lieferwunsch: ${deliveryNote.trim()}`,
            customerNote.trim() && `Anmerkung: ${customerNote.trim()}`,
          ].filter(Boolean).join('\n\n'),
          shipping_cost: shippingCost,
        }),
      });

      const result = await response.json();

      if (result.success && result.redirectUrl) {
        // Redirect zum Payment Gateway oder Success-Page
        window.location.href = result.redirectUrl;
      } else {
        setError(result.error || 'Bestellung konnte nicht erstellt werden');
        setLoading(false);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return null; // Wird zu /cart weitergeleitet
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Trust Badges Header */}
      <TrustBadges />

      {/* Main Content - Two Column Layout */}
      <form onSubmit={handleSubmit}>
        <div className="content-container py-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* LINKE SPALTE (60%) */}
            <div className="w-full lg:w-3/5 order-2 lg:order-1">
              {/* Kontakt */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-dark mb-4">Kontakt</h2>
                <div className="space-y-4">
                  <input
                    type="email"
                    name="email"
                    placeholder="E-Mail *"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-ash rounded-lg focus:outline-none focus:border-brand"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Telefon *"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-ash rounded-lg focus:outline-none focus:border-brand"
                  />
                </div>
              </div>

              {/* Versandart */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-dark mb-4">Versandart</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border border-ash rounded-lg cursor-pointer hover:border-brand transition-colors">
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={shippingMethod === 'delivery'}
                      onChange={() => setShippingMethod('delivery')}
                      className="w-5 h-5 text-brand border-ash focus:ring-brand"
                    />
                    <span className="text-sm text-dark">Versand</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-ash rounded-lg cursor-pointer hover:border-brand transition-colors">
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={shippingMethod === 'pickup'}
                      onChange={() => setShippingMethod('pickup')}
                      className="w-5 h-5 text-brand border-ash focus:ring-brand"
                    />
                    <span className="text-sm text-dark">Abholung im Fachmarkt Hückelhoven</span>
                  </label>
                </div>
              </div>

              {/* Lieferadresse / Abholung Info */}
              <div className="mb-8">
                {shippingMethod === 'pickup' ? (
                  <>
                    <h2 className="text-lg font-semibold text-dark mb-4">Abholadresse</h2>
                    <div className="p-4 bg-gray-50 border border-ash rounded-lg">
                      <p className="text-sm font-semibold text-dark">Fachmarkt Hückelhoven</p>
                      <p className="text-sm text-mid">Neckarstraße 9</p>
                      <p className="text-sm text-mid">41836 Hückelhoven</p>
                    </div>
                    {/* Name fields still needed for order */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <input
                        type="text"
                        name="firstName"
                        placeholder="Vorname *"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="px-4 py-3 border border-ash rounded-lg focus:outline-none focus:border-brand"
                      />
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Nachname *"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="px-4 py-3 border border-ash rounded-lg focus:outline-none focus:border-brand"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-lg font-semibold text-dark mb-4">Lieferadresse</h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="firstName"
                          placeholder="Vorname *"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="px-4 py-3 border border-ash rounded-lg focus:outline-none focus:border-brand"
                        />
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Nachname *"
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="px-4 py-3 border border-ash rounded-lg focus:outline-none focus:border-brand"
                        />
                      </div>
                      <input
                        type="text"
                        name="company"
                        placeholder="Firma (optional)"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-ash rounded-lg focus:outline-none focus:border-brand"
                      />
                      <input
                        type="text"
                        name="address1"
                        placeholder="Straße und Hausnummer *"
                        required
                        value={formData.address1}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-ash rounded-lg focus:outline-none focus:border-brand"
                      />
                      <input
                        type="text"
                        name="address2"
                        placeholder="Adresszusatz (optional)"
                        value={formData.address2}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-ash rounded-lg focus:outline-none focus:border-brand"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="postcode"
                          placeholder="PLZ *"
                          required
                          value={formData.postcode}
                          onChange={handleInputChange}
                          className="px-4 py-3 border border-ash rounded-lg focus:outline-none focus:border-brand"
                        />
                        <input
                          type="text"
                          name="city"
                          placeholder="Stadt *"
                          required
                          value={formData.city}
                          onChange={handleInputChange}
                          className="px-4 py-3 border border-ash rounded-lg focus:outline-none focus:border-brand"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Zahlungsmethode */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-dark mb-4">Zahlungsmethode</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border border-ash rounded-lg cursor-pointer hover:border-brand transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="stripe"
                      checked={formData.paymentMethod === 'stripe'}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-brand border-ash focus:ring-brand"
                    />
                    <span className="text-sm text-dark">💳 Kreditkarte (Visa, Mastercard, Amex)</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-ash rounded-lg cursor-pointer hover:border-brand transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-brand border-ash focus:ring-brand"
                    />
                    <span className="text-sm text-dark">💰 PayPal</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-ash rounded-lg cursor-pointer hover:border-brand transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="sofort"
                      checked={formData.paymentMethod === 'sofort'}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-brand border-ash focus:ring-brand"
                    />
                    <span className="text-sm text-dark">🏦 Sofortüberweisung</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-ash rounded-lg cursor-pointer hover:border-brand transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bacs"
                      checked={formData.paymentMethod === 'bacs'}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-brand border-ash focus:ring-brand"
                    />
                    <span className="text-sm text-dark">📄 Vorkasse / Überweisung</span>
                  </label>
                </div>
              </div>

              {/* Rechnungsadresse */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-dark mb-4">Rechnungsadresse</h2>
                {shippingMethod === 'delivery' ? (
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 border border-ash rounded-lg cursor-pointer hover:border-brand transition-colors">
                      <input
                        type="radio"
                        name="sameAsBilling"
                        checked={formData.sameAsBilling}
                        onChange={() => setFormData((prev) => ({ ...prev, sameAsBilling: true }))}
                        className="w-5 h-5 text-brand border-ash focus:ring-brand"
                      />
                      <span className="text-sm text-dark">Gleich wie Lieferadresse</span>
                    </label>
                    <label className="flex items-center gap-3 p-4 border border-ash rounded-lg cursor-pointer hover:border-brand transition-colors">
                      <input
                        type="radio"
                        name="sameAsBilling"
                        checked={!formData.sameAsBilling}
                        onChange={() => setFormData((prev) => ({ ...prev, sameAsBilling: false }))}
                        className="w-5 h-5 text-brand border-ash focus:ring-brand"
                      />
                      <span className="text-sm text-dark">Andere Rechnungsadresse verwenden</span>
                    </label>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="billingAddress1"
                      placeholder="Straße und Hausnummer *"
                      required
                      value={formData.billingAddress1}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-ash rounded-lg focus:outline-none focus:border-brand"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="billingPostcode"
                        placeholder="PLZ *"
                        required
                        value={formData.billingPostcode}
                        onChange={handleInputChange}
                        className="px-4 py-3 border border-ash rounded-lg focus:outline-none focus:border-brand"
                      />
                      <input
                        type="text"
                        name="billingCity"
                        placeholder="Stadt *"
                        required
                        value={formData.billingCity}
                        onChange={handleInputChange}
                        className="px-4 py-3 border border-ash rounded-lg focus:outline-none focus:border-brand"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Notes (readonly, from cart) */}
              {(deliveryNote.trim() || customerNote.trim()) && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-dark mb-4">Ihre Notizen</h2>
                  <div className="p-4 bg-gray-50 border border-ash rounded-lg space-y-3">
                    {deliveryNote.trim() && (
                      <div>
                        <span className="text-xs font-semibold text-gray-500 uppercase">Lieferwunsch</span>
                        <p className="text-sm text-dark whitespace-pre-wrap mt-1">{deliveryNote}</p>
                      </div>
                    )}
                    {customerNote.trim() && (
                      <div>
                        <span className="text-xs font-semibold text-gray-500 uppercase">Anmerkung</span>
                        <p className="text-sm text-dark whitespace-pre-wrap mt-1">{customerNote}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* AGB Checkbox */}
              <div className="mb-6">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-5 h-5 text-brand border-ash focus:ring-brand"
                  />
                  <span className="text-sm text-dark">
                    Ich habe die{' '}
                    <a href="/agb" target="_blank" className="text-brand hover:underline">
                      AGB
                    </a>{' '}
                    und{' '}
                    <a href="/datenschutz" target="_blank" className="text-brand hover:underline">
                      Datenschutzerklärung
                    </a>{' '}
                    gelesen und akzeptiere diese. *
                  </span>
                </label>
              </div>

              {/* CTA Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 mt-6 text-base font-semibold text-white bg-brand rounded-lg hover:bg-[#d11920] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Bestellung wird erstellt...' : 'Jetzt kaufen'}
              </button>

              {/* Footer Links */}
              <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-brand">
                <a href="/widerruf" className="hover:underline">Widerrufsrecht</a>
                <a href="/versand" className="hover:underline">Versand</a>
                <a href="/datenschutz" className="hover:underline">Datenschutzerklärung</a>
                <a href="/agb" className="hover:underline">AGB</a>
                <a href="/impressum" className="hover:underline">Impressum</a>
              </div>
            </div>

            {/* RECHTE SPALTE (40%) */}
            <div className="w-full lg:w-2/5 order-1 lg:order-2">
              <OrderSummary shippingMethod={shippingMethod} />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
