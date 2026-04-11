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
            {/* Sale Badge - on_sale aus Backend als Trigger, Prozent aus discount_percent oder setangebot_ersparnis_prozent */}
            {product.on_sale && (() => {
              const percent = product.setangebot_ersparnis_prozent || product.discount_percent || 0;
              return percent > 0 ? (
                <div className="text-white rounded font-bold shadow-md w-fit" style={{ fontSize: '12px', padding: '3% 10%', whiteSpace: 'nowrap', backgroundColor: '#ed1b24' }}>
                  -{Math.round(percent)}%
                </div>
              ) : null;
            })()}

            {/* Aktion Badge — Stil aus Backend, Jäger-Farben */}
            {product.show_aktion && product.aktion && (
              <div
                className="rounded font-bold shadow-md w-fit"
                style={{
                  fontSize: '12px',
                  padding: '3% 10%',
                  whiteSpace: 'nowrap' as const,
                  backgroundColor: {
                    'aktion-bg-black': '#2e2d32',
                    'aktion-bg-red': '#ed1b24',
                    'aktion-bg-blue': '#5095cb',
                    'aktion-bg-navy': '#1e40af',
                    'aktion-bg-green': '#28a745',
                    'aktion-bg-yellow': '#fff201',
                    'aktion-bg-gray': '#4c4c4c',
                  }[product.aktion_button_style || ''] || '#2e2d32',
                  color: product.aktion_text_color
                    ? {
                        'aktion-text-red': '#ed1b24',
                        'aktion-text-blue': '#5095cb',
                        'aktion-text-green': '#28a745',
                        'aktion-text-yellow': '#fff201',
                        'aktion-text-white': '#FFFFFF',
                        'aktion-text-black': '#2e2d32',
                      }[product.aktion_text_color] || '#FFFFFF'
                    : product.aktion_button_style === 'aktion-bg-yellow' ? '#2e2d32' : '#FFFFFF',
                }}
              >
                {product.aktion}
              </div>
            )}

            {/* Angebotspreis Hinweis Badge — Stil aus Backend, Jäger-Farben */}
            {product.show_angebotspreis_hinweis && product.angebotspreis_hinweis && (
              <div
                className="rounded font-bold shadow-md w-fit"
                style={{
                  fontSize: '12px',
                  padding: '3% 10%',
                  whiteSpace: 'nowrap' as const,
                  backgroundColor: {
                    'aktion-bg-black': '#2e2d32',
                    'aktion-bg-red': '#ed1b24',
                    'aktion-bg-blue': '#5095cb',
                    'aktion-bg-navy': '#1e40af',
                    'aktion-bg-green': '#28a745',
                    'aktion-bg-yellow': '#fff201',
                    'aktion-bg-gray': '#4c4c4c',
                  }[product.angebotspreis_button_style || ''] || '#2e2d32',
                  color: product.angebotspreis_text_color
                    ? {
                        'aktion-text-red': '#ed1b24',
                        'aktion-text-blue': '#5095cb',
                        'aktion-text-green': '#28a745',
                        'aktion-text-yellow': '#fff201',
                        'aktion-text-white': '#FFFFFF',
                        'aktion-text-black': '#2e2d32',
                      }[product.angebotspreis_text_color] || '#FFFFFF'
                    : product.angebotspreis_button_style === 'aktion-bg-yellow' ? '#2e2d32' : '#FFFFFF',
                }}
              >
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

          {/* Produktbeschreibung als Liste mit Haken — gleiche Logik wie ProductInfo.tsx */}
          {(() => {
            // Gleiche Extraktion wie auf der Produktseite: <li>-Tags aus short_description
            let features: string[] = [];

            if (product.short_description) {
              // Strategy 1: Extract from <li> tags
              const matches = product.short_description.match(/<li>(.*?)<\/li>/g);
              if (matches) {
                features = matches.map(match => match.replace(/<\/?li>/g, '').trim()).slice(0, 3);
              }

              // Strategy 2: Bullet points as plain text (• or -)
              if (features.length === 0) {
                const lines = product.short_description
                  .replace(/<[^>]*>/g, '') // Strip HTML tags
                  .split(/\n|<br\s*\/?>/)
                  .map(line => line.replace(/^[\s•\-–]+/, '').trim())
                  .filter(line => line.length > 0);
                if (lines.length > 0) {
                  features = lines.slice(0, 3);
                }
              }
            }

            // Fallback: Root-Level-Felder (identisch mit ProductInfo.tsx)
            if (features.length === 0) {
              if (product.text_produktuebersicht && product.show_text_produktuebersicht) {
                features.push(product.text_produktuebersicht);
              }
              if (product.lieferzeit && product.show_lieferzeit) {
                features.push(product.lieferzeit);
              }
              if (product.paketinhalt) {
                features.push(`Paketinhalt: ${product.paketinhalt} ${product.einheit_short || 'm²'}`);
              }
            }

            if (features.length === 0) return null;

            return (
              <ul className="mb-3 space-y-1">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start text-xs text-gray-700">
                    <Image
                      src="/images/Icons/Haken rot.png"
                      alt="Check"
                      width={14}
                      height={14}
                      className="mr-1.5 flex-shrink-0 mt-0.5"
                    />
                    <span className="line-clamp-1">{feature}</span>
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

            // Preise direkt aus Backend-Feldern
            const displayPrice = product.price || 0;

            // Streichpreis: Bei Set-Produkten = setangebot_einzelpreis (Vergleichspreis inkl. Zusatzprodukte)
            const isSetProduct = product.show_setangebot && product.setangebot_einzelpreis;
            const stattPrice = isSetProduct
              ? (product.setangebot_einzelpreis || 0)
              : (product.regular_price || product.price || 0);
            const hasDiscount = stattPrice > displayPrice;

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
                  <span className="text-gray-900 font-medium">{isSetProduct && isFloorProduct ? 'Set-Preis' : 'Preis'}</span>
                  <span className={`font-bold text-xl ${hasDiscount ? 'text-red-600' : 'text-gray-900'}`}>
                    {displayPrice.toFixed(2).replace('.', ',')} {showUnit ? `€/${unit}` : '€'}
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      </Link>
    </article>
  );
}
