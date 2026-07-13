import Link from 'next/link'
import { Phone, Navigation, Mail } from 'lucide-react'
import { STANDORT, MAPS_ROUTE_URL } from '@/content/fachmarkt'

/**
 * Mobile Sticky-Leiste für die Fachmarkt-Service-Unterseiten:
 * Anrufen · Route · Kontakt. Auf allen sechs Seiten identisch.
 * Respektiert die iOS Safe-Area.
 */
export default function ServiceStickyBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ash bg-white/95 backdrop-blur md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid grid-cols-3">
        <a
          href={STANDORT.telefonLink}
          className="flex min-h-[56px] flex-col items-center justify-center gap-1 py-2 text-xs font-bold text-dark"
        >
          <Phone className="h-5 w-5 text-brand" />
          Anrufen
        </a>
        <a
          href={MAPS_ROUTE_URL}
          className="flex min-h-[56px] flex-col items-center justify-center gap-1 border-x border-ash py-2 text-xs font-bold text-dark"
        >
          <Navigation className="h-5 w-5 text-brand" />
          Route
        </a>
        <Link
          href="/kontakt"
          className="flex min-h-[56px] flex-col items-center justify-center gap-1 py-2 text-xs font-bold text-dark"
        >
          <Mail className="h-5 w-5 text-brand" />
          Kontakt
        </Link>
      </div>
    </div>
  )
}
