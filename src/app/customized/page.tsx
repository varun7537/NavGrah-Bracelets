import React from "react";
import CustomBraceletJourney from "../../components/Customized/Custombraceletjourney";
import {
  AstrologerRecommendation,
  AstrologyDetails,
  CustomBraceletProduct,
  FinalPaymentResult,
  StoneOption,
} from "../../data/Custombracelet";

async function getCustomBraceletProduct(): Promise<CustomBraceletProduct> {
  // TODO: replace with a real product lookup (CMS / DB / storefront API).
  return {
    id: "customized-bracelet",
    name: "Customized NavGrah Bracelet",
    basePrice: 1499,
    imageUrl: "/REPLACE/WITH/REAL/IMAGE.jpg",
    imageAlt: "Customized NavGrah bracelet",
  };
}

// Navratna-style stone set typically offered for astrology bracelets.
// Replace ids/colors with your real catalog list.
const STONE_OPTIONS: StoneOption[] = [
//   { id: "ruby", label: "Ruby", helper: "Sun", swatch: "#b33951" },
//   { id: "pearl", label: "Pearl", helper: "Moon", swatch: "#f2ead9" },
//   { id: "red-coral", label: "Red coral", helper: "Mars", swatch: "#d1603d" },
//   { id: "emerald", label: "Emerald", helper: "Mercury", swatch: "#2e7d5b" },
//   { id: "yellow-sapphire", label: "Yellow sapphire", helper: "Jupiter", swatch: "#e8b923" },
//   { id: "diamond", label: "Diamond", helper: "Venus", swatch: "#cfd8dc" },
//   { id: "blue-sapphire", label: "Blue sapphire", helper: "Saturn", swatch: "#2b4c7e" },
//   { id: "hessonite", label: "Hessonite", helper: "Rahu", swatch: "#c98a3a" },
//   { id: "cats-eye", label: "Cat's eye", helper: "Ketu", swatch: "#6b6b47" },
];

async function submitAstrologyDetails(
  details: AstrologyDetails,
  kundliFile: File | null
): Promise<AstrologerRecommendation> {
  "use server";

  // TODO: replace with the real call to your astrologer/backend service.
  // If a file was uploaded, send it as FormData instead of JSON, e.g.:
  //
  //   const form = new FormData();
  //   form.append("details", JSON.stringify(details));
  //   if (kundliFile) form.append("kundliFile", kundliFile);
  //   const res = await fetch("/api/astrology/consult", { method: "POST", body: form });
  //   return res.json();

  await new Promise((resolve) => setTimeout(resolve, 1200));

  return {
    summary:
      `Based on ${kundliFile ? "the kundli you uploaded" : "your birth chart"}, a bracelet combining ` +
      `${details.noStonePreference ? "stones chosen for your ascendant" : "your selected stones"} and silver ` +
      "will support your current planetary period.",
    recommendedStones: details.noStonePreference
      ? [STONE_OPTIONS[0].id, STONE_OPTIONS[3].id]
      : details.stonePreferences,
    recommendedMetal: "Sterling silver",
    finalAmount: 2149,
  };
}

async function confirmOrder(payload: {
  tokenPaymentId: string;
  finalPaymentId: string;
  recommendation: AstrologerRecommendation;
  details: AstrologyDetails;
}): Promise<FinalPaymentResult> {
  "use server";

  // TODO: replace with the real call that records the order in your system,
  // e.g. fetch("/api/orders/create", { method: "POST", body: JSON.stringify(payload) }).
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { success: true, orderId: `ORD-${Date.now()}` };
}

export default async function CustomizedPage() {
  const product = await getCustomBraceletProduct();

  return (
    <main className="min-h-screen bg-[#faf8f4] text-[#241c16]">
      {/* Hero */}
      <section className="border-b border-[#e7dfd5] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#a47735]">
              Personalized for You
            </p>

            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{product.name}</h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#6d6259] sm:text-lg">
              Get a personalized bracelet designed according to your kundli, personal details, and
              recommended gemstones.
            </p>

            <div className="mt-8 inline-flex items-center rounded-full bg-[#f5eee5] px-5 py-3">
              <span className="text-sm text-[#6d6259]">Start your personalized journey with</span>
              <span className="ml-2 font-semibold text-[#8c6327]">₹150 token payment</span>
            </div>
          </div>
        </div>
      </section>

      {/* The actual journey — replaces the old static step list + separate CTA */}
      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#a47735]">How It Works</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Your personalized bracelet journey</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#6d6259]">
            Complete each step below, right on this page — from the token payment to your final,
            astrologer-approved bracelet.
          </p>
        </div>

        <CustomBraceletJourney
          product={product}
          stoneOptions={STONE_OPTIONS}
          tokenAmount={150}
          onSubmitAstrologyDetails={submitAstrologyDetails}
          onOrderConfirm={confirmOrder}
        />
      </section>

      {/* Information */}
      <section className="mx-auto max-w-6xl px-6 pb-20 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#e7dfd5] bg-white p-6 sm:p-8">
          <h3 className="text-lg font-semibold">Before you begin</h3>

          <ul className="mt-5 space-y-3 text-sm leading-6 text-[#6d6259]">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#a47735]" />
              Keep your accurate birth details (or an existing kundli file) ready for the astrologer.
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#a47735]" />
              Share any specific concerns or requirements during the consultation.
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#a47735]" />
              The final bracelet recommendation is based on the astrologer's analysis and the
              information you provide.
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#a47735]" />
              The ₹150 token payment and final payment are handled according to your store's payment
              and refund policy.
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}