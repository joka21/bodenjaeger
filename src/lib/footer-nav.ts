/**
 * Zentrale Datenquelle für den globalen Footer.
 *
 * EINZIGE Stelle für Footer-Spalten, Links, Social-Profile, Zahlungs- und
 * Versand-Badges. Die Komponenten unter `components/footer/` rendern nur noch
 * — sie enthalten keine hartverdrahteten Link-Listen.
 *
 * Ziele werden, wo vorhanden, aus bestehenden Quellen importiert
 * (`content/service.ts`, `content/fachmarkt.ts`) statt neu getippt.
 */
import { SERVICE_LINKS } from '@/content/service'
import { MAPS_ROUTE_URL, OEFFNUNGSZEITEN, STANDORT } from '@/content/fachmarkt'

// ── Stammdaten ───────────────────────────────────────────────────────────────

/**
 * Vollständige Firmierung.
 * Quelle: Impressum (WordPress-Seite `impressum`) — „Bodenjäger GmbH & Co. KG",
 * Amtsgericht Mönchengladbach, HRA 10101. Am 09.08.2026 dort verifiziert.
 * Einzige Definition im Frontend — nicht duplizieren.
 */
export const FIRMIERUNG = 'Bodenjäger GmbH & Co. KG'

export const FOOTER_ADRESSE = {
  strasse: STANDORT.strasse,
  plzOrt: `${STANDORT.plz} ${STANDORT.ort}`,
} as const

export const FOOTER_TELEFON = {
  anzeige: STANDORT.telefonAnzeige,
  href: STANDORT.telefonLink,
} as const

/**
 * Öffnungszeiten im Footer: nur Mo.–Fr. und Sa.
 * Der Sonntag aus OEFFNUNGSZEITEN ("nicht jeden Sonntag") wird hier bewusst
 * ausgelassen — Quelle bleibt trotzdem content/fachmarkt.ts.
 */
export const FOOTER_OEFFNUNGSZEITEN = OEFFNUNGSZEITEN.filter(
  (zeile) => zeile.tag !== 'Sonntag'
)

// ── Typen ────────────────────────────────────────────────────────────────────

/** Icon-Schlüssel für Links mit Symbol (nur Kontaktspalte). Mapping: FooterLinkList. */
export type FooterIconKey = 'phone' | 'route' | 'mail'

export interface FooterLink {
  label: string
  /** Zielpfad. Entfällt bei `kind: 'cookie'`. */
  href?: string
  /** 'cookie' rendert einen <button>, der das Consent-Layer öffnet (kein <a>). */
  kind?: 'cookie'
  /** Externes Ziel (tel:, Google Maps) → kein next/link, target/rel gesetzt. */
  external?: boolean
  icon?: FooterIconKey
}

export interface FooterColumn {
  /** Stabile ID für aria-controls/aria-labelledby im Mobile-Accordion. */
  id: string
  title: string
  /** Beschriftung des <nav>-Landmarks dieser Spalte. */
  ariaLabel: string
  links: FooterLink[]
}

export interface FooterBadge {
  /** Sichtbarer Text bei Textbadges und zugleich Screenreader-Label. */
  label: string
  /**
   * Lokales SVG unter public/. Fehlt der Wert, rendert BadgeGrid denselben
   * Badge als Textbadge — identische Hülle, Höhe und Schriftgröße.
   * Ein späteres Logo aktiviert man durch Setzen von `src`, ohne Codeänderung.
   */
  src?: string
  /**
   * false = vorbereitet, aber nicht gerendert. Genutzt für Zahlarten, die der
   * Checkout (noch) nicht anbietet — Footer und Checkout bleiben deckungsgleich.
   */
  enabled: boolean
  /** Sondermarke vor dem Text: roter Kreis mit „J" (eigene Lieferung). */
  mark?: 'bodenjaeger'
}

// ── Spalte 1: Kontakt (Aktionslinks) ─────────────────────────────────────────

