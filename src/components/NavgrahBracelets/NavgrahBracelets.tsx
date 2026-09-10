// src/components/NavgrahBracelets/NavgrahBracelets.tsx
"use client";

import { useMemo, useState } from "react";
import { NAVGRAH_BRACELETS } from "../../data/navgrahBracelets";
import Hero from "../Hero/Hero";
import NavgrahIntro from "../HowItWorks/NavgrahIntro";
import Marquee from "../Marquee/Marquee";
import LatestTrending from "../ShopByPlanets/Latest&Trending";
import Shop from "../ShopByPlanets/Shop";
import BestSelling from "../ShopByPlanets/BestSelling";
import Lab from "../Lab/Lab";
import AboutNavgrah from "../AboutUs/AboutNavGrah";
import Customers from "../CustomerReviews/Customers";
import ContactUs from "../ContactUs/ContactUs";
import ShopByPurpose from "../ShopByPlanets/ShopByPurpose";
import ShopByStone from "../ShopByPlanets/ShopByStone";
import BraceletCustomizer, { Product, CartPayload } from "../ShopByPlanets/Braceletcustomizer";

export default function NavgrahBracelets() {
  const [selectedSlug, setSelectedSlug] = useState(NAVGRAH_BRACELETS[0].slug);

  const featured = useMemo(
    () => NAVGRAH_BRACELETS.find((b) => b.slug === selectedSlug) ?? NAVGRAH_BRACELETS[0],
    [selectedSlug]
  );

  const supporting = useMemo(
    () => NAVGRAH_BRACELETS.filter((b) => b.slug !== featured.slug).slice(0, 3),
    [featured]
  );

  const featuredProduct: Product = useMemo(
  () => ({
    id: featured.slug,
    name: featured.name,
    price: featured.price,
    imageUrl: featured.image,
    imageAlt: featured.name,
    href: `/products/${featured.slug}`,
    availability: "In stock",
  }),
  [featured]
);

  function handleAddToCart(payload: CartPayload) {
    console.log("Add to cart", payload);
  }

  function handleViewDetails(product: Product) {
    console.log("Navigate to", product.href);
  }

  return (
    <section aria-labelledby="navgrah-heading" className="bg-[#FBF7F1]">
      <div className="mx-auto flex max-w-container flex-col">
        <div className="flex flex-col">
          <Hero />
          <Marquee />
          <NavgrahIntro />
          <ShopByPurpose />
          <ShopByStone />
          <LatestTrending />
          <Shop />
          <BestSelling />
          <Lab />
          <AboutNavgrah />
          <BraceletCustomizer
            product={featuredProduct}
            customizationFee={150}
            maxEngravingLength={12}
            onAddToCart={handleAddToCart}
            onViewDetails={handleViewDetails}
          />
          <Customers />
          <ContactUs />
        </div>
      </div>
    </section>
  );
}