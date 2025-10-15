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
  const [sqm, setSqm] = useState<number>(paketinhalt);
  const packages = Math.ceil(sqm / paketinhalt);

  const handleSqmChange = (newValue: number) => {
    const value = Math.max(paketinhalt, newValue); // Minimum 1 package worth
    setSqm(value);

    if (onQuantityChange) {
      const calculatedPackages = Math.ceil(value / paketinhalt);
      onQuantityChange(value, calculatedPackages);
    }
  };

  const incrementSqm = () => {
    handleSqmChange(sqm + paketinhalt);
  };

  const decrementSqm = () => {
    handleSqmChange(sqm - paketinhalt);
  };

  const incrementPackages = () => {
    handleSqmChange(sqm + paketinhalt);
  };

  const decrementPackages = () => {
    handleSqmChange(sqm - paketinhalt);
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

        {/* Quadratmeter mit +/- Buttons */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {einheit}
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={decrementSqm}
              className="w-10 h-10 rounded border border-gray-300 hover:bg-gray-200 font-bold text-xl"
            >
              −
            </button>
            <input
              type="number"
              value={sqm.toFixed(2)}
              readOnly
              className="flex-1 h-10 text-center rounded border border-gray-300 bg-white"
            />
            <button
              type="button"
              onClick={incrementSqm}
              className="w-10 h-10 rounded border border-gray-300 hover:bg-gray-200 font-bold text-xl"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
