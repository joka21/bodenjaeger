export interface Category {
  id: string;
  label: string;
  slug: string;
  hasChildren: boolean;
  children?: Category[];
}

export interface MenuState {
  isOpen: boolean;
  currentLevel: 1 | 2 | 3;
  navigationStack: NavigationItem[];
  selectedCategory: Category | null;
  selectedSubCategory: Category | null;
}

export interface NavigationItem {
  level: 1 | 2 | 3;
  data: Category | null;
}

export const categoriesData: Category[] = [
  {
    id: '1',
    label: 'Vinylboden',
    slug: 'vinylboden',
    hasChildren: true,
    children: [
      {
        id: '1-1',
        label: 'Art des Vinylbodens',
        slug: 'art-vinylboden',
        hasChildren: true,
        children: [
          { id: '1-1-1', label: 'Klebe-Vinyl', slug: 'klebe-vinyl', hasChildren: false },
          { id: '1-1-2', label: 'Rigid-Vinyl', slug: 'rigid-vinyl', hasChildren: false },
        ],
      },
      {
        id: '1-2',
        label: 'Marken',
        slug: 'marken-vinyl',
        hasChildren: true,
        children: [
          { id: '1-2-1', label: 'COREtec', slug: 'coretec', hasChildren: false },
          { id: '1-2-2', label: 'primeCORE', slug: 'primecore', hasChildren: false },
        ],
      },
    ],
  },
  {
    id: '2',
    label: 'Laminat',
    slug: 'laminat',
    hasChildren: true,
    children: [
      { id: '2-1', label: 'Nutzungsklassen', slug: 'nutzungsklassen', hasChildren: false },
      { id: '2-2', label: 'Laminat-Marken', slug: 'laminat-marken', hasChildren: false },
    ],
  },
  {
    id: '3',
    label: 'Parkett',
    slug: 'parkett',
    hasChildren: true,
    children: [
      { id: '3-1', label: 'Parkett-Arten', slug: 'parkett-arten', hasChildren: false },
      { id: '3-2', label: 'Parkett-Marken', slug: 'parkett-marken', hasChildren: false },
    ],
  },
  {
    id: '4',
    label: 'Teppichboden',
    slug: 'teppichboden',
    hasChildren: true,
    children: [
      { id: '4-1', label: 'Teppich-Arten', slug: 'teppich-arten', hasChildren: false },
      { id: '4-2', label: 'Teppich-Marken', slug: 'teppich-marken', hasChildren: false },
    ],
  },
  {
    id: '5',
    label: 'Sockelleisten',
    slug: 'sockelleisten',
    hasChildren: true,
    children: [
      { id: '5-1', label: 'Sockelleisten-Arten', slug: 'sockelleisten-arten', hasChildren: false },
      { id: '5-2', label: 'Sockelleisten-Marken', slug: 'sockelleisten-marken', hasChildren: false },
    ],
  },
  {
    id: '6',
    label: 'Dämmung',
    slug: 'daemmung',
    hasChildren: true,
    children: [
      { id: '6-1', label: 'Dämmung-Arten', slug: 'daemmung-arten', hasChildren: false },
      { id: '6-2', label: 'Dämmung-Marken', slug: 'daemmung-marken', hasChildren: false },
    ],
  },
  {
    id: '7',
    label: 'Zubehör',
    slug: 'zubehoer',
    hasChildren: true,
    children: [
      { id: '7-1', label: 'Untergrundvorbereitung', slug: 'untergrundvorbereitung', hasChildren: false },
      { id: '7-2', label: 'Werkzeug', slug: 'werkzeug', hasChildren: false },
      { id: '7-3', label: 'Kleber', slug: 'kleber', hasChildren: false },
      { id: '7-4', label: 'Reinigung & Pflege', slug: 'reinigung-pflege', hasChildren: false },
    ],
  },
];
