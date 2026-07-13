import { ImageOff } from 'lucide-react'

interface BildPlatzhalterProps {
  /** z. B. "4 / 3" oder "16 / 9" */
  ratio?: string
  label: string
  /** optionale Zusatzangabe (Bodenart/Raum/Projektart) */
  hinweis?: string
  className?: string
}

/**
 * Sichtbarer Bild-Platzhalter mit korrektem Seitenverhältnis — damit der Kunde
 * Format und Bildbedarf beurteilen kann (Bilder liegen noch nicht vor).
 * Bewusst als Platzhalter erkennbar (gestrichelter Rahmen + Label).
 */
export default function BildPlatzhalter({
  ratio = '4 / 3',
  label,
  hinweis,
  className = '',
}: BildPlatzhalterProps) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border-2 border-dashed border-ash bg-pale ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center text-mid">
        <ImageOff className="h-8 w-8" />
        <span className="text-sm font-bold">{label}</span>
        {hinweis && <span className="text-xs text-mid/80">{hinweis}</span>}
      </div>
    </div>
  )
}
