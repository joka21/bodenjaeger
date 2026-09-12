'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Check } from 'lucide-react'
import { HERO } from '@/content/fachmarkt'
import { AKTION_BANNER } from '@/content/aktion-banner'
import CtaButton from '@/components/shared/CtaButton'

/**
 * Sektion 1: Hero als Slider mit zwei Slides.
 *
 *  1. Aktions-Banner „Jedes 7. Paket gratis" — dasselbe Motiv wie der erste
 *     Slide der Startseite, Quelle ist `AKTION_BANNER`.
 *  2. Der bisherige Foto-Hero mit H1, CTAs und Vorteils-Zeilen. Bleibt
 *     unverändert erhalten, weil H1 und Kicker das lokale SEO dieser Seite
 *     tragen.
 *
 * Beide Slides liegen in derselben Höhe (~70–78vh), damit beim Wechsel nichts
 * springt — deshalb wird das Banner-Bild mit `object-contain` eingepasst statt
 * beschnitten. Die Ränder bleiben unsichtbar, weil der Slide-Hintergrund exakt
 * dem Rot des PNGs entspricht.
 *
 * Höhe bewusst reduziert, damit der Foto-Hero inkl. CTAs auf 1440×900 und
 * 1920×1080 ohne Scrollen sichtbar ist. Mobile: keine Buttons (StickyBottomBar).
 */

const SLIDE_COUNT = 2
const AUTOPLAY_MS = 6000
const MIN_SWIPE_PX = 50

/**
 * Gemeinsame Höhe beider Slides.
 *
 * Der Banner wird nie beschnitten (`object-contain`). Damit er trotzdem die
 * volle Breite des Heros füllt und nicht klein in der Mitte steht, muss die
 * Sektion mindestens so hoch sein wie das Motiv bei voller Breite:
 *
 *   Desktop  8547×4134 → 4134/8547 = 48,37% der Breite → 48.37vw
 *   Mobil    3138×4133 → 4133/3138 = 131,72% der Breite → 131.72vw
 *
 * `max(...)` hält die ursprüngliche Hero-Höhe (70vh/78vh) als Untergrenze —
 * der Foto-Slide braucht sie für Text und CTAs.
 *
 * Die inneren `min(...)` deckeln nach oben, damit der Hero nicht höher als das
 * Fenster wird: 85vh fängt das Hochformat ab, das im Tablet-Bereich bis 1199px
 * sonst über 1500px hoch würde, 88vh den Ultrawide-Fall (2560×1080 käme sonst
 * auf 1238px bei 1080px Fensterhöhe).
 *
 * Greift eine der Grenzen, bleiben Ränder in der Rotfläche des Motivs stehen —
 * sichtbar beschnitten wird nie etwas.
 */
const HEIGHT =
  'min-h-[max(70vh,min(131.72vw,85vh))] min-[1200px]:min-h-[max(78vh,min(48.37vw,88vh))]'

