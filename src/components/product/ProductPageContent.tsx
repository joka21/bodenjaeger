'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { MinusIcon, PlusIcon } from 'lucide-react';
import type { StoreApiProduct } from '@/lib/woocommerce';
import { calculateSetQuantities } from '@/lib/setCalculations';
import { useCart } from '@/contexts/CartContext';
import { useAlert } from '@/hooks/useAlert';
import AlertModal from '@/components/AlertModal';
import ImageGallery from './ImageGallery';
import ProductInfo from './ProductInfo';
import QuantitySelector from './QuantitySelector';
import TotalPrice from './TotalPrice';
import ZubehoerSlider from './ZubehoerSlider';

interface ProductPageContentProps {
  product: StoreApiProduct;
  daemmungProduct: StoreApiProduct | null;
  sockelleisteProduct: StoreApiProduct | null;
  daemmungOptions: StoreApiProduct[];
  sockelleisteOptions: StoreApiProduct[];
}

export default function ProductPageContent({
  product,
  daemmungProduct,
  sockelleisteProduct,
  daemmungOptions,
  sockelleisteOptions
}: ProductPageContentProps) {
  // ✅ USE ROOT-LEVEL FIELDS (backend/ROOT_LEVEL_FIELDS.md)
  const paketinhalt = product.paketinhalt || 1;
  const einheit = product.einheit_short || 'm²';

  // Cart context
  const { cartItems, addSampleToCart, getSampleCount, getFreeSamplesRemaining } = useCart();

  // Alert modal
  const { alertState, showSuccess, showError, showInfo, closeAlert } = useAlert();

  // State for wanted m² (user input)
  const [wantedM2, setWantedM2] = useState(paketinhalt);

  // State for selected addition products
  const [selectedDaemmung, setSelectedDaemmung] = useState<StoreApiProduct | null>(daemmungProduct);
  const [selectedSockelleiste, setSelectedSockelleiste] = useState<StoreApiProduct | null>(sockelleisteProduct);

  // State for sample order loading
  const [isOrderingSample, setIsOrderingSample] = useState(false);

  // Check if product is a floor product (only floors have samples)
  const isFloorProduct = useMemo(() => {
    if (!product.categories || !Array.isArray(product.categories)) return false;

    const floorCategories = ['vinylboden', 'klebe-vinyl', 'rigid-vinyl', 'laminat', 'parkett', 'teppichboden'];
    return product.categories.some(cat =>
      floorCategories.includes(cat.slug.toLowerCase())
    );
  }, [product.categories]);

  // Check if product is an accessory (simple layout)
  const isAccessory = useMemo(() => {
    if (!product.categories || !Array.isArray(product.categories)) return false;
    const accessoryCategories = ['zubehoer', 'sockelleisten', 'daemmung'];
    return product.categories.some(cat =>
      accessoryCategories.includes(cat.slug.toLowerCase())
    );
  }, [product.categories]);

  // Calculate quantities ONLY (no prices - prices come from backend!)
  const quantities = useMemo(() => {
    if (!product || wantedM2 <= 0) return null;

    return calculateSetQuantities(
      wantedM2,
      product,
      selectedDaemmung,
      selectedSockelleiste,
      undefined, // customInsulationM2
      undefined, // customBaseboardLfm
      daemmungProduct, // standardInsulationProduct
      sockelleisteProduct // standardBaseboardProduct
    );
  }, [wantedM2, product, selectedDaemmung, selectedSockelleiste, daemmungProduct, sockelleisteProduct]);

  // ✅ VOLLSTÄNDIGE SET-ANGEBOT BERECHNUNG
  // Basierend auf: SETANGEBOT_BERECHNUNG_KOMPLETT.md
  const prices = useMemo(() => {
    if (!product || !quantities) return null;

    // SCHRITT 1: BODEN BERECHNUNG
    // Set-Preis (für den Warenkorb und Gesamt-Set-Preis)
    const bodenPricePerM2 = product.setangebot_gesamtpreis || product.price || 0;
    const bodenPriceTotal = quantities.floor.actualM2 * bodenPricePerM2;

    // Vergleichspreis (für die durchgestrichene Preisanzeige im SetAngebot)
    const bodenComparisonPricePerM2 = product.setangebot_einzelpreis || product.uvp || product.price || 0;
    const bodenComparisonPriceTotal = quantities.floor.actualM2 * bodenComparisonPricePerM2;

    console.log('🔧 BODEN PREIS DEBUG:', {
      produktName: product.name,
      setangebot_einzelpreis: product.setangebot_einzelpreis,
      setangebot_gesamtpreis: product.setangebot_gesamtpreis,
      uvp: product.uvp,
      price: product.price,
      verwendeterVergleichspreis: bodenComparisonPricePerM2,
      verwendeterSetPreis: bodenPricePerM2,
      quelle: product.setangebot_einzelpreis ? 'setangebot_einzelpreis' : (product.uvp ? 'uvp' : 'price')
    });

    // SCHRITT 2: DÄMMUNG BERECHNUNG (falls vorhanden)
    let daemmungRegularPrice = 0;
    let daemmungSetPrice = 0;
    let daemmungSetPricePerUnit = 0;  // ✅ NEU: Einzelpreis für SetAngebot-Komponente
    let daemmungRegularPricePerUnit = 0;  // ✅ NEU: Regulärer Einzelpreis

    if (selectedDaemmung && daemmungProduct && quantities.insulation) {
      const daemmungPricePerM2 = selectedDaemmung.price || 0;
      const daemmungPaketinhalt = selectedDaemmung.paketinhalt || 1;

      // Standard-Dämmung (zum Vergleich)
      const standardDaemmungPrice = daemmungProduct.price || 0;

      // ✅ DYNAMISCHE VERRECHNUNG-BERECHNUNG (mit Backend-Fallback)
      // Wenn Backend verrechnung liefert, verwende es. Sonst berechne Differenz.
      const daemmungVerrechnung = selectedDaemmung.verrechnung ?? Math.max(0, daemmungPricePerM2 - standardDaemmungPrice);

      console.log('🔧 Dämmung Verrechnung:', {
        produktName: selectedDaemmung.name,
        produktPreis: daemmungPricePerM2,
        standardPreis: standardDaemmungPrice,
        verrechnungBerechnet: daemmungVerrechnung,
        quelle: selectedDaemmung.verrechnung !== undefined ? 'Backend' : 'Frontend-Berechnung',
        isFree: quantities.insulation.isFree,
        pakete: quantities.insulation.packages,
        actualM2: quantities.insulation.actualM2
      });

      // ✅ VERWENDE MENGEN AUS quantities (mit korrekter Rundung!)
      const istKostenlos = quantities.insulation.isFree;

      // REGULÄRER PREIS (IMMER AUFRUNDEN)
      const daemmungPaketeRegular = Math.ceil(quantities.floor.actualM2 / daemmungPaketinhalt);
      const daemmungM2Regular = daemmungPaketeRegular * daemmungPaketinhalt;
      daemmungRegularPrice = daemmungM2Regular * daemmungPricePerM2;
      daemmungRegularPricePerUnit = daemmungPricePerM2;  // ✅ NEU

      // SET-ANGEBOT PREIS
      if (istKostenlos) {
        // KOSTENLOS → 0€ (Mengen bereits korrekt abgerundet in quantities)
        daemmungSetPrice = 0;
        daemmungSetPricePerUnit = 0;  // ✅ NEU
      } else {
        // AUFPREIS → Verrechnung × actualM2 (Mengen bereits korrekt aufgerundet in quantities)
        daemmungSetPrice = quantities.insulation.actualM2 * daemmungVerrechnung;
        daemmungSetPricePerUnit = daemmungVerrechnung;  // ✅ NEU
      }
    }

    // SCHRITT 3: SOCKELLEISTE BERECHNUNG
    let sockelleisteRegularPrice = 0;
    let sockelleisteSetPrice = 0;
    let sockelleisteSetPricePerUnit = 0;  // ✅ NEU: Einzelpreis für SetAngebot-Komponente
    let sockelleisteRegularPricePerUnit = 0;  // ✅ NEU: Regulärer Einzelpreis

    if (selectedSockelleiste && sockelleisteProduct && quantities.baseboard) {
      const sockelleistePricePerLfm = selectedSockelleiste.price || 0;
      const sockelleistePaketinhalt = selectedSockelleiste.paketinhalt || 1;

      // Standard-Sockelleiste (zum Vergleich)
      const standardSockelleistePrice = sockelleisteProduct.price || 0;

      // ✅ DYNAMISCHE VERRECHNUNG-BERECHNUNG (mit Backend-Fallback)
      // Wenn Backend verrechnung liefert, verwende es. Sonst berechne Differenz.
      const sockelleisteVerrechnung = selectedSockelleiste.verrechnung ?? Math.max(0, sockelleistePricePerLfm - standardSockelleistePrice);

      console.log('🔧 Sockelleiste Verrechnung:', {
        produktName: selectedSockelleiste.name,
        produktPreis: sockelleistePricePerLfm,
        standardPreis: standardSockelleistePrice,
        verrechnungBerechnet: sockelleisteVerrechnung,
        quelle: selectedSockelleiste.verrechnung !== undefined ? 'Backend' : 'Frontend-Berechnung',
        isFree: quantities.baseboard.isFree,
        pakete: quantities.baseboard.packages,
        actualLfm: quantities.baseboard.actualLfm
      });

      // ✅ VERWENDE MENGEN AUS quantities (mit korrekter Rundung!)
      const istKostenlos = quantities.baseboard.isFree;

      // REGULÄRER PREIS (IMMER AUFRUNDEN)
      const sockelleisteStückRegular = Math.ceil(quantities.floor.actualM2 / sockelleistePaketinhalt);
      const sockelleisteLfmRegular = sockelleisteStückRegular * sockelleistePaketinhalt;
      sockelleisteRegularPrice = sockelleisteLfmRegular * sockelleistePricePerLfm;
      sockelleisteRegularPricePerUnit = sockelleistePricePerLfm;  // ✅ NEU

      // SET-ANGEBOT PREIS
      if (istKostenlos) {
        // KOSTENLOS → 0€ (Mengen bereits korrekt abgerundet in quantities)
        sockelleisteSetPrice = 0;
        sockelleisteSetPricePerUnit = 0;  // ✅ NEU
      } else {
        // AUFPREIS → Verrechnung × actualLfm (Mengen bereits korrekt aufgerundet in quantities)
        sockelleisteSetPrice = quantities.baseboard.actualLfm * sockelleisteVerrechnung;
        sockelleisteSetPricePerUnit = sockelleisteVerrechnung;  // ✅ NEU
      }
    }

    // SCHRITT 4: GESAMTPREISE
    // comparisonPriceTotal = Vergleichspreis (was der Kunde OHNE Set bezahlen würde)
    const comparisonPriceTotal = bodenComparisonPriceTotal + daemmungRegularPrice + sockelleisteRegularPrice;
    // totalDisplayPrice = Set-Preis (was der Kunde MIT Set bezahlt)
    const totalDisplayPrice = bodenPriceTotal + daemmungSetPrice + sockelleisteSetPrice;
    const savings = comparisonPriceTotal - totalDisplayPrice;
    const savingsPercent = comparisonPriceTotal > 0 ? (savings / comparisonPriceTotal) * 100 : 0;

    return {
      totalDisplayPrice,
      comparisonPriceTotal,
      savings: savings > 0 ? savings : undefined,
      savingsPercent,
      // ✅ NEU: Einzelpreise für SetAngebot-Komponente
      daemmungSetPricePerUnit,
      daemmungRegularPricePerUnit,
      sockelleisteSetPricePerUnit,
      sockelleisteRegularPricePerUnit,
    };
  }, [product, quantities, selectedDaemmung, selectedSockelleiste, daemmungProduct, sockelleisteProduct]);

  // Handle quantity changes from QuantitySelector
  const handleQuantityChange = (newPackages: number, newSqm: number) => {
    setWantedM2(newSqm);
  };

  // Handle selected products from SetAngebot
  const handleProductSelection = (daemmung: StoreApiProduct | null, sockelleiste: StoreApiProduct | null) => {
    setSelectedDaemmung(daemmung);
    setSelectedSockelleiste(sockelleiste);
  };

  // ========== SIMPLE PRODUCT LAYOUT COMPONENTS (for Accessories) ==========

  // Service Icons for Simple Layout (matches Layout 1 styling)
  const ServiceIcons = () => (
    <div className="space-y-0 text-base sm:text-lg lg:text-2xl text-gray-700">
      <div className="flex items-center gap-2 sm:gap-3 pb-3 border-b-2" style={{ borderBottomColor: 'var(--color-bg-gray)' }}>
        <Image
          src="/images/Icons/Telefon schieferschwarz.png"
          alt="Telefon"
          width={24}
          height={24}
          className="w-5 h-5 sm:w-6 sm:h-6 object-contain flex-shrink-0"
        />
        <span className="break-words">Persönliche Beratung unter 02433938884</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 py-3 border-b-2" style={{ borderBottomColor: 'var(--color-bg-gray)' }}>
        <Image
          src="/images/Icons/Lager schieferschwarz.png"
          alt="Lager"
          width={24}
          height={24}
          className="w-5 h-5 sm:w-6 sm:h-6 object-contain flex-shrink-0"
        />
        <span className="break-words">Kostenlose Einlagerung bis zu 6 Monate</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 py-3 border-b-2" style={{ borderBottomColor: 'var(--color-bg-gray)' }}>
        <Image
          src="/images/Icons/Termin schieferschwarz.png"
          alt="Termin"
          width={24}
          height={24}
          className="w-5 h-5 sm:w-6 sm:h-6 object-contain flex-shrink-0"
        />
        <span className="break-words">Lieferung zum Wunschtermin</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 pt-3">
        <Image
          src="/images/Icons/Lieferung schieferschwarz.png"
          alt="Lieferung"
          width={24}
          height={24}
          className="w-5 h-5 sm:w-6 sm:h-6 object-contain flex-shrink-0"
        />
        <span className="break-words">Kostenlose Lieferung ab 999€</span>
      </div>
    </div>
  );

  // Extract features from short_description (same logic as ProductInfo)
  const getFeatures = (): string[] => {
    if (product.short_description) {
      const matches = product.short_description.match(/<li>(.*?)<\/li>/g);
      if (matches) {
        return matches.map(match => match.replace(/<\/?li>/g, '').trim()).slice(0, 3);
      }
    }
    const features: string[] = [];
    if (product.text_produktuebersicht && product.show_text_produktuebersicht) {
      features.push(product.text_produktuebersicht);
    }
    if (product.lieferzeit && product.show_lieferzeit) {
      features.push(product.lieferzeit);
    }
    if (product.paketinhalt) {
      features.push(`Paketinhalt: ${product.paketinhalt} ${product.einheit_short || 'm²'}`);
    }
    return features;
  };

  // Product Info for Simple Layout
  const SimpleProductInfo = () => {
    const price = product.price || 0;
    const regularPrice = product.regular_price || price;
    const einheitShort = product.einheit_short || 'Stück';
    const uvp = product.uvp || regularPrice;
    const hasDiscount = uvp > price;
    const features = getFeatures();

    return (
      <div className="bg-white rounded-lg p-6">
        {/* Product Title */}
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
          {product.name}
        </h1>

        {/* Article Number */}
        <div className="text-sm text-gray-600 mb-4">
          Art.Nr.: {product.sku || 'N/A'}
        </div>

        {/* Features List with red checkmarks (same as ProductInfo) */}
        {features.length > 0 && (
          <div className="space-y-2 pt-2 mb-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <Image
                  src="/images/Icons/Haken rot.png"
                  alt="Check"
                  width={20}
                  height={20}
                  className="flex-shrink-0 mt-0.5"
                />
                <span className="text-gray-700 text-sm leading-relaxed">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Price Display */}
        <div className="mb-6">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-red-600">
              {price.toFixed(2).replace('.', ',')} €
            </span>
            <span className="text-lg text-gray-600">
              / {einheitShort}
            </span>
          </div>

          {/* UVP with Discount */}
          {hasDiscount && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-lg text-gray-400 line-through">
                {uvp.toFixed(2).replace('.', ',')} €
              </span>
              <span className="text-sm text-red-600 font-semibold">
                Sie sparen {((uvp - price) / uvp * 100).toFixed(0)}%
              </span>
            </div>
          )}
        </div>

        {/* Stock Status */}
        {product.stock_status === 'instock' ? (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            Auf Lager
          </div>
        ) : (
          <div className="flex items-center gap-2 text-orange-600 text-sm">
            <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
            Lieferzeit: {product.lieferzeit || '3-7 Arbeitstage'}
          </div>
        )}
      </div>
    );
  };

  // Quantity and Cart for Simple Layout (Design based on Unbenannt-1.png)
  const SimpleQuantityAndCart = () => {
    const [packages, setPackages] = useState(1);
    const [units, setUnits] = useState(product.paketinhalt || 1);
    const { addToCart, openCartDrawer } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    const price = product.price || 0;
    const paketinhalt = product.paketinhalt || 1;
    const einheitShort = product.einheit_short || 'Stück';

    // Calculate total content and price
    const totalContent = packages * paketinhalt;
    const totalPrice = totalContent * price;

    // Update units when packages change
    const handlePackagesChange = (newPackages: number) => {
      const validPackages = Math.max(1, newPackages);
      setPackages(validPackages);
      setUnits(validPackages * paketinhalt);
    };

    // Update packages when units change
    const handleUnitsChange = (newUnits: number) => {
      const validUnits = Math.max(paketinhalt, newUnits);
      setUnits(validUnits);
      const calculatedPackages = Math.ceil(validUnits / paketinhalt);
      setPackages(calculatedPackages);
    };

    const handleAddToCart = () => {
      try {
        console.log('🛒 Simple Product Add to Cart:', {
          productName: product.name,
          productId: product.id,
          packages: packages,
          units: totalContent,
          price: price
        });

        setIsAdding(true);

        // IMPORTANT: Use addToCart, NOT addSetToCart for simple products
        addToCart(product, packages);

        // Open cart drawer to show success
        openCartDrawer();

        // Show success feedback with alert
        showSuccess(
          `${product.name} wurde in den Warenkorb gelegt (${packages} Paket(e))`,
          'Zum Warenkorb hinzugefügt'
        );

        setTimeout(() => setIsAdding(false), 1000);
      } catch (error) {
        console.error('❌ Fehler beim Hinzufügen zum Warenkorb:', error);
        showError(
          'Fehler beim Hinzufügen zum Warenkorb. Bitte versuchen Sie es erneut.',
          'Fehler'
        );
        setIsAdding(false);
      }
    };

    const handleRequestQuote = () => {
      window.location.href = '/kontakt';
    };

    return (
      <div className="bg-[#e8e8e8] rounded-2xl p-6 space-y-4">
        {/* Top Section: Content and Price per Unit */}
        <div className="flex items-center justify-between px-2">
          <div className="text-[#2e2d32] text-base font-bold">
            Inhalt: {totalContent.toFixed(1).replace('.', ',')}{einheitShort} = {totalPrice.toFixed(2).replace('.', ',')} €
          </div>
          <div className="text-[#2e2d32] text-4xl font-bold">
            {price.toFixed(2).replace('.', ',')} <span className="text-2xl">€/{einheitShort}</span>
          </div>
        </div>

        {/* Quantity Selectors: Packages and Units */}
        <div className="grid grid-cols-2 gap-4">
          {/* Packages Selector */}
          <div className="text-center">
            <div className="text-[#2e2d32] text-base font-normal mb-3">Paket(e)</div>
            <div className="flex items-center justify-center gap-0">
              <button
                onClick={() => handlePackagesChange(packages - 1)}
                className="w-12 h-12 bg-white border border-gray-300 rounded-l-lg
                         hover:bg-gray-50 flex items-center justify-center transition-colors"
              >
                <MinusIcon className="w-5 h-5 text-[#2e2d32]" />
              </button>
              <input
                type="number"
                value={packages}
                onChange={(e) => handlePackagesChange(parseInt(e.target.value) || 1)}
                className="w-24 h-12 text-center border-t border-b border-gray-300 bg-white
                         text-lg font-medium text-[#2e2d32] focus:outline-none"
                min="1"
              />
              <button
                onClick={() => handlePackagesChange(packages + 1)}
                className="w-12 h-12 bg-white border border-gray-300 rounded-r-lg
                         hover:bg-gray-50 flex items-center justify-center transition-colors"
              >
                <PlusIcon className="w-5 h-5 text-[#2e2d32]" />
              </button>
            </div>
          </div>

          {/* Units Selector */}
          <div className="text-center">
            <div className="text-[#2e2d32] text-base font-normal mb-3">
              {product.einheit || einheitShort}
            </div>
            <div className="flex items-center justify-center gap-0">
              <button
                onClick={() => handleUnitsChange(units - paketinhalt)}
                className="w-12 h-12 bg-white border border-gray-300 rounded-l-lg
                         hover:bg-gray-50 flex items-center justify-center transition-colors"
              >
                <MinusIcon className="w-5 h-5 text-[#2e2d32]" />
              </button>
              <input
                type="number"
                value={units}
                step={paketinhalt}
                onChange={(e) => handleUnitsChange(parseFloat(e.target.value) || paketinhalt)}
                className="w-24 h-12 text-center border-t border-b border-gray-300 bg-white
                         text-lg font-medium text-[#2e2d32] focus:outline-none"
                min={paketinhalt}
              />
              <button
                onClick={() => handleUnitsChange(units + paketinhalt)}
                className="w-12 h-12 bg-white border border-gray-300 rounded-r-lg
                         hover:bg-gray-50 flex items-center justify-center transition-colors"
              >
                <PlusIcon className="w-5 h-5 text-[#2e2d32]" />
              </button>
            </div>
          </div>
        </div>

        {/* Total Price with Border Top */}
        <div className="border-t-2 border-gray-400 pt-4">
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="text-[#2e2d32] text-2xl font-bold">
              Gesamtsumme <span className="text-base font-normal">(inkl. MwSt.)</span>
            </div>
            <div className="text-[#2e2d32] text-4xl font-bold">
              {totalPrice.toFixed(2).replace('.', ',')} €
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <button
              onClick={handleRequestQuote}
              className="px-6 py-3 rounded-lg border-2 border-[#2e2d32] text-[#2e2d32] bg-white
                       font-medium hover:bg-gray-50 transition-colors text-center"
            >
              Individuelles Angebot anfragen
            </button>
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="px-6 py-3 rounded-lg bg-[#2e2d32] text-white font-bold
                       hover:opacity-90 transition-opacity disabled:opacity-50
                       flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {isAdding ? 'Wird hinzugefügt...' : 'In den Warenkorb'}
            </button>
          </div>

          {/* Delivery Info */}
          <div className="text-[#2e2d32] text-sm text-left px-2">
            Lieferzeit: {product.lieferzeit || '3-7 Arbeitstage oder im Markt abholen'}
          </div>
        </div>
      </div>
    );
  };

  // Payment Methods for Simple Layout
  const PaymentMethods = () => (
    <div className="bg-[#e5e5e5] rounded-md p-4">
      <h3 className="text-lg font-semibold text-[#2e2d32] mb-3">
        Zahlungsarten
      </h3>
      <div className="flex flex-wrap gap-3 items-center">
        {/* PayPal */}
        <div className="bg-white rounded px-3 py-2 flex items-center justify-center h-12 min-w-[60px]">
          <svg className="h-6" viewBox="0 0 124 33" fill="none">
            <path d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.5.306-1.89.013-3.375-.872-4.415-.972-1.142-2.696-1.746-4.985-1.746zM47 13.154c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583a.57.57 0 0 1 .563-.481h.473c1.235 0 2.4 0 3.002.704.359.42.469 1.044.332 1.906zM66.654 13.075h-3.275a.57.57 0 0 0-.563.481l-.145.916-.229-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.031.998 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .562.66h2.95a.95.95 0 0 0 .939-.803l1.77-11.209a.568.568 0 0 0-.561-.658zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.391-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.499.589.697 1.411.554 2.317zM84.096 13.075h-3.291a.954.954 0 0 0-.787.417l-4.539 6.686-1.924-6.425a.953.953 0 0 0-.912-.678h-3.234a.57.57 0 0 0-.541.754l3.625 10.638-3.408 4.811a.57.57 0 0 0 .465.9h3.287a.949.949 0 0 0 .781-.408l10.946-15.8a.57.57 0 0 0-.468-.895z" fill="#253B80"/>
            <path d="M94.992 6.749h-6.84a.95.95 0 0 0-.938.802l-2.766 17.537a.569.569 0 0 0 .562.658h3.51a.665.665 0 0 0 .656-.562l.785-4.971a.95.95 0 0 1 .938-.803h2.164c4.506 0 7.105-2.18 7.785-6.5.307-1.89.012-3.375-.873-4.415-.971-1.142-2.694-1.746-4.983-1.746zm.789 6.405c-.373 2.454-2.248 2.454-4.062 2.454h-1.031l.725-4.583a.568.568 0 0 1 .562-.481h.473c1.234 0 2.4 0 3.002.704.359.42.468 1.044.331 1.906zM115.434 13.075h-3.273a.567.567 0 0 0-.562.481l-.145.916-.23-.332c-.709-1.029-2.289-1.373-3.867-1.373-3.619 0-6.709 2.741-7.311 6.586-.312 1.918.131 3.752 1.219 5.031 1 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .564.66h2.949a.95.95 0 0 0 .938-.803l1.771-11.209a.571.571 0 0 0-.565-.658zm-4.565 6.374c-.314 1.871-1.801 3.127-3.695 3.127-.949 0-1.711-.305-2.199-.883-.484-.574-.666-1.391-.514-2.301.297-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.501.589.699 1.411.554 2.317zM119.295 7.23l-2.807 17.858a.569.569 0 0 0 .562.658h2.822c.469 0 .867-.34.938-.803l2.768-17.536a.57.57 0 0 0-.562-.659h-3.16a.571.571 0 0 0-.561.482z" fill="#179BD7"/>
            <path d="M7.266 29.154l.523-3.322-1.165-.027H1.061L4.927 1.292a.316.316 0 0 1 .314-.268h9.38c3.114 0 5.263.648 6.385 1.927.526.6.861 1.227 1.023 1.917.17.724.173 1.589.007 2.644l-.012.077v.676l.526.298a3.69 3.69 0 0 1 1.065.812c.45.513.741 1.165.864 1.938.127.795.085 1.741-.123 2.812-.24 1.232-.628 2.305-1.152 3.183a6.547 6.547 0 0 1-1.825 2c-.696.494-1.523.869-2.458 1.109-.906.236-1.939.355-3.072.355h-.73c-.522 0-1.029.188-1.427.525a2.21 2.21 0 0 0-.744 1.328l-.055.299-.924 5.855-.042.215c-.011.068-.03.102-.058.125a.155.155 0 0 1-.096.035H7.266z" fill="#253B80"/>
            <path d="M23.048 7.667c-.028.179-.06.362-.096.55-1.237 6.351-5.469 8.545-10.874 8.545H9.326c-.661 0-1.218.48-1.321 1.132L6.596 26.83l-.399 2.533a.704.704 0 0 0 .695.814h4.881c.578 0 1.069-.42 1.16-.99l.048-.248.919-5.832.059-.32c.09-.572.582-.992 1.16-.992h.73c4.729 0 8.431-1.92 9.513-7.476.452-2.321.218-4.259-.978-5.622a4.667 4.667 0 0 0-1.336-1.03z" fill="#179BD7"/>
            <path d="M21.754 7.151a9.757 9.757 0 0 0-1.203-.267 15.284 15.284 0 0 0-2.426-.177h-7.352a1.172 1.172 0 0 0-1.159.992L8.05 17.605l-.045.289a1.336 1.336 0 0 1 1.321-1.132h2.752c5.405 0 9.637-2.195 10.874-8.545.037-.188.068-.371.096-.55a6.594 6.594 0 0 0-1.017-.429 9.045 9.045 0 0 0-.277-.087z" fill="#222D65"/>
            <path d="M9.614 7.699a1.169 1.169 0 0 1 1.159-.991h7.352c.871 0 1.684.057 2.426.177a9.757 9.757 0 0 1 1.481.353c.365.121.704.264 1.017.429.368-2.347-.003-3.945-1.272-5.392C20.378.682 17.853 0 14.622 0h-9.38c-.66 0-1.223.48-1.325 1.133L.01 25.898a.806.806 0 0 0 .795.932h5.791l1.454-9.225 1.564-9.906z" fill="#253B80"/>
          </svg>
        </div>

        {/* Kreditkarte */}
        <div className="bg-white rounded px-3 py-2 flex items-center justify-center h-12 min-w-[60px]">
          <svg className="h-6" viewBox="0 0 48 32" fill="none">
            <rect width="48" height="32" rx="4" fill="#fff" stroke="#ddd"/>
            <rect x="4" y="8" width="40" height="4" fill="#333"/>
            <rect x="4" y="16" width="12" height="8" rx="1" fill="#333"/>
            <text x="20" y="23" fontSize="8" fill="#333" fontWeight="bold">CARD</text>
          </svg>
        </div>

        {/* Klarna */}
        <div className="bg-white rounded px-3 py-2 flex items-center justify-center h-12 min-w-[60px]">
          <svg className="h-6" viewBox="0 0 80 30" fill="none">
            <path d="M0 0h14v30H0V0z" fill="#FFB3C7"/>
            <path d="M18 0h8v17l8-17h9l-10 20 10 10h-10l-7-8v8h-8V0zM54 0v30h-8V0h8zM58 15c0-8 6-15 14-15s14 7 14 15-6 15-14 15-14-7-14-15zm8 0c0 4 3 7 6 7s6-3 6-7-3-7-6-7-6 3-6 7z" fill="#000"/>
          </svg>
        </div>

        {/* Rechnung */}
        <div className="bg-white rounded px-3 py-2 flex items-center justify-center h-12 min-w-[60px]">
          <svg className="h-6 w-8" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* SEPA */}
        <div className="bg-white rounded px-3 py-2 flex items-center justify-center h-12 min-w-[60px]">
          <svg className="h-6" viewBox="0 0 60 24" fill="none">
            <text x="2" y="18" fontSize="14" fontWeight="bold" fill="#003399">SEPA</text>
          </svg>
        </div>
      </div>
    </div>
  );

  // Product Details for Simple Layout
  const ProductDetails = () => (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Produktdetails
      </h2>
      {product.description && (
        <div
          className="prose prose-gray max-w-none"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      )}
    </div>
  );

  // Simple Product Layout (for accessories)
  const SimpleProductLayout = () => (
    <>
      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-8 mb-12 w-full">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* Image Gallery - reused */}
          <ImageGallery product={product} />
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Product Info */}
          <SimpleProductInfo />

          {/* Quantity & Add to Cart */}
          <SimpleQuantityAndCart />

          {/* Service Icons - positioned under prices like Layout 1 */}
          <ServiceIcons />

          {/* Payment Methods */}
          <PaymentMethods />
        </div>
      </div>

      {/* Product Details - shared */}
      <ProductDetails />
    </>
  );

  // ========== END SIMPLE PRODUCT LAYOUT COMPONENTS ==========

  // Handle sample order - find and add MUSTER product to cart
  const handleOrderSample = async () => {
    if (isOrderingSample) return; // Prevent double-clicks

    setIsOrderingSample(true);

    try {
      // Extract clean product name first (needed for duplicate check)
      const cleanProductName = product.name
        .replace(/^(Rigid-Vinyl|Laminat|Parkett|Vinyl)\s+/i, '')
        .trim();

      console.log('🔍 Suche nach Muster für:', product.name);
      console.log('🔍 Bereinigter Name:', cleanProductName);

      // Check if this sample is already in cart (by checking product name match)
      const existingSamples = cartItems.filter(item => item.isSample);
      const isDuplicate = existingSamples.some(item => {
        // Check if the sample name contains the clean product name
        const sampleCleanName = item.product.name
          .replace(/^MUSTER\s+(Rigid-Vinyl|Laminat|Parkett|Vinyl)?\s*/i, '')
          .trim()
          .toLowerCase();
        return sampleCleanName.includes(cleanProductName.toLowerCase());
      });

      if (isDuplicate) {
        console.warn('⚠️ MUSTER BEREITS IM WARENKORB:', cleanProductName);
        showInfo(
          `Ein Muster von "${product.name}" befindet sich bereits in Ihrem Warenkorb.`,
          'Bereits im Warenkorb'
        );
        setIsOrderingSample(false);
        return;
      }

      // Check current sample count
      const currentSampleCount = getSampleCount();
      const freeSamplesRemaining = getFreeSamplesRemaining();

      console.log('📊 Aktuelle Muster im Warenkorb:', currentSampleCount);
      console.log('🆓 Kostenlose Muster übrig:', freeSamplesRemaining);

      // Strategy: Fetch all sample products from dedicated endpoint
      // This uses WooCommerce REST API with category filter (most reliable method)
      console.log('🌐 API Request: /api/products/samples');

      const response = await fetch(`/api/products/samples`);

      console.log('📡 API Response Status:', response.status, response.ok);

      if (!response.ok) {
        console.error('❌ API Request failed:', response.status, response.statusText);
        throw new Error('Fehler beim Suchen des Musters');
      }

      const results: StoreApiProduct[] = await response.json();

      console.log('📡 API Response received successfully');

      console.log('📦 Muster-Produkte geladen:', results.length);

      // Validate API response
      if (!results || results.length === 0) {
        console.error('❌ API hat keine Muster-Produkte zurückgegeben!');
        showError(
          'Fehler beim Laden der Muster-Produkte. Bitte versuchen Sie es erneut.',
          'Ladefehler'
        );
        return;
      }

      // ===== SEARCH STRATEGY =====
      // We will try multiple strategies to find the matching sample product
      console.log('🔍 === SUCHE NACH MUSTER-PRODUKT ===');
      console.log('🔍 Original-Name:', product.name);
      console.log('🔍 Bereinigter Name:', cleanProductName);

      let sampleProduct: StoreApiProduct | null = null;

      // STRATEGY 1: Exact substring match (case-insensitive)
      console.log('\n🔍 STRATEGIE 1: Exakte Teilstring-Suche');
      const exactMatches = results.filter(p => {
        if (!p || !p.name) return false;
        const pName = p.name.toLowerCase();
        const searchName = cleanProductName.toLowerCase();
        return pName.includes(searchName);
      });
      console.log('   Treffer:', exactMatches.length);
      if (exactMatches.length > 0) {
        console.log('   Namen:', exactMatches.map(p => p.name));
        sampleProduct = exactMatches[0];
        console.log('   ✅ Gefunden:', sampleProduct.name);
      }

      // STRATEGY 2: Word-by-word matching (all significant words must match)
      if (!sampleProduct) {
        console.log('\n🔍 STRATEGIE 2: Wort-für-Wort-Suche');
        const searchWords = cleanProductName
          .toLowerCase()
          .split(/\s+/)
          .filter(w => w.length >= 3); // Only words with 3+ characters
        console.log('   Such-Wörter:', searchWords);

        const wordMatches = results.filter(p => {
          if (!p || !p.name) return false;
          const pName = p.name.toLowerCase();

          // All search words must be present
          const matchedWords = searchWords.filter(word => pName.includes(word));
          return matchedWords.length === searchWords.length;
        });

        console.log('   Treffer:', wordMatches.length);
        if (wordMatches.length > 0) {
          console.log('   Namen:', wordMatches.map(p => p.name));
          sampleProduct = wordMatches[0];
          console.log('   ✅ Gefunden:', sampleProduct.name);
        }
      }

      // STRATEGY 3: Fuzzy match (at least 50% of words match)
      if (!sampleProduct) {
        console.log('\n🔍 STRATEGIE 3: Unscharfe Suche (50%+ Wörter)');
        const searchWords = cleanProductName
          .toLowerCase()
          .split(/\s+/)
          .filter(w => w.length >= 3);
        console.log('   Such-Wörter:', searchWords);

        const fuzzyMatches = results
          .map(p => {
            if (!p || !p.name) return { product: p, score: 0 };
            const pName = p.name.toLowerCase();
            const matchedWords = searchWords.filter(word => pName.includes(word));
            return { product: p, score: matchedWords.length / searchWords.length };
          })
          .filter(item => item.score >= 0.5) // At least 50% match
          .sort((a, b) => b.score - a.score); // Best match first

        console.log('   Treffer:', fuzzyMatches.length);
        if (fuzzyMatches.length > 0) {
          console.log('   Top 3:', fuzzyMatches.slice(0, 3).map(m => `${m.product.name} (${(m.score * 100).toFixed(0)}%)`));
          sampleProduct = fuzzyMatches[0].product;
          console.log('   ✅ Gefunden:', sampleProduct.name);
        }
      }

      // Final check
      if (!sampleProduct) {
        console.error('\n❌ KEIN MUSTER GEFUNDEN');
        console.error('   Original-Name:', product.name);
        console.error('   Bereinigter Name:', cleanProductName);
        console.error('   Verfügbare Muster:', results.length);

        // Try to find similar samples in same category
        const productCategory = product.categories?.[0]?.name?.toLowerCase() || '';
        const similarSamples = results
          .filter(p => p.name.toLowerCase().includes(productCategory))
          .slice(0, 5);

        if (similarSamples.length > 0) {
          console.log('\n💡 Ähnliche verfügbare Muster:');
          similarSamples.forEach(s => console.log('   -', s.name));
        } else {
          console.error('   Keine ähnlichen Muster gefunden');
        }

        showError(
          `Leider gibt es für "${product.name}" derzeit kein Muster.\n\nBitte kontaktieren Sie uns für weitere Informationen oder schauen Sie sich ähnliche Produkte an.`,
          'Muster nicht verfügbar'
        );
        return;
      }

      console.log('\n✅ === MUSTER GEFUNDEN ===');
      console.log('   Produkt:', sampleProduct.name);
      console.log('   ID:', sampleProduct.id);

      console.log('✅ Muster gefunden:', sampleProduct.name);

      // Determine price for this sample
      const willBeFree = currentSampleCount < 3;
      const price = willBeFree ? 0 : 3;

      // Add sample to cart with dynamic pricing
      addSampleToCart(sampleProduct);

      // Success feedback with pricing info
      if (willBeFree) {
        const remaining = freeSamplesRemaining - 1;
        if (remaining > 0) {
          showSuccess(
            `Kostenloses Muster wurde in den Warenkorb gelegt!\n\nSie können noch ${remaining} kostenlose Muster bestellen.\nJedes weitere Muster kostet 3,00 €.`,
            'Muster hinzugefügt'
          );
        } else {
          showSuccess(
            'Kostenloses Muster wurde in den Warenkorb gelegt!\n\nSie haben alle 3 kostenlosen Muster verwendet.\nJedes weitere Muster kostet 3,00 €.',
            'Muster hinzugefügt'
          );
        }
      } else {
        showSuccess(
          `Muster wurde in den Warenkorb gelegt (${price.toFixed(2).replace('.', ',')} €)\n\nDie ersten 3 Muster sind kostenlos.\nJedes weitere Muster kostet 3,00 €.`,
          'Muster hinzugefügt'
        );
      }
    } catch (error) {
      console.error('Error ordering sample:', error);
      showError(
        'Fehler beim Hinzufügen des Musters. Bitte versuchen Sie es erneut.',
        'Fehler'
      );
    } finally {
      setIsOrderingSample(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 overflow-x-hidden">
      <div className="content-container">
        {isAccessory ? (
          // ========== SIMPLE PRODUCT LAYOUT for Accessories ==========
          <SimpleProductLayout />
        ) : (
          // ========== SET-ANGEBOT LAYOUT for Main Products (100% UNCHANGED) ==========
          <>
        {/* Main Product Section - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-8 mb-12 w-full">
          {/* LEFT COLUMN - Image Gallery */}
          <div className="space-y-6">
            <ImageGallery product={product} />

            {/* Action Buttons - Only for floor products */}
            {isFloorProduct && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <button
                  onClick={handleOrderSample}
                  disabled={isOrderingSample}
                  className="px-3 sm:px-4 py-3 rounded-lg text-white text-sm sm:text-base font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: 'var(--color-bg-darkest)' }}
                >
                  {isOrderingSample ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span className="truncate">Lädt...</span>
                    </>
                  ) : (
                    <>
                      <Image
                        src="/images/Icons/Musterbox weiß.png"
                        alt="Musterbox"
                        width={20}
                        height={20}
                        className="w-5 h-5 object-contain flex-shrink-0"
                      />
                      <span className="truncate">Kostenloses Muster bestellen</span>
                    </>
                  )}
                </button>
                <button
                  className="px-3 sm:px-4 py-3 rounded-lg text-white text-sm sm:text-base font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  style={{ backgroundColor: 'var(--color-bg-darkest)' }}
                >
                  <Image
                    src="/images/Icons/3D Bodenplaner weiß.png"
                    alt="3D Bodenplaner"
                    width={20}
                    height={20}
                    className="w-5 h-5 object-contain flex-shrink-0"
                  />
                  <span className="truncate">Virtuell im Bodenplaner ansehen</span>
                </button>
              </div>
            )}

            {/* Service Icons */}
            <div className="space-y-0 text-base sm:text-lg lg:text-2xl text-gray-700">
              <div className="flex items-center gap-2 sm:gap-3 pb-3 border-b-2" style={{ borderBottomColor: 'var(--color-bg-gray)' }}>
                <Image
                  src="/images/Icons/Telefon schieferschwarz.png"
                  alt="Telefon"
                  width={24}
                  height={24}
                  className="w-5 h-5 sm:w-6 sm:h-6 object-contain flex-shrink-0"
                />
                <span className="break-words">Persönliche Beratung unter 02433938884</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 py-3 border-b-2" style={{ borderBottomColor: 'var(--color-bg-gray)' }}>
                <Image
                  src="/images/Icons/Lager schieferschwarz.png"
                  alt="Lager"
                  width={24}
                  height={24}
                  className="w-5 h-5 sm:w-6 sm:h-6 object-contain flex-shrink-0"
                />
                <span className="break-words">Kostenlose Einlagerung bis zu 6 Monate</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 py-3 border-b-2" style={{ borderBottomColor: 'var(--color-bg-gray)' }}>
                <Image
                  src="/images/Icons/Termin schieferschwarz.png"
                  alt="Termin"
                  width={24}
                  height={24}
                  className="w-5 h-5 sm:w-6 sm:h-6 object-contain flex-shrink-0"
                />
                <span className="break-words">Lieferung zum Wunschtermin</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 pt-3">
                <Image
                  src="/images/Icons/Lieferung schieferschwarz.png"
                  alt="Lieferung"
                  width={24}
                  height={24}
                  className="w-5 h-5 sm:w-6 sm:h-6 object-contain flex-shrink-0"
                />
                <span className="break-words">Kostenlose Lieferung ab 999€</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Product Info & Cart */}
          <div className="space-y-6">
            <ProductInfo
              product={product}
              daemmungProduct={daemmungProduct}
              sockelleisteProduct={sockelleisteProduct}
              daemmungOptions={daemmungOptions}
              sockelleisteOptions={sockelleisteOptions}
              onProductSelection={handleProductSelection}
              comparisonPriceTotal={prices?.comparisonPriceTotal || undefined}
              totalDisplayPrice={prices?.totalDisplayPrice}
              savingsAmount={prices?.savings || undefined}
              savingsPercent={prices?.savingsPercent}
              daemmungSetPricePerUnit={prices?.daemmungSetPricePerUnit || 0}
              daemmungRegularPricePerUnit={prices?.daemmungRegularPricePerUnit || 0}
              sockelleisteSetPricePerUnit={prices?.sockelleisteSetPricePerUnit || 0}
              sockelleisteRegularPricePerUnit={prices?.sockelleisteRegularPricePerUnit || 0}
            />

            {/* Quantity + Price Container with Gray Background */}
            <div className="bg-[#e5e5e5] rounded-md p-4">
              {/* Quantity Selector */}
              <QuantitySelector
                paketinhalt={paketinhalt}
                einheit={einheit}
                onQuantityChange={handleQuantityChange}
              />

              {/* Total Price with integrated buttons */}
              <TotalPrice
                quantities={quantities}
                prices={prices}
                einheit={einheit}
                product={product}
                selectedDaemmung={selectedDaemmung}
                selectedSockelleiste={selectedSockelleiste}
                daemmungProduct={daemmungProduct}
                sockelleisteProduct={sockelleisteProduct}
                lieferzeit={product.lieferzeit || '3-7 Arbeitstage'}
              />
            </div>

            {/* Zahlungsarten Section */}
            <div className="bg-[#e5e5e5] rounded-md p-4">
              <h3 className="text-lg font-semibold text-[#2e2d32] mb-3">
                Zahlungsarten
              </h3>
              <div className="flex flex-wrap gap-3 items-center">
                {/* PayPal */}
                <div className="bg-white rounded px-3 py-2 flex items-center justify-center h-12 min-w-[60px]">
                  <svg className="h-6" viewBox="0 0 124 33" fill="none">
                    <path d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.5.306-1.89.013-3.375-.872-4.415-.972-1.142-2.696-1.746-4.985-1.746zM47 13.154c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583a.57.57 0 0 1 .563-.481h.473c1.235 0 2.4 0 3.002.704.359.42.469 1.044.332 1.906zM66.654 13.075h-3.275a.57.57 0 0 0-.563.481l-.145.916-.229-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.031.998 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .562.66h2.95a.95.95 0 0 0 .939-.803l1.77-11.209a.568.568 0 0 0-.561-.658zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.391-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.499.589.697 1.411.554 2.317zM84.096 13.075h-3.291a.954.954 0 0 0-.787.417l-4.539 6.686-1.924-6.425a.953.953 0 0 0-.912-.678h-3.234a.57.57 0 0 0-.541.754l3.625 10.638-3.408 4.811a.57.57 0 0 0 .465.9h3.287a.949.949 0 0 0 .781-.408l10.946-15.8a.57.57 0 0 0-.468-.895z" fill="#253B80"/>
                    <path d="M94.992 6.749h-6.84a.95.95 0 0 0-.938.802l-2.766 17.537a.569.569 0 0 0 .562.658h3.51a.665.665 0 0 0 .656-.562l.785-4.971a.95.95 0 0 1 .938-.803h2.164c4.506 0 7.105-2.18 7.785-6.5.307-1.89.012-3.375-.873-4.415-.971-1.142-2.694-1.746-4.983-1.746zm.789 6.405c-.373 2.454-2.248 2.454-4.062 2.454h-1.031l.725-4.583a.568.568 0 0 1 .562-.481h.473c1.234 0 2.4 0 3.002.704.359.42.468 1.044.331 1.906zM115.434 13.075h-3.273a.567.567 0 0 0-.562.481l-.145.916-.23-.332c-.709-1.029-2.289-1.373-3.867-1.373-3.619 0-6.709 2.741-7.311 6.586-.312 1.918.131 3.752 1.219 5.031 1 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .564.66h2.949a.95.95 0 0 0 .938-.803l1.771-11.209a.571.571 0 0 0-.565-.658zm-4.565 6.374c-.314 1.871-1.801 3.127-3.695 3.127-.949 0-1.711-.305-2.199-.883-.484-.574-.666-1.391-.514-2.301.297-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.501.589.699 1.411.554 2.317zM119.295 7.23l-2.807 17.858a.569.569 0 0 0 .562.658h2.822c.469 0 .867-.34.938-.803l2.768-17.536a.57.57 0 0 0-.562-.659h-3.16a.571.571 0 0 0-.561.482z" fill="#179BD7"/>
                    <path d="M7.266 29.154l.523-3.322-1.165-.027H1.061L4.927 1.292a.316.316 0 0 1 .314-.268h9.38c3.114 0 5.263.648 6.385 1.927.526.6.861 1.227 1.023 1.917.17.724.173 1.589.007 2.644l-.012.077v.676l.526.298a3.69 3.69 0 0 1 1.065.812c.45.513.741 1.165.864 1.938.127.795.085 1.741-.123 2.812-.24 1.232-.628 2.305-1.152 3.183a6.547 6.547 0 0 1-1.825 2c-.696.494-1.523.869-2.458 1.109-.906.236-1.939.355-3.072.355h-.73c-.522 0-1.029.188-1.427.525a2.21 2.21 0 0 0-.744 1.328l-.055.299-.924 5.855-.042.215c-.011.068-.03.102-.058.125a.155.155 0 0 1-.096.035H7.266z" fill="#253B80"/>
                    <path d="M23.048 7.667c-.028.179-.06.362-.096.55-1.237 6.351-5.469 8.545-10.874 8.545H9.326c-.661 0-1.218.48-1.321 1.132L6.596 26.83l-.399 2.533a.704.704 0 0 0 .695.814h4.881c.578 0 1.069-.42 1.16-.99l.048-.248.919-5.832.059-.32c.09-.572.582-.992 1.16-.992h.73c4.729 0 8.431-1.92 9.513-7.476.452-2.321.218-4.259-.978-5.622a4.667 4.667 0 0 0-1.336-1.03z" fill="#179BD7"/>
                    <path d="M21.754 7.151a9.757 9.757 0 0 0-1.203-.267 15.284 15.284 0 0 0-2.426-.177h-7.352a1.172 1.172 0 0 0-1.159.992L8.05 17.605l-.045.289a1.336 1.336 0 0 1 1.321-1.132h2.752c5.405 0 9.637-2.195 10.874-8.545.037-.188.068-.371.096-.55a6.594 6.594 0 0 0-1.017-.429 9.045 9.045 0 0 0-.277-.087z" fill="#222D65"/>
                    <path d="M9.614 7.699a1.169 1.169 0 0 1 1.159-.991h7.352c.871 0 1.684.057 2.426.177a9.757 9.757 0 0 1 1.481.353c.365.121.704.264 1.017.429.368-2.347-.003-3.945-1.272-5.392C20.378.682 17.853 0 14.622 0h-9.38c-.66 0-1.223.48-1.325 1.133L.01 25.898a.806.806 0 0 0 .795.932h5.791l1.454-9.225 1.564-9.906z" fill="#253B80"/>
                  </svg>
                </div>

                {/* Kreditkarte */}
                <div className="bg-white rounded px-3 py-2 flex items-center justify-center h-12 min-w-[60px]">
                  <svg className="h-6" viewBox="0 0 48 32" fill="none">
                    <rect width="48" height="32" rx="4" fill="#fff" stroke="#ddd"/>
                    <rect x="4" y="8" width="40" height="4" fill="#333"/>
                    <rect x="4" y="16" width="12" height="8" rx="1" fill="#333"/>
                    <text x="20" y="23" fontSize="8" fill="#333" fontWeight="bold">CARD</text>
                  </svg>
                </div>

                {/* Klarna */}
                <div className="bg-white rounded px-3 py-2 flex items-center justify-center h-12 min-w-[60px]">
                  <svg className="h-6" viewBox="0 0 80 30" fill="none">
                    <path d="M0 0h14v30H0V0z" fill="#FFB3C7"/>
                    <path d="M18 0h8v17l8-17h9l-10 20 10 10h-10l-7-8v8h-8V0zM54 0v30h-8V0h8zM58 15c0-8 6-15 14-15s14 7 14 15-6 15-14 15-14-7-14-15zm8 0c0 4 3 7 6 7s6-3 6-7-3-7-6-7-6 3-6 7z" fill="#000"/>
                  </svg>
                </div>

                {/* Rechnung */}
                <div className="bg-white rounded px-3 py-2 flex items-center justify-center h-12 min-w-[60px]">
                  <svg className="h-6 w-8" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {/* SEPA */}
                <div className="bg-white rounded px-3 py-2 flex items-center justify-center h-12 min-w-[60px]">
                  <svg className="h-6" viewBox="0 0 60 24" fill="none">
                    <text x="2" y="18" fontSize="14" fontWeight="bold" fill="#003399">SEPA</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Zubehör Slider Section */}
        <div className="mb-8">
          <ZubehoerSlider product={product} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Produktdetails
          </h2>
          {product.description && (
            <div
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}
        </div>
          </>
        )}
      </div>

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertState.isOpen}
        onClose={closeAlert}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
      />
    </div>
  );
}
