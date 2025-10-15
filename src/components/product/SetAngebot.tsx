'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { StoreApiProduct } from '@/lib/woocommerce';

interface SetAngebotProps {
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
}

export default function SetAngebot({
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
  sockelleisteOptions = []
}: SetAngebotProps) {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'daemmung' | 'sockelleiste' | null>(null);

  // Check if we have at least one addition product (not a placeholder)
  const hasDaemmung = daemmungName !== 'Trittschalldämmung';
  const hasSockelleiste = sockelleisteName !== 'Sockelleiste';

  // Don't render if no addition products
  if (!hasDaemmung && !hasSockelleiste) {
    return null;
  }

  // Calculate grid columns based on number of products
  const productCount = 1 + (hasDaemmung ? 1 : 0) + (hasSockelleiste ? 1 : 0);
  const gridCols = productCount === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3';

  // Calculate totals
  const totalRegularPrice = regularPrice + (hasDaemmung ? (daemmungRegularPrice || daemmungPrice) : 0) + (hasSockelleiste ? (sockelleisteRegularPrice || sockelleistePrice) : 0);
  const totalSetPrice = basePrice + (hasDaemmung ? daemmungPrice : 0) + (hasSockelleiste ? sockelleistePrice : 0);
  const savingsPercent = Math.round(((totalRegularPrice - totalSetPrice) / totalRegularPrice) * 100);

  // Check if product is free (standard in set) or has surcharge
  const isDaemmungFree = daemmungPrice === 0;
  const isSockelleisteFree = sockelleistePrice === 0;

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
    <div className="bg-red-600 rounded-lg p-6">
      {/* Titel */}
      <h2 className="text-white text-2xl font-bold mb-6">Dein Set-Angebot</h2>

      <div className={`grid grid-cols-1 ${gridCols} gap-4`}>
        {/* Boden Card - KEIN Button */}
        <div className="bg-white rounded-lg p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
          <div className="text-center mb-3">
            <span className="text-sm text-gray-600 font-medium">Boden</span>
          </div>
          <Image
            src={productImage}
            alt={productName}
            width={200}
            height={200}
            className="mx-auto rounded-lg mb-3 object-contain"
          />
          <h3 className="text-sm font-medium mb-2 text-center text-gray-800 line-clamp-2 min-h-[40px]">
            {productName}
          </h3>
          <div className="text-center mt-3">
            <span className="text-gray-400 line-through text-sm mr-2">
              {regularPrice.toFixed(2)}€
            </span>
            <span className="text-red-600 font-bold text-lg">
              {basePrice.toFixed(2)}€/{einheit}
            </span>
          </div>
        </div>

        {/* Dämmung Card - MIT Button oben */}
        {hasDaemmung && (
          <div className="bg-white rounded-lg p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
            {/* Button GANZ OBEN */}
            <button
              type="button"
              onClick={() => openModal('daemmung')}
              className="w-full bg-gray-800 text-white text-xs py-2 px-3 rounded hover:bg-gray-700 flex items-center justify-center gap-1 mb-3 transition-colors duration-200"
            >
              Andere Dämmung wählen
              <span>→</span>
            </button>

            <Image
              src={daemmungImage}
              alt={daemmungName}
              width={180}
              height={180}
              className="mx-auto rounded-lg mb-3 object-contain"
            />
            <h3 className="text-sm font-medium mb-1 text-center text-gray-800 line-clamp-2 min-h-[40px]">
              {daemmungName}
            </h3>

            {/* VE-Zeile */}
            {daemmungVE && (
              <p className="text-xs text-gray-600 text-center mb-2">
                VE: {daemmungVE}
              </p>
            )}

            <div className="text-center mt-3">
              <span className="text-gray-400 line-through text-sm mr-2">
                {(daemmungRegularPrice || daemmungPrice).toFixed(2)}€
              </span>
              <span className="text-red-600 font-bold text-lg">
                {isDaemmungFree
                  ? `0,00€/${einheit}`
                  : `+${daemmungPrice.toFixed(2)}€/${einheit}`
                }
              </span>
            </div>
          </div>
        )}

        {/* Sockelleiste Card - MIT Button oben */}
        {hasSockelleiste && (
          <div className="bg-white rounded-lg p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
            {/* Button GANZ OBEN */}
            <button
              type="button"
              onClick={() => openModal('sockelleiste')}
              className="w-full bg-gray-800 text-white text-xs py-2 px-3 rounded hover:bg-gray-700 flex items-center justify-center gap-1 mb-3 transition-colors duration-200"
            >
              Andere Sockelleiste wählen
              <span>→</span>
            </button>

            <Image
              src={sockelleisteImage}
              alt={sockelleisteName}
              width={180}
              height={180}
              className="mx-auto rounded-lg mb-3 object-contain"
            />
            <h3 className="text-sm font-medium mb-1 text-center text-gray-800 line-clamp-2 min-h-[40px]">
              {sockelleisteName}
            </h3>

            {/* VE-Zeile */}
            {sockelleisteVE && (
              <p className="text-xs text-gray-600 text-center mb-2">
                VE: {sockelleisteVE}
              </p>
            )}

            <div className="text-center mt-3">
              <span className="text-gray-400 line-through text-sm mr-2">
                {(sockelleisteRegularPrice || sockelleistePrice).toFixed(2)}€
              </span>
              <span className="text-red-600 font-bold text-lg">
                {isSockelleisteFree
                  ? `0,00€/${sockelleisteEinheit}`
                  : `+${sockelleistePrice.toFixed(2)}€/${sockelleisteEinheit}`
                }
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Gesamt-Preiszeile */}
      <div className="flex justify-end items-center text-white mt-6">
        <span className="text-xl mr-4">Gesamt</span>
        <span className="line-through text-lg mr-2">
          {totalRegularPrice.toFixed(2)}€
        </span>
        <span className="text-3xl font-bold mr-3">
          {totalSetPrice.toFixed(2)}€/{einheit}
        </span>
        <span className="bg-red-800 px-3 py-1 rounded-full text-lg font-bold">
          -{savingsPercent}%
        </span>
      </div>

      {/* Modal für Produktauswahl */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">
                {modalType === 'daemmung' ? 'Dämmung wählen' : 'Sockelleiste wählen'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-3xl font-bold leading-none"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {modalType === 'daemmung' && daemmungOptions.map((option) => {
                const optionPrice = option.prices?.price
                  ? parseFloat(option.prices.price) / 100
                  : parseFloat(option.price || '0');
                const standardPrice = daemmungRegularPrice || 0;
                const priceDifference = optionPrice - standardPrice;
                const isStandard = option.name === daemmungName;

                return (
                  <div
                    key={option.id}
                    className={`border rounded-lg p-4 hover:border-red-600 cursor-pointer transition-colors ${
                      isStandard ? 'border-green-600 bg-green-50' : 'border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Radio Button */}
                      <input
                        type="radio"
                        name="daemmung-option"
                        checked={isStandard}
                        readOnly
                        className="w-5 h-5"
                      />

                      {/* Product Image */}
                      <Image
                        src={option.images?.[0]?.src || '/images/placeholder.jpg'}
                        alt={option.name}
                        width={80}
                        height={80}
                        className="rounded object-contain"
                      />

                      {/* Product Info */}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{option.name}</h4>
                        {option.jaeger_meta?.paketinhalt && (
                          <p className="text-sm text-gray-600">
                            VE: {option.jaeger_meta.paketinhalt}
                            {option.jaeger_meta.einheit_short || 'm²'}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          {optionPrice.toFixed(2)}€/{option.jaeger_meta?.einheit_short || einheit}
                        </p>
                      </div>

                      {/* Price Difference */}
                      <div className="text-right">
                        {priceDifference === 0 ? (
                          <span className="text-green-600 font-bold">
                            0,00€
                            <br />
                            <span className="text-xs">(kostenlos)</span>
                          </span>
                        ) : priceDifference > 0 ? (
                          <span className="text-red-600 font-bold">
                            +{priceDifference.toFixed(2)}€
                            <br />
                            <span className="text-xs">(Aufpreis)</span>
                          </span>
                        ) : (
                          <span className="text-green-600 font-bold">
                            {priceDifference.toFixed(2)}€
                            <br />
                            <span className="text-xs">(günstiger)</span>
                          </span>
                        )}
                        {isStandard && (
                          <div className="mt-1">
                            <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                              ✓ Standard
                            </span>
                          </div>
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
                const isStandard = option.name === sockelleisteName;

                return (
                  <div
                    key={option.id}
                    className={`border rounded-lg p-4 hover:border-red-600 cursor-pointer transition-colors ${
                      isStandard ? 'border-green-600 bg-green-50' : 'border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Radio Button */}
                      <input
                        type="radio"
                        name="sockelleiste-option"
                        checked={isStandard}
                        readOnly
                        className="w-5 h-5"
                      />

                      {/* Product Image */}
                      <Image
                        src={option.images?.[0]?.src || '/images/placeholder.jpg'}
                        alt={option.name}
                        width={80}
                        height={80}
                        className="rounded object-contain"
                      />

                      {/* Product Info */}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{option.name}</h4>
                        {option.jaeger_meta?.paketinhalt && (
                          <p className="text-sm text-gray-600">
                            VE: {option.jaeger_meta.paketinhalt}
                            {option.jaeger_meta.einheit_short || 'lfm'}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          {optionPrice.toFixed(2)}€/{option.jaeger_meta?.einheit_short || sockelleisteEinheit}
                        </p>
                      </div>

                      {/* Price Difference */}
                      <div className="text-right">
                        {priceDifference === 0 ? (
                          <span className="text-green-600 font-bold">
                            0,00€
                            <br />
                            <span className="text-xs">(kostenlos)</span>
                          </span>
                        ) : priceDifference > 0 ? (
                          <span className="text-red-600 font-bold">
                            +{priceDifference.toFixed(2)}€
                            <br />
                            <span className="text-xs">(Aufpreis)</span>
                          </span>
                        ) : (
                          <span className="text-green-600 font-bold">
                            {priceDifference.toFixed(2)}€
                            <br />
                            <span className="text-xs">(günstiger)</span>
                          </span>
                        )}
                        {isStandard && (
                          <div className="mt-1">
                            <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                              ✓ Standard
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
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
