import { NextRequest, NextResponse } from 'next/server'
import { istPlzFormat, pruefeServicegebiet } from '@/lib/servicegebiet'

/**
 * PLZ-Auflösung für Schritt 1 des Verlegeservice-Formulars.
 *
 * Liefert Ort, Entfernung und Area-Status. Der PLZ-Datensatz (437 KB) bleibt
 * dadurch auf dem Server — er würde das Browser-Bundle unnötig aufblähen.
 *
 * Das Ergebnis ist nur eine Vorschau für den Nutzer: Beim Absenden bestimmt
 * /api/verlegeservice den Status erneut, damit manipulierte Werte nichts nützen.
 *
 * GET /api/verlegeservice/plz?plz=41836
 */
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const plz = request.nextUrl.searchParams.get('plz')?.trim() ?? ''

  if (!istPlzFormat(plz)) {
    return NextResponse.json(
      { gefunden: false, grund: 'format' as const },
      { status: 400 },
    )
  }

  const gebiet = pruefeServicegebiet(plz)
  if (!gebiet) {
    return NextResponse.json({ gefunden: false, grund: 'unbekannt' as const })
  }

  return NextResponse.json(
    {
      gefunden: true as const,
      plz: gebiet.plz,
      ort: gebiet.ort,
      distanceKm: gebiet.distanceKm,
      areaStatus: gebiet.areaStatus,
    },
    {
      // Der Datensatz ist statisch — Antworten dürfen lange zwischenliegen.
      headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=604800' },
    },
  )
}
