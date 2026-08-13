import Image from 'next/image'
import type { FooterBadge } from '@/lib/footer-nav'

interface BadgeGridProps {
  badges: FooterBadge[]
  /**
   * Grid-Spalten. Bewusst feste Spaltenzahlen statt freiem Flex-Wrap, damit
   * keine Zeile mit einem einzelnen Badge endet.
   */
  columnsClassName: string
}

/**
 * Ein Grid für Zahlungs- UND Versand-Badges.
 *
 * Jede Hülle hat dieselbe Höhe (h-9), denselben Radius und dasselbe Padding.
 * Logos werden auf feste Höhe skaliert (`h-[22px] w-auto`) — nie gedehnt,
 * Breite variabel. Ein Badge ohne `src` rendert als Textbadge in exakt
 * derselben Hülle; ein später ergänztes SVG stellt es ohne Codeänderung um.
 *
 * Kachel- und Logohöhe sind bewusst zurückhaltend (vorher 48px/32px), damit
 * die Block-Überschrift darüber die Zone anführt und nicht von einer Wand
 * weißer Kacheln überstrahlt wird.
 */
export default function BadgeGrid({ badges, columnsClassName }: BadgeGridProps) {
  const visible = badges.filter((badge) => badge.enabled)

  return (
    <ul className={`grid gap-1.5 ${columnsClassName}`}>
      {visible.map((badge) => (
        <li key={badge.label}>
          <div
            className={`flex h-9 items-center justify-center rounded-md bg-white px-1.5 ${
              badge.mark ? 'gap-1' : 'gap-1'
            }`}
          >
            {badge.src ? (
              <Image
                src={badge.src}
                alt={badge.label}
                width={64}
                height={32}
                className="h-[22px] w-auto object-contain"
              />
            ) : (
              <>
                {badge.mark === 'bodenjaeger' && (
                  <span
                    aria-hidden="true"
                    className="flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-brand text-[8px] font-bold leading-none text-white"
                  >
                    J
                  </span>
                )}
                {/* „Bodenjäger" ist deutlich länger als „DHL"/„Raben" und trägt
                    zusätzlich die Marke. Kreis und Schrift sind daher eine Stufe
                    kleiner, damit die drei Kacheln nebeneinander gleich schwer
                    wirken — die Kachelmaße selbst bleiben identisch. */}
                <span
                  className={`text-center font-bold leading-tight text-dark ${
                    badge.mark === 'bodenjaeger' ? 'text-[9px]' : 'text-[11px]'
                  }`}
                >
                  {badge.label}
                </span>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
