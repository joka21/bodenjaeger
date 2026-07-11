import FachmarktLandingNav from '@/components/fachmarkt/FachmarktLandingNav'

/**
 * Layout für den Fachmarkt-Bereich. Rendert die reduzierte Landing-Navigation.
 *
 * WICHTIG: Dieses Layout umschließt technisch auch die `[slug]`-Unterseiten.
 * Die Landing-Navigation blendet sich jedoch über `isLandingRoute` selbst aus,
 * sobald der Pfad NICHT exakt `/fachmarkt-hueckelhoven` ist. Die 9 Unterseiten
 * behalten dadurch die reguläre Shop-Navigation (Kundenvorgabe: konservativ,
 * exakter Pfad-Match).
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
