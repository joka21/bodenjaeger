'use client'

/**
 * Datei-Upload für Bilder und Baupläne.
 *
 * WARUM KOMPRIMIERT WIRD: Vercel nimmt pro Request maximal 4,5 MB an. Ein
 * heutiges Handyfoto wiegt 3–6 MB, als Base64 ein Drittel mehr — schon zwei
 * Originalbilder würden die Anfrage sprengen. Bilder werden deshalb im Browser
 * auf 1600 px längste Kante gerechnet und als JPEG (Qualität 0,82) kodiert.
 * Für die Einschätzung eines Raums ist das reichlich, und aus 5 MB werden
 * typischerweise 250–400 KB.
 *
 * PDFs lassen sich hier nicht verkleinern. Sie werden unverändert übernommen,
 * zählen aber gegen das Gesamtbudget — ein 4-MB-Bauplan füllt es allein aus.
 * Für größere PDFs bräuchte es einen Direkt-Upload in einen Blob-Speicher.
 *
 * HEIC (iPhone) kann kein Browser-Canvas dekodieren. Solche Dateien werden
 * unverändert weitergegeben; Trello zeigt sie als Anhang, und iOS wandelt beim
 * Auswählen über die Galerie ohnehin meist selbst in JPEG um.
 */
import { useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import { FileText, Loader2, Upload, X } from 'lucide-react'
import { VS_FEHLER, VS_KONTAKT, VS_UPLOAD } from '@/content/verlegeservice-anfrage'
import type { VsDatei } from '@/types/verlegeservice-anfrage'
import { Fehler } from './felder'

/** Gesamtbudget nach Komprimierung — mit Sicherheitsabstand zu Vercels 4,5 MB. */
const GESAMT_BUDGET_BYTES = 3_400_000
const MAX_KANTE_PX = 1600
const JPEG_QUALITAET = 0.82

export interface UploadDatei extends VsDatei {
  /** Eindeutig pro Auswahl, damit Entfernen zielsicher funktioniert. */
  id: string
  bytes: number
  /** Object-URL für die Vorschau; nur bei Bildern gesetzt. */
  vorschau?: string
}

function istKomprimierbar(mime: string): boolean {
  return mime === 'image/jpeg' || mime === 'image/png'
}

function base64Bytes(b64: string): number {
  const padding = b64.endsWith('==') ? 2 : b64.endsWith('=') ? 1 : 0
  return Math.floor((b64.length * 3) / 4) - padding
}

/** Liest eine Datei als reines Base64 (ohne dataURL-Präfix). */
function alsBase64(datei: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const ergebnis = String(reader.result)
      const komma = ergebnis.indexOf(',')
      resolve(komma >= 0 ? ergebnis.slice(komma + 1) : ergebnis)
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(datei)
  })
}

/**
 * Rechnet ein Bild herunter und gibt Base64-JPEG zurück.
 * Schlägt das fehl (exotisches Format, gesperrtes Canvas), liefert die Funktion
 * `null` und der Aufrufer nimmt das Original.
 */
async function verkleinere(datei: File): Promise<{ base64: string; mime: string } | null> {
  try {
    const bitmap = await createImageBitmap(datei)
    const skala = Math.min(1, MAX_KANTE_PX / Math.max(bitmap.width, bitmap.height))
    const breite = Math.max(1, Math.round(bitmap.width * skala))
    const hoehe = Math.max(1, Math.round(bitmap.height * skala))

    const canvas = document.createElement('canvas')
    canvas.width = breite
    canvas.height = hoehe
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.drawImage(bitmap, 0, 0, breite, hoehe)
    bitmap.close?.()

    const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITAET)
    const komma = dataUrl.indexOf(',')
    if (komma < 0) return null
    return { base64: dataUrl.slice(komma + 1), mime: 'image/jpeg' }
  } catch {
    return null
  }
}

/** Hängt „.jpg" an, wenn aus einem PNG ein JPEG geworden ist. */
function dateiname(original: string, neuerMime: string): string {
  if (neuerMime !== 'image/jpeg') return original
  return original.replace(/\.(png|jpeg|jpg)$/i, '') + '.jpg'
}

