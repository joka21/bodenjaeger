/**
 * Zentrale Inhalte der Service-Übersichtsseite (/service).
 *
 * Wortlaut 1:1 aus dem verbindlichen Kunden-Briefing. Nicht umformulieren.
 * Tonalität durchgängig "du".
 *
 * Link-Map: EINZIGE Quelle für alle Ziel-URLs (SERVICE_LINKS).
 */
import type { Cta } from '@/types/cta'

// ── Link-Map (eine Quelle) ───────────────────────────────────────────────────
// ENDZUSTAND (Kundenentscheidung 2026-07-12): Es werden bewusst KEINE
// /service/*-Unterseiten gebaut. Die Service-Detailinhalte liegen weiterhin
// unter /fachmarkt-hueckelhoven/*, damit die bestehenden URLs und ihre
// Google-Rankings erhalten bleiben. Diese Ziele NICHT "aufräumen" oder auf
// /service/* umbiegen — das wäre SEO-schädlich und ist ausdrücklich nicht gewollt.
export const SERVICE_LINKS = {
  musterBestellen: '/category/musterbox',
  grossmuster: '/fachmarkt-hueckelhoven',
  setKaufen: '/fachmarkt-hueckelhoven/set-angebote',
  lieferung: '/fachmarkt-hueckelhoven/lieferservice',
  einlagerung: '/fachmarkt-hueckelhoven/warenlagerung',
  verlegewerkzeug: '/fachmarkt-hueckelhoven/werkzeugverleih',
  verlegeservice: '/fachmarkt-hueckelhoven/verlegeservice',
  fachberatung: '/fachmarkt-hueckelhoven/fachberatung',
  fachmarkt: '/fachmarkt-hueckelhoven',
  kontakt: '/kontakt',
} as const

// ── Meta / SEO ───────────────────────────────────────────────────────────────
export const SERVICE_META = {
  title: 'Service bei Bodenjäger | Muster, Lieferung, Einlagerung & Verlegung',
  description:
    'Entdecke den Bodenjäger Service: 3 Muster kostenfrei bestellen, Böden im Set kaufen, Lieferung, Einlagerung, Verlegewerkzeug und professioneller Verlegeservice.',
}

// ── 1. Hero ──────────────────────────────────────────────────────────────────
export const SERVICE_HERO = {
  headline: 'Unser Service: Vom Muster bis zur fertigen Verlegung',
  subline:
    'Bodenjäger begleitet dich von der persönlichen Beratung über die Lieferung bis zur professionellen Verlegung. Alles aus einer Hand – zuverlässig, ehrlich und regional.',
  // Interim-Foto aus WP-Bestand. TODO(kunde): finales Motiv nach public/service/beratung-fachmarkt.jpg (Beratungssituation, Musterbox/Dekorbrett sichtbar)
  image: 'https://2025.bodenjaeger.de/wp-content/uploads/2024/08/DSCF1968-scaled-1-1024x683.jpg',
  imageAlt:
    'Beratungssituation im Fachmarkt – Mitarbeiter zeigt einer Kundin Bodenmuster',
  ctas: [
    { label: 'Muster bestellen', href: SERVICE_LINKS.musterBestellen, variant: 'primary' },
    { label: 'Verlegeservice anfragen', href: SERVICE_LINKS.kontakt, variant: 'primary' },
  ] as Cta[],
  sekundaerLink: { label: 'Fachmarkt Hückelhoven besuchen', href: SERVICE_LINKS.fachmarkt },
}

// Trust-Badges (direkt unter dem Hero)
export const SERVICE_TRUST_BADGES = [
  { icon: 'Award', text: 'Über 40 Jahre Erfahrung' },
  { icon: 'Layers', text: 'Alle Böden im Set kaufen – inkl. Sockelleiste & ggf. Dämmung' },
  { icon: 'MapPin', text: 'Verlegeservice im Umkreis von ca. 50 km' },
]

// ── 2. Entscheidungsbereich ──────────────────────────────────────────────────
export const SERVICE_PROJEKT = {
  headline: 'Was brauchst du für dein Projekt?',
  karten: [
    {
      titel: 'Boden erst testen',
      text: 'Bestelle 3 Muster kostenfrei oder sieh dir Großmuster im Fachmarkt an.',
      href: SERVICE_LINKS.musterBestellen,
    },
    {
      titel: 'Selbst verlegen',
      text: 'Wir liefern dir alles, was du brauchst – inklusive passendem Zubehör und praktischen Tipps.',
      href: SERVICE_LINKS.verlegewerkzeug,
    },
    {
      titel: 'Liefern lassen',
      text: 'Lass deinen Boden bequem nach Hause liefern oder hole ihn direkt im Fachmarkt ab.',
      href: SERVICE_LINKS.lieferung,
    },
    {
      titel: 'Verlegen lassen',
      text: 'Lehn dich zurück – unser erfahrenes Team übernimmt die fachgerechte Verlegung.',
      href: SERVICE_LINKS.verlegeservice,
    },
  ],
}

