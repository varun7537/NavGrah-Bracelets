import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";

import Image, { type StaticImageData } from "next/image";

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

type ElementKey = "fire" | "earth" | "air" | "water";

interface ElementTheme {
  core: string;
  glow: string;
  label: string;
}

const ELEMENT_COLORS: Record<ElementKey, ElementTheme> = {
  fire: { core: "#B4415C", glow: "#F0AFC0", label: "Fire" },
  earth: { core: "#A47A2E", glow: "#EBD39B", label: "Earth" },
  air: { core: "#3E5EA3", glow: "#BFD0EE", label: "Air" },
  water: { core: "#2B7A57", glow: "#B7E6CC", label: "Water" },
};

interface RashiBase {
  id: string;
  symbol: string;
  /** Photo representing the rashi — used in the astrolabe, strip cards, and reading panel. */
  image: StaticImageData;
  sanskrit: string;
  english: string;
  range: string;
  gem: string;
  priceFrom: string;
  theme: string;
  element: ElementKey;
}

interface Rashi extends RashiBase {
  startAngle: number;
  endAngle: number;
  midAngle: number;
  degrees: string;
}

const RASHI_BASE: RashiBase[] = [
  { id: "mesha", symbol: "♈", image: Aries, sanskrit: "Mesha", english: "Aries", range: "Mar 21 – Apr 19", gem: "Red Coral", priceFrom: "₹2,499", theme: "Leadership & new beginnings", element: "fire" },
  { id: "vrishabha", symbol: "♉", image: Taurus, sanskrit: "Vrishabha", english: "Taurus", range: "Apr 20 – May 20", gem: "Diamond", priceFrom: "₹8,999", theme: "Stability & abundance", element: "earth" },
  { id: "mithuna", symbol: "♊", image: Gemini, sanskrit: "Mithuna", english: "Gemini", range: "May 21 – Jun 20", gem: "Emerald", priceFrom: "₹4,299", theme: "Curiosity & expression", element: "air" },
  { id: "karka", symbol: "♋", image: Cancer, sanskrit: "Karka", english: "Cancer", range: "Jun 21 – Jul 22", gem: "Pearl", priceFrom: "₹2,999", theme: "Nurturing & intuition", element: "water" },
  { id: "simha", symbol: "♌", image: Leo, sanskrit: "Simha", english: "Leo", range: "Jul 23 – Aug 22", gem: "Ruby", priceFrom: "₹5,499", theme: "Confidence & radiance", element: "fire" },
  { id: "kanya", symbol: "♍", image: Virgo, sanskrit: "Kanya", english: "Virgo", range: "Aug 23 – Sep 22", gem: "Emerald", priceFrom: "₹4,299", theme: "Precision & service", element: "earth" },
  { id: "tula", symbol: "♎", image: Libra, sanskrit: "Tula", english: "Libra", range: "Sep 23 – Oct 22", gem: "Diamond", priceFrom: "₹8,999", theme: "Balance & harmony", element: "air" },
  { id: "vrishchika", symbol: "♏", image: Scorpio, sanskrit: "Vrishchika", english: "Scorpio", range: "Oct 23 – Nov 21", gem: "Red Coral", priceFrom: "₹2,499", theme: "Depth & transformation", element: "water" },
  { id: "dhanu", symbol: "♐", image: Sagittarius, sanskrit: "Dhanu", english: "Sagittarius", range: "Nov 22 – Dec 21", gem: "Yellow Sapphire", priceFrom: "₹6,499", theme: "Optimism & exploration", element: "fire" },
  { id: "makara", symbol: "♑", image: Capricorn, sanskrit: "Makara", english: "Capricorn", range: "Dec 22 – Jan 19", gem: "Blue Sapphire", priceFrom: "₹6,999", theme: "Discipline & ambition", element: "earth" },
  { id: "kumbha", symbol: "♒", image: Aquarius, sanskrit: "Kumbha", english: "Aquarius", range: "Jan 20 – Feb 18", gem: "Blue Sapphire", priceFrom: "₹6,999", theme: "Vision & originality", element: "air" },
  { id: "meena", symbol: "♓", image: Pisces, sanskrit: "Meena", english: "Pisces", range: "Feb 19 – Mar 20", gem: "Yellow Sapphire", priceFrom: "₹6,499", theme: "Compassion & imagination", element: "water" },
];

