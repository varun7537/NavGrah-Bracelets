// src/data/Rashibracelets.ts
export type Element = "fire" | "earth" | "air" | "water";

export type Availability = "In Stock" | "Out of Stock";

export interface RashiBracelet {
  id: string;
  name: string;
  slug: string;

  rashi: string;
  rashiId: string;
  rashiEnglish: string;

  element: Element;
  rulingPlanet: string;

  gemstone: string;
  stone: Stone;

  type: BraceletType;
  material: Material;
  color: BraceletColor;

  benefit: string;
  spec: string;

  /** Alias of `benefit`, for components that expect a generic `description`. */
  description: string;

  price: number;
  compareAtPrice?: number;

  /** Alias of `compareAtPrice` (the "M.R.P." shown struck-through in the UI). */
  mrp?: number;

  rating: number;
  reviewCount: number;

  badge?: "bestseller" | "new" | "limited";
  isBestSeller: boolean;

  /** Derived from `badge === "new"`, for components that check a boolean flag. */
  isNew: boolean;

  inStock: boolean;
  availability: Availability;

  createdOrder: number;
  salesRank: number;

  image: string;
  /** Alias of `image`, for components that expect `imageUrl`. */
  imageUrl: string;
  imageAlt: string;
}

export type BraceletProduct = RashiBracelet;

export const ELEMENT_ACCENT: Record<
  Element,
  {
    label: string;
    sanskrit: string;
    base: string;
    dark: string;
    light: string;
  }
> = {
  fire: {
    label: "Fire",
    sanskrit: "Agni",
    light: "#EFAE83",
    base: "#C2622F",
    dark: "#7A3A18",
  },

  earth: {
    label: "Earth",
    sanskrit: "Prithvi",
    light: "#CBC08D",
    base: "#8C7B3E",
    dark: "#584C22",
  },

  air: {
    label: "Air",
    sanskrit: "Vayu",
    light: "#B8C1E8",
    base: "#6E79AC",
    dark: "#3A4268",
  },

  water: {
    label: "Water",
    sanskrit: "Jal",
    light: "#8FC2CB",
    base: "#3C7581",
    dark: "#1E3C44",
  },
};

export interface RashiInfo {
  id: string;
  /** Romanised Sanskrit name, e.g. "Mesha". */
  name: string;
  /** Western zodiac name, e.g. "Aries". */
  english: string;
  /** Devanagari name shown in the Shop-by-Rashi strip and the filters, e.g. "मेष". */
  nameHi: string;
  /** Public path of the rashi photo used by <RashiAvatar />. */
  image: string;
  symbol?: string;
  element: Element;
  rulingPlanet: string;
}

/** Alias so `import { Rashi } from ".../Rashibracelets"` resolves. */
export type Rashi = RashiInfo;

export const RASHIS: RashiInfo[] = [
  {
    id: "mesha",
    name: "Mesha",
    english: "Aries",
    nameHi: "मेष",
    image: "/images/aries_image.jpg",
    symbol: "♈",
    element: "fire",
    rulingPlanet: "Mangal (Mars)",
  },
  {
    id: "vrishabha",
    name: "Vrishabha",
    english: "Taurus",
    nameHi: "वृषभ",
    image: "/images/taurus_image.jpg",
    symbol: "♉",
    element: "earth",
    rulingPlanet: "Shukra (Venus)",
  },
  {
    id: "mithuna",
    name: "Mithuna",
    english: "Gemini",
    nameHi: "मिथुन",
    image: "/images/gemini_image.jpg",
    symbol: "♊",
    element: "air",
    rulingPlanet: "Budh (Mercury)",
  },
  {
    id: "karka",
    name: "Karka",
    english: "Cancer",
    nameHi: "कर्क",
    image: "/images/cancer_image.jpg",
    symbol: "♋",
    element: "water",
    rulingPlanet: "Chandra (Moon)",
  },
  {
    id: "simha",
    name: "Simha",
    english: "Leo",
    nameHi: "सिंह",
    image: "/images/leo_image.jpg",
    symbol: "♌",
    element: "fire",
    rulingPlanet: "Surya (Sun)",
  },
  {
    id: "kanya",
    name: "Kanya",
    english: "Virgo",
    nameHi: "कन्या",
    image: "/images/virgo_image.jpg",
    symbol: "♍",
    element: "earth",
    rulingPlanet: "Budh (Mercury)",
  },
  {
    id: "tula",
    name: "Tula",
    english: "Libra",
    nameHi: "तुला",
    image: "/images/libra_image.jpg",
    symbol: "♎",
    element: "air",
    rulingPlanet: "Shukra (Venus)",
  },
  {
    id: "vrishchika",
    name: "Vrishchika",
    english: "Scorpio",
    nameHi: "वृश्चिक",
    image: "/images/scorpio_image.jpg",
    symbol: "♏",
    element: "water",
    rulingPlanet: "Mangal (Mars)",
  },
  {
    id: "dhanu",
    name: "Dhanu",
    english: "Sagittarius",
    nameHi: "धनु",
    image: "/images/sagitarius_image.jpg",
    symbol: "♐",
    element: "fire",
    rulingPlanet: "Guru (Jupiter)",
  },
  {
    id: "makara",
    name: "Makara",
    english: "Capricorn",
    nameHi: "मकर",
    image: "/images/capricorn_image.jpg",
    symbol: "♑",
    element: "earth",
    rulingPlanet: "Shani (Saturn)",
  },
  {
    id: "kumbha",
    name: "Kumbha",
    english: "Aquarius",
    nameHi: "कुंभ",
    image: "/images/aquarius_image.jpg",
    symbol: "♒",
    element: "air",
    rulingPlanet: "Shani (Saturn)",
  },
  {
    id: "meena",
    name: "Meena",
    english: "Pisces",
    nameHi: "मीन",
    image: "/images/pisces_image.jpg",
    symbol: "♓",
    element: "water",
    rulingPlanet: "Guru (Jupiter)",
  },
];

