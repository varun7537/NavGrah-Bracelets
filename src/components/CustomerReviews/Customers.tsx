// src/components/NavgrahBracelets/Customer.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { StarIcon, CheckIcon, ChevronIcon, SparkleIcon } from "../Header/icons";

export type PlanetKey =
  | "surya"
  | "chandra"
  | "mangal"
  | "budh"
  | "guru"
  | "shukra"
  | "shani"
  | "rahu"
  | "ketu";

export interface Testimonial {
  id: string;
  name: string;
  location?: string;
  avatarUrl?: string;
  initials?: string;
  rating?: number;
  quote: string;
  product?: string;
  planet?: PlanetKey;
  verified?: boolean;
  featured?: boolean;
}

interface CustomerTestimonialsProps {
  testimonials?: Testimonial[];
  ctaHref?: string;
  reviewsHref?: string;
  statsLabel?: string;
  className?: string;
}

interface PlanetMeta {
  key: PlanetKey | "default";
  label: string;
  glyph: string;
  color: string;
}

const PLANETS: Record<PlanetKey, PlanetMeta> = {
  surya: { key: "surya", label: "Surya · Sun", glyph: "☉", color: "#C9631F" },
  chandra: { key: "chandra", label: "Chandra · Moon", glyph: "☽", color: "#5B7B9E" },
  mangal: { key: "mangal", label: "Mangal · Mars", glyph: "♂", color: "#B8433A" },
  budh: { key: "budh", label: "Budh · Mercury", glyph: "☿", color: "#3F8F6B" },
  guru: { key: "guru", label: "Guru · Jupiter", glyph: "♃", color: "#B8862A" },
  shukra: { key: "shukra", label: "Shukra · Venus", glyph: "♀", color: "#B14E78" },
  shani: { key: "shani", label: "Shani · Saturn", glyph: "♄", color: "#4E5A70" },
  rahu: { key: "rahu", label: "Rahu", glyph: "☊", color: "#6E5399" },
  ketu: { key: "ketu", label: "Ketu", glyph: "☋", color: "#8A6432" },
};

const DEFAULT_PLANET: PlanetMeta = {
  key: "default",
  label: "Gemstone",
  glyph: "✦",
  color: "#B8863E",
};

const PLANET_ORDER: PlanetKey[] = [
  "surya",
  "chandra",
  "mangal",
  "budh",
  "guru",
  "shukra",
  "shani",
  "rahu",
  "ketu",
];

function resolvePlanet(testimonial: Testimonial): PlanetMeta {
  if (testimonial.planet && PLANETS[testimonial.planet]) return PLANETS[testimonial.planet];
  const haystack = `${testimonial.product ?? ""}`.toLowerCase();
  const match = (Object.keys(PLANETS) as PlanetKey[]).find((key) => haystack.includes(key));
  return match ? PLANETS[match] : DEFAULT_PLANET;
}

