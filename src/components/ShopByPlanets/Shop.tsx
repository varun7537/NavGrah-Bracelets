// src/components/RashiBracelets/ShopByRashi.tsx
"use client";

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";

import NextImage, { type StaticImageData } from "next/image";

import Aries from "../../../public/images/aries_image.jpg";
import Aquarius from "../../../public/images/aquarius_image.jpg";
import Cancer from "../../../public/images/cancer_image.jpg";
import Capricorn from "../../../public/images/capricorn_image.jpg";
import Leo from "../../../public/images/leo_image.jpg";
import Pisces from "../../../public/images/pisces_image.jpg";
import Libra from "../../../public/images/libra_image.jpg";
import Sagittarius from "../../../public/images/sagitarius_image.jpg";
import Taurus from "../../../public/images/taurus_image.jpg";
import Scorpio from "../../../public/images/scorpio_image.jpg";
import Virgo from "../../../public/images/virgo_image.jpg";
import Gemini from "../../../public/images/gemini_image.jpg";

export type Element = "fire" | "earth" | "air" | "water";

export interface Rashi {
  id: string;
  sanskritName: string;
  englishName: string;
  /** Photo/illustration representing the rashi. Accepts a static import or a plain URL. */
  image: string | StaticImageData;
  element: Element;
  rulingPlanet: string;
  gemstone: string;
  benefit: string;
  slug: string;
}

type ElementPalette = {
  label: string;
  sanskrit: string;
  light: string;
  base: string;
  dark: string;
};

const ELEMENT_PALETTE: Record<Element, ElementPalette> = {
  fire: {
    label: "Fire",
    sanskrit: "Agni",
    light: "#EFAE83",
    base: "#C2622F",
    dark: "#7A3A18",
  },
  earth: {
    label: "Earth",
    sanskrit: "Prithvi",
    light: "#CBC08D",
    base: "#8C7B3E",
    dark: "#584C22",
  },
  air: {
    label: "Air",
    sanskrit: "Vayu",
    light: "#B8C1E8",
    base: "#6E79AC",
    dark: "#3A4268",
  },
  water: {
    label: "Water",
    sanskrit: "Jal",
    light: "#8FC2CB",
    base: "#3C7581",
    dark: "#1E3C44",
  },
};

