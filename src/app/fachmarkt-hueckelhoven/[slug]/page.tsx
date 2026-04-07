import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getWordPressPage } from '@/lib/wordpress'
import FachmarktSubpage from '@/components/FachmarktSubpage'

export const revalidate = 30

/**
 * Mapping: Next.js route slug → WordPress page slug
 * Next.js URLs bleiben kurz und SEO-freundlich,
 * WordPress-Slugs werden intern aufgelöst.
 */
const SLUG_MAP: Record<string, { wpSlug: string; label: string }> = {
  'anhaengerverleih': { wpSlug: 'kostenloser-anhaengerverleih', label: 'Anhängerverleih' },
  'fachberatung': { wpSlug: 'persoenliche-fachberatung', label: 'Fachberatung' },
  'lieferservice': { wpSlug: 'lieferung-zum-wunschtermin', label: 'Lieferservice' },
  'schausonntag': { wpSlug: 'schausonntag', label: 'Schausonntag' },
  'set-angebote': { wpSlug: 'sockelleiste-und-daemmung-kostenlos', label: 'Set-Angebote' },
  'verlegeservice': { wpSlug: 'professioneller-verlegeservice-2', label: 'Verlegeservice' },
  'warenlagerung': { wpSlug: 'lagerservice', label: 'Warenlagerung' },
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

export default async function FachmarktSubpagePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const entry = SLUG_MAP[slug]

  if (!entry) notFound()

  const page = await getWordPressPage(entry.wpSlug)

  if (!page) notFound()

  return <FachmarktSubpage page={page} />
}
