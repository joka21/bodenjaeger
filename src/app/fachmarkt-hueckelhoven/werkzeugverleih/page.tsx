import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Werkzeugverleih | Fachmarkt Hückelhoven | Bodenjäger',
  description: 'Professionelle Werkzeuge mieten für die Selbstverlegung im Fachmarkt Hückelhoven',
}

export default function WerkzeugverleihPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <nav className="mb-6 text-sm">
          <Link href="/fachmarkt-hueckelhoven" className="text-[#1e40af] hover:underline">
            ← Zurück zum Fachmarkt Hückelhoven
          </Link>
        </nav>

        <h1 className="text-4xl lg:text-5xl font-bold text-[#1e40af] mb-8">
          Werkzeugverleih
        </h1>

        <div className="prose prose-lg max-w-none text-gray-700">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Professionelles Werkzeug für die Selbstverlegung
            </h2>
            <p className="mb-4">
              Sie möchten Ihren Boden selbst verlegen? Mit unserem Werkzeugverleih
              erhalten Sie professionelle Geräte zum günstigen Mietpreis. Alle Werkzeuge
              sind regelmäßig gewartet und einsatzbereit – so wird Ihr DIY-Projekt zum
              Erfolg!
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Unser Werkzeugsortiment
            </h2>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                  Schneidemaschinen
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold mb-1">Laminatschneider</p>
                    <p className="text-sm text-gray-600 mb-2">
                      Für saubere Schnitte ohne Staub
                    </p>
                    <p className="text-sm">
                      <strong>Tagesmiete:</strong> 8,00 € | <strong>Wochenende:</strong>{' '}
                      15,00 €
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Fliesenschneider elektrisch</p>
                    <p className="text-sm text-gray-600 mb-2">
                      Mit Wasserkühlung für präzise Schnitte
                    </p>
                    <p className="text-sm">
                      <strong>Tagesmiete:</strong> 25,00 € |{' '}
                      <strong>Wochenende:</strong> 45,00 €
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Vinyl-Schneider</p>
                    <p className="text-sm text-gray-600 mb-2">
                      Speziell für Vinyl-Planken und -Fliesen
                    </p>
                    <p className="text-sm">
                      <strong>Tagesmiete:</strong> 10,00 € |{' '}
                      <strong>Wochenende:</strong> 18,00 €
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                  Schleif- und Vorbereitungsgeräte
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold mb-1">Betonschleifer</p>
                    <p className="text-sm text-gray-600 mb-2">
                      Für die Untergrundvorbereitung
                    </p>
                    <p className="text-sm">
                      <strong>Tagesmiete:</strong> 35,00 € |{' '}
                      <strong>Wochenende:</strong> 60,00 €
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Parkettschleifmaschine</p>
                    <p className="text-sm text-gray-600 mb-2">
                      Zum Abschleifen alter Parkettböden
                    </p>
                    <p className="text-sm">
                      <strong>Tagesmiete:</strong> 45,00 € |{' '}
                      <strong>Wochenende:</strong> 80,00 €
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Industriestaubsauger</p>
                    <p className="text-sm text-gray-600 mb-2">
                      Leistungsstarke Absaugung für Staub und Schmutz
                    </p>
                    <p className="text-sm">
                      <strong>Tagesmiete:</strong> 15,00 € |{' '}
                      <strong>Wochenende:</strong> 25,00 €
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                  Spezialwerkzeuge
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold mb-1">Zugeisen-Set</p>
                    <p className="text-sm text-gray-600 mb-2">
                      Für die letzte Reihe bei Klick-Böden
                    </p>
                    <p className="text-sm">
                      <strong>Tagesmiete:</strong> 5,00 € | <strong>Wochenende:</strong>{' '}
                      8,00 €
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Schlagholz und Hammer</p>
                    <p className="text-sm text-gray-600 mb-2">
                      Zum schonenden Zusammenfügen der Paneele
                    </p>
                    <p className="text-sm">
                      <strong>Tagesmiete:</strong> Kostenlos bei Materialkauf
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Zahnkelle-Set</p>
                    <p className="text-sm text-gray-600 mb-2">
                      Verschiedene Größen für Kleber und Spachtelmasse
                    </p>
                    <p className="text-sm">
                      <strong>Tagesmiete:</strong> 3,00 € pro Stück
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-[#1e40af] mb-3">
                  Kombi-Pakete
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold mb-1">Laminat-Starter-Paket</p>
                    <p className="text-sm text-gray-600 mb-2">
                      Laminatschneider + Zugeisen + Schlagholz + Abstandskeile
                    </p>
                    <p className="text-sm">
                      <strong>Wochenende:</strong> 20,00 € statt 31,00 €
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Renovierungs-Paket</p>
                    <p className="text-sm text-gray-600 mb-2">
                      Betonschleifer + Industriestaubsauger + Spachtelwerkzeug
                    </p>
                    <p className="text-sm">
                      <strong>Wochenende:</strong> 70,00 € statt 88,00 €
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Mietbedingungen
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-[#1e40af] font-bold">•</span>
                  <span>
                    <strong>Kaution:</strong> Je nach Werkzeug 50,00 € - 200,00 €
                    (Rückzahlung bei ordnungsgemäßer Rückgabe)
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#1e40af] font-bold">•</span>
                  <span>
                    <strong>Tagesmiete:</strong> Von 09:00 Uhr bis 18:00 Uhr am selben
                    Tag
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#1e40af] font-bold">•</span>
                  <span>
                    <strong>Wochenendmiete:</strong> Freitag 14:00 Uhr bis Montag 10:00
                    Uhr
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#1e40af] font-bold">•</span>
                  <span>
                    <strong>Wochenmiete:</strong> 7 Tage zum Preis von 4 Tagesmieten
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#1e40af] font-bold">•</span>
                  <span>
                    <strong>Reservierung:</strong> Telefonisch oder direkt im Fachmarkt
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#1e40af] font-bold">•</span>
                  <span>
                    <strong>Ausweis:</strong> Personalausweis oder Führerschein
                    erforderlich
                  </span>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Einweisung & Support
            </h2>
            <div className="bg-blue-50 border-l-4 border-[#1e40af] p-6 rounded">
              <p className="mb-3">
                <strong>Kostenlose Einweisung vor Ort!</strong>
              </p>
              <p className="text-sm mb-3">
                Bei Abholung des Werkzeugs erklären wir Ihnen die richtige Handhabung
                und Sicherheitshinweise. Bei Fragen während der Miete stehen wir
                telefonisch zur Verfügung.
              </p>
              <p className="text-sm">
                Zusätzlich bieten wir kostenlose Verlegetipps und können Ihnen
                Video-Anleitungen empfehlen.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Wichtige Hinweise
            </h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
              <ul className="space-y-2">
                <li>
                  • Werkzeuge müssen gereinigt zurückgegeben werden (sonst
                  Reinigungspauschale 15,00 €)
                </li>
                <li>
                  • Bei Beschädigung oder Verlust wird der Zeitwert bzw. Reparaturkosten
                  berechnet
                </li>
                <li>• Verschleißteile (z.B. Schleifpapier) sind im Mietpreis enthalten</li>
                <li>
                  • Stromkabel und Verlängerungen müssen selbst mitgebracht werden
                </li>
                <li>• Verspätete Rückgabe wird anteilig berechnet (4,00 € pro Stunde)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
              Werkzeug reservieren
            </h2>
            <p className="mb-4">
              Reservieren Sie Ihr Wunschwerkzeug rechtzeitig, besonders an Wochenenden
              und vor Feiertagen ist die Nachfrage hoch!
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="mb-2">
                <strong>Telefon:</strong> +49 (0) 2433 123456
              </p>
              <p className="text-sm text-gray-600">
                Montag bis Freitag: 09:00 - 18:00 Uhr | Samstag: 09:00 - 14:00 Uhr
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm">
                <strong>Tipp:</strong> Bei Materialkauf ab 500 € erhalten Sie 10% Rabatt
                auf die Werkzeugmiete!
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
