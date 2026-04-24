'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface SlideData {
  id: number;
  bgColor: string;
  image: string;
  imageAlt: string;
  // object-position für das Desktop-Bild (object-cover). Verschiebt den
  // sichtbaren Ausschnitt vertikal. Default "center center" (50% 50%).
  // Kleinerer Y-Wert = zeigt mehr vom oberen Bildrand = Content rutscht optisch nach unten.
  objectPosition?: string;
  heading: string;
  subline?: string;
  bullets?: string[];
  text?: string;
  dateText?: string;
  buttonLabel: string;
  buttonHref: string;
  buttonVariant: 'light' | 'dark';
}

const slides: SlideData[] = [
  {
    id: 1,
    bgColor: '#4c4c4c',
    image: '/images/sliderbilder/primecore.webp',
    imageAlt: 'Primecore',
    objectPosition: 'center 45%',
    heading: 'primeCORE',
    subline: 'Der extrem starke Vinylboden.',
    bullets: [
      '0,7mm Nutzschicht',
      '8mm stark',
      'Korkdämmung integriert',
      'Lebenslange Garantie',
    ],
    buttonLabel: 'Mehr erfahren',
    buttonHref: '#',
    buttonVariant: 'light',
  },
  {
    id: 2,
    bgColor: '#00518a',
    image: '/images/sliderbilder/coreTec.webp',
    imageAlt: 'CoreTec',
    objectPosition: 'center 30%',
    heading: 'COREtec',
    text: 'Die Markenwelt der Luxusböden mit lebenslanger Garantie.',
    buttonLabel: 'Mehr erfahren',
    buttonHref: '#',
    buttonVariant: 'dark',
  },
  {
    id: 3,
    bgColor: '#ed1b24',
    image: '/images/sliderbilder/angebot.webp',
    imageAlt: 'Angebot',
    heading: 'Unsere aktuellen Aktionsböden.',
    subline: 'Bis zu 47% sparen!',
    dateText: 'Nur bis zum 27.06.2026',
    buttonLabel: 'Jetzt sparen',
    buttonHref: '#',
    buttonVariant: 'light',
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  // Navigation callbacks - defined before useEffect that uses them
  const goToNextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const goToPrevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  // Auto-play functionality
  useEffect(() => {
    if (isPaused || isTransitioning) return;

    const timer = setInterval(() => {
      goToNextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentSlide, isPaused, isTransitioning, goToNextSlide]);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [currentSlide, isTransitioning]);

  // Keyboard navigation
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

  // Touch handlers for mobile swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNextSlide();
    } else if (isRightSwipe) {
      goToPrevSlide();
    }
  };

  return (
    <div className="w-full bg-white overflow-hidden">
      <div
        className="max-w-[1500px] mx-auto sm:px-4 relative overflow-hidden bg-white"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        role="region"
        aria-label="Hero Slider"
        aria-roledescription="carousel"
      >
        {/* Main Slider Container
            Desktop: Slides absolut gestapelt mit Fade-Transition, feste min-Höhe 600px.
            Mobile: nur aktiver Slide wird gerendert (natürlicher Flow), damit das Bild
            volle Breite bekommen kann und der Container mitwächst. */}
        <div className="relative lg:min-h-[600px]">
          {slides.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
            <div
              key={slide.id}
              className={`${
                isActive
                  ? 'block lg:opacity-100 lg:z-10'
                  : 'hidden lg:block lg:opacity-0 lg:z-0'
              } lg:absolute lg:inset-0 lg:transition-opacity lg:duration-500`}
              style={{ backgroundColor: slide.bgColor }}
            >
              {/* Desktop-Layout: links Text, rechts Bild (948px) */}
              <div className="hidden lg:flex h-full min-h-[600px]">
                <div className="flex-1 flex flex-col justify-center px-16 py-12 text-white">
                  <h2 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight">
                    {slide.heading}
                  </h2>
                  {slide.subline && (
                    <p className="text-xl xl:text-2xl mb-6 max-w-md">
                      {slide.subline}
                    </p>
                  )}
                  {slide.bullets && (
                    <ul className="text-base xl:text-lg mb-8 space-y-1.5">
                      {slide.bullets.map((b) => (
                        <li key={b}>• {b}</li>
                      ))}
                    </ul>
                  )}
                  {slide.text && (
                    <p className="text-xl xl:text-2xl mb-8 max-w-lg leading-snug">
                      {slide.text}
                    </p>
                  )}
                  {slide.dateText && (
                    <p className="text-base xl:text-lg mb-8 max-w-md">
                      {slide.dateText}
                    </p>
                  )}
                  <a
                    href={slide.buttonHref}
                    className={`inline-flex items-center justify-center gap-2 w-fit px-8 py-3 font-semibold rounded-full transition-colors ${
                      slide.buttonVariant === 'dark'
                        ? 'bg-dark text-white hover:bg-black'
                        : 'bg-white text-dark hover:bg-gray-100'
                    }`}
                  >
                    {slide.buttonLabel}
                    <span aria-hidden>›</span>
                  </a>
                </div>
                <div className="w-[948px] flex-shrink-0 relative">
                  <Image
                    src={slide.image}
                    alt={slide.imageAlt}
                    fill
                    className="object-cover"
                    style={{ objectPosition: slide.objectPosition ?? 'center center' }}
                    sizes="948px"
                    priority={index === 0}
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                </div>
              </div>

              {/* Mobile-Layout: Bild oben in voller Breite, Text unten.
                  Container-Aspect passt zum Bild (948x724), sodass das Bild
                  die ganze Breite füllt und der eingebettete Text komplett sichtbar bleibt. */}
              <div className="lg:hidden">
                <div className="relative w-full aspect-[948/724]">
                  <Image
                    src={slide.image}
                    alt={slide.imageAlt}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority={index === 0}
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                </div>
                <div className="flex flex-col items-start px-10 pt-8 pb-20 text-white">
                  <h2 className="text-3xl font-bold mb-4 leading-tight">
                    {slide.heading}
                  </h2>
                  {slide.subline && (
                    <p className="text-lg mb-4">{slide.subline}</p>
                  )}
                  {slide.bullets && (
                    <ul className="text-base mb-6 space-y-1.5">
                      {slide.bullets.map((b) => (
                        <li key={b}>• {b}</li>
                      ))}
                    </ul>
                  )}
                  {slide.text && (
                    <p className="text-lg mb-6 leading-snug">{slide.text}</p>
                  )}
                  {slide.dateText && (
                    <p className="text-base mb-6">{slide.dateText}</p>
                  )}
                  <a
                    href={slide.buttonHref}
                    className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 font-semibold rounded-full transition-colors ${
                      slide.buttonVariant === 'dark'
                        ? 'bg-dark text-white hover:bg-black'
                        : 'bg-white text-dark hover:bg-gray-100'
                    }`}
                  >
                    {slide.buttonLabel}
                    <span aria-hidden>›</span>
                  </a>
                </div>
              </div>
            </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevSlide}
          disabled={isTransitioning}
          className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 p-2 md:p-3 rounded-full shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          aria-label="Previous slide"
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
          className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 p-2 md:p-3 rounded-full shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          aria-label="Next slide"
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

        {/* Dot Navigation */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 md:gap-3">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`h-2.5 md:h-3 rounded-full transition-all duration-300 touch-manipulation ${
                index === currentSlide
                  ? 'bg-white w-6 md:w-8'
                  : 'bg-white/50 hover:bg-white/75 w-2.5 md:w-3'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide ? 'true' : 'false'}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
