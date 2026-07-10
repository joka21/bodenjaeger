import type { Metadata } from 'next'
import { wordPressClient } from '@/lib/wordpress'
import { JsonLd } from '@/components/JsonLd'
import { buildFlooringStoreSchema, buildBreadcrumbSchema } from '@/lib/schema'
import { SITE_URL } from '@/lib/site'
import {
  STANDORT,
  OEFFNUNGSZEITEN,
  FILIAL_BANNER_MOCK,
  activeBanners,
} from '@/content/fachmarkt'

import FachmarktHero from '@/components/fachmarkt/FachmarktHero'
import TrustStats from '@/components/fachmarkt/TrustStats'
import AusstellungErleben from '@/components/fachmarkt/AusstellungErleben'
import WarumBodenjaeger from '@/components/fachmarkt/WarumBodenjaeger'
import RedaktionsText from '@/components/fachmarkt/RedaktionsText'
import BesuchsAblauf from '@/components/fachmarkt/BesuchsAblauf'
import FilialAngebote from '@/components/fachmarkt/FilialAngebote'
import BodenKategorien from '@/components/fachmarkt/BodenKategorien'
import BaumarktVergleich from '@/components/fachmarkt/BaumarktVergleich'
import LeistungenGrid from '@/components/fachmarkt/LeistungenGrid'
import GoogleReviews from '@/components/fachmarkt/GoogleReviews'
import TeamSection from '@/components/fachmarkt/TeamSection'
import StandortSection from '@/components/fachmarkt/StandortSection'
import AbschlussCta from '@/components/fachmarkt/AbschlussCta'
import StickyBottomBar from '@/components/fachmarkt/StickyBottomBar'

export const revalidate = 300

const PAGE_URL = `${SITE_URL}/fachmarkt-hueckelhoven`

export const metadata: Metadata = {
  title: 'Bodenfachmarkt Hückelhoven – Bodenbeläge, Beratung & Verlegung',
  description:
    'Bodenbeläge in Hückelhoven: Laminat, Vinyl und Parkett persönlich beraten, große Ausstellung, faire Festpreise und Rundum-Sorglos-Service. Über 40 Jahre Erfahrung.',
  keywords:
    'Bodenfachmarkt Hückelhoven, Bodenbeläge Hückelhoven, Laminat Hückelhoven, Vinyl Hückelhoven, Parkett Hückelhoven, Bodenleger Hückelhoven',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Bodenfachmarkt Hückelhoven – Bodenjäger',
    description:
      'Große Ausstellung, persönliche Fachberatung und faire Preise für Laminat, Vinyl und Parkett in Hückelhoven.',
    url: PAGE_URL,
    type: 'website',
  },
}

export default async function FachmarktHueckelhovenPage() {
  // Variante A: redaktioneller Fließtext aus WordPress (optional — die
  // strukturierte Landingpage funktioniert auch ohne den WP-Block).
  const page = await wordPressClient.getPageBySlug('filiale-hueckelhoven')
  const redaktionsHtml = page?.content?.rendered ?? ''

  const banners = activeBanners(FILIAL_BANNER_MOCK)

  const localBusiness = buildFlooringStoreSchema({
    name: STANDORT.name,
    street: STANDORT.strasse,
    postalCode: STANDORT.plz,
    city: STANDORT.ort,
    country: STANDORT.land,
    telephone: STANDORT.telefonLink.replace('tel:', ''),
    email: STANDORT.email,
    url: PAGE_URL,
    geo: STANDORT.geo,
    // Sonntag bewusst ausgelassen ("nicht jeden Sonntag").
    openingHours: [
      { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '18:30' },
      { days: ['Saturday'], opens: '09:00', closes: '14:00' },
    ],
  })

  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Startseite', url: SITE_URL },
    { name: 'Fachmarkt Hückelhoven', url: PAGE_URL },
  ])

  // Öffnungszeiten sind in OEFFNUNGSZEITEN gepflegt (Anzeige in StandortSection).
  void OEFFNUNGSZEITEN

  return (
    <main className="pb-16 md:pb-0">
      <JsonLd data={localBusiness} />
      <JsonLd data={breadcrumb} />

      <FachmarktHero />
      <TrustStats />
      <AusstellungErleben />
      <WarumBodenjaeger />
      <RedaktionsText html={redaktionsHtml} />
      <BesuchsAblauf />
      <FilialAngebote banners={banners} />
      <BodenKategorien />
      <BaumarktVergleich />
      <LeistungenGrid />
      <GoogleReviews />
      <TeamSection />
      <StandortSection />
      <AbschlussCta />

      <StickyBottomBar />
    </main>
  )
}
