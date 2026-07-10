/**
 * Zentrale Inhalte der Fachmarkt-Landingpage Hückelhoven.
 *
 * Variante A (pragmatisch): Redaktionelle Fließtexte kommen aus der
 * WordPress-Seite `filiale-hueckelhoven`; die strukturierten Werte
 * (Kennzahlen, Timeline-Schritte, Vergleichspunkte …) leben hier im Code
 * und sind an einer Stelle pflegbar. Kein Text hart in JSX.
 *
 * Werte, die vom Kunden final bestätigt/geliefert werden müssen, sind mit
 * `TODO(kunde)` markiert.
 */
import type { FilialBanner } from '@/types/fachmarkt'

/** 🔴 rot = primär · navy = sekundär · ⚫ outline = tertiär (kein Gelb — Projekt-CI) */
export type CtaVariant = 'primary' | 'secondary' | 'outline'

export interface Cta {
  label: string
  href: string
  variant: CtaVariant
  /** true → nativer Link (tel:, maps), kein next/link */
  external?: boolean
}

// ── Stammdaten (NAP) ────────────────────────────────────────────────────────
export const STANDORT = {
  name: 'Bodenjäger Fachmarkt Hückelhoven',
  strasse: 'Neckarstraße 9',
  plz: '41836',
  ort: 'Hückelhoven',
  land: 'DE',
  telefonAnzeige: '02433 938884',
  telefonLink: 'tel:+492433938884',
  email: 'info@bodenjaeger.de',
  geo: { lat: 51.0526, lng: 6.2231 }, // TODO(kunde): exakte Koordinaten verifizieren
} as const

export const OEFFNUNGSZEITEN = [
  { tag: 'Mo. – Fr.', zeit: '9:00 – 18:30 Uhr' },
  { tag: 'Samstag', zeit: '9:00 – 14:00 Uhr' },
  { tag: 'Sonntag', zeit: '12:00 – 16:00 Uhr', hinweis: 'nicht jeden Sonntag' },
] as const

/** Google-Maps-Route-Deeplink auf die Zieladresse */
export const MAPS_ROUTE_URL =
  'https://www.google.com/maps/dir/?api=1&destination=' +
  encodeURIComponent('Bodenjäger Neckarstraße 9, 41836 Hückelhoven')

/** Eingebettete Karte (Standort-Sektion) */
export const MAPS_EMBED_URL =
  'https://maps.google.com/maps?q=' +
  encodeURIComponent('Bodenjäger Neckarstraße 9, 41836 Hückelhoven') +
  '&t=m&z=15&output=embed&iwloc=near'

// Wiederkehrende CTAs
const CTA_ROUTE: Cta = { label: 'Route planen', href: MAPS_ROUTE_URL, variant: 'primary', external: true }
const CTA_ANRUFEN: Cta = { label: 'Jetzt anrufen', href: STANDORT.telefonLink, variant: 'secondary', external: true }
const CTA_BERATUNG: Cta = { label: 'Beratung vereinbaren', href: '/kontakt', variant: 'outline' }

// ── Sektion 1: Hero ───────────────────────────────────────────────────────────
export const HERO = {
  kicker: 'Bodenfachmarkt Hückelhoven',
  headline: 'Ihr Bodenbelag. Persönlich beraten. Fair kalkuliert.',
  subline:
    'Über 40 Jahre Erfahrung, große Ausstellung und ein Rundum-Sorglos-Service – erleben Sie Laminat, Vinyl und Parkett vor Ort in Hückelhoven.',
  image: '/images/fachmarkt-hueckelhoven/hero-DSCF2859.jpg',
  imageAlt: 'Ausstellung des Bodenjäger Fachmarkts in Hückelhoven',
  ctas: [CTA_ROUTE, CTA_ANRUFEN, CTA_BERATUNG] as Cta[],
  checks: [
    'Persönliche Fachberatung',
    'Hoher Lagerbestand',
    'Faire Festpreise',
    'Rundum-Sorglos-Service',
  ],
}

