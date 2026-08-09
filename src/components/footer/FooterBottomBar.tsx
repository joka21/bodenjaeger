import Link from 'next/link'
import CookieSettingsLink from '@/components/CookieSettingsLink'
import { FOOTER_FOCUS_RING } from './FooterLinkList'
import {
  FOOTER_BOTTOM_LINKS,
  FOOTER_COPYRIGHT,
  FOOTER_PREISHINWEIS,
} from '@/lib/footer-nav'

// `font-sans! font-normal!` — siehe Kommentar in FooterLinkList: die globale
// <button>-Regel liegt außerhalb der Cascade-Layer und macht den
// Cookie-Button sonst fett, anders als die Links daneben.
const LINK = `inline-flex min-h-11 items-center rounded-sm font-sans! font-normal! text-ash transition-colors hover:text-white lg:min-h-0 ${FOOTER_FOCUS_RING}`

export default function FooterBottomBar() {
  return (
    <div className="w-full bg-dark">
      <div className="content-container">
        <div className="flex flex-col gap-x-8 gap-y-2 border-t border-white/10 py-4 text-xs lg:flex-row lg:items-center lg:justify-between">
          <p className="text-ash">{FOOTER_COPYRIGHT}</p>

          <nav aria-label="Rechtliche Hinweise">
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-0">
              {FOOTER_BOTTOM_LINKS.map((link) => (
                <li key={link.label}>
                  {link.kind === 'cookie' ? (
                    <CookieSettingsLink className={LINK}>{link.label}</CookieSettingsLink>
                  ) : (
                    <Link href={link.href ?? '#'} className={LINK}>
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <p className="text-ash">{FOOTER_PREISHINWEIS}</p>
        </div>
      </div>
    </div>
  )
}
