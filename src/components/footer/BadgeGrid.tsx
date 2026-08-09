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
 * Jede Hülle hat dieselbe Höhe (h-12), denselben Radius und dasselbe Padding.
 * Logos werden auf feste Höhe skaliert (`h-8 w-auto`) — nie gedehnt, Breite
 * variabel. Ein Badge ohne `src` rendert als Textbadge in exakt derselben
 * Hülle; ein später ergänztes SVG stellt es ohne Codeänderung um.
 */
export default function BadgeGrid({ badges, columnsClassName }: BadgeGridProps) {
  const visible = badges.filter((badge) => badge.enabled)

  return (
    <ul className={`grid gap-2 ${columnsClassName}`}>
      {visible.map((badge) => (
        <li key={badge.label}>
          <div
            className={`flex h-12 items-center justify-center rounded-md bg-white px-2 ${
              badge.mark ? 'gap-1' : 'gap-1.5'
            }`}
          >
            {badge.src ? (
              <Image
                src={badge.src}
                alt={badge.label}
                width={72}
                height={48}
                className="h-8 w-auto object-contain"
              />
            ) : (
              <>
                {badge.mark === 'bodenjaeger' && (
                  <span
                    aria-hidden="true"
                    className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-brand text-[9px] font-bold leading-none text-white"
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
                    badge.mark === 'bodenjaeger' ? 'text-[10px]' : 'text-xs'
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