export const FOOTER_KONTAKT_AKTIONEN: FooterLink[] = [
  { label: 'Anrufen', href: FOOTER_TELEFON.href, icon: 'phone', external: true },
  { label: 'Route planen', href: MAPS_ROUTE_URL, icon: 'route', external: true },
  { label: 'Kontaktformular', href: SERVICE_LINKS.kontakt, icon: 'mail' },
]

// ── Social ───────────────────────────────────────────────────────────────────

export type SocialKey = 'facebook' | 'instagram' | 'tiktok' | 'youtube'

export interface SocialProfile {
  key: SocialKey
  /** Accessible Name des Links. */
  label: string
  href: string
}

/**
 * Aktive Social-Profile. TikTok und YouTube sind in FooterSocial.tsx bereits
 * als Icon gemappt — sobald die Profil-URLs vorliegen, reicht je ein Objekt
 * hier. Keine Komponentenänderung nötig, keine Platzhalter im Layout.
 */
export const FOOTER_SOCIAL: SocialProfile[] = [
  {
    key: 'facebook',
    label: 'Bodenjäger auf Facebook',
    href: 'https://www.facebook.com/p/Bodenj%C3%A4ger-100057406151090/?locale=de_DE',
  },
  {
    key: 'instagram',
    label: 'Bodenjäger auf Instagram',
    href: 'https://www.instagram.com/bodenjager/',
  },
  // { key: 'tiktok',  label: 'Bodenjäger auf TikTok',  href: 'TODO: Profil-URL' },
  // { key: 'youtube', label: 'Bodenjäger auf YouTube', href: 'TODO: Profil-URL' },
]

// ── Spalten 2–4 ──────────────────────────────────────────────────────────────

/**
 * Es existiert genau EINE Widerrufsseite (/widerruf). Beide Widerrufs-Links
 * der Kundenservice-Spalte, der Button darunter und der Eintrag in der
 * Bottom-Bar zeigen deshalb auf dasselbe Ziel.
 */
const WIDERRUF_HREF = '/widerruf'

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    id: 'kundenservice',
    title: 'Kundenservice',
    ariaLabel: 'Kundenservice',
    links: [
      { label: 'Kontakt', href: SERVICE_LINKS.kontakt },
      { label: 'Muster bestellen', href: SERVICE_LINKS.musterBestellen },
      { label: 'Versand & Lieferzeit', href: '/versand-lieferzeit' },
      { label: 'Widerruf & Rücksendung', href: WIDERRUF_HREF },
      { label: 'Widerrufsbelehrung & Widerrufsformular', href: WIDERRUF_HREF },
      { label: 'AGB', href: '/agb' },
      { label: 'Datenschutz', href: '/datenschutz' },
      { label: 'Impressum', href: '/impressum' },
    ],
  },
  {
    id: 'ueber-bodenjaeger',
    title: 'Über Bodenjäger',
    ariaLabel: 'Über Bodenjäger',
    links: [
      { label: 'Jobs & Karriere', href: '/karriere' },
      { label: 'Blog', href: '/blog' },
      { label: 'Cookie-Einstellungen', kind: 'cookie' },
    ],
  },
  {
    id: 'fachmarkt',
    title: 'Fachmarkt Hückelhoven',
    ariaLabel: 'Fachmarkt Hückelhoven',
    links: [
      { label: 'Fachmarkt Übersicht', href: SERVICE_LINKS.fachmarkt },
      { label: 'Fachberatung', href: SERVICE_LINKS.fachberatung },
      { label: 'Musterservice', href: SERVICE_LINKS.musterservice },
      { label: 'Verlegeservice', href: SERVICE_LINKS.verlegeservice },
      { label: 'Verlegeservice anfragen', href: SERVICE_LINKS.verlegeserviceAnfrage },
      { label: 'Set-Angebote', href: SERVICE_LINKS.setKaufen },
      { label: 'Lieferung & Abholung', href: SERVICE_LINKS.lieferung },
      { label: 'Einlagerung', href: SERVICE_LINKS.einlagerung },
      { label: 'Werkzeugverleih', href: SERVICE_LINKS.verlegewerkzeug },
    ],
  },
]

