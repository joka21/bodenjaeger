import Link from 'next/link'
import { Navigation, Phone, CalendarCheck } from 'lucide-react'
import { STICKY } from '@/content/fachmarkt'

/**
 * Nur mobil (< md): fixierte Aktionsleiste am unteren Rand.
 * Respektiert die iOS Safe-Area (env(safe-area-inset-bottom)).
 */
export default function StickyBottomBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ash bg-white/95 backdrop-blur md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid grid-cols-3">
        <a
          href={STICKY.route.href}
          className="flex min-h-[56px] flex-col items-center justify-center gap-1 py-2 text-xs font-bold text-dark"
        >
          <Navigation className="h-5 w-5 text-brand" />
          Route
        </a>
        <a
          href={STICKY.anrufen.href}
          className="flex min-h-[56px] flex-col items-center justify-center gap-1 border-x border-ash py-2 text-xs font-bold text-dark"
        >
          <Phone className="h-5 w-5 text-brand" />
          Anrufen
        </a>
        <Link
          href={STICKY.beratung.href}
          className="flex min-h-[56px] flex-col items-center justify-center gap-1 py-2 text-xs font-bold text-dark"
        >
          <CalendarCheck className="h-5 w-5 text-brand" />
          Beratung
        </Link>
      </div>
    </div>
  )
}
