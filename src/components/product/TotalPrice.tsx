'use client';

interface TotalPriceProps {
  paketpreis: number;        // Regular package price
  paketpreis_s?: number;     // Sale package price (if on sale)
  packages: number;          // Current number of packages
  sqm: number;              // Current sqm
  einheit: string;          // Unit (e.g. "m²")
  selectedDaemmungPrice?: number;      // Price of selected Dämmung
  selectedSockelleistePrice?: number;  // Price of selected Sockelleiste
}

export default function TotalPrice({
  paketpreis,
  paketpreis_s,
  packages,
  sqm,
  einheit,
  selectedDaemmungPrice = 0,
  selectedSockelleistePrice = 0
}: TotalPriceProps) {
  // Determine which price to use (paketpreis is price per package)
  const isOnSale = paketpreis_s !== undefined && paketpreis_s !== null && paketpreis_s > 0;
  const activePrice = isOnSale ? paketpreis_s : paketpreis;

  // selectedDaemmungPrice and selectedSockelleistePrice are price differences per m²
  // activePrice is price per package
  // So: total = (price_per_package + diff_per_m²) × packages
  const pricePerPackage = activePrice + selectedDaemmungPrice + selectedSockelleistePrice;
  const totalPrice = pricePerPackage * packages;

  // Calculate savings if on sale
  const regularPricePerPackage = paketpreis + selectedDaemmungPrice + selectedSockelleistePrice;
  const totalRegularPrice = regularPricePerPackage * packages;
  const savings = isOnSale ? totalRegularPrice - totalPrice : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Total Price */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-700 text-lg">
          Gesamtsumme (inkl. MwSt.)
        </span>
        <span className="text-gray-900 font-bold text-3xl">
          {totalPrice.toFixed(2)}€
        </span>
      </div>

      {/* Savings */}
      {isOnSale && savings > 0 && (
        <div className="text-green-600 font-semibold text-sm mb-4">
          Du sparst {savings.toFixed(2)}€
        </div>
      )}

      {/* Price per unit info */}
      <div className="text-gray-500 text-sm">
        {pricePerPackage.toFixed(2)}€ pro Paket × {packages} Paket(e)
        <br />
        = {sqm.toFixed(2)} {einheit}
      </div>
    </div>
  );
}
