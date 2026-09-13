"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { JSX } from "react"; 

/* ------------------------------------------------------------------ */
/*  Icons                                                               */
/* ------------------------------------------------------------------ */

function TokenIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <circle cx="12" cy="12" r="8.4" />
      <path strokeLinecap="round" d="M9.2 8.6h5.1M9.2 11.4h5.1M10.4 8.6c0 1.9 1.5 2.8 2.7 2.8s1.8.7 1.8 1.6c0 1-.9 1.8-2.2 1.8-1 0-1.9-.4-2.3-1.2" />
    </svg>
  );
}

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
  dark?: boolean;
};

const STEPS: JourneyStep[] = [
  {
    id: 1,
    shortLabel: "Token Paid",
    heading: "Pay Your ₹150 Token",
    description: "Your consultation begins with a small ₹150 token amount — this is a booking fee, not the bracelet price.",
    status: "Token Paid",
    color: "#B8232F",
    Icon: TokenIcon,
    dark: true,
  },
  {
    id: 2,
    shortLabel: "Expert Connected",
    heading: "Connect With Your Astrology Expert",
    description: "Our astrologer connects with you to understand your personal requirements, lifestyle, concerns, and astrological background.",
    status: "Expert Connected",
    color: "#33526E",
    Icon: ConsultIcon,
  },
  {
    id: 3,
    shortLabel: "Details Collected",
    heading: "Share Your Kundli & Personal Details",
    description: "Kundli or birth chart, date, time and place of birth, your current concerns or goals, and any existing gemstone or bracelet details.",
    status: "Details Collected",
    color: "#4C7C59",
    Icon: KundliIcon,
  },
  {
    id: 4,
    shortLabel: "Stones Recommended",
    heading: "Your Astrology-Based Stone Recommendation",
    description: "Our astrologer studies your Kundli and recommends the gemstones and bracelet combination suited to your planetary alignment and needs.",
    status: "Stones Recommended",
    color: "#B8862F",
    Icon: GemIcon,
  },
  {
    id: 5,
    shortLabel: "Report Ready",
    heading: "Your Personalized Astrology Report Is Ready",
    description: "A complete write-up of your Kundli insights, planetary observations, and the bracelet configuration recommended for you.",
    status: "Report Ready",
    color: "#6E4C86",
    Icon: ReportIcon,
  },
  {
    id: 6,
    shortLabel: "Final Payment",
    heading: "Approve & Complete Your Bracelet",
    description: "Review your bracelet configuration and complete the remaining payment to confirm your customized order.",
    status: "Final Payment",
    color: "#1C1024",
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
  "Astrologer's recommendations",
];

/* ------------------------------------------------------------------ */
/*  Small building blocks                                              */
/* ------------------------------------------------------------------ */

function StepNode({
  step,
  index,
  active,
  onSelect,
}: {
  step: JourneyStep;
  index: number;
  active: boolean;
  onSelect: (id: number) => void;
}) {
  const { Icon } = step;
  return (
    <button
      type="button"
      onClick={() => onSelect(step.id)}
      aria-current={active}
      aria-label={`Step ${index + 1}: ${step.heading}`}
      style={
        {
          borderColor: step.color,
          backgroundColor: active ? step.color : "#FCFBF8",
          color: active ? "#FCFBF8" : step.color,
          "--node-glow": step.color,
        } as React.CSSProperties
      }
      className={`cbj-node relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition-[transform,box-shadow,background-color,color] duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FCFBF8] ${
        active ? "cbj-node-active scale-110" : ""
      }`}
    >
      <Icon className="h-5 w-5" />
      <span
        className="ng-ui absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-[#1C1024] text-[10px] font-semibold text-white"
        aria-hidden="true"
      >
        {index + 1}
      </span>
    </button>
  );
}

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

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

type BraceletCustomizerProps = {
  /** Optional — the bracelet the visitor was last looking at elsewhere on
   *  the page. Purely contextual: shown as a small tag under the intro so
   *  the journey feels connected to what they were browsing, but every
   *  step still works fine with no product context at all. */
  productName?: string;
  productImage?: string;
};

export default function BraceletCustomizer({ productName, productImage }: BraceletCustomizerProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [reportOpen, setReportOpen] = useState(false);
  const [magnet, setMagnet] = useState({ x: 0, y: 0 });
  const [pressed, setPressed] = useState(false);

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

  const handleCtaMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
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

  function selectStep(id: number) {
    setActiveStep(id);
  }

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
          background-image:
            radial-gradient(circle at 8% 6%, rgba(184, 134, 47, 0.08), transparent 40%),
            radial-gradient(circle at 96% 92%, rgba(184, 35, 47, 0.07), transparent 42%);
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
        @keyframes cbj-node-pulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 color-mix(in srgb, var(--node-glow, #b8232f) 45%, transparent);
          }
          50% {
            box-shadow: 0 0 0 7px color-mix(in srgb, var(--node-glow, #b8232f) 0%, transparent);
          }
        }

        .cbj-reveal {
          opacity: 0;
          transform: translateY(16px);
        }
        .cbj-reveal.cbj-visible {
          animation: cbj-fade-up 650ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .cbj-node-active {
          animation: cbj-node-pulse 2s ease-out infinite;
        }
        .cbj-card {
          transition: transform 260ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 260ms ease, opacity 260ms ease;
        }
        .cbj-card-active {
          transform: translateY(-2px) scale(1.015);
          box-shadow: 0 20px 45px -28px rgba(28, 16, 36, 0.35);
        }
        .cbj-card-inactive {
          opacity: 0.72;
        }
        .cbj-pill {
          transition: background-color 180ms ease, color 180ms ease, border-color 180ms ease;
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

        @media (prefers-reduced-motion: reduce) {
          .cbj-reveal {
            opacity: 1;
            transform: none;
            animation: none !important;
          }
          .cbj-node-active,
          .cbj-card {
            animation: none !important;
            transition: none !important;
          }
          .cbj-cta {
            transition: none !important;
          }
        }
      `}</style>

      <div className="relative mx-auto max-w-container px-6 sm:px-8 lg:px-10">
        {/* ------------------------------------------------------------ */}
        {/* Intro                                                         */}
        {/* ------------------------------------------------------------ */}
        <div className={`cbj-reveal mx-auto max-w-[64ch] text-center ${isVisible ? "cbj-visible" : ""}`}>
          <p className="ng-display text-[15px] italic text-[#B8232F]">Guided from consultation to confirmation</p>
          <h2 className="ng-display mt-3 text-[34px] italic leading-[1.15] text-[#1C1024] sm:text-[42px] lg:text-[48px]">
            Your customized bracelet journey
          </h2>
          <p className="ng-ui mx-auto mt-5 max-w-[54ch] text-[15px] leading-relaxed text-[#1C1024]/60">
            A ₹150 token starts your consultation. Everything after is guided by an astrologer, reviewed by
            you, and confirmed before your final payment.
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
        {/* Progress rail                                                 */}
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
        {/* Desktop zigzag trail                                          */}
        {/* ------------------------------------------------------------ */}
        <div
          className={`cbj-reveal relative mt-16 hidden md:block ${isVisible ? "cbj-visible" : ""}`}
          style={{ transitionDelay: "120ms" }}
        >
          <div
            className="pointer-events-none absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full opacity-70"
            style={{ backgroundImage: THREAD_GRADIENT }}
            aria-hidden="true"
          />
          <div className="relative grid grid-cols-6 gap-3 lg:gap-4" style={{ gridTemplateRows: "auto 56px auto" }}>
            {STEPS.map((step, i) => {
              const isTop = i % 2 === 0;
              const active = step.id === activeStep;
              return (
                <div key={step.id} className="contents">
                  <div style={{ gridRow: 1, gridColumn: i + 1 }} className={isTop ? "flex items-end pb-5" : ""}>
                    {isTop && (
                      <StepCard step={step} active={active} onSelect={selectStep} reportOpen={reportOpen} setReportOpen={setReportOpen} />
                    )}
                  </div>
                  <div style={{ gridRow: 2, gridColumn: i + 1 }} className="relative flex items-center justify-center bg-[#FCFBF8]">
                    <StepNode step={step} index={i} active={active} onSelect={selectStep} />
                  </div>
                  <div style={{ gridRow: 3, gridColumn: i + 1 }} className={!isTop ? "flex items-start pt-5" : ""}>
                    {!isTop && (
                      <StepCard step={step} active={active} onSelect={selectStep} reportOpen={reportOpen} setReportOpen={setReportOpen} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Mobile vertical timeline                                      */}
        {/* ------------------------------------------------------------ */}
        <div
          className={`cbj-reveal relative mt-14 space-y-5 md:hidden ${isVisible ? "cbj-visible" : ""}`}
          style={{ transitionDelay: "120ms" }}
        >
          <div
            className="pointer-events-none absolute bottom-4 left-[23px] top-4 w-[2px] rounded-full opacity-70"
            style={{ backgroundImage: `linear-gradient(180deg, ${STEPS.map((s) => s.color).join(", ")})` }}
            aria-hidden="true"
          />
          {STEPS.map((step, i) => (
            <div key={step.id} className="relative flex items-start gap-4">
              <div className="relative z-10 shrink-0 bg-[#FCFBF8]">
                <StepNode step={step} index={i} active={step.id === activeStep} onSelect={selectStep} />
              </div>
              <div className="flex-1 pt-1">
                <StepCard
                  step={step}
                  active={step.id === activeStep}
                  onSelect={selectStep}
                  reportOpen={reportOpen}
                  setReportOpen={setReportOpen}
                  compact
                />
              </div>
            </div>
          ))}
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Active-step summary bar                                       */}
        {/* ------------------------------------------------------------ */}
        <p className="ng-ui mt-10 text-center text-[12.5px] text-[#1C1024]/45">
          You're viewing step {activeIndex + 1} of {STEPS.length} — {activeMeta.heading.toLowerCase()}.
        </p>

        {/* ------------------------------------------------------------ */}
        {/* Bottom CTA                                                    */}
        {/* ------------------------------------------------------------ */}
        <div
          className={`cbj-reveal cbj-clip-lg relative mx-auto mt-16 max-w-2xl overflow-hidden bg-[#1C1024] px-8 py-10 text-center shadow-[0_28px_60px_-32px_rgba(28,16,36,0.5)] sm:mt-20 sm:px-12 sm:py-12 ${
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
              Start with a ₹150 token and let our astrology experts guide you toward a bracelet personalized
              to your Kundli and requirements.
            </p>
            <button
              ref={ctaRef}
              type="button"
              onMouseMove={handleCtaMove}
              onMouseLeave={resetMagnet}
              onMouseDown={() => setPressed(true)}
              onMouseUp={() => setPressed(false)}
              style={{ transform: `translate(${magnet.x}px, ${magnet.y}px)` }}
              className="cbj-clip cbj-cta ng-ui group mx-auto mt-7 flex items-center justify-center gap-2 whitespace-nowrap bg-[#E2711D] px-7 py-3.5 text-[14.5px] font-semibold text-[#1C1024] hover:bg-[#F08A3C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1024]"
            >
              Pay ₹150 & start consultation
              <ArrowIcon
                className={`h-4 w-4 transition-transform duration-200 ${pressed ? "" : "group-hover:translate-x-1"}`}
              />
            </button>
            <p className="ng-ui mx-auto mt-4 max-w-[48ch] text-[12px] leading-relaxed text-[#FCFBF8]/40">
              ₹150 is a consultation/token amount. The remaining amount is payable after your personalized
              bracelet recommendation is finalized.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Step card                                                          */
/* ------------------------------------------------------------------ */

function StepCard({
  step,
  active,
  onSelect,
  reportOpen,
  setReportOpen,
  compact,
}: {
  step: JourneyStep;
  active: boolean;
  onSelect: (id: number) => void;
  reportOpen: boolean;
  setReportOpen: (v: boolean) => void;
  compact?: boolean;
}) {
  const dark = step.dark;
  return (
    <button
      type="button"
      onClick={() => onSelect(step.id)}
      className={`cbj-card cbj-clip w-full text-left ${compact ? "max-w-none" : "max-w-[15.5rem]"} ${
        active ? "cbj-card-active" : "cbj-card-inactive"
      } ${
        dark
          ? "border border-transparent bg-[#1C1024] text-[#FCFBF8]"
          : "border border-[#1C1024]/10 bg-white text-[#1C1024]"
      } px-5 py-4`}
      style={active && !dark ? { boxShadow: `0 0 0 1.5px ${step.color}` } : undefined}
    >
      <StatusPill label={step.status} color={dark ? "#E2711D" : step.color} />

      <h4 className={`ng-display mt-3 text-[16px] italic leading-snug ${dark ? "text-[#FCFBF8]" : "text-[#1C1024]"}`}>
        {step.heading}
      </h4>
      <p className={`ng-ui mt-2 text-[12.5px] leading-relaxed ${dark ? "text-[#FCFBF8]/65" : "text-[#1C1024]/60"}`}>
        {step.description}
      </p>

      {step.id === 1 && (
        <p className="ng-ui mt-3 text-[11px] text-[#FCFBF8]/45">₹150 token · not the final bracelet price</p>
      )}

      {step.id === 2 && (
        <div className="ng-ui mt-3 flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-[#33526E]">
          <span className="rounded-full bg-[#33526E]/10 px-2 py-0.5">Payment confirmed</span>
          <ChevronIcon className="h-3 w-3 -rotate-90" />
          <span className="rounded-full bg-[#33526E]/10 px-2 py-0.5">Expert consultation</span>
        </div>
      )}

      {step.id === 4 && (
        <div className="mt-3" onClick={(e) => e.stopPropagation()}>
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
              <div key={g.name} className="w-[8.5rem] shrink-0 rounded-md border border-[#1C1024]/10 bg-[#FCFBF8] px-2.5 py-2">
                <div className="flex items-center gap-1.5">
                  <GemIcon className="h-3.5 w-3.5" style={{ color: g.color }} />
                  <span className="ng-ui text-[11px] font-semibold text-[#1C1024]">{g.name}</span>
                </div>
                <p className="ng-ui mt-1 text-[10px] text-[#1C1024]/45">{g.planet} · {g.qty}</p>
                <p className="ng-ui mt-1 text-[10.5px] leading-snug text-[#1C1024]/60">{g.benefit}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {step.id === 5 && (
        <div className="mt-3" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setReportOpen(!reportOpen)}
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

      {step.id === 6 && (
        <div className="ng-ui mt-3 space-y-1.5 rounded-md bg-white/8 px-3 py-2.5 text-[11.5px]">
          <div className="flex items-center justify-between text-[#FCFBF8]/70">
            <span>₹150 token paid</span>
            <CheckIcon className="h-3.5 w-3.5 text-[#E2711D]" />
          </div>
          <div className="flex items-center justify-between text-[#FCFBF8]/70">
            <span>Remaining bracelet amount</span>
            <span className="text-[#FCFBF8]/45">After recommendation</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between border-t border-white/10 pt-1.5 font-semibold text-[#FCFBF8]">
            <span>Final order amount</span>
            <span className="text-[#FCFBF8]/45">Confirmed at approval</span>
          </div>
        </div>
      )}
    </button>
  );
}