/**
 * Baut src/data/plz-geo.json aus dem GeoNames-Postleitzahl-Export.
 *
 * Zweck: Der Verlegeservice prüft serverseitig, ob ein Projekt im 50-km-Gebiet
 * um Hückelhoven liegt, und ergänzt den Ort zur eingegebenen PLZ. Beides ohne
 * externe API — der Datensatz liegt im Repo.
 *
 * Quelle: https://download.geonames.org/export/zip/DE.zip
 * Lizenz: GeoNames-Postleitzahldaten stehen unter CC BY 4.0.
 *         Die Attribution steht in src/data/plz-geo.json unter "_lizenz".
 *
 * Neu bauen (Datei DE.txt muss entpackt vorliegen):
 *   node scripts/build-plz-dataset.mjs <pfad-zu-DE.txt>
 *
 * Ausgabeformat — bewusst als Array, das ist deutlich kompakter als Objekte:
 *   { "41836": ["Hückelhoven", 51.0555, 6.2266] }
 *                 Ort          lat      lon
 *
 * Koordinaten bleiben roh (statt vorberechneter Entfernungen), damit ein
 * korrigierter Standort oder ein anderer Radius keine Neugenerierung braucht.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const quelle = process.argv[2]
if (!quelle) {
  console.error('Aufruf: node scripts/build-plz-dataset.mjs <pfad-zu-DE.txt>')
  process.exit(1)
}

// GeoNames listet auch Großempfänger-PLZ, die auf eine einzelne Firma laufen
// (z. B. "Mercedes-Benz Versicherung AG"). Als Ortsname sind die unbrauchbar,
// deshalb bevorzugen wir echte Ortsnamen und nehmen Firmenzeilen nur, wenn es
// für die PLZ nichts anderes gibt.
const FIRMEN_MUSTER = /\b(GmbH|AG|KG|OHG|mbH|e\.\s?V|Co\.|SE|Stiftung|Verlag|Versand|Bank|Versicherung|Postfach)\b|&/i

const zeilen = readFileSync(quelle, 'utf8').split('\n')
const gruppen = new Map()

for (const zeile of zeilen) {
  if (!zeile.trim()) continue
  const f = zeile.split('\t')
  const plz = f[1]?.trim()
  const ort = f[2]?.trim()
  const lat = Number.parseFloat(f[9])
  const lon = Number.parseFloat(f[10])
  if (!plz || !ort || !Number.isFinite(lat) || !Number.isFinite(lon)) continue

  if (!gruppen.has(plz)) gruppen.set(plz, [])
  gruppen.get(plz).push({ ort, lat, lon, firma: FIRMEN_MUSTER.test(ort) })
}

const ergebnis = {}
let nurFirmen = 0

for (const [plz, alle] of gruppen) {
  // Echte Ortsnamen bevorzugen; sonst notgedrungen die Firmenzeilen.
  let auswahl = alle.filter((e) => !e.firma)
  if (auswahl.length === 0) {
    auswahl = alle
    nurFirmen++
  }

  // Mittelpunkt der ausgewählten Zeilen — bei mehreren Ortsteilen je PLZ
  // liegt der näher am tatsächlichen Zentrum als eine beliebige Einzelzeile.
  const lat = auswahl.reduce((s, e) => s + e.lat, 0) / auswahl.length
  const lon = auswahl.reduce((s, e) => s + e.lon, 0) / auswahl.length

  // Häufigsten Ortsnamen nehmen; bei Gleichstand den kürzesten (meist der
  // Hauptort, Ortsteile hängen Zusätze an).
  const zaehler = new Map()
  for (const e of auswahl) zaehler.set(e.ort, (zaehler.get(e.ort) ?? 0) + 1)
  const ort = [...zaehler.entries()].sort(
    (a, b) => b[1] - a[1] || a[0].length - b[0].length,
  )[0][0]

  ergebnis[plz] = [ort, Math.round(lat * 1e4) / 1e4, Math.round(lon * 1e4) / 1e4]
}

const ziel = 'src/data/plz-geo.json'
const ausgabe = {
  _lizenz:
    'Postleitzahldaten: GeoNames (https://www.geonames.org), lizenziert unter CC BY 4.0. Erzeugt mit scripts/build-plz-dataset.mjs.',
  _format: '"PLZ": [Ort, Breitengrad, Längengrad]',
  plz: ergebnis,
}

writeFileSync(ziel, JSON.stringify(ausgabe), 'utf8')

const anzahl = Object.keys(ergebnis).length
const groesse = Math.round(readFileSync(ziel).length / 1024)
console.log(`${ziel}: ${anzahl} PLZ, ${groesse} KB`)
console.log(`Nur Firmenzeilen vorhanden bei ${nurFirmen} PLZ (Großempfänger).`)
