/**
 * Servicegebiets-Prüfung für den Verlegeservice.
 *
 * SERVERSEITIG — der Datensatz (437 KB) darf nicht in den Browser gelangen und
 * dem Client wird ohnehin nicht getraut: Der Area-Status wird immer hier neu
 * bestimmt, egal was das Formular mitschickt.
 *
 * Datenquelle: src/data/plz-geo.json (GeoNames, CC BY 4.0), erzeugt von
 * scripts/build-plz-dataset.mjs.
 */
import { STANDORT } from '@/content/fachmarkt'
import plzGeo from '@/data/plz-geo.json'

/** Reguläres Verlegegebiet: Luftlinie um den Fachmarkt Hückelhoven. */
export const SERVICE_RADIUS_KM = 50

export type AreaStatus = 'in_area' | 'out_of_area'

export interface GebietsErgebnis {
  plz: string
  ort: string
  distanceKm: number
  areaStatus: AreaStatus
}

// TypeScript leitet aus dem JSON `(string | number)[]` ab und kennt die feste
// Tupel-Länge nicht — deshalb einmal bewusst über `unknown` eng ziehen.
const DATEN = (plzGeo as unknown as { plz: Record<string, [string, number, number]> }).plz

/** Deutsche PLZ: genau fünf Ziffern. */
export function istPlzFormat(plz: string): boolean {
  return /^\d{5}$/.test(plz.trim())
}

/** Luftlinie in Kilometern (Haversine). */
function haversineKm(
  aLat: number,
  aLon: number,
  bLat: number,
  bLon: number,
): number {
  const ERDRADIUS_KM = 6371
  const rad = (g: number) => (g * Math.PI) / 180
  const dLat = rad(bLat - aLat)
  const dLon = rad(bLon - aLon)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(aLat)) * Math.cos(rad(bLat)) * Math.sin(dLon / 2) ** 2
  return 2 * ERDRADIUS_KM * Math.asin(Math.sqrt(h))
}

/**
 * Schlägt die PLZ nach und bestimmt Entfernung und Area-Status.
 * `null` = PLZ nicht im Datensatz (dann kann der Standort nicht geprüft werden).
 */
export function pruefeServicegebiet(plzEingabe: string): GebietsErgebnis | null {
  const plz = plzEingabe.trim()
  if (!istPlzFormat(plz)) return null

  const eintrag = DATEN[plz]
  if (!eintrag) return null

  const [ort, lat, lon] = eintrag
  const distanceKm = haversineKm(STANDORT.geo.lat, STANDORT.geo.lng, lat, lon)

  return {
    plz,
    ort,
    // Eine Dezimalstelle genügt und passt zur Anzeige "ca. 24,6 km".
    distanceKm: Math.round(distanceKm * 10) / 10,
    areaStatus: distanceKm <= SERVICE_RADIUS_KM ? 'in_area' : 'out_of_area',
  }
}

/** Nur der Ort zur PLZ — für die automatische Ergänzung in Schritt 1. */
export function ortZurPlz(plz: string): string | null {
  const eintrag = DATEN[plz.trim()]
  return eintrag ? eintrag[0] : null
}

/** "24,6 km" in deutscher Schreibweise. */
export function formatEntfernung(distanceKm: number): string {
  return `${distanceKm.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km`
}
