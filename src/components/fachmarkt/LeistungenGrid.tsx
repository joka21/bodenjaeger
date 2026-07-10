import Link from 'next/link'
import {
  Hammer,
  Truck,
  Caravan,
  Warehouse,
  Users,
  Package,
  Wrench,
  CalendarDays,
  type LucideIcon,
} from 'lucide-react'
import { LEISTUNGEN } from '@/content/fachmarkt'
import Reveal from './Reveal'

const ICONS: Record<string, LucideIcon> = {
  Hammer,
  Truck,
  Caravan,
  Warehouse,
  Users,
  Package,
  Wrench,
  CalendarDays,
}

/** Sektion 9: 8 Icon-Karten. */
export default function LeistungenGrid() {
  const { kicker, headline, items } = LEISTUNGEN

  return (
    <section className="bg-pale py-16 md:py-24">
      <div className="content-container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-brand">{kicker}</p>
          <h2 className="font-bold text-dark" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            {headline}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = ICONS[item.icon] ?? Package
            return (
              <Reveal key={item.titel} delay={i * 60}>
                <Link
                  href={item.href}
                  className="group flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ash transition-shadow hover:shadow-lg"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy/10 text-navy transition-colors group-hover:bg-brand group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-bold text-dark">{item.titel}</h3>
                  <p className="mt-2 text-sm text-mid">{item.text}</p>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