/** Ruhiger Outline-Button unter der Kundenservice-Spalte. Kein CTA-Look. */
export const WIDERRUF_BUTTON = {
  label: 'Vertrag widerrufen',
  href: WIDERRUF_HREF,
} as const

// ── Trust-/Zahlungs-/Lieferzone ──────────────────────────────────────────────

/**
 * Zahlungsarten.
 *
 * Regel: Es wird ausschließlich dargestellt, was der Checkout tatsächlich
 * anbietet (src/app/checkout/page.tsx → PayPal, Klarna, Stripe mit
 * Visa/Mastercard/Amex/Apple Pay/Google Pay, Vorkasse per Banküberweisung).
 *
 * Die deaktivierten Einträge sind vorbereitet: Nach einer Checkout-Erweiterung
 * genügt `enabled: true` (und ggf. ein SVG unter public/images/zahlungslogos/).
 *
 * 8 aktive Badges → gehen im 2-/4-spaltigen Grid glatt auf, keine Zeile endet
 * mit einem einzelnen Badge.
 */
export const PAYMENT_BADGES: FooterBadge[] = [
  { label: 'Visa', src: '/images/zahlungslogos/visa.svg', enabled: true },
  { label: 'Mastercard', src: '/images/zahlungslogos/mastercard.svg', enabled: true },
  { label: 'American Express', src: '/images/zahlungslogos/amex.svg', enabled: true },
  { label: 'Apple Pay', src: '/images/zahlungslogos/apple-pay.svg', enabled: true },
  { label: 'Google Pay', src: '/images/zahlungslogos/google-pay.svg', enabled: true },
  { label: 'PayPal', src: '/images/zahlungslogos/paypal.svg', enabled: true },
  { label: 'Klarna', src: '/images/zahlungslogos/klarna.svg', enabled: true },
  { label: 'Vorkasse', enabled: true },

  // Vorbereitet, aber nicht im Checkout verfügbar → nicht anzeigen.
  { label: 'Amazon Pay', enabled: false },
  { label: 'PayPal Später bezahlen', enabled: false },
  { label: 'Ratenzahlung PayPal', enabled: false },
  { label: 'Ratenzahlung Klarna', enabled: false },
]

/**
 * Versanddienstleister. Aktuell alle drei als Textbadge, weil für DHL und
 * Raben keine lizenzierten lokalen SVGs vorliegen (Hotlinking ist
 * ausgeschlossen). Sobald ein Logo unter public/ liegt, reicht `src` — die
 * Badge-Hülle bleibt identisch.
 */
export const SHIPPING_BADGES: FooterBadge[] = [
  { label: 'DHL', enabled: true },
  { label: 'Raben', enabled: true },
  { label: 'Bodenjäger', enabled: true, mark: 'bodenjaeger' },
]

export const TRUST_ZONE_TEXTE = {
  trustedShops: {
    titel: 'Trusted Shops',
    text: 'Käuferschutz',
  },
  zahlung: {
    titel: 'Sichere Zahlung',
  },
  lieferung: {
    titel: 'Schnelle Lieferung',
    zusatz: 'oder Abholung im Fachmarkt',
  },
  fachmarkt: {
    titel: 'Fachmarkt vor Ort',
    text: 'Persönliche Beratung, große Auswahl und viele Services rund um deinen Boden.',
  },
} as const

// ── Bottom-Bar ───────────────────────────────────────────────────────────────

export const FOOTER_COPYRIGHT = `© 2026 ${FIRMIERUNG}`

export const FOOTER_PREISHINWEIS =
  '* alle Preise inkl. MwSt. und ggf. zzgl. Versandkosten'

export const FOOTER_BOTTOM_LINKS: FooterLink[] = [
  { label: 'Impressum', href: '/impressum' },
  { label: 'Datenschutz', href: '/datenschutz' },
  { label: 'AGB', href: '/agb' },
  { label: 'Widerruf', href: WIDERRUF_HREF },
  { label: 'Cookie-Einstellungen', kind: 'cookie' },
]
