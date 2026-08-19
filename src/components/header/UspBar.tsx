'use client'

import { useEffect, useState } from 'react'
import { CalendarDays, Gift, Package, Truck, type LucideIcon } from 'lucide-react'
import { USP_INTERVAL_MS, USP_ITEMS, type NavIcon } from '@/content/shopNav'

const ICONS: Record<NavIcon, LucideIcon> = {
  package: Package,
  truck: Truck,
  calendar: CalendarDays,
  gift: Gift,
}

/**
 * Zeile 1 des Shop-Headers.
 *
 * Desktop (ab lg): alle vier USP statisch, gleichmäßig verteilt, mit vertikalen
 * Trennstrichen. Höhe fest 48px — der Header schiebt die Leiste ab lg per
 * `lg:top-[-48px]` aus dem Bild (Header.tsx). Höhe hier ändern heißt Offset
 * dort mitändern.
 *
 * Mobile: Ticker mit genau einem USP, der automatisch durchrotiert, darunter
 * ein ruhender 1px-Trennstrich in `--hdr-line` — derselbe Strich, der die
 * Zeilen im übrigen Header und im Footer trennt. Kein Fortschrittsbalken: die
 * mitlaufende Animation zog das Auge in eine Nebenzeile.
 *
 * Höhe fest 40px (39px Zeile + 1px Strich). Diese Zahl ist gesetzt — der
 * Header schiebt die Leiste mobil per `top-[-40px]` aus dem Bild
 * (Header.tsx). Ändert sich die Höhe hier, muss der Offset dort mitwandern.
 *
 * Bei `prefers-reduced-motion: reduce` bleibt der erste USP stehen.
 */
export default function UspBar() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % USP_ITEMS.length)
    }, USP_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [])

  const current = USP_ITEMS[index]
  const CurrentIcon = ICONS[current.icon]

  return (
    <div className="w-full bg-hdr-bg">
      {/* Desktop: vier Punkte statisch */}
      <div className="hidden border-b border-hdr-line lg:block">
        <div className="content-container">
          <ul className="flex h-[48px] items-center">
            {USP_ITEMS.map((item, i) => {
              const Icon = ICONS[item.icon]
              return (
                <li
                  key={item.id}
                  className={`flex flex-1 items-center justify-center gap-2.5 px-4 ${
                    i > 0 ? 'border-l border-hdr-line' : ''
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0 text-white" strokeWidth={1.75} />
                  {/* Bewusst kleiner als die Hauptnavigation: die USP-Zeile ist
                      Beiwerk und soll die Marke darunter nicht überstimmen. */}
                  <span className="text-xs leading-tight text-white xl:text-[13px]">
                    {item.label}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* Mobile: rotierender Ticker, darunter der ruhende Trennstrich */}
      <div className="border-b border-hdr-line lg:hidden">
        {/* Für Screenreader alle Punkte einmal als Liste – der Ticker selbst
            ist ausgeblendet, damit die Rotation nicht wiederholt vorgelesen wird. */}
        <ul className="sr-only">
          {USP_ITEMS.map((item) => (
            <li key={item.id}>{item.label}</li>
          ))}
        </ul>

        <div
          className="flex h-[39px] items-center justify-center gap-2 px-4"
          aria-hidden="true"
        >
          <CurrentIcon className="h-4 w-4 flex-shrink-0 text-white" strokeWidth={1.75} />
          {/* leading-5 statt leading-none: `truncate` schneidet mit line-height 1
              die Unterlängen ab („g", „j", „ä"). */}
          <span className="truncate text-xs leading-5 text-white">{current.label}</span>
        </div>
      </div>
    </div>
  )
}
