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
 * Jede Hülle hat dieselbe Höhe (h-9), denselben Radius (10px) und dasselbe
 * Padding. Der Untergrund ist transparent, abgegrenzt wird nur über eine 1px
 * weiße Border. Die Zahlungs-SVGs sind Monochrom-Varianten ohne eigene
 * Kartenfläche, ihre viewBox ist auf die Marke zugeschnitten — deshalb
 * `h-6 w-full object-contain`: jede Marke wird in dieselbe Box eingepasst,
 * nie gedehnt, breite Wortmarken werden entsprechend flacher. Ein Badge ohne
 * `src` rendert als Textbadge in exakt derselben Hülle; ein später ergänztes
 * SVG stellt es ohne Codeänderung um.
 *
 * `unoptimized` ist Pflicht: Der Next-Image-Optimizer lehnt SVG mit 400 ab,
 * solange `images.dangerouslyAllowSVG` nicht gesetzt ist — ohne das Flag
 * blieben alle Zahlungslogos leer. Die Dateien liegen lokal in /public,
 * Optimierung bringt bei ~1-4 KB SVG ohnehin nichts.
 */
export default function BadgeGrid({ badges, columnsClassName }: BadgeGridProps) {
  const visible = badges.filter((badge) => badge.enabled)

  return (
    <ul className={`grid gap-1.5 ${columnsClassName}`}>
      {visible.map((badge) => (
        <li key={badge.label}>
          <div className="flex h-9 items-center justify-center gap-1 rounded-[10px] border border-white px-1.5">
            {badge.src ? (
              <Image
                src={badge.src}
                alt={badge.label}
                width={64}
                height={32}
                unoptimized
                className="h-6 w-full object-contain"
              />
            ) : (
              <>
                {badge.mark === 'bodenjaeger' && (
                  <span
                    aria-hidden="true"
                    className="flex h-[13px] w-[13px] shrink-0 items-center justify-center rounded-full bg-brand text-[9px] font-bold leading-none text-white"
                  >
                    J
                  </span>
                )}
                {/* „Bodenjäger" ist deutlich länger als „DHL"/„Raben" und trägt
                    zusätzlich die Marke. Kreis und Schrift sind daher eine Stufe
                    kleiner, damit die drei Kacheln nebeneinander gleich schwer
                    wirken — die Kachelmaße selbst bleiben identisch.
                    Schriftfarbe weiß, weil die Kachel keinen weißen Grund mehr
                    hat — `text-dark` wäre auf `bg-dark` unlesbar. */}
                <span
                  className={`text-center font-bold leading-tight text-white ${
                    badge.mark === 'bodenjaeger' ? 'text-[10px]' : 'text-[12px]'
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
