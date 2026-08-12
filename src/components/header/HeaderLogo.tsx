import Link from 'next/link'

/**
 * Logo-Lockup des Shop-Headers: roter Kreis mit weißem „J" + Wortmarke
 * „BODENJÄGER" in Versalien, „.DE" heller abgesetzt.
 *
 * Der Kreis ist als Inline-SVG gebaut und nicht als Bild-Asset: Im vorhandenen
 * `logo-bodenjaeger-fff.svg` ist das J eine Aussparung im roten Kreis und würde
 * auf schwarzem Grund schwarz erscheinen. Hier liegt der J-Pfad als eigene
 * weiße Fläche über dem Kreis. Der Pfad ist unverändert aus dem Original-Asset
 * übernommen, damit die Form identisch bleibt.
 */
export default function HeaderLogo() {
  return (
    <Link
      href="/"
      className="flex flex-shrink-0 items-center gap-2.5 lg:gap-3.5"
      aria-label="Bodenjäger.de — zur Startseite"
    >
      <svg
        viewBox="0 0 60.96 60.96"
        className="h-10 w-10 flex-shrink-0 lg:h-[57px] lg:w-[57px]"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="30.48" cy="30.48" r="30.48" className="fill-hdr-red" />
        <path
          d="m31.22,35.54c0,6.95-2.65,8.87-6.88,8.87-1.99,0-3.77-.33-5.16-.79l-1.13,8.14c1.99.66,5.03,1.06,7.34,1.06,9.79,0,15.88-4.43,15.88-17.14V7.48h-10.06v28.06Z"
          fill="#fff"
        />
      </svg>

      <span className="font-[family-name:var(--font-poppins-bold)] text-[17px] leading-none tracking-tight whitespace-nowrap sm:text-[20px] lg:text-[27px]">
        <span className="text-white">BODENJÄGER</span>
        <span className="text-hdr-muted">.DE</span>
      </span>
    </Link>
  )
}
