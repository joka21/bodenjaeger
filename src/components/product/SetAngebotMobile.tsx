'use client';

import Image from 'next/image';

interface SetAngebotMobileProps {
  setangebotTitel?: string;
  productName: string;
  productImage: string;
  basePrice: number;
  regularPrice: number;
  einheit: string;
  daemmungName: string;
  daemmungImage: string;
  daemmungSetPricePerUnit: number;  // ✅ Set-Preis (0 oder Aufpreis) - VOM PARENT
  daemmungRegularPricePerUnit: number;  // ✅ Regulärer Preis - VOM PARENT
  sockelleisteName: string;
  sockelleisteImage: string;
  sockelleisteSetPricePerUnit: number;  // ✅ Set-Preis (0 oder Aufpreis) - VOM PARENT
  sockelleisteRegularPricePerUnit: number;  // ✅ Regulärer Preis - VOM PARENT
  comparisonPriceTotal?: number;
  totalDisplayPrice?: number;
  savingsPercent?: number;
  onAddToCart?: () => void;
}

export default function SetAngebotMobile({
  setangebotTitel = 'Dein Set-Angebot',
  productName,
  productImage,
  basePrice,
  regularPrice,
  daemmungName,
  daemmungImage,
  daemmungSetPricePerUnit,
  daemmungRegularPricePerUnit,
  sockelleisteName,
  sockelleisteImage,
  sockelleisteSetPricePerUnit,
  sockelleisteRegularPricePerUnit,
  onAddToCart
}: SetAngebotMobileProps) {
  const hasDaemmung = daemmungName !== 'Trittschalldämmung';
  const hasSockelleiste = sockelleisteName !== 'Sockelleiste';

  // Calculate discount percentages
  const bodenDiscount = regularPrice > 0 ? Math.round(((regularPrice - basePrice) / regularPrice) * 100) : 0;
  const daemmungDiscount = daemmungRegularPricePerUnit && daemmungRegularPricePerUnit > 0
    ? Math.round(((daemmungRegularPricePerUnit - daemmungSetPricePerUnit) / daemmungRegularPricePerUnit) * 100)
    : 0;
  const sockelleisteDiscount = sockelleisteRegularPricePerUnit && sockelleisteRegularPricePerUnit > 0
    ? Math.round(((sockelleisteRegularPricePerUnit - sockelleisteSetPricePerUnit) / sockelleisteRegularPricePerUnit) * 100)
    : 0;

  // ✅ STATISCHER M²-PREIS für Set-Angebot (ändert sich NUR bei Produktwechsel)
  const setAngebotPreisProM2 = basePrice + daemmungSetPricePerUnit + sockelleisteSetPricePerUnit;
  const vergleichspreisProM2 = regularPrice + daemmungRegularPricePerUnit + sockelleisteRegularPricePerUnit;
  const ersparnisProzent = vergleichspreisProM2 > 0
    ? ((vergleichspreisProM2 - setAngebotPreisProM2) / vergleichspreisProM2) * 100
    : 0;

  return (
    <div className="bg-white rounded-lg p-4">
      {/* Badge Header */}
      <div className="inline-flex items-center px-3 py-1 mb-3 text-sm font-semibold text-white bg-[#ed1b24] rounded">
        {setangebotTitel}
      </div>

      {/* Produktzeilen */}
      <div className="flex flex-col gap-0">
        {/* Boden */}
        <div className="flex flex-row items-center justify-between gap-3 py-2 border-b border-[#e5e5e5]">
          <div className="w-10 h-10 flex-shrink-0 overflow-hidden rounded">
            <Image
              src={productImage}
              alt={productName}
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </div>
          <span className="flex-1 text-sm text-[#2e2d32] truncate">
            {productName}
          </span>
          <div className="flex flex-row items-center gap-2 flex-shrink-0">
            <span className="text-sm text-[#4c4c4c] line-through">
              {regularPrice.toFixed(2).replace('.', ',')} €
            </span>
            <span className="text-sm font-semibold text-[#ed1b24]">
              {basePrice.toFixed(2).replace('.', ',')} €
            </span>
            {bodenDiscount > 0 && (
              <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-semibold text-white bg-[#ed1b24] rounded">
                -{bodenDiscount}%
              </span>
            )}
          </div>
        </div>

        {/* Dämmung */}
        {hasDaemmung && (
          <div className="flex flex-row items-center justify-between gap-3 py-2 border-b border-[#e5e5e5]">
            <div className="w-10 h-10 flex-shrink-0 overflow-hidden rounded">
              <Image
                src={daemmungImage}
                alt={daemmungName}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            </div>
            <span className="flex-1 text-sm text-[#2e2d32] truncate">
              {daemmungName}
            </span>
            <div className="flex flex-row items-center gap-2 flex-shrink-0">
              {daemmungRegularPricePerUnit && daemmungRegularPricePerUnit > 0 && (
                <span className="text-sm text-[#4c4c4c] line-through">
                  {daemmungRegularPricePerUnit.toFixed(2).replace('.', ',')} €
                </span>
              )}
              <span className="text-sm font-semibold text-[#ed1b24]">
                {daemmungSetPricePerUnit.toFixed(2).replace('.', ',')} €
              </span>
              {daemmungDiscount > 0 && (
                <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-semibold text-white bg-[#ed1b24] rounded">
                  -{daemmungDiscount}%
                </span>
              )}
            </div>
          </div>
        )}

        {/* Sockelleiste */}
        {hasSockelleiste && (
          <div className="flex flex-row items-center justify-between gap-3 py-2 border-b border-[#e5e5e5]">
            <div className="w-10 h-10 flex-shrink-0 overflow-hidden rounded">
              <Image
                src={sockelleisteImage}
                alt={sockelleisteName}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            </div>
            <span className="flex-1 text-sm text-[#2e2d32] truncate">
              {sockelleisteName}
            </span>
            <div className="flex flex-row items-center gap-2 flex-shrink-0">
              {sockelleisteRegularPricePerUnit && sockelleisteRegularPricePerUnit > 0 && (
                <span className="text-sm text-[#4c4c4c] line-through">
                  {sockelleisteRegularPricePerUnit.toFixed(2).replace('.', ',')} €
                </span>
              )}
              <span className="text-sm font-semibold text-[#ed1b24]">
                {sockelleisteSetPricePerUnit.toFixed(2).replace('.', ',')} €
              </span>
              {sockelleisteDiscount > 0 && (
                <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-semibold text-white bg-[#ed1b24] rounded">
                  -{sockelleisteDiscount}%
                </span>
              )}
            </div>
          </div>
        )}

        {/* Gesamt-Zeile (KEIN Button!) - STATISCHER M²-PREIS */}
        <div className="flex flex-row items-center justify-between py-2 border-b border-[#e5e5e5]">
          <span className="text-sm font-semibold text-[#2e2d32]">
            Gesamt
          </span>
          <div className="flex flex-row items-center gap-2">
            {vergleichspreisProM2 > setAngebotPreisProM2 && (
              <span className="text-sm text-[#4c4c4c] line-through">
                {vergleichspreisProM2.toFixed(2).replace('.', ',')} €/m²
              </span>
            )}
            <span className="text-base font-bold text-[#ed1b24]">
              {setAngebotPreisProM2.toFixed(2).replace('.', ',')} €/m²
            </span>
          </div>
        </div>
      </div>

      {/* Gesamt-Block - Mobile Kompakt in EINER Zeile (STATISCHER M²-PREIS) */}
      <div className="mt-3 pt-3 border-t-2 border-[#e5e5e5]">
        {/* EINE Zeile: Gesamt + Preise + Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-base font-bold text-[#2e2d32]">Gesamt</span>
          <div className="flex items-center gap-2">
            {vergleichspreisProM2 > setAngebotPreisProM2 && (
              <span className="line-through text-sm text-[#4c4c4c]">
                {vergleichspreisProM2.toFixed(2).replace('.', ',')} €/m²
              </span>
            )}
            <span className="text-lg font-bold text-[#ed1b24]">
              {setAngebotPreisProM2.toFixed(2).replace('.', ',')} €/m²
            </span>
            {ersparnisProzent > 0 && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-semibold text-white bg-[#ed1b24] rounded">
                -{Math.round(ersparnisProzent)}%
              </span>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onAddToCart}
          className="w-full py-3 text-base font-semibold text-white bg-[#ed1b24] rounded-lg hover:bg-[#d11920] transition-colors"
        >
          In den Warenkorb
        </button>
      </div>
    </div>
  );
}
