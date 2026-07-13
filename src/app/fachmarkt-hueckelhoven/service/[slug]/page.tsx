import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/JsonLd'
import { buildBreadcrumbSchema } from '@/lib/schema'
import { SITE_URL } from '@/lib/site'
import { SERVICE_UNTERSEITEN, SERVICE_UNTERSEITEN_SLUGS } from '@/content/service-unterseiten'
import ServiceUnterseite from '@/components/service-unterseiten/ServiceUnterseite'
import ServiceStickyBar from '@/components/shared/ServiceStickyBar'

/**
 * Statische Fachmarkt-Service-Unterseiten (eigene Kundeninhalte, KEIN WordPress).
 * Eine Route, datengetrieben aus content/service-unterseiten.ts.
 * `verlegeservice` ist eine eigene statische Route (nicht hier) und `service`
 * ist die Übersicht — beide gewinnen als statische Segmente gegen diese [slug].
 */

// Kurzlabels für Breadcrumb
const LABELS: Record<string, string> = {
  fachberatung: 'Fachberatung',
  musterservice: 'Musterservice',
  'set-angebote': 'Set-Angebote',
  'lieferung-abholung': 'Lieferung & Abholung',
  einlagerung: 'Einlagerung',
  werkzeugverleih: 'Werkzeugverleih',
}

export function generateStaticParams() {
  return SERVICE_UNTERSEITEN_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const data = SERVICE_UNTERSEITEN[slug]
  if (!data) return { title: 'Seite nicht gefunden | Bodenjäger' }
  const url = `${SITE_URL}/fachmarkt-hueckelhoven/service/${slug}`
  return {
    title: data.meta.title,
    description: data.meta.description,
    alternates: { canonical: url },
    openGraph: { title: data.meta.title, description: data.meta.description, url, type: 'website' },
  }
}

export default async function ServiceUnterseitePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const data = SERVICE_UNTERSEITEN[slug]
  if (!data) notFound()

  const url = `${SITE_URL}/fachmarkt-hueckelhoven/service/${slug}`
  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Startseite', url: SITE_URL },
    { name: 'Fachmarkt Hückelhoven', url: `${SITE_URL}/fachmarkt-hueckelhoven` },
    { name: 'Service', url: `${SITE_URL}/fachmarkt-hueckelhoven/service` },
    { name: LABELS[slug] ?? 'Service', url },
  ])

  return (
    <main className="pb-16 md:pb-0">
      <JsonLd data={breadcrumb} />
      <ServiceUnterseite data={data} />
      <ServiceStickyBar />
    </main>
  )
}
