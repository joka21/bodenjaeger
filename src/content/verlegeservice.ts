/**
 * Inhalte der Unterseite Verlegeservice
 * (/fachmarkt-hueckelhoven/service/verlegeservice).
 *
 * Wortlaut 1:1 aus docs/verlegeservice-briefing.md. Nicht umformulieren.
 * Ansprache durchgängig "du".
 */
import type { Cta } from '@/types/cta'
import { SERVICE_LINKS } from '@/content/service'
import { MAPS_ROUTE_URL, STANDORT } from '@/content/fachmarkt'

// ── Feature-Flag ──────────────────────────────────────────────────────────────
// Das Anfrageformular ist erst funktionsfähig, NACHDEM der WP-Endpoint
// /wp-json/jaeger/v1/verlegeservice deployed ist (siehe WP_VERLEGESERVICE_ENDPOINT.md).
// Bis dahin: Absenden deaktiviert, Hinweis + Telefon als Fallback.
// TODO(deploy): nach WP-Deploy auf true setzen.
export const VERLEGE_FORM_ENABLED = false

// Ziel aller "anfragen"-CTAs: eigene Anfrage-Landingpage mit Vorqualifizierung.
const ANFRAGE_ANKER = '/fachmarkt-hueckelhoven/service/verlegeservice-anfrage'

// ── Meta / SEO ────────────────────────────────────────────────────────────────
export const VERLEGE_META = {
  title: 'Verlegeservice Hückelhoven | Boden fachgerecht verlegen lassen',
  description:
    'Boden verlegen lassen mit Bodenjäger: Beratung, Aufmaß, Angebot und professionelle Verlegung im Umkreis von ca. 50 km um Hückelhoven. Jetzt unverbindlich anfragen.',
}

// ── 1. Hero ───────────────────────────────────────────────────────────────────
export const VERLEGE_HERO = {
  headline: 'Professioneller Verlegeservice für deinen neuen Boden',
  subline:
    'Von der Beratung über das Aufmaß bis zur fachgerechten Verlegung: Unser erfahrenes Team begleitet dich Schritt für Schritt zu deinem neuen Boden.',
  trustZeile: [
    'Für Hückelhoven und Umgebung',
    'Aufmaß vor Ort',
    'Saubere Ausführung',
    'Persönliche Beratung',
  ],
  badges: ['Aufmaß vor Ort', 'Erfahrene Bodenleger', 'Verlegung im Umkreis von ca. 50 km'],
  image: '/verlegeservice/hero-verlegung.jpg', // Platzhalter — siehe BILDER-BEDARF.md
  imageAlt: 'Bodenleger bei der Verlegung eines Bodens',
  ctaPrimaer: { label: 'Verlegeservice anfragen', href: ANFRAGE_ANKER, variant: 'primary', external: false } as Cta,
  ctaSekundaer: { label: 'Beratung im Fachmarkt vereinbaren', href: SERVICE_LINKS.kontakt, variant: 'secondary' } as Cta,
  telefonText: 'Oder direkt anrufen: 02433 938884',
  telefonLink: STANDORT.telefonLink,
}

// ── 2. Problem-Nutzen ───────────────────────────────────────────────────────────
export const VERLEGE_PROBLEM = {
  headline: 'Du suchst einen neuen Boden, willst aber keinen Stress mit der Verlegung?',
  text: 'Ein Boden sieht nur dann richtig gut aus, wenn Untergrund, Material, Zubehör und Verlegung zusammenpassen. Genau dabei unterstützen wir dich: Wir beraten dich bei der Auswahl, prüfen die Gegebenheiten vor Ort und verlegen deinen neuen Boden fachgerecht.',
  karten: [
    { titel: 'Saubere Planung', text: 'Wir besprechen dein Projekt, prüfen die Räume und erstellen ein passendes Angebot.' },
    { titel: 'Passender Boden', text: 'Ob Vinyl, Laminat, Parkett, Teppich oder PVC/CV – wir helfen dir bei der richtigen Auswahl.' },
    { titel: 'Fachgerechte Verlegung', text: 'Unsere erfahrenen Bodenleger setzen dein Projekt sauber und zuverlässig um.' },
    { titel: 'Alles aus einer Hand', text: 'Boden, Zubehör, Aufmaß, Verlegung und Beratung kommen bei uns aus einem Ablauf.' },
  ],
}

