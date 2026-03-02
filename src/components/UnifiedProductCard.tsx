'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { StoreApiProduct } from '@/lib/woocommerce';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAlert } from '@/hooks/useAlert';

interface UnifiedProductCardProps {
  product: StoreApiProduct;
  daemmungProduct?: StoreApiProduct | null;
  sockelleisteProduct?: StoreApiProduct | null;
}

/**
 * Einheitliche Produktkarte für alle Übersichten
 * Basiert auf CategoryPageClient Design
 */
export default function UnifiedProductCard({ product }: UnifiedProductCardProps) {
  const [isOrderingSample, setIsOrderingSample] = useState(false);
  const { cartItems, addSampleToCart, getSampleCount, getFreeSamplesRemaining } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showSuccess, showError, showInfo } = useAlert();

  const wishlisted = isInWishlist(product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  // Check if product is a floor product (only floors have samples)
  const isFloorProduct = useMemo(() => {
    if (!product.categories || !Array.isArray(product.categories)) return false;

    const floorCategories = ['vinylboden', 'klebe-vinyl', 'rigid-vinyl', 'laminat', 'parkett'];
    return product.categories.some(cat =>
      floorCategories.includes(cat.slug.toLowerCase())
    );
  }, [product.categories]);

  // Handle sample order - find and add MUSTER product to cart
  const handleOrderSample = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation();

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
    <article className="bg-white rounded-lg overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
      <Link href={`/products/${product.slug}`} className="block">
        {/* Bildbereich */}
        <div className="relative aspect-[4/3] bg-white">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]?.src || ''}
              alt={product.images[0]?.alt || product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
              loading="lazy"
              quality={80}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400 text-sm">Kein Bild</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {/* Sale Badge */}
            {(() => {
              const mainPrice = product.price || 0;
              const regPrice = product.regular_price || 0;
              const discountPct = regPrice > mainPrice && regPrice > 0
                ? ((regPrice - mainPrice) / regPrice) * 100
                : 0;
              return discountPct > 0 ? (
                <div className="bg-red-600 text-white px-3 py-1 rounded font-bold text-sm shadow-md w-fit">
                  -{Math.round(discountPct)}%
                </div>
              ) : null;
            })()}

            {/* Aktion Badge */}
            {product.show_aktion && product.aktion && (
              <div className="bg-dark text-white px-3 py-1 rounded font-medium text-sm shadow-md">
                {product.aktion}
              </div>
            )}

            {/* Angebotspreis Hinweis Badge */}
            {product.show_angebotspreis_hinweis && product.angebotspreis_hinweis && (
              <div className="bg-black text-white px-3 py-1 rounded font-bold text-sm shadow-md">
                {product.angebotspreis_hinweis}
              </div>
            )}
          </div>

        {/* Action Buttons on Border - Only for floor products */}
        {isFloorProduct && (
          <div className="absolute left-0 right-0 flex justify-between px-4 z-10" style={{ bottom: '-2%' }}>
            <button
              onClick={handleToggleWishlist}
              className="text-white flex items-center justify-start gap-2 transition-colors duration-200"
              style={{
                backgroundColor: wishlisted ? 'var(--color-primary)' : 'var(--color-bg-darkest)',
                height: '10px',
                padding: '1rem',
                borderRadius: '6px'
              }}
            >
              <Image
                src="/images/Icons/Favoriten weiß.png"
                alt="Wunschlist"
                width={16}
                height={16}
              />
              <div className="flex flex-col items-start">
                <span className="text-[0.65rem] leading-tight">{wishlisted ? 'Auf der' : 'Auf die'}</span>
                <span className="text-xs font-bold leading-tight">Merkliste</span>
              </div>
            </button>
            <button
              onClick={handleOrderSample}
              disabled={isOrderingSample}
              className="text-white flex items-center justify-start gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--color-bg-darkest)',
                height: '10px',
                padding: '1rem',
                borderRadius: '6px'
              }}
            >
              <Image
                src="/images/Icons/Musterbox weiß.png"
                alt="Muster bestellen"
                width={16}
                height={16}
              />
              <div className="flex flex-col items-start">
                <span className="text-[0.65rem] leading-tight">Kostenloses</span>
                <span className="text-xs font-bold leading-tight">Muster</span>
              </div>
            </button>
          </div>
        )}
        </div>

        {/* Produktinfo-Bereich */}
        <div className="bg-gray-100 p-4">
          {/* Produktname */}
          <h3 className="text-gray-900 font-medium text-base mb-3 line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>

          {/* Produktbeschreibung als Liste mit Haken */}
          {(() => {
            const description = product.short_description || product.description || '';
            if (!description) return null;

            // HTML bereinigen und in Listenpunkte aufteilen
            const cleanText = description
              .replace(/<br\s*\/?>/gi, '\n')
              .replace(/<li[^>]*>/gi, '\n')
              .replace(/<\/li>/gi, '')
              .replace(/<ul[^>]*>|<\/ul>/gi, '')
              .replace(/<ol[^>]*>|<\/ol>/gi, '')
              .replace(/<p[^>]*>|<\/p>/gi, '\n')
              .replace(/<[^>]+>/g, '')
              .replace(/&nbsp;/g, ' ')
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .trim();

            const points = cleanText
              .split('\n')
              .map(line => line.trim())
              .filter(line => line.length > 0 && line.length < 200)
              .slice(0, 4); // Max 4 Punkte

            if (points.length === 0) return null;

            return (
              <ul className="mb-3 space-y-1">
                {points.map((point, index) => (
                  <li key={index} className="flex items-start text-xs text-gray-600">
                    <Image
                      src="/images/Icons/Haken schieferschwarz.png"
                      alt="Checkmark"
                      width={12}
                      height={12}
                      className="mr-1.5 flex-shrink-0 mt-0.5"
                    />
                    <span className="line-clamp-1">{point}</span>
                  </li>
                ))}
              </ul>
            );
          })()}

          {/* Trennlinie */}
          <div className="h-[1px] bg-dark mx-8 mb-3" />

          {/* Preisanzeige */}
          {(() => {
            const unit = product.einheit_short || 'm²';
            const showUnit = unit !== '-' && unit.trim() !== '';
            const paketinhalt = product.paketinhalt || 1;
            const verpackungsart = product.verpackungsart_short || 'Pak.';

            // Preise direkt aus WooCommerce-Feldern (identisch mit Produktseite)
            const displayPrice = product.price || 0;

            // Streichpreis: Bei Set-Produkten = setangebot_einzelpreis (Vergleichspreis inkl. Zusatzprodukte),
            // sonst = WooCommerce regular_price
            const isSetProduct = product.show_setangebot && product.setangebot_einzelpreis;
            const stattPrice = isSetProduct
              ? (product.setangebot_einzelpreis || 0)
              : (product.regular_price || product.price || 0);
            const hasDiscount = stattPrice > displayPrice;

            const showPackagePrice = showUnit && paketinhalt > 1;
            const paketpreis = displayPrice * paketinhalt;

            return (
              <div className="space-y-1">
                {/* Streichpreis: Vergleichspreis inkl. Zusatzprodukte (Set) oder WooCommerce Regulärpreis */}
                {hasDiscount && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Statt</span>
                    <span className="text-gray-500 line-through">
                      {stattPrice.toFixed(2).replace('.', ',')} {showUnit ? `€/${unit}` : '€'}
                    </span>
                  </div>
                )}

                {/* Hauptpreis */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-medium">{isSetProduct ? 'Set-Preis' : 'Preis'}</span>
                  <span className={`font-bold text-xl ${hasDiscount ? 'text-red-600' : 'text-gray-900'}`}>
                    {displayPrice.toFixed(2).replace('.', ',')} {showUnit ? `€/${unit}` : '€'}
                  </span>
                </div>

                {/* Paketpreis wenn paketinhalt > 1 */}
                {showPackagePrice && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{paketinhalt} {unit}/{verpackungsart}</span>
                    <span className="text-gray-700 font-medium">
                      {paketpreis.toFixed(2).replace('.', ',')} €/{verpackungsart}
                    </span>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </Link>
    </article>
  );
}
