'use client';

import type { SetQuantityCalculation, SetPriceCalculation } from '@/lib/setCalculations';

interface TotalPriceProps {
  quantities: SetQuantityCalculation;
  prices: SetPriceCalculation;
  einheit: string;
}

export default function TotalPrice({
  quantities,
  prices,
  einheit
}: TotalPriceProps) {
  const {
    totalDisplayPrice,
    comparisonPriceTotal,
    savings,
    savingsPercent,
    insulationSurcharge,
    baseboardSurcharge
  } = prices;

  const hasSavings = savings !== undefined && savings > 0;
  const hasInsulationSurcharge = insulationSurcharge > 0;
  const hasBaseboardSurcharge = baseboardSurcharge > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Total Price */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-700 text-lg">
          Gesamtsumme (inkl. MwSt.)
        </span>
        <div className="text-right">
          {hasSavings && comparisonPriceTotal && (
            <div className="text-gray-400 line-through text-sm">
              {comparisonPriceTotal.toFixed(2)}€
            </div>
          )}
          <span className="text-gray-900 font-bold text-3xl">
            {totalDisplayPrice.toFixed(2)}€
          </span>
        </div>
      </div>

      {/* Savings */}
      {hasSavings && savings && savingsPercent && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <div className="text-green-700 font-semibold text-lg">
            Du sparst {savings.toFixed(2)}€ ({savingsPercent.toFixed(0)}%)
          </div>
        </div>
      )}

      {/* Price breakdown */}
      <div className="text-gray-500 text-sm space-y-2">
        <div className="font-medium text-gray-700">Dein Set umfasst:</div>

        {/* Floor */}
        <div className="flex justify-between">
          <span>
            Boden: {quantities.floor.packages} Paket(e)
          </span>
          <span className="text-gray-400">
            = {quantities.floor.actualM2.toFixed(2)} {einheit}
          </span>
        </div>

        {/* Insulation */}
        {quantities.insulation && (
          <div className="flex justify-between">
            <span>
              Dämmung: {quantities.insulation.packages} Paket(e)
              {hasInsulationSurcharge && (
                <span className="text-red-600 text-xs ml-1">
                  (+{insulationSurcharge.toFixed(2)}€/{einheit})
                </span>
              )}
            </span>
            <span className="text-gray-400">
              = {quantities.insulation.actualM2.toFixed(2)} {einheit}
            </span>
          </div>
        )}

        {/* Baseboard */}
        {quantities.baseboard && (
          <div className="flex justify-between">
            <span>
              Sockelleisten: {quantities.baseboard.packages} Paket(e)
              {hasBaseboardSurcharge && (
                <span className="text-red-600 text-xs ml-1">
                  (+{baseboardSurcharge.toFixed(2)}€/lfm)
                </span>
              )}
            </span>
            <span className="text-gray-400">
              = {quantities.baseboard.actualLfm.toFixed(2)} lfm
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
