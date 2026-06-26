// Globaler Aktions-Balken unter dem Header: Jäger-Gelb Hintergrund, Jäger-Schwarz Schrift.
// Wird im Layout direkt nach dem Header gerendert, damit er auf allen Seiten sichtbar ist.
export default function SaleBanner() {
  return (
    <div
      className="w-full px-4 py-2.5 text-center text-dark text-sm md:text-base"
      style={{ backgroundColor: '#fff301' }}
    >
      SummerSALE &ndash; 10% auf das gesamte Sortiment mit dem{' '}
      <strong className="font-bold">Code: SU10</strong>
    </div>
  );
}
