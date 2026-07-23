// Globaler Aktions-Balken unter dem Header: Jäger-Gelb Hintergrund, Jäger-Schwarz Schrift.
// Wird im Layout direkt nach dem Header gerendert, damit er auf allen Seiten sichtbar ist.
export default function SaleBanner() {
  return (
    <div
      className="w-full px-4 py-2 text-center text-dark text-sm md:py-2.5 md:text-base"
      style={{ backgroundColor: '#fff301' }}
    >
      {/* Mobil: kompakt, einzeilig */}
      <span className="md:hidden">
        SummerSALE: 10% mit Code <strong className="font-bold">SU10</strong>
      </span>
      {/* Desktop: vollständiger Text */}
      <span className="hidden md:inline">
        SummerSALE &ndash; 10% auf das gesamte Sortiment mit dem{' '}
        <strong className="font-bold">Code: SU10</strong>
      </span>
    </div>
  );
}
