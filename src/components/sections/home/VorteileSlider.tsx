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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slidesPerView, setSlidesPerView] = useState(4);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive Slides per View
  useEffect(() => {
    const updateSlidesPerView = () => {
      if (window.innerWidth < 640) {
        setSlidesPerView(1); // Mobile
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(2); // Tablet
      } else if (window.innerWidth < 1280) {
        setSlidesPerView(3); // Small Desktop
      } else {
        setSlidesPerView(4); // Desktop
      }
    };

    updateSlidesPerView();
    window.addEventListener('resize', updateSlidesPerView);
    return () => window.removeEventListener('resize', updateSlidesPerView);
  }, []);

  // Maximaler Index basierend auf Slides per View
  const maxIndex = Math.max(0, vorteilSlides.length - slidesPerView);

  // Auto-Play Funktion
  const goToNextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => {
      // Loop: Wenn am Ende, zurück zu 0
      return prev >= maxIndex ? 0 : prev + 1;
    });
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, maxIndex]);

  const goToPrevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => {
      // Loop: Wenn am Anfang, zum Ende
      return prev === 0 ? maxIndex : prev - 1;
    });
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, maxIndex]);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentIndex || index < 0 || index > maxIndex) return;
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [currentIndex, isTransitioning, maxIndex]
  );

  // Auto-Play Timer (5 Sekunden)
  useEffect(() => {
    if (isPaused || isTransitioning) return;

    const timer = setInterval(() => {
      goToNextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, isTransitioning, goToNextSlide]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevSlide();
      } else if (e.key === 'ArrowRight') {
        goToNextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextSlide, goToPrevSlide]);

  // Berechne die Anzahl der Dots (für Pagination)
  const totalDots = maxIndex + 1;

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ihre Vorteile bei Bodenjäger
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Entdecken Sie, was uns als Ihren Partner für hochwertige Bodenbeläge auszeichnet
          </p>
        </div>

        {/* Slider Container */}
        <div
          ref={containerRef}
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          role="region"
          aria-label="Vorteile Slider"
          aria-roledescription="carousel"
        >
          {/* Slides Track */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / slidesPerView)}%)`,
              }}
            >
              {vorteilSlides.map((slide) => (
                <div
                  key={slide.id}
                  className="flex-shrink-0 px-3"
                  style={{
                    width: `${100 / slidesPerView}%`,
                  }}
                >
                  {/* Vorteil Card */}
                  <div className="group relative aspect-square overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
                    <Image
                      src={slide.image}
                      alt={slide.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes={`(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw`}
                      priority={slide.id <= 4}
                      loading={slide.id <= 4 ? 'eager' : 'lazy'}
                      quality={90}
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevSlide}
            disabled={isTransitioning}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 z-20
                       bg-gray-700/80 hover:bg-gray-800/90 text-white p-3 md:p-4 rounded-full
                       shadow-xl transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed
                       hover:scale-110 active:scale-95"
            aria-label="Vorheriger Vorteil"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={goToNextSlide}
            disabled={isTransitioning}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 z-20
                       bg-gray-700/80 hover:bg-gray-800/90 text-white p-3 md:p-4 rounded-full
                       shadow-xl transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed
                       hover:scale-110 active:scale-95"
            aria-label="Nächster Vorteil"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Dot Navigation */}
        <div className="flex justify-center items-center gap-2 mt-8">
          {Array.from({ length: totalDots }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 h-3 bg-gray-800'
                  : 'w-3 h-3 bg-gray-400 hover:bg-gray-600'
              }`}
              aria-label={`Gehe zu Gruppe ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : 'false'}
            />
          ))}
        </div>

        {/* Auto-Play Indicator */}
        {!isPaused && (
          <div className="flex justify-center mt-4">
            <span className="text-sm text-gray-500 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Auto-Play aktiv
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
