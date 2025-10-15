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
  const [packages, setPackages] = useState<number>(1);
  const sqm = (packages * paketinhalt).toFixed(2);

  const handlePackagesChange = (newValue: number) => {
    const value = Math.max(1, newValue); // Minimum 1 package
    setPackages(value);

    if (onQuantityChange) {
      const calculatedSqm = value * paketinhalt;
      onQuantityChange(calculatedSqm, value);
    }
  };

  const incrementPackages = () => {
    handlePackagesChange(packages + 1);
  };

  const decrementPackages = () => {
    handlePackagesChange(packages - 1);
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
      <div className="grid grid-cols-2 gap-6">
        {/* Paket-Input mit +/- Buttons */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Paket(e)
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={decrementPackages}
              className="w-10 h-10 rounded border border-gray-300 hover:bg-gray-200 font-bold text-xl"
            >
              −
            </button>
            <input
              type="number"
              value={packages}
              readOnly
              className="flex-1 h-10 text-center rounded border border-gray-300 bg-white"
            />
            <button
              type="button"
              onClick={incrementPackages}
              className="w-10 h-10 rounded border border-gray-300 hover:bg-gray-200 font-bold text-xl"
            >
              +
            </button>
          </div>
        </div>

        {/* Quadratmeter Anzeige */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Gesamt {einheit}
          </label>
          <div className="h-10 px-4 flex items-center rounded border border-gray-300 bg-gray-50 text-gray-700 font-medium">
            {sqm} {einheit}
          </div>
        </div>
      </div>
    </div>
  );
}