// ── Sektion 2: Trust-Kennzahlen (Count-up) ─────────────────────────────────────
// TODO(kunde): Zahlen final bestätigen.
export const TRUST_STATS = [
  { value: 40, suffix: '+', label: 'Jahre Erfahrung' },
  { value: 10000, suffix: '+', label: 'Zufriedene Kunden' },
  { value: 1500, suffix: 'm²', label: 'Ausstellungsfläche' },
  { value: 500, suffix: '+', label: 'Böden auf Lager' },
  { value: 4.8, suffix: '★', label: 'Google-Bewertung', decimals: 1 },
  { value: 100, suffix: '%', label: 'Aus eigener Verlegepraxis' },
] as const

// ── Sektion 3: Ausstellung erleben ─────────────────────────────────────────────
export const AUSSTELLUNG = {
  kicker: 'Ausstellung',
  headline: 'Sehen, fühlen, entscheiden – in unserer Ausstellung',
  text: 'Böden wirken erst im Raum. Bei uns laufen Sie über echte Verlegemuster, vergleichen Dekore im Tageslicht und finden mit unserer Beratung den Belag, der zu Ihrem Projekt passt.',
  image: 'https://2025.bodenjaeger.de/wp-content/uploads/2024/08/DSCF2023-scaled-1-1024x683.jpg',
  imageAlt: 'Blick in die Ausstellung mit verlegten Bodenmustern',
  // TODO(360): Quelle des 360°-Rundgangs noch offen.
  cta: { label: '360° Rundgang starten', href: '#', variant: 'primary', external: true } as Cta,
}

// ── Sektion 4: Warum Bodenjäger ─────────────────────────────────────────────────
export const WARUM = {
  kicker: 'Warum Bodenjäger',
  headline: 'Kein Baumarkt. Ein Fachmarkt mit Handwerks-Wurzeln.',
  image: 'https://2025.bodenjaeger.de/wp-content/uploads/2024/08/DSCF1968-scaled-1-1024x683.jpg',
  imageAlt: 'Persönliche Beratung im Bodenjäger Fachmarkt',
  vorteile: [
    { titel: 'Persönliche Fachberatung', text: 'Wir hören zu, statt Regale zu befüllen – Beratung von Leuten, die selbst verlegen.' },
    { titel: 'Hoher Lagerbestand', text: 'Viele Böden sofort verfügbar – kein wochenlanges Warten.' },
    { titel: 'Faire Festpreise', text: 'Transparente Preise inklusive passender Sockelleisten und Dämmung.' },
    { titel: 'Rundum-Sorglos-Service', text: 'Von der Auswahl über Lieferung bis zur professionellen Verlegung.' },
    { titel: 'Über 40 Jahre Erfahrung', text: 'Vier Jahrzehnte Kompetenz rund um Bodenbeläge.' },
    { titel: 'Nur geprüfte Qualität', text: 'Wir führen ausschließlich Produkte, die wir selbst verwenden würden.' },
  ],
}

// ── Sektion 5: Besuchs-Ablauf (Timeline) ───────────────────────────────────────
export const BESUCHS_ABLAUF = {
  kicker: 'So läuft Ihr Besuch',
  headline: 'In fünf entspannten Schritten zum neuen Boden',
  schritte: [
    { nr: 1, titel: 'Ankommen', text: 'Kostenlos parken direkt vor der Tür.' },
    { nr: 2, titel: 'Ausstellung erleben', text: 'Dekore und Verlegemuster in Ruhe vergleichen.' },
    { nr: 3, titel: 'Beratung', text: 'Wir kalkulieren Ihren Bedarf – ehrlich und genau.' },
    { nr: 4, titel: 'Angebot', text: 'Festpreis inklusive Zubehör, ohne Überraschungen.' },
    { nr: 5, titel: 'Lieferung & Verlegung', text: 'Auf Wunsch liefern und verlegen wir alles für Sie.' },
  ],
}