const RASHIS: Rashi[] = RASHI_BASE.map((r, i) => {
  const start = -90 + i * 30;
  return {
    ...r,
    startAngle: start,
    endAngle: start + 30,
    midAngle: start + 15,
    degrees: `${i * 30}\u00B0\u2013${i * 30 + 30}\u00B0`,
  };
});

interface DustSpeck {
  x: number;
  y: number;
  r: number;
  delay: number;
}

// Sparse, deterministic dust so the night panel feels hand-placed rather
// than regenerated on every render.
const DUST: DustSpeck[] = Array.from({ length: 26 }, (_, i) => {
  const seed = i * 137.5;
  return {
    x: Number(((seed * 3.1) % 100).toFixed(2)),
    y: Number(((seed * 1.9) % 100).toFixed(2)),
    r: Number((0.4 + ((seed * 0.618) % 1.1)).toFixed(2)),
    delay: Number(((seed * 0.41) % 6).toFixed(2)),
  };
});

function polarToXY(cx: number, cy: number, radius: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

// A stroke-only arc (not a filled wedge) used to highlight the active
// rashi's span on the outer ring, like a section of the ring re-engraved.
function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const p1 = polarToXY(cx, cy, r, startDeg);
  const p2 = polarToXY(cx, cy, r, endDeg);
  const largeArc = endDeg - startDeg <= 180 ? 0 : 1;
  return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${largeArc} 1 ${p2.x} ${p2.y}`;
}

function useInView<T extends HTMLElement>(options?: IntersectionObserverInit): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options);
    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, inView];
}

interface AboutNavgrahProps {
  /** Called when someone wants to browse the collection, optionally for one rashi. */
  onExplore?: (rashiId: string | null) => void;
}

export default function AboutNavgrah({ onExplore }: AboutNavgrahProps) {
  const [selectedRashi, setSelectedRashi] = useState<string | null>(null);
  const [hoveredRashi, setHoveredRashi] = useState<string | null>(null);
  const [sectionRef, sectionInView] = useInView<HTMLElement>({ threshold: 0.15 });

  const activeId = hoveredRashi ?? selectedRashi;
  const activeRashi = useMemo(() => RASHIS.find((r) => r.id === activeId) ?? null, [activeId]);
  const activeIndex = activeRashi ? RASHIS.indexOf(activeRashi) : null;
  const activeAngle = activeRashi ? activeRashi.midAngle : -90;

  const handleExplore = useCallback(() => {
    if (typeof onExplore === "function") {
      onExplore(activeRashi ? activeRashi.id : null);
      return;
    }
    // Sensible default so the button still does something if no handler is
    // wired up: jump to a "#collection" anchor if the page has one.
    document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
  }, [onExplore, activeRashi]);

  const handleToggle = useCallback((id: string) => {
    setSelectedRashi((prev) => (prev === id ? null : id));
  }, []);

  const cx = 260;
  const cy = 260;
  const rOuter = 214;
  const rTickMinorInner = 207;
  const rTickMajorInner = 198;
  const rSymbol = 168;
  const rMedallion = 18;
  const rInner = 96;
  const rHub = 54;

  const circOuter = 2 * Math.PI * rOuter;
  const circInner = 2 * Math.PI * rInner;

  const minorTicks = useMemo(() => Array.from({ length: 60 }, (_, i) => -90 + i * 6), []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="navgrah-heading"
      id="navgrah-section"
      className="
        [--void:#0E1023] [--void-deep:#05060D]
        [--parchment:#F4EEDE] [--parchment-deep:#E9DFC4]
        [--ink:#241C10] [--ink-soft:rgba(36,28,16,0.68)] [--ink-faint:rgba(36,28,16,0.5)]
        [--paper-ink:#EFE7D2] [--paper-ink-soft:rgba(239,231,210,0.7)] [--paper-ink-faint:rgba(239,231,210,0.48)]
        [--brass:#C7A05A] [--brass-bright:#F0D9A0] [--brass-deep:#8B6B32]
        [--hairline:rgba(199,160,90,0.22)]
        [--font-display:'Fraunces',Georgia,serif] [--font-body:'Inter',-apple-system,sans-serif]
        relative overflow-hidden box-border isolate
        [font-family:var(--font-body)] text-[color:var(--paper-ink)]
        bg-[color:var(--void)]
        px-4 pt-16 pb-16 sm:px-6 sm:pt-20 sm:pb-20 lg:px-10 lg:pt-24 lg:pb-24
      "
    >
      <style>{`
        @keyframes navTwinkle { 0%, 100% { opacity: 0.15; } 50% { opacity: 0.75; } }
        @keyframes navHubPulse { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 0.85; transform: scale(1.06); } }
        @keyframes navReadoutIn { from { opacity: 0; transform: translateY(6px) scale(0.985); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .nav-strip::-webkit-scrollbar { height: 5px; }
        .nav-strip::-webkit-scrollbar-track { background: transparent; }
        .nav-strip::-webkit-scrollbar-thumb { background: var(--brass); border-radius: 999px; opacity: 0.5; }
      `}</style>

      {/* faint radial washes, jewel-toned, very low opacity */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-80">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(46% 40% at 82% 8%, rgba(199,160,90,0.09) 0%, rgba(199,160,90,0) 70%)," +
              "radial-gradient(40% 34% at 4% 96%, rgba(62,94,163,0.10) 0%, rgba(62,94,163,0) 70%)",
          }}
        />
        {DUST.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-[color:var(--brass)] motion-safe:animate-[navTwinkle_5s_ease-in-out_infinite]"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.r * 2}px`, height: `${s.r * 2}px`, animationDelay: `${s.delay}s` }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-[1240px]">
        {/* ---------- Mark + header ---------- */}
        <div className="mb-10 flex items-center justify-between gap-4 sm:mb-14">
          <span className="[font-family:var(--font-display)] text-[19px] italic text-[color:var(--brass-bright)]">
            NavGrah Bracelets
          </span>
          <span aria-hidden="true" className="hidden h-px flex-1 bg-[color:var(--hairline)] sm:block" />
          <span className="text-[12px] text-[color:var(--paper-ink-faint)]">Gemstone bracelets by rashi</span>
        </div>

        {/* ---------- Hero: text + astrolabe ---------- */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.86fr)] lg:gap-16 xl:gap-24">
          <div>
            <p className="mb-5 [font-family:var(--font-display)] text-[17px] italic text-[color:var(--paper-ink-soft)]">
              As above, so adorned.
            </p>
            <h2
              id="navgrah-heading"
              className="mb-6 [font-family:var(--font-display)] font-medium leading-[1.08] text-[color:var(--paper-ink)] text-[clamp(2rem,1.5rem+2.4vw,3.6rem)]"
            >
              Wear the chart you were born under.
            </h2>
            <p className="mb-4 max-w-[56ch] text-[15.5px] leading-[1.75] text-[color:var(--paper-ink-soft)]">
              Vedic astrology already assigns each of the twelve rashis a ruling
              stone — most people just never wear it. NavGrah follows that same
              rashi-to-ratna mapping, cuts and sets the gem in-house, and puts
              it on a bracelet you'd actually reach for every morning.
            </p>
            <p className="max-w-[56ch] text-[15.5px] leading-[1.75] text-[color:var(--paper-ink-soft)]">
              Trace the wheel below to find your rashi and its bracelet, or
              turn the pointer with a touch — it's the same wheel astrologers
              have read for centuries.
            </p>
          </div>

          {/* Astrolabe */}
          <div className="relative mx-auto w-full max-w-[440px]">
            <svg viewBox="0 0 520 520" xmlns="http://www.w3.org/2000/svg" className="h-auto w-full">
              <defs>
                <radialGradient id="navHubGradient" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#f6e3b4" />
                  <stop offset="55%" stopColor="#c9a24b" />
                  <stop offset="100%" stopColor="#7c5e28" />
                </radialGradient>
                <radialGradient id="navHubGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(240,217,160,0.5)" />
                  <stop offset="100%" stopColor="rgba(240,217,160,0)" />
                </radialGradient>

                {/* One circular clip path per rashi, reused by both the photo and its ring. */}
                {RASHIS.map((r) => (
                  <clipPath key={r.id} id={`navMedallionClip-${r.id}`}>
                    <circle cx="0" cy="0" r={rMedallion} />
                  </clipPath>
                ))}
              </defs>

              {/* outer + inner engraved rings — draw themselves in once, on scroll into view */}
              <circle
                cx={cx}
                cy={cy}
                r={rOuter}
                className="fill-none stroke-[color:var(--brass)] motion-reduce:!stroke-[1px]"
                style={{
                  strokeWidth: 1,
                  strokeDasharray: circOuter,
                  strokeDashoffset: sectionInView ? 0 : circOuter,
                  opacity: 0.55,
                  transition: "stroke-dashoffset 1500ms cubic-bezier(0.22,1,0.36,1)",
                }}
              />
              <circle
                cx={cx}
                cy={cy}
                r={rInner}
                className="fill-none stroke-[color:var(--brass)]"
                style={{
                  strokeWidth: 1,
                  strokeDasharray: circInner,
                  strokeDashoffset: sectionInView ? 0 : circInner,
                  opacity: 0.4,
                  transition: "stroke-dashoffset 1200ms cubic-bezier(0.22,1,0.36,1) 200ms",
                }}
              />

              {/* active-rashi highlight arc on the outer ring */}
              {activeRashi && (
                <path
                  d={arcPath(cx, cy, rOuter, activeRashi.startAngle, activeRashi.endAngle)}
                  className="fill-none transition-opacity duration-300 ease-out"
                  style={{
                    stroke: ELEMENT_COLORS[activeRashi.element].glow,
                    strokeWidth: 3.5,
                    strokeLinecap: "round",
                    filter: `drop-shadow(0 0 6px ${ELEMENT_COLORS[activeRashi.element].glow})`,
                  }}
                />
              )}

              {/* degree ticks */}
              {minorTicks.map((deg, i) => {
                const isMajor = deg % 30 === 0;
                const inner = isMajor ? rTickMajorInner : rTickMinorInner;
                const p1 = polarToXY(cx, cy, rOuter, deg);
                const p2 = polarToXY(cx, cy, inner, deg);
                return (
                  <line
                    key={i}
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke="var(--brass)"
                    strokeWidth={isMajor ? 1 : 0.5}
                    style={{
                      opacity: sectionInView ? (isMajor ? 0.6 : 0.3) : 0,
                      transition: `opacity 500ms ease-out ${300 + i * 4}ms`,
                    }}
                  />
                );
              })}

              {/* rashi photo medallions */}
              {RASHIS.map((r) => {
                const active = activeId === r.id;
                const colors = ELEMENT_COLORS[r.element];
                const pos = polarToXY(cx, cy, rSymbol, r.midAngle);
                const ringR = active ? rMedallion + 2.5 : rMedallion - 1;
                return (
                  <g
                    key={r.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    style={{
                      opacity: sectionInView ? 1 : 0,
                      transition: "opacity 600ms ease-out 500ms",
                    }}
                  >
                    <circle
                      r={ringR}
                      className="transition-[r,filter] duration-300 ease-out"
                      style={{
                        fill: "var(--void-deep)",
                        stroke: active ? colors.glow : "rgba(199,160,90,0.45)",
                        strokeWidth: active ? 1.8 : 1,
                        filter: active ? `drop-shadow(0 0 7px ${colors.glow})` : "none",
                      }}
                    />
                    <image
                      href={r.image.src}
                      x={-rMedallion}
                      y={-rMedallion}
                      width={rMedallion * 2}
                      height={rMedallion * 2}
                      clipPath={`url(#navMedallionClip-${r.id})`}
                      preserveAspectRatio="xMidYMid slice"
                      style={{
                        opacity: active ? 1 : 0.82,
                        transition: "opacity 300ms ease-out",
                      }}
                    />
                  </g>
                );
              })}

              {/* pointer — the one part of the instrument that always answers you */}
              <g
                style={{
                  transform: `rotate(${activeAngle}deg)`,
                  transformOrigin: `${cx}px ${cy}px`,
                  transition: "transform 700ms cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                <line x1={cx} y1={cy} x2={cx} y2={cy - rOuter + 4} stroke="var(--brass-bright)" strokeWidth={1.25} />
                <circle cx={cx} cy={cy - rOuter + 4} r={3.5} fill="var(--brass-bright)" />
              </g>

              {/* central hub */}
              <circle cx={cx} cy={cy} r={rHub + 20} fill="url(#navHubGlow)" className="motion-safe:animate-[navHubPulse_6s_ease-in-out_infinite]" />
              <circle cx={cx} cy={cy} r={rHub} fill="url(#navHubGradient)" stroke="rgba(255,255,255,0.3)" strokeWidth={0.75} />
              <g transform={`translate(${cx}, ${cy})`} stroke="rgba(255,255,255,0.4)" strokeWidth={0.6} fill="none">
                <path d="M0,-26 L18,-9 L11,23 L-11,23 L-18,-9 Z" />
                <path d="M0,-26 L0,23 M-18,-9 L18,-9 M-11,23 L0,-9 L11,23" />
              </g>
            </svg>
          </div>
        </div>

        {/* ---------- Ephemeris rail + strip ---------- */}
        <div className="mt-16 sm:mt-20 lg:mt-24">
          <div className="mb-3 flex items-baseline justify-between">
            <h3 className="[font-family:var(--font-display)] text-[20px] text-[color:var(--paper-ink)]">
              Trace the wheel
            </h3>
            <span className="text-[12px] text-[color:var(--paper-ink-faint)]">0&deg; – 360&deg;</span>
          </div>

          {/* degree rail with sliding marker */}
          <div className="relative mx-1 mb-5 h-[2px] bg-[color:var(--hairline)]">
            {RASHIS.map((r, i) => (
              <span
                key={r.id}
                aria-hidden="true"
                className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-[color:var(--hairline)]"
                style={{ left: `${(i / 11) * 100}%` }}
              />
            ))}
            <span
              aria-hidden="true"
              className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[color:var(--brass-bright)]"
              style={{
                left: activeIndex !== null ? `${(activeIndex / 11) * 100}%` : "0%",
                opacity: activeIndex !== null ? 1 : 0,
                boxShadow: "0 0 8px var(--brass-bright)",
                transition: "left 500ms cubic-bezier(0.22,1,0.36,1), opacity 300ms ease-out",
              }}
            />
          </div>

          {/* scrollable plates */}
          <div className="relative">
            <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[color:var(--void)] to-transparent" />
            <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[color:var(--void)] to-transparent" />
            <nav aria-label="The twelve rashis and their gemstone bracelets" className="nav-strip flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2">
              {RASHIS.map((r) => {
                const selected = selectedRashi === r.id;
                const hovered = hoveredRashi === r.id;
                const colors = ELEMENT_COLORS[r.element];
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleToggle(r.id)}
                    onMouseEnter={() => setHoveredRashi(r.id)}
                    onMouseLeave={() => setHoveredRashi(null)}
                    onFocus={() => setHoveredRashi(r.id)}
                    onBlur={() => setHoveredRashi(null)}
                    aria-pressed={selected}
                    aria-label={`${r.sanskrit}, ${r.english}, ${r.range}, ${colors.label} sign, bracelet stone ${r.gem}, from ${r.priceFrom}`}
                    className="
                      group relative flex w-[128px] shrink-0 snap-start flex-col items-center gap-2
                      rounded-lg border p-4 text-center transition-all duration-300 ease-out
                      hover:-translate-y-1 focus-visible:-translate-y-1
                      focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                      motion-reduce:transition-none motion-reduce:hover:translate-y-0
                    "
                    style={{
                      background: "var(--parchment)",
                      borderColor: selected || hovered ? colors.core : "var(--parchment-deep)",
                      boxShadow: selected ? `0 10px 22px -12px ${colors.core}` : hovered ? `0 8px 18px -12px ${colors.core}` : "none",
                      outlineColor: colors.core,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-110"
                      style={{ boxShadow: `0 0 0 2px ${colors.core}` }}
                    >
                      <Image src={r.image} alt="" fill sizes="36px" className="object-cover" />
                    </span>
                    <span className="[font-family:var(--font-display)] text-[16px] leading-tight text-[color:var(--ink)]">
                      {r.sanskrit}
                    </span>
                    <span className="text-[10.5px] text-[color:var(--ink-faint)]">{r.english} &middot; {r.degrees}</span>
                    <span className="text-[10.5px] font-medium" style={{ color: colors.core }}>{r.priceFrom}</span>
                    {selected && (
                      <span aria-hidden="true" className="absolute right-2 top-2 h-[6px] w-[6px] rounded-full" style={{ background: colors.core }} />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
          <p className="mt-3 text-[12px] text-[color:var(--paper-ink-faint)] sm:hidden">
            Scroll to browse. Tap a rashi to hold its bracelet below.
          </p>
        </div>

        {/* ---------- Reading panel ---------- */}
        <div
          key={activeRashi ? activeRashi.id : "default"}
          className="relative mt-8 overflow-hidden rounded-2xl border animate-[navReadoutIn_400ms_ease-out] motion-reduce:animate-none"
          style={{ background: "var(--parchment)", borderColor: "var(--parchment-deep)" }}
        >
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[3px]"
            style={{ background: activeRashi ? ELEMENT_COLORS[activeRashi.element].core : "linear-gradient(to right, #B4415C, #A47A2E, #3E5EA3, #2B7A57)" }}
          />
          <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            {activeRashi ? (
              <div className="flex items-center gap-5">
                <span
                  aria-hidden="true"
                  className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full"
                  style={{ boxShadow: `0 0 0 2.5px ${ELEMENT_COLORS[activeRashi.element].core}` }}
                >
                  <Image src={activeRashi.image} alt="" fill sizes="56px" className="object-cover" />
                </span>
                <div>
                  <p className="[font-family:var(--font-display)] text-[22px] text-[color:var(--ink)]">
                    {activeRashi.sanskrit} &middot; {activeRashi.english} bracelet
                  </p>
                  <p className="mt-1 text-[13.5px] text-[color:var(--ink-soft)]">
                    {activeRashi.range} &nbsp;&mdash;&nbsp; {activeRashi.theme}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-[13px] font-medium" style={{ color: ELEMENT_COLORS[activeRashi.element].core }}>
                    <span aria-hidden="true" className="h-[6px] w-[6px] rounded-full" style={{ background: ELEMENT_COLORS[activeRashi.element].core }} />
                    {activeRashi.gem} &middot; from {activeRashi.priceFrom}
                  </p>
                </div>
              </div>
            ) : (
              <div className="max-w-[46ch]">
                <p className="[font-family:var(--font-display)] text-[22px] text-[color:var(--ink)]">
                  Twelve rashis, twelve bracelets.
                </p>
                <p className="mt-1 text-[13.5px] leading-[1.6] text-[color:var(--ink-soft)]">
                  Hold a rashi above to see its ruling gemstone, price, and bracelet — or go straight to the full NavGrah collection.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleExplore}
              className="
                inline-flex shrink-0 cursor-pointer appearance-none items-center justify-center
                whitespace-nowrap rounded-full border px-7 py-3 text-[13.5px] font-medium
                tracking-[0.01em] transition-all duration-300 ease-out
                hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-10px_rgba(139,107,50,0.55)]
                active:translate-y-0 active:scale-95
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                motion-reduce:transition-none motion-reduce:hover:translate-y-0
              "
              style={{
                borderColor: "var(--brass)",
                background: "linear-gradient(to bottom, var(--brass-bright), var(--brass))",
                color: "var(--ink)",
                outlineColor: "var(--brass-deep)",
              }}
            >
              {activeRashi ? `See ${activeRashi.english} bracelets` : "Explore the collection"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}