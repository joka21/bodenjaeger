'use client';

import { useState, useMemo } from 'react';
import type { StoreApiProduct } from '@/lib/woocommerce';
import { calculateSetQuantities, calculateSetPrices } from '@/lib/setCalculations';
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
  const paketinhalt = product.jaeger_meta?.paketinhalt || 1;
  const einheit = product.jaeger_meta?.einheit_short || 'm²';

  // State for wanted m² (user input)
  const [wantedM2, setWantedM2] = useState(paketinhalt);

  // State for selected addition products
  const [selectedDaemmung, setSelectedDaemmung] = useState<StoreApiProduct | null>(daemmungProduct);
  const [selectedSockelleiste, setSelectedSockelleiste] = useState<StoreApiProduct | null>(sockelleisteProduct);

  // State for custom quantities (optional user overrides)
  const [customInsulationM2, setCustomInsulationM2] = useState<number | undefined>(undefined);
  const [customBaseboardLfm, setCustomBaseboardLfm] = useState<number | undefined>(undefined);

  // Calculate set quantities (packages for each product)
  const quantities = useMemo(() => {
    return calculateSetQuantities(
      wantedM2,
      product,
      selectedDaemmung,
      selectedSockelleiste,
      customInsulationM2,
      customBaseboardLfm
    );
  }, [wantedM2, product, selectedDaemmung, selectedSockelleiste, customInsulationM2, customBaseboardLfm]);

  // Calculate set prices (for display)
  const prices = useMemo(() => {
    return calculateSetPrices(
      quantities,
      product,
      daemmungProduct,
      selectedDaemmung,
      sockelleisteProduct,
      selectedSockelleiste
    );
  }, [quantities, product, daemmungProduct, selectedDaemmung, sockelleisteProduct, selectedSockelleiste]);

  // Handle quantity changes from QuantitySelector
  const handleQuantityChange = (newPackages: number, newSqm: number) => {
    setWantedM2(newSqm);
  };

  // Handle selected products from SetAngebot
  const handleProductSelection = (daemmung: StoreApiProduct | null, sockelleiste: StoreApiProduct | null) => {
    setSelectedDaemmung(daemmung);
    setSelectedSockelleiste(sockelleiste);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Product Section - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-8 mb-12">
          {/* LEFT COLUMN - Image Gallery */}
          <div className="space-y-6">
            <ImageGallery product={product} />

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                className="px-4 py-3 rounded-lg text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                style={{ backgroundColor: 'var(--color-bg-darkest)' }}
              >
                <img
                  src="/images/Icons/Musterbox weiß.png"
                  alt="Musterbox"
                  className="w-5 h-5 object-contain"
                />
                Kostenloses Muster bestellen
              </button>
              <button
                className="px-4 py-3 rounded-lg text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                style={{ backgroundColor: 'var(--color-bg-darkest)' }}
              >
                <img
                  src="/images/Icons/3D Bodenplaner weiß.png"
                  alt="3D Bodenplaner"
                  className="w-5 h-5 object-contain"
                />
                Virtuell im Bodenplaner ansehen
              </button>
            </div>

            {/* Service Icons */}
            <div className="space-y-0 text-2xl text-gray-700">
              <div className="flex items-center gap-3 pb-3 border-b-2" style={{ borderBottomColor: 'var(--color-bg-gray)' }}>
                <img
                  src="/images/Icons/Telefon schieferschwarz.png"
                  alt="Telefon"
                  className="w-6 h-6 object-contain flex-shrink-0"
                />
                <span>Persönliche Beratung unter 0800 123 4567</span>
              </div>
              <div className="flex items-center gap-3 py-3 border-b-2" style={{ borderBottomColor: 'var(--color-bg-gray)' }}>
                <img
                  src="/images/Icons/Lager schieferschwarz.png"
                  alt="Lager"
                  className="w-6 h-6 object-contain flex-shrink-0"
                />
                <span>Kostenlose Einlagerung bis zu 6 Monate</span>
              </div>
              <div className="flex items-center gap-3 py-3 border-b-2" style={{ borderBottomColor: 'var(--color-bg-gray)' }}>
                <img
                  src="/images/Icons/Termin schieferschwarz.png"
                  alt="Termin"
                  className="w-6 h-6 object-contain flex-shrink-0"
                />
                <span>Lieferung zum Wunschtermin</span>
              </div>
              <div className="flex items-center gap-3 pt-3">
                <img
                  src="/images/Icons/Lieferung schieferschwarz.png"
                  alt="Lieferung"
                  className="w-6 h-6 object-contain flex-shrink-0"
                />
                <span>Kostenlose Lieferung ab 999€</span>
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
                lieferzeit={product.jaeger_meta?.lieferzeit || '3-7 Arbeitstage'}
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
          <ZubehoerSlider productId={product.id} product={product} />
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
      </div>
    </div>
  );
}