// ── 3. Bodenarten ───────────────────────────────────────────────────────────────
// icon = lucide-react Icon-Name (Mapping in der Komponente)
export const VERLEGE_BODENARTEN = {
  headline: 'Diese Böden verlegen wir für dich',
  items: [
    { titel: 'Klick-Vinyl', icon: 'Layers' },
    { titel: 'Klebe-Vinyl', icon: 'Layers' },
    { titel: 'Laminat', icon: 'Grid3x3' },
    { titel: 'Parkett', icon: 'TreePine' },
    { titel: 'Teppichboden', icon: 'Rows3' },
    { titel: 'PVC / CV', icon: 'Square' },
    { titel: 'Treppenrenovierung', icon: 'Footprints' },
  ],
  zusatztext:
    'Ob Neubau, Renovierung, einzelne Räume oder komplette Etagen – wir prüfen gemeinsam, welche Lösung zu deinem Projekt passt.',
  cta: { label: 'Projekt unverbindlich anfragen', href: ANFRAGE_ANKER, variant: 'primary', external: false } as Cta,
}

// ── 4. Ablauf (7 Schritte) ──────────────────────────────────────────────────────
export const VERLEGE_ABLAUF = {
  headline: 'So läuft dein Verlegeprojekt ab',
  image: '/verlegeservice/ablauf-hintergrund.jpg', // Platzhalter — dunkler Hintergrund
  imageAlt: 'Verlegung eines Bodens im Detail',
  schritte: [
    { nr: 1, titel: 'Kontakt', text: 'Du meldest dich telefonisch, per E-Mail oder über das Anfrageformular.' },
    { nr: 2, titel: 'Beratung', text: 'Wir besprechen deine Wünsche, Räume, Bodenart und den groben Projektumfang.' },
    { nr: 3, titel: 'Aufmaß vor Ort', text: 'Wir kommen zu dir, messen die Fläche aus und prüfen die Gegebenheiten.' },
    { nr: 4, titel: 'Angebot', text: 'Du erhältst ein transparentes Angebot mit Boden, Zubehör und Verlegeleistung.' },
    { nr: 5, titel: 'Terminplanung', text: 'Wir stimmen den passenden Verlegetermin mit dir ab.' },
    { nr: 6, titel: 'Verlegung', text: 'Unser Team bereitet die Fläche vor und verlegt deinen neuen Boden fachgerecht.' },
    { nr: 7, titel: 'Abnahme', text: 'Wir prüfen gemeinsam das Ergebnis und übergeben dir deinen neuen Boden.' },
  ],
  cta: { label: 'Jetzt Aufmaß / Verlegung anfragen', href: ANFRAGE_ANKER, variant: 'primary', external: false } as Cta,
}

// ── 5. Aufmaß-Checkliste ─────────────────────────────────────────────────────────
export const VERLEGE_AUFMASS = {
  headline: 'Worauf wir beim Aufmaß achten',
  punkte: [
    'Raumgröße und Zuschnitt',
    'Untergrund und Ebenheit',
    'Altboden und mögliche Entfernung',
    'Sockelleisten und Übergänge',
    'Türen und Profile',
    'Feuchtigkeit / Nutzung / Fußbodenheizung',
    'Treppen oder Sonderflächen',
    'Liefer- und Zugangssituation',
  ],
  kurztext:
    'So können wir besser einschätzen, welche Vorarbeiten nötig sind und welches Material wirklich passt.',
}

// ── 6. Mögliche Leistungen ───────────────────────────────────────────────────────
export const VERLEGE_LEISTUNGEN = {
  headline: 'Diese Leistungen können Teil deines Angebots sein',
  items: [
    'Aufmaß vor Ort',
    'Beratung zur passenden Bodenart',
    'Lieferung des Bodens',
    'Altbodenaufnahme und Entsorgung',
    'Untergrundvorbereitung',
    'Boden aufbereiten',
    'Verlegung des Bodenbelags',
    'Montage von Sockelleisten',
    'Übergangsprofile und Abschlussarbeiten',
    'Treppenverlegung',
    'Endkontrolle / Abnahme',
  ],
  hinweis:
    'Welche Leistungen erforderlich sind, hängt von deinem Projekt und dem Untergrund ab. Deshalb erstellen wir das Angebot nach Beratung und Aufmaß.',
}

