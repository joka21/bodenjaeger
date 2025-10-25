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
    <div className="mb-6">
      {/* Info Badge - Moved below labels */}
      <div className="flex items-center mb-4 text-sm text-gray-500">
        <svg
          className="w-4 h-4 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        <span>1 Paket = {paketinhalt} {einheit}</span>
      </div>

      {/* Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Paket Counter */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <label className="text-sm font-medium text-gray-700">
              Paket(e)
            </label>
          </div>

          {/* Counter Container with Dividers */}
          <div className="bg-gray-100 rounded-xl shadow-sm overflow-hidden flex items-stretch h-12">
            {/* Minus Button */}
            <button
              type="button"
              onClick={decrementPackages}
              className="flex-1 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-700 font-bold text-xl disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={packages <= 1}
            >
              −
            </button>

            {/* Divider */}
            <div className="w-px bg-gray-300"></div>

            {/* Value Display/Input */}
            <input
              type="number"
              value={packagesInputValue}
              onChange={handlePackagesInputChange}
              onBlur={handlePackagesBlur}
              min="1"
              className="flex-1 text-center bg-transparent border-0 outline-none text-gray-900 font-semibold text-lg appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              style={{ MozAppearance: 'textfield' }}
            />

            {/* Divider */}
            <div className="w-px bg-gray-300"></div>

            {/* Plus Button */}
            <button
              type="button"
              onClick={incrementPackages}
              className="flex-1 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-700 font-bold text-xl"
            >
              +
            </button>
          </div>
        </div>

        {/* Quadratmeter Counter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quadratmeter
          </label>

          {/* Counter Container with Dividers */}
          <div className="bg-gray-100 rounded-xl shadow-sm overflow-hidden flex items-stretch h-12">
            {/* Minus Button */}
            <button
              type="button"
              onClick={decrementSqm}
              className="flex-1 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-700 font-bold text-xl disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={sqm <= paketinhalt}
            >
              −
            </button>

            {/* Divider */}
            <div className="w-px bg-gray-300"></div>

            {/* Value Display/Input */}
            <input
              type="number"
              value={sqmInputValue}
              onChange={handleSqmInputChange}
              onBlur={handleSqmBlur}
              min={paketinhalt}
              step="0.01"
              className="flex-1 text-center bg-transparent border-0 outline-none text-gray-900 font-semibold text-lg appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              style={{ MozAppearance: 'textfield' }}
            />

            {/* Divider */}
            <div className="w-px bg-gray-300"></div>

            {/* Plus Button */}
            <button
              type="button"
              onClick={incrementSqm}
              className="flex-1 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-700 font-bold text-xl"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
