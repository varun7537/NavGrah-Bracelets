// src/data/Custombracelet.ts

export type Gender = "female" | "male" | "other";
export type KundliMode = "manual" | "upload";

export type FocusArea =
  | "general"
  | "career"
  | "wealth"
  | "health"
  | "relationship"
  | "education"
  | "protection";

export const FOCUS_AREAS: { id: FocusArea; label: string }[] = [
  { id: "general", label: "General wellbeing" },
  { id: "career", label: "Career & work" },
  { id: "wealth", label: "Money & business" },
  { id: "health", label: "Health" },
  { id: "relationship", label: "Marriage & relationships" },
  { id: "education", label: "Studies & focus" },
  { id: "protection", label: "Protection from negativity" },
];

export type WristSize = "" | "xs" | "s" | "m" | "l" | "xl" | "unsure";

export const WRIST_SIZES: { id: Exclude<WristSize, "">; label: string }[] = [
  { id: "xs", label: "Extra small — under 14 cm" },
  { id: "s", label: "Small — 14 to 15.5 cm" },
  { id: "m", label: "Medium — 15.5 to 17 cm" },
  { id: "l", label: "Large — 17 to 18.5 cm" },
  { id: "xl", label: "Extra large — over 18.5 cm" },
  { id: "unsure", label: "Not sure, send me a sizing guide" },
];

export interface StoneOption {
  id: string;
  label: string;
  /** Ruling planet or short note shown under the label. */
  helper?: string;
  swatch: string;
}

export interface CustomBraceletProduct {
  id: string;
  name: string;
  basePrice: number;
  imageUrl: string;
  imageAlt: string;
}

export interface AstrologyDetails {
  fullName: string;
  gender: Gender | "";
  phone: string;
  whatsappSameAsPhone: boolean;
  email: string;

  kundliMode: KundliMode;
  dob: string;
  timeOfBirth: string;
  timeUnknown: boolean;
  placeOfBirth: string;
  kundliFileName: string | null;

  stonePreferences: string[];
  noStonePreference: boolean;

  wristSize: WristSize;
  focusArea: FocusArea;
  notes: string;
  consent: boolean;
}

export interface AstrologerRecommendation {
  summary: string;
  recommendedStones: string[];
  recommendedMetal?: string;
  /** What the customer pays. Nothing is deducted — there is no token now. */
  finalAmount: number;
  astrologerName?: string;
  beadCount?: number;
  wearInstructions?: string;
  deliveryEstimate?: string;
}

export interface FinalPaymentResult {
  success: boolean;
  orderId?: string;
  errorMessage?: string;
}

export const MAX_STONE_SELECTION = 3;
export const MAX_KUNDLI_FILE_MB = 10;
export const ACCEPTED_KUNDLI_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

export const EMPTY_ASTROLOGY_DETAILS: AstrologyDetails = {
  fullName: "",
  gender: "",
  phone: "",
  whatsappSameAsPhone: true,
  email: "",

  kundliMode: "manual",
  dob: "",
  timeOfBirth: "",
  timeUnknown: false,
  placeOfBirth: "",
  kundliFileName: null,

  stonePreferences: [],
  noStonePreference: false,

  wristSize: "",
  focusArea: "general",
  notes: "",
  consent: false,
};

/** Navratna set used for astrology bracelets. Swap ids/colors for your catalog. */
export const STONE_OPTIONS: StoneOption[] = [
  { id: "ruby", label: "Ruby", helper: "Sun", swatch: "#b33951" },
  { id: "pearl", label: "Pearl", helper: "Moon", swatch: "#f2ead9" },
  { id: "red-coral", label: "Red coral", helper: "Mars", swatch: "#d1603d" },
  { id: "emerald", label: "Emerald", helper: "Mercury", swatch: "#2e7d5b" },
  { id: "yellow-sapphire", label: "Yellow sapphire", helper: "Jupiter", swatch: "#e8b923" },
  { id: "diamond", label: "Diamond", helper: "Venus", swatch: "#cfd8dc" },
  { id: "blue-sapphire", label: "Blue sapphire", helper: "Saturn", swatch: "#2b4c7e" },
  { id: "hessonite", label: "Hessonite", helper: "Rahu", swatch: "#c98a3a" },
  { id: "cats-eye", label: "Cat's eye", helper: "Ketu", swatch: "#6b6b47" },
];