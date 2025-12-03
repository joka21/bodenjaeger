import { Metadata } from 'next';

// Block search engines from indexing this page
export const metadata: Metadata = {
  title: 'Todo | Bodenjäger',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function TodoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="content-container py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Todo</h1>
          <p className="text-gray-600">Interne Aufgabenliste (nicht für Suchmaschinen sichtbar)</p>
        </div>

        {/* Todo List */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Offene Aufgaben</h2>

          <ul className="space-y-4">
            <li className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <input type="checkbox" className="mt-1 w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Miniwarenkorb nach Vorlage anpassen</h3>
                <p className="text-sm text-gray-600 mt-1">Miniwarenkorb-Design entsprechend der Vorlage überarbeiten</p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <input type="checkbox" className="mt-1 w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Unterseiten alle fertigstellen</h3>
                <p className="text-sm text-gray-600 mt-1">Alle Unterseiten finalisieren und Content prüfen</p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <input type="checkbox" className="mt-1 w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Startseite letzte Section</h3>
                <p className="text-sm text-gray-600 mt-1">Letzte Section auf der Startseite erstellen/anpassen</p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <input type="checkbox" className="mt-1 w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Preisberechnung kontrollieren</h3>
                <p className="text-sm text-gray-600 mt-1">Preisberechnungen prüfen und sicherstellen, dass alle Kalkulationen korrekt sind</p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <input type="checkbox" className="mt-1 w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Einheiten kontrollieren</h3>
                <p className="text-sm text-gray-600 mt-1">Alle Produkteinheiten (m², Stk., etc.) überprüfen und vereinheitlichen</p>
              </div>
            </li>

            <li className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <input type="checkbox" className="mt-1 w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Einzelproduktansicht anpassen</h3>
                <p className="text-sm text-gray-600 mt-1">Unterschiedliche Ansichten für Böden (mit Set-Angebot, Dämmung, Sockelleisten) und Zubehör (einfache Produktansicht) erstellen</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
