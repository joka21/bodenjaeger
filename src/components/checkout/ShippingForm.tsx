'use client';

import { useState } from 'react';

export default function ShippingForm() {
  const [country, setCountry] = useState('Deutschland');

  return (
    <div className="mb-8">
      {/* Sektion-Header */}
      <h2 className="text-lg font-semibold text-[#2e2d32] mb-4">Lieferadresse</h2>

      {/* Land/Region Dropdown */}
      <div className="relative mb-3">
        <label className="absolute left-4 top-1 text-xs text-[#4c4c4c]">
          Land / Region
        </label>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full h-14 pt-4 px-4 text-sm text-[#2e2d32] bg-white border border-[#e5e5e5] rounded-lg appearance-none focus:outline-none focus:border-[#ed1b24] focus:ring-1 focus:ring-[#ed1b24]"
        >
          <option>Deutschland</option>
          <option>Österreich</option>
          <option>Schweiz</option>
        </select>
        <svg
          className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4c4c4c] pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Vorname + Nachname */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <input
          type="text"
          placeholder="Vorname"
          className="h-12 px-4 text-sm text-[#2e2d32] bg-white border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#ed1b24] focus:ring-1 focus:ring-[#ed1b24]"
        />
        <input
          type="text"
          placeholder="Nachname"
          className="h-12 px-4 text-sm text-[#2e2d32] bg-white border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#ed1b24] focus:ring-1 focus:ring-[#ed1b24]"
        />
      </div>

      {/* Firma (optional) */}
      <input
        type="text"
        placeholder="Firma (optional)"
        className="w-full h-12 px-4 mb-3 text-sm text-[#2e2d32] bg-white border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#ed1b24] focus:ring-1 focus:ring-[#ed1b24]"
      />

      {/* Adresse */}
      <input
        type="text"
        placeholder="Adresse"
        className="w-full h-12 px-4 mb-3 text-sm text-[#2e2d32] bg-white border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#ed1b24] focus:ring-1 focus:ring-[#ed1b24]"
      />

      {/* Hausnummer */}
      <input
        type="text"
        placeholder="Hausnummer"
        className="w-full h-12 px-4 mb-3 text-sm text-[#2e2d32] bg-white border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#ed1b24] focus:ring-1 focus:ring-[#ed1b24]"
      />

      {/* PLZ + Stadt */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <input
          type="text"
          placeholder="PLZ"
          className="h-12 px-4 text-sm text-[#2e2d32] bg-white border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#ed1b24] focus:ring-1 focus:ring-[#ed1b24]"
        />
        <input
          type="text"
          placeholder="Stadt"
          className="h-12 px-4 text-sm text-[#2e2d32] bg-white border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#ed1b24] focus:ring-1 focus:ring-[#ed1b24]"
        />
      </div>

      {/* Telefon */}
      <input
        type="tel"
        placeholder="Telefon"
        className="w-full h-12 px-4 text-sm text-[#2e2d32] bg-white border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#ed1b24] focus:ring-1 focus:ring-[#ed1b24]"
      />
    </div>
  );
}
