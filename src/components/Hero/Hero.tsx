// src/components/Hero/Hero.tsx

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Bracelet carousel — doubles as the hero's sole background layer
const CAROUSEL_IMAGES: string[] = [
  "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=80",
];

const SLIDE_DURATION_MS = 6000;

// Nine points on the ring, one for each graha (planet) in Navgrah
const ORBIT_POINTS = 9;

const TRUST_POINTS = ["Handcrafted", "Certified gemstones", "Made to order"];

function OrbitRing() {
  return (
    <div
      aria-hidden="true"
      className="hero-ring pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 sm:h-[520px] sm:w-[520px] lg:h-[600px] lg:w-[600px]"
    >
      <div className="absolute inset-0 rounded-full border border-[#C9A24B]/25" />
      <div className="orbit-spin absolute left-1/2 top-1/2 h-full w-full">
        {Array.from({ length: ORBIT_POINTS }).map((_, i) => {
          const angle = (i / ORBIT_POINTS) * 2 * Math.PI;
          const radius = 50; // percent
          const x = 50 + radius * Math.cos(angle);
          const y = 50 + radius * Math.sin(angle);
          return (
            <span
              key={i}
              className="absolute h-[5px] w-[5px] rounded-full bg-[#D9B968]"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
                opacity: 0.5 + (i % 3) * 0.15,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function Hero() {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    if (CAROUSEL_IMAGES.length <= 1) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    stopTimer();
    timerRef.current = setInterval(() => {
      setSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, SLIDE_DURATION_MS);
  }, [stopTimer]);

  useEffect(() => {
    if (paused) {
      stopTimer();
    } else {
      startTimer();
    }
    return stopTimer;
  }, [paused, startTimer, stopTimer]);

  // Pause the carousel when the tab isn't visible — no point burning cycles
  // (and confusing users) advancing a slide they can't see.
  useEffect(() => {
    const handleVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return (
    <section
      aria-label="Navgrah Bracelets — personalised gemstone bracelets"
      className="relative flex min-h-[640px] items-center justify-center overflow-hidden bg-[#1B1226] py-24 sm:min-h-[720px] lg:min-h-screen"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        // Only resume if focus is leaving the section entirely
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setPaused(false);
        }
      }}
    >
      <style>{`
        @keyframes heroReveal {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ringReveal {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes orbitSpin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes kenBurns {
          from { transform: scale(1); }
          to { transform: scale(1.08); }
        }
        .hero-rise {
          animation: heroReveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .hero-rise-delay {
          animation: heroReveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.12s both;
        }
        .hero-ring {
          animation: ringReveal 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
        }
        .orbit-spin {
          animation: orbitSpin 90s linear infinite;
        }
        .slide-active {
          animation: kenBurns ${SLIDE_DURATION_MS + 1200}ms ease-out both;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-rise,
          .hero-rise-delay,
          .hero-ring,
          .slide-active {
            animation: none;
            opacity: 1;
            transform: none;
          }
          .orbit-spin {
            animation: none;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>

      {/* Background: bracelet carousel + legibility gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden bg-[#1B1226]">
        {CAROUSEL_IMAGES.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${
              index === slide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={src}
              alt=""
              fill
              priority={index < 2}
              loading={index < 2 ? undefined : "lazy"}
              sizes="100vw"
              className={`object-cover ${index === slide ? "slide-active" : ""}`}
            />
          </div>
        ))}

        {/* Warm plum vignette — darker at the edges, softer through the center so text stays legible without flattening the imagery */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B1226]/92 via-[#2B1D3D]/78 to-[#150D1F]/94" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 42%, rgba(43,29,61,0.35) 0%, rgba(21,13,31,0.55) 65%, rgba(21,13,31,0.85) 100%)",
          }}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-[720px] flex-col items-center px-6 text-center sm:px-10">
        {/* Orbit motif: nine points on a ring, one per graha — quiet nod to the brand name behind the headline */}
        <OrbitRing />

        <div className="hero-rise flex flex-col items-center gap-6">
          <h1 className="font-display text-[36px] font-medium leading-[1.1] tracking-[-0.01em] text-[#F8F1E4] sm:text-[48px] md:text-[56px] lg:text-[62px]">
            Bracelets aligned to your planets
          </h1>

          <p className="max-w-[480px] text-base font-normal leading-[1.5] text-[#F8F1E4]/85 sm:text-lg">
            Navgrah bracelets pair nine gemstones with the wisdom of Vedic
            astrology — handcrafted and personalised to bring balance and
            quiet strength to your everyday.
          </p>
        </div>

        <div className="hero-rise-delay mt-8 flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="#shop"
              className="group relative inline-flex items-center gap-2 rounded-full border border-[#C9A24B]/40 bg-[#F8F1E4] px-9 py-4 text-base font-semibold text-[#1B1226] transition-colors duration-300 hover:bg-[#C9A24B] hover:text-[#1B1226] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F8F1E4] active:scale-[0.98] motion-reduce:transition-none"
            >
              <span>Shop Bracelets</span>
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-1 rounded-full px-5 py-4 text-base font-medium text-[#F8F1E4]/90 underline decoration-[#C9A24B]/50 decoration-1 underline-offset-4 transition-colors duration-300 hover:text-[#F8F1E4] hover:decoration-[#C9A24B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F8F1E4]"
            >
              How it works
            </Link>
          </div>

          {/* Trust strip — edit or remove to match what's actually true of the business */}
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs font-medium uppercase tracking-[0.08em] text-[#F8F1E4]/60">
            {TRUST_POINTS.map((point) => (
              <li key={point} className="flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className="h-[3px] w-[3px] rounded-full bg-[#C9A24B]/70"
                />
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Carousel indicators — gives users control over an otherwise autoplaying background */}
        {CAROUSEL_IMAGES.length > 1 && (
          <div className="absolute bottom-[-3rem] left-1/2 flex -translate-x-1/2 items-center gap-2 sm:bottom-[-3.5rem]">
            {CAROUSEL_IMAGES.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSlide(index)}
                aria-label={`Show slide ${index + 1} of ${CAROUSEL_IMAGES.length}`}
                aria-current={index === slide}
                className={`h-1.5 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F8F1E4] ${
                  index === slide
                    ? "w-6 bg-[#C9A24B]"
                    : "w-1.5 bg-[#F8F1E4]/35 hover:bg-[#F8F1E4]/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}