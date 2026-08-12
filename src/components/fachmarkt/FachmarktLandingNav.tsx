'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, Phone, Store } from 'lucide-react'
import {
  LANDING_NAV,
  LEISTUNGEN_DROPDOWN,
  OEFFNUNGSZEITEN_KURZ,
  STANDORT,
  primaryNavCta,
} from '@/content/fachmarkt'
import { isFachmarktRoute } from '@/lib/landingRoutes'
import CtaButton from '@/components/shared/CtaButton'

const FM = '/fachmarkt-hueckelhoven'

/**
 * Einheitlicher Header des gesamten Fachmarkt-Bereichs (ersetzt die Shop-Nav,
 * die hier über HeaderWrapper ausgeblendet wird). Enthält Logo-Lockup,
 * Anker-Links auf die Landingpage-Sektionen, ein tastaturbedienbares
 * „Leistungen"-Dropdown auf die echten Service-Routen, Kontaktinfo,
 * „Zum Shop" und ein routenabhängiges Primär-CTA.
 */
export default function FachmarktLandingNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false) // Mobile-Menü
  const [mLeistungen, setMLeistungen] = useState(false) // Mobile-Akkordeon
  const [dropdown, setDropdown] = useState(false) // Desktop-Dropdown
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const dropdownBtnRef = useRef<HTMLButtonElement | null>(null)

  const onServiceRoute = pathname?.startsWith(`${FM}/service`) ?? false
  const primaryCta = primaryNavCta(pathname ?? FM)

  // Escape schließt Mobile-Menü und Desktop-Dropdown; Klick außerhalb schließt Dropdown.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDropdown(false)
        setOpen(false)
      }
    }
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdown(false)
      }
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [])

  // Menüs bei Routenwechsel schließen.
  useEffect(() => {
    setOpen(false)
    setDropdown(false)
    setMLeistungen(false)
  }, [pathname])

  if (!isFachmarktRoute(pathname)) return null

  const anchorCls = 'text-sm font-medium text-white/80 transition-colors hover:text-white'
  const leistungenActiveCls = onServiceRoute
    ? 'text-white after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:bg-brand'
    : 'text-white/80 hover:text-white'

  return (
    <header className="sticky top-0 z-50 bg-dark/95 backdrop-blur">
      {/* Info-Zeile (Desktop): Telefon + Öffnungszeiten */}
      <div className="hidden border-b border-white/10 md:block">
        <div className="content-container flex h-9 items-center justify-end gap-3 text-xs text-white/70">
          <a href={STANDORT.telefonLink} className="font-semibold text-white hover:text-brand">
            {STANDORT.telefonAnzeige}
          </a>
          <span aria-hidden>·</span>
          <span>{OEFFNUNGSZEITEN_KURZ}</span>
        </div>
      </div>

      <nav className="content-container flex h-16 items-center justify-between gap-4 md:h-20">
        {/* Logo-Lockup: Bodenjäger + Fachmarkt Hückelhoven */}
        <Link href={FM} className="flex flex-shrink-0 flex-col leading-none">
          <Image
            src="/images/logo/logo-bodenjaeger-fff.svg"
            alt="Bodenjäger"
            width={200}
            height={80}
            className="h-6 w-auto md:h-8"
            priority
          />
          <span className="mt-1 text-[0.6rem] font-semibold uppercase tracking-wide text-brand md:text-xs">
            Fachmarkt Hückelhoven
          </span>
        </Link>

        {/* Desktop: Nav-Items */}
        <div className="hidden items-center gap-6 lg:flex">
          {LANDING_NAV.items.map((item) => {
            if (item.kind === 'leistungen') {
              return (
                <div key="leistungen" ref={dropdownRef} className="relative">
                  <button
                    ref={dropdownBtnRef}
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={dropdown}
                    onClick={() => setDropdown((v) => !v)}
                    className={`relative flex items-center gap-1 text-sm font-medium transition-colors ${leistungenActiveCls}`}
                  >
                    {item.label}
                    <ChevronDown className={`h-4 w-4 transition-transform ${dropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {dropdown && (
                    <div
                      role="menu"
                      className="absolute left-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-white/10 bg-dark py-2 shadow-xl"
                    >
                      {LEISTUNGEN_DROPDOWN.map((l) => (
                        <Link
                          key={l.href}
                          href={l.href}
                          role="menuitem"
                          className="block px-4 py-2.5 text-sm text-white/85 hover:bg-white/10 hover:text-white"
                        >
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }
            return (
              <a key={item.href} href={`${FM}${item.href}`} className={anchorCls}>
                {item.label}
              </a>
            )
          })}
        </div>

        {/* Desktop: Buttons rechts.
            „Zum Shop" ist als Outline-Button gestaltet wie das Gegenstück
            „Zum Fachmarkt Hückelhoven" im Shop-Header (HeaderNav.tsx):
            51px hoch, Rahmen hdr-outline, rounded-lg, Icon + Label. Die Breite
            richtet sich hier nach dem Text, weil das Label deutlich kürzer ist. */}
        <div className="hidden flex-shrink-0 items-center gap-4 lg:flex">
          <Link
            href={LANDING_NAV.shopCta.href}
            className="flex h-[51px] flex-shrink-0 items-center justify-center gap-2.5 rounded-lg border border-hdr-outline px-6 text-sm text-white transition-colors hover:border-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Store className="h-[18px] w-[18px] flex-shrink-0" strokeWidth={1.75} aria-hidden="true" />
            {LANDING_NAV.shopCta.label}
          </Link>
          <CtaButton cta={primaryCta} size="md" />
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

      {/* Mobiles Menü */}
      {open && (
        <div className="border-t border-white/10 bg-dark lg:hidden">
          <div className="content-container py-3">
            {/* Kontaktinfo */}
            <a
              href={STANDORT.telefonLink}
              className="flex items-center gap-2 py-2 text-base font-bold text-white"
            >
              <Phone className="h-5 w-5 text-brand" />
              {STANDORT.telefonAnzeige}
            </a>
            <p className="pb-3 text-xs text-white/60">{OEFFNUNGSZEITEN_KURZ}</p>

            <ul className="flex flex-col border-t border-white/10 pt-2">
              {LANDING_NAV.items.map((item) => {
                if (item.kind === 'leistungen') {
                  return (
                    <li key="leistungen">
                      <button
                        type="button"
                        aria-expanded={mLeistungen}
                        onClick={() => setMLeistungen((v) => !v)}
                        className="flex w-full items-center justify-between py-3 text-base font-medium text-white/85 hover:text-white"
                      >
                        {item.label}
                        <ChevronDown className={`h-5 w-5 transition-transform ${mLeistungen ? 'rotate-180' : ''}`} />
                      </button>
                      {mLeistungen && (
                        <ul className="mb-1 flex flex-col border-l border-white/10 pl-4">
                          {LEISTUNGEN_DROPDOWN.map((l) => (
                            <li key={l.href}>
                              <Link
                                href={l.href}
                                onClick={() => setOpen(false)}
                                className="block py-2.5 text-sm text-white/75 hover:text-white"
                              >
                                {l.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  )
                }
                return (
                  <li key={item.href}>
                    <a
                      href={`${FM}${item.href}`}
                      onClick={() => setOpen(false)}
                      className="block py-3 text-base font-medium text-white/85 hover:text-white"
                    >
                      {item.label}
                    </a>
                  </li>
                )
              })}
            </ul>

            {/* CTAs */}
            <div className="mt-3 flex flex-col gap-3 border-t border-white/10 pt-4">
              <Link
                href={LANDING_NAV.shopCta.href}
                onClick={() => setOpen(false)}
                className="flex h-[51px] w-full items-center justify-center gap-2.5 rounded-lg border border-hdr-outline text-sm text-white transition-colors hover:border-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <Store className="h-[18px] w-[18px] flex-shrink-0" strokeWidth={1.75} aria-hidden="true" />
                {LANDING_NAV.shopCta.label}
              </Link>
              <CtaButton cta={primaryCta} size="md" className="w-full" />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
