import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Styleguide | Bodenjäger',
  description: 'Design-System mit Farben, Typografie und Komponenten',
}

export default function StyleguidePage() {
  const colors = [
    {
      name: 'Primary / Accent',
      var: '--color-primary',
      hex: '#ed1b24',
      usage: 'Hauptfarbe, Buttons, Links, Akzente',
    },
    {
      name: 'Text Primary',
      var: '--color-text-primary',
      hex: '#2e2d32',
      usage: 'Haupt-Textfarbe',
    },
    {
      name: 'Text Light',
      var: '--color-text-light',
      hex: '#ffffff',
      usage: 'Text auf dunklem Hintergrund',
    },
    {
      name: 'Text Dark',
      var: '--color-text-dark',
      hex: '#4c4c4c',
      usage: 'Dunklerer Text, Sekundärer Text',
    },
    {
      name: 'Background White',
      var: '--color-bg-white',
      hex: '#ffffff',
      usage: 'Weißer Hintergrund',
    },
    {
      name: 'Background Light',
      var: '--color-bg-light',
      hex: '#f9f9fb',
      usage: 'Heller Hintergrund, Cards',
    },
    {
      name: 'Background Gray',
      var: '--color-bg-gray',
      hex: '#e5e5e5',
      usage: 'Grauer Hintergrund, Trenner',
    },
    {
      name: 'Background Dark',
      var: '--color-bg-dark',
      hex: '#4c4c4c',
      usage: 'Dunkler Hintergrund',
    },
    {
      name: 'Background Darkest',
      var: '--color-bg-darkest',
      hex: '#2e2d32',
      usage: 'Dunkelster Hintergrund',
    },
  ]

  const fontSizes = [
    { name: 'text-xs', size: '0.75rem', px: '12px', usage: 'Kleinster Text' },
    { name: 'text-sm', size: '0.875rem', px: '14px', usage: 'Kleiner Text' },
    { name: 'text-base', size: '1rem', px: '16px', usage: 'Standard-Text' },
    { name: 'text-lg', size: '1.125rem', px: '18px', usage: 'Größerer Text' },
    { name: 'text-xl', size: '1.25rem', px: '20px', usage: 'H6' },
    { name: 'text-2xl', size: '1.5rem', px: '24px', usage: 'H5' },
    { name: 'text-3xl', size: '1.875rem', px: '30px', usage: 'H4' },
    { name: 'text-4xl', size: '2.25rem', px: '36px', usage: 'H3' },
    { name: 'text-5xl', size: '3rem', px: '48px', usage: 'H2' },
    { name: 'text-6xl', size: '3.75rem', px: '60px', usage: 'H1' },
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4" style={{ color: 'var(--color-primary)' }}>
            Bodenjäger Styleguide
          </h1>
          <p className="text-xl" style={{ color: 'var(--color-text-dark)' }}>
            Design-System mit Farben, Typografie und Komponenten
          </p>
        </div>

        {/* Farben */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
            Farben
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {colors.map((color) => (
              <div key={color.var} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div
                  className="h-32 w-full"
                  style={{
                    backgroundColor: `var(${color.var})`,
                    border: color.hex === '#ffffff' ? '1px solid #e5e5e5' : 'none'
                  }}
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{color.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <code className="bg-gray-100 px-2 py-1 rounded">{color.hex}</code>
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">var({color.var})</code>
                  </p>
                  <p className="text-xs text-gray-500">{color.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Typografie */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
            Typografie
          </h2>

          {/* Schriftarten */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h3 className="text-2xl font-bold mb-6">Schriftarten</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-bold mb-3" style={{ color: 'var(--color-primary)' }}>
                  Poppins Regular
                </h4>
                <p className="text-base mb-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">var(--font-poppins-regular)</code>
                </p>
                <p className="text-base mb-4">Weight: 400</p>
                <p className="text-lg" style={{ fontFamily: 'var(--font-poppins-regular)' }}>
                  Verwendung: Fließtext, Absätze, normaler Content
                </p>
                <p className="text-base mt-4" style={{ fontFamily: 'var(--font-poppins-regular)' }}>
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                  abcdefghijklmnopqrstuvwxyz<br />
                  0123456789 !@#$%^&*()
                </p>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-3" style={{ color: 'var(--color-primary)' }}>
                  Poppins Bold
                </h4>
                <p className="text-base mb-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">var(--font-poppins-bold)</code>
                </p>
                <p className="text-base mb-4">Weight: 700</p>
                <p className="text-lg font-bold">
                  Verwendung: Überschriften, Buttons, Hervorhebungen
                </p>
                <p className="text-base font-bold mt-4">
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                  abcdefghijklmnopqrstuvwxyz<br />
                  0123456789 !@#$%^&*()
                </p>
              </div>
            </div>
          </div>

          {/* Schriftgrößen */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-bold mb-6">Schriftgrößen</h3>
            <div className="space-y-6">
              {fontSizes.map((size) => (
                <div key={size.name} className="border-b border-gray-200 pb-4">
                  <div className="flex items-baseline gap-4 mb-2">
                    <code className="bg-gray-100 px-3 py-1 rounded text-sm min-w-[120px]">
                      {size.name}
                    </code>
                    <span className="text-sm text-gray-600">
                      {size.size} ({size.px})
                    </span>
                    <span className="text-sm text-gray-500">{size.usage}</span>
                  </div>
                  <p className={size.name}>
                    The quick brown fox jumps over the lazy dog
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Überschriften-Hierarchie */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
            Überschriften-Hierarchie
          </h2>
          <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
            <div>
              <h1 className="text-6xl font-bold">H1 - Hauptüberschrift (60px)</h1>
              <code className="text-sm text-gray-600">text-6xl font-bold</code>
            </div>
            <div>
              <h2 className="text-5xl font-bold">H2 - Seitenüberschrift (48px)</h2>
              <code className="text-sm text-gray-600">text-5xl font-bold</code>
            </div>
            <div>
              <h3 className="text-4xl font-bold">H3 - Sektionsüberschrift (36px)</h3>
              <code className="text-sm text-gray-600">text-4xl font-bold</code>
            </div>
            <div>
              <h4 className="text-3xl font-bold">H4 - Untertitel (30px)</h4>
              <code className="text-sm text-gray-600">text-3xl font-bold</code>
            </div>
            <div>
              <h5 className="text-2xl font-bold">H5 - Kleinere Überschrift (24px)</h5>
              <code className="text-sm text-gray-600">text-2xl font-bold</code>
            </div>
            <div>
              <h6 className="text-xl font-bold">H6 - Kleinste Überschrift (20px)</h6>
              <code className="text-sm text-gray-600">text-xl font-bold</code>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
            Buttons
          </h2>
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold mb-3">Primary Button</h4>
                <button
                  className="px-6 py-3 rounded-lg font-bold text-white transition-colors"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  Jetzt kaufen
                </button>
                <pre className="mt-2 text-sm bg-gray-100 p-2 rounded">
                  bg: var(--color-primary), text: white, font: bold
                </pre>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-3">Secondary Button</h4>
                <button
                  className="px-6 py-3 rounded-lg font-bold transition-colors border-2"
                  style={{
                    color: 'var(--color-primary)',
                    borderColor: 'var(--color-primary)'
                  }}
                >
                  Mehr erfahren
                </button>
                <pre className="mt-2 text-sm bg-gray-100 p-2 rounded">
                  border: var(--color-primary), text: var(--color-primary), font: bold
                </pre>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-3">Dark Button</h4>
                <button
                  className="px-6 py-3 rounded-lg font-bold text-white transition-colors"
                  style={{ backgroundColor: 'var(--color-bg-dark)' }}
                >
                  Kontakt
                </button>
                <pre className="mt-2 text-sm bg-gray-100 p-2 rounded">
                  bg: var(--color-bg-dark), text: white, font: bold
                </pre>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-3">Button Größen</h4>
                <div className="flex flex-wrap gap-4 items-center">
                  <button
                    className="px-4 py-2 rounded-lg font-bold text-white text-sm"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    Klein
                  </button>
                  <button
                    className="px-6 py-3 rounded-lg font-bold text-white"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    Normal
                  </button>
                  <button
                    className="px-8 py-4 rounded-lg font-bold text-white text-lg"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    Groß
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Text-Beispiele */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
            Text-Beispiele
          </h2>
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-bold mb-4">
              Dies ist eine Beispiel-Überschrift
            </h3>
            <p className="text-lg mb-4" style={{ color: 'var(--color-text-dark)' }}>
              Dies ist ein Lead-Paragraph mit größerer Schrift (text-lg). Ideal für
              einleitende Texte und wichtige Informationen.
            </p>
            <p className="text-base mb-4">
              Dies ist ein Standard-Absatz (text-base). Dieser Text wird für den
              Hauptinhalt der Website verwendet. Die Schriftart ist Poppins Regular
              mit einer Größe von 16px. Der Zeilenabstand und die Lesbarkeit sind
              optimal für längere Texte.
            </p>
            <p className="text-sm" style={{ color: 'var(--color-text-dark)' }}>
              Dies ist ein kleinerer Text (text-sm). Wird für sekundäre Informationen,
              Bildunterschriften oder Metadaten verwendet.
            </p>
          </div>
        </section>

        {/* CSS-Variablen Referenz */}
        <section>
          <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
            CSS-Variablen Referenz
          </h2>
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-xl font-bold mb-4">Verwendung in CSS</h3>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`.element {
  color: var(--color-text-primary);
  background: var(--color-bg-light);
  border-color: var(--color-accent);
  font-family: var(--font-poppins-regular);
}`}
            </pre>

            <h3 className="text-xl font-bold mb-4 mt-6">Verwendung in JSX (inline)</h3>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`<div style={{
  color: 'var(--color-accent)',
  background: 'var(--color-bg-light)',
  fontFamily: 'var(--font-poppins-bold)'
}}>
  Content
</div>`}
            </pre>
          </div>
        </section>
      </div>
    </main>
  )
}
