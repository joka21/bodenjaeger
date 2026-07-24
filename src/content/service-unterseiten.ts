/**
 * Inhalte der 6 statischen Fachmarkt-Service-Unterseiten
 * (/fachmarkt-hueckelhoven/service/<slug>).
 *
 * Wortlaut 1:1 aus docs/service-unterseiten-briefing.md. Ansprache „du".
 * Block-basiert: die statische [slug]-Route rendert Hero → Einleitung →
 * Blocks (Reihenfolge = Briefing) → Abschluss-CTA + Sticky-Leiste.
 */
import type { Cta } from '@/types/cta'
import { MAPS_ROUTE_URL, STANDORT } from '@/content/fachmarkt'

const KONTAKT = '/kontakt'
const cRoute = (label: string, variant: Cta['variant'] = 'primary'): Cta => ({ label, href: MAPS_ROUTE_URL, variant, external: true })
const cKontakt = (label: string, variant: Cta['variant'] = 'secondary'): Cta => ({ label, href: KONTAKT, variant })

export type SubBlock =
  | { kind: 'vorteile'; headline?: string; items: { icon: string; titel: string; text?: string }[]; hinweis?: string }
  | { kind: 'ablauf'; headline: string; steps: (string | { titel: string; text?: string })[]; hinweis?: string }
  | { kind: 'karten'; headline?: string; einleitung?: string; cards: { titel: string; text?: string; punkteLabel?: string; punkte?: string[]; hervorgehoben?: boolean; badge?: string }[]; kleingedruckt?: string }
  | { kind: 'liste'; headline: string; items: string[] }
  | { kind: 'infobox'; text: string; zusatz?: string }
  | { kind: 'faq'; headline: string; items: { frage: string; antwort: string }[] }

