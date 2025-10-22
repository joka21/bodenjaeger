'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { StoreApiProduct } from '@/lib/woocommerce';

interface SetAngebotProps {
  setangebotTitel?: string;
  productName: string;
  productImage: string;
  basePrice: number;
  regularPrice: number;
  einheit: string;
  daemmungName: string;
  daemmungImage: string;
  daemmungPrice: number;
  daemmungRegularPrice?: number;
  daemmungVE?: string;
  daemmungOptions?: StoreApiProduct[];
  sockelleisteName: string;
  sockelleisteImage: string;
  sockelleistePrice: number;
  sockelleisteRegularPrice?: number;
  sockelleisteVE?: string;
  sockelleisteEinheit?: string;
  sockelleisteOptions?: StoreApiProduct[];
  onProductSelection?: (daemmung: StoreApiProduct | null, sockelleiste: StoreApiProduct | null) => void;
}

export default function SetAngebot({
  setangebotTitel = 'Dein Set-Angebot',
  productName,
  productImage,
  basePrice,
  regularPrice,
  einheit,
  daemmungName,
  daemmungImage,
  daemmungPrice,
  daemmungRegularPrice,
  daemmungVE,
  daemmungOptions = [],
  sockelleisteName,
  sockelleisteImage,
  sockelleistePrice,
  sockelleisteRegularPrice,
  sockelleisteVE,
  sockelleisteEinheit = 'lfm',
  sockelleisteOptions = [],
  onProductSelection
}: SetAngebotProps) {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'daemmung' | 'sockelleiste' | null>(null);

  // Selected products state (starts with standard products)
  const [selectedDaemmung, setSelectedDaemmung] = useState<StoreApiProduct | null>(
    daemmungOptions.find(opt => opt.name === daemmungName) || null
  );
  const [selectedSockelleiste, setSelectedSockelleiste] = useState<StoreApiProduct | null>(
    sockelleisteOptions.find(opt => opt.name === sockelleisteName) || null
  );

  // Check if we have at least one addition product (not a placeholder)
  const hasDaemmung = daemmungName !== 'Trittschalldämmung';
  const hasSockelleiste = sockelleisteName !== 'Sockelleiste';

  // Calculate grid columns based on number of products
  const productCount = 1 + (hasDaemmung ? 1 : 0) + (hasSockelleiste ? 1 : 0);
  const gridCols = productCount === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3';

  // Calculate prices for selected products
  const selectedDaemmungPrice = selectedDaemmung?.prices?.price
    ? parseFloat(selectedDaemmung.prices.price) / 100
    : parseFloat(selectedDaemmung?.price || '0');
  const selectedSockelleistePrice = selectedSockelleiste?.prices?.price
    ? parseFloat(selectedSockelleiste.prices.price) / 100
    : parseFloat(selectedSockelleiste?.price || '0');

  // Price difference from standard (for set offer calculation)
  const daemmungPriceDiff = hasDaemmung && selectedDaemmung
    ? selectedDaemmungPrice - (daemmungRegularPrice || 0)
    : 0;
  const sockelleistePriceDiff = hasSockelleiste && selectedSockelleiste
    ? selectedSockelleistePrice - (sockelleisteRegularPrice || 0)
    : 0;

  // Notify parent component of product selection changes
  useEffect(() => {
    if (onProductSelection) {
      onProductSelection(
        hasDaemmung ? selectedDaemmung : null,
        hasSockelleiste ? selectedSockelleiste : null
      );
    }
  }, [selectedDaemmung, selectedSockelleiste, hasDaemmung, hasSockelleiste, onProductSelection]);

  // Don't render if no addition products
  if (!hasDaemmung && !hasSockelleiste) {
    return null;
  }

  // Calculate totals
  // totalRegularPrice = sum of ALL selected products at individual prices (crossed-out price)
  const totalRegularPrice = regularPrice
    + (hasDaemmung && selectedDaemmung ? selectedDaemmungPrice : 0)
    + (hasSockelleiste && selectedSockelleiste ? selectedSockelleistePrice : 0);

  // totalSetPrice = base price + price differences from standard products
  const totalSetPrice = basePrice + daemmungPriceDiff + sockelleistePriceDiff;

  const savingsPercent = totalRegularPrice > 0 ? Math.round(((totalRegularPrice - totalSetPrice) / totalRegularPrice) * 100) : 0;

  // Handle button clicks
  const openModal = (type: 'daemmung' | 'sockelleiste') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
  };

  return (
    <div className="relative">
      {/* Roter Badge-Header - schwebt auf der Kante */}
      <div className="relative z-10 inline-block mb-[-36px]">
        <span className="bg-red-600 text-white font-bold px-6 py-2 rounded-full text-lg shadow-lg">
          {setangebotTitel}
        </span>
      </div>

      {/* Grauer Container mit Produkten */}
      <div className="bg-gray-100 rounded-lg p-6 pt-12">
        <div className={`grid grid-cols-1 ${gridCols} gap-3`}>
        {/* Boden Card - KEIN Button */}
        <div className="space-y-3">
          <div className="text-center">
            <span className="text-sm font-medium text-gray-700">Boden</span>
          </div>
          {/* Unsichtbarer Platzhalter für Button-Höhe */}
          <div className="h-[36px]"></div>
          <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="w-full aspect-square bg-gray-50">
              <Image
                src={productImage}
                alt={productName}
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="px-4 py-3 flex flex-col h-full">
              <h3 className="text-xs font-semibold mb-2 text-left text-gray-900 line-clamp-2">
                {productName}
              </h3>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-xs text-gray-600">VE: -</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 line-through">
                    {regularPrice.toFixed(2).replace('.', ',')} €
                  </span>
                  <span className="text-sm font-bold text-red-600">
                    {basePrice.toFixed(2).replace('.', ',')} €/{einheit}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dämmung Card - MIT Button oben */}
        {hasDaemmung && (
          <div className="space-y-3">
            <div className="text-center">
              <span className="text-sm font-medium text-gray-700">Dämmung</span>
            </div>
            <button
              type="button"
              onClick={() => openModal('daemmung')}
              className="w-full bg-gray-800 text-white text-xs py-2 px-3 rounded-md hover:bg-gray-700 flex items-center justify-center gap-1.5 transition-colors duration-200 whitespace-nowrap"
            >
              Andere Dämmung wählen
              <span>&gt;</span>
            </button>
            <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="w-full aspect-square bg-gray-50">
                <Image
                  src={selectedDaemmung?.images?.[0]?.src || daemmungImage}
                  alt={selectedDaemmung?.name || daemmungName}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="px-4 py-3 flex flex-col h-full">
                <h3 className="text-xs font-semibold mb-2 text-left text-gray-900 line-clamp-2">
                  {selectedDaemmung?.name || daemmungName}
                </h3>

                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    VE: {selectedDaemmung?.jaeger_meta?.paketinhalt
                      ? `${selectedDaemmung.jaeger_meta.paketinhalt}${selectedDaemmung.jaeger_meta.einheit_short || 'm²'}`
                      : daemmungVE || '-'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 line-through">
                      {(daemmungRegularPrice || daemmungPrice).toFixed(2).replace('.', ',')} €
                    </span>
                    <span className="text-sm font-bold text-red-600">
                      {daemmungPriceDiff === 0
                        ? `0,00 €/${einheit}`
                        : `+${daemmungPriceDiff.toFixed(2).replace('.', ',')} €/${einheit}`
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sockelleiste Card - MIT Button oben */}
        {hasSockelleiste && (
          <div className="space-y-3">
            <div className="text-center">
              <span className="text-sm font-medium text-gray-700">Sockelleiste</span>
            </div>
            <button
              type="button"
              onClick={() => openModal('sockelleiste')}
              className="w-full bg-gray-800 text-white text-xs py-2 px-3 rounded-md hover:bg-gray-700 flex items-center justify-center gap-1.5 transition-colors duration-200 whitespace-nowrap"
            >
              Andere Sockelleiste wählen
              <span>&gt;</span>
            </button>
            <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="w-full aspect-square bg-gray-50">
                <Image
                  src={selectedSockelleiste?.images?.[0]?.src || sockelleisteImage}
                  alt={selectedSockelleiste?.name || sockelleisteName}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="px-4 py-3 flex flex-col h-full">
                <h3 className="text-xs font-semibold mb-2 text-left text-gray-900 line-clamp-2">
                  {selectedSockelleiste?.name || sockelleisteName}
                </h3>

                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    VE: {selectedSockelleiste?.jaeger_meta?.paketinhalt
                      ? `${selectedSockelleiste.jaeger_meta.paketinhalt}${selectedSockelleiste.jaeger_meta.einheit_short || 'lfm'}`
                      : sockelleisteVE || '-'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 line-through">
                      {(sockelleisteRegularPrice || sockelleistePrice).toFixed(2).replace('.', ',')} €
                    </span>
                    <span className="text-sm font-bold text-red-600">
                      {sockelleistePriceDiff === 0
                        ? `0,00 €/${sockelleisteEinheit}`
                        : `+${sockelleistePriceDiff.toFixed(2).replace('.', ',')} €/${sockelleisteEinheit}`
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>

        {/* Gesamt-Preiszeile */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t-2 border-gray-200">
          <div className="flex flex-col gap-1">
            <span className="text-lg font-medium text-gray-700">Gesamt</span>
            <span className="line-through text-sm text-gray-400">
              {totalRegularPrice.toFixed(2).replace('.', ',')} €
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-4xl font-bold text-red-600">
              {totalSetPrice.toFixed(2).replace('.', ',')} €<span className="text-2xl">/{einheit}</span>
            </span>
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg text-xl font-bold shadow-lg">
              -{savingsPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Modal für Produktauswahl */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">
                {modalType === 'daemmung' ? 'Dämmung wählen' : 'Sockelleiste wählen'}
              </h3>
              <button
                onClick={closeModal}
                className="text-white hover:text-red-100 text-3xl font-bold leading-none transition-colors"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-3 overflow-y-auto max-h-[calc(90vh-200px)]">
              {modalType === 'daemmung' && daemmungOptions.map((option) => {
                const optionPrice = option.prices?.price
                  ? parseFloat(option.prices.price) / 100
                  : parseFloat(option.price || '0');
                const standardPrice = daemmungRegularPrice || 0;
                const priceDifference = optionPrice - standardPrice;
                const isSelected = selectedDaemmung?.id === option.id;
                const isStandard = option.name === daemmungName;

                return (
                  <div
                    key={option.id}
                    onClick={() => setSelectedDaemmung(option)}
                    className={`border-2 rounded-xl p-5 hover:border-red-600 hover:shadow-lg cursor-pointer transition-all duration-200 ${
                      isSelected ? 'border-red-600 bg-red-50 shadow-md' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      {/* Radio Button */}
                      <input
                        type="radio"
                        name="daemmung-option"
                        checked={isSelected}
                        onChange={() => setSelectedDaemmung(option)}
                        className="w-5 h-5 accent-red-600"
                      />

                      {/* Product Image */}
                      <Image
                        src={option.images?.[0]?.src || '/images/placeholder.jpg'}
                        alt={option.name}
                        width={90}
                        height={90}
                        className="rounded-lg object-contain"
                      />

                      {/* Product Info */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{option.name}</h4>
                        {option.jaeger_meta?.paketinhalt && (
                          <p className="text-sm text-gray-500 mb-0.5">
                            VE: {option.jaeger_meta.paketinhalt}
                            {option.jaeger_meta.einheit_short || 'm²'}
                          </p>
                        )}
                        <p className="text-base font-medium text-gray-700">
                          {optionPrice.toFixed(2).replace('.', ',')} €/{option.jaeger_meta?.einheit_short || einheit}
                        </p>
                      </div>

                      {/* Price Difference */}
                      <div className="text-right flex flex-col items-end gap-2">
                        {priceDifference === 0 ? (
                          <div className="text-green-600 font-bold text-lg">
                            <div>0,00 €</div>
                            <div className="text-xs font-normal">(kostenlos)</div>
                          </div>
                        ) : priceDifference > 0 ? (
                          <div className="text-red-600 font-bold text-lg">
                            <div>+{priceDifference.toFixed(2).replace('.', ',')} €</div>
                            <div className="text-xs font-normal">(Aufpreis)</div>
                          </div>
                        ) : (
                          <div className="text-green-600 font-bold text-lg">
                            <div>{priceDifference.toFixed(2).replace('.', ',')} €</div>
                            <div className="text-xs font-normal">(günstiger)</div>
                          </div>
                        )}
                        {isStandard && (
                          <span className="text-xs bg-green-600 text-white px-3 py-1 rounded-full font-semibold">
                            ✓ Standard
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {modalType === 'sockelleiste' && sockelleisteOptions.map((option) => {
                const optionPrice = option.prices?.price
                  ? parseFloat(option.prices.price) / 100
                  : parseFloat(option.price || '0');
                const standardPrice = sockelleisteRegularPrice || 0;
                const priceDifference = optionPrice - standardPrice;
                const isSelected = selectedSockelleiste?.id === option.id;
                const isStandard = option.name === sockelleisteName;

                return (
                  <div
                    key={option.id}
                    onClick={() => setSelectedSockelleiste(option)}
                    className={`border-2 rounded-xl p-5 hover:border-red-600 hover:shadow-lg cursor-pointer transition-all duration-200 ${
                      isSelected ? 'border-red-600 bg-red-50 shadow-md' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      {/* Radio Button */}
                      <input
                        type="radio"
                        name="sockelleiste-option"
                        checked={isSelected}
                        onChange={() => setSelectedSockelleiste(option)}
                        className="w-5 h-5 accent-red-600"
                      />

                      {/* Product Image */}
                      <Image
                        src={option.images?.[0]?.src || '/images/placeholder.jpg'}
                        alt={option.name}
                        width={90}
                        height={90}
                        className="rounded-lg object-contain"
                      />

                      {/* Product Info */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{option.name}</h4>
                        {option.jaeger_meta?.paketinhalt && (
                          <p className="text-sm text-gray-500 mb-0.5">
                            VE: {option.jaeger_meta.paketinhalt}
                            {option.jaeger_meta.einheit_short || 'lfm'}
                          </p>
                        )}
                        <p className="text-base font-medium text-gray-700">
                          {optionPrice.toFixed(2).replace('.', ',')} €/{option.jaeger_meta?.einheit_short || sockelleisteEinheit}
                        </p>
                      </div>

                      {/* Price Difference */}
                      <div className="text-right flex flex-col items-end gap-2">
                        {priceDifference === 0 ? (
                          <div className="text-green-600 font-bold text-lg">
                            <div>0,00 €</div>
                            <div className="text-xs font-normal">(kostenlos)</div>
                          </div>
                        ) : priceDifference > 0 ? (
                          <div className="text-red-600 font-bold text-lg">
                            <div>+{priceDifference.toFixed(2).replace('.', ',')} €</div>
                            <div className="text-xs font-normal">(Aufpreis)</div>
                          </div>
                        ) : (
                          <div className="text-green-600 font-bold text-lg">
                            <div>{priceDifference.toFixed(2).replace('.', ',')} €</div>
                            <div className="text-xs font-normal">(günstiger)</div>
                          </div>
                        )}
                        {isStandard && (
                          <span className="text-xs bg-green-600 text-white px-3 py-1 rounded-full font-semibold">
                            ✓ Standard
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t-2 border-gray-200 p-6 flex justify-end gap-4">
              <button
                onClick={closeModal}
                className="px-8 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-100 hover:border-gray-400 transition-all font-semibold text-gray-700"
              >
                Abbrechen
              </button>
              <button
                onClick={closeModal}
                className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold shadow-lg hover:shadow-xl"
              >
                Auswählen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
