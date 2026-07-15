import FachmarktLandingNav from '@/components/fachmarkt/FachmarktLandingNav'

/**
 * Layout für den Fachmarkt-Bereich. Rendert die reduzierte Fachmarkt-Navigation.
 *
 * Die Navigation ist im gesamten Bereich sichtbar: auf der Landingpage UND
 * allen Unterseiten unter `/fachmarkt-hueckelhoven` (Prefix-Match via
 * `isFachmarktRoute`). Die Shop-Navigation wird dort über den HeaderWrapper
 * ausgeblendet, sodass der Fachmarkt navigatorisch ein geschlossener Bereich
 * ist (Kundenvorgabe).
 */
export default function FachmarktLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <FachmarktLandingNav />
      {children}
    </>
  )
}