function hexToRgba(hex: string, alpha: number) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
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

    if (prefersReducedMotion()) {
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

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export const SAMPLE_TESTIMONIALS: Testimonial[] = [
  {
    id: "sample-1",
    name: "Ananya Sharma",
    location: "Mumbai",
    rating: 5,
    quote:
      "The Surya bracelet felt truly personal — the recommendation matched my birth chart perfectly, and the craftsmanship is beautiful. I wear it every day.",
    product: "Navgrah Bracelet — Surya",
    verified: true,
    featured: true,
  },
  {
    id: "sample-2",
    name: "Rohan Mehta",
    location: "Bengaluru",
    rating: 5,
    quote:
      "I was skeptical about gemstone bracelets, but the guidance I received made the whole process feel thoughtful rather than gimmicky.",
    product: "Navgrah Bracelet — Shani",
    verified: true,
  },
  {
    id: "sample-3",
    name: "Priya Nair",
    location: "Kochi",
    rating: 4.5,
    quote:
      "Beautiful packaging and a genuinely calming piece to wear. The Chandra bracelet has become part of my daily routine.",
    product: "Navgrah Bracelet — Chandra",
    verified: true,
  },
  {
    id: "sample-4",
    name: "Karan Verma",
    rating: 5,
    quote:
      "Ordering was simple and the team answered all my questions about which planet to choose. Very happy with the result.",
    product: "Navgrah Bracelet — Guru",
  },
  {
    id: "sample-5",
    name: "Meera Iyer",
    location: "Pune",
    rating: 4,
    quote:
      "Lovely bracelet and quick shipping. Would have liked a bit more detail in the birth chart summary, but overall a great experience.",
    product: "Navgrah Bracelet — Shukra",
    verified: true,
  },
  {
    id: "sample-6",
    name: "Aditya Rao",
    location: "Hyderabad",
    rating: 5,
    quote:
      "The attention to detail is what stood out — from the gemstone selection to the way the bracelet was finished. Feels premium.",
    product: "Navgrah Bracelet — Mangal",
    verified: true,
  },
];

type FilterValue = "all" | PlanetKey;

export default function CustomerTestimonials({
  testimonials = SAMPLE_TESTIMONIALS,
  ctaHref,
  reviewsHref,
  statsLabel,
  className = "",
}: CustomerTestimonialsProps) {
  const { ref: revealRef, inView } = useInView<HTMLDivElement>(0.1);
  const hasTestimonials = testimonials.length > 0;

  const [filter, setFilter] = useState<FilterValue>("all");
  const filterRailRef = useRef<HTMLDivElement | null>(null);

  const featured = useMemo(
    () => testimonials.find((t) => t.featured) ?? testimonials[0],
    [testimonials]
  );

  const gridItems = useMemo(() => {
    const rest = testimonials.filter((t) => t.id !== featured?.id);
    if (filter === "all") return rest;
    return rest.filter((t) => resolvePlanet(t).key === filter);
  }, [testimonials, featured, filter]);

  const availablePlanets = useMemo(() => {
    const set = new Set<PlanetKey>();
    testimonials.forEach((t) => {
      const p = resolvePlanet(t);
      if (p.key !== "default") set.add(p.key as PlanetKey);
    });
    return PLANET_ORDER.filter((key) => set.has(key));
  }, [testimonials]);

  function scrollFilters(direction: 1 | -1) {
    const node = filterRailRef.current;
    if (!node) return;
    node.scrollBy({ left: direction * 180, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }

  return (
    <section
      aria-labelledby="testimonials-heading"
      className={`relative overflow-hidden bg-[#FBF6EC] px-6 py-24 sm:py-28 ${className}`}
    >
      <BackgroundAtmosphere />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto flex max-w-[640px] flex-col items-center gap-3 text-center">
          <h2
            id="testimonials-heading"
            className="font-display text-3xl font-semibold leading-[1.1] text-[#241F1A] sm:text-4xl"
          >
            Nine planets, thousands of stories
          </h2>
          <p className="max-w-[54ch] text-[#241F1A]/65">
            Every bracelet is chosen to match a planet in your chart. Here&rsquo;s
            what customers felt after finding theirs.
          </p>
          {statsLabel && (
            <p className="text-sm font-medium text-[#B8863E]">{statsLabel}</p>
          )}
        </div>

        {!hasTestimonials ? (
          ctaHref && (
            <div className="mt-14 flex justify-center">
              <FindBraceletCta href={ctaHref} />
            </div>
          )
        ) : (
          <div ref={revealRef} className="mt-14">
            <div
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(16px)",
                transitionProperty: "opacity, transform",
                transitionDuration: "700ms",
              }}
            >
              {featured && <SpotlightCard testimonial={featured} planet={resolvePlanet(featured)} />}

              <div className="relative mt-14 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollFilters(-1)}
                  aria-label="Scroll filters left"
                  className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#241F1A]/15 text-[#241F1A]/60 transition-colors hover:border-[#B8863E]/50 hover:text-[#B8863E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8863E] sm:flex"
                >
                  <ChevronIcon className="h-3.5 w-3.5 rotate-180" />
                </button>

                <div
                  ref={filterRailRef}
                  role="group"
                  aria-label="Filter stories by planet"
                  className="flex flex-1 items-center gap-2 overflow-x-auto py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  <FilterChip
                    label="All stories"
                    glyph="✦"
                    color="#241F1A"
                    isActive={filter === "all"}
                    onClick={() => setFilter("all")}
                  />
                  {availablePlanets.map((key) => {
                    const planet = PLANETS[key];
                    return (
                      <FilterChip
                        key={key}
                        label={planet.label}
                        glyph={planet.glyph}
                        color={planet.color}
                        isActive={filter === key}
                        onClick={() => setFilter(key)}
                      />
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => scrollFilters(1)}
                  aria-label="Scroll filters right"
                  className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#241F1A]/15 text-[#241F1A]/60 transition-colors hover:border-[#B8863E]/50 hover:text-[#B8863E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8863E] sm:flex"
                >
                  <ChevronIcon className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Mosaic grid */}
              {gridItems.length > 0 ? (
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {gridItems.map((testimonial) => (
                    <StoryCard
                      key={testimonial.id}
                      testimonial={testimonial}
                      planet={resolvePlanet(testimonial)}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-8 rounded-[20px] border border-dashed border-[#241F1A]/15 bg-white/50 px-6 py-10 text-center">
                  <p className="text-sm text-[#241F1A]/60">
                    No stories for this planet yet — check back soon, or explore all stories above.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-14 flex flex-col items-center gap-5 text-center">
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
                {ctaHref && <FindBraceletCta href={ctaHref} />}
                {reviewsHref && (
                  <a
                    href={reviewsHref}
                    className="inline-flex items-center gap-1 text-sm font-medium text-[#B8863E] underline-offset-4 transition-colors hover:text-[#8F692C] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8863E]"
                  >
                    See more customer stories
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function FindBraceletCta({ href }: { href: string }) {
  return (
    <a
      href={href}
      className="group inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-b from-[#C9954F] to-[#A8793F] px-8 py-3.5 text-sm font-medium text-[#FBF6EC] shadow-[0_8px_20px_-6px_rgba(168,121,63,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_-6px_rgba(168,121,63,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A8793F] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      Find your bracelet
      <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
        &rarr;
      </span>
    </a>
  );
}

function FilterChip({
  label,
  glyph,
  color,
  isActive,
  onClick,
}: {
  label: string;
  glyph: string;
  color: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{
        borderColor: isActive ? color : hexToRgba(color, 0.25),
        background: isActive ? color : hexToRgba(color, 0.06),
        color: isActive ? "#FBF6EC" : "#241F1A",
        outlineColor: color,
      }}
    >
      <span aria-hidden="true" className="text-base leading-none" style={{ color: isActive ? "#FBF6EC" : color }}>
        {glyph}
      </span>
      {label}
    </button>
  );
}

function SpotlightCard({ testimonial, planet }: { testimonial: Testimonial; planet: PlanetMeta }) {
  return (
    <figure
      className="relative overflow-hidden rounded-[28px] border bg-white p-8 sm:p-10 lg:p-12"
      style={{ borderColor: hexToRgba(planet.color, 0.3) }}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-2xl"
        style={{ background: hexToRgba(planet.color, 0.16) }}
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-12">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border font-display text-3xl"
          style={{
            borderColor: planet.color,
            color: planet.color,
            background: hexToRgba(planet.color, 0.08),
          }}
          aria-hidden="true"
        >
          {planet.glyph}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-5">
          {typeof testimonial.rating === "number" && (
            <StarRating rating={testimonial.rating} color={planet.color} />
          )}

          <blockquote className="font-display text-xl leading-relaxed text-[#241F1A] sm:text-2xl">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>

          <figcaption className="flex flex-wrap items-center gap-4">
            <Avatar testimonial={testimonial} color={planet.color} />
            <div className="flex min-w-0 flex-col gap-1">
              <span className="truncate text-sm font-medium text-[#241F1A]">{testimonial.name}</span>
              <span className="truncate text-xs text-[#241F1A]/50">
                {[testimonial.location, testimonial.product].filter(Boolean).join(" · ")}
              </span>
            </div>

            <div className="ml-auto flex items-center gap-2">
              {testimonial.verified && (
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#3F8F6B]/10 px-2.5 py-1 text-xs font-medium text-[#2F6E52]">
                  <CheckIcon className="h-3.5 w-3.5" />
                  Verified
                </span>
              )}
              <span
                className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium"
                style={{ background: hexToRgba(planet.color, 0.1), color: planet.color }}
              >
                <SparkleIcon className="h-3 w-3" />
                Featured story
              </span>
            </div>
          </figcaption>
        </div>
      </div>
    </figure>
  );
}

function StoryCard({ testimonial, planet }: { testimonial: Testimonial; planet: PlanetMeta }) {
  return (
    <figure
      className="flex flex-col gap-4 rounded-[20px] border p-6 transition-transform duration-200"
      style={{
        borderColor: hexToRgba(planet.color, 0.22),
        background: hexToRgba(planet.color, 0.05),
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-medium"
          style={{ color: planet.color }}
        >
          <span aria-hidden="true" className="text-sm leading-none">
            {planet.glyph}
          </span>
          {planet.label}
        </span>
        {testimonial.verified && (
          <span className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-medium text-[#2F6E52]">
            <CheckIcon className="h-3.5 w-3.5" />
            Verified
          </span>
        )}
      </div>

      {typeof testimonial.rating === "number" && (
        <StarRating rating={testimonial.rating} color={planet.color} />
      )}

      <blockquote className="flex-1 font-display text-base leading-relaxed text-[#241F1A]">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      <figcaption className="flex items-center gap-3 pt-1">
        <Avatar testimonial={testimonial} color={planet.color} size="sm" />
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium text-[#241F1A]">{testimonial.name}</span>
          {testimonial.location && (
            <span className="truncate text-xs text-[#241F1A]/50">{testimonial.location}</span>
          )}
        </div>
      </figcaption>
    </figure>
  );
}

function StarRating({ rating, color = "#B8863E" }: { rating: number; color?: string }) {
  const clamped = Math.max(0, Math.min(5, rating));
  const pct = (clamped / 5) * 100;

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="relative inline-flex" aria-hidden="true">
        <StarRow className="text-[#241F1A]/15" />
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${pct}%` }}>
          <StarRow style={{ color }} />
        </div>
      </div>
      <span className="sr-only">{clamped} out of 5 stars</span>
    </div>
  );
}

function StarRow({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`flex gap-0.5 ${className ?? ""}`} style={style}>
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} className="h-4 w-4" />
      ))}
    </div>
  );
}

function Avatar({
  testimonial,
  color,
  size = "md",
}: {
  testimonial: Testimonial;
  color: string;
  size?: "sm" | "md";
}) {
  const initials = testimonial.initials || initialsFromName(testimonial.name);
  const dimension = size === "sm" ? "h-10 w-10 text-sm" : "h-14 w-14 text-base";

  if (testimonial.avatarUrl) {
    return (
      <img
        src={testimonial.avatarUrl}
        alt=""
        className={`shrink-0 rounded-full border object-cover ${dimension}`}
        style={{ borderColor: color }}
      />
    );
  }

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full border bg-[#FBF6EC] font-display font-semibold text-[#3A3320] ${dimension}`}
      style={{ borderColor: color }}
    >
      {initials}
    </span>
  );
}

function BackgroundAtmosphere() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 35% at 90% 0%, rgba(184,134,62,0.10) 0%, rgba(184,134,62,0) 70%), radial-gradient(40% 30% at 5% 100%, rgba(91,123,158,0.10) 0%, rgba(91,123,158,0) 70%)",
        }}
      />
      <div className="absolute inset-0 opacity-[0.35]">
        {STARFIELD.map((star, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-[#B8863E]"
            style={{ top: star.top, left: star.left, width: star.size, height: star.size }}
          />
        ))}
      </div>
    </div>
  );
}

const STARFIELD = [
  { top: "8%", left: "10%", size: "2px" },
  { top: "16%", left: "90%", size: "1.5px" },
  { top: "30%", left: "50%", size: "1.5px" },
  { top: "45%", left: "5%", size: "2px" },
  { top: "60%", left: "82%", size: "1.5px" },
  { top: "75%", left: "30%", size: "2px" },
  { top: "88%", left: "65%", size: "1.5px" },
];