// ── 3. Service-Kachelbereich ─────────────────────────────────────────────────
// icon = lucide-react Icon-Name (Mapping in der Komponente). `premium` hebt die
// Verlegeservice-Karte hervor (roter Rahmen + Label). KEIN Anhängerverleih.
export const SERVICE_GRID = {
  headline: 'Unsere wichtigsten Services',
  premiumLabel: 'Unser Premium-Service',
  karten: [
    {
      icon: 'Users',
      titel: 'Persönliche Fachberatung',
      text: 'Individuelle Beratung vor Ort, telefonisch oder per E-Mail – ehrlich, kompetent und verständlich.',
      href: SERVICE_LINKS.fachberatung,
    },
    {
      icon: 'PackageCheck',
      titel: '3 Muster kostenfrei bestellen',
      text: 'Bestelle bis zu 3 Bodenmuster kostenfrei zu dir nach Hause und prüfe Farbe, Struktur und Wirkung in deinem Raum.',
      href: SERVICE_LINKS.musterBestellen,
    },
    {
      icon: 'Store',
      titel: 'Großmuster im Fachmarkt',
      text: 'Erlebe Böden in Originalgröße und bei realem Licht direkt in unserem Fachmarkt.',
      href: SERVICE_LINKS.grossmuster,
    },
    {
      icon: 'Layers',
      titel: 'Alle Böden im Set kaufen',
      text: 'Inkl. Sockelleiste und ggf. inkl. Dämmung – praktisch, abgestimmt und preislich attraktiv.',
      href: SERVICE_LINKS.setKaufen,
    },
    {
      icon: 'Truck',
      titel: 'Lieferung & Abholung',
      text: 'Lass deinen Boden bequem liefern oder hole ihn direkt im Fachmarkt Hückelhoven ab.',
      href: SERVICE_LINKS.lieferung,
    },
    {
      icon: 'Warehouse',
      titel: 'Kostenlose Einlagerung',
      text: 'Wir lagern deinen Boden kostenlos ein, bis du bereit für dein Projekt bist.',
      href: SERVICE_LINKS.einlagerung,
    },
    {
      icon: 'Wrench',
      titel: 'Verlegewerkzeug ausleihen',
      text: 'Leihe dir professionelles Verlegewerkzeug für dein Projekt – einfach, praktisch und unkompliziert.',
      href: SERVICE_LINKS.verlegewerkzeug,
    },
    {
      icon: 'Hammer',
      titel: 'Professioneller Verlegeservice',
      text: 'Fachgerechte Verlegung durch erfahrene Bodenleger – sauber, zuverlässig und termintreu.',
      href: SERVICE_LINKS.verlegeservice,
      premium: true,
    },
  ],
}

// ── 4. Verlegeservice-Block (dunkel) ─────────────────────────────────────────
export const SERVICE_VERLEGEABLAUF = {
  headline: 'Verlegeservice – so läuft es ab',
  text: 'Von der ersten Anfrage bis zur fertigen Verlegung begleiten wir dich Schritt für Schritt.',
  // Interim-Foto aus WP-Bestand. TODO(kunde): finales Verlegebild nach public/service/verlegung-hintergrund.jpg
  image: 'https://2025.bodenjaeger.de/wp-content/uploads/2024/08/DSCF1962-scaled-1-1024x683.jpg',
  imageAlt: 'Bodenleger bei der Verlegung eines Bodens',
  schritte: [
    { nr: 1, titel: 'Kontakt', text: 'Du meldest dich bei uns.' },
    { nr: 2, titel: 'Beratung', text: 'Wir beraten dich persönlich.' },
    { nr: 3, titel: 'Aufmaß', text: 'Wir kommen vorbei und messen aus.' },
    { nr: 4, titel: 'Angebot', text: 'Du erhältst ein faires Angebot.' },
    { nr: 5, titel: 'Termin', text: 'Wir vereinbaren einen passenden Termin.' },
    { nr: 6, titel: 'Verlegung', text: 'Unser Team verlegt deinen Boden.' },
    { nr: 7, titel: 'Abnahme', text: 'Gemeinsame Endkontrolle.' },
  ],
  cta: { label: 'Jetzt unverbindlich anfragen', href: SERVICE_LINKS.kontakt, variant: 'primary' } as Cta,
}

