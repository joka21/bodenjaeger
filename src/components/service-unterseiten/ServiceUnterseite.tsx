import {
  Users, Layers, HardHat, Wallet, PackageOpen, Sun, Sofa, Clock,
  BadgePercent, CheckCheck, Calculator, Warehouse, CalendarClock, Home,
  CalendarCheck, Wrench, PiggyBank, GraduationCap, Store, Check, Info,
  type LucideIcon,
} from 'lucide-react'
import type { ServiceSubpage, SubBlock } from '@/content/service-unterseiten'
import CtaButton from '@/components/shared/CtaButton'
import Reveal from '@/components/shared/Reveal'
import BildPlatzhalter from '@/components/shared/BildPlatzhalter'

const ICONS: Record<string, LucideIcon> = {
  Users, Layers, HardHat, Wallet, PackageOpen, Sun, Sofa, Clock,
  BadgePercent, CheckCheck, Calculator, Warehouse, CalendarClock, Home,
  CalendarCheck, Wrench, PiggyBank, GraduationCap, Store,
}

function VorteileBlock({ block }: { block: Extract<SubBlock, { kind: 'vorteile' }> }) {
  return (
    <section className="bg-pale py-14 md:py-20">
      <div className="content-container">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {block.items.map((v, i) => {
            const Icon = ICONS[v.icon] ?? Check
            return (
              <Reveal key={v.titel} delay={i * 60}>
                <div className="flex h-full flex-col items-start gap-3 rounded-2xl border border-ash bg-white p-6 shadow-sm">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="font-bold text-dark">{v.titel}</span>
                </div>
              </Reveal>
            )
          })}
        </div>
        {block.hinweis && (
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-mid">{block.hinweis}</p>
        )}
      </div>
    </section>
  )
}

function AblaufBlock({ block }: { block: Extract<SubBlock, { kind: 'ablauf' }> }) {
  return (
    <section className="py-14 md:py-20">
      <div className="content-container">
        <Reveal className="mx-auto max-w-3xl">
          <h2 className="mb-8 font-bold text-dark" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}>
            {block.headline}
          </h2>
          <ol className="grid gap-4 sm:grid-cols-2">
            {block.steps.map((s, i) => (
              <li key={s} className="flex items-start gap-3 rounded-2xl border border-ash bg-white p-5 shadow-sm">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                  {i + 1}
                </span>
                <span className="pt-1 text-dark">{s}</span>
              </li>
            ))}
          </ol>
          {block.hinweis && <p className="mt-6 text-sm text-mid">{block.hinweis}</p>}
        </Reveal>
      </div>
    </section>
  )
}

function KartenBlock({ block }: { block: Extract<SubBlock, { kind: 'karten' }> }) {
  const cols = block.cards.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'
  return (
    <section className="py-14 md:py-20">
      <div className="content-container">
        {(block.headline || block.einleitung) && (
          <Reveal className="mx-auto mb-10 max-w-2xl text-center">
            {block.headline && (
              <h2 className="font-bold text-dark" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}>
                {block.headline}
              </h2>
            )}
            {block.einleitung && <p className="mt-4 text-lg text-mid">{block.einleitung}</p>}
          </Reveal>
        )}
        <div className={`grid gap-6 ${cols}`}>
          {block.cards.map((c, i) => (
            <Reveal key={c.titel} delay={i * 80}>
              <div
                className={`relative flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm md:p-8 ${
                  c.hervorgehoben ? 'border-2 border-brand' : 'border border-ash'
                }`}
              >
                {c.badge && (
                  <span className="absolute -top-3 right-6 inline-flex items-center rounded-full bg-brand px-3 py-1 text-xs font-bold text-white shadow-sm">
                    {c.badge}
                  </span>
                )}
                <h3 className="text-xl font-bold text-dark">{c.titel}</h3>
                {c.text && <p className="mt-3 text-mid">{c.text}</p>}
                {c.punkte && (
                  <>
                    {c.punkteLabel && <p className="mt-4 font-bold text-dark">{c.punkteLabel}</p>}
                    <ul className={`${c.punkteLabel ? 'mt-2' : 'mt-4'} space-y-2`}>
                      {c.punkte.map((p) => (
                        <li key={p} className="flex items-start gap-2 text-mid">
                          <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand" strokeWidth={3} />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </Reveal>
          ))}
        </div>
        {block.kleingedruckt && (
          <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-mid">{block.kleingedruckt}</p>
        )}
      </div>
    </section>
  )
}

function ListeBlock({ block }: { block: Extract<SubBlock, { kind: 'liste' }> }) {
  return (
    <section className="bg-pale py-14 md:py-20">
      <div className="content-container">
        <Reveal className="mx-auto max-w-3xl">
          <h2 className="mb-8 font-bold text-dark" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}>
            {block.headline}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {block.items.map((item) => (
              <li key={item} className="flex items-center gap-3 rounded-xl border border-ash bg-white px-4 py-3 shadow-sm">
                <Wrench className="h-5 w-5 flex-shrink-0 text-brand" />
                <span className="text-dark">{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

function InfoboxBlock({ block }: { block: Extract<SubBlock, { kind: 'infobox' }> }) {
  return (
    <section className="py-14 md:py-20">
      <div className="content-container">
        <Reveal className="mx-auto flex max-w-3xl items-start gap-4 rounded-2xl border border-ash bg-pale p-6 shadow-sm md:p-8">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <Info className="h-6 w-6" />
          </span>
          <div>
            <p className="font-bold text-dark">Wichtiger Hinweis</p>
            <p className="mt-1 text-mid">{block.text}</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function renderBlock(block: SubBlock, i: number) {
  switch (block.kind) {
    case 'vorteile': return <VorteileBlock key={i} block={block} />
    case 'ablauf': return <AblaufBlock key={i} block={block} />
    case 'karten': return <KartenBlock key={i} block={block} />
    case 'liste': return <ListeBlock key={i} block={block} />
    case 'infobox': return <InfoboxBlock key={i} block={block} />
  }
}

/** Assembler: Hero → Einleitung → Blocks (Briefing-Reihenfolge) → Abschluss-CTA. */
export default function ServiceUnterseite({ data }: { data: ServiceSubpage }) {
  const { hero, einleitung, blocks, abschluss } = data

  return (
    <>
      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="content-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h1 className="font-bold leading-[1.1] text-dark" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)' }}>
              {hero.headline}
            </h1>
            <p className="mt-5 text-lg text-mid">{hero.untertitel}</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              {hero.ctas.map((cta) => (
                <CtaButton key={cta.label} cta={cta} size="lg" />
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <BildPlatzhalter ratio="4 / 3" label="Platzhalter — Bild folgt" hinweis={hero.imageAlt} />
          </Reveal>
        </div>
      </section>

      {/* Einleitung */}
      <section className="pb-4">
        <div className="content-container mx-auto max-w-3xl text-center">
          <Reveal>
            <h2 className="font-bold text-dark" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}>
              {einleitung.headline}
            </h2>
            <p className="mt-4 text-lg text-mid">{einleitung.text}</p>
          </Reveal>
        </div>
      </section>

      {blocks.map((b, i) => renderBlock(b, i))}

      {/* Abschluss-CTA (dunkel) */}
      <section className="bg-dark py-20 text-white md:py-28">
        <Reveal className="content-container text-center">
          <h2 className="mx-auto max-w-3xl font-bold" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>
            {abschluss.headline}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">{abschluss.text}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {abschluss.ctas.map((cta) => (
              <CtaButton key={cta.label} cta={cta} size="lg" />
            ))}
          </div>
        </Reveal>
      </section>
    </>
  )
}
