// src/components/Customized/BraceletCustomizer.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { JSX } from "react";

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

function ConsultIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 18v-6.2A5.8 5.8 0 0 1 9.8 6h.4A5.8 5.8 0 0 1 16 11.8V13a5 5 0 0 1-5 5H8l-4 3v-3Z" />
      <path strokeLinecap="round" d="M16.2 8.3a4.4 4.4 0 0 1 3.8 4.35v.85l1.5 1.9-2.4 1" />
    </svg>
  );
}

function KundliIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" />
      <path d="M3.5 3.5 20.5 20.5M20.5 3.5 3.5 20.5" />
      <path d="M12 3.5 20.5 12 12 20.5 3.5 12Z" />
    </svg>
  );
}

function GemIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path strokeLinejoin="round" d="M7 3.5h10L21 9l-9 11.5L3 9l4-5.5Z" />
      <path strokeLinejoin="round" d="M3 9h18M7 3.5 9.5 9 12 20.5 14.5 9 17 3.5" />
    </svg>
  );
}

function ReportIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path strokeLinejoin="round" d="M6 3h8l4 4v14H6z" />
      <path strokeLinejoin="round" d="M14 3v4h4" />
      <path strokeLinecap="round" d="M8.5 12.5h7M8.5 15.5h7M8.5 9.5h3" />
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
      <circle cx="12" cy="12" r="8.4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.3l2.3 2.3 4.7-5" />
    </svg>
  );
}

function ArrowIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function ChevronIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

type JourneyStep = {
  id: number;
  shortLabel: string;
  heading: string;
  description: string;
  status: string;
  color: string;
  Icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  /** Renders with the high-contrast dark treatment — reserved for the final step. */
  dark?: boolean;
};

/**
 * No payment happens until step 5. The reading itself — steps 1 to 4 — is
 * free, so nothing here should reference a booking fee or token amount.
 */
const STEPS: JourneyStep[] = [
  {
    id: 1,
    shortLabel: "Share details",
    heading: "Share Your Kundli & Details",
    description:
      "Tell us your date, time and place of birth — or upload a kundli you already have — along with your stone preferences and wrist size. It takes about two minutes, and it's free.",
    status: "Details shared",
    color: "#ff5e00",
    Icon: KundliIcon,
  },
  {
    id: 2,
    shortLabel: "Expert review",
    heading: "Your Astrologer Studies Your Chart",
    description:
      "A dedicated astrologer reads your planetary positions and current period against what you're hoping the bracelet will support.",
    status: "Chart in review",
    color: "#0088ff",
    Icon: ConsultIcon,
  },
  {
    id: 3,
    shortLabel: "Stones chosen",
    heading: "Get Your Personalized Stone Recommendation",
    description:
      "Based on your chart, the astrologer recommends the gemstones and metal suited to your planets — still at no cost to you.",
    status: "Stones recommended",
    color: "#ffa200",
    Icon: GemIcon,
  },
  {
    id: 4,
    shortLabel: "Report ready",
    heading: "Review Your Astrology Report",
    description:
      "A written report explains the thinking behind your recommendation, plus how to wear and look after the finished bracelet.",
    status: "Report ready",
    color: "#9500ff",
    Icon: ReportIcon,
  },
  {
    id: 5,
    shortLabel: "Approve & pay",
    heading: "Approve & Confirm Your Bracelet",
    description:
      "Happy with the recommendation? Pay the bracelet price to confirm your order. Nothing is charged before this step.",
    status: "Ready to confirm",
    color: "#ff0000",
    Icon: CheckIcon,
    dark: true,
  },
];

const THREAD_GRADIENT = `linear-gradient(90deg, ${STEPS.map((s) => s.color).join(", ")})`;

const GEMSTONES = [
  { name: "Ruby", planet: "Sun", benefit: "Confidence & vitality", qty: "1 centre stone", color: "#C2531F" },
  { name: "Pearl", planet: "Moon", benefit: "Emotional balance", qty: "2–4 beads", color: "#6E7887" },
  { name: "Emerald", planet: "Mercury", benefit: "Clarity & focus", qty: "1 accent stone", color: "#4C7C59" },
  { name: "Blue Sapphire", planet: "Saturn", benefit: "Discipline & calm", qty: "As advised", color: "#33526E" },
];

