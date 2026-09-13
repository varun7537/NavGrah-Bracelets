import type { StaticImageData } from "next/image";

import AriesImg from "../../public/images/aries_image.jpg";
import TaurusImg from "../../public/images/taurus_image.jpg";
import GeminiImg from "../../public/images/gemini_image.jpg";
import CancerImg from "../../public/images/cancer_image.jpg";
import LeoImg from "../../public/images/leo_image.jpg";
import VirgoImg from "../../public/images/virgo_image.jpg";
import LibraImg from "../../public/images/libra_image.jpg";
import ScorpioImg from "../../public/images/scorpio_image.jpg";
import SagittariusImg from "../../public/images/sagitarius_image.jpg";
import CapricornImg from "../../public/images/capricorn_image.jpg";
import AquariusImg from "../../public/images/aquarius_image.jpg";
import PiscesImg from "../../public/images/pisces_image.jpg";

export interface Rashi {
  id: string;
  nameHi: string;
  nameEn: string;
  /** Kept for accessible labels / sr-only text — no longer rendered visually. */
  symbol: string;
  /** Photo used everywhere a rashi needs a visual (selector, filters, product cards). */
  image: StaticImageData;
  dateRange: string;
  rulingPlanet: string;
  primaryStone: string;
}

export const RASHIS: Rashi[] = [
  { id: "mesh", nameHi: "Mesh", nameEn: "Aries", symbol: "♈", image: AriesImg, dateRange: "Mar 21 – Apr 19", rulingPlanet: "Mars", primaryStone: "Red Coral" },
  { id: "vrishabh", nameHi: "Vrishabh", nameEn: "Taurus", symbol: "♉", image: TaurusImg, dateRange: "Apr 20 – May 20", rulingPlanet: "Venus", primaryStone: "Diamond" },
  { id: "mithun", nameHi: "Mithun", nameEn: "Gemini", symbol: "♊", image: GeminiImg, dateRange: "May 21 – Jun 20", rulingPlanet: "Mercury", primaryStone: "Emerald" },
  { id: "kark", nameHi: "Kark", nameEn: "Cancer", symbol: "♋", image: CancerImg, dateRange: "Jun 21 – Jul 22", rulingPlanet: "Moon", primaryStone: "Pearl" },
  { id: "singh", nameHi: "Singh", nameEn: "Leo", symbol: "♌", image: LeoImg, dateRange: "Jul 23 – Aug 22", rulingPlanet: "Sun", primaryStone: "Ruby" },
  { id: "kanya", nameHi: "Kanya", nameEn: "Virgo", symbol: "♍", image: VirgoImg, dateRange: "Aug 23 – Sep 22", rulingPlanet: "Mercury", primaryStone: "Emerald" },
  { id: "tula", nameHi: "Tula", nameEn: "Libra", symbol: "♎", image: LibraImg, dateRange: "Sep 23 – Oct 22", rulingPlanet: "Venus", primaryStone: "Opal" },
  { id: "vrishchik", nameHi: "Vrishchik", nameEn: "Scorpio", symbol: "♏", image: ScorpioImg, dateRange: "Oct 23 – Nov 21", rulingPlanet: "Mars", primaryStone: "Red Coral" },
  { id: "dhanu", nameHi: "Dhanu", nameEn: "Sagittarius", symbol: "♐", image: SagittariusImg, dateRange: "Nov 22 – Dec 21", rulingPlanet: "Jupiter", primaryStone: "Yellow Sapphire" },
  { id: "makar", nameHi: "Makar", nameEn: "Capricorn", symbol: "♑", image: CapricornImg, dateRange: "Dec 22 – Jan 19", rulingPlanet: "Saturn", primaryStone: "Blue Sapphire" },
  { id: "kumbh", nameHi: "Kumbh", nameEn: "Aquarius", symbol: "♒", image: AquariusImg, dateRange: "Jan 20 – Feb 18", rulingPlanet: "Saturn", primaryStone: "Blue Sapphire" },
  { id: "meen", nameHi: "Meen", nameEn: "Pisces", symbol: "♓", image: PiscesImg, dateRange: "Feb 19 – Mar 20", rulingPlanet: "Jupiter", primaryStone: "Yellow Sapphire" },
];

export interface BraceletProduct {
  id: string;
  name: string;
  rashiId: string;
  imageUrl: string;
  stone: string;
  material: string;
  color: string;
  type: string;
  description: string;
  price: number;
  mrp: number;
  rating: number;
  reviewCount: number;
  availability: "in-stock" | "out-of-stock";
  isNew: boolean;
  isBestSeller: boolean;
  createdOrder: number; // lower = newer, used for "New Arrivals" sort
  salesRank: number; // lower = better selling, used for "Best Selling" sort
}