// ── 7. Referenzen / Vorher-Nachher (Platzhalter) ─────────────────────────────────
export const VERLEGE_REFERENZEN = {
  headline: 'So kann dein neuer Boden aussehen',
  karten: [
    { titel: 'Klick-Vinyl im Wohnzimmer' },
    { titel: 'Klebe-Vinyl in Küche und Flur' },
    { titel: 'Parkett im Wohnbereich' },
    { titel: 'Treppenrenovierung mit Bodenbelag' },
  ],
  platzhalterLabel: 'Platzhalter — Bild folgt',
  cta: { label: 'Ähnliches Projekt anfragen', href: ANFRAGE_ANKER, variant: 'primary', external: false } as Cta,
}

// ── 8. Vertrauensbereich (dunkel) ────────────────────────────────────────────────
export const VERLEGE_VERTRAUEN = {
  headline: 'Warum Bodenjäger für deine Verlegung?',
  vorteile: [
    'Über 40 Jahre Erfahrung im Bodenhandwerk',
    'Eigener Fachmarkt in Hückelhoven',
    'Persönliche Beratung statt anonymer Online-Abwicklung',
    'Boden, Zubehör und Verlegung aus einer Hand',
    'Erfahrene Bodenleger',
    'Faire und transparente Angebote',
    'Regionale Betreuung im Umkreis von ca. 50 km',
  ],
}

// ── 9. Für wen ideal? ────────────────────────────────────────────────────────────
export const VERLEGE_PASST = {
  headline: 'Der Verlegeservice passt zu dir, wenn …',
  punkte: [
    'du den Boden nicht selbst verlegen möchtest',
    'du ein sauberes Ergebnis erwartest',
    'du unsicher beim Untergrund bist',
    'du größere Flächen verlegen lassen möchtest',
    'du Altboden, Sockelleisten oder Übergänge berücksichtigen musst',
    'du renovierst, baust oder mehrere Räume fertigstellen möchtest',
    'du Beratung, Material und Ausführung aus einer Hand willst',
  ],
}

// ── 10. Einwandbehandlung (Karten, kein Accordion) ───────────────────────────────
export const VERLEGE_EINWAND = {
  headline: 'Häufige Unsicherheiten – einfach erklärt',
  karten: [
    {
      frage: 'Kann ich den Boden auch selbst kaufen und nur verlegen lassen?',
      antwort:
        'Ja. Wir haben eine große Auswahl an Böden direkt im Fachmarkt vorrätig – viele davon kannst du sofort mitnehmen und selbst verlegen. Auf Wunsch zeigen wir dir im Fachmarkt, worauf du achten musst, und geben dir praktische Tipps zu Verlegung, Zubehör, Dämmung und Werkzeug.',
    },
    {
      frage: 'Muss der Untergrund schon fertig sein?',
      antwort:
        'Das hängt vom Bodenbelag ab. Jeder Oberboden stellt andere Anforderungen an den Untergrund. Klick-Vinyl, Klebe-Vinyl, Parkett, Laminat, Teppich oder PVC/CV benötigen jeweils eine passende Vorbereitung. Wir prüfen den Untergrund gerne und übernehmen bei Bedarf auch die notwendigen Vorarbeiten.',
    },
    {
      frage: 'Was kostet die Verlegung?',
      antwort:
        'Die Kosten hängen von Bodenart, Fläche, Untergrund und möglichen Zusatzarbeiten ab. Deshalb erstellen wir kein pauschales Lockangebot, sondern prüfen dein Projekt sauber und erstellen dir nach Beratung und Aufmaß ein transparentes Angebot.',
    },
    {
      frage: 'Wie schnell kann verlegt werden?',
      antwort:
        'Das hängt von Materialverfügbarkeit, Projektumfang und unserer aktuellen Auslastung ab. Viele Böden sind direkt verfügbar. Den passenden Verlegetermin stimmen wir persönlich mit dir ab.',
    },
  ],
}