// ── Sektion 6: Filialangebote (CMS/Mock) ────────────────────────────────────────
// Phase 1: Mock-Daten mit identischem Typ. Phase 2: WordPress-CPT `filial_banner`.
export const FILIAL_BANNER_MOCK: FilialBanner[] = [
  {
    id: 1,
    titel: 'Aktuelle Filialangebote',
    untertitel: 'Ausgewählte Böden zum Sonderpreis – nur in der Filiale',
    bild: 'https://2025.bodenjaeger.de/wp-content/uploads/2024/08/DSCF2046-scaled-1-1024x683.jpg',
    bildAlt: 'Sonderangebote im Fachmarkt',
    ctaLabel: 'Angebote ansehen',
    ctaUrl: '/sale',
    aktiv: true,
    reihenfolge: 1,
    gueltigBis: null,
  },
  {
    id: 2,
    titel: 'Set-Angebote entdecken',
    untertitel: 'Boden + Dämmung + Sockelleiste – als geprüftes Komplettpaket',
    bild: 'https://2025.bodenjaeger.de/wp-content/uploads/2024/08/IMG_1392-scaled-e1724846184644-853x1024.jpg',
    bildAlt: 'Set-Angebote im Fachmarkt',
    ctaLabel: 'Zu den Set-Angeboten',
    ctaUrl: '/fachmarkt-hueckelhoven/set-angebote',
    aktiv: true,
    reihenfolge: 2,
    gueltigBis: null,
  },
]

/** Filtert Mock/CMS-Banner auf aktiv + nicht abgelaufen und sortiert nach Reihenfolge. */
export function activeBanners(
  banners: FilialBanner[],
  now: Date = new Date(),
): FilialBanner[] {
  return banners
    .filter((b) => b.aktiv)
    .filter((b) => !b.gueltigBis || new Date(b.gueltigBis) >= now)
    .sort((a, b) => a.reihenfolge - b.reihenfolge)
}

export const FILIAL_ANGEBOTE = {
  kicker: 'Nur in der Filiale',
  headline: 'Aktuelle Angebote aus Hückelhoven',
}

// ── Sektion 7: Boden-Kategorien ─────────────────────────────────────────────────
export const BODEN_KATEGORIEN = {
  kicker: 'Sortiment',
  headline: 'Für jeden Raum der passende Boden',
  kategorien: [
    { titel: 'Laminat', href: '/category/laminat', image: 'https://2025.bodenjaeger.de/wp-content/uploads/2024/08/DSCF2201-scaled-1-683x1024.jpg' },
    { titel: 'Rigid-Vinyl', href: '/category/rigid-vinyl', image: 'https://2025.bodenjaeger.de/wp-content/uploads/2024/08/DSCF2104-scaled-1-683x1024.jpg' },
    { titel: 'Parkett', href: '/category/parkett', image: 'https://2025.bodenjaeger.de/wp-content/uploads/2024/08/DSCF1962-scaled-1-1024x683.jpg' },
    { titel: 'Klebe-Vinyl', href: '/category/klebe-vinyl', image: 'https://2025.bodenjaeger.de/wp-content/uploads/2024/08/DSCF1946-scaled-1-1024x683.jpg' },
    { titel: 'Teppichboden', href: '/category/teppichboden', image: 'https://2025.bodenjaeger.de/wp-content/uploads/2024/08/DSCF2023-scaled-1-1024x683.jpg' },
    { titel: 'Zubehör', href: '/category/zubehoer', image: 'https://2025.bodenjaeger.de/wp-content/uploads/2024/08/DSCF1968-scaled-1-1024x683.jpg' },
  ],
  cta: { label: 'Gesamtes Sortiment ansehen', href: '/', variant: 'outline' } as Cta,
}

// ── Sektion 8: Baumarkt-Vergleich ───────────────────────────────────────────────
export const VERGLEICH = {
  kicker: 'Der Unterschied',
  headline: 'Fachmarkt statt Baumarkt',
  bodenjaeger: {
    titel: 'Bodenjäger Fachmarkt',
    punkte: [
      'Beratung von Fachleuten, die selbst verlegen',
      'Sockelleisten & Dämmung inklusive kalkuliert',
      'Hoher Lagerbestand, sofort verfügbar',
      'Lieferung und professionelle Verlegung möglich',
      'Ehrliche Festpreise ohne Lockangebote',
    ],
  },
  baumarkt: {
    titel: 'Klassischer Baumarkt',
    punkte: [
      'Selbstbedienung, kaum Fachberatung',
      'Zubehör muss einzeln zusammengesucht werden',
      'Häufig nur Bestellware',
      'Verlegung ist Ihre Sache',
      'Preise wirken günstig, Zubehör kommt obendrauf',
    ],
  },
}

