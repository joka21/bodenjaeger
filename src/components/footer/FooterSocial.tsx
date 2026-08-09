import type { ComponentType, SVGProps } from 'react'
import { Facebook, Instagram, Youtube } from 'lucide-react'
import { FOOTER_SOCIAL, type SocialKey } from '@/lib/footer-nav'
import { FOOTER_FOCUS_RING } from './FooterLinkList'

/**
 * TikTok fehlt in lucide-react — deshalb als Inline-SVG (keine neue Dependency).
 * Bewusst als Outline-Glyphe mit denselben Stroke-Werten wie lucide
 * (24er Viewbox, stroke-width 2, runde Enden), damit die Social-Reihe eine
 * einheitliche Strichstärke hat.
 */
function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  )
}

/**
 * Alle vier Kanäle sind gemappt. Gerendert wird nur, was in FOOTER_SOCIAL
 * steht — TikTok und YouTube aktiviert man dort durch je ein Objekt mit URL,
 * ohne diese Komponente anzufassen.
 */
const SOCIAL_ICONS: Record<SocialKey, ComponentType<SVGProps<SVGSVGElement>>> = {
  facebook: Facebook,
  instagram: Instagram,
  tiktok: TikTokIcon,
  youtube: Youtube,
}

export default function FooterSocial() {
  if (FOOTER_SOCIAL.length === 0) return null

  return (
    <ul className="flex flex-wrap gap-3">
      {FOOTER_SOCIAL.map((profile) => {
        const Icon = SOCIAL_ICONS[profile.key]
        return (
          <li key={profile.key}>
            <a
              href={profile.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={profile.label}
              className={`flex h-11 w-11 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:border-white hover:bg-white/10 ${FOOTER_FOCUS_RING}`}
            >
              <Icon aria-hidden="true" className="h-5 w-5" />
            </a>
          </li>
        )
      })}
    </ul>
  )
}
