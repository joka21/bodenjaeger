/**
 * Inhalte des Shop-Headers: USP-Leiste, Hauptnavigation, Direktlinks.
 *
 * Einzige Quelle für Header und Mobile-Menü — beide lesen dieselben Daten,
 * damit Desktop-Dropdown und mobiles Akkordeon nicht auseinanderlaufen.
 *
 * Kategorie-Slugs bleiben unverändert (`/category/vinylboden` usw.); im Header
 * werden nur die Labels verkürzt („Vinyl" statt „Vinylboden"). Sockelleisten
 * und Dämmung liegen als eigene Gruppe im Zubehör-Dropdown.
 */

export type NavIcon = 'package' | 'truck' | 'calendar' | 'gift'

export interface UspItem {
  id: string
  icon: NavIcon
  label: string
}

export interface NavChild {
  id: string
  label: string
  /** Fertiger Pfad. Leer bei Gruppen-Überschriften. */
  href: string
  /** true = nicht klickbare Zwischenüberschrift im Dropdown. */
  isGroupLabel?: boolean
}

export interface NavItem {
  id: string
  label: string
  href: string
  children?: NavChild[]
}

/** Anzeigedauer eines USP im mobilen Ticker. Muss zur Animationsdauer von
 *  `.hdr-usp-progress` in globals.css passen (dort 4s). */
export const USP_INTERVAL_MS = 4000

export const USP_ITEMS: UspItem[] = [
  { id: 'musterbox', icon: 'package', label: 'Gratis Musterbox' },
  { id: 'lieferung', icon: 'truck', label: 'Kostenfreie Lieferung ab 999€' },
  { id: 'einlagerung', icon: 'calendar', label: '12 Monate kostenfrei Einlagerung' },
  { id: 'set', icon: 'gift', label: 'Dämmung & Sockelleiste kostenlos im Set' },
]

export const SHOP_NAV: NavItem[] = [
  {
    id: 'vinyl',
    label: 'Vinyl',
    href: '/category/vinylboden',
    children: [
      { id: 'klebe-vinyl', label: 'Klebe-Vinyl', href: '/category/klebe-vinyl' },
      { id: 'rigid-vinyl', label: 'Rigid-Vinyl', href: '/category/rigid-vinyl' },
      { id: 'vinyl-marken', label: 'Marken', href: '', isGroupLabel: true },
      { id: 'coretec', label: 'COREtec', href: '/category/coretec' },
      { id: 'primecore', label: 'primeCORE', href: '/category/primecore' },
    ],
  },
  {
    id: 'parkett',
    label: 'Parkett',
    href: '/category/parkett',
  },
  {
    id: 'laminat',
    label: 'Laminat',
    href: '/category/laminat',
    children: [
      { id: 'laminat-marken', label: 'Marken', href: '', isGroupLabel: true },
      { id: 'orca', label: 'O.R.C.A.', href: '/category/o-r-c-a' },
    ],
  },
  {
    id: 'zubehoer',
    label: 'Zubehör',
    href: '/category/zubehoer',
    children: [
      { id: 'zubehoer-set', label: 'Fürs Set', href: '', isGroupLabel: true },
      { id: 'sockelleisten', label: 'Sockelleisten', href: '/category/sockelleisten' },
      { id: 'daemmung', label: 'Dämmung', href: '/category/daemmung' },
      { id: 'zubehoer-rest', label: 'Verlegen & Pflegen', href: '', isGroupLabel: true },
      {
        id: 'untergrundvorbereitung',
        label: 'Untergrundvorbereitung',
        href: '/category/untergrundvorbereitung',
      },
      { id: 'werkzeug', label: 'Werkzeug', href: '/category/werkzeug' },
      { id: 'kleber', label: 'Kleber', href: '/category/kleber' },
      {
        id: 'montagekleber-silikon',
        label: 'Montagekleber & Silikon',
        href: '/category/montagekleber-silikon',
      },
      { id: 'reinigung-pflege', label: 'Reinigung & Pflege', href: '/category/reinigung-pflege' },
      {
        id: 'zubehoer-fuer-sockelleisten',
        label: 'Zubehör für Sockelleisten',
        href: '/category/zubehoer-fuer-sockelleisten',
      },
    ],
  },
  {
    id: 'angebote',
    label: 'Angebote',
    href: '/sale',
  },
]

/** Roter Textlink in Nav-Zeile und Mobile-Menü. */
export const MUSTER_LINK = {
  label: '3 Gratis Muster',
  href: '/category/musterbox',
} as const

/** Outline-Button rechts in der Nav-Zeile bzw. Block im Mobile-Menü. */
export const FACHMARKT_LINK = {
  label: 'Zum Fachmarkt Hückelhoven',
  title: 'Fachmarkt Hückelhoven',
  subline: 'Ausstellung, Beratung & Verlegeservice',
  linkLabel: 'Zum Fachmarkt',
  href: '/fachmarkt-hueckelhoven',
} as const

export const SEARCH_PLACEHOLDER = 'Produkte, Marken oder Kategorien suchen…'
