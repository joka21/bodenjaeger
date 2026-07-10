/**
 * Shared types für die Fachmarkt-Landingpage (Hückelhoven).
 *
 * FilialBanner beschreibt einen redaktionell pflegbaren Angebots-Banner
 * (Sektion 6 "Filialangebote"). Der Typ ist die Vertragsbasis zwischen
 * Frontend (Mock-Daten in Phase 1) und dem späteren WordPress-CPT
 * `filial_banner` (Phase 2, separater PHP-Task). Feldnamen sind bewusst
 * so gewählt, dass sie 1:1 auf ACF/REST-Felder abbildbar sind.
 */
export interface FilialBanner {
  id: number | string
  titel: string
  untertitel?: string
  /** Voll-URL oder /-relativer Pfad zum Bild */
  bild: string
  bildAlt?: string
  ctaLabel?: string
  ctaUrl?: string
  /** Nur aktive Banner werden gerendert */
  aktiv: boolean
  /** Aufsteigend sortiert */
  reihenfolge: number
  /** ISO-Datum; ist es überschritten, gilt der Banner als abgelaufen */
  gueltigBis?: string | null
}
