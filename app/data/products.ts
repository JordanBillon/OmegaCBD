export interface ProductPrice {
  weight: string
  price: number
}

export interface Product {
  id: string
  slug: string
  name: string
  collection: 'cbd' | 'thx'
  collectionLabel: string
  collectionPath: string
  badge: string
  cbd: string
  origine: string
  image: string
  desc: string
  aromes: string[]
  prices: ProductPrice[]
}

export const products: Product[] = [
  {
    id: 'amnesia-jsh',
    slug: 'amnesia-haze-jsh',
    name: 'Amnesia Haze JSH',
    collection: 'cbd',
    collectionLabel: 'Collection CBD',
    collectionPath: '/produits/cbd',
    badge: 'Indoor',
    cbd: '18%',
    origine: 'Indoor',
    image: '/Amnesia_Indoor_ss-fond.webp',
    desc: "L'Amnesia Haze JSH est une variété emblématique aux arômes puissants d'agrumes et de terre. Cultivée en intérieur dans des conditions strictement contrôlées, elle développe une concentration exceptionnelle en cannabidiol et un profil terpénique riche. Notes citronnées, épicées et boisées se mêlent pour offrir une expérience sensorielle de premier plan. Chaque lot est analysé par un laboratoire accrédité pour garantir une conformité irréprochable.",
    aromes: ['Citron', 'Épices', 'Terre', 'Pin'],
    prices: [{ weight: '2g', price: 7.90 }, { weight: '5g', price: 16.90 }, { weight: '10g', price: 29.90 }]
  },
  {
    id: 'mango-haze',
    slug: 'mango-haze-premium',
    name: 'Mango Haze Premium',
    collection: 'cbd',
    collectionLabel: 'Collection CBD',
    collectionPath: '/produits/cbd',
    badge: 'Premium',
    cbd: '15%',
    origine: 'Indoor',
    image: '/Mango_Haze_ss-fond.webp',
    desc: "La Mango Haze Premium séduit par ses arômes exotiques et sucrés de mangue fraîche. Issue d'une culture indoor soignée, cette variété offre une inflorescence dense et résineuse. Son profil aromatique tropical unique en fait l'une des préférées des amateurs de CBD haut de gamme. Une douceur fruitée associée à une qualité de culture maîtrisée de bout en bout.",
    aromes: ['Mangue', 'Tropical', 'Doux', 'Fruité'],
    prices: [{ weight: '2g', price: 8.90 }, { weight: '5g', price: 18.90 }, { weight: '10g', price: 33.90 }]
  },
  {
    id: 'purple-haze',
    slug: 'purple-haze-premium',
    name: 'Purple Haze Premium',
    collection: 'cbd',
    collectionLabel: 'Collection CBD',
    collectionPath: '/produits/cbd',
    badge: 'Premium',
    cbd: '20%',
    origine: 'Indoor',
    image: '/Purple_Haze-ss-fond.webp',
    desc: "Reconnaissable à ses teintes violacées caractéristiques dues à sa haute teneur en anthocyanes, la Purple Haze Premium est une pièce maîtresse de notre collection. Son profil aromatique floral et fruité, allié à une concentration en CBD de 20%, en fait un produit d'exception pour les connaisseurs les plus exigeants. Une culture indoor premium qui garantit une régularité et une qualité à chaque lot.",
    aromes: ['Floral', 'Baies', 'Boisé', 'Sucré'],
    prices: [{ weight: '2g', price: 8.90 }, { weight: '5g', price: 18.90 }, { weight: '10g', price: 33.90 }]
  },
  {
    id: 'alien-og',
    slug: 'alien-og-thx',
    name: 'Alien OG',
    collection: 'thx',
    collectionLabel: 'Collection THX',
    collectionPath: '/produits/thx',
    badge: 'Exclusif',
    cbd: '22%',
    origine: 'Indoor+',
    image: '/Alien-OG-THX-1.webp',
    desc: "L'Alien OG THX est l'une des variétés les plus puissantes en cannabidiol de notre catalogue. Cultivée en indoor premium avec un contrôle total des paramètres environnementaux, elle développe une résine abondante et un profil terpénique d'une rare complexité. Ses arômes intenses de pin, d'agrumes et de terre en font une pièce de collection. Réservée aux connaisseurs les plus avertis.",
    aromes: ['Pin', 'Citron', 'Terre', 'Résine'],
    prices: [{ weight: '2g', price: 9.90 }, { weight: '5g', price: 21.90 }, { weight: '10g', price: 38.90 }]
  },
  {
    id: 'fantasy',
    slug: 'fantasy-thx',
    name: 'Fantasy',
    collection: 'thx',
    collectionLabel: 'Collection THX',
    collectionPath: '/produits/thx',
    badge: 'Exclusif',
    cbd: '17%',
    origine: 'Indoor',
    image: '/Fleur-THX-1.webp',
    desc: "La Fantasy vous transporte dans un univers sensoriel unique. Ses inflorescences aux teintes chaudes et à la couverture trichomique dense révèlent des arômes floraux et fruités d'une grande finesse. Une variété accessible qui séduit dès la première ouverture par la générosité de son bouquet olfactif. Un équilibre rare entre accessibilité et qualité THX.",
    aromes: ['Floral', 'Fruité', 'Sucré', 'Miel'],
    prices: [{ weight: '2g', price: 8.90 }, { weight: '5g', price: 19.90 }, { weight: '10g', price: 35.90 }]
  },
  {
    id: 'euphoria',
    slug: 'euphoria-thx',
    name: 'Euphoria',
    collection: 'thx',
    collectionLabel: 'Collection THX',
    collectionPath: '/produits/thx',
    badge: 'Exclusif',
    cbd: '19%',
    origine: 'Indoor',
    image: '/euphoria-1.webp',
    desc: "La variété Euphoria est reconnue dans le milieu du CBD pour ses arômes profonds et enveloppants. Ses notes boisées, épicées et légèrement terreuses la distinguent de la concurrence. Avec un taux de CBD de 19% et une qualité de culture irréprochable, l'Euphoria représente l'essence même du savoir-faire OMEGACBD. Une signature olfactive qui se reconnaît dès la première approche.",
    aromes: ['Boisé', 'Épicé', 'Terreux', 'Vanille'],
    prices: [{ weight: '2g', price: 8.90 }, { weight: '5g', price: 19.90 }, { weight: '10g', price: 35.90 }]
  }
]

export const getProductBySlug = (slug: string) => products.find(p => p.slug === slug)
export const getProductsByCollection = (col: 'cbd' | 'thx') => products.filter(p => p.collection === col)