export interface ServiceSubpage {
  meta: { title: string; description: string }
  hero: { headline: string; untertitel: string; imageAlt: string; ctas: Cta[] }
  einleitung: { headline: string; text: string }
  blocks: SubBlock[]
  abschluss: { headline: string; text: string; ctas: Cta[]; telefon?: { anzeige: string; link: string } }
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
        einleitung: 'Bei Bodenjäger bekommst du je nach Bodenart das passende Zubehör kostenlos dazu – praktisch, abgestimmt und direkt für dein Projekt mitgedacht.',
        cards: [
          {
            titel: 'Laminat, Klick-Vinyl & Fertigparkett',
            text: 'Bei jedem Laminat, Klick-Vinyl und Fertigparkett bekommst du die passenden Sockelleisten und die passende Dämmung kostenlos dazu. So hast du direkt ein vollständiges Boden-Set für dein Projekt.',
            punkteLabel: 'Kostenlos dabei:',
            punkte: ['Sockelleisten', 'passende Dämmung'],
          },
          {
            titel: 'Teppichboden & CV-Boden',
            text: 'Bei jedem Teppichboden und CV-Boden bekommst du passende Sockelleisten kostenlos dazu. Damit ist der saubere Wandabschluss direkt mit eingeplant.',
            punkteLabel: 'Kostenlos dabei:',
            punkte: ['Sockelleisten'],
          },
          {
            titel: 'Klebe-Vinyl Sparpaket',
            text: 'Beim Kauf von Klebe-Vinyl erhältst du unser Sparpaket mit dem wichtigsten Zubehör für die Verlegung kostenlos dazu: Sockelleisten, Grundierung, Spachtelmasse und Bodenkleber.',
            punkteLabel: 'Kostenlos dabei:',
            punkte: ['Sockelleisten', 'Grundierung', 'Spachtelmasse', 'Bodenkleber'],
            hervorgehoben: true,
            badge: 'Sparpaket',
          },
        ],
        kleingedruckt: 'Hinweis: Die kostenlosen Zugaben beziehen sich auf die jeweils passende Standardausführung. Wenn du eine andere oder höherwertige Sockelleiste, Dämmung oder Zubehörvariante wünschst, berücksichtigen wir den Wert der kostenlosen Zugabe im Angebot.',
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
      description: 'Sichere dir deinen Wunschboden frühzeitig: Wir lagern deine gekaufte Ware auf Wunsch bis zu zwölf Monate ein und du holst sie ab, wenn deine Räume bereit sind.',
    },
    hero: {
      headline: 'Jetzt Boden sichern. Später verlegen.',
      untertitel: 'Wir lagern deine bereits gekaufte Ware auf Wunsch bis zu zwölf Monate für dich ein.',
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
          { icon: 'Warehouse', titel: 'Einlagerung bis zu zwölf Monate' },
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
      title: 'Werkzeugverleih für Bodenverlegung | Bodenjäger Hückelhoven',
      description: 'Werkzeug für dein Bodenprojekt: Bei Bodenjäger kannst du aktuell kostenlos einen Laminat- und Vinylschneider ausleihen – ideal für Laminat und Klick-Vinyl.',
    },
    hero: {
      headline: 'Werkzeugverleih für dein Bodenprojekt',
      untertitel: 'Du möchtest deinen Boden selbst verlegen? Bei Bodenjäger bekommst du praktische Unterstützung im Fachmarkt – aktuell mit unserem kostenlosen Laminat- und Vinylschneider für dein DIY-Projekt.',
      imageAlt: 'Mitarbeiter im Fachmarkt mit dem Laminat- und Vinylschneider',
      ctas: [cKontakt('Werkzeug anfragen', 'primary'), cKontakt('Im Fachmarkt beraten lassen')],
    },
    einleitung: {
      headline: 'Aktuell kostenlos ausleihbar: Laminat- & Vinylschneider',
      text: 'Für eine saubere Verlegung brauchst du nicht nur den richtigen Boden, sondern auch ein passendes Schneidgerät. Deshalb kannst du bei uns aktuell einen Laminat- und Vinylschneider kostenlos ausleihen. So musst du dir für dein Projekt kein eigenes Gerät kaufen und kannst deine Dielen sauber zuschneiden.',
    },
    blocks: [
      {
        kind: 'karten',
        headline: 'Für welche Böden ist das Werkzeug geeignet?',
        cards: [
          { titel: 'Laminat', text: 'Der Schneider eignet sich für viele Laminatböden und hilft dir, die Dielen sauber und kontrolliert zu kürzen.' },
          { titel: 'Klick-Vinyl', text: 'Auch viele Klick-Vinylböden können mit dem passenden Schneider sauber zugeschnitten werden. Wir prüfen gerne, ob dein Boden dafür geeignet ist.' },
          { titel: 'Klebe-Vinyl', text: 'Bei Klebe-Vinyl beraten wir dich individuell, welches Werkzeug und welche Arbeitsschritte für dein Projekt sinnvoll sind.' },
        ],
        kleingedruckt: 'Ob der Schneider für deinen ausgewählten Boden geeignet ist, prüfen wir gerne direkt im Fachmarkt.',
      },
      {
        kind: 'vorteile',
        headline: 'Deine Vorteile',
        items: [
          { icon: 'BadgePercent', titel: 'Kostenlos ausleihen', text: 'Du kannst den Laminat- und Vinylschneider kostenlos bei uns ausleihen.' },
          { icon: 'PiggyBank', titel: 'Keine eigene Anschaffung', text: 'Du musst dir für ein einzelnes Bodenprojekt kein eigenes Schneidgerät kaufen.' },
          { icon: 'Wrench', titel: 'Einfacher selbst verlegen', text: 'Mit dem passenden Werkzeug kannst du viele Zuschnitte sauberer und kontrollierter ausführen.' },
          { icon: 'GraduationCap', titel: 'Kurze Erklärung im Fachmarkt', text: 'Wir zeigen dir kurz, worauf du bei der Nutzung achten solltest.' },
        ],
      },
      {
        kind: 'ablauf',
        headline: 'So einfach funktioniert’s',
        steps: [
          { titel: 'Boden auswählen', text: 'Du suchst dir deinen Boden online oder im Fachmarkt aus.' },
          { titel: 'Werkzeug anfragen', text: 'Wir prüfen, ob der Laminat- und Vinylschneider zum gewünschten Zeitraum verfügbar ist.' },
          { titel: 'Abholen & erklären lassen', text: 'Du holst das Werkzeug im Fachmarkt ab und bekommst eine kurze Erklärung zur Nutzung.' },
          { titel: 'Zuschneiden & zurückbringen', text: 'Du nutzt den Schneider für dein Projekt und bringst ihn anschließend wieder zurück.' },
        ],
      },
      {
        kind: 'infobox',
        text: 'Der kostenlose Verleih gilt aktuell für unseren Laminat- und Vinylschneider nach Verfügbarkeit. Bitte frage das Werkzeug frühzeitig an, damit wir es für dein Projekt reservieren können. Leihdauer und Rückgabe stimmen wir direkt im Fachmarkt mit dir ab.',
        zusatz: 'Der Werkzeugverleih ist vor allem als Unterstützung für Kunden gedacht, die ihren Boden bei Bodenjäger kaufen oder sich im Fachmarkt beraten lassen.',
      },
      {
        kind: 'faq',
        headline: 'Häufige Fragen zum Werkzeugverleih',
        items: [
          { frage: 'Welches Werkzeug kann ich aktuell bei euch ausleihen?', antwort: 'Aktuell verleihen wir kostenlos einen Laminat- und Vinylschneider.' },
          { frage: 'Ist der Werkzeugverleih wirklich kostenlos?', antwort: 'Ja, der Laminat- und Vinylschneider kann kostenlos ausgeliehen werden. Die Verfügbarkeit und Leihdauer stimmen wir direkt im Fachmarkt mit dir ab.' },
          { frage: 'Für welche Böden eignet sich der Schneider?', antwort: 'Der Schneider eignet sich besonders für viele Laminat- und Klick-Vinylböden. Bei Klebe-Vinyl beraten wir dich individuell, welche Werkzeuge und Arbeitsschritte sinnvoll sind.' },
          { frage: 'Muss ich das Werkzeug vorher reservieren?', antwort: 'Ja, bitte frage das Werkzeug möglichst frühzeitig an, damit wir die Verfügbarkeit prüfen können.' },
          { frage: 'Zeigt ihr mir, wie ich das Werkzeug benutze?', antwort: 'Ja, wir geben dir im Fachmarkt eine kurze Erklärung und praktische Tipps zur Nutzung.' },
        ],
      },
    ],
    abschluss: {
      headline: 'Du möchtest selbst verlegen?',
      text: 'Frag unser Werkzeug einfach bei uns an. Wir prüfen die Verfügbarkeit und erklären dir kurz, worauf du bei der Nutzung achten solltest.',
      ctas: [cKontakt('Werkzeug anfragen', 'primary'), cKontakt('Im Fachmarkt beraten lassen')],
      telefon: { anzeige: STANDORT.telefonAnzeige, link: STANDORT.telefonLink },
    },
  },
}

export const SERVICE_UNTERSEITEN_SLUGS = Object.keys(SERVICE_UNTERSEITEN)
