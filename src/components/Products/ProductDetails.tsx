// components/products/productdetails.tsx

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  BadgeCheck,
  Percent,
  ChevronDown,
  Play,
  MapPin,
  Gift,
  Truck,
  ShoppingCart,
  Zap,
  Eye,
  Volume2,
  VolumeX,
  Plus,
  CheckCircle2,
  Smartphone,
} from "lucide-react";

interface ProductDetailsProps {
  slug: string;
}

interface QuantityOption {
  id: "pack1" | "pack2" | "pack3";
  label: string;
  price: number;
  extraOff?: string;
  tag?: string;
}

interface Testimonial {
  id: number;
  name: string;
  avatarUrl: string;
  verified: boolean;
  rating: number;
  text: string;
}

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  isVideo?: boolean;
}

interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  mrp: number;
  imageUrl: string;
}

interface Ingredient {
  name: string;
  benefit: string;
}

interface ReelTestimonial {
  id: number;
  thumbnailUrl: string;
  views: string;
  caption: string;
}

interface AccordionEntry {
  id: string;
  title: string;
  content: string[];
}

interface FaqEntry {
  id: string;
  question: string;
  answer: string;
}

interface RatingBreakdownRow {
  stars: number;
  count: number;
}

interface SpecRow {
  label: string;
  value: string;
}

const GALLERY: GalleryItem[] = [
  {
    id: 0,
    src: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=900&q=80",
    alt: "Dhan Yog Bracelet on shell",
  },
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=300&q=80",
    alt: "Certificate",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1610694955371-d4a3e0ce4b52?w=300&q=80",
    alt: "Packaging",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=300&q=80",
    alt: "Bracelet detail",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&q=80",
    alt: "Bracelet video",
    isVideo: true,
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1602751584547-6d2c1b1a90a1?w=300&q=80",
    alt: "On wrist",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=300&q=80",
    alt: "Beads close up",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=300&q=80",
    alt: "Gift box",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1610694955371-d4a3e0ce4b52?w=300&q=80",
    alt: "Bracelet with card",
  },
];

const QUANTITY_OPTIONS: QuantityOption[] = [
  {
    id: "pack1",
    label: "Pack of 1",
    price: 699,
  },
  {
    id: "pack2",
    label: "Pack of 2",
    price: 999,
    extraOff: "Extra ₹400 Off",
    tag: "Most Popular",
  },
  {
    id: "pack3",
    label: "Pack of 3",
    price: 1499,
    extraOff: "Extra ₹600 Off",
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Rajkumar",
    avatarUrl: "https://i.pravatar.cc/64?img=12",
    verified: true,
    rating: 4,
    text:
      "Mujhe bahut vishwas nahi tha in sab chezon pe, but is bracelet ke baad kuch positive badlaav mehsoos hua hain. Financial side bhi thodi better hui hai. Happy with the purchase overall.",
  },
  {
    id: 2,
    name: "Sadhana",
    avatarUrl: "https://i.pravatar.cc/64?img=32",
    verified: true,
    rating: 3,
    text:
      "Meri astrologer ke bhi suggest kiya tha, dono feel ho raha hain comfortable hai pehen ne mein aur design bhi kaafi acha hai. Overall satisfied with the product.",
  },
  {
    id: 3,
    name: "Vikram",
    avatarUrl: "https://i.pravatar.cc/64?img=51",
    verified: true,
    rating: 5,
    text:
      "Quality bahut achi hai, lab certificate ke saath aaya. Packaging bhi premium thi. Definitely recommend karunga apne friends ko bhi.",
  },
  {
    id: 4,
    name: "Priya",
    avatarUrl: "https://i.pravatar.cc/64?img=45",
    verified: true,
    rating: 4,
    text:
      "Bahut hi acha experience raha, delivery bhi time pe hui aur bracelet dekhne mein bhi bahut sundar hai. Thank you!",
  },
];

const RELATED_PRODUCTS: RelatedProduct[] = [
  {
    id: "bracelet",
    name: "Dhan Yog Bracelet",
    price: 699,
    mrp: 1999,
    imageUrl:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200&q=80",
  },
  {
    id: "necklace",
    name: "Dhan Yog Necklace",
    price: 999,
    mrp: 1700,
    imageUrl:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=200&q=80",
  },
];

const RELATED_DOT_COUNT = 12;

const INGREDIENTS: Ingredient[] = [
  {
    name: "Tiger Eye",
    benefit: "Improves Focus & Confidence",
  },
  {
    name: "Pyrite",
    benefit: "Attracts Money",
  },
  {
    name: "Citrine",
    benefit: "Helps in Career Growth",
  },
  {
    name: "Quartz",
    benefit: "Boosts Crystal Power by 10x",
  },
  {
    name: "Green Aventurine",
    benefit: "Attracts Luck",
  },
  {
    name: "Hematite",
    benefit: "Enhances Motivation",
  },
];

const REELS: ReelTestimonial[] = [
  {
    id: 1,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&q=80",
    views: "21.8K",
    caption: "because of this bracelet",
  },
  {
    id: 2,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
    views: "15.7K",
    caption: "ab jaise ki example",
  },
  {
    id: 3,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80",
    views: "9.4K",
    caption: "wealth energy activated",
  },
];

const INITIAL_SECONDS = 4 * 3600 + 29 * 60 + 58;