export default function FachmarktHero() {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const next = useCallback(() => setCurrent((p) => (p + 1) % SLIDE_COUNT), [])
  const prev = useCallback(() => setCurrent((p) => (p - 1 + SLIDE_COUNT) % SLIDE_COUNT), [])

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(next, AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [isPaused, next])

  const onTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return
    const distance = touchStart - touchEnd
    if (distance > MIN_SWIPE_PX) next()
    else if (distance < -MIN_SWIPE_PX) prev()
  }

  return (
    <section
      className={`relative w-full overflow-hidden ${HEIGHT}`}
      style={{ backgroundColor: AKTION_BANNER.bgColor }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={(e) => {
        setTouchEnd(null)
        setTouchStart(e.targetTouches[0].clientX)
      }}
      onTouchMove={(e) => setTouchEnd(e.targetTouches[0].clientX)}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-label="Fachmarkt Hückelhoven – Aktion und Überblick"
      aria-roledescription="carousel"
    >
      {/* Reihenfolge ist Absicht: Der Foto-Slide bleibt im normalen Fluss und
          bestimmt damit die Höhe der Sektion — sein Text kann auf kleinen
          Phones über 70vh hinauswachsen, und die Sektion wächst mit. Würden
          beide Slides absolut liegen, käme die Höhe allein von `min-h` und
          `overflow-hidden` würde den Text abschneiden.
          Der Banner liegt darüber. Beide bleiben im DOM (kein Neuladen der
          Bilder beim Wechsel); der inaktive ist per `pointer-events-none` und
          `aria-hidden` aus Interaktion und Screenreader-Ausgabe genommen. */}
      <FotoSlide isActive={current === 1} />
      <AktionSlide isActive={current === 0} />

      {/* Pfeile */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2 text-gray-800 shadow-lg transition-colors hover:bg-white md:p-3"
        aria-label="Vorheriger Slide"
      >
        <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2 text-gray-800 shadow-lg transition-colors hover:bg-white md:p-3"
        aria-label="Nächster Slide"
      >
        <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Punkte */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 md:bottom-6 md:gap-3">
        {Array.from({ length: SLIDE_COUNT }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2.5 rounded-full transition-all duration-300 md:h-3 ${
              i === current ? 'w-6 bg-white md:w-8' : 'w-2.5 bg-white/50 hover:bg-white/75 md:w-3'
            }`}
            aria-label={`Zu Slide ${i + 1}`}
            aria-current={i === current ? 'true' : 'false'}
          />
        ))}
      </div>
    </section>
  )
}

/**
 * Sichtbarkeit eines Slides — gemeinsam für beide, damit der Fade gleich läuft.
 * Der inaktive Slide wird zusätzlich per `inert` stillgelegt (siehe unten),
 * `pointer-events-none` ist der Fallback für Browser ohne `inert`.
 */
function fadeCls(isActive: boolean) {
  return `transition-opacity duration-500 ${
    isActive ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'
  }`
}

/**
 * Slide 1: Aktions-Banner. Bild ist der komplette Slide — Headline, Text,
 * Enddatum, Badges und Button sind eingebrannt, deshalb kein HTML-Text daneben
 * und die ganze Fläche als Link.
 */
function AktionSlide({ isActive }: { isActive: boolean }) {
  return (
    <div className={`absolute inset-0 ${fadeCls(isActive)}`} inert={!isActive}>
      <a
        href={AKTION_BANNER.href}
        aria-label={AKTION_BANNER.linkLabel}
        className="relative block h-full w-full"
      >
        {/* Querformat ab 1200px, darunter das Hochformat — wie auf der
            Startseite. `object-contain` hält beide Motive vollständig
            sichtbar; beschneiden würde links die Headline und rechts die
            Badges kosten. */}
        <Image
          src={AKTION_BANNER.imageDesktop}
          alt={AKTION_BANNER.alt}
          fill
          priority
          sizes="100vw"
          className="hidden object-contain min-[1200px]:block"
        />
        <Image
          src={AKTION_BANNER.imageMobile}
          alt={AKTION_BANNER.alt}
          fill
          priority
          sizes="100vw"
          className="object-contain min-[1200px]:hidden"
        />
      </a>
    </div>
  )
}

/** Slide 2: bisheriger Foto-Hero, unverändert — liegt im Fluss und gibt die Höhe. */
function FotoSlide({ isActive }: { isActive: boolean }) {
  return (
    <div className={`relative bg-dark ${fadeCls(isActive)}`} inert={!isActive}>
      <Image
        src={HERO.image}
        alt={HERO.imageAlt}
        fill
        sizes="100vw"
        className="fm-kenburns object-cover"
      />
      {/* Verlauf links → rechts für Lesbarkeit */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(90deg, rgba(46,45,50,0.92) 0%, rgba(46,45,50,0.7) 40%, rgba(46,45,50,0.15) 100%)' }}
      />

      <div className={`content-container relative flex items-center ${HEIGHT}`}>
        <div className="max-w-2xl py-14 text-white md:py-16">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-white/80">
            {HERO.kicker}
          </p>
          <h1
            className="font-bold leading-[1.08]"
            style={{ fontSize: 'clamp(1.9rem, 6vw, 3.75rem)' }}
          >
            {HERO.headline}
          </h1>
          <p
            className="mt-5 text-white/85"
            style={{ fontSize: 'clamp(1.05rem, 1.6vw, 1.375rem)' }}
          >
            {HERO.subline}
          </p>

          {/* CTAs nur ab md — mobil übernimmt die StickyBottomBar */}
          <div className="mt-8 hidden flex-wrap gap-4 md:flex">
            {HERO.ctas.map((cta) => (
              <CtaButton key={cta.label} cta={cta} size="lg" />
            ))}
          </div>

          {/* Schlichte Zeilen, keine Karten-Optik */}
          <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 md:mt-10">
            {HERO.checks.map((check) => (
              <li key={check} className="flex items-center gap-3 text-white/90">
                <Check className="h-5 w-5 flex-shrink-0 text-brand" strokeWidth={3} />
                <span className="text-base font-medium md:text-lg">{check}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
