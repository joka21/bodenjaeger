'use client';

import { useState } from 'react';

interface QuantitySelectorProps {
  paketinhalt: number;
  einheit: string;
  onQuantityChange?: (sqm: number, packages: number) => void;
}

export default function QuantitySelector({
  paketinhalt,
  einheit,
  onQuantityChange
}: QuantitySelectorProps) {
  const [sqm, setSqm] = useState<string>('');
  const [packages, setPackages] = useState<string>('');

  const handleSqmChange = (value: string) => {
    setSqm(value);
    const sqmValue = parseFloat(value) || 0;
    const calculatedPackages = Math.ceil(sqmValue / paketinhalt);
    setPackages(calculatedPackages.toString());

    if (onQuantityChange) {
      onQuantityChange(sqmValue, calculatedPackages);
    }
  };

  const handlePackagesChange = (value: string) => {
    setPackages(value);
    const packagesValue = parseInt(value) || 0;
    const calculatedSqm = packagesValue * paketinhalt;
    setSqm(calculatedSqm.toFixed(2));

    if (onQuantityChange) {
      onQuantityChange(calculatedSqm, packagesValue);
    }
  };

  return (
    <div className="bg-gray-100 rounded-lg p-6 mb-6">
      {/* Info Badge */}
      <div className="flex items-center mb-4">
        <span className="text-gray-600 mr-2">ℹ️</span>
        <span className="text-sm text-gray-600">
          1 Paket = {paketinhalt} {einheit}
        </span>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quadratmeter Input */}
        <div>
          <label htmlFor="sqm-input" className="block text-sm font-medium text-gray-700 mb-2">
            Quadratmeter
          </label>
          <div className="relative">
            <input
              id="sqm-input"
              type="number"
              value={sqm}
              onChange={(e) => handleSqmChange(e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
              {einheit}
            </span>
          </div>
        </div>

        {/* Pakete Input */}
        <div>
          <label htmlFor="packages-input" className="block text-sm font-medium text-gray-700 mb-2">
            Pakete
          </label>
          <div className="relative">
            <input
              id="packages-input"
              type="number"
              value={packages}
              onChange={(e) => handlePackagesChange(e.target.value)}
              placeholder="0"
              min="0"
              step="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
              Pak.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
