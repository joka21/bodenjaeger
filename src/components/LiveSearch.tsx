'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface SearchResult {
  id: number;
  name: string;
  slug: string;
  price: string;
  sku?: string;
  images: { src: string; alt?: string }[];
  categories?: { id: number; name: string; slug: string }[];
}

interface GroupedResults {
  products: SearchResult[];
  categories: Set<string>;
}

export default function LiveSearch() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const debounceTimer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery.trim())}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data); // Show all results from API (up to 50)
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  // Group results by category
  const groupedResults: GroupedResults = results.reduce((acc, product) => {
    acc.products.push(product);
    if (product.categories && product.categories.length > 0) {
      product.categories.forEach(cat => acc.categories.add(cat.name));
    }
    return acc;
  }, { products: [], categories: new Set<string>() } as GroupedResults);

  const uniqueCategories = Array.from(groupedResults.categories);

  // Highlight search term in text
  const highlightText = (text: string, search: string) => {
    if (!search.trim()) return text;

    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escapedSearch})`, 'gi'));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === search.toLowerCase() ? (
            <mark key={index} className="bg-yellow-200 font-semibold">{part}</mark>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <>
      {/* Mobile: Search Icon Button */}
      <button
        onClick={() => {
          setMobileSearchOpen(true);
          setTimeout(() => mobileInputRef.current?.focus(), 100);
        }}
        className="sm:hidden flex items-center justify-center w-8 h-8 hover:opacity-80 transition-opacity"
        aria-label="Suche öffnen"
      >
        <Image
          src="/images/Icons/Lupe weiß.png"
          alt="Suche"
          width={24}
          height={24}
          className="w-5 h-5"
          onError={(e) => {
            // Fallback: use dark icon with invert filter
            (e.target as HTMLImageElement).src = '/images/Icons/Lupe schieferschwarz.png';
            (e.target as HTMLImageElement).style.filter = 'invert(1)';
          }}
        />
      </button>

      {/* Mobile: Fullwidth Search Overlay */}
      {mobileSearchOpen && (
        <div className="sm:hidden fixed inset-0 z-[200] bg-dark/95 flex items-start pt-6 px-4" ref={searchRef}>
          <form onSubmit={(e) => { handleSubmit(e); setMobileSearchOpen(false); }} className="w-full relative">
            <div className="relative flex items-center bg-white rounded-lg">
              <input
                ref={mobileInputRef}
                type="text"
                placeholder="Suche..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (results.length > 0) setIsOpen(true);
                }}
                className="w-full h-12 pl-4 pr-12 bg-transparent text-gray-900 focus:outline-none rounded-lg text-base"
                autoComplete="off"
              />
              <button
                type="submit"
                className="absolute right-4 w-6 h-6 cursor-pointer hover:opacity-80 transition-opacity"
                aria-label="Suchen"
              >
                <Image
                  src="/images/Icons/Lupe schieferschwarz.png"
                  alt="Suche"
                  width={24}
                  height={24}
                  className="w-full h-full"
                />
              </button>
            </div>
            <button
              type="button"
              onClick={() => { setMobileSearchOpen(false); setIsOpen(false); setSearchQuery(''); }}
              className="absolute -top-1 right-0 -translate-y-full text-white text-sm py-1"
            >
              Schließen
            </button>

            {/* Mobile search results dropdown */}
            {isOpen && searchQuery.trim().length >= 2 && (
              <div className="mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-[70vh] overflow-y-auto">
                {loading && (
                  <div className="p-4 text-center text-gray-500">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-navy"></div>
                  </div>
                )}
                {!loading && results.length === 0 && (
                  <div className="p-4 text-center text-gray-500">Keine Ergebnisse gefunden</div>
                )}
                {!loading && results.length > 0 && (
                  <div>
                    {uniqueCategories.length > 0 && (
                      <div className="border-b border-gray-100">
                        <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-600 uppercase">Kategorien</div>
                        <div className="py-2">
                          {uniqueCategories.slice(0, 3).map((category, index) => (
                            <Link key={index} href={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`} onClick={() => { setIsOpen(false); setMobileSearchOpen(false); }} className="block px-4 py-2 hover:bg-gray-50 text-sm text-dark">
                              {category}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-600 uppercase">Produkte</div>
                      <div className="py-2">
                        {results.map((product) => (
                          <Link key={product.id} href={`/products/${product.slug}`} onClick={() => { setIsOpen(false); setMobileSearchOpen(false); }} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors">
                            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded overflow-hidden">
                              {product.images.length > 0 ? (
                                <Image src={product.images[0].src} alt={product.images[0].alt || product.name} width={48} height={48} className="object-cover w-full h-full" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Kein Bild</div>
                              )}
                            </div>
                            <div className="flex-grow min-w-0">
                              <div className="text-sm font-medium text-dark">{highlightText(product.name, searchQuery.trim())}</div>
                            </div>
                            <div className="flex-shrink-0 text-sm font-semibold text-dark">{parseFloat(product.price).toFixed(2)} €</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-gray-100">
                      <Link href={`/search?q=${encodeURIComponent(searchQuery)}`} onClick={() => { setIsOpen(false); setMobileSearchOpen(false); }} className="block px-4 py-3 text-center text-sm font-medium text-navy hover:bg-gray-50">
                        {results.length >= 50 ? `Alle Ergebnisse anzeigen (${results.length}+)` : `Alle ${results.length} Ergebnisse anzeigen`}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
      )}

      {/* Desktop: Inline Search */}
      <div ref={searchRef} className="relative hidden sm:block w-[200px] lg:w-[250px]">
        <form onSubmit={handleSubmit} className="bg-white rounded-[12%]">
          <div className="relative w-full h-full flex items-center">
            <input
              ref={inputRef}
              type="text"
              placeholder="Suche..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (results.length > 0) setIsOpen(true);
              }}
              className="w-full h-12 pl-4 pr-12 bg-transparent text-gray-900 focus:outline-none rounded-[12%]"
              autoComplete="off"
            />
            <button
              type="submit"
              className="absolute right-4 w-6 h-6 cursor-pointer hover:opacity-80 transition-opacity"
              aria-label="Suchen"
            >
              <Image
                src="/images/Icons/Lupe schieferschwarz.png"
                alt="Suche"
                width={24}
                height={24}
                className="w-full h-full"
              />
            </button>
          </div>
        </form>

      {/* Dropdown with results */}
      {isOpen && searchQuery.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-[100] max-h-[70vh] overflow-y-auto">
          {loading && (
            <div className="p-4 text-center text-gray-500">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-navy"></div>
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              Keine Ergebnisse gefunden
            </div>
          )}

          {!loading && results.length > 0 && (
            <div>
              {/* Categories Section */}
              {uniqueCategories.length > 0 && (
                <div className="border-b border-gray-100">
                  <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
                    Kategorien
                  </div>
                  <div className="py-2">
                    {uniqueCategories.slice(0, 3).map((category, index) => (
                      <Link
                        key={index}
                        href={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-2 hover:bg-gray-50 text-sm text-dark"
                      >
                        📁 {category}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Products Section */}
              <div>
                <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
                  Produkte
                </div>
                <div className="py-2">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded overflow-hidden">
                        {product.images.length > 0 ? (
                          <Image
                            src={product.images[0].src}
                            alt={product.images[0].alt || product.name}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            Kein Bild
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-grow min-w-0">
                        <div className="text-sm font-medium text-dark">
                          {highlightText(product.name, searchQuery.trim())}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {product.categories && product.categories.length > 0 && (
                            <span>{product.categories[0].name}</span>
                          )}
                          {product.sku && (
                            <span className="ml-2">
                              {product.categories && product.categories.length > 0 && ' • '}
                              SKU: {highlightText(product.sku, searchQuery.trim())}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex-shrink-0 text-sm font-semibold text-dark">
                        {parseFloat(product.price).toFixed(2)} €
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* View all results link */}
              {results.length > 0 && (
                <div className="border-t border-gray-100">
                  <Link
                    href={`/search?q=${encodeURIComponent(searchQuery)}`}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-center text-sm font-medium text-navy hover:bg-gray-50"
                  >
                    {results.length >= 50
                      ? `Alle Ergebnisse anzeigen (${results.length}+)`
                      : `Alle ${results.length} Ergebnisse anzeigen`}
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      </div>
    </>
  );
}
