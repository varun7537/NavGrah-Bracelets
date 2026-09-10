// src/components/NavgrahBracelets/NavgrahHowItWorks.tsx
"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type CSSProperties,
  type ReactNode,
} from "react";


import { CalendarIcon, ChartIcon, GemIcon, StarIcon } from "../Header/icons";
type IconComponent = (props: {
  className?: string;
  style?: CSSProperties;
}) => ReactNode;


interface Step {
  icon: IconComponent;
  planet: string;
  glyph: string;
  color: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    icon: CalendarIcon,
    planet: "Sun",
    glyph: "\u2609",
    color: "#A63333",
    title: "Share Your Birth Details",
    description:
      "Enter your date of birth, exact time, and place of birth so your birth chart can be analysed.",
  },
  {
    icon: ChartIcon,
    planet: "Jupiter",
    glyph: "\u2643",
    color: "#B4791E",
    title: "Your Kundli Is Analysed",
    description:
      "Our astrology-based process identifies the planetary influences and areas that need attention in your chart.",
  },
  {
    icon: GemIcon,
    planet: "Mercury",
    glyph: "\u263F",
    color: "#256B4A",
    title: "Your Bracelet Is Crafted",
    description:
      "Based on your recommendation, the appropriate gemstones are selected and arranged into your personalised bracelet.",
  },
  {
    icon: StarIcon,
    planet: "Moon",
    glyph: "\u263E",
    color: "#34507D",
    title: "Wear It With Intention",
    description:
      "Receive your bracelet and wear it as part of your personal spiritual and astrological practice.",
  },
];

/** Straight-line segments that build the classic North Indian Kundli square. */
const CHART_LINES = [
  { x1: 50, y1: 50, x2: 250, y2: 50 },
  { x1: 250, y1: 50, x2: 250, y2: 250 },
  { x1: 250, y1: 250, x2: 50, y2: 250 },
  { x1: 50, y1: 250, x2: 50, y2: 50 },
  { x1: 50, y1: 50, x2: 250, y2: 250 },
  { x1: 250, y1: 50, x2: 50, y2: 250 },
  { x1: 150, y1: 50, x2: 250, y2: 150 },
  { x1: 250, y1: 150, x2: 150, y2: 250 },
  { x1: 150, y1: 250, x2: 50, y2: 150 },
  { x1: 50, y1: 150, x2: 150, y2: 50 },
];

/** House points, matched to STEPS by index, in clockwise reading order. */
const CHART_POINTS = [
  { x: 95, y: 78 },
  { x: 205, y: 78 },
  { x: 205, y: 222 },
  { x: 95, y: 222 },
];

const ORBIT_TICKS = Array.from({ length: 12 }).map((_, i) => {
  const angle = (i * 30 * Math.PI) / 180;
  const cx = 150;
  const cy = 150;
  const rInner = 128;
  const rOuter = 138;
  return {
    x1: cx + rInner * Math.cos(angle),
    y1: cy + rInner * Math.sin(angle),
    x2: cx + rOuter * Math.cos(angle),
    y2: cy + rOuter * Math.sin(angle),
  };
});