const INFO_ACCORDION: AccordionEntry[] = [
  {
    id: "benefits",
    title: "Benefits",
    content: [
      "Balances your financial energy and helps attract new opportunities.",
      "Combines six crystals, each associated with a different area of abundance and focus.",
    ],
  },
  {
    id: "how-to-wear",
    title: "How to wear?",
    content: [
      "Wear on your left hand to receive energy, or your right hand to give it out.",
      "Keep it on daily for consistent results; remove before swimming or bathing.",
    ],
  },
  {
    id: "style-tip",
    title: "Style tip",
    content: [
      "Stack it with a slim metal chain bracelet for a layered, everyday look.",
      "Works well with both casual and formal outfits thanks to its neutral tones.",
    ],
  },
  {
    id: "best-day",
    title: "Best day to wear",
    content: [
      "Many wearers start on a Thursday, traditionally linked with wealth and growth.",
      "You can also begin on any day that feels personally significant to you.",
    ],
  },
  {
    id: "packaging",
    title: "Packaging",
    content: [
      "Arrives in a branded gift box with a lab certification card and care instructions.",
      "Makes it ready to gift without any additional wrapping.",
    ],
  },
  {
    id: "returns",
    title: "Returns + Exchanges",
    content: [
      "7-day easy returns from the date of delivery, provided the item is unused and in original packaging.",
      "Free size exchanges are available if the fit isn't right.",
    ],
  },
  {
    id: "cashback",
    title: "Cashback Terms & Conditions",
    content: [
      "100% cashback is credited as store wallet balance within 7 days of a prepaid order.",
      "Applicable only on prepaid orders and cannot be combined with other cashback offers.",
    ],
  },
];

const FAQS: FaqEntry[] = [
  {
    id: "faq-1",
    question: "What is the Dhan Yog Bracelet used for?",
    answer:
      "It's worn to help balance financial energy, encourage focus, and support career growth through a blend of six natural crystals.",
  },
  {
    id: "faq-2",
    question: "Can I wear the Dhan Yog Bracelet every day?",
    answer:
      "Yes, it's designed for daily wear. Just remove it before swimming, bathing, or heavy workouts to protect the beads.",
  },
  {
    id: "faq-3",
    question: "Which crystals are used in the Dhan Yog Bracelet?",
    answer:
      "Tiger Eye, Pyrite, Citrine, Quartz, Green Aventurine, and Hematite — each chosen for a specific benefit.",
  },
  {
    id: "faq-4",
    question: "Is the Dhan Yog Bracelet suitable for men and women?",
    answer:
      "Yes, it comes in a free size with a stretch cord, making it suitable for everyone.",
  },
];

const RATING_BREAKDOWN: RatingBreakdownRow[] = [
  { stars: 5, count: 1566 },
  { stars: 4, count: 40 },
  { stars: 3, count: 17 },
  { stars: 2, count: 0 },
  { stars: 1, count: 0 },
];

const REVIEW_PHOTOS: string[] = [
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200&q=80",
  "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=200&q=80",
  "https://images.unsplash.com/photo-1602751584547-6d2c1b1a90a1?w=200&q=80",
  "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=200&q=80",
  "https://images.unsplash.com/photo-1610694955371-d4a3e0ce4b52?w=200&q=80",
  "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=200&q=80",
  "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&q=80",
];

const SPECS_LEFT: SpecRow[] = [
  {
    label: "Material",
    value: "Multiple Crystal Stones",
  },
  {
    label: "Tarnish resistance",
    value: "Anti-tarnish",
  },
  {
    label: "Size",
    value: "Free size",
  },
];

const SPECS_RIGHT: SpecRow[] = [
  {
    label: "Bead Size",
    value: "7-8 mm",
  },
  {
    label: "Colour",
    value: "Multicolor",
  },
  {
    label: "Water Resistance",
    value: "Anti-splash",
  },
];

/* -----------------------------------------------------------------------
  HELPERS
----------------------------------------------------------------------- */

function formatTime(totalSeconds: number) {
  const clamped = Math.max(totalSeconds, 0);
  const hrs = Math.floor(clamped / 3600);
  const mins = Math.floor((clamped % 3600) / 60);
  const secs = clamped % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");

  return {
    hrs: pad(hrs),
    mins: pad(mins),
    secs: pad(secs),
  };
}

function formatINR(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function StarRow({
  rating,
  size = 14,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;

        return (
          <Star
            key={i}
            size={size}
            className={
              filled || half
                ? "fill-[#C99A3D] text-[#C99A3D]"
                : "fill-[#E7E0D2] text-[#E7E0D2]"
            }
            strokeWidth={1}
          />
        );
      })}
    </div>
  );
}