/** True zodiac order, starting from Mesha (Aries). */
export const DEFAULT_RASHIS: Rashi[] = [
  {
    id: "mesha",
    sanskritName: "Mesha",
    englishName: "Aries",
    image: Aries,
    element: "fire",
    rulingPlanet: "Mangal (Mars)",
    gemstone: "Red Coral",
    benefit: "Sparks initiative and fearless momentum.",
    slug: "mesha",
  },
  {
    id: "vrishabha",
    sanskritName: "Vrishabha",
    englishName: "Taurus",
    image: Taurus,
    element: "earth",
    rulingPlanet: "Shukra (Venus)",
    gemstone: "Diamond",
    benefit: "Grounds you in comfort, patience, and steady progress.",
    slug: "vrishabha",
  },
  {
    id: "mithuna",
    sanskritName: "Mithuna",
    englishName: "Gemini",
    image: Gemini,
    element: "air",
    rulingPlanet: "Budh (Mercury)",
    gemstone: "Emerald",
    benefit: "Sharpens curiosity and easy conversation.",
    slug: "mithuna",
  },
  {
    id: "karka",
    sanskritName: "Karka",
    englishName: "Cancer",
    image: Cancer,
    element: "water",
    rulingPlanet: "Chandra (Moon)",
    gemstone: "Pearl",
    benefit: "Softens the heart and steadies emotional tides.",
    slug: "karka",
  },
  {
    id: "simha",
    sanskritName: "Simha",
    englishName: "Leo",
    image: Leo,
    element: "fire",
    rulingPlanet: "Surya (Sun)",
    gemstone: "Ruby",
    benefit: "Restores confidence and warm, natural leadership.",
    slug: "simha",
  },
  {
    id: "kanya",
    sanskritName: "Kanya",
    englishName: "Virgo",
    image: Virgo,
    element: "earth",
    rulingPlanet: "Budh (Mercury)",
    gemstone: "Emerald",
    benefit: "Brings order, precision, and quiet focus.",
    slug: "kanya",
  },
  {
    id: "tula",
    sanskritName: "Tula",
    englishName: "Libra",
    image: Libra,
    element: "air",
    rulingPlanet: "Shukra (Venus)",
    gemstone: "Diamond",
    benefit: "Balances relationships and everyday decisions.",
    slug: "tula",
  },
  {
    id: "vrishchika",
    sanskritName: "Vrishchika",
    englishName: "Scorpio",
    image: Scorpio,
    element: "water",
    rulingPlanet: "Mangal (Mars)",
    gemstone: "Red Coral",
    benefit: "Channels intensity into quiet resolve.",
    slug: "vrishchika",
  },
  {
    id: "dhanu",
    sanskritName: "Dhanu",
    englishName: "Sagittarius",
    image: Sagittarius,
    element: "fire",
    rulingPlanet: "Guru (Jupiter)",
    gemstone: "Yellow Sapphire",
    benefit: "Opens the mind to growth and good fortune.",
    slug: "dhanu",
  },
  {
    id: "makara",
    sanskritName: "Makara",
    englishName: "Capricorn",
    image: Capricorn,
    element: "earth",
    rulingPlanet: "Shani (Saturn)",
    gemstone: "Blue Sapphire",
    benefit: "Builds discipline for long, patient climbs.",
    slug: "makara",
  },
  {
    id: "kumbha",
    sanskritName: "Kumbha",
    englishName: "Aquarius",
    image: Aquarius,
    element: "air",
    rulingPlanet: "Shani (Saturn)",
    gemstone: "Blue Sapphire",
    benefit: "Frees original thought and independent vision.",
    slug: "kumbha",
  },
  {
    id: "meena",
    sanskritName: "Meena",
    englishName: "Pisces",
    image: Pisces,
    element: "water",
    rulingPlanet: "Guru (Jupiter)",
    gemstone: "Yellow Sapphire",
    benefit: "Deepens compassion and creative intuition.",
    slug: "meena",
  },
];

const ZODIAC_ORDER = DEFAULT_RASHIS.map((rashi) => rashi.id);

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");

  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((char) => char + char)
          .join("")
      : clean;

  const int = parseInt(full, 16);

  if (Number.isNaN(int)) {
    return `rgba(0, 0, 0, ${alpha})`;
  }

  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Position of item `index` of `total` around a clock-like circle.
 * Aries starts at 12 o'clock.
 */
function wheelPosition(
  index: number,
  total: number,
  radiusPct: number
): { x: number; y: number } {
  const angle = (index / total) * 2 * Math.PI;

  const x = 50 + radiusPct * Math.sin(angle);
  const y = 50 - radiusPct * Math.cos(angle);

  return { x, y };
}

/** Shared color styling for a rashi's element, at rest or active/expanded. */
function useElementStyles(element: Element, emphasized: boolean) {
  const palette = ELEMENT_PALETTE[element];

  return {
    palette,
    backgroundColor: hexToRgba(palette.base, emphasized ? 0.16 : 0.06),
    borderColor: hexToRgba(palette.base, emphasized ? 0.85 : 0.28),
  };
}

function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

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
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export interface ShopByRashiProps {
  rashis?: Rashi[];
  collectionsBasePath?: string;
  findBraceletHref?: string;
  onFindBraceletClick?: () => void;
  /**
   * Component used to render navigational links, e.g. Next.js's `Link`.
   * Defaults to a plain anchor tag. Must accept `href`, `className`,
   * `aria-label`, and `children` props.
   */
  linkComponent?: ElementType<{
    href: string;
    className?: string;
    "aria-label"?: string;
    children?: ReactNode;
  }>;
  className?: string;
}

type LinkType = ElementType<{
  href: string;
  className?: string;
  "aria-label"?: string;
  children?: ReactNode;
}>;