function useInView<T extends HTMLElement>(threshold = 0.25) {
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

interface NavgrahHowItWorksProps {
  /** Link target for the closing call to action. */
  ctaHref?: string;
  /** Optional click handler; runs alongside navigation to ctaHref. */
  onCtaClick?: () => void;
  className?: string;
}

export default function NavgrahHowItWorks({
  ctaHref = "#find-your-bracelet",
  onCtaClick,
  className = "",
}: NavgrahHowItWorksProps) {
  const { ref: revealRef, inView } = useInView<HTMLDivElement>(0.15);

  return (
    <>
      <style>{`
        @keyframes navgrah-orbit-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .navgrah-orbit { animation: none !important; }
        }
      `}</style>

      <section
        aria-labelledby="how-it-works-heading"
        id="how-it-works-heading"
        className={`relative overflow-hidden bg-white px-6 py-24 sm:py-28 ${className}`}
      >
        <div className="relative mx-auto max-w-6xl">
          {/* Heading */}
          <div className="mx-auto flex max-w-[560px] flex-col items-center gap-3 text-center">
            <h2
              id="how-it-works-heading"
              className="font-display text-3xl font-semibold leading-[1.1] text-ink sm:text-4xl"
            >
              How It Works
            </h2>
            <p className="max-w-[42ch] text-ink/70">
              Your personalised bracelet, guided by your birth chart.
            </p>
          </div>

          {/* Chart + steps */}
          <div
            ref={revealRef}
            className="mt-16 grid gap-14 sm:mt-20 lg:grid-cols-[340px_1fr] lg:items-center lg:gap-20"
          >
            <div className="mx-auto w-full max-w-[280px] lg:mx-0 lg:max-w-none">
              <KundliChart inView={inView} />
              <p className="mt-4 text-center text-xs text-ink/50 lg:text-left">
                A Vedic birth chart — the map behind every recommendation.
              </p>
            </div>

            <ol className="flex flex-col divide-y divide-ink/10">
              {STEPS.map((step, index) => (
                <StepRow key={step.title} step={step} index={index} inView={inView} />
              ))}
            </ol>
          </div>

          {/* CTA */}
          <div className="mt-20 flex flex-col items-center gap-6 text-center sm:mt-24">
            <p className="text-lg text-ink">
              Ready to discover your personalised bracelet?
            </p>
            <a
              href={ctaHref}
              onClick={onCtaClick}
              className="group inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-b from-[#C79A5B] to-[#A8793F] px-8 py-3.5 text-sm font-medium text-[#FBF7F0] shadow-[0_8px_20px_-6px_rgba(168,121,63,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_-6px_rgba(168,121,63,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A8793F] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0 rounded-full border border-transparent transition-all duration-700 ease-out group-hover:scale-125 group-hover:border-[#B4791E]/60 group-hover:opacity-0 motion-reduce:hidden"
              />

              <span className="relative z-10">
                Find My Bracelet
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function KundliChart({ inView }: { inView: boolean }) {
  return (
    <svg viewBox="0 0 300 300" className="h-auto w-full" role="img" aria-label="Illustration of a Vedic birth chart">
      {/* Ambient warm glow behind the chart */}
      <defs>
        <radialGradient id="navgrah-chart-glow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#B4791E" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#B4791E" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="150" cy="150" r="150" fill="url(#navgrah-chart-glow)" />

      {/* Slow-turning zodiac ring */}
      <g
        className="navgrah-orbit"
        style={{
          transformOrigin: "150px 150px",
          animation: "navgrah-orbit-spin 140s linear infinite",
        }}
      >
        <circle
          cx="150"
          cy="150"
          r="133"
          fill="none"
          stroke="#B4791E"
          strokeOpacity="0.25"
          strokeWidth="1"
          strokeDasharray="2 7"
        />
        {ORBIT_TICKS.map((tick, i) => (
          <line
            key={i}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke="#B4791E"
            strokeOpacity="0.3"
            strokeWidth="1"
          />
        ))}
      </g>

      {/* Chart construction lines, drawing themselves in */}
      {CHART_LINES.map((line, i) => (
        <line
          key={i}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="#201A2E"
          strokeOpacity="0.35"
          strokeWidth="1.25"
          pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: inView ? 0 : 1,
            transition: "stroke-dashoffset 550ms ease-out",
            transitionDelay: `${i * 55}ms`,
          }}
        />
      ))}

      {/* Planetary house points */}
      {STEPS.map((step, i) => {
        const point = CHART_POINTS[i];
        const delay = 650 + i * 170;
        return (
          <g
            key={step.title}
            style={{
              transformOrigin: `${point.x}px ${point.y}px`,
              opacity: inView ? 1 : 0,
              transform: inView ? "scale(1)" : "scale(0.4)",
              transition: "opacity 450ms ease-out, transform 450ms ease-out",
              transitionDelay: `${delay}ms`,
            }}
          >
            <circle cx={point.x} cy={point.y} r="15" fill={step.color} fillOpacity="0.14" />
            <circle cx={point.x} cy={point.y} r="9" fill="#FFFFFF" stroke={step.color} strokeWidth="1.75" />
            <text
              x={point.x}
              y={point.y + 3.5}
              textAnchor="middle"
              fontSize="10"
              fill={step.color}
            >
              {step.glyph}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function StepRow({
  step,
  index,
  inView,
}: {
  step: Step;
  index: number;
  inView: boolean;
}) {
  const Icon = step.icon;
  const delay = 650 + index * 170;

  return (
    <li className="flex gap-5 py-6 first:pt-0 last:pb-0">
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[1.5px] bg-white"
        style={{
          borderColor: step.color,
          opacity: inView ? 1 : 0,
          transform: inView ? "scale(1)" : "scale(0.6)",
          transition: "opacity 450ms ease-out, transform 450ms ease-out",
          transitionDelay: `${delay}ms`,
        }}
      >
        <Icon className="h-5 w-5 text-ink/70" />
      </span>

      <div
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateX(0)" : "translateX(10px)",
          transition: "opacity 450ms ease-out, transform 450ms ease-out",
          transitionDelay: `${delay + 60}ms`,
        }}
      >
        <span className="text-xs font-medium" style={{ color: step.color }}>
          {step.glyph} {step.planet}
        </span>
        <h3 className="font-display mt-1 text-lg font-semibold leading-snug text-ink">
          {step.title}
        </h3>
        <p className="mt-1 max-w-[38ch] text-sm leading-relaxed text-ink/70">
          {step.description}
        </p>
      </div>
    </li>
  );
}