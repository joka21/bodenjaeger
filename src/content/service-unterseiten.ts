/**
 * Inhalte der 6 statischen Fachmarkt-Service-Unterseiten
 * (/fachmarkt-hueckelhoven/service/<slug>).
 *
 * Wortlaut 1:1 aus docs/service-unterseiten-briefing.md. Ansprache „du".
 * Block-basiert: die statische [slug]-Route rendert Hero → Einleitung →
 * Blocks (Reihenfolge = Briefing) → Abschluss-CTA + Sticky-Leiste.
 */
import type { Cta } from '@/types/cta'
import { MAPS_ROUTE_URL } from '@/content/fachmarkt'

const KONTAKT = '/kontakt'
const cRoute = (label: string, variant: Cta['variant'] = 'primary'): Cta => ({ label, href: MAPS_ROUTE_URL, variant, external: true })
const cKontakt = (label: string, variant: Cta['variant'] = 'secondary'): Cta => ({ label, href: KONTAKT, variant })

export type SubBlock =
  | { kind: 'vorteile'; items: { icon: string; titel: string }[]; hinweis?: string }
  | { kind: 'ablauf'; headline: string; steps: string[]; hinweis?: string }
  | { kind: 'karten'; headline?: string; cards: { titel: string; text?: string; punkte?: string[] }[]; kleingedruckt?: string }
  | { kind: 'liste'; headline: string; items: string[] }
  | { kind: 'infobox'; text: string }

export interface ServiceSubpage {
  meta: { title: string; description: string }
  hero: { headline: string; untertitel: string; imageAlt: string; ctas: Cta[] }
  einleitung: { headline: string; text: string }
  blocks: SubBlock[]
  abschluss: { headline: string; text: string; ctas: Cta[] }
}

