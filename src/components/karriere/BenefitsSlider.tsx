'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface Benefit {
  label: string;
  iconFile: string;
}

const BENEFITS: Benefit[] = [
  { label: '30 Tage Urlaub', iconFile: '30 Tage Urlaub.jpg' },
  { label: 'Betriebliche Altersvorsorge', iconFile: 'Betriebliche Altersvorsorge.jpg' },
  { label: 'Faire Vergütung', iconFile: 'Faire Vergütung.jpg' },
  { label: 'Jobrad', iconFile: 'Jobrad.jpg' },
  { label: 'Mitarbeiterrabatt', iconFile: 'Mitarbeiterrabatte.jpg' },
  { label: 'Regelmäßige Feedback-Gespräche', iconFile: 'Regelmäßige Feedbackgespräche.jpg' },
  { label: 'Starker Teamgeist', iconFile: 'Starker Teamgeist.jpg' },
  { label: 'Team-Events', iconFile: 'Teamevents.jpg' },
  { label: 'Weiterentwicklungsmöglichkeiten', iconFile: 'Weiterentwicklungsmöglichkeiten.jpg' },
  { label: 'Super Kollegen', iconFile: 'Super Kollegen.jpg' },
];

const AUTOPLAY_INTERVAL_MS = 3500;

export default function BenefitsSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const scrollByCard = useCallback(() => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector('[data-card]') as HTMLElement | null;
    if (!card) return;
    const cardWidth = card.offsetWidth + 5; // 5px = gap zwischen Karten
    scrollRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
  }, []);

  // Auto-Play: pausiert bei Hover/Touch, springt am Ende zurück zum Anfang
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const container = scrollRef.current;
      if (!container) return;

      const { scrollLeft, scrollWidth, clientWidth } = container;
      const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 4;

      if (isAtEnd) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollByCard();
      }
    }, AUTOPLAY_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isPaused, scrollByCard]);

  return (
    <div
      className="relative max-w-7xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
    >
      <div
        ref={scrollRef}
        className="flex gap-[5px] overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 px-2 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        {BENEFITS.map((benefit) => (
          <div
            key={benefit.label}
            data-card
            className="flex-shrink-0 w-[80%] sm:w-[calc(50%-2.5px)] md:w-[calc(33.333%-3.333px)] lg:w-[calc(25%-3.75px)] relative aspect-[1.9/1] rounded-2xl overflow-hidden snap-start"
          >
            <Image
              src={`/images/jobs/${benefit.iconFile}`}
              alt={benefit.label}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 80vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