/**
 * Fast lookup map by rashi ID.
 * Use rashiByIdMap["mesha"] for plain bracket access.
 */
const rashiByIdMap: Record<string, RashiInfo> = Object.fromEntries(
  RASHIS.map((rashi) => [rashi.id, rashi])
);

/**
 * `rashiById` is both callable AND indexable, so both of these work:
 *   rashiById("mesha")
 *   rashiById["mesha"]
 */
export const rashiById: ((id: string) => RashiInfo | undefined) &
  Record<string, RashiInfo> = Object.assign(
  (id: string) => rashiByIdMap[normalizeRashi(id)],
  rashiByIdMap
);

/**
 * Bracelet type filter options.
 */
const BRACELET_TYPES_TUPLE = [
  "Beaded",
  "Gemstone",
  "Silver",
  "Gold Accent",
  "Pearl",
] as const;

export type BraceletType = (typeof BRACELET_TYPES_TUPLE)[number];

export const BRACELET_TYPES: BraceletType[] = [...BRACELET_TYPES_TUPLE];

/**
 * Gemstones available in the current catalogue.
 */
const STONES_TUPLE = [
  "Red Coral",
  "White Zircon",
  "Emerald",
  "Pearl",
  "Ruby",
  "Opal",
  "Yellow Sapphire",
  "Blue Sapphire",
  "Amethyst",
] as const;

export type Stone = (typeof STONES_TUPLE)[number];
export const STONES: Stone[] = [...STONES_TUPLE];

/**
 * Materials/finishes represented by the current products.
 */
const MATERIALS_TUPLE = [
  "Sterling Silver",
  "925 Silver",
  "Silver",
  "Gold-Plated",
  "Rose Gold",
  "Oxidised Silver",
  "Freshwater Pearl",
] as const;

export type Material = (typeof MATERIALS_TUPLE)[number];
export const MATERIALS: Material[] = [...MATERIALS_TUPLE];

/**
 * UI colour filters.
 */
const COLORS_TUPLE = [
  "Red",
  "White",
  "Green",
  "Pearl",
  "Deep Red",
  "Pale",
  "Yellow",
  "Deep Blue",
  "Purple",
] as const;

export type BraceletColor = (typeof COLORS_TUPLE)[number];
export const COLORS: BraceletColor[] = [...COLORS_TUPLE];

export const PRICE_BOUNDS: [number, number] = [0, 5000];

type RashiBraceletInput = Omit<
  RashiBracelet,
  "description" | "mrp" | "isNew" | "imageUrl"
>;