// ── 5. Orientierung ──────────────────────────────────────────────────────────
// Situation → Empfehlung(en). `href` verlinkt die Empfehlung auf den Service.
export const SERVICE_ORIENTIERUNG = {
  headline: 'Welcher Service passt zu dir?',
  paare: [
    {
      situation: 'Ich bin unsicher bei Farbe oder Optik',
      empfehlung: '3 Muster kostenfrei bestellen + Großmuster im Fachmarkt',
      href: SERVICE_LINKS.musterBestellen,
    },
    {
      situation: 'Ich renoviere erst später',
      empfehlung: 'Kostenlose Einlagerung',
      href: SERVICE_LINKS.einlagerung,
    },
    {
      situation: 'Ich möchte selbst verlegen',
      empfehlung: 'Verlegewerkzeug + Fachberatung',
      href: SERVICE_LINKS.verlegewerkzeug,
    },
    {
      situation: 'Ich möchte den Boden geliefert bekommen',
      empfehlung: 'Lieferung & Abholung',
      href: SERVICE_LINKS.lieferung,
    },
    {
      situation: 'Ich will keinen Stress',
      empfehlung: 'Aufmaß + Verlegeservice',
      // Konsistent mit allen anderen Empfehlungen: Ziel ist die reale
      // Verlegeservice-Seite (nicht ein On-Page-Anker) — einheitliche UX.
      href: SERVICE_LINKS.verlegeservice,
    },
  ],
}

// ── 6. FAQ ───────────────────────────────────────────────────────────────────
// Fragen 1:1 aus dem Briefing. Antworten sind sachliche Platzhalter im "du"-Ton
// und betreffen Geschäftskonditionen → müssen vom Kunden bestätigt werden.
// TODO: Kundenfreigabe (alle Antworten).
export const SERVICE_FAQ = {
  headline: 'Häufige Fragen',
  items: [
    {
      frage: 'Sind die 3 Muster wirklich kostenfrei?',
      antwort:
        'Ja. Du kannst bis zu 3 Bodenmuster kostenfrei zu dir nach Hause bestellen. Ab dem 4. Muster kommt lediglich ein kleiner Versandbeitrag hinzu.', // TODO: Kundenfreigabe
    },
    {
      frage: 'Liefert ihr auch zu mir nach Hause?',
      antwort:
        'Ja, wir liefern deinen Boden bequem zu dir nach Hause. Alternativ kannst du ihn direkt im Fachmarkt Hückelhoven abholen.', // TODO: Kundenfreigabe
    },
    {
      frage: 'Kann ich meinen Boden bei euch einlagern?',
      antwort:
        'Ja. Wir lagern deinen bestellten Boden kostenlos für dich ein, bis du mit deinem Projekt startest.', // TODO: Kundenfreigabe
    },
    {
      frage: 'Welche Böden kann ich im Set kaufen?',
      antwort:
        'Grundsätzlich kannst du alle unsere Böden im Set kaufen – inklusive passender Sockelleiste und bei Bedarf mit Dämmung.', // TODO: Kundenfreigabe
    },
    {
      frage: 'Ist die Dämmung immer im Set enthalten?',
      antwort:
        'Nicht bei jedem Boden. Ob eine Dämmung sinnvoll und im Set enthalten ist, hängt vom jeweiligen Boden und Untergrund ab – wir beraten dich dazu gerne.', // TODO: Kundenfreigabe
    },
    {
      frage: 'Kann ich Verlegewerkzeug bei euch ausleihen?',
      antwort:
        'Ja, du kannst dir bei uns professionelles Verlegewerkzeug ausleihen, damit dein Projekt gelingt.', // TODO: Kundenfreigabe
    },
    {
      frage: 'In welchem Umkreis bietet ihr Verlegung an?',
      antwort:
        'Unseren Verlegeservice bieten wir im Umkreis von ca. 50 km rund um Hückelhoven an. Sprich uns bei Fragen zu deiner Region einfach an.', // TODO: Kundenfreigabe
    },
    {
      frage: 'Kann ich mich auch ohne Termin beraten lassen?',
      antwort:
        'Ja, du kannst uns während der Öffnungszeiten auch ohne Termin im Fachmarkt besuchen. Für eine ausführliche Beratung empfehlen wir aber eine kurze Terminabsprache.', // TODO: Kundenfreigabe
    },
  ],
}

// ── 7. Kontakt-CTA ───────────────────────────────────────────────────────────
export const SERVICE_KONTAKT = {
  headline: 'Persönliche Beratung gewünscht?',
  text: 'Wir helfen dir gerne bei der Auswahl, Planung und Umsetzung deines Bodenprojekts.',
  telefonAnzeige: '02433 938884',
  telefonLink: 'tel:+492433938884',
  oeffnungszeiten: 'Mo.–Fr. 9:00–18:30 Uhr · Sa. 9:00–14:00 Uhr',
  cta: { label: 'Zum Kontaktformular', href: SERVICE_LINKS.kontakt, variant: 'primary' } as Cta,
  ctaSekundaer: { label: 'Fachmarkt Hückelhoven besuchen', href: SERVICE_LINKS.fachmarkt, variant: 'secondary' } as Cta,
}

// ── SEO: FAQPage-Schema ──────────────────────────────────────────────────────
// DEAKTIVIERT bis die FAQ-Antworten kundenfreigegeben sind (sonst würden
// Platzhalter-Antworten als Rich-Result ausgespielt).
// TODO(kunde): nach Freigabe der FAQ-Antworten auf true setzen.
export const SERVICE_FAQ_SCHEMA_ENABLED = false
