'use client'

/**
 * Mobil (< md): fixierter "Verlegeservice anfragen"-Button, scrollt zum
 * Formular-Anker (#anfrage). Respektiert die iOS Safe-Area.
 */
export default function StickyAnfrageButton() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ash bg-white/95 p-3 backdrop-blur md:hidden"
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
    >
      <a
        href="#anfrage"
        className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-brand px-6 font-bold text-white"
      >
        Verlegeservice anfragen
      </a>
    </div>
  )
}
