import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";

interface Planet {
  id: string;
  symbol: string;
  sanskrit: string;
  english: string;
  gem: string;
  theme: string;
  core: string;
  glow: string;
  radius: number;
  angle: number;
}

interface Star {
  x: string;
  y: string;
  r: string;
  delay: string;
}

interface AboutNavgrahProps {
  onExplore?: () => void;
}


const PLANETS: Planet[] = [
  { id: "surya", symbol: "☉", sanskrit: "Surya", english: "Sun", gem: "Ruby", theme: "Confidence & vitality", core: "#A8334C", glow: "#F0BFC9", radius: 0, angle: 0 },
  { id: "chandra", symbol: "☾", sanskrit: "Chandra", english: "Moon", gem: "Moonstone", theme: "Emotions & calm", core: "#7C8296", glow: "#E8E9EE", radius: 92, angle: 20 },
  { id: "mangal", symbol: "♂", sanskrit: "Mangal", english: "Mars", gem: "Garnet", theme: "Courage & energy", core: "#7B2D3B", glow: "#E3B9C0", radius: 92, angle: 160 },
  { id: "budh", symbol: "☿", sanskrit: "Budh", english: "Mercury", gem: "Emerald", theme: "Communication & intellect", core: "#256B4E", glow: "#B7E0CB", radius: 92, angle: 260 },
  { id: "guru", symbol: "♃", sanskrit: "Guru", english: "Jupiter", gem: "Citrine", theme: "Wisdom & growth", core: "#C08A2E", glow: "#F4DFA0", radius: 150, angle: 60 },
  { id: "shukra", symbol: "♀", sanskrit: "Shukra", english: "Venus", gem: "Rose Quartz", theme: "Love & harmony", core: "#C97B93", glow: "#F6DEE6", radius: 150, angle: 200 },
  { id: "shani", symbol: "♄", sanskrit: "Shani", english: "Saturn", gem: "Blue Sapphire", theme: "Discipline & responsibility", core: "#33518A", glow: "#C3D2EA", radius: 150, angle: 320 },
  { id: "rahu", symbol: "☊", sanskrit: "Rahu", english: "North Node", gem: "Terracotta Hessonite", theme: "Ambition & transformation", core: "#B1522E", glow: "#EFC3AC", radius: 202, angle: 110 },
  { id: "ketu", symbol: "☋", sanskrit: "Ketu", english: "South Node", gem: "Amethyst", theme: "Spirituality & introspection", core: "#6B4A85", glow: "#DCCBEA", radius: 202, angle: 290 },
];

// Deterministic-looking scatter of background stars so the field feels
// hand-placed rather than randomly regenerated on every render.
const STARS: Star[] = Array.from({ length: 40 }, (_, i) => {
  const seed = i * 137.5;
  return {
    x: ((seed * 3.1) % 100).toFixed(2),
    y: ((seed * 1.7) % 100).toFixed(2),
    r: (0.5 + ((seed * 0.618) % 1.3)).toFixed(2),
    delay: ((seed * 0.37) % 6).toFixed(2),
  };
});

function polarToXY(cx: number, cy: number, radius: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
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

  return [ref, inView] as const;
}

