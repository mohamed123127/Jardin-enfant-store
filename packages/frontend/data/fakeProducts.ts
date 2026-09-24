export interface StoreProductVariant {
  id: number;
  quantity: number;
  specifications: {
    attribute: string;
    value: string;
  }[];
}

export interface StoreProduct {
  id: number;
  tenantId?: number;
  name: string;
  barcode?: string;
  sku?: string;
  ref?: string;
  description?: string;
  costPrice?: number | string;
  sellingPrice: number | string;
  discountedPrice?: number | string;
  previewImage: string;
  images?: string[];
  category?: string;
  ageGroup?: string;
  rating?: number;
  reviewsCount?: number;
  quantity?: number;
  status?: "active" | "inactive" | "archived";
  badge?: "Promo" | "Nouveau" | "Bestseller" | "Coup de Cœur" | string;
  features?: string[];
  colors?: { name: string; hex: string; inStock?: boolean; rawName?: string }[];
  sizes?: { name: string; inStock?: boolean; rawName?: string }[];
  variants?: StoreProductVariant[];
}

export const FAKE_PRODUCTS: StoreProduct[] = [
  {
    id: 13,
    tenantId: 1,
    name: "Affnane",
    barcode: "613000001013",
    sku: "AFF-ENS-01",
    ref: "ENS-013",
    description: "Un ensemble adorable et confortable pour votre petite princesse. Veste en maille douce avec motifs lapin, t-shirt assorti et pantalon en coton, idéal pour le quotidien comme pour les sorties. Un style tendre et moderne qui fait craquer !",
    costPrice: 2100,
    sellingPrice: 4900,
    discountedPrice: 3200,
    previewImage: "/products/affnane-1.jpg",
    images: [
      "/products/affnane-1.jpg",
      "/products/affnane-2.jpg",
      "/products/affnane-3.jpg",
      "/products/affnane-4.jpg"
    ],
    category: "Ensembles",
    ageGroup: "2 - 3 ans",
    rating: 4.8,
    reviewsCount: 24,
    quantity: 2,
    status: "active",
    badge: "Promo",
    features: [
      "Maille tricotée douce et hypoallergénique",
      "Col marin avec finitions brodées soignées",
      "Pantalon molletonné avec taille élastique ajustable",
      "Boutons en bois naturel sécurisés"
    ],
    colors: [
      { name: "Lavande", hex: "#c4b5fd", inStock: true },
      { name: "Rose Poudré", hex: "#fbcfe8", inStock: true },
      { name: "Beige Crème", hex: "#f5ebe0", inStock: true },
      { name: "Vert Sauge", hex: "#a7c4bc", inStock: true },
      { name: "Bleu Doux", hex: "#bfdbfe", inStock: true }
    ],
    sizes: [
      { name: "1-2 ans", inStock: false },
      { name: "2-3 ans", inStock: true },
      { name: "3-4 ans", inStock: false },
      { name: "4-5 ans", inStock: true },
      { name: "5-6 ans", inStock: true }
    ]
  },
  {
    id: 18,
    tenantId: 1,
    name: "Ensemble Jogging 2 Pièces Alphabet",
    barcode: "000000018",
    description: "Ensemble confortable 2 pièces comprenant un sweat imprimé alphabet et son pantalon de jogging assorti. Conçu en coton doux pour le confort de votre enfant toute la journée.",
    costPrice: 2000,
    sellingPrice: 4400,
    discountedPrice: 4400,
    previewImage: "https://res.cloudinary.com/dpmow9eng/image/upload/v1757542802/1000010143_r9jkjs.jpg",
    images: [
      "https://res.cloudinary.com/dpmow9eng/image/upload/v1757542802/1000010143_r9jkjs.jpg",
      "https://res.cloudinary.com/dpmow9eng/image/upload/v1757542803/1000010146_pq4dr1.jpg",
      "https://res.cloudinary.com/dpmow9eng/image/upload/v1757584881/14ba5e1e-ea80-40ba-b70b-da8b4a1385c1_y47clk.jpg"
    ],
    category: "Ensembles",
    ageGroup: "1 - 6 ans",
    rating: 4.9,
    reviewsCount: 18,
    quantity: 2,
    status: "active",
    badge: "Bestseller",
    variants: [
      { id: 107, quantity: 0, specifications: [{ attribute: "Color", value: "beige" }, { attribute: "Size", value: "1-2" }] },
      { id: 108, quantity: 0, specifications: [{ attribute: "Color", value: "beige" }, { attribute: "Size", value: "2-3" }] },
      { id: 111, quantity: 1, specifications: [{ attribute: "Color", value: "beige" }, { attribute: "Size", value: "5-6" }] }
    ]
  },
  {
    id: 14,
    tenantId: 1,
    name: "Ensemble Sweat Ourson & Pantalon Jogging Marine",
    barcode: "613000001014",
    description: "Sweatshirt marron chaud avec écusson ourson doux et jogging bleu marine pour garçons et filles.",
    costPrice: 1900,
    sellingPrice: 3800,
    discountedPrice: 2900,
    previewImage: "/products/bear-outfit.jpg",
    images: ["/products/bear-outfit.jpg"],
    category: "Ensembles",
    ageGroup: "1 - 5 ans",
    rating: 4.9,
    reviewsCount: 15,
    quantity: 7,
    status: "active",
    badge: "Coup de Cœur"
  },
  {
    id: 15,
    tenantId: 1,
    name: "Veste Sherpa Zippée avec Mini Sacoche & Pantalon",
    barcode: "613000001015",
    description: "Veste molletonnée ultra-douce style mouton avec fermeture éclair et mini besace kaki intégrée.",
    costPrice: 2400,
    sellingPrice: 4200,
    previewImage: "/products/white-jacket.jpg",
    images: ["/products/white-jacket.jpg"],
    category: "Ensembles",
    ageGroup: "2 - 6 ans",
    rating: 4.7,
    reviewsCount: 19,
    quantity: 4,
    status: "active",
    badge: "Nouveau"
  },
  {
    id: 1,
    tenantId: 1,
    name: "Table d'Activités Sensorielle & Bac à Sable Montessori",
    barcode: "613000001001",
    sku: "TAB-ACT-01",
    ref: "MONT-001",
    description: "Table ergonomique en bois naturel d'hévéa dotée de 2 bacs amovibles pour les jeux sensoriels (sable, eau, graines) et plateaux réversibles tableau noir/blanc.",
    costPrice: 8500,
    sellingPrice: 13500,
    discountedPrice: 11900,
    previewImage: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80"
    ],
    category: "Mobilier & Rangement",
    ageGroup: "2 - 6 ans",
    rating: 4.9,
    reviewsCount: 38,
    quantity: 12,
    status: "active",
    badge: "Bestseller",
    features: ["Bois massif naturel", "2 bacs hermétiques inclus", "Nettoyage facile", "Plateau double face"]
  },
  {
    id: 2,
    tenantId: 1,
    name: "Ensemble de 100 Blocs de Construction en Bois Pastel",
    barcode: "613000001002",
    sku: "BLOC-100-PAS",
    ref: "MONT-002",
    description: "Blocs géométriques aux teintes pastel douces conçus pour stimuler l'imagination spatiale, la motricité fine et l'équilibre dès la petite section.",
    costPrice: 2200,
    sellingPrice: 3900,
    previewImage: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80"
    ],
    category: "Jeux Éducatifs",
    ageGroup: "1 - 5 ans",
    rating: 4.8,
    reviewsCount: 52,
    quantity: 25,
    status: "active",
    badge: "Coup de Cœur",
    features: ["Peinture à l'eau non toxique", "Coins arrondis sécurisés", "Pochette de rangement en coton bio"]
  },
  {
    id: 3,
    tenantId: 1,
    name: "Parcours de Motricité Arc-en-Ciel & Triangle de Pikler",
    barcode: "613000001003",
    sku: "PIK-TRI-03",
    ref: "MOT-003",
    description: "Structure d'escalade d'intérieur évolutive en bois de hêtre robuste. Favorise l'agilité, l'équilibre et la confiance en soi des tout-petits.",
    costPrice: 14000,
    sellingPrice: 22500,
    discountedPrice: 18900,
    previewImage: "https://images.unsplash.com/photo-1566454544259-f4b94c3d758c?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1566454544259-f4b94c3d758c?auto=format&fit=crop&w=800&q=80"
    ],
    category: "Éveil & Motricité",
    ageGroup: "1 - 4 ans",
    rating: 5.0,
    reviewsCount: 19,
    quantity: 5,
    status: "active",
    badge: "Promo",
    features: ["Structure pliable", "Supporte jusqu'à 50 kg", "Normes de sécurité européennes CE"]
  },
  {
    id: 4,
    tenantId: 1,
    name: "Super Pack Peinture aux Doigts Lavable & Pinceaux Ergonomiques",
    barcode: "613000001004",
    sku: "ART-GOUP-12",
    ref: "ART-004",
    description: "Lot complet de 12 gouaches lavables à l'eau, 6 pinceaux à manche gros calibre pour petites mains, 4 éponges texturées et 2 tabliers imperméables.",
    costPrice: 1600,
    sellingPrice: 2800,
    discountedPrice: 2400,
    previewImage: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80"
    ],
    category: "Arts & Créativité",
    ageGroup: "2 - 6 ans",
    rating: 4.7,
    reviewsCount: 44,
    quantity: 30,
    status: "active",
    badge: "Promo",
    features: ["100% lavable sur textiles et peau", "Formule hypoallergénique", "Tabliers inclus"]
  },
  {
    id: 5,
    tenantId: 1,
    name: "Bibliothèque Frontale Montessori Basse en Bois Naturel",
    barcode: "613000001005",
    sku: "BIB-FRONT-05",
    ref: "MEUB-005",
    description: "Bibliothèque à hauteur d'enfant permettant d'exposer les livres de face pour encourager l'autonomie et l'amour de la lecture dès le plus jeune âge.",
    costPrice: 6200,
    sellingPrice: 9800,
    previewImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80"
    ],
    category: "Mobilier & Rangement",
    ageGroup: "1 - 6 ans",
    rating: 4.9,
    reviewsCount: 27,
    quantity: 8,
    status: "active",
    badge: "Bestseller",
    features: ["Accès facile à hauteur d'enfant", "Contenance 30+ livres", "Fixation murale anti-basculement incluse"]
  },
  {
    id: 6,
    tenantId: 1,
    name: "Kit d'Éveil Musical 10 Instruments en Bois & Cuivre",
    barcode: "613000001006",
    sku: "MUS-KIT-10",
    ref: "EVE-006",
    description: "Coffret complet d'initiation musicale : xylophone accordé, tambourin, maracas, triangle, grelots et castagnettes présentés dans un sac à dos en tissu.",
    costPrice: 2900,
    sellingPrice: 4600,
    discountedPrice: 3950,
    previewImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80"
    ],
    category: "Livres & Musique",
    ageGroup: "2 - 6 ans",
    rating: 4.8,
    reviewsCount: 31,
    quantity: 18,
    status: "active",
    badge: "Promo",
    features: ["10 instruments variés", "Sonorités douces adaptées aux oreilles des enfants", "Sac de transport inclus"]
  },
  {
    id: 7,
    tenantId: 1,
    name: "Grand Puzzle Carte du Monde en Bois & Animaux Magnétiques",
    barcode: "613000001007",
    sku: "PUZ-MAP-07",
    ref: "EDU-007",
    description: "Puzzle éducatif géant magnétique de 60 pièces représentant les continents, les océans et la faune mondiale pour apprendre la géographie en s'amusant.",
    costPrice: 2600,
    sellingPrice: 4200,
    previewImage: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80"
    ],
    category: "Jeux Éducatifs",
    ageGroup: "3 - 7 ans",
    rating: 4.9,
    reviewsCount: 63,
    quantity: 14,
    status: "active",
    badge: "Nouveau",
    features: ["Pièces magnétiques grand format", "Illustrations détaillées", "Corde de suspension murale incluse"]
  },
  {
    id: 8,
    tenantId: 1,
    name: "Tapis Géant d'Éveil et Motricité Épais Pliable (200x180cm)",
    barcode: "613000001008",
    sku: "TAP-MOT-08",
    ref: "MOT-008",
    description: "Tapis en mousse XPE ultra-dense de 1.5cm d'épaisseur, imperméable et réversible (face ville/circuits et face motifs scandinaves apaisants).",
    costPrice: 3800,
    sellingPrice: 6200,
    discountedPrice: 5400,
    previewImage: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=800&q=80"
    ],
    category: "Éveil & Motricité",
    ageGroup: "Dès la naissance",
    rating: 4.9,
    reviewsCount: 88,
    quantity: 20,
    status: "active",
    badge: "Bestseller",
    features: ["Mousse XPE sans BPA ni phtalates", "Imperméable et lavable d'un coup d'éponge", "Pliable en 3 secondes"]
  },
  {
    id: 9,
    tenantId: 1,
    name: "Atelier Pâte à Modeler Naturelle & 15 Accessoires d'Emporte-Pièce",
    barcode: "613000001009",
    sku: "ART-PAT-09",
    ref: "ART-009",
    description: "8 pots de pâte à modeler végétale ultra-souple et non collante aux arômes fruités doux, avec rouleau, roulettes et moules ergonomiques.",
    costPrice: 1200,
    sellingPrice: 2100,
    previewImage: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80"
    ],
    category: "Arts & Créativité",
    ageGroup: "2 - 6 ans",
    rating: 4.6,
    reviewsCount: 22,
    quantity: 3,
    status: "active",
    badge: "Promo",
    features: ["Pâte 100% naturelle à base de farine de blé", "Ne sèche pas rapidement", "Outils en plastique recyclé"]
  },
  {
    id: 10,
    tenantId: 1,
    name: "Chariot de Rangement Mobile à 6 Bacs Multicolores pour Classe",
    barcode: "613000001010",
    sku: "MEU-CHAR-10",
    ref: "MEUB-010",
    description: "Meuble de tri sur roulettes autobloquantes avec bacs translucides amovibles. Idéal pour organiser les jouets et activités de groupe en crèche ou maternelle.",
    costPrice: 7500,
    sellingPrice: 11500,
    previewImage: "https://images.unsplash.com/photo-1595867818082-083862f3d630?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1595867818082-083862f3d630?auto=format&fit=crop&w=800&q=80"
    ],
    category: "Mobilier & Rangement",
    ageGroup: "Maternelle & Crèche",
    rating: 4.7,
    reviewsCount: 16,
    quantity: 6,
    status: "active",
    features: ["4 roulettes pivotantes à 360° avec freins", "Bacs légers faciles à manipuler", "Structure métallique renforcée"]
  },
  {
    id: 11,
    tenantId: 1,
    name: "Jeu de Tri et Classification des Couleurs & Formes Montessori",
    barcode: "613000001011",
    sku: "EDU-TRI-11",
    ref: "MONT-011",
    description: "Plateau en bois avec pinces et cuillères ergonomiques pour trier 60 boules en feutre par couleur dans les coupelles correspondantes.",
    costPrice: 1700,
    sellingPrice: 3100,
    discountedPrice: 2650,
    previewImage: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80"
    ],
    category: "Jeux Éducatifs",
    ageGroup: "2 - 5 ans",
    rating: 4.9,
    reviewsCount: 47,
    quantity: 16,
    status: "active",
    badge: "Promo",
    features: ["Développe la tenue du crayon et la pince", "Matériaux 100% naturels", "Fiches modèles incluses"]
  },
  {
    id: 12,
    tenantId: 1,
    name: "Collection 6 Livres Éducatifs Tactiles & Histoires du Soir",
    barcode: "613000001012",
    sku: "LIV-TACT-12",
    ref: "LIV-012",
    description: "Coffret de 6 livres cartonnés avec matières à toucher, textures douces, flaps à soulever et jolies histoires éducatives sur les émotions et la nature.",
    costPrice: 2000,
    sellingPrice: 3600,
    previewImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
    ],
    category: "Livres & Musique",
    ageGroup: "1 - 4 ans",
    rating: 4.8,
    reviewsCount: 35,
    quantity: 22,
    status: "active",
    badge: "Coup de Cœur",
    features: ["Carton épais ultra-résistant", "Textures sensorielles variées", "Histoires bienveillantes"]
  }
];
