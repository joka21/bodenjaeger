import Link from 'next/link'
import { ChevronRight, Mail, MapPin, Phone } from 'lucide-react'
import CookieSettingsLink from '@/components/CookieSettingsLink'
import type { FooterIconKey, FooterLink } from '@/lib/footer-nav'

/**
 * Sichtbarer Fokusring für alle interaktiven Footer-Elemente.
 * `ring-offset-dark` passt auf die obere Zone; Zonen mit anderem Untergrund
 * überschreiben nur den Offset (siehe Trustzone/Bottom-Bar).
 * Enthält bewusst KEINEN Radius — den setzt jeder Aufrufer selbst, sonst
 * kollidiert `rounded-sm` mit z. B. `rounded-full` der Social-Icons.
 */
export const FOOTER_FOCUS_RING =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-dark'

const ICONS: Record<FooterIconKey, typeof Phone> = {
  phone: Phone,
  route: MapPin,
  mail: Mail,
}

/**
 * Zeileninhalt eines Footer-Links: optionales weißes Icon, Label, weißer Pfeil.
 * Ohne Icon steht der Pfeil links — das ist die Standardform in den Spalten.
 */
function LinkInner({ link }: { link: FooterLink }) {
  const Icon = link.icon ? ICONS[link.icon] : null

  if (Icon) {
    return (
      <>
        <Icon aria-hidden="true" className="mt-0.5 h-[18px] w-[18px] shrink-0 text-white" />
        <span className="flex-1">{link.label}</span>
        <ChevronRight aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-white" />
      </>
    )
  }

  return (
    <>
      <ChevronRight aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-white" />
      <span>{link.label}</span>
    </>
  )
}

interface FooterLinkListProps {
  links: FooterLink[]
  /** Beschriftet das <nav>-Landmark. Ohne Angabe wird nur die Liste gerendert. */
  ariaLabel?: string
}

/**
 * Linkliste einer Footer-Spalte. Wird von der Desktop-Spalte und vom
 * Mobile-Accordion gemeinsam genutzt, damit es nur eine Darstellung gibt.
 *
 * Zeilenhöhe ≥ 44 px auf Mobile (Touch-Target), kompakter ab lg.
 */
export default function FooterLinkList({ links, ariaLabel }: FooterLinkListProps) {
  // `font-sans! font-normal!`: globals.css setzt für ALLE <button> Poppins-Bold.
  // Diese Regel steht außerhalb jeder Cascade-Layer und schlägt damit normale
  // Tailwind-Utilities — der Cookie-Button sähe sonst fett aus und würde aus
  // der Linkliste herausfallen. Nur `!` gewinnt hier zuverlässig.
  const base = `flex w-full items-start gap-2 rounded-sm py-3 text-left font-sans! text-[15px] font-normal! leading-6 text-ash transition-colors hover:text-white lg:py-1.5 ${FOOTER_FOCUS_RING}`

  const list = (
    <ul>
      {links.map((link) => (
        <li key={`${link.label}-${link.href ?? link.kind}`}>
          {link.kind === 'cookie' ? (
            <CookieSettingsLink className={base}>
              <LinkInner link={link} />
            </CookieSettingsLink>
          ) : link.external ? (
            <a
              href={link.href}
              className={base}
              {...(link.href?.startsWith('http')
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              <LinkInner link={link} />
            </a>
          ) : (
            <Link href={link.href ?? '#'} className={base}>
              <LinkInner link={link} />
            </Link>
          )}
        </li>
      ))}
    </ul>
  )

  if (!ariaLabel) return list

  return <nav aria-label={ariaLabel}>{list}</nav>
}