export default function ShopByRashi({
  rashis = DEFAULT_RASHIS,
  collectionsBasePath = "/collections/",
  findBraceletHref = "/collections",
  onFindBraceletClick,
  linkComponent,
  className = "",
}: ShopByRashiProps) {
  const Link = (linkComponent ?? "a") as LinkType;
  const { ref: revealRef, inView } = useInView<HTMLDivElement>(0.15);

  // Shared between the desktop wheel (hover-driven) and the mobile grid
  // (tap-driven); only one of the two layouts is visible at a time.
  const [activeId, setActiveId] = useState<string | null>(null);

  const usesZodiacOrder =
    rashis.length === 12 &&
    ZODIAC_ORDER.every((id) => rashis.some((rashi) => rashi.id === id));

  const arranged: Rashi[] = usesZodiacOrder
    ? ZODIAC_ORDER.map((id) => rashis.find((rashi) => rashi.id === id)).filter(
        (rashi): rashi is Rashi => Boolean(rashi)
      )
    : rashis.slice(0, 12);

  const active = arranged.find((rashi) => rashi.id === activeId) ?? null;

  return (
    <section
      aria-labelledby="shop-by-rashi-heading"
      id="shop-by-rashi"
      className={`relative overflow-hidden bg-[#FDFCFA] px-6 py-24 sm:py-28 ${className}`}
    >
      <div className="relative mx-auto max-w-5xl">
        {/* Heading */}
        <div className="mx-auto flex max-w-[600px] flex-col items-center gap-3 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium tracking-[0.08em] text-[#B8863E]">
            <SparkleIcon className="h-3.5 w-3.5" />
            RASHI GEMSTONE BRACELETS
          </span>

          <h2
            id="shop-by-rashi-heading"
            className="font-display text-3xl font-semibold leading-[1.1] text-[#221F1A] sm:text-4xl"
          >
            Find your rashi
          </h2>

          <p className="max-w-[48ch] text-[#221F1A]/60">
            Vedic astrology names twelve rashis that shape a life. Each one
            carries its own gemstone and energy — trace yours around the
            wheel.
          </p>
        </div>

        {/* Element legend */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {(Object.keys(ELEMENT_PALETTE) as Element[]).map((key) => {
            const element = ELEMENT_PALETTE[key];

            return (
              <div key={key} className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-full ring-2 ring-offset-2 ring-offset-[#FDFCFA]"
                  style={{
                    backgroundColor: element.base,
                    // @ts-expect-error -- custom property for ring color
                    "--tw-ring-color": hexToRgba(element.base, 0.25),
                  }}
                />

                <span className="flex items-baseline gap-1.5 text-[#221F1A]/55">
                  <span className="font-display text-sm font-medium text-[#221F1A]/75">
                    {element.sanskrit}
                  </span>

                  <span className="text-[0.68rem] tracking-[0.03em]">
                    {element.label}
                  </span>
                </span>
              </div>
            );
          })}
        </div>

        {/* Desktop / tablet: radial zodiac wheel */}
        <div
          ref={revealRef}
          className="relative mx-auto mt-16 hidden aspect-square md:block"
          style={{ width: "min(88vw, 640px)" }}
        >
          <WheelOrnament className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.14]" />

          <ul role="list" className="absolute inset-0">
            {arranged.map((rashi, index) => {
              const { x, y } = wheelPosition(index, arranged.length, 38);

              return (
                <li
                  key={rashi.id}
                  className="absolute"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <WheelNode
                    rashi={rashi}
                    href={`${collectionsBasePath}${rashi.slug}`}
                    linkComponent={Link}
                    inView={inView}
                    delayMs={index * 45}
                    isActive={activeId === rashi.id}
                    onActivate={() => setActiveId(rashi.id)}
                    onDeactivate={() =>
                      setActiveId((current) =>
                        current === rashi.id ? null : current
                      )
                    }
                  />
                </li>
              );
            })}
          </ul>

          {/* Center readout */}
          <div
            aria-live="polite"
            className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
            style={{ width: "46%", height: "46%" }}
          >
            <CenterReadout
              rashi={active}
              href={active ? `${collectionsBasePath}${active.slug}` : undefined}
              linkComponent={Link}
            />
          </div>
        </div>

        {/* Mobile: tap-to-expand grid */}
        <ul
          role="list"
          className="mt-14 grid grid-cols-3 items-start gap-3 md:hidden"
        >
          {arranged.map((rashi) => (
            <li key={rashi.id} className="contents">
              <GridCard
                rashi={rashi}
                href={`${collectionsBasePath}${rashi.slug}`}
                linkComponent={Link}
                isExpanded={activeId === rashi.id}
                onToggle={() =>
                  setActiveId((current) =>
                    current === rashi.id ? null : rashi.id
                  )
                }
              />
            </li>
          ))}
        </ul>

        {/* Find bracelet CTA */}
        <div className="mx-auto mt-20 flex max-w-[520px] flex-col items-center gap-5 rounded-3xl border border-[#221F1A]/8 bg-white/60 px-8 py-10 text-center shadow-[0_20px_45px_-30px_rgba(34,31,26,0.35)] backdrop-blur-sm sm:mt-24">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FBF3E4] text-[#B8863E]">
            <BirthChartIcon className="h-6 w-6" />
          </span>

          <div className="flex flex-col items-center gap-2">
            <p className="font-display text-xl font-semibold text-[#221F1A] sm:text-2xl">
              Don&rsquo;t know your rashi yet?
            </p>

            <p className="max-w-[42ch] text-[#221F1A]/60">
              A short birth-chart reading tells us exactly which sign&rsquo;s
              energy you need.
            </p>
          </div>

          <Link
            href={findBraceletHref}
            onClick={onFindBraceletClick}
            className="group inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-b from-[#C79A5B] to-[#A8793F] px-8 py-3.5 text-sm font-medium text-[#FBF7F0] shadow-[0_8px_20px_-6px_rgba(168,121,63,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_-6px_rgba(168,121,63,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A8793F] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            View Our Collections

            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              &rarr;
            </span>
          </Link>
        </div>
      </div>

      {/* Component animations */}
      <style>{`
        @keyframes rashi-wheel-in {
          from {
            opacity: 0;
            transform: scale(0.6) translateY(6px);
          }

          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes rashi-ring-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes rashi-detail-in {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes rashi-panel-in {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .rashi-node {
          position: relative;
        }

        .rashi-shine {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(
            115deg,
            transparent 25%,
            rgba(255, 255, 255, 0.55) 48%,
            transparent 72%
          );
          transform: translateX(-130%);
          transition: transform 0.65s ease;
          pointer-events: none;
        }

        .rashi-node:hover .rashi-shine,
        .rashi-node:focus-visible .rashi-shine {
          transform: translateX(130%);
        }

        .rashi-detail {
          animation: rashi-detail-in 0.2s ease-out both;
        }

        .rashi-panel {
          animation: rashi-panel-in 0.2s ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .rashi-shine {
            transition: none;
            transform: none !important;
            opacity: 0;
          }

          .rashi-detail,
          .rashi-panel {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

function WheelNode({
  rashi,
  href,
  linkComponent: Link,
  inView,
  delayMs,
  isActive,
  onActivate,
  onDeactivate,
}: {
  rashi: Rashi;
  href: string;
  linkComponent: LinkType;
  inView: boolean;
  delayMs: number;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  const { palette, borderColor } = useElementStyles(rashi.element, isActive);

  return (
    <Link
      href={href}
      aria-label={`Explore ${rashi.sanskritName} (${rashi.englishName}) bracelets — ${rashi.gemstone}. ${rashi.benefit}`}
      className="rashi-node group flex flex-col items-center gap-2 focus:outline-none"
    >
      {/* Wrapped so we can attach hover/focus handlers without them
          being stripped by a custom linkComponent's prop typing. */}
      <span
        onMouseEnter={onActivate}
        onFocus={onActivate}
        onMouseLeave={onDeactivate}
        onBlur={onDeactivate}
        className="relative flex items-center justify-center rounded-full ring-1 ring-inset ring-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#221F1A]"
        style={{
          opacity: inView ? 1 : 0,
          animation: inView
            ? "rashi-wheel-in 0.6s cubic-bezier(0.16,1,0.3,1) both"
            : undefined,
          animationDelay: `${delayMs}ms`,
          width: "clamp(56px, 14vw, 84px)",
          height: "clamp(56px, 14vw, 84px)",
          border: `2px solid ${borderColor}`,
          boxShadow: isActive
            ? `0 12px 24px -10px ${hexToRgba(palette.base, 0.45)}`
            : `0 4px 10px -6px ${hexToRgba(palette.base, 0.25)}`,
          transform: isActive ? "scale(1.1)" : "scale(1)",
          transition:
            "border-color 0.3s ease-out, box-shadow 0.3s ease-out, transform 0.3s ease-out",
        }}
      >
        <span className="relative block h-full w-full overflow-hidden rounded-full">
          <NextImage
            src={rashi.image}
            alt=""
            fill
            sizes="84px"
            className="object-cover"
          />

          <span
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, transparent 55%, ${hexToRgba(
                palette.dark,
                0.55
              )} 100%)`,
            }}
          />

          <span aria-hidden="true" className="rashi-shine" />
        </span>
      </span>

      <span
        className="font-display relative rounded-full px-2.5 py-0.5 text-center leading-tight transition-colors duration-300"
        style={{
          color: palette.dark,
          fontWeight: 600,
          fontSize: "clamp(0.62rem, 1.6vw, 0.74rem)",
          backgroundColor: isActive
            ? hexToRgba(palette.light, 0.5)
            : "transparent",
        }}
      >
        {rashi.sanskritName}
      </span>
    </Link>
  );
}

