// src/components/NavgrahBracelets/Customer.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  StarIcon,
  CheckIcon,
  ChevronIcon,
  SparkleIcon,
} from "../Header/icons";

export interface Testimonial {
  id: string;
  name: string;
  location?: string;
  avatarUrl?: string;
  initials?: string;
  rating?: number;
  quote: string;
  product?: string;
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
  const last =
    parts.length > 1 ? parts[parts.length - 1][0] : "";

  return (first + last).toUpperCase();
}

export const SAMPLE_TESTIMONIALS: Testimonial[] = [
  {
    id: "sample-1",
    name: "Ananya Sharma",
    location: "Mumbai",
    rating: 5,
    quote:
      "The bracelet felt truly personal — the recommendation matched my requirements perfectly, and the craftsmanship is beautiful. I wear it every day.",
    product: "Customized Bracelet",
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
    product: "Customized Bracelet",
    verified: true,
  },
  {
    id: "sample-3",
    name: "Priya Nair",
    location: "Kochi",
    rating: 4.5,
    quote:
      "Beautiful packaging and a genuinely calming piece to wear. It has become part of my daily routine.",
    product: "Personalized Bracelet",
    verified: true,
  },
  {
    id: "sample-4",
    name: "Karan Verma",
    rating: 5,
    quote:
      "Ordering was simple and the team answered all my questions about the bracelet. Very happy with the result.",
    product: "Customized Bracelet",
  },
  {
    id: "sample-5",
    name: "Meera Iyer",
    location: "Pune",
    rating: 4,
    quote:
      "Lovely bracelet and quick shipping. The entire experience was smooth and the final product looked beautiful.",
    product: "Personalized Bracelet",
    verified: true,
  },
  {
    id: "sample-6",
    name: "Aditya Rao",
    location: "Hyderabad",
    rating: 5,
    quote:
      "The attention to detail is what stood out — from the gemstone selection to the way the bracelet was finished. Feels premium.",
    product: "Customized Bracelet",
    verified: true,
  },
];

