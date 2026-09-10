// src/components/NavgrahBracelets/ShopByPlanets.tsx
"use client";

import { useEffect, useRef, useState } from "react";

interface Planet {
  id: string;
  sanskritName: string;
  englishName: string;
  symbol: string;
  benefit: string;
  slug: string;
  colorLight: string;
  colorBase: string;
  colorDark: string;
  glow: string;
}

const DEFAULT_PLANETS: Planet[] = [
  {
    id: "surya",
    sanskritName: "Surya",
    englishName: "Sun",
    symbol: "\u2600",
    benefit: "Restores confidence, vitality, and inner strength.",
    slug: "surya",
    colorLight: "#F6C87B",
    colorBase: "#E3993F",
    colorDark: "#8A5518",
    glow: "rgba(227,153,63,0.45)",
  },
  {
    id: "chandra",
    sanskritName: "Chandra",
    englishName: "Moon",
    symbol: "\u263E",
    benefit: "Soothes the mind and restores emotional balance.",
    slug: "chandra",
    colorLight: "#F3F5F8",
    colorBase: "#9AA5B1",
    colorDark: "#5B6470",
    glow: "rgba(154,165,177,0.4)",
  },
  {
    id: "mangal",
    sanskritName: "Mangal",
    englishName: "Mars",
    symbol: "\u2642",
    benefit: "Channels courage, drive, and physical energy.",
    slug: "mangal",
    colorLight: "#E2665C",
    colorBase: "#B23A34",
    colorDark: "#7A2621",
    glow: "rgba(178,58,52,0.45)",
  },
  {
    id: "budh",
    sanskritName: "Budh",
    englishName: "Mercury",
    symbol: "\u263F",
    benefit: "Sharpens focus, clarity, and expression.",
    slug: "budh",
    colorLight: "#5FC79E",
    colorBase: "#2F8F6B",
    colorDark: "#1D5B45",
    glow: "rgba(47,143,107,0.4)",
  },
  {
    id: "guru",
    sanskritName: "Guru",
    englishName: "Jupiter",
    symbol: "\u2643",
    benefit: "Invites wisdom, growth, and abundance.",
    slug: "guru",
    colorLight: "#EAC96A",
    colorBase: "#B8922E",
    colorDark: "#7A5E1C",
    glow: "rgba(184,146,46,0.45)",
  },
  {
    id: "shukra",
    sanskritName: "Shukra",
    englishName: "Venus",
    symbol: "\u2640",
    benefit: "Nurtures love, harmony, and grace.",
    slug: "shukra",
    colorLight: "#F0B7C7",
    colorBase: "#C96E88",
    colorDark: "#823F52",
    glow: "rgba(201,110,136,0.4)",
  },
  {
    id: "shani",
    sanskritName: "Shani",
    englishName: "Saturn",
    symbol: "\u2644",
    benefit: "Builds discipline, patience, and stability.",
    slug: "shani",
    colorLight: "#8496E0",
    colorBase: "#4A5BC2",
    colorDark: "#2C3878",
    glow: "rgba(74,91,194,0.45)",
  },
  {
    id: "rahu",
    sanskritName: "Rahu",
    englishName: "North Node",
    symbol: "\u260A",
    benefit: "Fuels transformation and bold ambition.",
    slug: "rahu",
    colorLight: "#9B7FCB",
    colorBase: "#6B4E9E",
    colorDark: "#3E2C67",
    glow: "rgba(107,78,158,0.45)",
  },
  {
    id: "ketu",
    sanskritName: "Ketu",
    englishName: "South Node",
    symbol: "\u260B",
    benefit: "Deepens spirituality and quiet detachment.",
    slug: "ketu",
    colorLight: "#ADA6C0",
    colorBase: "#756C8E",
    colorDark: "#453F56",
    glow: "rgba(117,108,142,0.4)",
  },
];

