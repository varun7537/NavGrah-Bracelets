// src/app/customized/page.tsx

import React from "react";
import type { Metadata } from "next";
import CustomBraceletJourney from "../../components/Customized/Custombraceletjourney";
import { CustomBraceletProduct } from "../../data/Custombracelet";

export const metadata: Metadata = {
  title: "Customized NavGrah bracelet",
  description:
    "A bracelet made around your kundli. Share your birth details and get astrologer recommendation on WhatsApp.",
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
              <span className="font-semibold text-[#8c6327]">The astrologer review your kundli</span>
              <span className="text-[#6d6259]">Share your details and we’ll reach out on WhatsApp.</span>
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
            Share your details here, then send them to our astrologer on WhatsApp. They’ll review your
            chart and connect with you directly.
          </p>
        </div>

        <CustomBraceletJourney product={product} />
      </section>

      {/* Information */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#e7dfd5] bg-white p-6 sm:p-8">
          <h3 className="text-lg font-semibold">Before you begin</h3>

          <ul className="mt-5 space-y-3 text-sm leading-6 text-[#6d6259]">
            {[
              "Keep your birth date, time and city handy — or a kundli file you already have.",
              "Birth time matters. If you don’t know it exactly, say so and the astrologer will work around it.",
              "After you submit, your details are sent to our astrologer on WhatsApp.",
              "Our astrologer will review your details and connect with you directly once it’s ready.",
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
