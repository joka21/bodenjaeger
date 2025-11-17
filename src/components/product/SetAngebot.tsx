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
  // BACKEND PRICES - DIREKT AUS DER DATENBANK (keine Berechnung!)
  comparisonPriceTotal?: number;
  totalDisplayPrice?: number;
  savingsAmount?: number;
  savingsPercent?: number;  // ✅ KOMMT DIREKT VOM BACKEND - setangebot_ersparnis_prozent
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
  onProductSelection,
  comparisonPriceTotal,
  totalDisplayPrice,
  savingsAmount,
  savingsPercent
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
  // ✅ Jäger API returns prices as numbers, not strings
  const selectedDaemmungPrice = selectedDaemmung?.prices?.price
    ? parseFloat(selectedDaemmung.prices.price) / 100
    : (selectedDaemmung?.price || 0);
  const selectedSockelleistePrice = selectedSockelleiste?.prices?.price
    ? parseFloat(selectedSockelleiste.prices.price) / 100
    : (selectedSockelleiste?.price || 0);

  // Price difference from standard (for set offer calculation)
  // Only positive differences count (upgrading) - no discount for cheaper products
  const daemmungPriceDiff = hasDaemmung && selectedDaemmung
    ? Math.max(0, selectedDaemmungPrice - (daemmungRegularPrice || 0))
    : 0;
  const sockelleistePriceDiff = hasSockelleiste && selectedSockelleiste
    ? Math.max(0, selectedSockelleistePrice - (sockelleisteRegularPrice || 0))
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

  // ✅ USE BACKEND PRICES - DIRECTLY FROM DATABASE
  const displayComparisonPrice = comparisonPriceTotal || 0;
  const displaySetPrice = totalDisplayPrice || 0;
  const displaySavingsPercent = savingsPercent || 0;

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
    <div className="relative w-full overflow-hidden">
      {/* Roter Badge-Header - schwebt auf der Kante */}
      <div className="relative z-10 inline-block mb-[-36px] md:inline-block w-full md:w-auto text-center md:text-left">
        <span className="bg-red-600 text-white font-bold px-4 sm:px-6 py-2 rounded-full text-base sm:text-lg shadow-lg inline-block">
          {setangebotTitel}
        </span>
      </div>

      {/* Grauer Container mit Produkten */}
      <div className="bg-[#e5e5e5] rounded-md p-4 sm:p-6 pt-10 sm:pt-12 w-full">
        <div className={`grid grid-cols-1 ${gridCols} gap-3 md:gap-6 w-full`}>
        {/* Boden Card - KEIN Button */}
        <div className="space-y-3">
          <div className="text-center hidden md:block">
            <span className="text-sm font-medium text-gray-700">Boden</span>
          </div>
          {/* Unsichtbarer Platzhalter für Button-Höhe */}
          <div className="h-[36px] hidden md:block"></div>

          {/* Desktop Version */}
          <div className="hidden md:flex bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden min-h-[270px] flex-col">
            <div className="w-full aspect-square bg-gray-50 flex-shrink-0">
              <Image
                src={productImage}
                alt={productName}
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="px-4 py-2 flex flex-col flex-grow">
              <h3 className="text-xs font-semibold mb-2 text-left text-gray-900 line-clamp-2">
                {productName}
              </h3>
              <div className="mt-auto flex items-center justify-end gap-2 w-full text-[10px]">
                <span className="text-gray-400 line-through">
                  {regularPrice.toFixed(2).replace('.', ',')} €
                </span>
                <span className="font-bold text-red-600 whitespace-nowrap">
                  {basePrice.toFixed(2).replace('.', ',')} €/{einheit}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Version - 3 Abschnitte nebeneinander */}
          <div className="md:hidden grid grid-cols-[1.4fr_1.2fr_1.2fr] gap-2 sm:gap-3 items-end w-full overflow-hidden">
            {/* 1. Bild breiter und kleiner */}
            <div className="aspect-[4/3] bg-gray-50 rounded overflow-hidden">
              <Image
                src={productImage}
                alt={productName}
                width={400}
                height={533}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 2. Name */}
            <div className="flex flex-col justify-end min-w-0">
              <div className="text-[10px] font-bold text-gray-700 mb-1">Boden</div>
              <h3 className="text-xs font-semibold text-gray-900 line-clamp-3 break-words">
                {productName}
              </h3>
            </div>

            {/* 3. Preise nebeneinander */}
            <div className="flex flex-col justify-end items-end min-w-0">
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-gray-400 line-through text-[10px] whitespace-nowrap">
                  {regularPrice.toFixed(2).replace('.', ',')} €
                </span>
                <span className="font-bold text-red-600 text-xs whitespace-nowrap">
                  {basePrice.toFixed(2).replace('.', ',')} €/{einheit}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dämmung Card - MIT Button oben */}
        {hasDaemmung && (
          <div className="space-y-3">
            <div className="text-center hidden md:block">
              <span className="text-sm font-medium text-gray-700">Dämmung</span>
            </div>
            <button
              type="button"
              onClick={() => openModal('daemmung')}
              className="w-full bg-gray-800 text-white text-[11px] py-2 px-2 rounded-md hover:bg-gray-700 flex items-center justify-center gap-1 transition-colors duration-200 whitespace-nowrap hidden md:flex"
            >
              Andere Dämmung wählen
              <span>&gt;</span>
            </button>

            {/* Desktop Version */}
            <div className="hidden md:flex bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden min-h-[270px] flex-col">
              <div className="w-full aspect-square bg-gray-50 flex-shrink-0">
                <Image
                  src={selectedDaemmung?.images?.[0]?.src || daemmungImage}
                  alt={selectedDaemmung?.name || daemmungName}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="px-4 py-2 flex flex-col flex-grow">
                <h3 className="text-xs font-semibold mb-2 text-left text-gray-900 line-clamp-2">
                  {selectedDaemmung?.name || daemmungName}
                </h3>

                <div className="mt-auto flex items-center justify-between w-full gap-2 text-[10px]">
                  <span className="text-gray-600 whitespace-nowrap">
                    VE: {selectedDaemmung?.paketinhalt
                      ? `${selectedDaemmung.paketinhalt}${selectedDaemmung.einheit_short || 'm²'}`
                      : daemmungVE || '-'}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400 line-through whitespace-nowrap">
                      {(daemmungRegularPrice || daemmungPrice).toFixed(2).replace('.', ',')} €
                    </span>
                    <span className="font-bold whitespace-nowrap text-red-600 text-xs">
                      {daemmungPriceDiff <= 0
                        ? `0,00 €/m²`
                        : `+${daemmungPriceDiff.toFixed(2).replace('.', ',')} €/m²`
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Version - 3 Abschnitte nebeneinander */}
            <div className="md:hidden grid grid-cols-[1.4fr_1.2fr_1.2fr] gap-2 sm:gap-3 items-end w-full overflow-hidden">
              {/* 1. Bild breiter und kleiner */}
              <div className="aspect-[4/3] bg-gray-50 rounded overflow-hidden">
                <Image
                  src={selectedDaemmung?.images?.[0]?.src || daemmungImage}
                  alt={selectedDaemmung?.name || daemmungName}
                  width={400}
                  height={533}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 2. Name + Button */}
              <div className="flex flex-col justify-end min-w-0">
                <div className="text-[10px] font-bold text-gray-700 mb-1">Dämmung</div>
                <h3 className="text-xs font-semibold text-gray-900 line-clamp-2 mb-2 break-words">
                  {selectedDaemmung?.name || daemmungName}
                </h3>
                <button
                  type="button"
                  onClick={() => openModal('daemmung')}
                  className="bg-gray-800 text-white text-[9px] py-2 px-1.5 rounded hover:bg-gray-700 flex items-center justify-center gap-0.5 transition-colors duration-200 whitespace-nowrap w-full"
                >
                  Andere Dämmung
                  <span>&gt;</span>
                </button>
              </div>

              {/* 3. Preise nebeneinander */}
              <div className="flex flex-col justify-end items-end min-w-0">
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-gray-400 line-through text-[10px] whitespace-nowrap">
                    {(daemmungRegularPrice || daemmungPrice).toFixed(2).replace('.', ',')} €
                  </span>
                  <span className="font-bold text-red-600 text-xs whitespace-nowrap">
                    {daemmungPriceDiff <= 0
                      ? `0,00 €/m²`
                      : `+${daemmungPriceDiff.toFixed(2).replace('.', ',')} €/m²`
                    }
                  </span>
                </div>
                <div className="text-[8px] text-gray-500 italic mt-0.5">
                  5% Verschnitt
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sockelleiste Card - MIT Button oben */}
        {hasSockelleiste && (
          <div className="space-y-3">
            <div className="text-center hidden md:block">
              <span className="text-sm font-medium text-gray-700">Sockelleiste</span>
            </div>
            <button
              type="button"
              onClick={() => openModal('sockelleiste')}
              className="w-full bg-gray-800 text-white text-[11px] py-2 px-2 rounded-md hover:bg-gray-700 flex items-center justify-center gap-1 transition-colors duration-200 whitespace-nowrap hidden md:flex"
            >
              Andere Sockelleiste wählen
              <span>&gt;</span>
            </button>

            {/* Desktop Version */}
            <div className="hidden md:flex bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden min-h-[270px] flex-col">
              <div className="w-full aspect-square bg-gray-50 flex-shrink-0">
                <Image
                  src={selectedSockelleiste?.images?.[0]?.src || sockelleisteImage}
                  alt={selectedSockelleiste?.name || sockelleisteName}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="px-4 py-2 flex flex-col flex-grow">
                <h3 className="text-xs font-semibold mb-2 text-left text-gray-900 line-clamp-2">
                  {selectedSockelleiste?.name || sockelleisteName}
                </h3>

                <div className="mt-auto flex items-center justify-between w-full gap-2 text-[10px]">
                  <span className="text-gray-600 whitespace-nowrap">
                    VE: {selectedSockelleiste?.paketinhalt
                      ? `${selectedSockelleiste.paketinhalt}${selectedSockelleiste.einheit_short || 'lfm'}`
                      : sockelleisteVE || '-'}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400 line-through whitespace-nowrap">
                      {(sockelleisteRegularPrice || sockelleistePrice).toFixed(2).replace('.', ',')} €
                    </span>
                    <span className="font-bold whitespace-nowrap text-red-600 text-xs">
                      {sockelleistePriceDiff <= 0
                        ? `0,00 €/lfm`
                        : `+${sockelleistePriceDiff.toFixed(2).replace('.', ',')} €/lfm`
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Version - 3 Abschnitte nebeneinander */}
            <div className="md:hidden grid grid-cols-[1.4fr_1.2fr_1.2fr] gap-2 sm:gap-3 items-end w-full overflow-hidden">
              {/* 1. Bild breiter und kleiner */}
              <div className="aspect-[4/3] bg-gray-50 rounded overflow-hidden">
                <Image
                  src={selectedSockelleiste?.images?.[0]?.src || sockelleisteImage}
                  alt={selectedSockelleiste?.name || sockelleisteName}
                  width={400}
                  height={533}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 2. Name + Button */}
              <div className="flex flex-col justify-end min-w-0">
                <div className="text-[10px] font-bold text-gray-700 mb-1">Sockelleiste</div>
                <h3 className="text-xs font-semibold text-gray-900 line-clamp-2 mb-2 break-words">
                  {selectedSockelleiste?.name || sockelleisteName}
                </h3>
                <button
                  type="button"
                  onClick={() => openModal('sockelleiste')}
                  className="bg-gray-800 text-white text-[9px] py-2 px-1.5 rounded hover:bg-gray-700 flex items-center justify-center gap-0.5 transition-colors duration-200 whitespace-nowrap w-full"
                >
                  Andere Sockelleiste
                  <span>&gt;</span>
                </button>
              </div>

              {/* 3. Preise nebeneinander */}
              <div className="flex flex-col justify-end items-end min-w-0">
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-gray-400 line-through text-[10px] whitespace-nowrap">
                    {(sockelleisteRegularPrice || sockelleistePrice).toFixed(2).replace('.', ',')} €
                  </span>
                  <span className="font-bold text-red-600 text-xs whitespace-nowrap">
                    {sockelleistePriceDiff <= 0
                      ? `0,00 €/lfm`
                      : `+${sockelleistePriceDiff.toFixed(2).replace('.', ',')} €/lfm`
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>

        {/* Gesamt-Preiszeile - Desktop */}
        <div className="hidden md:flex justify-between items-center mt-8 pt-6 border-t-2 border-gray-200">
          <div className="flex items-center gap-4">
            <span className="text-3xl font-extrabold text-gray-700">Gesamt</span>
            {displayComparisonPrice > 0 && (
              <span className="line-through text-2xl text-gray-400">
                {displayComparisonPrice.toFixed(2).replace('.', ',')} €
              </span>
            )}
            <span className="text-3xl font-bold text-red-600">
              {displaySetPrice.toFixed(2).replace('.', ',')} €
            </span>
          </div>
          {displaySavingsPercent > 0 && (
            <div>
              <span className="bg-red-600 text-white px-4 py-2 rounded-lg text-xl font-bold shadow-lg">
                -{Math.round(displaySavingsPercent)}%
              </span>
            </div>
          )}
        </div>

        {/* Gesamt-Block - Mobile Kompakt */}
        <div className="md:hidden mt-6 pt-4 border-t-2 border-gray-200">
          {/* Badge in eigener Zeile rechtsbündig */}
          {displaySavingsPercent > 0 && (
            <div className="flex justify-end mb-2">
              <span className="bg-red-600 text-white px-3 py-1.5 rounded-md text-sm font-bold">
                -{Math.round(displaySavingsPercent)}%
              </span>
            </div>
          )}
          {/* Gesamt und Preise */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-extrabold text-gray-700">Gesamt</span>
            <div className="flex items-center gap-2">
              {displayComparisonPrice > 0 && (
                <span className="line-through text-sm text-gray-400">
                  {displayComparisonPrice.toFixed(2).replace('.', ',')} €
                </span>
              )}
              <span className="text-2xl font-bold text-red-600">
                {displaySetPrice.toFixed(2).replace('.', ',')} €
              </span>
            </div>
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
                  : (option.price || 0);
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
                        {option.paketinhalt && (
                          <p className="text-sm text-gray-500 mb-0.5">
                            VE: {option.paketinhalt}
                            {option.einheit_short || 'm²'}
                          </p>
                        )}
                        <p className="text-base font-medium text-gray-700">
                          {optionPrice.toFixed(2).replace('.', ',')} €/{option.einheit_short || einheit}
                        </p>
                      </div>

                      {/* Price Difference */}
                      <div className="text-right flex flex-col items-end gap-2">
                        {priceDifference <= 0 ? (
                          <div className="text-green-600 font-bold text-lg">
                            <div>0,00 €</div>
                            <div className="text-xs font-normal">(kostenlos)</div>
                          </div>
                        ) : (
                          <div className="text-red-600 font-bold text-lg">
                            <div>+{priceDifference.toFixed(2).replace('.', ',')} €</div>
                            <div className="text-xs font-normal">(Aufpreis)</div>
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
                  : (option.price || 0);
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
                        {option.paketinhalt && (
                          <p className="text-sm text-gray-500 mb-0.5">
                            VE: {option.paketinhalt}
                            {option.einheit_short || 'lfm'}
                          </p>
                        )}
                        <p className="text-base font-medium text-gray-700">
                          {optionPrice.toFixed(2).replace('.', ',')} €/{option.einheit_short || sockelleisteEinheit}
                        </p>
                      </div>

                      {/* Price Difference */}
                      <div className="text-right flex flex-col items-end gap-2">
                        {priceDifference <= 0 ? (
                          <div className="text-green-600 font-bold text-lg">
                            <div>0,00 €</div>
                            <div className="text-xs font-normal">(kostenlos)</div>
                          </div>
                        ) : (
                          <div className="text-red-600 font-bold text-lg">
                            <div>+{priceDifference.toFixed(2).replace('.', ',')} €</div>
                            <div className="text-xs font-normal">(Aufpreis)</div>
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
