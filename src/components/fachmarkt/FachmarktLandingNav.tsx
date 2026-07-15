'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { LANDING_NAV } from '@/content/fachmarkt'
import { isFachmarktRoute } from '@/lib/landingRoutes'
import CtaButton from '@/components/shared/CtaButton'

/**
 * Reduzierte Navigation des Fachmarkt-Bereichs. Ersetzt die Shop-Navigation
 * (die auf diesen Routen über HeaderWrapper ausgeblendet wird).
 *
 * Sichtbar auf der Landingpage UND allen Unterseiten unter
 * `/fachmarkt-hueckelhoven` (Prefix-Match via `isFachmarktRoute`) – damit der
 * Fachmarkt navigatorisch ein geschlossener Bereich ist (Kundenvorgabe).
 *
 * Die Anker-Links zeigen absolut auf die Abschnitte der Landingpage
 * (`/fachmarkt-hueckelhoven#…`), damit sie auch von Unterseiten aus dorthin
 * springen. Das Logo verweist ebenfalls auf die Landingpage.
 *
 * Mobil: schlankes Hamburger-Menü mit Anker-Links, KEIN Beratungs-CTA — die
 * Aktions-CTAs übernimmt dort die StickyBottomBar (keine doppelten CTAs).
 */
export default function FachmarktLandingNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  if (!isFachmarktRoute(pathname)) return null

  return (
    <header className="sticky top-0 z-50 bg-dark/95 backdrop-blur">
      <nav className="content-container flex h-16 items-center justify-between gap-4 md:h-20">
        <Link href="/fachmarkt-hueckelhoven" className="flex flex-shrink-0 items-center">
          <Image
            src="/images/logo/logo-bodenjaeger-fff.svg"
            alt="Bodenjäger Logo"
            width={200}
            height={80}
            className="h-7 w-auto md:h-9"
            priority
          />
        </Link>

        {/* Desktop: Anker-Links + CTA */}
        <div className="hidden items-center gap-7 lg:flex">
          {LANDING_NAV.links.map((l) => (
            <a
              key={l.href}
              href={`/fachmarkt-hueckelhoven${l.href}`}
              className="text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="hidden flex-shrink-0 lg:block">
          <CtaButton cta={LANDING_NAV.cta} size="md" />
        </div>

        {/* Mobil: Hamburger */}
        <button
          type="button"
          aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-white lg:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobiles Anker-Menü (ohne CTA — siehe StickyBottomBar) */}
      {open && (
        <div className="border-t border-white/10 bg-dark lg:hidden">
          <ul className="content-container flex flex-col py-2">
            {LANDING_NAV.links.map((l) => (
              <li key={l.href}>
                <a
                  href={`/fachmarkt-hueckelhoven${l.href}`}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base font-medium text-white/85 hover:text-white"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