function CenterReadout({
  rashi,
  href,
  linkComponent: Link,
}: {
  rashi: Rashi | null;
  href?: string;
  linkComponent: LinkType;
}) {
  if (!rashi || !href) {
    return (
      <div className="flex flex-col items-center gap-2.5 px-4 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FBF3E4] text-[#B8863E]">
          <BirthChartIcon className="h-5 w-5" />
        </span>

        <p className="max-w-[16ch] text-xs leading-snug text-[#221F1A]/45">
          Hover a sign to see its gemstone
        </p>
      </div>
    );
  }

  const palette = ELEMENT_PALETTE[rashi.element];

  return (
    <div
      className="rashi-detail flex flex-col items-center gap-1.5 rounded-[28px] px-5 py-4 text-center shadow-[0_16px_32px_-18px_rgba(34,31,26,0.3)]"
      style={{
        backgroundColor: "#FFFFFF",
        border: `1px solid ${hexToRgba(palette.base, 0.22)}`,
      }}
    >
      <span
        className="relative block h-11 w-11 overflow-hidden rounded-full ring-2"
        style={{ boxShadow: `0 0 0 2px ${hexToRgba(palette.base, 0.35)}` }}
      >
        <NextImage
          src={rashi.image}
          alt=""
          fill
          sizes="44px"
          className="object-cover"
        />
      </span>

      <p className="font-display text-base font-semibold leading-tight text-[#221F1A]">
        {rashi.sanskritName}
      </p>

      <p className="text-[0.68rem] tracking-[0.03em] text-[#221F1A]/45">
        {rashi.englishName}
      </p>

      <p className="mt-1 max-w-[20ch] text-xs leading-snug text-[#221F1A]/65">
        {rashi.benefit}
      </p>

      <p className="mt-1 text-[0.65rem] text-[#221F1A]/45">
        {rashi.gemstone} &middot; ruled by {rashi.rulingPlanet}
      </p>

      <Link
        href={href}
        className="mt-1 pointer-events-auto text-[0.7rem] font-medium underline decoration-[#221F1A]/30 underline-offset-2 hover:decoration-[#221F1A]"
        aria-label={`Shop ${rashi.sanskritName} bracelets`}
      >
        Shop now
      </Link>
    </div>
  );
}

