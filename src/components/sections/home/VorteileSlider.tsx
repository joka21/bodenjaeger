'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';

interface VorteilSlide {
  id: number;
  image: string;
  alt: string;
}

// Vorteil-Bilder aus dem Ordner
const vorteilSlides: VorteilSlide[] = [
  {
    id: 1,
    image: '/images/Startseite/Vorteil Beratung.webp',
    alt: 'Vorteil Beratung',
  },
  {
    id: 2,
    image: '/images/Startseite/Vorteil Bodenplaner.webp',
    alt: 'Vorteil Bodenplaner',
  },
  {
    id: 3,
    image: '/images/Startseite/Vorteil Fachmarkt in Hückelhoven.webp',
    alt: 'Vorteil Fachmarkt in Hückelhoven',
  },
  {
    id: 4,
    image: '/images/Startseite/Vorteil großer Lagerbestand.webp',
    alt: 'Vorteil großer Lagerbestand',
  },
  {
    id: 5,
    image: '/images/Startseite/Vorteil Lagerung.webp',
    alt: 'Vorteil Lagerung',
  },
  {
    id: 6,
    image: '/images/Startseite/Vorteil Lieferung zum Wunschtermin.webp',
    alt: 'Vorteil Lieferung zum Wunschtermin',
  },
  {
    id: 7,
    image: '/images/Startseite/Vorteil Musterbox.webp',
    alt: 'Vorteil Musterbox',
  },
  {
    id: 8,
    image: '/images/Startseite/Vorteil Setangebot.webp',
    alt: 'Vorteil Setangebot',
  },
];

export default function VorteileSlider() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Prüfe Scroll-Position
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // 10px Toleranz
  };

  // Scroll nach links
  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8; // Scrolle 80% der sichtbaren Breite

    container.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth',
    });
  };

  // Scroll nach rechts
  const scrollRight = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8;

    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  // Auto-Play Funktion
  const autoScroll = useCallback(() => {
    if (!scrollContainerRef.current || isPaused) return;

    const container = scrollContainerRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = container;

    // Wenn am Ende, zurück zum Anfang (Loop)
    if (scrollLeft >= scrollWidth - clientWidth - 10) {
      container.scrollTo({
        left: 0,
        behavior: 'smooth',
      });
    } else {
      // Sonst weiter scrollen
      scrollRight();
    }
  }, [isPaused]);

  // Auto-Play Timer (5 Sekunden)
  useEffect(() => {
    const timer = setInterval(() => {
      autoScroll();
    }, 5000);

    return () => clearInterval(timer);
  }, [autoScroll]);

  // Check scroll position on mount and scroll
  useEffect(() => {
    checkScrollPosition();

    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', checkScrollPosition);
    window.addEventListener('resize', checkScrollPosition);

    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, []);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        scrollLeft();
      } else if (e.key === 'ArrowRight') {
        scrollRight();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header - linksbündig wie bei BestsellerSlider */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Deine Vorteile auf einen Blick</h2>
          </div>

          {/* Navigation Buttons (Desktop) - genau wie BestsellerSlider */}
          <div className="hidden md:flex gap-2">
            <button
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                canScrollLeft
                  ? 'bg-white shadow-md hover:shadow-lg text-gray-900'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              aria-label="Vorherige Vorteile"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={scrollRight}
              disabled={!canScrollRight}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                canScrollRight
                  ? 'bg-white shadow-md hover:shadow-lg text-gray-900'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              aria-label="Nächste Vorteile"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Slider Container */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {vorteilSlides.map((slide) => (
              <div
                key={slide.id}
                className="flex-shrink-0 w-[calc(100%-2rem)] sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1.125rem)]"
              >
                {/* Vorteil Card */}
                <div className="group relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-white">
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={slide.id <= 4}
                    loading={slide.id <= 4 ? 'eager' : 'lazy'}
                    quality={90}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Gradient Overlays (Desktop only) */}
          {canScrollLeft && (
            <div className="hidden md:block absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
          )}
          {canScrollRight && (
            <div className="hidden md:block absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
          )}
        </div>

        {/* Mobile Navigation Indicators */}
        <div className="flex md:hidden justify-center gap-2 mt-6">
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              canScrollLeft
                ? 'bg-gray-900 text-white'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            ← Zurück
          </button>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              canScrollRight
                ? 'bg-gray-900 text-white'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            Weiter →
          </button>
        </div>
      </div>

      {/* Hide scrollbar with CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
