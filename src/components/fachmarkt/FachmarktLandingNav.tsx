'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { LANDING_NAV } from '@/content/fachmarkt'
import { isLandingRoute } from '@/lib/landingRoutes'
import CtaButton from '@/components/shared/CtaButton'

/**
 * Reduzierte Navigation der Fachmarkt-Landingpage. Ersetzt die Shop-Navigation
 * (die auf dieser Route über HeaderWrapper ausgeblendet wird).
 *
 * Sichtbar NUR auf der exakten Landing-Route (nicht auf den [slug]-Unterseiten),
 * gesteuert über dieselbe Quelle wie die Wrapper: `isLandingRoute`.
 *
 * Mobil: schlankes Hamburger-Menü mit Anker-Links, KEIN Beratungs-CTA — die
 * Aktions-CTAs übernimmt dort die StickyBottomBar (keine doppelten CTAs).
 */
export default function FachmarktLandingNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  if (!isLandingRoute(pathname)) return null

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
              href={l.href}
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
                  href={l.href}
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