export const SERVICE_UNTERSEITEN: Record<string, ServiceSubpage> = {
  // ── 1. Fachberatung ──────────────────────────────────────────────────────
  fachberatung: {
    meta: {
      title: 'Fachberatung im Fachmarkt Hückelhoven | Bodenjäger',
      description: 'Persönliche, fachlich fundierte Bodenberatung in Hückelhoven – passend zu Räumen, Untergrund und Budget. Über 1.000 Bodenmuster vor Ort.',
    },
    hero: {
      headline: 'Der richtige Boden beginnt mit guter Beratung.',
      untertitel: 'Wir helfen dir dabei, den Boden zu finden, der wirklich zu deinen Räumen, deinen Anforderungen und deinem Budget passt.',
      imageAlt: 'Fachberater betrachtet gemeinsam mit Kunden große Bodenmuster im Fachmarkt',
      ctas: [cKontakt('Beratung im Fachmarkt', 'primary'), cKontakt('Kontakt aufnehmen')],
    },
    einleitung: {
      headline: 'Persönlich beraten statt einfach nur auswählen',
      text: 'Ein Boden muss nicht nur gut aussehen. Er muss auch zum Raum, zum Untergrund und zu deinem Alltag passen. Deshalb nehmen wir uns Zeit für deine Fragen und zeigen dir verständlich die Unterschiede zwischen Klick-Vinyl, Klebe-Vinyl, Laminat, Parkett, Teppich und CV-Boden.',
    },
    blocks: [
      {
        kind: 'vorteile',
        items: [
          { icon: 'Users', titel: 'Persönliche Fachberatung' },
          { icon: 'Layers', titel: 'Über 1.000 Bodenmuster' },
          { icon: 'HardHat', titel: 'Beratung zu Untergrund und Verlegung' },
          { icon: 'Wallet', titel: 'Empfehlungen passend zu deinem Budget' },
        ],
        hinweis: 'Unsere Fachberater verfügen über umfangreiche Erfahrung mit Bodenbelägen und deren fachgerechter Verlegung.',
      },
      {
        kind: 'ablauf',
        headline: 'So findest du deinen neuen Boden',
        steps: ['Raum und Anforderungen besprechen', 'Passende Bodenarten vergleichen', 'Farben und Dekore auswählen', 'Zubehör, Lieferung oder Verlegung planen'],
      },
    ],
    abschluss: {
      headline: 'Lass dich persönlich beraten',
      text: 'Besuche uns im Fachmarkt Hückelhoven und entdecke deinen neuen Boden direkt vor Ort.',
      ctas: [cRoute('Route zum Fachmarkt'), cKontakt('Kontakt aufnehmen')],
    },
  },

  // ── 2. Musterservice ─────────────────────────────────────────────────────
  musterservice: {
    meta: {
      title: 'Musterservice – Großmuster kostenlos ausleihen | Bodenjäger Hückelhoven',
      description: 'Leih dir dein Lieblingsdekor kostenlos als Großmuster aus und teste es zu Hause bei echtem Licht, mit Möbeln und im eigenen Raum.',
    },
    hero: {
      headline: 'Muster mit nach Hause nehmen und testen.',
      untertitel: 'Leih dir dein Lieblingsdekor kostenlos als Großmuster aus und prüfe ganz in Ruhe, wie es in deinem Zuhause wirkt.',
      imageAlt: 'Kunde betrachtet ein großes Bodenmuster im Wohnraum neben Möbeln und Wandfarben',
      ctas: [cKontakt('Muster im Fachmarkt auswählen', 'primary'), cKontakt('Kontakt aufnehmen')],
    },
    einleitung: {
      headline: 'Dein Boden wirkt zu Hause oft ganz anders',
      text: 'Licht, Möbel, Wandfarben und die Größe des Raumes beeinflussen die Wirkung eines Bodens. Mit unseren Großmustern kannst du deinen Favoriten direkt dort testen, wo er später verlegt werden soll.',
    },
    blocks: [
      {
        kind: 'vorteile',
        items: [
          { icon: 'PackageOpen', titel: 'Kostenloser Großmusterverleih' },
          { icon: 'Sun', titel: 'Wirkung bei echtem Raumlicht prüfen' },
          { icon: 'Sofa', titel: 'Mit Möbeln und Wandfarben vergleichen' },
          { icon: 'Clock', titel: 'In Ruhe zu Hause entscheiden' },
        ],
      },
      {
        kind: 'ablauf',
        headline: 'So funktioniert der Großmusterverleih',
        steps: ['Boden im Fachmarkt auswählen', 'Verfügbarkeit des Großmusters prüfen', 'Muster kostenlos mitnehmen', 'Zu Hause testen und anschließend zurückbringen'],
        hinweis: 'Die verfügbaren Muster und die Leihdauer können je nach Produkt variieren.',
      },
    ],
    abschluss: {
      headline: 'Teste deinen Favoriten zu Hause',
      text: 'Komm in den Fachmarkt, wähle dein Lieblingsdekor aus und nimm ein Großmuster zum Testen mit.',
      ctas: [cRoute('Route zum Fachmarkt'), cKontakt('Muster anfragen')],
    },
  },

  // ── 3. Set-Angebote ──────────────────────────────────────────────────────
  'set-angebote': {
    meta: {
      title: 'Set-Angebote – Boden mit passendem Zubehör | Bodenjäger Hückelhoven',
      description: 'Boden, Sockelleisten und passendes Zubehör als abgestimmtes Komplettpaket zum attraktiven Preis – mit persönlicher Mengenberechnung im Fachmarkt Hückelhoven.',
    },
    hero: {
      headline: 'Alles für deinen neuen Boden im passenden Set.',
      untertitel: 'Boden, Sockelleisten und passendes Zubehör – abgestimmt, vollständig und zu einem attraktiven Paketpreis.',
      imageAlt: 'Bodenpaket mit Bodenbelag, Sockelleisten, Dämmung und Zubehör',
      // TODO: „Set-Angebote entdecken" hat kein echtes Shop-Listing-Ziel → vorerst /kontakt.
      ctas: [cKontakt('Set-Angebote entdecken', 'primary'), cKontakt('Persönlich beraten lassen')],
    },
    einleitung: {
      headline: 'Komplett geplant statt einzeln zusammengesucht',
      text: 'Wir stellen dir passend zu deinem Boden ein vollständiges Set zusammen. So erhältst du die richtigen Sockelleisten, die passende Dämmung und das benötigte Zubehör direkt aus einer Hand.',
    },
    blocks: [
      {
        kind: 'vorteile',
        items: [
          { icon: 'Layers', titel: 'Passend abgestimmtes Zubehör' },
          { icon: 'BadgePercent', titel: 'Attraktive Paketpreise' },
          { icon: 'CheckCheck', titel: 'Keine wichtigen Materialien vergessen' },
          { icon: 'Calculator', titel: 'Persönliche Mengenberechnung' },
        ],
      },
      {
        kind: 'karten',
        headline: 'Unsere Set-Angebote',
        cards: [
          { titel: 'Klick-Vinyl, Laminat und Parkett', text: 'Bei ausgewählten Set-Angeboten erhältst du passende Sockelleisten und Dämmung kostenlos dazu.' },
          { titel: 'Klebe-Vinyl, Teppich und CV-Boden', text: 'Bei ausgewählten Set-Angeboten erhältst du passende Sockelleisten kostenlos dazu.' },
        ],
        kleingedruckt: 'Die genauen Set-Bestandteile und Aktionsbedingungen können je nach Produkt variieren.',
      },
    ],
    abschluss: {
      headline: 'Lass dir dein persönliches Boden-Set zusammenstellen',
      text: 'Wir berechnen die benötigte Menge und zeigen dir das passende Zubehör für dein Projekt.',
      ctas: [cKontakt('Im Fachmarkt beraten lassen', 'primary'), cKontakt('Kontakt aufnehmen')],
    },
  },

  // ── 4. Lieferung & Abholung ──────────────────────────────────────────────
  'lieferung-abholung': {
    meta: {
      title: 'Lieferung & Abholung | Bodenjäger Fachmarkt Hückelhoven',
      description: 'Hole deinen Boden bequem im Fachmarkt Hückelhoven ab oder lass ihn dir nach Hause liefern – Termin und Lieferbedingungen stimmen wir vorab mit dir ab.',
    },
    hero: {
      headline: 'Dein Boden kommt sicher bei dir an.',
      untertitel: 'Hole deine Bestellung bequem in unserem Fachmarkt ab oder lass sie dir direkt nach Hause liefern.',
      imageAlt: 'Bodenjäger-Lieferfahrzeug oder Mitarbeiter, der Bodenpakete für die Übergabe vorbereitet',
      ctas: [cKontakt('Lieferung anfragen', 'primary'), cRoute('Route zur Abholung', 'secondary')],
    },
    einleitung: {
      headline: 'Abholen oder liefern lassen',
      text: 'Du entscheidest, wie dein neuer Boden zu dir kommt. Wir stellen deine Bestellung zur Abholung bereit oder organisieren eine passende Lieferung zu deinem Wunschort.',
    },
    blocks: [
      {
        kind: 'karten',
        cards: [
          { titel: 'Abholung im Fachmarkt', punkte: ['Ware wird vorbereitet', 'Termin zur Abholung abstimmen', 'Unterstützung beim Verladen', 'Kostenlose Parkmöglichkeiten'] },
          { titel: 'Lieferung nach Hause', punkte: ['Liefertermin nach Absprache', 'Sorgfältiger Transport', 'Lieferung im regionalen Einzugsgebiet', 'Weitere Liefergebiete auf Anfrage'] },
        ],
      },
      {
        kind: 'infobox',
        text: 'Bitte prüfe vor der Lieferung, ob die Zufahrt und der Abladebereich für das Lieferfahrzeug erreichbar sind. Die genauen Lieferbedingungen stimmen wir vorab mit dir ab.',
      },
    ],
    abschluss: {
      headline: 'Wie möchtest du deine Bestellung erhalten?',
      text: 'Sprich uns an. Wir finden die passende Lösung für Abholung oder Lieferung.',
      ctas: [cKontakt('Lieferung anfragen', 'primary'), cKontakt('Abholung abstimmen')],
    },
  },

  // ── 5. Einlagerung ───────────────────────────────────────────────────────
  einlagerung: {
    meta: {
      title: 'Einlagerung – Boden sichern, später verlegen | Bodenjäger Hückelhoven',
      description: 'Sichere dir deinen Wunschboden frühzeitig: Wir lagern deine gekaufte Ware auf Wunsch bis zu sechs Monate ein und du holst sie ab, wenn deine Räume bereit sind.',
    },
    hero: {
      headline: 'Jetzt Boden sichern. Später verlegen.',
      untertitel: 'Wir lagern deine bereits gekaufte Ware auf Wunsch bis zu sechs Monate für dich ein.',
      imageAlt: 'Sauber und ordentlich eingelagerte Bodenpakete im Lager',
      ctas: [cKontakt('Einlagerung anfragen', 'primary'), cKontakt('Beratung im Fachmarkt')],
    },
    einleitung: {
      headline: 'Dein Boden wartet bei uns auf dich',
      text: 'Dein Wunschboden ist verfügbar, aber deine Baustelle noch nicht fertig? Sichere dir die benötigte Menge frühzeitig und hole die Ware erst dann ab, wenn du sie wirklich benötigst.',
    },
    blocks: [
      {
        kind: 'vorteile',
        items: [
          { icon: 'Warehouse', titel: 'Einlagerung bis zu sechs Monate' },
          { icon: 'CalendarClock', titel: 'Wunschboden und Menge frühzeitig sichern' },
          { icon: 'Home', titel: 'Kein Platzbedarf zu Hause' },
          { icon: 'CalendarCheck', titel: 'Abholung nach vorheriger Terminabsprache' },
        ],
      },
      {
        kind: 'ablauf',
        headline: 'So funktioniert die Einlagerung',
        steps: ['Boden auswählen und bestellen', 'Einlagerung mit uns vereinbaren', 'Ware bleibt sicher bei uns', 'Abhol- oder Liefertermin abstimmen'],
        hinweis: 'Die Einlagerung muss beim Kauf vereinbart werden. Voraussetzungen und maximale Lagerdauer können je nach Bestellung variieren.',
      },
    ],
    abschluss: {
      headline: 'Plane dein Projekt ohne Zeitdruck',
      text: 'Sichere dir deinen Wunschboden und rufe ihn ab, sobald deine Räume bereit sind.',
      ctas: [cKontakt('Einlagerung anfragen', 'primary'), cKontakt('Kontakt aufnehmen')],
    },
  },

  // ── 6. Werkzeugverleih ───────────────────────────────────────────────────
  werkzeugverleih: {
    meta: {
      title: 'Werkzeugverleih – Verlegewerkzeug ausleihen | Bodenjäger Hückelhoven',
      description: 'Leih dir ausgewählte Verlegewerkzeuge und Geräte für die fachgerechte Verlegung deines neuen Bodens – mit Einweisung direkt im Fachmarkt Hückelhoven.',
    },
    hero: {
      headline: 'Das richtige Werkzeug für deinen Boden.',
      untertitel: 'Leih dir ausgewählte Werkzeuge und Geräte für die fachgerechte Verlegung deines neuen Bodens.',
      imageAlt: 'Sauber angeordnetes Verlegewerkzeug und eine professionelle Bodenschneidemaschine',
      ctas: [cKontakt('Werkzeug anfragen', 'primary'), cKontakt('Im Fachmarkt beraten lassen')],
    },
    einleitung: {
      headline: 'Professionelles Werkzeug, ohne alles selbst zu kaufen',
      text: 'Mit dem passenden Werkzeug gelingt die Verlegung sauberer, schneller und einfacher. Deshalb stellen wir unseren Kunden ausgewählte Verlegewerkzeuge und Geräte leihweise zur Verfügung.',
    },
    blocks: [
      {
        kind: 'liste',
        headline: 'Mögliche Werkzeuge',
        items: ['Boden- oder Laminatschneider', 'Zugeisen und Schlagklotz', 'Abstandskeile', 'Andrück- und Verlegewerkzeuge', 'Weitere Geräte auf Anfrage'],
      },
      {
        kind: 'vorteile',
        items: [
          { icon: 'Wrench', titel: 'Passendes Werkzeug zum Boden' },
          { icon: 'PiggyBank', titel: 'Keine unnötige Neuanschaffung' },
          { icon: 'GraduationCap', titel: 'Einweisung durch unsere Mitarbeiter' },
          { icon: 'Store', titel: 'Verfügbarkeit direkt im Fachmarkt prüfen' },
        ],
      },
      {
        kind: 'infobox',
        text: 'Die verfügbaren Werkzeuge, Leihdauer, Kaution und mögliche Gebühren können je nach Gerät variieren. Bitte reserviere benötigte Geräte frühzeitig.',
      },
    ],
    abschluss: {
      headline: 'Welches Werkzeug benötigst du?',
      text: 'Sag uns, welchen Boden du verlegen möchtest. Wir prüfen, welches Werkzeug dafür geeignet und verfügbar ist.',
      ctas: [cKontakt('Werkzeug reservieren', 'primary'), cKontakt('Kontakt aufnehmen')],
    },
  },
}

export const SERVICE_UNTERSEITEN_SLUGS = Object.keys(SERVICE_UNTERSEITEN)