export default function AboutNavgrah({ onExplore }: AboutNavgrahProps) {
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [sectionRef, sectionInView] = useInView<HTMLElement>({ threshold: 0.1 });

  const highlighted = hoveredPlanet ?? selectedPlanet;

  const handleExplore = useCallback(() => {
    if (typeof onExplore === "function") onExplore();
  }, [onExplore]);

  const handleToggle = useCallback((id: string) => {
    setSelectedPlanet((prev) => (prev === id ? null : id));
  }, []);

  const cx = 260;
  const cy = 260;

  const orbitRings = useMemo(
    () => [
      { r: 92, animateClass: "motion-safe:animate-[navOrbit_90s_linear_infinite]" },
      { r: 150, animateClass: "motion-safe:animate-[navOrbit_130s_linear_infinite_reverse]" },
      { r: 202, animateClass: "motion-safe:animate-[navOrbit_175s_linear_infinite]" },
    ],
    []
  );

  const fadeBase = "opacity-0 translate-y-3 motion-reduce:opacity-100 motion-reduce:translate-y-0";
  const fadeIn = (delay: string) =>
    sectionInView
      ? `opacity-100 translate-y-0 transition-all duration-700 ease-out ${delay}`
      : fadeBase;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="navgrah-heading"
      id="navgrah-section"
      className="
        [--paper:#FAF6EE] [--paper-deep:#F1E9D8]
        [--ink:#2B2233] [--ink-soft:rgba(43,34,51,0.68)] [--ink-faint:rgba(43,34,51,0.46)]
        [--card:#FFFFFF] [--line:rgba(43,34,51,0.11)]
        [--gold:#B07E33] [--gold-deep:#8C6224] [--gold-light:#E9CFA0]
        [--velvet-1:#1B1530] [--velvet-2:#100C1E] [--velvet-line:rgba(233,207,160,0.24)]
        [--font-display:'Cormorant_Garamond',Georgia,serif] [--font-body:'Inter',-apple-system,sans-serif]
        relative overflow-hidden box-border
        [font-family:var(--font-body)] text-[color:var(--ink)]
        bg-[color:var(--paper)]
        px-4 pt-14 pb-14 sm:px-6 sm:pt-20 sm:pb-16 lg:px-8 lg:pt-24 lg:pb-20
      "
    >
      {/* Keyframes Tailwind's arbitrary `animate-[...]` utilities reference.
          Move these into tailwind.config.js -> theme.extend.keyframes for a
          production build; kept here so this file works standalone. */}
      <style>{`
        @keyframes navOrbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes navTwinkle { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.95; } }
        @keyframes navPulse { 0%, 100% { opacity: 0.55; } 50% { opacity: 0.85; } }
      `}</style>

      {/* faint paper texture: a few large, low-opacity gem-toned washes */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(38% 32% at 6% 4%, rgba(168,51,76,0.05) 0%, rgba(168,51,76,0) 70%)," +
              "radial-gradient(40% 34% at 96% 10%, rgba(37,107,78,0.05) 0%, rgba(37,107,78,0) 70%)," +
              "radial-gradient(42% 36% at 92% 96%, rgba(51,81,138,0.05) 0%, rgba(51,81,138,0) 70%)," +
              "radial-gradient(36% 30% at 4% 94%, rgba(176,126,51,0.06) 0%, rgba(176,126,51,0) 70%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1240px]">
        {/* ---------- Header ---------- */}
        <header className="mx-auto mb-12 max-w-[700px] text-center sm:mb-16">
          <span
            className={`mb-4 inline-block text-xs uppercase tracking-[0.22em] text-[color:var(--gold-deep)] ${fadeIn("delay-[50ms]")}`}
          >
            The Navgraha Bracelets
          </span>
          <h2
            id="navgrah-heading"
            className={`mb-4 [font-family:var(--font-display)] font-medium leading-[1.12] text-[color:var(--ink)] text-[clamp(1.85rem,1.35rem+2.2vw,3.4rem)] ${fadeIn("delay-[160ms]")}`}
          >
            Ancient Wisdom. Personalized for You.
          </h2>
          <p className={`mx-auto max-w-[540px] text-base leading-[1.65] text-[color:var(--ink-soft)] ${fadeIn("delay-[280ms]")}`}>
            Discover the nine planetary influences that form the foundation of
            Navgrah astrology and inspire our personalized gemstone bracelets.
          </p>
        </header>

        {/* ---------- Orbit + content ---------- */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)] lg:gap-14 xl:gap-20">
          {/* Left: the "jewelry box" — a dark velvet panel holding the orbit,
              set inside the light page like an opened case on a table. */}
          <div
            aria-hidden="true"
            className={`relative flex items-center justify-center rounded-[28px] p-6 shadow-[0_28px_60px_-30px_rgba(43,34,51,0.45)] sm:p-8 lg:p-10 ${fadeIn("delay-[200ms]")}`}
            style={{
              background:
                "radial-gradient(120% 90% at 20% 0%, rgba(233,207,160,0.10), transparent 55%), linear-gradient(160deg, var(--velvet-1) 0%, var(--velvet-2) 100%)",
              border: "1px solid var(--velvet-line)",
            }}
          >
            <svg
              viewBox="0 0 520 520"
              xmlns="http://www.w3.org/2000/svg"
              className="h-auto w-full max-w-[300px] sm:max-w-[360px] md:max-w-[420px] lg:max-w-[480px]"
            >
              <defs>
                <radialGradient id="navSunGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f6e3b4" />
                  <stop offset="55%" stopColor="#c9a24b" />
                  <stop offset="100%" stopColor="#8a6a2c" />
                </radialGradient>
                <radialGradient id="navSunGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(232,210,160,0.55)" />
                  <stop offset="100%" stopColor="rgba(232,210,160,0)" />
                </radialGradient>
              </defs>

              {/* star field */}
              {STARS.map((s, i) => (
                <circle
                  key={i}
                  cx={`${s.x}%`}
                  cy={`${s.y}%`}
                  r={s.r}
                  className="fill-[#E9CFA0] motion-safe:animate-[navTwinkle_4.5s_ease-in-out_infinite]"
                  style={{ animationDelay: `${s.delay}s` }}
                />
              ))}

              {/* orbital rings */}
              <circle cx={cx} cy={cy} r={92} className="fill-none stroke-[rgba(233,207,160,0.28)] [stroke-width:0.6]" />
              <circle cx={cx} cy={cy} r={150} className="fill-none stroke-[rgba(233,207,160,0.28)] [stroke-width:0.6]" />
              <circle cx={cx} cy={cy} r={202} className="fill-none stroke-[rgba(233,207,160,0.28)] [stroke-width:0.6]" />

              {/* sun */}
              <circle cx={cx} cy={cy} r={40} fill="url(#navSunGlow)" className="motion-safe:animate-[navPulse_6s_ease-in-out_infinite]" />
              <circle cx={cx} cy={cy} r={20} fill="url(#navSunGradient)" />

              {orbitRings.map(({ r, animateClass }) => (
                <g key={r} className={`[transform-box:fill-box] [transform-origin:center] ${animateClass}`}>
                  {PLANETS.filter((p) => p.radius === r).map((p) => {
                    const pos = polarToXY(cx, cy, p.radius, p.angle);
                    const active = highlighted === p.id;
                    return (
                      <g key={p.id} transform={`translate(${pos.x}, ${pos.y})`}>
                        <circle
                          r={active ? 9 : 7}
                          cx={0}
                          cy={0}
                          className="transition-[filter,r] duration-300 ease-out"
                          style={{
                            fill: p.core,
                            stroke: active ? p.glow : "rgba(233,207,160,0.55)",
                            strokeWidth: 1.2,
                            filter: active ? `drop-shadow(0 0 7px ${p.glow})` : "none",
                          }}
                        />
                        <text
                          textAnchor="middle"
                          x={0}
                          y={-14}
                          className="[font-family:var(--font-body)] text-[7.5px] [letter-spacing:0.06em]"
                          style={{ fill: active ? p.glow : "rgba(244,240,230,0.72)" }}
                        >
                          {p.sanskrit}
                        </text>
                      </g>
                    );
                  })}
                </g>
              ))}
            </svg>
          </div>

          {/* Right: content */}
          <div className={fadeIn("delay-[340ms]")}>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[color:var(--gold-deep)]">About NavGrah Bracelets?</p>
            <h3 className="mb-4 [font-family:var(--font-display)] text-[clamp(1.5rem,1.2rem+1vw,2.15rem)] font-medium text-[color:var(--ink)]">
              Nine Forces, One Timeless Harmony.
            </h3>
            <p className="mb-7 max-w-[62ch] text-[15.5px] leading-[1.75] text-[color:var(--ink-soft)]">
              NavGrah Bracelets is a premium gemstone bracelet brand focused on bringing together natural stones, thoughtful craftsmanship, and contemporary design. The brand creates bracelets inspired by the traditional significance of gemstones while presenting them in a modern, refined, and wearable form.
              Each bracelet is thoughtfully designed with attention to the stone, quality, craftsmanship, and overall finish. From timeless gemstones to distinctive contemporary combinations, NavGrah Bracelets aims to make meaningful jewelry that fits naturally into everyday life.
              The brand's philosophy is rooted in authenticity, craftsmanship, and individuality helping customers discover gemstone bracelets that feel personal, elegant, and distinctive.
              NavGrah Bracelets — Natural stones. Thoughtful craft. Made to be worn.
            </p>

            <div
              className="relative mb-9 rounded-2xl border p-5 sm:p-6"
              style={{ borderColor: "var(--line)", background: "var(--card)" }}
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-5 bottom-5 w-[3px] rounded-full"
                style={{ background: "linear-gradient(to bottom, var(--gold), transparent)" }}
              />
              <h4 className="mb-2 pl-4 [font-family:var(--font-display)] text-[19px] text-[color:var(--ink)]">
                Why Gemstones?
              </h4>
              <p className="max-w-[58ch] pl-4 text-[14.5px] leading-[1.7] text-[color:var(--ink-soft)]">
                Traditional Vedic gemstone practices associate specific
                gemstones with planetary energies. Our bracelets bring this
                concept into a simple, wearable format, with gemstone
                selections personalized around your birth-chart information.
              </p>
            </div>

            <div
              className="relative overflow-hidden rounded-2xl p-5 sm:p-6"
              style={{ background: "var(--card)", border: "1px solid var(--line)" }}
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[3px]"
                style={{
                  background:
                    "linear-gradient(to right, #A8334C, #C08A2E, #256B4E, #33518A, #6B4A85, #B1522E)",
                }}
              />
              <div className="flex flex-wrap items-center justify-between gap-5">
                <div>
                  <p className="mb-1 [font-family:var(--font-display)] text-[19px] text-[color:var(--ink)]">
                    Explore the Navgrah Collection
                  </p>
                  <p className="text-[13px] text-[color:var(--ink-faint)]">
                    Find a bracelet that resonates with your journey.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExplore}
                  className="
                    inline-flex shrink-0 cursor-pointer appearance-none items-center gap-2
                    whitespace-nowrap rounded-full border px-6 py-3 text-[13.5px] font-medium
                    tracking-[0.02em] transition-all duration-300 ease-out
                    hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-10px_rgba(176,126,51,0.55)]
                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                    motion-reduce:transition-none motion-reduce:hover:translate-y-0
                  "
                  style={{
                    borderColor: "var(--gold)",
                    background: "linear-gradient(to bottom, #F4E4C2, var(--gold))",
                    color: "var(--ink)",
                    outlineColor: "var(--gold-deep)",
                  }}
                >
                  Explore Bracelets
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                    &rarr;
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Gem card grid: the accessible, click-to-select surface ---------- */}
        <nav aria-label="The nine Navgraha and their gemstones" className="mt-14 sm:mt-16 lg:mt-20">
          <ul
            className="
              m-0 grid list-none gap-3 p-0 sm:gap-4
              grid-cols-[repeat(auto-fit,minmax(150px,1fr))]
            "
          >
            {PLANETS.map((p, i) => {
              const selected = selectedPlanet === p.id;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => handleToggle(p.id)}
                    onMouseEnter={() => setHoveredPlanet(p.id)}
                    onMouseLeave={() => setHoveredPlanet(null)}
                    onFocus={() => setHoveredPlanet(p.id)}
                    onBlur={() => setHoveredPlanet(null)}
                    aria-pressed={selected}
                    aria-label={`${p.sanskrit}, ${p.english} — ${p.gem} — ${p.theme}`}
                    className={`
                      group relative flex h-full w-full cursor-pointer flex-col items-start gap-3
                      overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 ease-out
                      hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-20px_rgba(43,34,51,0.35)]
                      focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                      motion-reduce:transition-none motion-reduce:hover:translate-y-0
                      ${fadeIn(`delay-[${380 + i * 40}ms]`)}
                    `}
                    style={{
                      background: "var(--card)",
                      borderColor: selected ? p.core : "var(--line)",
                      boxShadow: selected ? `0 0 0 1px ${p.core}` : undefined,
                      outlineColor: p.core,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-[3px] transition-opacity duration-300"
                      style={{ background: p.core, opacity: selected ? 1 : 0.55 }}
                    />
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background: `radial-gradient(circle at 35% 30%, ${p.glow}, ${p.core}CC)`,
                        color: "#FFFFFF",
                      }}
                    >
                      {p.symbol}
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="[font-family:var(--font-display)] text-[19px] leading-tight text-[color:var(--ink)]">
                        {p.sanskrit}
                      </span>
                      <span className="text-[11px] uppercase tracking-[0.08em]" style={{ color: p.core }}>
                        {p.english} · {p.gem}
                      </span>
                    </span>
                    <span className="text-[13px] leading-[1.45] text-[color:var(--ink-faint)]">{p.theme}</span>

                    {selected && (
                      <span
                        aria-hidden="true"
                        className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full text-[10px] text-white"
                        style={{ background: p.core }}
                      >
                        ✓
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-center text-[12.5px] text-[color:var(--ink-faint)] sm:hidden">
            Tap a stone to see it highlighted above.
          </p>
        </nav>
      </div>
    </section>
  );
}