import Link from 'next/link'
import { Undo2 } from 'lucide-react'
import FooterLinkList, { FOOTER_FOCUS_RING } from './FooterLinkList'
import { WIDERRUF_BUTTON, type FooterColumn as FooterColumnData } from '@/lib/footer-nav'

/**
 * Ruhiger Outline-Button unter der Kundenservice-Spalte.
 * Bewusst kein CTA-Look: kein Rot, keine Fläche — nur weiße Outline.
 */
function WiderrufButton() {
  return (
    <Link
      href={WIDERRUF_BUTTON.href}
      className={`mt-4 inline-flex min-h-11 items-center gap-2 rounded-md border border-white/50 px-4 py-2.5 text-sm text-white transition-colors hover:border-white hover:bg-white/10 ${FOOTER_FOCUS_RING}`}
    >
      <Undo2 aria-hidden="true" className="h-4 w-4 shrink-0 text-white" />
      {WIDERRUF_BUTTON.label}
    </Link>
  )
}

/**
 * Inhalt einer Spalte ohne Überschrift.
 * Geteilt von der Desktop-Spalte und dem Mobile-Accordion-Panel, damit beide
 * garantiert dieselben Einträge zeigen.
 */
export function FooterColumnBody({ column }: { column: FooterColumnData }) {
  return (
    <>
      <FooterLinkList links={column.links} ariaLabel={column.ariaLabel} />
      {column.id === 'kundenservice' && <WiderrufButton />}
    </>
  )
}

/** Desktop-Spalte: Überschrift + Inhalt. */
export default function FooterColumn({ column }: { column: FooterColumnData }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.08em] text-white">
        {column.title}
      </h3>
      <FooterColumnBody column={column} />
    </div>
  )
}