interface Variant {
  type: string;
  material: string;
  color: string;
  price: number;
  mrp: number;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isBestSeller: boolean;
  availability: "in-stock" | "out-of-stock";
  descriptionTemplate: (stone: string, rashiEn: string) => string;
}

// Three recurring styles, cycled per rashi so the whole collection stays
// varied in type / material / color / price without 36 one-off objects.
const VARIANTS: Variant[] = [
  {
    type: "Beaded Bracelet",
    material: "Sterling Silver",
    color: "Silver",
    price: 1499,
    mrp: 1799,
    rating: 4.6,
    reviewCount: 182,
    isNew: false,
    isBestSeller: true,
    availability: "in-stock",
    descriptionTemplate: (stone, rashiEn) =>
      `Hand-strung ${stone.toLowerCase()} beads on a sterling silver base, chosen for ${rashiEn}. Worn daily for calm focus and steady confidence.`,
  },
  {
    type: "Chain Bracelet",
    material: "Rose Gold Plated Brass",
    color: "Rose Gold",
    price: 2199,
    mrp: 2199,
    rating: 4.4,
    reviewCount: 94,
    isNew: true,
    isBestSeller: false,
    availability: "in-stock",
    descriptionTemplate: (stone, rashiEn) =>
      `A delicate chain bracelet finished with a single ${stone.toLowerCase()} charm — a subtle, everyday piece for ${rashiEn} natives.`,
  },
  {
    type: "Cuff Bracelet",
    material: "Panchdhatu",
    color: "Antique Gold",
    price: 2799,
    mrp: 3499,
    rating: 4.8,
    reviewCount: 251,
    isNew: false,
    isBestSeller: true,
    availability: "in-stock",
    descriptionTemplate: (stone, rashiEn) =>
      `A traditional five-metal (Panchdhatu) cuff set with ${stone.toLowerCase()}, designed for ${rashiEn} — our most gifted style.`,
  },
];

function buildProducts(): BraceletProduct[] {
  const products: BraceletProduct[] = [];
  let order = 0;

  RASHIS.forEach((rashi, rashiIndex) => {
    VARIANTS.forEach((variant, variantIndex) => {
      order += 1;
      const id = `${rashi.id}-${variantIndex + 1}`;
      // Make one product per rashi occasionally out of stock, so the
      // "Availability" filter has something real to filter on.
      const outOfStock = (rashiIndex + variantIndex) % 7 === 0;

      products.push({
        id,
        name: `${rashi.primaryStone} ${variant.type} — ${rashi.nameEn}`,
        rashiId: rashi.id,
        imageUrl: `/products/bracelets/${id}.jpg`,
        stone: rashi.primaryStone,
        material: variant.material,
        color: variant.color,
        type: variant.type,
        description: variant.descriptionTemplate(rashi.primaryStone, rashi.nameEn),
        price: variant.price + rashiIndex * 25,
        mrp: variant.mrp + rashiIndex * 25,
        rating: Math.round((variant.rating - (rashiIndex % 3) * 0.1) * 10) / 10,
        reviewCount: variant.reviewCount + rashiIndex * 7,
        availability: outOfStock ? "out-of-stock" : variant.availability,
        isNew: variant.isNew || rashiIndex % 5 === 0,
        isBestSeller: variant.isBestSeller && rashiIndex % 4 !== 0,
        createdOrder: 1000 - order, // later-built rashis look "newer"
        salesRank: (rashiIndex * VARIANTS.length + variantIndex) % 11,
      });
    });
  });

  return products;
}

export const PRODUCTS: BraceletProduct[] = buildProducts();

export const BRACELET_TYPES = Array.from(new Set(PRODUCTS.map((p) => p.type))).sort();
export const STONES = Array.from(new Set(PRODUCTS.map((p) => p.stone))).sort();
export const MATERIALS = Array.from(new Set(PRODUCTS.map((p) => p.material))).sort();
export const COLORS = Array.from(new Set(PRODUCTS.map((p) => p.color))).sort();
export const PRICE_BOUNDS: [number, number] = [
  Math.min(...PRODUCTS.map((p) => p.price)),
  Math.max(...PRODUCTS.map((p) => p.price)),
];

export function discountPercent(product: BraceletProduct): number {
  if (product.mrp <= product.price) return 0;
  return Math.round(((product.mrp - product.price) / product.mrp) * 100);
}

export function rashiById(id: string): Rashi | undefined {
  return RASHIS.find((r) => r.id === id);
}