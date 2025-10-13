/**
 * Mock-Produktdaten für StandardProductCard
 * Basierend auf Backend-Felder Dokumentation
 */

export interface MockProduct {
  id: number;
  name: string;
  slug: string;
  images: Array<{
    src: string;
    alt: string;
  }>;
  _show_setangebot?: string;
  _setangebot_einzelpreis?: number;
  _setangebot_gesamtpreis?: number;
  _setangebot_ersparnis_prozent?: number;
  _aktion?: string;
  _einheit_short?: string;
}

/**
 * Beispiel-Produkte mit verschiedenen Konfigurationen
 */
export const mockProducts: MockProduct[] = [
  // Produkt 1: Vollständiges Set-Angebot mit Black Sale
  {
    id: 1,
    name: 'Laminat Wild West Oak - Robuste Holzoptik für jeden Raum',
    slug: 'laminat-wild-west-oak',
    images: [
      {
        src: '/images/products/laminat-wild-west-1.jpg',
        alt: 'Laminat Wild West Oak Nahaufnahme',
      },
      {
        src: '/images/products/laminat-wild-west-2.jpg',
        alt: 'Laminat Wild West Oak Raumansicht',
      },
      {
        src: '/images/products/laminat-wild-west-3.jpg',
        alt: 'Laminat Wild West Oak Detail',
      },
    ],
    _show_setangebot: 'yes',
    _setangebot_einzelpreis: 35.54,
    _setangebot_gesamtpreis: 24.99,
    _setangebot_ersparnis_prozent: 30,
    _aktion: 'Black Sale',
    _einheit_short: 'm²',
  },

  // Produkt 2: Set-Angebot ohne Aktion
  {
    id: 2,
    name: 'Vinyl Planken Eiche hell - Wasserfest & pflegeleicht',
    slug: 'vinyl-planken-eiche-hell',
    images: [
      {
        src: '/images/products/vinyl-eiche-1.jpg',
        alt: 'Vinyl Eiche hell',
      },
      {
        src: '/images/products/vinyl-eiche-2.jpg',
        alt: 'Vinyl Eiche Detail',
      },
    ],
    _show_setangebot: 'yes',
    _setangebot_einzelpreis: 29.99,
    _setangebot_gesamtpreis: 22.49,
    _setangebot_ersparnis_prozent: 25,
    _einheit_short: 'm²',
  },

  // Produkt 3: Restposten mit hohem Rabatt
  {
    id: 3,
    name: 'Parkett Nussbaum dunkel - Echtholz Premium',
    slug: 'parkett-nussbaum-dunkel',
    images: [
      {
        src: '/images/products/parkett-nussbaum-1.jpg',
        alt: 'Parkett Nussbaum',
      },
    ],
    _show_setangebot: 'yes',
    _setangebot_einzelpreis: 89.99,
    _setangebot_gesamtpreis: 49.99,
    _setangebot_ersparnis_prozent: 44,
    _aktion: 'Restposten',
    _einheit_short: 'm²',
  },

  // Produkt 4: Sockelleiste (Laufmeter)
  {
    id: 4,
    name: 'Sockelleiste Weiß Foliert 58mm - Für alle Bodenbeläge',
    slug: 'sockelleiste-weiss-58mm',
    images: [
      {
        src: '/images/products/sockelleiste-weiss-1.jpg',
        alt: 'Sockelleiste Weiß',
      },
      {
        src: '/images/products/sockelleiste-weiss-2.jpg',
        alt: 'Sockelleiste Weiß montiert',
      },
      {
        src: '/images/products/sockelleiste-weiss-3.jpg',
        alt: 'Sockelleiste Weiß Detail',
      },
    ],
    _show_setangebot: 'yes',
    _setangebot_einzelpreis: 7.99,
    _setangebot_gesamtpreis: 5.99,
    _setangebot_ersparnis_prozent: 25,
    _aktion: 'Sommerschlussverkauf',
    _einheit_short: 'lfm',
  },

  // Produkt 5: Ohne Set-Angebot (Regulärer Preis)
  {
    id: 5,
    name: 'Dämmung PE-Schaum 2mm - Trittschalldämmung',
    slug: 'daemmung-pe-schaum-2mm',
    images: [
      {
        src: '/images/products/daemmung-pe-1.jpg',
        alt: 'PE-Schaum Dämmung',
      },
    ],
    _show_setangebot: 'no',
    _setangebot_gesamtpreis: 0.95,
    _einheit_short: 'm²',
  },

  // Produkt 6: Niedriger Rabatt
  {
    id: 6,
    name: 'COREtec Hybrid-Vinyl Stone - Steinoptik wasserfest',
    slug: 'coretec-hybrid-vinyl-stone',
    images: [
      {
        src: '/images/products/coretec-stone-1.jpg',
        alt: 'COREtec Stone',
      },
      {
        src: '/images/products/coretec-stone-2.jpg',
        alt: 'COREtec Stone Raum',
      },
    ],
    _show_setangebot: 'yes',
    _setangebot_einzelpreis: 42.99,
    _setangebot_gesamtpreis: 39.99,
    _setangebot_ersparnis_prozent: 7,
    _einheit_short: 'm²',
  },

  // Produkt 7: Sehr langer Produktname (Test für line-clamp)
  {
    id: 7,
    name: 'Premium Laminat Eiche Rustikal mit authentischer Holzmaserung und extremer Abriebfestigkeit Klasse AC5 für gewerbliche Nutzung',
    slug: 'premium-laminat-eiche-rustikal-ac5',
    images: [
      {
        src: '/images/products/laminat-eiche-rustikal-1.jpg',
        alt: 'Laminat Eiche Rustikal',
      },
    ],
    _show_setangebot: 'yes',
    _setangebot_einzelpreis: 32.99,
    _setangebot_gesamtpreis: 26.99,
    _setangebot_ersparnis_prozent: 18,
    _aktion: 'Neues Produkt',
    _einheit_short: 'm²',
  },

  // Produkt 8: Hoher Preis
  {
    id: 8,
    name: 'Massivparkett Eiche Select - Natur geölt',
    slug: 'massivparkett-eiche-select',
    images: [
      {
        src: '/images/products/massivparkett-eiche-1.jpg',
        alt: 'Massivparkett Eiche',
      },
      {
        src: '/images/products/massivparkett-eiche-2.jpg',
        alt: 'Massivparkett Eiche Detail',
      },
    ],
    _show_setangebot: 'yes',
    _setangebot_einzelpreis: 129.99,
    _setangebot_gesamtpreis: 99.99,
    _setangebot_ersparnis_prozent: 23,
    _einheit_short: 'm²',
  },
];

