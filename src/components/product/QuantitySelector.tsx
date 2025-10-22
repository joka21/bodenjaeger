'use client';

import { useState } from 'react';

interface QuantitySelectorProps {
  paketinhalt: number;
  einheit: string;
  onQuantityChange?: (packages: number, sqm: number) => void;
}

export default function QuantitySelector({
  paketinhalt,
  einheit,
  onQuantityChange
}: QuantitySelectorProps) {
  const [sqm, setSqm] = useState<number>(paketinhalt);
  const [sqmInputValue, setSqmInputValue] = useState<string>(paketinhalt.toFixed(2));
  const [packagesInputValue, setPackagesInputValue] = useState<string>(Math.ceil(paketinhalt / paketinhalt).toString());

  const packages = Math.ceil(sqm / paketinhalt);

  const handleSqmChange = (newValue: number) => {
    const value = Math.max(paketinhalt, newValue); // Minimum 1 package worth
    setSqm(value);

    if (onQuantityChange) {
      const calculatedPackages = Math.ceil(value / paketinhalt);
      onQuantityChange(calculatedPackages, value);
    }
  };

  const handlePackagesInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPackagesInputValue(value);

    // Allow empty input during typing
    if (value === '') return;

    const inputValue = parseInt(value);
    if (!isNaN(inputValue) && inputValue > 0) {
      const newSqm = inputValue * paketinhalt;
      setSqm(newSqm);
      setSqmInputValue(newSqm.toFixed(2));

      if (onQuantityChange) {
        onQuantityChange(inputValue, newSqm);
      }
    }
  };

  const handlePackagesBlur = () => {
    // On blur, ensure we have a valid value
    if (packagesInputValue === '' || parseInt(packagesInputValue) < 1) {
      setPackagesInputValue('1');
      const newSqm = paketinhalt;
      setSqm(newSqm);
      setSqmInputValue(newSqm.toFixed(2));

      if (onQuantityChange) {
        onQuantityChange(1, newSqm);
      }
    }
  };

  const handleSqmInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSqmInputValue(value);

    // Allow empty input during typing
    if (value === '') return;

    const inputValue = parseFloat(value);
    if (!isNaN(inputValue) && inputValue > 0) {
      setSqm(inputValue);
      const calculatedPackages = Math.ceil(inputValue / paketinhalt);
      setPackagesInputValue(calculatedPackages.toString());

      if (onQuantityChange) {
        onQuantityChange(calculatedPackages, inputValue);
      }
    }
  };

  const handleSqmBlur = () => {
    // On blur, ensure we have a valid value
    if (sqmInputValue === '' || parseFloat(sqmInputValue) < paketinhalt) {
      setSqmInputValue(paketinhalt.toFixed(2));
      setSqm(paketinhalt);
      setPackagesInputValue('1');

      if (onQuantityChange) {
        onQuantityChange(1, paketinhalt);
      }
    } else {
      // Format the value on blur
      setSqmInputValue(parseFloat(sqmInputValue).toFixed(2));
    }
  };

  const incrementSqm = () => {
    const newSqm = sqm + paketinhalt;
    setSqm(newSqm);
    setSqmInputValue(newSqm.toFixed(2));
    const newPackages = Math.ceil(newSqm / paketinhalt);
    setPackagesInputValue(newPackages.toString());

    if (onQuantityChange) {
      onQuantityChange(newPackages, newSqm);
    }
  };

  const decrementSqm = () => {
    const newSqm = Math.max(paketinhalt, sqm - paketinhalt);
    setSqm(newSqm);
    setSqmInputValue(newSqm.toFixed(2));
    const newPackages = Math.ceil(newSqm / paketinhalt);
    setPackagesInputValue(newPackages.toString());

    if (onQuantityChange) {
      onQuantityChange(newPackages, newSqm);
    }
  };

  const incrementPackages = () => {
    const newPackages = packages + 1;
    const newSqm = newPackages * paketinhalt;
    setSqm(newSqm);
    setSqmInputValue(newSqm.toFixed(2));
    setPackagesInputValue(newPackages.toString());

    if (onQuantityChange) {
      onQuantityChange(newPackages, newSqm);
    }
  };

  const decrementPackages = () => {
    const newPackages = Math.max(1, packages - 1);
    const newSqm = newPackages * paketinhalt;
    setSqm(newSqm);
    setSqmInputValue(newSqm.toFixed(2));
    setPackagesInputValue(newPackages.toString());

    if (onQuantityChange) {
      onQuantityChange(newPackages, newSqm);
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
              value={packagesInputValue}
              onChange={handlePackagesInputChange}
              onBlur={handlePackagesBlur}
              min="1"
              className="flex-1 h-10 text-center rounded border border-gray-300 bg-white focus:border-red-600 focus:outline-none"
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
              value={sqmInputValue}
              onChange={handleSqmInputChange}
              onBlur={handleSqmBlur}
              min={paketinhalt}
              step="0.01"
              className="flex-1 h-10 text-center rounded border border-gray-300 bg-white focus:border-red-600 focus:outline-none"
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
