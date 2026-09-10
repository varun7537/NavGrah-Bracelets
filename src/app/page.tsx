"use client";

import { useEffect, useState } from "react";

import PromoBar from "../components/Header/PromoBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/loading";
import NavgrahBracelets from "../components/NavgrahBracelets/NavgrahBracelets";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 1600);

    return () => window.clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#FAF7F1]">
        <Loader />
      </main>
    );
  }

  return (
    <main>
      <PromoBar />
      <Navbar />
      <NavgrahBracelets />
      <Footer />
    </main>
  );
}
