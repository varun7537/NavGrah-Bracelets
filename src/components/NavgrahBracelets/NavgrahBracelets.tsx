"use client";

import { useMemo, useState } from "react";

import { NAVGRAH_BRACELETS } from "../../data/navgrahBracelets";

import Hero from "../Hero/Hero";
import Marquee from "../Marquee/Marquee";
import Shop from "../ShopByPlanets/Shop";
import KundliBracelets from "../ShopByPlanets/Kundlibracelets";
import BestSelling from "../ShopByPlanets/BestSelling";
import Lab from "../Lab/Lab";
import AboutNavgrah from "../AboutUs/AboutNavGrah";
import Customers from "../CustomerReviews/Customers";
import ContactUs from "../ContactUs/ContactUs";
import ShopByPurpose from "../ShopByPlanets/ShopByPurpose";
import BraceletCustomizer from "../ShopByPlanets/Braceletcustomizer";

/**
 * NOTE: adjust this import to wherever Product/CartPayload actually live in
 * your codebase — they weren't defined in the file this was extracted from,
 * so these are minimal local fallbacks that match how the fields are used
 * below. Delete this block once you point it at the real types.
 */
type Product = {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
  availability: string;
};

type CartPayload = {
  product: Product;
  quantity: number;
};

export default function NavgrahBracelets() {
  const [selectedSlug, setSelectedSlug] = useState<string>(NAVGRAH_BRACELETS[0]?.slug ?? "");

  const featured = useMemo(
    () => NAVGRAH_BRACELETS.find((bracelet) => bracelet.slug === selectedSlug) ?? NAVGRAH_BRACELETS[0],
    [selectedSlug]
  );

  // const featuredProduct: Product | null = useMemo(() => {
  //   if (!featured) return null;
  //   return {
  //     id: featured.slug,
  //     name: featured.name,
  //     price: featured.price,
  //     imageUrl: featured.image,
  //     imageAlt: featured.name,
  //     href: `/products/${featured.slug}`,
  //     availability: "In stock",
  //   };
  // }, [featured]);

  // Kept for when a product grid/cart UI is added back to this section —
  // currently nothing in the render tree calls these, so wire them up to
  // whatever component displays `featuredProduct` once that exists.
  function handleAddToCart(payload: CartPayload): void {
    console.log("Add to cart", payload);
  }

  function handleViewDetails(product: Product): void {
    console.log("Navigate to", product.href);
  }

  return (
    <section aria-labelledby="navgrah-heading" className="bg-[#FBF7F1]">
      <div className="mx-auto flex max-w-container flex-col">
        <div className="flex flex-col">
          <Hero />
          <Marquee />
          <Shop />
          <ShopByPurpose />
          <KundliBracelets />
          <BestSelling />
          <Lab />
          <AboutNavgrah />

          {/* Always rendered — the customization journey doesn't depend on
              a featured product existing, it just optionally shows one for
              context if `featuredProduct` is available. */}
          <BraceletCustomizer
            // productName={featuredProduct?.name}
            // productImage={featuredProduct?.imageUrl}
          />

          <Customers />
          <ContactUs />
        </div>
      </div>
    </section>
  );
}