import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getWordPressPage } from '@/lib/wordpress'
import FachmarktSubpage from '@/components/FachmarktSubpage'

export const revalidate = 30

/**
 * Service-Unterseiten unter dem Fachmarkt (umgezogen aus der früheren
 * /fachmarkt-hueckelhoven/[slug]-Route). Rendering wie bisher aus WordPress.
 *
 * Mapping: Next.js route slug → WordPress page slug. Zwei Slugs wurden beim
 * Umzug umbenannt (lieferservice → lieferung-abholung, warenlagerung →
 * einlagerung); der WordPress-Slug bleibt jeweils unverändert.
 * `verlegeservice` ist eine eigene statische Route und NICHT hier enthalten.
 */
const SLUG_MAP: Record<string, { wpSlug: string; label: string }> = {
  'fachberatung': { wpSlug: 'persoenliche-fachberatung', label: 'Fachberatung' },
  'set-angebote': { wpSlug: 'sockelleiste-und-daemmung-kostenlos', label: 'Set-Angebote' },
  'lieferung-abholung': { wpSlug: 'lieferung-zum-wunschtermin', label: 'Lieferung & Abholung' },
  'einlagerung': { wpSlug: 'lagerservice', label: 'Einlagerung' },
  'werkzeugverleih': { wpSlug: 'werkzeugverleih', label: 'Werkzeugverleih' },
}

export async function generateStaticParams() {
  return Object.keys(SLUG_MAP).map((slug) => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const entry = SLUG_MAP[slug]
  if (!entry) {
    return { title: 'Seite nicht gefunden | Bodenjäger' }
  }

  const page = await getWordPressPage(entry.wpSlug)
  const title = page
    ? `${page.title.rendered.replace(/&#038;/g, '&').replace(/&#8211;/g, '–')} | Fachmarkt Hückelhoven | Bodenjäger`
    : `${entry.label} | Fachmarkt Hückelhoven | Bodenjäger`

  return {
    title,
    description: `${entry.label} – Service im Fachmarkt Hückelhoven bei Bodenjäger`,
  }
}

export default async function ServiceSubpagePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const entry = SLUG_MAP[slug]

  if (!entry) notFound()

  const page = await getWordPressPage(entry.wpSlug)

  if (!page) notFound()

  return <FachmarktSubpage page={page} />
}
