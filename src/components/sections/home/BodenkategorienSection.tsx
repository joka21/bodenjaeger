import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  slug: string | null; // null = keine Verlinkung
}

const categories: Category[] = [
  {
    id: 1,
    name: 'Rigid-Vinyl',
    description: 'Der wasserfeste Alleskönner',
    image: '/images/Startseite/Bodenkategorie Rigid-Vinyl.webp',
    slug: 'rigid-vinyl'
  },
  {
    id: 2,
    name: 'Laminat',
    description: 'Preiswert und robust',
    image: '/images/Startseite/Bodenkategorie Laminat.webp',
    slug: 'laminat'
  },
  {
    id: 3,
    name: 'Klebe-Vinyl',
    description: 'Zur vollflächigen Verklebung',
    image: '/images/Startseite/Bodenkategorie Klebe-Vinyl.webp',
    slug: 'klebe-vinyl'
  },
  {
    id: 4,
    name: 'Parkett',
    description: 'Der nachhaltige Naturboden',
    image: '/images/Startseite/Bodenkategorie Parkett.webp',
    slug: 'parkett'
  },
  {
    id: 5,
    name: 'primeCORE',
    description: 'Premium Vinyl-Bodenbeläge',
    image: '/images/Startseite/Bodenkategorie primeCORE.webp',
    slug: null // Noch keine Verlinkung
  },
  {
    id: 6,
    name: 'O.R.C.A',
    description: 'Innovative Bodenlösungen',
    image: '/images/Startseite/Bodenkategorie O.R.C.webp',
    slug: null // Noch keine Verlinkung
  }
];

export default function BodenkategorienSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Titel */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">
          Unsere Top-Bodenkategorien
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            // Card Content
            const cardContent = (
              <>
                {/* Hintergrundbild */}
                <div className="absolute inset-0">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={90}
                  />
                </div>

                {/* Dunkles Overlay (Gradient) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Text Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-2">
                        {category.name}
                      </h3>
                      <p className="text-base md:text-lg text-gray-200">
                        {category.description}
                      </p>
                    </div>
                    {/* Pfeil-Icon (nur bei verlinkten Kategorien) */}
                    {category.slug && (
                      <div className="flex-shrink-0 ml-4">
                        <svg
                          className="w-8 h-8 transition-transform group-hover:translate-x-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover Brightness Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                {/* "Bald verfügbar" Badge für nicht verlinkte Kategorien */}
                {!category.slug && (
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-lg">
                    Bald verfügbar
                  </div>
                )}
              </>
            );

            // Wenn slug vorhanden: Link, sonst: div
            return category.slug ? (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group relative min-h-[350px] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                {cardContent}
              </Link>
            ) : (
              <div
                key={category.id}
                className="group relative min-h-[350px] rounded-xl overflow-hidden shadow-lg cursor-not-allowed opacity-90"
              >
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
