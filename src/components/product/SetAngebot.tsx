import Image from 'next/image';

interface SetAngebotProps {
  productName: string;
  productImage: string;
  basePrice: number;
  regularPrice: number;
  einheit: string;
}

export default function SetAngebot({
  productName,
  productImage,
  basePrice,
  regularPrice,
  einheit
}: SetAngebotProps) {
  // Calculate savings
  const savings = regularPrice - basePrice;
  const savingsPercent = Math.round((savings / regularPrice) * 100);

  return (
    <div className="bg-red-600 rounded-lg p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">
        Dein Set-Angebot
      </h2>

      {/* Product Image */}
      <div className="mb-4">
        <div className="relative w-full h-48 bg-white rounded-lg overflow-hidden">
          <Image
            src={productImage}
            alt={productName}
            fill
            className="object-contain p-4"
          />
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-lg">Einzelpreis:</span>
          <span className="text-xl line-through opacity-75">
            {regularPrice.toFixed(2)} €/{einheit}
          </span>
        </div>

        <div className="flex items-baseline justify-between border-t border-white/30 pt-2">
          <span className="text-lg font-semibold">Set-Preis:</span>
          <span className="text-3xl font-bold">
            {basePrice.toFixed(2)} €/{einheit}
          </span>
        </div>

        {/* Savings Badge */}
        <div className="bg-white text-red-600 rounded-lg px-4 py-2 text-center font-bold mt-4">
          Du sparst {savings.toFixed(2)} € ({savingsPercent}%)
        </div>
      </div>

      {/* Info Text */}
      <p className="mt-4 text-sm opacity-90">
        Profitiere von unserem exklusiven Set-Angebot und spare bares Geld!
      </p>
    </div>
  );
}