const REPORT_CONTENTS = [
  "Kundli insights",
  "Planetary observations",
  "Recommended gemstones",
  "Bracelet configuration",
  "Wearing instructions",
  "Care instructions",
  "Astrologer's notes",
];

/** Fixed, deterministic background stars — not randomized per render, so
 *  server and client markup always match. */
const BACKDROP_STARS = [
  { x: 6, y: 18, size: 2, delay: 0 },
  { x: 14, y: 62, size: 1.4, delay: 0.6 },
  { x: 22, y: 30, size: 1.8, delay: 1.4 },
  { x: 31, y: 78, size: 1.2, delay: 0.2 },
  { x: 38, y: 12, size: 1.6, delay: 2.1 },
  { x: 47, y: 55, size: 2.2, delay: 0.9 },
  { x: 55, y: 22, size: 1.3, delay: 1.7 },
  { x: 63, y: 70, size: 1.7, delay: 0.4 },
  { x: 71, y: 15, size: 1.4, delay: 2.4 },
  { x: 79, y: 60, size: 2, delay: 1.1 },
  { x: 87, y: 32, size: 1.5, delay: 0.7 },
  { x: 94, y: 74, size: 1.3, delay: 1.9 },
  { x: 11, y: 88, size: 1.6, delay: 2.6 },
  { x: 58, y: 88, size: 1.4, delay: 1.3 },
  { x: 84, y: 10, size: 1.8, delay: 0.3 },
];

/* ------------------------------------------------------------------ */
/*  Constellation geometry                                             */
/* ------------------------------------------------------------------ */

const VIEWBOX_W = 1000;
const VIEWBOX_H = 220;
const NODE_MARGIN_X = 80;
const BAND_TOP = 58;
const BAND_BOTTOM = 168;

interface Point {
  x: number;
  y: number;
}

function computeNodePoints(count: number): Point[] {
  const usableWidth = VIEWBOX_W - NODE_MARGIN_X * 2;
  return Array.from({ length: count }, (_, i) => {
    const x =
      count === 1
        ? VIEWBOX_W / 2
        : NODE_MARGIN_X + (usableWidth * i) / (count - 1);
    const y = i % 2 === 0 ? BAND_BOTTOM : BAND_TOP;
    return { x, y };
  });
}

/** Smooth S-curve through a set of points, built from cubic bezier
 *  segments so the constellation line never has hard corners. */