// ── Sektion 9: Leistungen (Icon-Grid) ───────────────────────────────────────────
// icon = lucide-react Icon-Name (wird in der Komponente gemappt)
export const LEISTUNGEN = {
  kicker: 'Unsere Leistungen',
  headline: 'Rundum-Sorglos – alles aus einer Hand',
  items: [
    { icon: 'Hammer', titel: 'Verlegeservice', text: 'Professionelle Verlegung durch erfahrene Handwerker.', href: '/fachmarkt-hueckelhoven/verlegeservice' },
    { icon: 'Truck', titel: 'Lieferservice', text: 'Lieferung zum Wunschtermin bis vor die Tür.', href: '/fachmarkt-hueckelhoven/lieferservice' },
    { icon: 'Caravan', titel: 'Anhängerverleih', text: 'Kostenloser Anhänger für den Selbsttransport.', href: '/fachmarkt-hueckelhoven/anhaengerverleih' },
    { icon: 'Warehouse', titel: 'Warenlagerung', text: 'Wir lagern Ihre Ware bis zum Verlegetermin.', href: '/fachmarkt-hueckelhoven/warenlagerung' },
    { icon: 'Users', titel: 'Fachberatung', text: 'Persönliche Beratung vor Ort und am Telefon.', href: '/fachmarkt-hueckelhoven/fachberatung' },
    { icon: 'Package', titel: 'Set-Angebote', text: 'Boden, Dämmung und Sockelleiste als Komplettpaket.', href: '/fachmarkt-hueckelhoven/set-angebote' },
    { icon: 'Wrench', titel: 'Werkzeugverleih', text: 'Das passende Werkzeug für Ihr Projekt.', href: '/fachmarkt-hueckelhoven/werkzeugverleih' },
    { icon: 'CalendarDays', titel: 'Schausonntag', text: 'An ausgewählten Sonntagen geöffnet.', href: '/fachmarkt-hueckelhoven/schausonntag' },
  ],
}

// ── Sektion 10: Google-Bewertungen ──────────────────────────────────────────────
// Statische Platzhalter-Konstanten (siehe Offene Punkte / Review-Einbindung).
export const GOOGLE_REVIEWS = {
  kicker: 'Das sagen unsere Kunden',
  headline: 'Ausgezeichnet bewertet',
  rating: 4.8, // TODO(kunde): finalen Wert bestätigen
  count: 180, // TODO(kunde): finale Anzahl bestätigen
  countSuffix: '+',
  hinweis: 'Bewertungen bei Google',
  // TODO(reviews): echte Einbindung klären (src/data/google-reviews.json vorhanden)
}

// ── Sektion 11: Team ────────────────────────────────────────────────────────────
export const TEAM = {
  kicker: 'Ihr Team vor Ort',
  headline: 'Menschen, die Böden lieben',
  // TODO(kunde): echte Teamfotos + Namen/Funktionen liefern.
  foto: '/fachmarkt/team-bodenjaeger-hueckelhoven.jpg',
  fotoAlt: 'Das Team des Bodenjäger Fachmarkts Hückelhoven',
  mitglieder: [
    { name: 'N. N.', funktion: 'Filialleitung' },
    { name: 'N. N.', funktion: 'Fachberatung' },
    { name: 'N. N.', funktion: 'Verlegeservice' },
  ],
}

// ── Sektion 12: Standort ────────────────────────────────────────────────────────
export const STANDORT_SEKTION = {
  kicker: 'Besuchen Sie uns',
  headline: 'So finden Sie zu uns',
}

// ── Sektion 13: Abschluss-CTA ───────────────────────────────────────────────────
export const ABSCHLUSS = {
  headline: 'Kommen Sie vorbei – wir freuen uns auf Sie',
  subline: 'Persönliche Beratung, große Ausstellung und faire Preise in Hückelhoven.',
  ctas: [CTA_ROUTE, CTA_BERATUNG] as Cta[],
}

// ── Sticky Bottom Bar (mobil) ───────────────────────────────────────────────────
export const STICKY = {
  route: CTA_ROUTE,
  anrufen: CTA_ANRUFEN,
  beratung: CTA_BERATUNG,
}
