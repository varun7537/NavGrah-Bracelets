/**
 * Shared types for the "customized bracelet" journey:
 *
 *   1. Customer pays a ₹150 token to start.
 *   2. Customer shares kundli (typed in, or an existing kundli/birth-chart
 *      file), personal details, and stone preferences with the astrologer.
 *   3. Astrologer reviews and prepares a recommendation + final price.
 *   4. Customer pays the remaining balance and the order is placed.
 */

export interface CustomBraceletProduct {
  id: string;
  name: string;
  /** Starting/base price shown before consultation. Final price is set in
   * `AstrologerRecommendation.finalAmount` once the astrologer has reviewed
   * the customer's details — it may differ from this base price. */
  basePrice: number;
  imageUrl: string;
  imageAlt: string;
}

export interface StoneOption {
  id: string;
  label: string;
  /** Short line shown under the stone name, e.g. its ruling planet. */
  helper?: string;
  /** Hex color used for the little swatch / live preview dot. */
  swatch: string;
}

export type Gender = 'female' | 'male' | 'other';

/** How the customer is providing their birth chart. */
export type KundliMode = 'manual' | 'upload';

export interface AstrologyDetails {
  fullName: string;
  gender: Gender | '';
  phone: string;
  email: string;

  kundliMode: KundliMode;

  // Manual entry (required when kundliMode === 'manual')
  dob: string; // yyyy-mm-dd
  timeOfBirth: string; // HH:mm, empty when timeUnknown is true
  timeUnknown: boolean;
  placeOfBirth: string;

  // Upload entry (kundliFileName is display-only metadata; the actual File
  // object is kept separately in component state — see
  // CustomBraceletJourney — since it can't be serialized into this object).
  kundliFileName: string | null;

  stonePreferences: string[]; // StoneOption ids
  noStonePreference: boolean;
  notes: string;
}

export const EMPTY_ASTROLOGY_DETAILS: AstrologyDetails = {
  fullName: '',
  gender: '',
  phone: '',
  email: '',
  kundliMode: 'manual',
  dob: '',
  timeOfBirth: '',
  timeUnknown: false,
  placeOfBirth: '',
  kundliFileName: null,
  stonePreferences: [],
  noStonePreference: false,
  notes: '',
};

export interface AstrologerRecommendation {
  /** Astrologer's explanation, shown to the customer as prose. */
  summary: string;
  /** StoneOption ids the astrologer recommends. */
  recommendedStones: string[];
  recommendedMetal?: string;
  /** Total order value decided after consultation (token is adjusted against this). */
  finalAmount: number;
}

export interface TokenPaymentResult {
  success: boolean;
  paymentId?: string;
  /** Shown to the customer when success is false. */
  errorMessage?: string;
}

export interface FinalPaymentResult {
  success: boolean;
  orderId?: string;
  errorMessage?: string;
}