// ── 11. Anfrageformular ──────────────────────────────────────────────────────────
export const VERLEGE_FORM = {
  headline: 'Verlegeservice unverbindlich anfragen',
  intro:
    'Beschreibe uns kurz dein Projekt. Je genauer deine Angaben sind, desto besser können wir dich beraten.',
  // Auswahl-Optionen (Wortlaut aus Briefing)
  bodenartOptions: ['Klick-Vinyl', 'Klebe-Vinyl', 'Laminat', 'Parkett', 'Teppichboden', 'PVC / CV', 'Treppenlösungen'],
  projektartOptions: ['Neubau', 'Renovierung', 'einzelner Raum', 'mehrere Räume', 'Treppe'],
  raeumeOptions: ['Wohnzimmer', 'Küche', 'Flur', 'Schlafzimmer', 'Bad', 'Gewerbe', 'Treppe'],
  jaNeinOptions: ['Ja', 'Nein'],
  labels: {
    // Pflicht (9)
    name: 'Name',
    telefon: 'Telefonnummer',
    email: 'E-Mail',
    plzOrt: 'PLZ / Ort',
    bodenart: 'Gewünschte Bodenart',
    flaeche: 'Geschätzte Fläche in m²',
    projektart: 'Projektart',
    wunschtermin: 'Wunschtermin oder Zeitraum',
    nachricht: 'Nachricht',
    // Optional (Briefing: 7, listet 8 — alle übernommen)
    adresseAufmass: 'Adresse für Aufmaß',
    raeume: 'Räume',
    bodenVorhanden: 'Ist bereits ein Boden vorhanden?',
    altbodenEntfernen: 'Soll Altboden entfernt werden?',
    untergrundBekannt: 'Ist der Untergrund bekannt?',
    fotos: 'Fotos hochladen',
    wunschbodenAusgesucht: 'Wunschboden bereits ausgesucht?',
    beratungImFachmarkt: 'Beratung im Fachmarkt gewünscht?',
  },
  marketingLabel: 'Ich möchte eine unverbindliche Beratung zum Verlegeservice erhalten.',
  // Zusätzliche DSGVO-Pflicht-Einwilligung (technisch ergänzt, nicht aus Briefing)
  datenschutzLabelPre: 'Ich habe die ',
  datenschutzLinkText: 'Datenschutzerklärung',
  datenschutzLinkHref: '/datenschutz',
  datenschutzLabelPost: ' gelesen und stimme der Verarbeitung meiner Angaben zur Bearbeitung meiner Anfrage zu.',
  submitLabel: 'Verlegeservice-Anfrage absenden',
  successMessage:
    'Vielen Dank für deine Anfrage. Wir melden uns schnellstmöglich bei dir, um dein Projekt zu besprechen.',
  // Fehlerfall
  errorMessage: 'Es ist ein Fehler aufgetreten. Bitte versuche es erneut oder ruf uns an: 02433 938884.',
  // Hinweis wenn Formular (noch) deaktiviert ist
  disabledHinweis:
    'Das Anfrageformular wird in Kürze freigeschaltet. Ruf uns solange gern direkt an: 02433 938884.',
}

// Upload-Limits (Client- UND serverseitig geprüft)
export const VERLEGE_UPLOAD = {
  maxFiles: 5,
  maxFileBytes: 5 * 1024 * 1024, // 5 MB je Datei
  maxTotalBytes: 15 * 1024 * 1024, // 15 MB gesamt
  acceptMime: ['image/jpeg', 'image/png', 'image/heic', 'image/webp'],
  acceptAttr: '.jpg,.jpeg,.png,.heic,.webp,image/jpeg,image/png,image/heic,image/webp',
} as const

// ── 12. Kontakt-Alternative ──────────────────────────────────────────────────────
export const VERLEGE_KONTAKT = {
  headline: 'Lieber direkt sprechen?',
  text: 'Ruf uns an oder komm im Fachmarkt Hückelhoven vorbei. Wir helfen dir gerne bei der Einschätzung deines Projekts.',
  telefonAnzeige: '02433 938884',
  telefonLink: STANDORT.telefonLink,
  oeffnungszeiten: 'Mo.–Fr. 9:00–18:30 Uhr · Sa. 9:00–14:00 Uhr',
  adresse: 'Bodenjäger Fachmarkt, Neckarstraße 9, 41836 Hückelhoven',
  cta: { label: 'Route zum Fachmarkt', href: MAPS_ROUTE_URL, variant: 'secondary', external: true } as Cta,
}