/** Where each graha sits in the 3x3 Navagraha mandala. Surya anchors the center. */
const MANDALA_ORDER = [
  "ketu", "shani", "rahu",
  "chandra", "surya", "budh",
  "mangal", "guru", "shukra",
];

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean.split("").map((c) => c + c).join("")
      : clean;
  const int = parseInt(full, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

interface ShopByPlanetsProps {
  planets?: Planet[];
  collectionsBasePath?: string;
  findBraceletHref?: string;
  onFindBraceletClick?: () => void;
  className?: string;
}

export default function ShopByPlanets({
  planets = DEFAULT_PLANETS,
  collectionsBasePath = "/collections/",
  findBraceletHref = "#find-your-bracelet",
  onFindBraceletClick,
  className = "",
}: ShopByPlanetsProps) {
  const { ref: revealRef, inView } = useInView<HTMLDivElement>(0.15);

  const usesMandalaOrder =
    planets.length === 9 &&
    MANDALA_ORDER.every((id) => planets.some((p) => p.id === id));

  const arranged = usesMandalaOrder
    ? (MANDALA_ORDER.map((id) => planets.find((p) => p.id === id)) as Planet[])
    : planets.slice(0, 9);

  return (
    <section
      aria-labelledby="shop-by-planets-heading"
      id="shop-by-planets-heading" className={`relative bg-[#FDFCFA] px-6 py-24 sm:py-28 ${className}`}
    >
      <div className="relative mx-auto max-w-5xl">
        <div className="mx-auto flex max-w-[600px] flex-col items-center gap-3 text-center">
          <span className="text-xs font-medium tracking-[0.04em] text-[#B8863E]">
            The Navagraha Bracelets
          </span>
          <h2
            id="shop-by-planets-heading"
            className="font-display text-3xl font-semibold leading-[1.1] text-[#221F1A] sm:text-4xl"
          >
            Find your rashi
          </h2>
          <p className="max-w-[48ch] text-[#221F1A]/60">
            Vedic astrology names nine planetary forces that shape a life. Each
            one rules a gemstone — trace yours through the chart below.
          </p>
        </div>

        <div
          ref={revealRef}
          className="relative mx-auto mt-16 flex items-center justify-center sm:mt-20"
        >
          <MandalaOrnament className="pointer-events-none absolute h-[135%] w-[135%] opacity-[0.14]" />

          <ul
            role="list"
            className="relative grid grid-cols-3 gap-2.5 xs:gap-3 sm:gap-4"
            style={{ width: "min(94vw, 520px)" }}
          >
            {arranged.map((planet, index) => {
              const row = Math.floor(index / 3);
              const col = index % 3;
              const distance = Math.hypot(row - 1, col - 1);
              return (
                <li key={planet.id}>
                  <MandalaCell
                    planet={planet}
                    href={`${collectionsBasePath}${planet.slug}`}
                    isCenter={planet.id === "surya"}
                    inView={inView}
                    delayMs={Math.round(distance * 130)}
                  />
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mx-auto mt-20 flex max-w-[520px] flex-col items-center gap-5 text-center sm:mt-24">
          <MiniChartMark className="h-9 w-9 text-[#B8863E]" />
          <div className="flex flex-col items-center gap-2">
            <p className="font-display text-xl font-semibold text-[#221F1A] sm:text-2xl">
              Don&rsquo;t know your rashi yet?
            </p>
            <p className="max-w-[42ch] text-[#221F1A]/60">
              A short birth-chart reading tells us exactly which planet&rsquo;s
              energy you need.
            </p>
          </div>
          <a
            href={findBraceletHref}
            onClick={onFindBraceletClick}
            className="group inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-b from-[#C79A5B] to-[#A8793F] px-8 py-3.5 text-sm font-medium text-[#FBF7F0] shadow-[0_8px_20px_-6px_rgba(168,121,63,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_-6px_rgba(168,121,63,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A8793F] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            Find My Bracelet
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              &rarr;
            </span>
          </a>
        </div>
      </div>

      <style>{`
        @keyframes navgrah-mandala-in {
          from { opacity: 0; transform: scale(0.72) rotate(-6deg) translateY(10px); }
          to { opacity: 1; transform: scale(1) rotate(0deg) translateY(0); }
        }
        @keyframes navgrah-ring-spin {
          to { transform: rotate(360deg); }
        }
        .navgrah-cell {
          position: relative;
          overflow: hidden;
        }
        .navgrah-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(115deg, transparent 25%, rgba(255,255,255,0.65) 48%, transparent 72%);
          transform: translateX(-130%);
          transition: transform 0.65s ease;
          pointer-events: none;
        }
        .navgrah-cell:hover .navgrah-shine,
        .navgrah-cell:focus-visible .navgrah-shine {
          transform: translateX(130%);
        }
        @media (prefers-reduced-motion: reduce) {
          .navgrah-shine { transition: none; transform: none !important; opacity: 0; }
        }
      `}</style>
    </section>
  );
}

function MandalaCell({
  planet,
  href,
  isCenter,
  inView,
  delayMs,
}: {
  planet: Planet;
  href: string;
  isCenter: boolean;
  inView: boolean;
  delayMs: number;
}) {
  const baseAlpha = isCenter ? 0.16 : 0.09;
  const hoverAlpha = isCenter ? 0.24 : 0.17;
  const borderAlpha = isCenter ? 0.55 : 0.32;

  return (
    <a
      href={href}
      aria-label={`Explore ${planet.sanskritName} (${planet.englishName}) bracelets — ${planet.benefit}`}
      className="navgrah-cell group flex aspect-square flex-col items-center justify-center gap-1 rounded-[6px] border text-center transition-[background-color,border-color] duration-300 ease-out focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#221F1A]"
      style={{
        opacity: inView ? 1 : 0,
        animation: inView
          ? `navgrah-mandala-in 0.7s cubic-bezier(0.16,1,0.3,1) both`
          : undefined,
        animationDelay: `${delayMs}ms`,
        backgroundColor: hexToRgba(planet.colorBase, baseAlpha),
        borderColor: hexToRgba(planet.colorBase, borderAlpha),
        borderWidth: isCenter ? "1.5px" : "1px",
        padding: "clamp(6px, 2vw, 14px)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = hexToRgba(planet.colorBase, hoverAlpha);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = hexToRgba(planet.colorBase, baseAlpha);
      }}
    >
      <span aria-hidden="true" className="navgrah-shine" />

      <span
        aria-hidden="true"
        className="relative leading-none"
        style={{
          color: planet.colorDark,
          fontSize: isCenter ? "clamp(1.1rem, 4vw, 1.7rem)" : "clamp(0.95rem, 3.4vw, 1.35rem)",
        }}
      >
        {planet.symbol}
      </span>

      <span
        className="font-display relative leading-tight"
        style={{
          color: planet.colorDark,
          fontWeight: isCenter ? 700 : 600,
          fontSize: "clamp(0.68rem, 2.3vw, 0.92rem)",
        }}
      >
        {planet.sanskritName}
      </span>

      <span
        className="relative uppercase leading-none tracking-[0.06em] text-[#221F1A]/45"
        style={{ fontSize: "clamp(0.5rem, 1.6vw, 0.6rem)" }}
      >
        {planet.englishName}
      </span>

      <span
        className="relative hidden max-w-[15ch] leading-snug text-[#221F1A]/55 sm:line-clamp-2 sm:block"
        style={{ fontSize: "clamp(0.55rem, 1.7vw, 0.68rem)" }}
      >
        {planet.benefit}
      </span>
    </a>
  );
}

function MandalaOrnament({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 400"
      className={className}
    >
      <rect
        x="90"
        y="90"
        width="220"
        height="220"
        transform="rotate(45 200 200)"
        fill="none"
        stroke="#B8863E"
        strokeWidth="1"
      />
      <g
        className="[animation:navgrah-ring-spin_170s_linear_infinite] motion-reduce:!animate-none"
        style={{ transformOrigin: "200px 200px" }}
      >
        <circle cx="200" cy="200" r="185" fill="none" stroke="#B8863E" strokeWidth="0.75" strokeDasharray="1 10" />
        <circle cx="200" cy="15" r="3" fill="#B8863E" />
        <circle cx="385" cy="200" r="2" fill="#B8863E" />
        <circle cx="200" cy="385" r="3" fill="#B8863E" />
        <circle cx="15" cy="200" r="2" fill="#B8863E" />
      </g>
    </svg>
  );
}

function MiniChartMark({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" className={className} fill="none">
      <rect x="1" y="1" width="38" height="38" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1 1 L39 39 M39 1 L1 39" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <circle cx="20" cy="20" r="3" fill="currentColor" />
    </svg>
  );
}