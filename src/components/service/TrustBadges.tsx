import { Award, Layers, MapPin, type LucideIcon } from 'lucide-react'
import { SERVICE_TRUST_BADGES } from '@/content/service'
import Reveal from '@/components/shared/Reveal'

const ICONS: Record<string, LucideIcon> = { Award, Layers, MapPin }

/** 3 Trust-Badges direkt unter dem Hero. */
export default function TrustBadges() {
  return (
    <section className="pb-8">
      <div className="content-container">
        <Reveal className="grid gap-4 rounded-2xl border border-ash bg-pale p-6 shadow-sm sm:grid-cols-3 md:p-8">
          {SERVICE_TRUST_BADGES.map((b) => {
            const Icon = ICONS[b.icon] ?? Award
            return (
              <div key={b.text} className="flex items-center gap-3 text-center sm:text-left">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-medium text-dark">{b.text}</span>
              </div>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
