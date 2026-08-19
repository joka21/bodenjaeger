import type { ComponentType, SVGProps } from 'react'
import { FOOTER_SOCIAL, type SocialKey } from '@/lib/footer-nav'
import { FOOTER_FOCUS_RING } from './FooterLinkList'
import {
  FacebookBrandIcon,
  InstagramBrandIcon,
  TikTokBrandIcon,
  YouTubeBrandIcon,
} from './SocialBrandIcons'

/**
 * Alle vier Kanäle sind gemappt und aktiv. Gerendert wird nur, was in
 * FOOTER_SOCIAL steht — ein Kanal verschwindet bzw. kommt dort durch ein
 * Objekt mit URL, ohne diese Komponente anzufassen.
 *
 * Alle Glyphen kommen als offizielle Markenzeichen aus SocialBrandIcons
 * (Simple Icons) — kein Lucide-Icon in dieser Reihe, damit sie einheitlich
 * bleibt.
 */
const SOCIAL_ICONS: Record<SocialKey, ComponentType<SVGProps<SVGSVGElement>>> = {
  facebook: FacebookBrandIcon,
  instagram: InstagramBrandIcon,
  tiktok: TikTokBrandIcon,
  youtube: YouTubeBrandIcon,
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
