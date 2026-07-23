'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Navigation, Phone, CalendarCheck, ClipboardList } from 'lucide-react'
import { STICKY } from '@/content/fachmarkt'

const ANFRAGE_ROUTE = '/fachmarkt-hueckelhoven/service/verlegeservice-anfrage'

/**
 * Nur mobil (< md): fixierte Aktionsleiste am unteren Rand, auf allen
 * Fachmarkt-Routen (via Layout). Respektiert die iOS Safe-Area.
 * 3. Button ist dynamisch: „Anfrage" (scrollt zum Funnel) auf der
 * Anfrage-Seite, sonst „Beratung" (→ /kontakt).
 */
export default function StickyBottomBar() {
  const pathname = usePathname()
  const isAnfrage = pathname === ANFRAGE_ROUTE

  const cellCls = 'flex min-h-[56px] flex-col items-center justify-center gap-1 py-2 text-xs font-bold text-dark'

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ash bg-white/95 backdrop-blur md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid grid-cols-3">
        <a href={STICKY.route.href} className={cellCls}>
          <Navigation className="h-5 w-5 text-brand" />
          Route
        </a>
        <a href={STICKY.anrufen.href} className={`${cellCls} border-x border-ash`}>
          <Phone className="h-5 w-5 text-brand" />
          Anrufen
        </a>
        {isAnfrage ? (
          <a href="#anfrage" className={cellCls}>
            <ClipboardList className="h-5 w-5 text-brand" />
            Anfrage
          </a>
        ) : (
          <Link href={STICKY.beratung.href} className={cellCls}>
            <CalendarCheck className="h-5 w-5 text-brand" />
            Beratung
          </Link>
        )}
      </div>
    </div>
  )
}
