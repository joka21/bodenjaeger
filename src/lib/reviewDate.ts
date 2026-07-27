/**
 * Relative Datumsangabe für Rezensionen.
 *
 * Hintergrund: Google liefert nur relative Labels ("vor 2 Monaten"). Als String
 * gespeichert veralten die still mit — der Datensatz stand einmal auf
 * "vor 2 Monaten" für eine Rezension, die inzwischen ein halbes Jahr alt war.
 * Deshalb wird in `google-reviews.json` der Monat absolut als `dateISO`
 * ("YYYY-MM") gehalten und das Label hier bei jedem Render neu gebildet.
 */

/** Monatsgenaue Differenz in Monaten (positiv = Vergangenheit). */
function monateSeit(dateISO: string, jetzt: Date): number | null {
  const treffer = /^(\d{4})-(\d{2})$/.exec(dateISO)
  if (!treffer) return null
  const jahr = Number(treffer[1])
  const monat = Number(treffer[2])
  return (jetzt.getFullYear() - jahr) * 12 + (jetzt.getMonth() + 1 - monat)
}

/**
 * Bildet "vor 3 Monaten" / "vor einem Jahr" aus einem `YYYY-MM`-Wert.
 * `fallback` (das ursprüngliche Google-Label) greift, wenn `dateISO` fehlt
 * oder nicht parsebar ist.
 */
export function relativesDatum(
  dateISO: string | undefined,
  fallback = '',
  jetzt: Date = new Date(),
): string {
  if (!dateISO) return fallback

  const monate = monateSeit(dateISO, jetzt)
  if (monate === null || monate < 0) return fallback

  if (monate < 1) return 'diesen Monat'
  if (monate === 1) return 'vor einem Monat'
  if (monate < 12) return `vor ${monate} Monaten`

  const jahre = Math.floor(monate / 12)
  return jahre === 1 ? 'vor einem Jahr' : `vor ${jahre} Jahren`
}