function GridCard({
  rashi,
  href,
  linkComponent: Link,
  isExpanded,
  onToggle,
}: {
  rashi: Rashi;
  href: string;
  linkComponent: LinkType;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { palette, borderColor } = useElementStyles(rashi.element, isExpanded);

  const detailId = `rashi-detail-${rashi.id}`;

  return (
    <div
      className="rashi-node flex flex-col items-stretch overflow-hidden rounded-2xl border bg-white transition-shadow duration-300 ease-out"
      style={{
        borderColor,
        boxShadow: isExpanded
          ? `0 14px 28px -16px ${hexToRgba(palette.base, 0.4)}`
          : `0 2px 8px -4px ${hexToRgba(palette.base, 0.18)}`,
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={detailId}
        aria-label={`${rashi.sanskritName}, ${rashi.englishName}. ${
          isExpanded ? "Hide" : "Show"
        } details`}
        className="relative flex aspect-square w-full flex-col items-center justify-end text-center focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#221F1A]"
      >
        <NextImage
          src={rashi.image}
          alt=""
          fill
          sizes="(max-width: 768px) 33vw, 120px"
          className="object-cover"
        />

        <span
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, transparent 40%, ${hexToRgba(
              palette.dark,
              0.85
            )} 100%)`,
          }}
        />

        <span aria-hidden="true" className="rashi-shine" />

        <span
          aria-hidden="true"
          className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full"
          style={{ backgroundColor: palette.base }}
        />

        <span
          className="font-display relative z-10 w-full px-1 pb-1.5 leading-tight text-white"
          style={{ fontWeight: 600, fontSize: "clamp(0.66rem, 2.3vw, 0.85rem)" }}
        >
          {rashi.sanskritName}
        </span>

        <span
          className="relative z-10 w-full px-1 pb-2 leading-none tracking-[0.02em] text-white/75"
          style={{ fontSize: "clamp(0.5rem, 1.6vw, 0.6rem)" }}
        >
          {rashi.englishName}
        </span>
      </button>

      {isExpanded && (
        <div
          id={detailId}
          className="rashi-panel flex flex-col items-center gap-1 border-t px-2 pb-3 pt-2 text-center"
          style={{ borderColor }}
        >
          <p className="text-[0.68rem] leading-snug text-[#221F1A]/70">
            {rashi.benefit}
          </p>

          <p className="text-[0.62rem] text-[#221F1A]/45">{rashi.gemstone}</p>

          <Link
            href={href}
            aria-label={`Shop ${rashi.sanskritName} bracelets`}
            className="mt-1 text-[0.68rem] font-medium underline decoration-[#221F1A]/30 underline-offset-2"
          >
            Shop now &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}

function WheelOrnament({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 400 400" className={className}>
      <circle
        cx="200"
        cy="200"
        r="150"
        fill="none"
        stroke="#B8863E"
        strokeWidth="0.75"
      />

      <g
        className="[animation:rashi-ring-spin_170s_linear_infinite] motion-reduce:!animate-none"
        style={{ transformOrigin: "200px 200px" }}
      >
        <circle
          cx="200"
          cy="200"
          r="188"
          fill="none"
          stroke="#B8863E"
          strokeWidth="0.75"
          strokeDasharray="1 11"
        />
      </g>

      {Array.from({ length: 12 }).map((_, index) => {
        const angle = (index / 12) * 2 * Math.PI;

        const x1 = 200 + 150 * Math.sin(angle);
        const y1 = 200 - 150 * Math.cos(angle);

        const x2 = 200 + 160 * Math.sin(angle);
        const y2 = 200 - 160 * Math.cos(angle);

        return (
          <line
            key={index}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#B8863E"
            strokeWidth="1"
          />
        );
      })}
    </svg>
  );
}

/** Small sparkle mark used next to the eyebrow label. */
function SparkleIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M12 2c.6 3.6 1.9 4.9 5.5 5.5-3.6.6-4.9 1.9-5.5 5.5-.6-3.6-1.9-4.9-5.5-5.5C10.1 6.9 11.4 5.6 12 2Z" />
      <path d="M19 14c.3 1.8.9 2.4 2.7 2.7-1.8.3-2.4.9-2.7 2.7-.3-1.8-.9-2.4-2.7-2.7 1.8-.3 2.4-.9 2.7-2.7Z" />
    </svg>
  );
}

/** Represents an astrological birth chart — used for the "find your rashi" CTA. */
function BirthChartIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 3v3.2M12 17.8V21M21 12h-3.2M6.2 12H3M18.4 5.6l-2.3 2.3M7.9 16.1l-2.3 2.3M18.4 18.4l-2.3-2.3M7.9 7.9 5.6 5.6" />
    </svg>
  );
}