/**
 * Hilfsfunktion um ein einzelnes Mock-Produkt nach ID zu finden
 */
export const getMockProductById = (id: number): MockProduct | undefined => {
  return mockProducts.find((product) => product.id === id);
};

/**
 * Hilfsfunktion um Mock-Produkte nach Slug zu finden
 */
export const getMockProductBySlug = (slug: string): MockProduct | undefined => {
  return mockProducts.find((product) => product.slug === slug);
};

/**
 * Hilfsfunktion um gefilterte Produkte zu erhalten
 */
export const getFilteredMockProducts = (filter: {
  hasSetAngebot?: boolean;
  hasAktion?: boolean;
  minDiscount?: number;
}): MockProduct[] => {
  return mockProducts.filter((product) => {
    if (filter.hasSetAngebot !== undefined) {
      if (filter.hasSetAngebot && product._show_setangebot !== 'yes') return false;
      if (!filter.hasSetAngebot && product._show_setangebot === 'yes') return false;
    }

    if (filter.hasAktion !== undefined) {
      if (filter.hasAktion && !product._aktion) return false;
      if (!filter.hasAktion && product._aktion) return false;
    }

    if (filter.minDiscount !== undefined) {
      const discount = product._setangebot_ersparnis_prozent || 0;
      if (discount < filter.minDiscount) return false;
    }

    return true;
  });
};
