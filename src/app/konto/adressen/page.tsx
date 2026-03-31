'use client';

import { useState, useEffect } from 'react';

interface Address {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
}

interface CustomerData {
  billing: Address;
  shipping: Address;
}

const emptyAddress: Address = {
  first_name: '',
  last_name: '',
  company: '',
  address_1: '',
  address_2: '',
  city: '',
  postcode: '',
  country: 'DE',
};

export default function AdressenPage() {
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingType, setEditingType] = useState<'billing' | 'shipping' | null>(null);
  const [formData, setFormData] = useState<Address>(emptyAddress);

  useEffect(() => {
    fetch('/api/auth/customer')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCustomer({
            billing: data.customer.billing,
            shipping: data.customer.shipping,
          });
        } else {
          setError(data.error);
        }
      })
      .catch(() => setError('Daten konnten nicht geladen werden'))
      .finally(() => setLoading(false));
  }, []);

  const startEdit = (type: 'billing' | 'shipping') => {
    if (!customer) return;
    setEditingType(type);
    setFormData(customer[type]);
    setError(null);
    setSuccess(null);
  };

  const isShippingEmpty = (addr: Address) => {
    return !addr.first_name && !addr.last_name && !addr.address_1 && !addr.city && !addr.postcode;
  };

  const addressesMatch = (a: Address, b: Address) => {
    return a.first_name === b.first_name && a.last_name === b.last_name &&
      a.company === b.company && a.address_1 === b.address_1 &&
      a.address_2 === b.address_2 && a.city === b.city &&
      a.postcode === b.postcode && a.country === b.country;
  };

  const handleSave = async () => {
    if (!editingType || !customer) return;
    setSaving(true);
    setError(null);

    // When saving billing: also update shipping if shipping is empty or identical to old billing
    const shouldSyncShipping = editingType === 'billing' &&
      (isShippingEmpty(customer.shipping) || addressesMatch(customer.shipping, customer.billing));

    const updatePayload: Record<string, Address> = { [editingType]: formData };
    if (shouldSyncShipping) {
      // Copy billing to shipping, but without email/phone (shipping doesn't have those)
      const { email, phone, ...shippingData } = formData;
      updatePayload.shipping = shippingData;
    }

    const res = await fetch('/api/auth/customer', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload),
    });

    const data = await res.json();
    setSaving(false);

    if (data.success) {
      setCustomer({
        billing: data.customer.billing,
        shipping: data.customer.shipping,
      });
      setEditingType(null);
      setSuccess(shouldSyncShipping ? 'Rechnungs- und Lieferadresse gespeichert' : 'Adresse gespeichert');
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(data.error || 'Speichern fehlgeschlagen');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (loading) {
    return <div className="text-mid text-sm">Adressen werden geladen...</div>;
  }

  const renderAddress = (address: Address, type: 'billing' | 'shipping') => {
    const hasData = address.first_name || address.address_1;

    return (
      <div className="bg-white border border-ash rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-dark">
            {type === 'billing' ? 'Rechnungsadresse' : 'Lieferadresse'}
          </h2>
          <button
            onClick={() => startEdit(type)}
            className="text-sm text-brand hover:underline"
          >
            Bearbeiten
          </button>
        </div>
        {hasData ? (
          <div className="text-sm text-mid space-y-0.5">
            <p>{address.first_name} {address.last_name}</p>
            {address.company && <p>{address.company}</p>}
            <p>{address.address_1}</p>
            {address.address_2 && <p>{address.address_2}</p>}
            <p>{address.postcode} {address.city}</p>
            {address.email && <p className="mt-2">{address.email}</p>}
            {address.phone && <p>{address.phone}</p>}
          </div>
        ) : (
          <p className="text-sm text-mid">Noch nicht hinterlegt</p>
        )}
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-xl font-[family-name:var(--font-poppins-bold)] text-dark mb-6">
        Meine Adressen
      </h1>

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">{success}</p>
        </div>
      )}

      {error && !editingType && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Edit Modal */}
      {editingType && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-dark mb-4">
              {editingType === 'billing' ? 'Rechnungsadresse' : 'Lieferadresse'} bearbeiten
            </h3>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input name="first_name" placeholder="Vorname" value={formData.first_name} onChange={handleChange}
                  className="px-3 py-2.5 border border-ash rounded-lg text-sm focus:outline-none focus:border-brand" />
                <input name="last_name" placeholder="Nachname" value={formData.last_name} onChange={handleChange}
                  className="px-3 py-2.5 border border-ash rounded-lg text-sm focus:outline-none focus:border-brand" />
              </div>
              <input name="company" placeholder="Firma (optional)" value={formData.company} onChange={handleChange}
                className="w-full px-3 py-2.5 border border-ash rounded-lg text-sm focus:outline-none focus:border-brand" />
              <input name="address_1" placeholder="Straße und Hausnummer" value={formData.address_1} onChange={handleChange}
                className="w-full px-3 py-2.5 border border-ash rounded-lg text-sm focus:outline-none focus:border-brand" />
              <input name="address_2" placeholder="Adresszusatz (optional)" value={formData.address_2} onChange={handleChange}
                className="w-full px-3 py-2.5 border border-ash rounded-lg text-sm focus:outline-none focus:border-brand" />
              <div className="grid grid-cols-2 gap-3">
                <input name="postcode" placeholder="PLZ" value={formData.postcode} onChange={handleChange}
                  className="px-3 py-2.5 border border-ash rounded-lg text-sm focus:outline-none focus:border-brand" />
                <input name="city" placeholder="Stadt" value={formData.city} onChange={handleChange}
                  className="px-3 py-2.5 border border-ash rounded-lg text-sm focus:outline-none focus:border-brand" />
              </div>
              {editingType === 'billing' && (
                <>
                  <input name="email" placeholder="E-Mail" value={formData.email || ''} onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-ash rounded-lg text-sm focus:outline-none focus:border-brand" />
                  <input name="phone" placeholder="Telefon" value={formData.phone || ''} onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-ash rounded-lg text-sm focus:outline-none focus:border-brand" />
                </>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setEditingType(null); setError(null); }}
                className="flex-1 py-2.5 border border-ash rounded-lg text-sm text-mid hover:bg-gray-50 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2.5 bg-brand text-white rounded-lg text-sm font-semibold hover:bg-[#d11920] transition-colors disabled:bg-gray-400"
              >
                {saving ? 'Wird gespeichert...' : 'Speichern'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address Cards */}
      {customer && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderAddress(customer.billing, 'billing')}
          {renderAddress(customer.shipping, 'shipping')}
        </div>
      )}
    </div>
  );
}