// ── 13. FAQ (Antworten liegen vor → JSON-LD aktiv) ───────────────────────────────
export const VERLEGE_FAQ = {
  headline: 'Häufige Fragen zum Verlegeservice',
  items: [
    { frage: 'In welchem Umkreis bietet ihr den Verlegeservice an?', antwort: 'Unser Verlegeservice ist im Umkreis von ca. 50 km um Hückelhoven möglich.' },
    { frage: 'Welche Böden verlegt ihr?', antwort: 'Wir verlegen unter anderem Vinyl, Laminat, Parkett, Teppichboden, PVC/CV und je nach Projekt auch Treppenlösungen.' },
    { frage: 'Kommt ihr vorher zum Aufmaß?', antwort: 'Ja, bei Verlegeprojekten prüfen wir die Fläche und die Gegebenheiten vor Ort, damit wir ein passendes Angebot erstellen können.' },
    { frage: 'Muss der Untergrund vorbereitet sein?', antwort: 'Der Untergrund muss belegreif sein, sofern nichts anderes vereinbart wurde. Falls Vorarbeiten nötig sind, besprechen wir diese mit dir.' },
    { frage: 'Entfernt ihr auch alten Boden?', antwort: 'Ja, nach Absprache übernehmen wir auch die Aufnahme und Entsorgung des alten Bodens. Wir prüfen beim Aufmaß, welcher Belag aktuell vorhanden ist, wie der Untergrund aussieht und welche Vorarbeiten für den neuen Boden notwendig sind. Die Demontage, Entsorgung und passende Untergrundvorbereitung nehmen wir dann direkt mit ins Angebot auf.' },
    { frage: 'Sind Sockelleisten enthalten?', antwort: 'Ja, bei jedem Bodenkauf ist eine kostenlose Sockelleiste enthalten. Wenn du eine andere oder höherwertige Sockelleiste wünschst, ist das selbstverständlich möglich. Der Wert der kostenlosen Sockelleiste wird dann im Angebot berücksichtigt bzw. in Abzug gebracht, sodass du nur den entsprechenden Aufpreis zahlst.' },
    { frage: 'Was kostet der Verlegeservice?', antwort: 'Die Kosten hängen von Fläche, Bodenart, Untergrund und Zusatzarbeiten ab. Nach Beratung und Aufmaß erhältst du ein individuelles Angebot.' },
    { frage: 'Kann ich auch nur einzelne Räume verlegen lassen?', antwort: 'Ja, wir prüfen gemeinsam, ob dein Projekt zu unserem Verlegeservice passt.' },
  ],
}

// ── 14. Finaler CTA (dunkel) ─────────────────────────────────────────────────────
export const VERLEGE_FINAL = {
  headline: 'Bereit für deinen neuen Boden?',
  text: 'Schick uns deine Anfrage und wir prüfen gemeinsam, wie dein Bodenprojekt sauber und zuverlässig umgesetzt werden kann.',
  cta: { label: 'Jetzt Verlegeservice anfragen', href: ANFRAGE_ANKER, variant: 'primary', external: false } as Cta,
  ctaSekundaer: { label: 'Kostenlose Muster bestellen', href: SERVICE_LINKS.musterBestellen, variant: 'secondary' } as Cta,
}

// ── Anfrage-Landingpage (/…/verlegeservice-anfrage) ──────────────────────────────
// Eigener Funnel mit Vorqualifizierung. Unpassende Anfragen werden früh freundlich
// gestoppt (KEINE Erfassung). Qualifizierte Leads gehen an /api/verlegeservice-lead
// und landen dort als Trello-Karte in der Liste „Neuer Lead (Eingang)".

// Erlaubte PLZ-Präfixe (~50 km um Hückelhoven, 41836). WEICHE Warnung — kein harter
// Stopp. Liste bewusst großzügig; bei Bedarf verfeinern.
export const VERLEGE_ANFRAGE_PLZ_ERLAUBT = ['40', '41', '42', '46', '47', '50', '51', '52'] as const
// Fläche unter diesem Wert → nur Hinweis, KEIN Stopp.
export const VERLEGE_ANFRAGE_FLAECHE_MIN = 15

// Leistungsart bestimmt die Qualifizierung (Single Source, auch serverseitig geprüft).
export const VERLEGE_LEISTUNG_OPTIONEN = [
  { key: 'verlegen', label: 'Boden verlegen lassen', beschreibung: 'Wir verlegen deinen neuen Boden fachgerecht.', qualifiziert: true },
  { key: 'material', label: 'Nur Material kaufen', beschreibung: 'Ich möchte nur Boden/Zubehör kaufen – keine Verlegung.', qualifiziert: false },
  { key: 'selbst', label: 'Ich verlege selbst', beschreibung: 'Ich verlege in Eigenleistung und brauche keine Verlegung.', qualifiziert: false },
] as const

