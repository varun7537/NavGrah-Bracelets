// src/app/customized/page.tsx

import React from "react";
import type { Metadata } from "next";
import CustomBraceletJourney from "../../components/Customized/Custombraceletjourney";
import {
  AstrologerRecommendation,
  AstrologyDetails,
  CustomBraceletProduct,
  FinalPaymentResult,
  STONE_OPTIONS,
} from "../../data/Custombracelet";

export const metadata: Metadata = {
  title: "Customized NavGrah bracelet",
  description:
    "A bracelet made around your kundli. Share your birth details, get a free astrologer recommendation, and pay only when you’re happy with it.",
};

async function getCustomBraceletProduct(): Promise<CustomBraceletProduct> {
  // TODO: replace with a real product lookup (CMS / DB / storefront API).
  return {
    id: "customized-bracelet",
    name: "Customized NavGrah bracelet",
    basePrice: 1499,
    imageUrl: "/images/customized-bracelet.jpg",
    imageAlt: "Customized NavGrah bracelet",
  };
}

async function submitAstrologyDetails(
  details: AstrologyDetails,
  kundliFile: File | null
): Promise<AstrologerRecommendation> {
  "use server";

  // TODO: replace with the real call to your astrologer service. If a file was
  // uploaded, forward it as FormData rather than JSON:
  //
  //   const form = new FormData();
  //   form.append("details", JSON.stringify(details));
  //   if (kundliFile) form.append("kundliFile", kundliFile);
  //   const res = await fetch(`${process.env.API_BASE_URL}/astrology/consult`, {
  //     method: "POST",
  //     body: form,
  //   });
  //   if (!res.ok) throw new Error("The astrologer couldn’t be reached. Try again in a moment.");
  //   return res.json();

  await new Promise((resolve) => setTimeout(resolve, 1400));

  const fallback = [STONE_OPTIONS[0].id, STONE_OPTIONS[3].id];

  return {
    astrologerName: "Pandit R. Sharma",
    summary:
      `Based on ${kundliFile ? "the kundli you uploaded" : "your birth chart"}, a bracelet combining ` +
      `${details.noStonePreference ? "stones chosen for your ascendant" : "the stones you picked"} with silver ` +
      "supports your current planetary period.",
    recommendedStones:
      details.noStonePreference || details.stonePreferences.length === 0
        ? fallback
        : details.stonePreferences,
    recommendedMetal: "Sterling silver",
    beadCount: 9,
    wearInstructions: "Wear it on the right wrist on a Monday morning, after a wash in clean water.",
    deliveryEstimate: "5 to 7 working days",
    finalAmount: 2149,
  };
}

async function confirmOrder(payload: {
  paymentId: string;
  recommendation: AstrologerRecommendation;
  details: AstrologyDetails;
}): Promise<FinalPaymentResult> {
  "use server";

  // TODO: record the order in your system, e.g.
  // await fetch(`${process.env.API_BASE_URL}/orders`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload),
  // });
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { success: true, orderId: `ORD-${Date.now()}` };
}

export default async function CustomizedPage() {
  const product = await getCustomBraceletProduct();

  return (
    <main className="min-h-screen bg-[#faf8f4] text-[#241c16]">
      {/* Hero */}
      <section className="border-b border-[#e7dfd5] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">{product.name}</h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#6d6259] sm:text-lg">
              A bracelet made around your kundli, your birth details and the gemstones an astrologer
              picks for you.
            </p>

            <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full bg-[#f5eee5] px-5 py-3 text-sm">
              <span className="text-[#6d6259]">The astrologer reading is free.</span>
              <span className="font-semibold text-[#8c6327]">You pay once you approve it.</span>
            </div>

            <div className="mt-6">
              <a
                href="#start"
                className="inline-flex items-center justify-center rounded-full bg-[#211b17] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#332822] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a47735] focus-visible:ring-offset-2"
              >
                Start with your details
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Journey */}
      <section id="start" className="mx-auto max-w-4xl scroll-mt-20 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-8 max-w-2xl sm:mb-10">
          <h2 className="text-2xl font-semibold sm:text-3xl">Your personalized bracelet</h2>
          <p className="mt-3 text-[#6d6259]">
            Three steps, all on this page: your details, the astrologer’s reading, then payment.
          </p>
        </div>

        <CustomBraceletJourney
          product={product}
          stoneOptions={STONE_OPTIONS}
          onSubmitAstrologyDetails={submitAstrologyDetails}
          onOrderConfirm={confirmOrder}
        />
      </section>

      {/* Information */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#e7dfd5] bg-white p-6 sm:p-8">
          <h3 className="text-lg font-semibold">Before you begin</h3>

          <ul className="mt-5 space-y-3 text-sm leading-6 text-[#6d6259]">
            {[
              "Keep your birth date, time and city handy — or a kundli file you already have.",
              "Birth time matters. If you don’t know it exactly, say so and the astrologer will work around it.",
              "The recommendation comes from the astrologer’s reading of what you share.",
              "Nothing is charged until you’ve seen the recommendation and chosen to go ahead.",
            ].map((line) => (
              <li key={line} className="flex gap-3">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#a47735]" />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}