'use client';

import React from 'react';
import { CheckoutStep } from '@/types/checkout';

interface ProgressIndicatorProps {
  currentStep: CheckoutStep;
}

const steps = [
  { id: 'contact', label: 'Kontakt & Versand', number: 1 },
  { id: 'payment', label: 'Zahlung', number: 2 },
  { id: 'review', label: 'Überprüfung', number: 3 },
];

export default function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const getCurrentStepIndex = () => {
    return steps.findIndex((step) => step.id === currentStep);
  };

  const currentIndex = getCurrentStepIndex();

  return (
    <div className="w-full py-8">
      {/* Desktop Progress Bar */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isUpcoming = index > currentIndex;

            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  {/* Step Circle */}
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                      transition-all duration-300
                      ${
                        isCompleted
                          ? 'bg-[#4CAF50] text-white'
                          : isCurrent
                            ? 'bg-[#2e2d32] text-white ring-4 ring-[#2e2d32]/20'
                            : 'bg-gray-200 text-gray-400'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </div>

                  {/* Step Label */}
                  <div
                    className={`
                      mt-2 text-sm font-medium text-center
                      ${isCurrent ? 'text-[#2e2d32]' : isCompleted ? 'text-gray-700' : 'text-gray-400'}
                    `}
                  >
                    {step.label}
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-4 h-0.5 bg-gray-200 relative">
                    <div
                      className={`
                        absolute top-0 left-0 h-full bg-[#4CAF50] transition-all duration-500
                        ${isCompleted ? 'w-full' : 'w-0'}
                      `}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Mobile Progress Bar */}
      <div className="md:hidden">
        <div className="max-w-md mx-auto px-4">
          {/* Current Step Display */}
          <div className="text-center mb-4">
            <div className="text-sm text-gray-500 mb-1">
              Schritt {currentIndex + 1} von {steps.length}
            </div>
            <div className="text-lg font-semibold text-[#2e2d32]">
              {steps[currentIndex].label}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4CAF50] transition-all duration-500 ease-out"
                style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Dots */}
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => {
              const isCompleted = index < currentIndex;
              const isCurrent = index === currentIndex;

              return (
                <div
                  key={step.id}
                  className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold
                    transition-all duration-300
                    ${
                      isCompleted
                        ? 'bg-[#4CAF50] text-white'
                        : isCurrent
                          ? 'bg-[#2e2d32] text-white'
                          : 'bg-gray-200 text-gray-400'
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