export type VerlegeLeistungKey = (typeof VERLEGE_LEISTUNG_OPTIONEN)[number]['key']

export const VERLEGE_ANFRAGE_META = {
  title: 'Verlegeservice anfragen | Bodenjäger Hückelhoven',
  description:
    'Verlegeservice unverbindlich anfragen: In wenigen Schritten prüfen wir dein Projekt und melden uns mit einem passenden Angebot. Für Hückelhoven und ca. 50 km Umkreis.',
}

export const VERLEGE_ANFRAGE = {
  hero: {
    headline: 'Verlegeservice anfragen',
    subline:
      'In wenigen Schritten prüfen wir dein Projekt. Passt es, meldet sich unser Team mit einem individuellen Angebot – unverbindlich.',
  },
  schritte: ['Standort', 'Leistung', 'Projekt', 'Kontakt'],
  navWeiter: 'Weiter',
  navZurueck: 'Zurück',

  // Schritt 1 — Standort
  standort: {
    frage: 'Wo soll verlegt werden?',
    hinweis: 'Unser Verlegeservice ist im Umkreis von ca. 50 km um Hückelhoven möglich.',
    plzLabel: 'PLZ',
    ortLabel: 'Ort',
    warnung:
      'Deine PLZ liegt möglicherweise außerhalb unseres üblichen Einsatzgebiets (ca. 50 km um Hückelhoven). Du kannst die Anfrage trotzdem senden – wir prüfen, ob es passt.',
  },

  // Schritt 2 — Leistungsart
  leistung: {
    frage: 'Was können wir für dich tun?',
    optionen: VERLEGE_LEISTUNG_OPTIONEN,
  },

  // Schritt 3 — Projekt
  projekt: {
    frage: 'Erzähl uns kurz von deinem Projekt',
    flaecheHinweis:
      'Für sehr kleine Flächen lohnt sich der Verlegeservice nicht immer – wir melden uns und besprechen die beste Lösung.',
  },

  // Schritt 4 — Kontakt
  kontakt: {
    frage: 'Wie erreichen wir dich?',
  },

  // Freundlicher Stopp bei disqualifizierten Anfragen (KEIN Trello-Lead)
  stopp: {
    material: {
      headline: 'Dafür bist du im Fachmarkt genau richtig',
      text: 'Du möchtest nur Material kaufen? Dann besuch uns im Fachmarkt Hückelhoven oder bestell dir kostenlose Muster. Für die reine Verlegung ist keine Anfrage nötig.',
    },
    selbst: {
      headline: 'Du verlegst selbst? Super!',
      text: 'Dann brauchst du unseren Verlegeservice nicht. Im Fachmarkt beraten wir dich gern zu Boden, Zubehör, Dämmung und Werkzeug – und du kannst kostenlose Muster bestellen.',
    },
  },
  alternativen: [
    { label: 'Kostenlose Muster bestellen', href: SERVICE_LINKS.musterBestellen, variant: 'primary', external: false },
    { label: 'Beratung im Fachmarkt', href: SERVICE_LINKS.kontakt, variant: 'secondary', external: false },
    { label: 'Zur Verlegeservice-Info', href: SERVICE_LINKS.verlegeservice, variant: 'outline', external: false },
  ] as Cta[],
  telefonHinweis: 'Oder ruf uns direkt an: 02433 938884',
  telefonLink: STANDORT.telefonLink,

  submitLabel: 'Anfrage absenden',
  sendingLabel: 'Wird gesendet …',
  successHeadline: 'Danke für deine Anfrage!',
  successText: 'Wir prüfen dein Projekt und melden uns schnellstmöglich bei dir.',
  errorText: 'Es ist ein Fehler aufgetreten. Bitte versuche es erneut oder ruf uns an: 02433 938884.',

  datenschutzPre: 'Ich habe die ',
  datenschutzLinkText: 'Datenschutzerklärung',
  datenschutzHref: '/datenschutz',
  datenschutzPost:
    ' gelesen und stimme der Verarbeitung meiner Angaben zur Bearbeitung meiner Anfrage zu.',
  marketingLabel: 'Ich möchte eine unverbindliche Beratung zum Verlegeservice erhalten.',
}
