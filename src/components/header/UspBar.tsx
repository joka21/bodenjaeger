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
 * Trennstrichen. Höhe fest 68px.
 *
 * Mobile: Ticker mit genau einem USP, der automatisch durchrotiert, darunter
 * ein 2px hoher roter Fortschrittsbalken. Höhe fest 40px (38px Zeile + 2px
 * Balken), damit beim Laden nichts springt.
 *
 * Bei `prefers-reduced-motion: reduce` bleibt der erste USP stehen und der
 * Balken wird nicht animiert — die Höhe bleibt trotzdem reserviert.
 */
export default function UspBar() {
  const [index, setIndex] = useState(0)
  // Startet false, damit Server- und erstes Client-Render identisch sind.
  const [rotating, setRotating] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    setRotating(true)
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
          <ul className="flex h-[68px] items-center">
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
                  <span className="text-[13px] leading-tight text-white xl:text-sm">
                    {item.label}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* Mobile: rotierender Ticker + Fortschrittsbalken */}
      <div className="lg:hidden">
        {/* Für Screenreader alle Punkte einmal als Liste – der Ticker selbst
            ist ausgeblendet, damit die Rotation nicht wiederholt vorgelesen wird. */}
        <ul className="sr-only">
          {USP_ITEMS.map((item) => (
            <li key={item.id}>{item.label}</li>
          ))}
        </ul>

        <div
          className="flex h-[38px] items-center justify-center gap-2 px-4"
          aria-hidden="true"
        >
          <CurrentIcon className="h-4 w-4 flex-shrink-0 text-white" strokeWidth={1.75} />
          {/* leading-5 statt leading-none: `truncate` schneidet mit line-height 1
              die Unterlängen ab („g", „j", „ä"). */}
          <span className="truncate text-xs leading-5 text-white">{current.label}</span>
        </div>

        <div className="h-[2px] w-full" aria-hidden="true">
          {rotating && (
            <div key={index} className="hdr-usp-progress h-full w-full bg-hdr-red" />
          )}
        </div>
      </div>
    </div>
  )
}
