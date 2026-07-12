import Link from 'next/link'
import {
  Users,
  PackageCheck,
  Store,
  Layers,
  Truck,
  Warehouse,
  Wrench,
  Hammer,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react'
import { SERVICE_GRID } from '@/content/service'
import Reveal from '@/components/shared/Reveal'

const ICONS: Record<string, LucideIcon> = {
  Users,
  PackageCheck,
  Store,
  Layers,
  Truck,
  Warehouse,
  Wrench,
  Hammer,
}

/** "Unsere wichtigsten Services" — 8 Karten (Desktop 4x2, mobil 2er-Grid). */
export default function ServiceGrid() {
  const { headline, premiumLabel, karten } = SERVICE_GRID

  return (
    <section id="services" className="scroll-mt-24 bg-pale py-24 md:py-32">
      <div className="content-container">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="font-bold text-dark" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            {headline}
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {karten.map((k, i) => {
            const Icon = ICONS[k.icon] ?? Users
            const premium = 'premium' in k && k.premium
            return (
              <Reveal key={k.titel} delay={i * 60}>
                <Link
                  href={k.href}
                  className={`group relative flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md ${
                    premium ? 'border-2 border-brand' : 'border border-ash'
                  }`}
                >
                  {premium && (
                    <span className="absolute -top-3 left-6 rounded-full bg-brand px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                      {premiumLabel}
                    </span>
                  )}
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300 ${
                      premium
                        ? 'bg-brand text-white'
                        : 'bg-brand/10 text-brand group-hover:bg-brand group-hover:text-white'
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-bold text-dark group-hover:text-brand">{k.titel}</h3>
                  <p className="mt-2 flex-1 text-sm text-mid">{k.text}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand">
                    Mehr erfahren
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