export default function DateiUpload({
  dateien,
  onChange,
}: {
  dateien: UploadDatei[]
  onChange: (dateien: UploadDatei[]) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [laeuft, setLaeuft] = useState(false)
  const [fehler, setFehler] = useState<string>()

  const verarbeite = useCallback(
    async (auswahl: FileList) => {
      setFehler(undefined)
      setLaeuft(true)

      const neu: UploadDatei[] = []
      let budget =
        GESAMT_BUDGET_BYTES - dateien.reduce((s, d) => s + d.bytes, 0)
      let platz = VS_UPLOAD.maxFiles - dateien.length
      let budgetVoll = false

      for (const datei of Array.from(auswahl)) {
        if (platz <= 0) {
          setFehler(VS_FEHLER.dateiAnzahl)
          break
        }
        if (!(VS_UPLOAD.acceptMime as readonly string[]).includes(datei.type)) {
          setFehler(VS_FEHLER.dateiFormat)
          continue
        }
        if (datei.size > VS_UPLOAD.maxFileBytes) {
          setFehler(VS_FEHLER.dateiGroesse)
          continue
        }

        let base64: string
        let mime = datei.type
        if (istKomprimierbar(datei.type)) {
          const klein = await verkleinere(datei)
          if (klein) {
            base64 = klein.base64
            mime = klein.mime
          } else {
            base64 = await alsBase64(datei)
          }
        } else {
          base64 = await alsBase64(datei)
        }

        const bytes = base64Bytes(base64)
        if (bytes > budget) {
          budgetVoll = true
          continue
        }
        budget -= bytes
        platz--

        neu.push({
          id: `${datei.name}-${datei.lastModified}-${bytes}`,
          filename: dateiname(datei.name, mime),
          mime,
          dataBase64: base64,
          bytes,
          vorschau: mime.startsWith('image/') ? URL.createObjectURL(datei) : undefined,
        })
      }

      if (budgetVoll) {
        setFehler(
          'Die Dateien sind zusammen zu groß. Lade bitte weniger oder kleinere Dateien hoch — sehr große PDFs kannst du uns auch per E-Mail schicken.',
        )
      }

      if (neu.length) onChange([...dateien, ...neu])
      setLaeuft(false)
      // Zurücksetzen, damit dieselbe Datei erneut gewählt werden kann.
      if (inputRef.current) inputRef.current.value = ''
    },
    [dateien, onChange],
  )

  const entferne = (id: string) => {
    const weg = dateien.find((d) => d.id === id)
    if (weg?.vorschau) URL.revokeObjectURL(weg.vorschau)
    onChange(dateien.filter((d) => d.id !== id))
  }

  const genutzt = dateien.reduce((s, d) => s + d.bytes, 0)

  return (
    <div>
      <p className="text-mid">{VS_KONTAKT.uploadHinweis}</p>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={VS_UPLOAD.acceptAttr}
        onChange={(e) => e.target.files && verarbeite(e.target.files)}
        className="sr-only"
        id="vs-dateien"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={laeuft || dateien.length >= VS_UPLOAD.maxFiles}
        className="mt-4 flex min-h-[56px] w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-ash bg-pale px-4 font-bold text-dark transition-colors hover:border-mid disabled:cursor-not-allowed disabled:opacity-50"
      >
        {laeuft ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Dateien werden vorbereitet …
          </>
        ) : (
          <>
            <Upload className="h-5 w-5" />
            {VS_KONTAKT.uploadButton}
          </>
        )}
      </button>

      <p className="mt-2 text-sm text-mid">
        JPG, PNG, HEIC oder PDF · bis {VS_UPLOAD.maxFiles} Dateien ·{' '}
        {dateien.length > 0
          ? `${dateien.length} ausgewählt (${Math.round(genutzt / 1024)} KB)`
          : 'noch keine Datei ausgewählt'}
      </p>

      <Fehler text={fehler} />

      {dateien.length > 0 && (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {dateien.map((d) => (
            <li
              key={d.id}
              className="flex items-center gap-3 rounded-2xl border border-ash bg-white p-3"
            >
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-pale">
                {d.vorschau ? (
                  <Image src={d.vorschau} alt="" fill unoptimized className="object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center">
                    <FileText className="h-6 w-6 text-mid" />
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-dark">{d.filename}</p>
                <p className="text-xs text-mid">{Math.round(d.bytes / 1024)} KB</p>
              </div>
              <button
                type="button"
                onClick={() => entferne(d.id)}
                aria-label={`${VS_KONTAKT.uploadEntfernen}: ${d.filename}`}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-mid transition-colors hover:bg-pale hover:text-brand"
              >
                <X className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
