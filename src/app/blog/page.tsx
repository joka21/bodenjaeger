import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog | Bodenjäger',
  description: 'Tipps, Trends und Wissenswertes rund um Bodenbeläge und Raumgestaltung',
}

// Mock blog posts data - später durch echte Daten ersetzen
const blogPosts = [
  {
    id: 1,
    slug: 'vinyl-oder-laminat',
    title: 'Vinyl oder Laminat? Der große Vergleich',
    excerpt:
      'Beide Bodenbeläge sind beliebt und haben ihre Vorzüge. Wir zeigen Ihnen die Unterschiede und helfen bei der Entscheidung.',
    date: '2025-01-15',
    category: 'Ratgeber',
    image: '/blog/vinyl-laminat.jpg',
    readTime: '5 min',
  },
  {
    id: 2,
    slug: 'bodenpflege-tipps',
    title: '10 Tipps für die richtige Bodenpflege',
    excerpt:
      'Mit der richtigen Pflege bleibt Ihr Boden lange schön. Entdecken Sie unsere bewährten Pflegetipps für verschiedene Bodenarten.',
    date: '2025-01-10',
    category: 'Pflege',
    image: '/blog/pflege.jpg',
    readTime: '6 min',
  },
  {
    id: 3,
    slug: 'parkett-trends-2025',
    title: 'Parkett-Trends 2025: Diese Designs sind angesagt',
    excerpt:
      'Von natürlichen Holztönen bis zu modernen Oberflächenstrukturen - wir zeigen Ihnen die aktuellen Parkett-Trends.',
    date: '2025-01-05',
    category: 'Trends',
    image: '/blog/trends.jpg',
    readTime: '7 min',
  },
  {
    id: 4,
    slug: 'fussbodenheizung-geeignete-bodenbelaege',
    title: 'Welcher Bodenbelag eignet sich für Fußbodenheizung?',
    excerpt:
      'Nicht jeder Boden ist für Fußbodenheizung geeignet. Erfahren Sie, welche Bodenbeläge die beste Wahl sind.',
    date: '2024-12-28',
    category: 'Ratgeber',
    image: '/blog/fussbodenheizung.jpg',
    readTime: '5 min',
  },
  {
    id: 5,
    slug: 'feuchtraumgeeignete-boeden',
    title: 'Bodenbeläge für Bad und Küche: Was ist zu beachten?',
    excerpt:
      'Feuchträume stellen besondere Anforderungen an den Bodenbelag. Wir erklären, worauf Sie achten sollten.',
    date: '2024-12-20',
    category: 'Ratgeber',
    image: '/blog/feuchtbereich.jpg',
    readTime: '6 min',
  },
  {
    id: 6,
    slug: 'nachhaltige-bodenbelaege',
    title: 'Nachhaltige Bodenbeläge: Gut für Umwelt und Wohnklima',
    excerpt:
      'Ökologische Bodenbeläge liegen im Trend. Entdecken Sie umweltfreundliche Alternativen für Ihr Zuhause.',
    date: '2024-12-15',
    category: 'Nachhaltigkeit',
    image: '/blog/nachhaltigkeit.jpg',
    readTime: '8 min',
  },
]

const categories = ['Alle', 'Ratgeber', 'Pflege', 'Trends', 'Nachhaltigkeit']

export default function BlogPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1e40af] to-[#1e3a8a] text-white py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-blue-100">
            Tipps, Trends und Wissenswertes rund um Bodenbeläge
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-12 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                category === 'Alle'
                  ? 'bg-[#1e40af] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              {/* Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <div className="text-gray-400 text-center">
                  <svg
                    className="w-16 h-16 mx-auto mb-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm">Bild</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-semibold text-white bg-[#1e40af] px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-500">{post.readTime}</span>
                </div>

                <h2 className="text-xl font-bold text-[#1e40af] mb-3 hover:text-[#1e3a8a] transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {new Date(post.date).toLocaleDateString('de-DE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-[#1e40af] font-semibold text-sm hover:underline"
                  >
                    Weiterlesen →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Section */}
        <section className="mt-16 bg-gray-50 rounded-lg p-8 md:p-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#1e40af] mb-4">
              Bleiben Sie informiert
            </h2>
            <p className="text-gray-700 mb-6">
              Melden Sie sich für unseren Newsletter an und erhalten Sie regelmäßig
              neue Beiträge, Tipps und exklusive Angebote direkt in Ihr Postfach.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Ihre E-Mail-Adresse"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
              />
              <button
                type="submit"
                className="bg-[#1e40af] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#1e3a8a] transition-colors whitespace-nowrap"
              >
                Anmelden
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-3">
              Mit der Anmeldung stimmen Sie unserer{' '}
              <Link href="/datenschutz" className="underline">
                Datenschutzerklärung
              </Link>{' '}
              zu.
            </p>
          </div>
        </section>

        {/* Categories Overview */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-[#1e40af] mb-8 text-center">
            Beliebte Themen
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:bg-gray-100 transition-colors">
              <h3 className="font-semibold text-[#1e40af] mb-2">Ratgeber</h3>
              <p className="text-sm text-gray-600">
                Hilfreiche Tipps zur Auswahl und Verlegung
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:bg-gray-100 transition-colors">
              <h3 className="font-semibold text-[#1e40af] mb-2">Pflege</h3>
              <p className="text-sm text-gray-600">
                So pflegen Sie Ihren Boden richtig
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:bg-gray-100 transition-colors">
              <h3 className="font-semibold text-[#1e40af] mb-2">Trends</h3>
              <p className="text-sm text-gray-600">
                Aktuelle Designs und Innovationen
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:bg-gray-100 transition-colors">
              <h3 className="font-semibold text-[#1e40af] mb-2">Nachhaltigkeit</h3>
              <p className="text-sm text-gray-600">
                Ökologische Bodenbeläge im Fokus
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