function AccordionRow({
  label,
  isOpen,
  onToggle,
  children,
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-[#E8E0D3]">
      <button
        onClick={onToggle}
        className="group flex w-full items-center justify-between py-4 text-left transition-colors"
        aria-expanded={isOpen}
      >
        <span className="text-sm text-[#342E27] transition-colors group-hover:text-[#17130F]">
          {label}
        </span>

        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
          className="shrink-0 text-[#9B8F7D] group-hover:text-[#6F6252]"
        >
          <Plus size={16} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.25,
              ease: "easeInOut",
            }}
            className="overflow-hidden"
          >
            <div className="space-y-1.5 pb-4 pr-6 text-xs leading-relaxed text-[#756B5D]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -----------------------------------------------------------------------
  MAIN COMPONENT
----------------------------------------------------------------------- */

export default function ProductDetails({
  slug,
}: ProductDetailsProps) {
  /* ---------------- gallery ---------------- */

  const [activeImage, setActiveImage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const galleryBoxRef = useRef<HTMLDivElement>(null);

  const [isDesktop, setIsDesktop] = useState(false);
  const [galleryStyle, setGalleryStyle] =
    useState<React.CSSProperties>({});

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");

    const update = () => setIsDesktop(mq.matches);

    update();

    mq.addEventListener("change", update);

    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isDesktop) {
      setGalleryStyle({});
      return;
    }

    const TOP_OFFSET = 24; // px, matches previous top-6

    let rafId: number | null = null;

    const measureAndSet = () => {
      const colEl = leftColRef.current;
      const boxEl = galleryBoxRef.current;
      const containerEl = containerRef.current;

      if (!colEl || !boxEl || !containerEl) return;

      const galleryHeight = boxEl.offsetHeight;

      const colRect = colEl.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();

      const scrollY = window.scrollY;

      const colTopAbs = colRect.top + scrollY;
      const containerTopAbs = containerRect.top + scrollY;
      const containerBottomAbs = containerRect.bottom + scrollY;

      const stickyStart = colTopAbs - TOP_OFFSET;
      const stickyEnd =
        containerBottomAbs - galleryHeight - TOP_OFFSET;

      if (scrollY < stickyStart || stickyEnd <= stickyStart) {
        // Not scrolled far enough yet (or right column isn't tall
        // enough to need sticking) -> keep it in normal flow.
        setGalleryStyle({});
      } else if (scrollY < stickyEnd) {
        // Mid-scroll: lock the gallery in the viewport.
        setGalleryStyle({
          position: "fixed",
          top: TOP_OFFSET,
          left: colRect.left,
          width: colRect.width,
          zIndex: 20,
        });
      } else {
        // Reached the bottom of the right column's content ->
        // pin the gallery to the bottom of the container so it
        // scrolls away naturally with the rest of the page instead
        // of overlapping whatever comes after.
        const topWithinContainer =
          containerBottomAbs - galleryHeight - containerTopAbs;
        const leftWithinContainer = colRect.left - containerRect.left;

        setGalleryStyle({
          position: "absolute",
          top: topWithinContainer,
          left: leftWithinContainer,
          width: colRect.width,
          zIndex: 20,
        });
      }
    };

    const onScrollOrResize = () => {
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        measureAndSet();
        rafId = null;
      });
    };

    measureAndSet();

    window.addEventListener("scroll", onScrollOrResize, {
      passive: true,
    });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [isDesktop]);

  /* ---------------- quantity ---------------- */

  const [selectedQty, setSelectedQty] =
    useState<QuantityOption["id"]>("pack1");

  /* ---------------- countdown ---------------- */

  const [secondsLeft, setSecondsLeft] =
    useState(INITIAL_SECONDS);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const { hrs, mins, secs } = formatTime(secondsLeft);

  /* ---------------- offer accordion ---------------- */

  const [offerOpen, setOfferOpen] = useState(false);

  /* ---------------- testimonial carousel ---------------- */

  const [slide, setSlide] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);

  const totalSlides = TESTIMONIALS.length;

  useEffect(() => {
    const auto = setInterval(() => {
      setSlide((s) => (s + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(auto);
  }, [totalSlides]);

  /* ---------------- pincode check ---------------- */

  const [pincode, setPincode] = useState("");

  const [eta, setEta] =
    useState<string | null>(null);

  const [checking, setChecking] =
    useState(false);

  const handleCheckPincode = () => {
    if (
      pincode.trim().length !== 6 ||
      checking
    ) {
      return;
    }

    setChecking(true);
    setEta(null);

    setTimeout(() => {
      const date = new Date();

      date.setDate(date.getDate() + 4);

      setEta(
        date.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })
      );

      setChecking(false);
    }, 900);
  };

  /* ---------------- stock left pulse ---------------- */

  const unitsLeft = 53;

  /* ---------------- related product carousel ---------------- */

  const [selectedProduct, setSelectedProduct] =
    useState<string>(
      RELATED_PRODUCTS[0].id
    );

  const [relatedDot, setRelatedDot] = useState(0);

  const relatedTrackRef =
    useRef<HTMLDivElement>(null);

  const handleRelatedScroll = () => {
    const el = relatedTrackRef.current;

    if (!el) return;

    const maxScroll =
      el.scrollWidth - el.clientWidth;

    const progress =
      maxScroll > 0
        ? el.scrollLeft / maxScroll
        : 0;

    setRelatedDot(
      Math.round(
        progress *
          (RELATED_DOT_COUNT - 1)
      )
    );
  };

  /* ---------------- add to cart / buy now ---------------- */

  const [cartState, setCartState] =
    useState<"idle" | "added">("idle");

  const handleAddToCart = () => {
    setCartState("added");

    setTimeout(() => {
      setCartState("idle");
    }, 1800);
  };

  /* ---------------- reels carousel ---------------- */

  const [playingReel, setPlayingReel] =
    useState<number | null>(null);

  const [mutedReels, setMutedReels] =
    useState<Record<number, boolean>>({});

  const toggleMute = (
    id: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    setMutedReels((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  /* ---------------- info accordion ---------------- */

  const [openInfoId, setOpenInfoId] =
    useState<string | null>(null);

  const toggleInfo = (id: string) =>
    setOpenInfoId((cur) =>
      cur === id ? null : id
    );

  /* ---------------- faq accordion ---------------- */

  const [openFaqId, setOpenFaqId] =
    useState<string | null>(null);

  const toggleFaq = (id: string) =>
    setOpenFaqId((cur) =>
      cur === id ? null : id
    );

  const maxRatingCount = Math.max(
    ...RATING_BREAKDOWN.map(
      (r) => r.count
    ),
    1
  );

  const currentOption = useMemo(
    () =>
      QUANTITY_OPTIONS.find(
        (o) => o.id === selectedQty
      )!,
    [selectedQty]
  );

  return (
    <div className="min-h-screen w-full bg-[#FCFAF6] font-sans text-[#2B2722] antialiased">
      <div
        ref={containerRef}
        className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-8 md:grid-cols-2 md:items-start md:px-8"
      >

        {/* ============================= LEFT: GALLERY ============================= */}

        <div ref={leftColRef}>
          <div
            ref={galleryBoxRef}
            style={isDesktop ? galleryStyle : undefined}
          >
            <div className="relative overflow-hidden rounded-2xl bg-[#F3EEE5]">

              {/* cashback ribbon */}

              <div className="absolute left-0 top-0 z-10">
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.4,
                  }}
                  className="relative flex h-20 w-20 flex-col items-center justify-center bg-[#C99A3D] pb-2 pt-1 text-center leading-tight text-[#211A11] shadow-md"
                  style={{
                    clipPath:
                      "polygon(0 0, 100% 0, 100% 78%, 50% 100%, 0 78%)",
                  }}
                >
                  <span className="text-[13px] font-extrabold">
                    100%
                  </span>

                  <span className="text-[9px] font-bold leading-none">
                    CASHBACK
                  </span>

                  <span className="mt-0.5 text-[8px] leading-tight">
                    on prepaid orders
                  </span>
                </motion.div>
              </div>

              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={GALLERY[activeImage].src}
                  alt={GALLERY[activeImage].alt}
                  initial={{
                    opacity: 0,
                    scale: 1.02,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                  className="aspect-square w-full object-cover"
                />
              </AnimatePresence>
            </div>

            {/* thumbnails */}

            <div className="mt-3 grid grid-cols-9 gap-2">
              {GALLERY.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() =>
                    setActiveImage(idx)
                  }
                  className={`group relative aspect-square overflow-hidden rounded-md border transition-all duration-200 ${
                    activeImage === idx
                      ? "border-[#B88932] ring-1 ring-[#C99A3D]"
                      : "border-[#E2DACD] hover:border-[#BBAE9B]"
                  }`}
                  aria-label={`View image ${
                    idx + 1
                  }`}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />

                  {item.isVideo && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <Play
                        size={12}
                        className="fill-white text-white"
                      />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ============================= RIGHT: DETAILS ============================= */}

        <div className="flex flex-col">

          {/* title + rating */}

          <h1 className="text-2xl font-semibold tracking-tight text-[#241F1A] md:text-3xl">
            Dhan Yog Bracelet (Lab Certified)
          </h1>

          <div className="mt-2 flex items-center gap-2">
            <StarRow
              rating={4.5}
              size={16}
            />

            <span className="text-sm text-[#82786B]">
              1623 reviews
            </span>
          </div>

          {/* badges */}

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-[#E9D6A8] px-3 py-1 text-xs font-semibold text-[#5D431B]">
              Increases wealth
            </span>

            <span className="rounded-full bg-[#E5DDED] px-3 py-1 text-xs font-semibold text-[#59466F]">
              Attracts success
            </span>
          </div>

          {/* price */}

          <div className="mt-4 flex flex-wrap items-baseline gap-2">
            <span className="text-3xl font-bold text-[#241F1A]">
              {formatINR(
                currentOption.price
              )}
            </span>

            <span className="text-lg text-[#A69C8E] line-through">
              ₹1,999
            </span>

            <span className="text-sm font-semibold text-[#47745E]">
              39% + Extra 26% OFF
            </span>
          </div>

          {/* quantity selector */}

          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold tracking-wide text-[#83796B]">
              SELECT QUANTITY
            </p>

            <div className="grid grid-cols-3 gap-3">
              {QUANTITY_OPTIONS.map(
                (opt) => {
                  const active =
                    opt.id === selectedQty;

                  return (
                    <motion.button
                      key={opt.id}
                      onClick={() =>
                        setSelectedQty(
                          opt.id
                        )
                      }
                      whileTap={{
                        scale: 0.96,
                      }}
                      className={`relative rounded-xl border-2 px-2 py-3 text-center transition-colors duration-200 ${
                        active
                          ? "border-[#C99A3D] bg-[#F8F0DF]"
                          : "border-[#E2DACD] bg-[#FFFDF9] hover:border-[#C9BEAE]"
                      }`}
                    >
                      {opt.tag && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#C99A3D] px-2 py-0.5 text-[10px] font-semibold text-[#211A11] shadow-sm">
                          {opt.tag}
                        </span>
                      )}

                      <p className="text-sm font-medium text-[#5E554A]">
                        {opt.label}
                      </p>

                      <p className="mt-1 text-base font-bold text-[#29231D]">
                        {formatINR(
                          opt.price
                        )}
                      </p>

                      {opt.extraOff && (
                        <p className="mt-0.5 text-[11px] font-medium text-[#47745E]">
                          {opt.extraOff}
                        </p>
                      )}

                      {active && (
                        <motion.div
                          layoutId="qty-check"
                          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#B88932] text-white shadow"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-3 w-3"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              d="M5 13l4 4L19 7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                }
              )}
            </div>
          </div>

          {/* countdown */}

          <p className="mt-3 text-sm font-semibold text-[#B64D43]">
            Offer ends in {hrs} hr : {mins} min : {secs} sec
          </p>

          {/* payday special offer */}

          <div className="mt-4 overflow-hidden rounded-xl border border-[#E5D0A1] bg-[#FAF4E7]">
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2C2823] text-white">
                <Percent size={14} />
              </span>

              <span className="flex-1 text-sm font-medium text-[#3B342C]">
                Payday Special Sale Offer
              </span>

              <span className="rounded-full bg-[#4F8065] px-3 py-1 text-xs font-semibold text-white">
                Save 100%
              </span>
            </div>

            <button
              onClick={() =>
                setOfferOpen(
                  (v) => !v
                )
              }
              className="flex w-full items-center justify-center gap-1 bg-[#D8B866] py-2.5 text-sm font-semibold text-[#2A2115] transition-colors hover:bg-[#CDA956]"
            >
              View offer

              <motion.span
                animate={{
                  rotate: offerOpen
                    ? 180
                    : 0,
                }}
                transition={{
                  duration: 0.2,
                }}
              >
                <ChevronDown
                  size={16}
                />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {offerOpen && (
                <motion.div
                  initial={{
                    height: 0,
                    opacity: 0,
                  }}
                  animate={{
                    height: "auto",
                    opacity: 1,
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.25,
                    ease: "easeInOut",
                  }}
                  className="overflow-hidden bg-[#FFFDF9] px-3 pb-3 pt-2"
                >
                  <motion.div
                    initial={{
                      y: -6,
                      opacity: 0,
                    }}
                    animate={{
                      y: 0,
                      opacity: 1,
                    }}
                    transition={{
                      delay: 0.05,
                      duration: 0.2,
                    }}
                    className="rounded-xl border border-[#C9DDCE] bg-[#FFFDF9] p-4"
                  >
                    {/* cashback ribbon */}

                  <div className="absolute left-3 top-3 z-10">
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      className="relative overflow-hidden rounded-2xl border border-[#E7C76D]/70 bg-gradient-to-br from-[#FFF7D9] via-[#F6D982] to-[#C99A3D] px-3.5 py-2.5 text-[#3A2A13] shadow-[0_8px_24px_rgba(120,82,20,0.22)]"
                    >
                      {/* shine */}
                      <motion.span
                        animate={{ x: ["-120%", "220%"] }}
                        transition={{
                          duration: 2.8,
                          repeat: Infinity,
                          repeatDelay: 2,
                          ease: "easeInOut",
                        }}
                        className="absolute inset-y-0 w-6 rotate-12 bg-white/40 blur-md"
                      />

                      <div className="relative flex items-center gap-2">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2F2618] text-[#F7D77D] shadow-inner">
                          <Gift size={15} strokeWidth={2.2} />
                        </span>

                        <div className="leading-none">
                          <div className="flex items-baseline gap-1">
                            <span className="text-[15px] font-black tracking-tight">
                              100%
                            </span>
                            <span className="text-[10px] font-extrabold uppercase tracking-[0.08em]">
                              Cashback
                            </span>
                          </div>

                          <p className="mt-1 text-[9px] font-medium text-[#60491F]">
                            On prepaid orders
                          </p>
                        </div>
                      </div>

                      <div className="relative mt-2 rounded-full bg-[#3F7256]/15 px-2 py-1 text-center text-[8px] font-bold uppercase tracking-[0.08em] text-[#365D47]">
                        Pay prepaid &amp; get rewarded
                      </div>
                    </motion.div>
                  </div>


                    <p className="mt-1.5 text-xs leading-relaxed text-[#70665A]">
                      Get 100% cashback on all prepaid orders of this product in your store wallet
                    </p>

                    <button className="mt-1.5 text-xs font-medium text-[#47745E] underline decoration-[#BFD2C3] underline-offset-2 transition-colors hover:text-[#365E4A]">
                      View Terms &amp;
                      Conditions
                    </button>

                    <div className="my-3 h-px w-full bg-[#E8E0D3]" />

                    <div className="flex items-center gap-4">
                      <motion.span
                        whileHover={{
                          scale: 1.08,
                        }}
                        className="flex items-center gap-1 text-base font-medium"
                      >
                        <span className="flex">
                          <span className="text-[#4285F4]">
                            G
                          </span>
                        </span>

                        <span className="text-[#4B4339]">
                          Pay
                        </span>
                      </motion.span>

                      <motion.span
                        whileHover={{
                          scale: 1.08,
                        }}
                        className="text-base font-bold tracking-tight"
                      >
                        <span className="text-[#00A9D6]">
                          Pay
                        </span>

                        <span className="text-[#174F86]">
                          tm
                        </span>
                      </motion.span>

                      <motion.span
                        whileHover={{
                          scale: 1.08,
                        }}
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-[#7650A8] text-white"
                      >
                        <Smartphone
                          size={12}
                        />
                      </motion.span>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* testimonial carousel */}

          <div className="relative mt-5 overflow-hidden">
            <div
              ref={trackRef}
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${
                  slide * 100
                }%)`,
              }}
            >
              {TESTIMONIALS.map(
                (t) => (
                  <div
                    key={t.id}
                    className="w-full shrink-0 px-0.5"
                  >
                    <div className="flex gap-3 rounded-xl border border-[#E9E1D5] bg-[#F7F3EC] p-4">
                      <img
                        src={
                          t.avatarUrl
                        }
                        alt={t.name}
                        className="h-9 w-9 shrink-0 rounded-full object-cover"
                      />

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-sm font-semibold text-[#393129]">
                            {t.name}
                          </span>

                          {t.verified && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#302A24] px-2 py-0.5 text-[10px] font-medium text-white">
                              <BadgeCheck
                                size={11}
                              />
                              Verified
                            </span>
                          )}
                        </div>

                        <StarRow
                          rating={t.rating}
                          size={12}
                        />

                        <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-[#746A5D]">
                          {t.text}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* dots */}

            <div className="mt-3 flex items-center justify-center gap-1.5">
              {TESTIMONIALS.map(
                (_, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      setSlide(i)
                    }
                    aria-label={`Go to review ${
                      i + 1
                    }`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === slide
                        ? "w-5 bg-[#40382F]"
                        : "w-1.5 bg-[#D5CCBE]"
                    }`}
                  />
                )
              )}
            </div>
          </div>

          {/* stock left */}

          <motion.div
            animate={{
              opacity: [1, 0.6, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mt-4 rounded-lg border border-dashed border-[#D7B66D] bg-[#FAF2DF] py-2 text-center text-sm font-semibold text-[#B24E43]"
          >
            🐭 🐭 Last {unitsLeft} Units Left 🐭 🐭
          </motion.div>

          {/* delivery estimate */}

          <div className="mt-4 rounded-xl border border-[#E5D5B7] bg-[#FAF5E9] p-4">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 text-lg">
                📦
              </span>

              <div>
                <p className="text-sm font-semibold text-[#3D352D]">
                  Get estimated delivery
                  date
                </p>

                <p className="text-xs text-[#817669]">
                  Prepaid orders are delivered on priority.
                </p>
              </div>
            </div>

            <div className="mt-3 flex overflow-hidden rounded-lg border border-[#D6CCBE] bg-[#FFFDF9]">
              <span className="flex items-center pl-3 text-[#9A8F80]">
                <MapPin
                  size={16}
                />
              </span>

              <input
                value={pincode}
                onChange={(e) =>
                  setPincode(
                    e.target.value
                      .replace(
                        /\D/g,
                        ""
                      )
                      .slice(
                        0,
                        6
                      )
                  )
                }
                placeholder="Enter your pincode"
                inputMode="numeric"
                className="w-full bg-transparent px-2 py-2.5 text-sm text-[#342E27] outline-none placeholder:text-[#A79D90]"
              />

              <button
                onClick={
                  handleCheckPincode
                }
                disabled={
                  pincode.length !==
                    6 ||
                  checking
                }
                className="m-1 rounded-md bg-[#3F7256] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#345F48] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {checking ? (
                  <span className="flex items-center gap-1">
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  </span>
                ) : (
                  "Check"
                )}
              </button>
            </div>

            <AnimatePresence>
              {eta && (
                <motion.p
                  initial={{
                    opacity: 0,
                    y: -6,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  className="mt-2 text-xs font-medium text-[#47745E]"
                >
                  Delivered by{" "}
                  {eta} to{" "}
                  {pincode}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="mt-4 flex items-center justify-between border-t border-[#E4D6BA] pt-3">
              <div className="flex items-center gap-2">
                <Gift
                  size={18}
                  className="text-[#574D42]"
                />

                <div className="leading-tight">
                  <p className="text-xs font-semibold text-[#3B342C]">
                    100% Cashback
                  </p>

                  <p className="text-[10px] text-[#83786A]">
                    on all prepaid orders
                    (T&amp;C)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Truck
                  size={18}
                  className="text-[#574D42]"
                />

                <div className="leading-tight">
                  <p className="text-xs font-semibold text-[#3B342C]">
                    FREE Shipping
                  </p>

                  <p className="text-[10px] text-[#83786A]">
                    on all orders
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* related products */}

          <p className="mt-6 text-sm font-medium text-[#51483D]">
            Dhan Yog Bracelet
          </p>

          <div
            ref={relatedTrackRef}
            onScroll={
              handleRelatedScroll
            }
            className="mt-2 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {RELATED_PRODUCTS.map(
              (p) => {
                const active =
                  p.id ===
                  selectedProduct;

                return (
                  <motion.button
                    key={p.id}
                    onClick={() =>
                      setSelectedProduct(
                        p.id
                      )
                    }
                    whileTap={{
                      scale: 0.97,
                    }}
                    className={`flex w-[calc(50%-6px)] shrink-0 snap-start items-center gap-2.5 rounded-xl border-2 bg-[#FFFDF9] p-2.5 text-left transition-colors duration-200 ${
                      active
                        ? "border-[#C99A3D] bg-[#F8F0DF]"
                        : "border-[#E2DACD] hover:border-[#C9BEAE]"
                    }`}
                  >
                    <img
                      src={
                        p.imageUrl
                      }
                      alt={p.name}
                      className="h-12 w-12 shrink-0 rounded-lg object-cover"
                    />

                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-[#4A4137]">
                        {p.name}
                      </p>

                      <p className="mt-0.5 text-sm font-semibold text-[#2E2822]">
                        {formatINR(
                          p.price
                        )}{" "}
                        <span className="text-xs font-normal text-[#9B9184] line-through">
                          {formatINR(
                            p.mrp
                          )}
                        </span>
                      </p>
                    </div>
                  </motion.button>
                );
              }
            )}
          </div>

          <div className="mt-2 flex items-center justify-center gap-1">
            {Array.from({
              length:
                RELATED_DOT_COUNT,
            }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === relatedDot
                    ? "w-1.5 bg-[#40382F]"
                    : "w-1.5 bg-[#D8CFC2]"
                }`}
              />
            ))}
          </div>

          {/* add to cart / buy now */}

          <div className="mt-4 grid grid-cols-2 gap-3">
            <motion.button
              onClick={
                handleAddToCart
              }
              whileTap={{
                scale: 0.96,
              }}
              className="relative overflow-hidden rounded-lg bg-[#C99A3D] py-3 text-sm font-bold tracking-wide text-[#241B10] shadow-sm transition-colors hover:bg-[#B88932]"
            >
              <AnimatePresence
                mode="wait"
                initial={false}
              >
                {cartState ===
                "idle" ? (
                  <motion.span
                    key="idle"
                    initial={{
                      opacity: 0,
                      y: 6,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -6,
                    }}
                    transition={{
                      duration: 0.15,
                    }}
                    className="flex items-center justify-center gap-2"
                  >
                    <ShoppingCart
                      size={15}
                    />
                    ADD TO CART
                  </motion.span>
                ) : (
                  <motion.span
                    key="added"
                    initial={{
                      opacity: 0,
                      y: 6,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -6,
                    }}
                    transition={{
                      duration: 0.15,
                    }}
                    className="flex items-center justify-center gap-2"
                  >
                    <BadgeCheck
                      size={15}
                    />
                    ADDED
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.button
              whileTap={{
                scale: 0.96,
              }}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#302A24] py-3 text-sm font-bold tracking-wide text-white shadow-sm transition-colors hover:bg-[#211D19]"
            >
              <Zap
                size={15}
                className="fill-[#E0BE72] text-[#E0BE72]"
              />
              BUY NOW
            </motion.button>
          </div>

          {/* description + ingredients */}

          <p className="mt-6 text-sm leading-relaxed text-[#62584D]">
            Attract wealth and keep
            your energy balanced with
            the{" "}
            <span className="font-semibold text-[#302A24]">
              Dhan Yog Bracelet
            </span>
            , made with
          </p>

          <ul className="mt-3 space-y-2">
            {INGREDIENTS.map(
              (ing) => (
                <li
                  key={ing.name}
                  className="flex items-start gap-2 text-sm text-[#62584D]"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#A99C8B]" />

                  <span>
                    <span className="font-semibold text-[#302A24]">
                      {ing.name}
                    </span>{" "}
                    -{" "}
                    {ing.benefit}
                  </span>
                </li>
              )
            )}
          </ul>

          <p className="mt-4 rounded-lg bg-[#F4F0E9] p-3 text-xs leading-relaxed text-[#756B5E]">
            <span className="font-semibold text-[#41392F]">
              Note:
            </span>{" "}
            Prolonged sunlight may naturally fade genuine crystals to a lighter shade. This is common and a normal sign of authenticity.
          </p>

          {/* loved by customers + reels */}

          <h2 className="mt-8 text-center font-serif text-2xl text-[#302A24]">
            Loved by 15 lakh+
            customers
          </h2>

          <div className="mt-4 flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {REELS.map(
              (reel) => {
                const isPlaying =
                  playingReel ===
                  reel.id;

                const isMuted =
                  mutedReels[
                    reel.id
                  ] ?? true;

                return (
                  <motion.div
                    key={reel.id}
                    onClick={() =>
                      setPlayingReel(
                        isPlaying
                          ? null
                          : reel.id
                      )
                    }
                    whileTap={{
                      scale: 0.98,
                    }}
                    className="relative aspect-[9/16] w-[46%] shrink-0 cursor-pointer overflow-hidden rounded-xl bg-[#E8E0D5]"
                  >
                    <motion.img
                      src={
                        reel.thumbnailUrl
                      }
                      alt={
                        reel.caption
                      }
                      animate={{
                        scale: isPlaying
                          ? 1.06
                          : 1,
                      }}
                      transition={{
                        duration: 6,
                        ease: "linear",
                      }}
                      className="h-full w-full object-cover"
                    />

                    <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                      <Eye size={11} />
                      {reel.views}
                    </span>

                    <AnimatePresence>
                      {!isPlaying && (
                        <motion.span
                          initial={{
                            opacity: 0,
                            scale: 0.7,
                          }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                          }}
                          exit={{
                            opacity: 0,
                            scale: 0.7,
                          }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow">
                            <Play
                              size={16}
                              className="ml-0.5 fill-[#302A24] text-[#302A24]"
                            />
                          </span>
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {isPlaying && (
                      <button
                        onClick={(e) =>
                          toggleMute(
                            reel.id,
                            e
                          )
                        }
                        className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm"
                        aria-label={
                          isMuted
                            ? "Unmute"
                            : "Mute"
                        }
                      >
                        {isMuted ? (
                          <VolumeX
                            size={13}
                          />
                        ) : (
                          <Volume2
                            size={13}
                          />
                        )}
                      </button>
                    )}

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent px-3 pb-3 pt-8">
                      <p className="text-xs font-medium italic text-white">
                        "{reel.caption}"
                      </p>
                    </div>
                  </motion.div>
                );
              }
            )}
          </div>

          {/* info accordion */}

          <div className="mt-8 border-t border-[#E4DDD2]">
            {INFO_ACCORDION.map(
              (item) => (
                <AccordionRow
                  key={item.id}
                  label={item.title}
                  isOpen={
                    openInfoId ===
                    item.id
                  }
                  onToggle={() =>
                    toggleInfo(
                      item.id
                    )
                  }
                >
                  {item.content.map(
                    (line, i) => (
                      <p key={i}>
                        {line}
                      </p>
                    )
                  )}
                </AccordionRow>
              )
            )}
          </div>

        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 md:px-8">

        {/* customer reviews */}

        <div className="mt-10 rounded-2xl border border-[#E7DFD3] bg-[#FFFDF9] p-5 shadow-[0_8px_30px_rgba(60,45,25,0.05)] sm:p-8">
          <h2 className="text-center font-serif text-2xl text-[#302A24] sm:text-3xl">
            Customer Reviews
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-[auto_1px_1fr] sm:items-center sm:gap-8">
            <div className="flex flex-col items-start gap-1 sm:items-center sm:text-center">
              <StarRow
                rating={4.95}
                size={18}
              />

              <p className="text-sm font-medium text-[#40382F]">
                4.95 out of 5
              </p>

              <p className="text-xs text-[#84796B]">
                Based on 1623
                reviews
              </p>
            </div>

            <div className="hidden h-full w-px bg-[#E5DDD1] sm:block" />

            <div className="space-y-1.5">
              {RATING_BREAKDOWN.map(
                (row) => (
                  <div
                    key={
                      row.stars
                    }
                    className="flex items-center gap-2"
                  >
                    <div className="flex w-16 shrink-0 items-center gap-0.5">
                      {Array.from({
                        length: 5,
                      }).map(
                        (_, i) => (
                          <Star
                            key={
                              i
                            }
                            size={
                              11
                            }
                            className={
                              i <
                              row.stars
                                ? "fill-[#C99A3D] text-[#C99A3D]"
                                : "fill-[#E7E0D2] text-[#E7E0D2]"
                            }
                            strokeWidth={
                              1
                            }
                          />
                        )
                      )}
                    </div>

                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#EEE8DF]">
                      <motion.div
                        initial={{
                          width: 0,
                        }}
                        whileInView={{
                          width: `${
                            (row.count /
                              maxRatingCount) *
                            100
                          }%`,
                        }}
                        viewport={{
                          once: true,
                        }}
                        transition={{
                          duration: 0.7,
                          ease: "easeOut",
                        }}
                        className="h-full rounded-full bg-[#5A5044]"
                      />
                    </div>

                    <span className="w-8 shrink-0 text-right text-xs text-[#84796B]">
                      {
                        row.count
                      }
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="mt-5 border-t border-[#E8E0D4] pt-4">
            <p className="mb-2 text-xs text-[#82776A]">
              Customer photos &amp;
              videos
            </p>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {REVIEW_PHOTOS.map(
                (src, i) => (
                  <motion.img
                    key={i}
                    src={src}
                    alt={`Customer photo ${
                      i + 1
                    }`}
                    whileHover={{
                      scale: 1.06,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    className="h-14 w-14 shrink-0 cursor-pointer rounded-lg object-cover"
                  />
                )
              )}

              <button className="ml-1 shrink-0 text-xs font-medium text-[#62584D] underline decoration-[#CFC4B5] underline-offset-2 transition-colors hover:text-[#302A24]">
                See more
              </button>
            </div>
          </div>
        </div>

        {/* specifications */}

        <h2 className="mt-10 text-center font-serif text-2xl text-[#302A24] sm:text-3xl">
          Specifications
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-x-12 sm:grid-cols-2">
          <div className="divide-y divide-[#E5DDD1]">
            {SPECS_LEFT.map(
              (spec) => (
                <div
                  key={
                    spec.label
                  }
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <span className="text-[#887D6F]">
                    {spec.label}
                  </span>

                  <span className="font-medium text-[#453D34]">
                    {spec.value}
                  </span>
                </div>
              )
            )}
          </div>

          <div className="divide-y divide-[#E5DDD1] sm:border-l sm:border-[#E5DDD1] sm:pl-8">
            {SPECS_RIGHT.map(
              (spec) => (
                <div
                  key={
                    spec.label
                  }
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <span className="text-[#887D6F]">
                    {spec.label}
                  </span>

                  <span className="font-medium text-[#453D34]">
                    {spec.value}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* faqs */}

        <h2 className="mt-10 text-center font-serif text-2xl text-[#302A24] sm:text-3xl">
          FAQs
        </h2>

        <div className="mt-4 border-t border-[#E4DDD2] pb-10">
          {FAQS.map(
            (faq, idx) => (
              <AccordionRow
                key={faq.id}
                label={`${
                  idx + 1
                }. ${
                  faq.question
                }`}
                isOpen={
                  openFaqId ===
                  faq.id
                }
                onToggle={() =>
                  toggleFaq(
                    faq.id
                  )
                }
              >
                <p>
                  {faq.answer}
                </p>
              </AccordionRow>
            )
          )}
        </div>
      </div>
    </div>
  );
}