import type { Metadata } from 'next'
import { JsonLd } from '@/components/JsonLd'
import { buildBreadcrumbSchema } from '@/lib/schema'
import { SITE_URL } from '@/lib/site'
import { VERLEGE_ANFRAGE, VERLEGE_ANFRAGE_META } from '@/content/verlegeservice'
import AnfrageFunnel from '@/components/verlegeservice/anfrage/AnfrageFunnel'

const PAGE_URL = `${SITE_URL}/fachmarkt-hueckelhoven/service/verlegeservice-anfrage`

export const metadata: Metadata = {
  title: VERLEGE_ANFRAGE_META.title,
  description: VERLEGE_ANFRAGE_META.description,
  alternates: { canonical: PAGE_URL },
  // Anfrage-Funnel gehört nicht in den Index — die Info-Seite ist die SEO-Seite.
  robots: { index: false, follow: true },
  openGraph: {
    title: VERLEGE_ANFRAGE_META.title,
    description: VERLEGE_ANFRAGE_META.description,
    url: PAGE_URL,
    type: 'website',
  },
}

export default function VerlegeserviceAnfragePage() {
  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Startseite', url: SITE_URL },
    { name: 'Fachmarkt Hückelhoven', url: `${SITE_URL}/fachmarkt-hueckelhoven` },
    { name: 'Verlegeservice', url: `${SITE_URL}/fachmarkt-hueckelhoven/service/verlegeservice` },
    { name: 'Anfrage', url: PAGE_URL },
  ])

  return (
    <main className="pb-16">
      <JsonLd data={breadcrumb} />

      {/* Kurzer Intro-Kopf */}
      <section className="pt-16 md:pt-20">
        <div className="content-container mx-auto max-w-3xl text-center">
          <h1 className="font-bold leading-[1.1] text-dark" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)' }}>
            {VERLEGE_ANFRAGE.hero.headline}
          </h1>
          <p className="mt-4 text-lg text-mid">{VERLEGE_ANFRAGE.hero.subline}</p>
        </div>
      </section>

      <AnfrageFunnel />
    </main>
  )
}