const RASHI_BRACELETS_INPUT: RashiBraceletInput[] = [
  {
    id: "mesha-red-coral",
    name: "Mesha Red Coral Bracelet",
    slug: "mesha-red-coral-bracelet",
    rashi: "Mesha",
    rashiId: "mesha",
    rashiEnglish: "Aries",
    element: "fire",
    rulingPlanet: "Mangal (Mars)",
    gemstone: "Red Coral",
    stone: "Red Coral",
    type: "Beaded",
    material: "Sterling Silver",
    color: "Red",
    benefit: "Sparks initiative and fearless momentum.",
    spec: "8mm beads · sterling silver spacers",
    price: 2199,
    compareAtPrice: 2799,
    rating: 4.7,
    reviewCount: 214,
    badge: "bestseller",
    isBestSeller: true,
    inStock: true,
    availability: "In Stock",
    createdOrder: 1,
    salesRank: 3,
    image: "/images/aries_image.jpg",
    imageAlt: "Red coral bead bracelet with silver spacers for Mesha rashi",
  },
  {
    id: "vrishabha-diamond",
    name: "Vrishabha White Zircon Bracelet",
    slug: "vrishabha-white-zircon-bracelet",
    rashi: "Vrishabha",
    rashiId: "vrishabha",
    rashiEnglish: "Taurus",
    element: "earth",
    rulingPlanet: "Shukra (Venus)",
    gemstone: "White Zircon",
    stone: "White Zircon",
    type: "Gemstone",
    material: "925 Silver",
    color: "White",
    benefit: "Grounds you in comfort, patience and steady progress.",
    spec: "6mm beads · 925 silver clasp",
    price: 2499,
    compareAtPrice: 3199,
    rating: 4.6,
    reviewCount: 168,
    isBestSeller: false,
    inStock: true,
    availability: "In Stock",
    createdOrder: 2,
    salesRank: 6,
    image: "/images/bracelets/vrishabha-white-zircon-bracelet.jpg",
    imageAlt: "White zircon bead bracelet for Vrishabha rashi",
  },
  {
    id: "mithuna-emerald",
    name: "Mithuna Emerald Bracelet",
    slug: "mithuna-emerald-bracelet",
    rashi: "Mithuna",
    rashiId: "mithuna",
    rashiEnglish: "Gemini",
    element: "air",
    rulingPlanet: "Budh (Mercury)",
    gemstone: "Emerald",
    stone: "Emerald",
    type: "Gemstone",
    material: "Gold-Plated",
    color: "Green",
    benefit: "Sharpens curiosity and easy conversation.",
    spec: "7mm beads · gold-plated accents",
    price: 2899,
    rating: 4.8,
    reviewCount: 96,
    badge: "new",
    isBestSeller: false,
    inStock: true,
    availability: "In Stock",
    createdOrder: 3,
    salesRank: 12,
    image: "/images/gemini_image.jpg",
    imageAlt: "Emerald green bead bracelet for Mithuna rashi",
  },
  {
    id: "karka-pearl",
    name: "Karka Pearl Bracelet",
    slug: "karka-pearl-bracelet",
    rashi: "Karka",
    rashiId: "karka",
    rashiEnglish: "Cancer",
    element: "water",
    rulingPlanet: "Chandra (Moon)",
    gemstone: "Pearl",
    stone: "Pearl",
    type: "Pearl",
    material: "Freshwater Pearl",
    color: "Pearl",
    benefit: "Softens the heart and steadies emotional tides.",
    spec: "6mm freshwater pearls · silver clasp",
    price: 1999,
    compareAtPrice: 2499,
    rating: 4.9,
    reviewCount: 302,
    badge: "bestseller",
    isBestSeller: true,
    inStock: true,
    availability: "In Stock",
    createdOrder: 4,
    salesRank: 1,
    image: "/images/cancer_image.jpg",
    imageAlt: "Freshwater pearl bracelet for Karka rashi",
  },
  {
    id: "simha-ruby",
    name: "Simha Ruby Bracelet",
    slug: "simha-ruby-bracelet",
    rashi: "Simha",
    rashiId: "simha",
    rashiEnglish: "Leo",
    element: "fire",
    rulingPlanet: "Surya (Sun)",
    gemstone: "Ruby",
    stone: "Ruby",
    type: "Gemstone",
    material: "Gold-Plated",
    color: "Deep Red",
    benefit: "Restores confidence and warm, natural leadership.",
    spec: "8mm beads · gold-plated spacers",
    price: 3299,
    compareAtPrice: 3999,
    rating: 4.8,
    reviewCount: 187,
    isBestSeller: false,
    inStock: true,
    availability: "In Stock",
    createdOrder: 5,
    salesRank: 4,
    image: "/images/leo_image.jpg",
    imageAlt: "Deep red ruby bead bracelet for Simha rashi",
  },
  {
    id: "kanya-emerald",
    name: "Kanya Emerald Bracelet",
    slug: "kanya-emerald-bracelet",
    rashi: "Kanya",
    rashiId: "kanya",
    rashiEnglish: "Virgo",
    element: "earth",
    rulingPlanet: "Budh (Mercury)",
    gemstone: "Emerald",
    stone: "Emerald",
    type: "Gemstone",
    material: "925 Silver",
    color: "Green",
    benefit: "Brings order, precision and quiet focus.",
    spec: "6mm beads · 925 silver clasp",
    price: 2799,
    rating: 4.5,
    reviewCount: 124,
    isBestSeller: false,
    inStock: true,
    availability: "In Stock",
    createdOrder: 6,
    salesRank: 10,
    image: "/images/virgo_image.jpg",
    imageAlt: "Emerald bead bracelet for Kanya rashi",
  },
  {
    id: "tula-opal",
    name: "Tula Opal Bracelet",
    slug: "tula-opal-bracelet",
    rashi: "Tula",
    rashiId: "tula",
    rashiEnglish: "Libra",
    element: "air",
    rulingPlanet: "Shukra (Venus)",
    gemstone: "Opal",
    stone: "Opal",
    type: "Gemstone",
    material: "Rose Gold",
    color: "Pale",
    benefit: "Balances relationships and everyday decisions.",
    spec: "7mm beads · rose gold accents",
    price: 2599,
    compareAtPrice: 3099,
    rating: 4.7,
    reviewCount: 143,
    isBestSeller: false,
    inStock: true,
    availability: "In Stock",
    createdOrder: 7,
    salesRank: 8,
    image: "/images/libra_image.jpg",
    imageAlt: "Pale opal bead bracelet for Tula rashi",
  },
  {
    id: "vrishchika-red-coral",
    name: "Vrishchika Red Coral Bracelet",
    slug: "vrishchika-red-coral-bracelet",
    rashi: "Vrishchika",
    rashiId: "vrishchika",
    rashiEnglish: "Scorpio",
    element: "water",
    rulingPlanet: "Mangal (Mars)",
    gemstone: "Red Coral",
    stone: "Red Coral",
    type: "Beaded",
    material: "Oxidised Silver",
    color: "Red",
    benefit: "Channels intensity into quiet resolve.",
    spec: "8mm beads · oxidised silver",
    price: 2299,
    rating: 4.6,
    reviewCount: 151,
    isBestSeller: false,
    inStock: false,
    availability: "Out of Stock",
    createdOrder: 8,
    salesRank: 7,
    image: "/images/scorpio_image.jpg",
    imageAlt: "Red coral bracelet with oxidised silver for Vrishchika rashi",
  },
  {
    id: "dhanu-yellow-sapphire",
    name: "Dhanu Yellow Sapphire Bracelet",
    slug: "dhanu-yellow-sapphire-bracelet",
    rashi: "Dhanu",
    rashiId: "dhanu",
    rashiEnglish: "Sagittarius",
    element: "fire",
    rulingPlanet: "Guru (Jupiter)",
    gemstone: "Yellow Sapphire",
    stone: "Yellow Sapphire",
    type: "Gemstone",
    material: "Gold-Plated",
    color: "Yellow",
    benefit: "Opens the mind to growth and good fortune.",
    spec: "7mm beads · gold-plated clasp",
    price: 3499,
    compareAtPrice: 4299,
    rating: 4.9,
    reviewCount: 231,
    badge: "bestseller",
    isBestSeller: true,
    inStock: true,
    availability: "In Stock",
    createdOrder: 9,
    salesRank: 2,
    image: "/images/sagitarius_image.jpg",
    imageAlt: "Golden yellow sapphire bead bracelet for Dhanu rashi",
  },
  {
    id: "makara-blue-sapphire",
    name: "Makara Blue Sapphire Bracelet",
    slug: "makara-blue-sapphire-bracelet",
    rashi: "Makara",
    rashiId: "makara",
    rashiEnglish: "Capricorn",
    element: "earth",
    rulingPlanet: "Shani (Saturn)",
    gemstone: "Blue Sapphire",
    stone: "Blue Sapphire",
    type: "Silver",
    material: "Sterling Silver",
    color: "Deep Blue",
    benefit: "Builds discipline for long, patient climbs.",
    spec: "8mm beads · sterling silver",
    price: 3799,
    rating: 4.7,
    reviewCount: 118,
    badge: "limited",
    isBestSeller: false,
    inStock: true,
    availability: "In Stock",
    createdOrder: 10,
    salesRank: 11,
    image: "/images/capricorn_image.jpg",
    imageAlt: "Deep blue sapphire bead bracelet for Makara rashi",
  },
  {
    id: "kumbha-amethyst",
    name: "Kumbha Amethyst Bracelet",
    slug: "kumbha-amethyst-bracelet",
    rashi: "Kumbha",
    rashiId: "kumbha",
    rashiEnglish: "Aquarius",
    element: "air",
    rulingPlanet: "Shani (Saturn)",
    gemstone: "Amethyst",
    stone: "Amethyst",
    type: "Beaded",
    material: "Silver",
    color: "Purple",
    benefit: "Frees original thought and independent vision.",
    spec: "8mm beads · silver spacers",
    price: 1899,
    compareAtPrice: 2399,
    rating: 4.6,
    reviewCount: 176,
    isBestSeller: false,
    inStock: true,
    availability: "In Stock",
    createdOrder: 11,
    salesRank: 5,
    image: "/images/aquarius_image.jpg",
    imageAlt: "Purple amethyst bead bracelet for Kumbha rashi",
  },
  {
    id: "meena-yellow-sapphire",
    name: "Meena Yellow Sapphire Bracelet",
    slug: "meena-yellow-sapphire-bracelet",
    rashi: "Meena",
    rashiId: "meena",
    rashiEnglish: "Pisces",
    element: "water",
    rulingPlanet: "Guru (Jupiter)",
    gemstone: "Yellow Sapphire",
    stone: "Yellow Sapphire",
    type: "Gold Accent",
    material: "Gold-Plated",
    color: "Yellow",
    benefit: "Deepens compassion and creative intuition.",
    spec: "7mm beads · gold-plated accents",
    price: 3299,
    rating: 4.8,
    reviewCount: 139,
    isBestSeller: false,
    inStock: true,
    availability: "In Stock",
    createdOrder: 12,
    salesRank: 9,
    image: "/images/pisces_image.jpg",
    imageAlt: "Yellow sapphire bead bracelet for Meena rashi",
  },
];