function buildSmoothPath(points: Point[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const midX = (p0.x + p1.x) / 2;
    d += ` C ${midX} ${p0.y}, ${midX} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

const NODE_POINTS = computeNodePoints(STEPS.length);
const CONSTELLATION_PATH = buildSmoothPath(NODE_POINTS);
const NODE_PERCENTS = NODE_POINTS.map((p) => ({
  left: (p.x / VIEWBOX_W) * 100,
  top: (p.y / VIEWBOX_H) * 100,
}));

/* ------------------------------------------------------------------ */
/*  Small building blocks                                              */
/* ------------------------------------------------------------------ */

function StatusPill({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="ng-ui inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium"
      style={{ borderColor: `${color}55`, color, backgroundColor: `${color}14` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

/** The contextual mini-content shown for each step — used inside both the
 *  desktop floating card and the mobile accordion, so the two stay in sync
 *  without duplicating the copy. */
function StepDetailContent({
  step,
  reportOpen,
  onToggleReport,
}: {
  step: JourneyStep;
  reportOpen: boolean;
  onToggleReport: () => void;
}) {
  const dark = step.dark;

  return (
    <div>
      <StatusPill label={step.status} color={dark ? "#E2711D" : step.color} />

      <h4 className={`ng-display mt-3 text-[17px] italic leading-snug sm:text-[19px] ${dark ? "text-[#FCFBF8]" : "text-[#FFFFFF]"}`}>
        {step.heading}
      </h4>
      <p className={`ng-ui mt-2 text-[13px] leading-relaxed ${dark ? "text-[#FCFBF8]/65" : "text-[#FFFFFF]/60"}`}>
        {step.description}
      </p>

      {step.id === 1 && (
        <ul className="ng-ui mt-4 flex flex-wrap gap-1.5">
          {["Date, time & place of birth", "Kundli upload (optional)", "Stone preference", "Wrist size"].map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-[#1C1024]/12 bg-[#FCFBF8] px-2.5 py-1 text-[10.5px] font-medium text-[#1C1024]/65"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      {step.id === 2 && (
        <div className="ng-ui mt-4 flex flex-wrap items-center gap-1.5 text-[11px] font-medium">
          <span className="rounded-full bg-[#33526E]/10 px-2.5 py-1 text-[#33526E]">Chart received</span>
          <ChevronIcon className="h-3 w-3 -rotate-90 text-[#1C1024]/30" />
          <span className="rounded-full bg-[#33526E]/10 px-2.5 py-1 text-[#33526E]">Under review</span>
          <span className="ml-1 text-[#1C1024]/40">· usually ready within a few hours</span>
        </div>
      )}

      {step.id === 3 && (
        <div className="mt-4">
          <div className="ng-ui flex flex-wrap items-center gap-1 text-[10.5px] font-medium text-[#B8862F]">
            <span>Kundli</span>
            <ChevronIcon className="h-3 w-3 -rotate-90" />
            <span>Planetary analysis</span>
            <ChevronIcon className="h-3 w-3 -rotate-90" />
            <span>Recommended stones</span>
            <ChevronIcon className="h-3 w-3 -rotate-90" />
            <span>Your bracelet</span>
          </div>
          <div className="cbj-gem-scroll mt-3 flex gap-2 overflow-x-auto">
            {GEMSTONES.map((g) => (
              <div
                key={g.name}
                className="cbj-gem-chip w-[8.5rem] shrink-0 rounded-md border border-[#1C1024]/10 bg-[#FCFBF8] px-2.5 py-2"
              >
                <div className="flex items-center gap-1.5">
                  <GemIcon className="h-3.5 w-3.5" style={{ color: g.color }} />
                  <span className="ng-ui text-[11px] font-semibold text-[#1C1024]">{g.name}</span>
                </div>
                <p className="ng-ui mt-1 text-[10px] text-[#1C1024]/45">
                  {g.planet} · {g.qty}
                </p>
                <p className="ng-ui mt-1 text-[10.5px] leading-snug text-[#1C1024]/60">{g.benefit}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {step.id === 4 && (
        <div className="mt-4">
          <button
            type="button"
            onClick={onToggleReport}
            aria-expanded={reportOpen}
            className="ng-ui flex items-center gap-1.5 text-[12px] font-semibold text-[#6E4C86] hover:text-[#4E3563]"
          >
            {reportOpen ? "Hide report contents" : "View report contents"}
            <ChevronIcon className={`h-3.5 w-3.5 cbj-chevron ${reportOpen ? "cbj-open" : ""}`} />
          </button>
          <div className={`cbj-report-panel ${reportOpen ? "cbj-open" : ""}`}>
            <div className="cbj-report-inner">
              <ul className="ng-ui mt-2.5 grid grid-cols-1 gap-1 text-[11px] text-[#1C1024]/60 sm:grid-cols-2">
                {REPORT_CONTENTS.map((item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-[#6E4C86]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {step.id === 5 && (
        <div className="ng-ui mt-4 space-y-1.5 rounded-md bg-white/8 px-3 py-2.5 text-[11.5px]">
          <div className="flex items-center justify-between text-[#FCFBF8]/70">
            <span>Astrology consultation</span>
            <span className="font-medium text-[#E2711D]">Free</span>
          </div>
          <div className="flex items-center justify-between text-[#FCFBF8]/70">
            <span>Bracelet price</span>
            <span className="text-[#FCFBF8]/45">Shown after recommendation</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between border-t border-white/10 pt-1.5 font-semibold text-[#FCFBF8]">
            <span>You pay</span>
            <span className="text-[#FCFBF8]/45">Only once you approve</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

type BraceletCustomizerProps = {
  productName?: string;
  productImage?: string;
  /** Where the bottom CTA points — typically the id of the actual form section. */
  ctaHref?: string;
  onCtaClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

export default function BraceletCustomizer({
  productName,
  productImage,
  ctaHref = "#start",
  onCtaClick,
}: BraceletCustomizerProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [reportOpen, setReportOpen] = useState(false);
  const [magnet, setMagnet] = useState({ x: 0, y: 0 });
  const [pressed, setPressed] = useState(false);
  const [rippleId, setRippleId] = useState(0);
  const [rippleStep, setRippleStep] = useState<number | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleCtaMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const btn = ctaRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    setMagnet({ x: relX * 0.14, y: relY * 0.26 });
  }, []);
  const resetMagnet = useCallback(() => setMagnet({ x: 0, y: 0 }), []);

  const activeIndex = STEPS.findIndex((s) => s.id === activeStep);
  const activeMeta = STEPS[activeIndex];

  const selectStep = useCallback((id: number) => {
    setActiveStep(id);
    setRippleStep(id);
    setRippleId((n) => n + 1);
  }, []);

  const handleRailKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      let nextIndex: number | null = null;
      if (e.key === "ArrowRight") nextIndex = Math.min(index + 1, STEPS.length - 1);
      else if (e.key === "ArrowLeft") nextIndex = Math.max(index - 1, 0);
      else if (e.key === "Home") nextIndex = 0;
      else if (e.key === "End") nextIndex = STEPS.length - 1;

      if (nextIndex === null) return;
      e.preventDefault();
      selectStep(STEPS[nextIndex].id);
      nodeRefs.current[nextIndex]?.focus();
    },
    [selectStep]
  );

  const progressPct = useMemo(
    () => (STEPS.length > 1 ? (activeIndex / (STEPS.length - 1)) * 100 : 0),
    [activeIndex]
  );

  const activePoint = NODE_PERCENTS[activeIndex];

  return (
    <section
      ref={sectionRef}
      id="customized-bracelet-journey"
      className="cbj-section relative overflow-hidden bg-[#FCFBF8] py-20 sm:py-28"
    >
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,500;0,600;1,500;1,600&family=Manrope:wght@400;500;600;700&display=swap");
        .ng-display {
          font-family: "Newsreader", serif;
        }
        .ng-ui {
          font-family: "Manrope", sans-serif;
        }
      `}</style>

      <style jsx>{`
        .cbj-section {
          background-image: radial-gradient(circle at 8% 6%, rgba(184, 134, 47, 0.08), transparent 40%),
            radial-gradient(circle at 96% 92%, rgba(110, 76, 134, 0.07), transparent 42%);
        }

        @keyframes cbj-fade-up {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes cbj-panel-swap {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.99);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes cbj-twinkle {
          0%,
          100% {
            opacity: 0.15;
            transform: scale(0.85);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.15);
          }
        }

        @keyframes cbj-node-pulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 color-mix(in srgb, var(--node-glow, #b8232f) 45%, transparent);
          }
          50% {
            box-shadow: 0 0 0 8px color-mix(in srgb, var(--node-glow, #b8232f) 0%, transparent);
          }
        }

        @keyframes cbj-traveler-pulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 color-mix(in srgb, var(--node-glow, #e2711d) 55%, transparent);
          }
          50% {
            box-shadow: 0 0 0 10px color-mix(in srgb, var(--node-glow, #e2711d) 0%, transparent);
          }
        }

        @keyframes cbj-ripple-burst {
          from {
            opacity: 0.5;
            transform: scale(0.4);
          }
          to {
            opacity: 0;
            transform: scale(2.4);
          }
        }

        .cbj-reveal {
          opacity: 0;
          transform: translateY(16px);
        }
        .cbj-reveal.cbj-visible {
          animation: cbj-fade-up 650ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .cbj-star {
          position: absolute;
          border-radius: 9999px;
          background: #b8862f;
          animation: cbj-twinkle 3.6s ease-in-out infinite;
        }

        .cbj-node-active {
          animation: cbj-node-pulse 2.2s ease-out infinite;
        }

        .cbj-traveler {
          transition: left 520ms cubic-bezier(0.16, 1, 0.3, 1), top 520ms cubic-bezier(0.16, 1, 0.3, 1);
          animation: cbj-traveler-pulse 2s ease-out infinite;
        }

        .cbj-path {
          transition: stroke-dashoffset 1100ms cubic-bezier(0.16, 1, 0.3, 1) 200ms, stroke 400ms ease;
        }

        .cbj-node {
          transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 200ms ease, background-color 200ms ease,
            color 200ms ease, border-color 200ms ease;
        }
        .cbj-node:hover {
          transform: scale(1.08);
        }

        .cbj-ripple {
          position: absolute;
          inset: -6px;
          border-radius: 9999px;
          border: 2px solid currentColor;
          pointer-events: none;
          animation: cbj-ripple-burst 620ms ease-out forwards;
        }

        .cbj-detail-card {
          animation: cbj-panel-swap 380ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .cbj-gem-chip {
          transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 220ms ease, border-color 220ms ease;
        }
        .cbj-gem-chip:hover {
          transform: translateY(-3px) rotate(-0.5deg);
          box-shadow: 0 14px 26px -18px rgba(28, 16, 36, 0.4);
          border-color: rgba(28, 16, 36, 0.2);
        }

        .cbj-pill {
          transition: background-color 180ms ease, color 180ms ease, border-color 180ms ease, transform 180ms ease;
        }
        .cbj-pill:hover {
          transform: translateY(-1px);
        }

        .cbj-progress-fill {
          transition: width 520ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cbj-report-panel {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 320ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cbj-report-panel.cbj-open {
          grid-template-rows: 1fr;
        }
        .cbj-report-inner {
          overflow: hidden;
        }
        .cbj-chevron {
          transition: transform 220ms ease;
        }
        .cbj-chevron.cbj-open {
          transform: rotate(180deg);
        }

        .cbj-clip {
          clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%);
        }
        .cbj-clip-lg {
          clip-path: polygon(0 0, calc(100% - 26px) 0, 100% 26px, 100% 100%, 0 100%);
        }

        .cbj-cta {
          transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1), background-color 200ms ease;
        }
        .cbj-cta:active {
          transform: scale(0.96) !important;
        }

        .cbj-gem-scroll {
          scrollbar-width: none;
        }
        .cbj-gem-scroll::-webkit-scrollbar {
          display: none;
        }

        .cbj-mobile-row {
          transition: border-color 200ms ease, background-color 200ms ease;
        }

        @media (prefers-reduced-motion: reduce) {
          .cbj-reveal {
            opacity: 1;
            transform: none;
            animation: none !important;
          }
          .cbj-star,
          .cbj-node-active,
          .cbj-traveler,
          .cbj-detail-card,
          .cbj-ripple {
            animation: none !important;
          }
          .cbj-path {
            transition: none !important;
          }
          .cbj-node:hover,
          .cbj-gem-chip:hover,
          .cbj-pill:hover {
            transform: none !important;
          }
          .cbj-traveler {
            transition: none !important;
          }
          .cbj-cta {
            transition: none !important;
          }
        }
      `}</style>

      <div className="relative mx-auto max-w-container px-6 sm:px-8 lg:px-10">
        {/* ------------------------------------------------------------ */}
        {/* Intro                                                        */}
        {/* ------------------------------------------------------------ */}
        <div className={`cbj-reveal mx-auto max-w-[64ch] text-center ${isVisible ? "cbj-visible" : ""}`}>
          <p className="ng-display text-[15px] italic text-[#B8232F]">Guided from consultation to confirmation</p>
          <h2 className="ng-display mt-3 text-[34px] italic leading-[1.15] text-[#1C1024] sm:text-[42px] lg:text-[48px]">
            get your customized kundli based bracelets
          </h2>
          <p className="ng-ui mx-auto mt-5 max-w-[54ch] text-[15px] leading-relaxed text-[#1C1024]/60">
            get a bracelet made just for you according to your kundli, each stone is according to your planets
          </p>

          {productName && (
            <div className="ng-ui mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-[#1C1024]/10 bg-white px-3 py-1.5 text-[12px] text-[#1C1024]/60 shadow-[0_2px_10px_-4px_rgba(28,16,36,0.2)]">
              {productImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={productImage} alt="" className="h-5 w-5 rounded-full object-cover" />
              )}
              Customizing for <span className="font-semibold text-[#1C1024]">{productName}</span>
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Step rail — primary navigation, always visible                */}
        {/* ------------------------------------------------------------ */}
        <div
          className={`cbj-reveal mx-auto mt-10 max-w-3xl ${isVisible ? "cbj-visible" : ""}`}
          style={{ transitionDelay: "60ms" }}
        >
          <div className="cbj-gem-scroll flex items-center gap-1.5 overflow-x-auto pb-1 sm:justify-center">
            {STEPS.map((step, i) => (
              <div key={step.id} className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => selectStep(step.id)}
                  aria-current={activeStep === step.id}
                  className="cbj-pill ng-ui flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium"
                  style={{
                    borderColor: activeStep === step.id ? step.color : "#1C102420",
                    backgroundColor: activeStep === step.id ? step.color : "transparent",
                    color: activeStep === step.id ? "#FCFBF8" : "#1C1024AA",
                  }}
                >
                  <span
                    className="flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-semibold"
                    style={{
                      backgroundColor: activeStep === step.id ? "rgba(255,255,255,0.25)" : `${step.color}20`,
                      color: activeStep === step.id ? "#FCFBF8" : step.color,
                    }}
                  >
                    {i + 1}
                  </span>
                  {step.shortLabel}
                </button>
                {i < STEPS.length - 1 && <span className="h-px w-3 shrink-0 bg-[#1C1024]/15" aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Constellation panel — desktop visual + shared detail card     */}
        {/* ------------------------------------------------------------ */}
        <div
          className={`cbj-reveal relative mt-12 overflow-hidden rounded-[28px] bg-[#1C1024] px-6 py-8 shadow-[0_28px_60px_-32px_rgba(28,16,36,0.5)] sm:mt-14 sm:px-10 sm:py-10 ${
            isVisible ? "cbj-visible" : ""
          }`}
          style={{ transitionDelay: "120ms" }}
        >
          {/* Decorative twinkling backdrop */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            {BACKDROP_STARS.map((star, i) => (
              <span
                key={i}
                className="cbj-star"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  animationDelay: `${star.delay}s`,
                }}
              />
            ))}
          </div>

          {/* Progress meter */}
          <div className="relative">
            <div className="ng-ui flex items-center justify-between text-[11px] text-[#FCFBF8]/45">
              <span>
                Step {activeIndex + 1} of {STEPS.length}
              </span>
              <span>{activeMeta.status}</span>
            </div>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="cbj-progress-fill h-full rounded-full"
                style={{ width: `${progressPct}%`, backgroundImage: THREAD_GRADIENT }}
              />
            </div>
          </div>

          {/* Constellation — hidden on small screens, replaced by the accordion below */}
          <div
            className="relative mt-8 hidden md:block"
            style={{ aspectRatio: `${VIEWBOX_W} / ${VIEWBOX_H}` }}
          >
            <svg
              viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
              preserveAspectRatio="none"
            >
              <path
                d={CONSTELLATION_PATH}
                fill="none"
                stroke="rgba(252,251,248,0.16)"
                strokeWidth="2"
                pathLength={1}
              />
              <path
                d={CONSTELLATION_PATH}
                fill="none"
                stroke={activeMeta.dark ? "#E2711D" : activeMeta.color}
                strokeWidth="2"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={isVisible ? 1 - progressPct / 100 : 1}
                className="cbj-path"
              />
            </svg>

            {/* Traveling glow marking the active step's position */}
            <span
              aria-hidden="true"
              className="cbj-traveler absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={
                {
                  left: `${activePoint.left}%`,
                  top: `${activePoint.top}%`,
                  backgroundColor: activeMeta.dark ? "#E2711D" : activeMeta.color,
                  "--node-glow": activeMeta.dark ? "#E2711D" : activeMeta.color,
                } as React.CSSProperties
              }
            />

            {STEPS.map((step, i) => {
              const point = NODE_PERCENTS[i];
              const active = step.id === activeStep;
              const { Icon } = step;
              return (
                <button
                  key={step.id}
                  ref={(el) => {
                    nodeRefs.current[i] = el;
                  }}
                  type="button"
                  onClick={() => selectStep(step.id)}
                  onKeyDown={(e) => handleRailKeyDown(e, i)}
                  aria-current={active}
                  aria-label={`Step ${i + 1}: ${step.heading}`}
                  style={
                    {
                      left: `${point.left}%`,
                      top: `${point.top}%`,
                      borderColor: step.color,
                      backgroundColor: active ? step.color : "#1C1024",
                      color: active ? "#FCFBF8" : step.color,
                      "--node-glow": step.color,
                    } as React.CSSProperties
                  }
                  className={`cbj-node absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1024] ${
                    active ? "cbj-node-active" : ""
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  {rippleStep === step.id && (
                    <span key={rippleId} aria-hidden="true" className="cbj-ripple" style={{ color: step.color }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Shared detail card — desktop only; mobile uses the accordion below */}
          <div
            key={activeStep}
            className={`cbj-detail-card relative mt-8 hidden rounded-2xl px-6 py-5 md:block ${
              activeMeta.dark ? "border border-transparent bg-white/[0.06]" : "border border-white/10 bg-white/[0.04]"
            }`}
          >
            <StepDetailContent step={activeMeta} reportOpen={reportOpen} onToggleReport={() => setReportOpen((v) => !v)} />
          </div>

          {/* Mobile accordion — every step, one open at a time */}
          <div className="mt-8 space-y-2.5 md:hidden">
            {STEPS.map((step) => {
              const active = step.id === activeStep;
              const { Icon } = step;
              return (
                <div
                  key={step.id}
                  className={`cbj-mobile-row overflow-hidden rounded-2xl border ${
                    active ? "border-white/25 bg-white/[0.06]" : "border-white/10 bg-transparent"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => selectStep(step.id)}
                    aria-expanded={active}
                    className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
                  >
                    <span
                      style={
                        {
                          borderColor: step.color,
                          backgroundColor: active ? step.color : "#1C1024",
                          color: active ? "#FCFBF8" : step.color,
                          "--node-glow": step.color,
                        } as React.CSSProperties
                      }
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                        active ? "cbj-node-active" : ""
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="ng-ui flex-1 text-[13px] font-medium text-[#FCFBF8]/85">{step.heading}</span>
                    <ChevronIcon className={`h-4 w-4 shrink-0 text-[#FCFBF8]/40 cbj-chevron ${active ? "cbj-open" : ""}`} />
                  </button>

                  <div className={`cbj-report-panel ${active ? "cbj-open" : ""}`}>
                    <div className="cbj-report-inner">
                      <div className="px-4 pb-4">
                        <StepDetailContent
                          step={step}
                          reportOpen={reportOpen}
                          onToggleReport={() => setReportOpen((v) => !v)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Screen-reader-only announcement so the active step is clear
              even without seeing the visual state change. */}
          <p aria-live="polite" className="sr-only">
            Now showing step {activeIndex + 1} of {STEPS.length}: {activeMeta.heading}.
          </p>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Bottom CTA                                                    */}
        {/* ------------------------------------------------------------ */}
        <div
          className={`cbj-reveal cbj-clip-lg relative mx-auto mt-14 max-w-2xl overflow-hidden bg-[#1C1024] px-8 py-10 text-center shadow-[0_28px_60px_-32px_rgba(28,16,36,0.5)] sm:mt-16 sm:px-12 sm:py-12 ${
            isVisible ? "cbj-visible" : ""
          }`}
          style={{ transitionDelay: "180ms" }}
        >
          <div className="h-[3px] w-full" style={{ backgroundImage: THREAD_GRADIENT }} aria-hidden="true" />
          <div className="pt-8 sm:pt-9">
            <h3 className="ng-display text-[26px] italic leading-tight text-[#FCFBF8] sm:text-[30px]">
              Begin your personalized bracelet journey
            </h3>
            <p className="ng-ui mx-auto mt-4 max-w-[46ch] text-[14.5px] leading-relaxed text-[#FCFBF8]/65">
              Share your birth details and let our astrology experts guide you toward a bracelet made for
              your kundli. The reading is completely free.
            </p>
            <a
              ref={ctaRef}
              href={ctaHref}
              onClick={onCtaClick}
              onMouseMove={handleCtaMove}
              onMouseLeave={resetMagnet}
              onMouseDown={() => setPressed(true)}
              onMouseUp={() => setPressed(false)}
              style={{ transform: `translate(${magnet.x}px, ${magnet.y}px)` }}
              className="cbj-clip cbj-cta ng-ui group mx-auto mt-7 flex w-fit items-center justify-center gap-2 whitespace-nowrap bg-[#E2711D] px-7 py-3.5 text-[14.5px] font-semibold text-[#1C1024] hover:bg-[#F08A3C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1024]"
            >
              Start your free consultation
              <ArrowIcon
                className={`h-4 w-4 transition-transform duration-200 ${pressed ? "" : "group-hover:translate-x-1"}`}
              />
            </a>
            <p className="ng-ui mx-auto mt-4 max-w-[48ch] text-[12px] leading-relaxed text-[#FCFBF8]/40">
              You only pay once you've reviewed and approved your personalized bracelet recommendation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}