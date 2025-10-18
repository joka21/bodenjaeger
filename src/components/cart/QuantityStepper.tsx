'use client';

import React from 'react';

interface QuantityStepperProps {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 999,
  disabled = false,
}: QuantityStepperProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Menge verringern"
      >
        <svg
          className="w-4 h-4 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>

      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        disabled={disabled}
        min={min}
        max={max}
        className="w-16 h-8 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2e2d32] disabled:bg-gray-100 disabled:cursor-not-allowed"
        aria-label="Menge"
      />

      <button
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Menge erhöhen"
      >
        <svg
          className="w-4 h-4 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