export const RASHI_BRACELETS: RashiBracelet[] = RASHI_BRACELETS_INPUT.map(
  (bracelet) => ({
    ...bracelet,
    description: bracelet.benefit,
    mrp: bracelet.compareAtPrice,
    isNew: bracelet.badge === "new",
    imageUrl: bracelet.image,
  })
);

export const BRACELETS = RASHI_BRACELETS;

/** Exported alias PRODUCTS to support imports expecting PRODUCTS. */
export const PRODUCTS = RASHI_BRACELETS;

export const braceletById: Record<string, RashiBracelet> = Object.fromEntries(
  RASHI_BRACELETS.map((bracelet) => [bracelet.id, bracelet])
);

export const braceletBySlug: Record<string, RashiBracelet> =
  Object.fromEntries(
    RASHI_BRACELETS.map((bracelet) => [bracelet.slug, bracelet])
  );

export function normalizeRashi(value: string): string {
  const normalized = value.trim().toLowerCase();

  const englishMatch = RASHIS.find(
    (rashi) => rashi.english.toLowerCase() === normalized
  );

  if (englishMatch) {
    return englishMatch.id;
  }

  const rashiMatch = RASHIS.find(
    (rashi) => rashi.name.toLowerCase() === normalized
  );

  if (rashiMatch) {
    return rashiMatch.id;
  }

  return normalized;
}

export function getRashiById(id: string): RashiInfo | undefined {
  return rashiByIdMap[normalizeRashi(id)];
}

export function getBraceletsByRashi(rashi: string): RashiBracelet[] {
  const normalized = normalizeRashi(rashi);

  return RASHI_BRACELETS.filter(
    (bracelet) =>
      bracelet.rashi.toLowerCase() === normalized ||
      bracelet.rashiId === normalized ||
      bracelet.id.startsWith(`${normalized}-`)
  );
}

export function getBraceletById(id: string): RashiBracelet | undefined {
  return braceletById[id];
}

export function getBraceletBySlug(slug: string): RashiBracelet | undefined {
  return braceletBySlug[slug];
}

export function discountPercent(bracelet: RashiBracelet): number {
  const listPrice = bracelet.compareAtPrice ?? bracelet.mrp;

  if (!listPrice || listPrice <= bracelet.price) {
    return 0;
  }

  return Math.round(((listPrice - bracelet.price) / listPrice) * 100);
}