'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { shimmerBlurDataURL } from '@/lib/imageUtils';

interface SlideData {
  id: number;
  image: string;
  mobileImage: string;
  imageAlt: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    image: "/images/sliderbilder/Slider_Shop_-_Boden_kaufen.jpg",
    mobileImage: "/images/sliderbilder/mobil1.png",
    imageAlt: "Boden kaufen im Bodenjäger Shop"
  },
  {
    id: 2,
    image: "/images/sliderbilder/image (13).png",
    mobileImage: "/images/sliderbilder/mobil2.jpg",
    imageAlt: "Bodenjäger Slider"
  }
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
        {/* Main Slider Container - Full-width Image */}
        <div className="relative aspect-[3/2] lg:aspect-auto lg:min-h-[600px]">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {/* Mobile Image (< lg) */}
              <Image
                src={slide.mobileImage}
                alt={slide.imageAlt}
                fill
                className="object-cover lg:hidden"
                sizes="100vw"
                priority={index === 0}
                loading={index === 0 ? 'eager' : 'lazy'}
                placeholder="blur"
                blurDataURL={shimmerBlurDataURL(1200, 800)}
              />
              {/* Desktop Image (lg+) */}
              <Image
                src={slide.image}
                alt={slide.imageAlt}
                fill
                className="hidden object-cover lg:block"
                sizes="(max-width: 1500px) 100vw, 1500px"
                priority={index === 0}
                loading={index === 0 ? 'eager' : 'lazy'}
                placeholder="blur"
                blurDataURL={shimmerBlurDataURL(1500, 720)}
              />
            </div>
          ))}
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