export default function CustomerTestimonials({
  testimonials = SAMPLE_TESTIMONIALS,
  ctaHref,
  reviewsHref,
  statsLabel,
  className = "",
}: CustomerTestimonialsProps) {
  const { ref: revealRef, inView } =
    useInView<HTMLDivElement>(0.1);

  const hasTestimonials = testimonials.length > 0;

  const filterRailRef = useRef<HTMLDivElement | null>(null);

  const featured = useMemo(
    () =>
      testimonials.find((testimonial) => testimonial.featured) ??
      testimonials[0],
    [testimonials]
  );

  const gridItems = useMemo(() => {
    return testimonials.filter(
      (testimonial) => testimonial.id !== featured?.id
    );
  }, [testimonials, featured]);

  function scrollFilters(direction: 1 | -1) {
    const node = filterRailRef.current;

    if (!node) return;

    node.scrollBy({
      left: direction * 180,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }

  return (
    <section
      aria-labelledby="testimonials-heading"
      className={`relative overflow-hidden bg-[#FBF6EC] px-6 py-24 sm:py-28 ${className}`}
    >
      <BackgroundAtmosphere />

      <div className="relative mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mx-auto flex max-w-[640px] flex-col items-center gap-3 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-[#B8863E]">
            Customer Stories
          </p>

          <h2
            id="testimonials-heading"
            className="font-display text-3xl font-semibold leading-[1.1] text-[#241F1A] sm:text-4xl"
          >
            Loved by customers
          </h2>

          <p className="max-w-[54ch] text-[#241F1A]/65">
            Discover what our customers have to say about their personalized
            bracelet experience.
          </p>

          {statsLabel && (
            <p className="text-sm font-medium text-[#B8863E]">
              {statsLabel}
            </p>
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
                transform: inView
                  ? "translateY(0)"
                  : "translateY(16px)",
                transitionProperty: "opacity, transform",
                transitionDuration: "700ms",
              }}
            >
              {/* Featured Testimonial */}
              {featured && (
                <SpotlightCard testimonial={featured} />
              )}

              {/* Story Navigation */}
              {gridItems.length > 0 && (
                <div className="relative mt-14 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => scrollFilters(-1)}
                    aria-label="Scroll customer stories left"
                    className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#241F1A]/15 text-[#241F1A]/60 transition-colors hover:border-[#B8863E]/50 hover:text-[#B8863E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8863E] sm:flex"
                  >
                    <ChevronIcon className="h-3.5 w-3.5 rotate-180" />
                  </button>

                  <div
                    ref={filterRailRef}
                    role="group"
                    aria-label="Customer stories"
                    className="flex flex-1 items-center gap-2 overflow-x-auto py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  >
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#B8863E]/30 bg-[#B8863E]/10 px-3.5 py-2 text-sm font-medium text-[#8F692C]">
                      <SparkleIcon className="h-3.5 w-3.5" />
                      Customer experiences
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => scrollFilters(1)}
                    aria-label="Scroll customer stories right"
                    className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#241F1A]/15 text-[#241F1A]/60 transition-colors hover:border-[#B8863E]/50 hover:text-[#B8863E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8863E] sm:flex"
                  >
                    <ChevronIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Testimonials Grid */}
              {gridItems.length > 0 && (
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {gridItems.map((testimonial) => (
                    <StoryCard
                      key={testimonial.id}
                      testimonial={testimonial}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="mt-14 flex flex-col items-center gap-5 text-center">
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
                {ctaHref && (
                  <FindBraceletCta href={ctaHref} />
                )}

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

function FindBraceletCta({
  href,
}: {
  href: string;
}) {
  return (
    <a
      href={href}
      className="group inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-b from-[#C9954F] to-[#A8793F] px-8 py-3.5 text-sm font-medium text-[#FBF6EC] shadow-[0_8px_20px_-6px_rgba(168,121,63,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_-6px_rgba(168,121,63,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A8793F] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      Find your bracelet

      <span
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:translate-x-1"
      >
        &rarr;
      </span>
    </a>
  );
}

function SpotlightCard({
  testimonial,
}: {
  testimonial: Testimonial;
}) {
  return (
    <figure className="relative overflow-hidden rounded-[28px] border border-[#B8863E]/30 bg-white p-8 sm:p-10 lg:p-12">
      {/* Decorative Glow */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-2xl"
        style={{
          background: "rgba(184, 134, 62, 0.16)",
        }}
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full blur-3xl"
        style={{
          background: "rgba(184, 134, 62, 0.08)",
        }}
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-12">
        {/* Quote Mark */}
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#B8863E] bg-[#B8863E]/10 font-display text-3xl text-[#B8863E]"
          aria-hidden="true"
        >
          &ldquo;
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-5">
          {typeof testimonial.rating === "number" && (
            <StarRating rating={testimonial.rating} />
          )}

          <blockquote className="font-display text-xl leading-relaxed text-[#241F1A] sm:text-2xl">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>

          <figcaption className="flex flex-wrap items-center gap-4">
            <Avatar testimonial={testimonial} />

            <div className="flex min-w-0 flex-col gap-1">
              <span className="truncate text-sm font-medium text-[#241F1A]">
                {testimonial.name}
              </span>

              <span className="truncate text-xs text-[#241F1A]/50">
                {[
                  testimonial.location,
                  testimonial.product,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </div>

            <div className="ml-auto flex items-center gap-2">
              {testimonial.verified && (
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#3F8F6B]/10 px-2.5 py-1 text-xs font-medium text-[#2F6E52]">
                  <CheckIcon className="h-3.5 w-3.5" />
                  Verified
                </span>
              )}

              <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[#B8863E]/10 px-2.5 py-1 text-xs font-medium text-[#8F692C]">
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

function StoryCard({
  testimonial,
}: {
  testimonial: Testimonial;
}) {
  return (
    <figure className="flex flex-col gap-4 rounded-[20px] border border-[#B8863E]/20 bg-white p-6 transition-transform duration-200 hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#B8863E]/10 px-2.5 py-1 text-xs font-medium text-[#8F692C]">
          <SparkleIcon className="h-3 w-3" />
          Customer story
        </span>

        {testimonial.verified && (
          <span className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-medium text-[#2F6E52]">
            <CheckIcon className="h-3.5 w-3.5" />
            Verified
          </span>
        )}
      </div>

      {typeof testimonial.rating === "number" && (
        <StarRating rating={testimonial.rating} />
      )}

      <blockquote className="flex-1 font-display text-base leading-relaxed text-[#241F1A]">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      <figcaption className="flex items-center gap-3 pt-1">
        <Avatar
          testimonial={testimonial}
          size="sm"
        />

        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium text-[#241F1A]">
            {testimonial.name}
          </span>

          {testimonial.location && (
            <span className="truncate text-xs text-[#241F1A]/50">
              {testimonial.location}
            </span>
          )}
        </div>
      </figcaption>
    </figure>
  );
}

function StarRating({
  rating,
}: {
  rating: number;
}) {
  const clamped = Math.max(0, Math.min(5, rating));
  const percentage = (clamped / 5) * 100;

  return (
    <div className="inline-flex items-center gap-1.5">
      <div
        className="relative inline-flex"
        aria-hidden="true"
      >
        <StarRow className="text-[#241F1A]/15" />

        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            width: `${percentage}%`,
          }}
        >
          <StarRow
            style={{
              color: "#B8863E",
            }}
          />
        </div>
      </div>

      <span className="sr-only">
        {clamped} out of 5 stars
      </span>
    </div>
  );
}

function StarRow({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`flex gap-0.5 ${className ?? ""}`}
      style={style}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <StarIcon
          key={index}
          className="h-4 w-4"
        />
      ))}
    </div>
  );
}

function Avatar({
  testimonial,
  size = "md",
}: {
  testimonial: Testimonial;
  size?: "sm" | "md";
}) {
  const initials =
    testimonial.initials ||
    initialsFromName(testimonial.name);

  const dimension =
    size === "sm"
      ? "h-10 w-10 text-sm"
      : "h-14 w-14 text-base";

  if (testimonial.avatarUrl) {
    return (
      <img
        src={testimonial.avatarUrl}
        alt=""
        className={`shrink-0 rounded-full border border-[#B8863E] object-cover ${dimension}`}
      />
    );
  }

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full border border-[#B8863E] bg-[#FBF6EC] font-display font-semibold text-[#3A3320] ${dimension}`}
    >
      {initials}
    </span>
  );
}

function BackgroundAtmosphere() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 35% at 90% 0%, rgba(184,134,62,0.10) 0%, rgba(184,134,62,0) 70%), radial-gradient(40% 30% at 5% 100%, rgba(184,134,62,0.07) 0%, rgba(184,134,62,0) 70%)",
        }}
      />

      <div className="absolute inset-0 opacity-[0.35]">
        {STARFIELD.map((star, index) => (
          <span
            key={index}
            className="absolute rounded-full bg-[#B8863E]"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
            }}
          />
        ))}
      </div>
    </div>
  );
}

const STARFIELD = [
  {
    top: "8%",
    left: "10%",
    size: "2px",
  },
  {
    top: "16%",
    left: "90%",
    size: "1.5px",
  },
  {
    top: "30%",
    left: "50%",
    size: "1.5px",
  },
  {
    top: "45%",
    left: "5%",
    size: "2px",
  },
  {
    top: "60%",
    left: "82%",
    size: "1.5px",
  },
  {
    top: "75%",
    left: "30%",
    size: "2px",
  },
  {
    top: "88%",
    left: "65%",
    size: "1.5px",
  },
];