"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Bag, ChevronDown, Person, Search, X, Moon, Heart, Phone } from "./Header/icons";
import Logo from "../../public/images/image_logo.jpg";

type MenuKey = "rashi" | "stone";

type NavItem = {
  label: string;
  href?: string;
  hasDropdown?: boolean;
  menu?: MenuKey;
};

type PlanetLink = {
  name: string;
  sanskrit: string;
  gemstone: string;
  color: string;
  glyph: string;
  shadow?: boolean;
  href?: string;
};

type StoneLink = {
  stone: string;
  planet: string;
  sanskrit: string;
  color: string;
  glyph: string;
  shadow?: boolean;
  href?: string;
};

const primaryRow: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "How it Works", href: "#how-it-works-heading" },
  { label: "Shop By Rashi", href: "#shop-by-planets-heading", hasDropdown: true, menu: "rashi" },
  { label: "Shop By Stone", href: "#shop-by-stone-heading", hasDropdown: true, menu: "stone" },
  { label: "About NavGrah", href: "#navgrah-section" },
  { label: "Contact Us", href: "#contact-us-heading" },
];

const PLANETS: PlanetLink[] = [
  { name: "Sun", sanskrit: "Surya", gemstone: "Ruby", color: "#E2672A", glyph: "☉" },
  { name: "Moon", sanskrit: "Chandra", gemstone: "Pearl", color: "#8C97A6", glyph: "☽" },
  { name: "Mars", sanskrit: "Mangal", gemstone: "Red Coral", color: "#B23A2E", glyph: "♂" },
  { name: "Mercury", sanskrit: "Budh", gemstone: "Emerald", color: "#4C7C59", glyph: "☿" },
  { name: "Jupiter", sanskrit: "Guru", gemstone: "Yellow Sapphire", color: "#C89B3C", glyph: "♃" },
  { name: "Venus", sanskrit: "Shukra", gemstone: "Diamond", color: "#B98CB0", glyph: "♀" },
  { name: "Saturn", sanskrit: "Shani", gemstone: "Blue Sapphire", color: "#33526E", glyph: "♄" },
  { name: "Rahu", sanskrit: "Rahu", gemstone: "Hessonite", color: "#7A6248", glyph: "☊", shadow: true },
  { name: "Ketu", sanskrit: "Ketu", gemstone: "Cat's Eye", color: "#5B6B4F", glyph: "☋", shadow: true },
];

// Derived from PLANETS so the two menus never fall out of sync with each other.
const STONES: StoneLink[] = PLANETS.map((p) => ({
  stone: p.gemstone,
  planet: p.name,
  sanskrit: p.sanskrit,
  color: p.color,
  glyph: p.glyph,
  shadow: p.shadow,
  href: p.href,
}));

const NAVARATNA_THREAD = `linear-gradient(90deg, ${PLANETS.map((p) => p.color).join(", ")})`;

const TICKER_ITEMS = [
  "☉ Every bracelet is charged under sunlight before it ships",
  "☾ Lab-certified gemstones, sourced and hand-set",
  "♃ Free consultation with our experts, every day",
  "♀ A complimentary Kundli reading with your first order",
];

const OUTER_POSITIONS: Record<string, { x: number; y: number }> = {
  Moon: { x: 90, y: 30 },
  Ketu: { x: 30, y: 90 },
  Mars: { x: 270, y: 30 },
  Mercury: { x: 330, y: 90 },
  Rahu: { x: 30, y: 270 },
  Saturn: { x: 90, y: 330 },
  Venus: { x: 270, y: 330 },
  Jupiter: { x: 330, y: 270 },
};

function MandalaGlyph({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 18 18"
      width="16"
      height="16"
      className={`shrink-0 text-current transition-transform duration-300 motion-reduce:transition-none ${
        active ? "rotate-45 scale-110" : "rotate-0 group-hover:rotate-[20deg]"
      }`}
      aria-hidden="true"
    >
      <rect x="1" y="1" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1" opacity={active ? 0.9 : 0.45} />
      <path d="M1,1 L17,17 M17,1 L1,17" stroke="currentColor" strokeWidth="1" opacity={active ? 0.9 : 0.35} />
      <path d="M9,1 L17,9 L9,17 L1,9 Z" fill="none" stroke="currentColor" strokeWidth="1.1" opacity={active ? 1 : 0.65} />
    </svg>
  );
}

function NavagrahaMandala({ replayKey }: { replayKey: number }) {
  const sun = PLANETS.find((p) => p.name === "Sun")!;
  const others = PLANETS.filter((p) => p.name !== "Sun");

  return (
    <svg
      key={replayKey}
      viewBox="-40 -40 440 440"
      className="h-[380px] w-[380px] shrink-0"
      role="img"
      aria-label="Navagraha mandala — nine planets, choose one to shop its gemstone"
    >
      <g stroke="#1C1024" strokeOpacity="0.14" strokeWidth="1.25" fill="none">
        <rect x="0" y="0" width="360" height="360" />
        <path d="M0,0 L360,360 M360,0 L0,360" />
        <path d="M180,0 L360,180 L180,360 L0,180 Z" />
      </g>

      <foreignObject x="105" y="123" width="150" height="114">
        <div className="ng-sun flex h-full w-full items-center justify-center">
          <Link
            href={sun.href ?? "#"}
            role="menuitem"
            className="group flex flex-col items-center gap-0.5 rounded-full px-4 py-3 transition-transform duration-200 hover:scale-[1.06]"
            style={{ "--pc": sun.color } as React.CSSProperties}
          >
            <span className="text-[30px] leading-none" style={{ color: sun.color }}>
              {sun.glyph}
            </span>
            <span className="ng-display text-[16px] italic leading-tight text-[#1C1024]">{sun.name}</span>
            <span className="text-[10.5px] text-[#1C1024]/55">{sun.gemstone}</span>
          </Link>
        </div>
      </foreignObject>

      {others.map((planet, i) => {
        const pos = OUTER_POSITIONS[planet.name];
        if (!pos) return null;
        return (
          <foreignObject
            key={planet.name}
            x={pos.x - 59}
            y={pos.y - 34}
            width="118"
            height="68"
            style={{ animationDelay: `${90 + i * 45}ms` }}
          >
            <div className="ng-cell flex h-full w-full items-center justify-center">
              <Link
                href={planet.href ?? "#"}
                role="menuitem"
                style={{ "--pc": planet.color } as React.CSSProperties}
                className={`group flex flex-col items-center gap-0.5 rounded-md px-2.5 py-1.5 transition-colors duration-150 hover:bg-[color-mix(in_srgb,var(--pc)_12%,white)] ${
                  planet.shadow ? "opacity-90" : ""
                }`}
              >
                <span className="text-[18px] leading-none" style={{ color: planet.color }}>
                  {planet.glyph}
                </span>
                <span className="ng-display text-[12.5px] italic leading-tight text-[#1C1024]">{planet.name}</span>
                <span className="text-[9.5px] text-[#1C1024]/50">{planet.gemstone}</span>
              </Link>
            </div>
          </foreignObject>
        );
      })}
    </svg>
  );
}

function StoneGrid({ replayKey }: { replayKey: number }) {
  return (
    <div key={replayKey} className="grid w-[380px] grid-cols-3 gap-3 p-1" role="none">
      {STONES.map((stone, i) => (
        <Link
          key={stone.stone}
          href={stone.href ?? "#"}
          role="menuitem"
          style={{ "--pc": stone.color, animationDelay: `${60 + i * 40}ms` } as React.CSSProperties}
          className={`ng-cell ng-clip-sm group flex flex-col items-center gap-1.5 border border-[#1C1024]/8 bg-[#FCFBF8] px-3 py-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--pc)_45%,transparent)] hover:bg-[color-mix(in_srgb,var(--pc)_6%,#FCFBF8)] hover:shadow-[0_10px_24px_-12px_rgba(28,16,36,0.24)] ${
            stone.shadow ? "opacity-90" : ""
          }`}
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full text-[16px] transition-transform duration-200 group-hover:scale-110"
            style={{ backgroundColor: "color-mix(in srgb, var(--pc) 16%, white)", color: stone.color }}
          >
            {stone.glyph}
          </span>
          <span className="ng-display text-[13px] italic leading-tight text-[#1C1024]">{stone.stone}</span>
          <span className="text-[9.5px] leading-tight text-[#1C1024]/50">
            {stone.planet} · {stone.sanskrit}
          </span>
        </Link>
      ))}
    </div>
  );
}

function NavLink({
  item,
  isActive,
  isOpen,
  onToggle,
}: {
  item: NavItem;
  isActive: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}) {
  const base =
    "group relative flex items-center gap-2 whitespace-nowrap py-2.5 text-[15px] font-medium transition-colors duration-200 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2711D]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white";
  const color = isActive || isOpen ? "text-[#E2711D]" : "text-[#1C1024] hover:text-[#E2711D]";
  const underline = `absolute -bottom-0.5 left-0 h-[1.5px] w-full origin-left bg-[#E2711D] transition-transform duration-200 motion-reduce:transition-none ${
    isActive || isOpen ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100"
  }`;

  if (item.hasDropdown) {
    return (
      <button type="button" onClick={onToggle} aria-haspopup="true" aria-expanded={isOpen} className={`${base} ${color}`}>
        {item.label}
        <MandalaGlyph active={!!isOpen} />
        <span className={underline} />
      </button>
    );
  }

  return (
    <Link href={item.href ?? "#"} aria-current={isActive ? "page" : undefined} className={`${base} ${color}`}>
      {item.label}
      <span className={underline} />
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const [menuPulseKey, setMenuPulseKey] = useState(0);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState<MenuKey | null>(null);
  const [isDesktopSearchOpen, setIsDesktopSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [cartBadgePulse, setCartBadgePulse] = useState(false);
  const [cartCount] = useState(0);
  const [wishlistCount] = useState(0);
  const prevCartCount = useRef(cartCount);

  const rashiRef = useRef<HTMLLIElement>(null);
  const stoneRef = useRef<HTMLLIElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const desktopSearchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      const insideRashi = rashiRef.current?.contains(target);
      const insideStone = stoneRef.current?.contains(target);
      if (!insideRashi && !insideStone) {
        setOpenMenu(null);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setIsMobileOpen(false);
        setIsDesktopSearchOpen(false);
        setIsMobileSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  useEffect(() => {
    if (cartCount !== prevCartCount.current) {
      prevCartCount.current = cartCount;
      setCartBadgePulse(true);
      const t = setTimeout(() => setCartBadgePulse(false), 300);
      return () => clearTimeout(t);
    }
  }, [cartCount]);

  // Autofocus the search input the moment its container opens, on either breakpoint.
  useEffect(() => {
    if (isDesktopSearchOpen) {
      const t = setTimeout(() => desktopSearchInputRef.current?.focus(), 180);
      return () => clearTimeout(t);
    }
  }, [isDesktopSearchOpen]);

  useEffect(() => {
    if (isMobileSearchOpen) {
      const t = setTimeout(() => mobileSearchInputRef.current?.focus(), 180);
      return () => clearTimeout(t);
    }
  }, [isMobileSearchOpen]);

  // Clear any pending close timer on unmount.
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  function openMenuNow(menu?: MenuKey) {
    if (!menu) return;
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenMenu(menu);
    if (menu === "rashi") setMenuPulseKey((k) => k + 1);
  }

  function scheduleMenuClose() {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setOpenMenu(null), 150);
  }

  function toggleMenu(menu?: MenuKey) {
    if (!menu) return;
    setOpenMenu((prev) => {
      const next = prev === menu ? null : menu;
      if (next === "rashi") setMenuPulseKey((k) => k + 1);
      return next;
    });
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!searchValue.trim()) return;
    setIsDesktopSearchOpen(false);
    setIsMobileSearchOpen(false);
  }

  const isItemActive = (item: NavItem) => !!item.href && item.href !== "#" && pathname === item.href;

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-300 motion-reduce:transition-none ${
        isScrolled ? "shadow-[0_2px_16px_-6px_rgba(28,16,36,0.16)]" : ""
      }`}
    >
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,500;0,600;1,500;1,600&family=Manrope:wght@400;500;600;700&display=swap");

        .ng-display {
          font-family: "Newsreader", serif;
        }
        .ng-ui {
          font-family: "Manrope", sans-serif;
        }

        /* Cut-corner card — a nod to a faceted gemstone, the recurring structural motif */
        .ng-clip-sm {
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%);
        }
        .ng-clip-lg {
          clip-path: polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%);
        }

        @keyframes ng-cell-in {
          from {
            opacity: 0;
            transform: scale(0.85);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes ng-sun-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(226, 103, 42, 0.35);
          }
          70% {
            box-shadow: 0 0 0 18px rgba(226, 103, 42, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(226, 103, 42, 0);
          }
        }
        .ng-cell {
          animation: ng-cell-in 340ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .ng-sun {
          animation:
            ng-cell-in 340ms cubic-bezier(0.16, 1, 0.3, 1) both,
            ng-sun-pulse 950ms ease-out 280ms 1;
          border-radius: 9999px;
        }

        @keyframes ng-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .ng-marquee-track {
          display: flex;
          width: max-content;
          animation: ng-marquee 34s linear infinite;
        }

        @keyframes ng-live-dot {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.35;
          }
        }
        .ng-live-dot {
          animation: ng-live-dot 1.6s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .ng-cell,
          .ng-sun,
          .ng-marquee-track,
          .ng-live-dot {
            animation: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>

      <div className="h-[3px] w-full" style={{ backgroundImage: NAVARATNA_THREAD }} aria-hidden="true" />
      <div className="mx-auto flex max-w-container items-center gap-4 px-4 py-3.5 sm:px-6 lg:gap-7 lg:px-10 lg:py-4">
        <Link href="/" className="relative flex shrink-0 items-center" aria-label="NavGrah home">
          <span
            className="pointer-events-none absolute -inset-2 -z-10 rounded-full opacity-60 blur-md"
            style={{ background: "radial-gradient(circle, rgba(226,113,29,0.16), transparent 70%)" }}
            aria-hidden="true"
          />
          <Image src={Logo} alt="NavGrah Logo" className="h-14 w-auto rounded-lg md:h-16 lg:h-[68px]" priority />
        </Link>

        {/* Desktop search: a compact icon by default so it never fights the nav for space;
            clicking it expands the field inline and gives it a guaranteed minimum width. */}
        <div className="ml-auto hidden shrink-0 items-center md:flex">
          <div
            className={`grid transition-[grid-template-columns] duration-250 ease-out motion-reduce:transition-none ${
              isDesktopSearchOpen ? "grid-cols-[min(22vw,320px)]" : "grid-cols-[0px]"
            }`}
          >
            <div className="min-w-0 overflow-hidden">
              <form onSubmit={handleSearchSubmit} role="search" className="pr-2">
                <label htmlFor="navgrah-search-desktop" className="sr-only">
                  Search gemstones, remedies, consultations
                </label>
                <input
                  id="navgrah-search-desktop"
                  ref={desktopSearchInputRef}
                  type="search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onBlur={() => {
                    if (!searchValue.trim()) setIsDesktopSearchOpen(false);
                  }}
                  placeholder="Search gemstones, remedies…"
                  className="ng-ui ng-clip-sm w-full border border-[#1C1024]/15 bg-[#FCFBF8] py-2.5 px-4 text-[14px] text-[#1C1024] placeholder:text-[#1C1024]/40 outline-none transition-[border-color,box-shadow] duration-200 focus:border-[#E2711D]/50 focus:shadow-[0_0_0_3px_rgba(226,113,29,0.12)] motion-reduce:transition-none"
                />
              </form>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsDesktopSearchOpen((v) => !v)}
            aria-label={isDesktopSearchOpen ? "Close search" : "Search gemstones, remedies, consultations"}
            aria-expanded={isDesktopSearchOpen}
            aria-controls="navgrah-search-desktop"
            className="flex items-center gap-1.5 rounded-md px-3 py-2.5 text-[13.5px] font-medium text-[#1C1024] transition-colors duration-200 hover:bg-[#1C1024]/[0.04] hover:text-[#E2711D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2711D]/40"
          >
            {isDesktopSearchOpen ? <X className="h-[22px] w-[22px]" /> : <Search className="h-[22px] w-[22px]" />}
            <span className="hidden lg:inline">Search</span>
          </button>
        </div>

        <div className="hidden shrink-0 items-center gap-1 md:flex">
          <a
            href="https://wa.me/918598573812?text=Hello%2C%20I%20would%20like%20to%20consult%20an%20expert's."
            target="_blank"
            rel="noopener noreferrer"
            className="ng-ui ng-clip-sm mr-2 hidden items-center gap-2 bg-[#B8232F] px-4 py-2.5 text-[13.5px] font-semibold text-white transition-colors duration-200 hover:bg-[#93121C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8232F]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white lg:inline-flex"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="ng-live-dot absolute inset-0 rounded-full bg-[#7BC67E]" />
            </span>

            <Phone className="h-4 w-4" />

            Talk to our Expert
          </a>


          <button
            type="button"
            aria-label={`Wishlist, ${wishlistCount} item${wishlistCount === 1 ? "" : "s"}`}
            className="relative flex items-center gap-1.5 rounded-md px-3 py-2.5 text-[13.5px] font-medium text-[#1C1024] transition-colors duration-200 hover:bg-[#1C1024]/[0.04] hover:text-[#E2711D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2711D]/40"
          >
            <span className="relative">
              <Heart className="h-[22px] w-[22px]" filled={wishlistCount > 0} />
              {wishlistCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#B8232F] px-1 text-[10px] font-semibold text-white">
                  {wishlistCount}
                </span>
              )}
            </span>
            <span className="hidden lg:inline">Wishlist</span>
          </button>

          <button
            type="button"
            aria-label="Account, log in or view your account"
            className="flex items-center gap-1.5 rounded-md px-3 py-2.5 text-[13.5px] font-medium text-[#1C1024] transition-colors duration-200 hover:bg-[#1C1024]/[0.04] hover:text-[#E2711D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2711D]/40"
          >
            <Person className="h-[22px] w-[22px]" />
            <span className="hidden lg:inline">Account</span>
          </button>

          <button
            type="button"
            aria-label={`Shopping bag, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
            className="relative flex items-center gap-1.5 rounded-md px-3 py-2.5 text-[13.5px] font-medium text-[#1C1024] transition-colors duration-200 hover:bg-[#1C1024]/[0.04] hover:text-[#E2711D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2711D]/40"
          >
            <span className="relative">
              <Bag className="h-[22px] w-[22px]" />
              {cartCount > 0 && (
                <span
                  className={`absolute -right-1.5 -top-1.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#B8232F] px-1 text-[10px] font-semibold text-white transition-transform duration-300 motion-reduce:transition-none ${
                    cartBadgePulse ? "scale-125" : "scale-100"
                  }`}
                >
                  {cartCount}
                </span>
              )}
            </span>
            <span className="hidden lg:inline">Bag</span>
          </button>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1 md:hidden">
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen((v) => !v)}
            aria-label={isMobileSearchOpen ? "Close search" : "Open search"}
            aria-expanded={isMobileSearchOpen}
            aria-controls="navgrah-mobile-search-row"
            className="flex h-10 w-10 items-center justify-center rounded-md text-[#1C1024] transition-colors duration-200 hover:bg-[#1C1024]/[0.05]"
          >
            {isMobileSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-[22px] w-[22px]" />}
          </button>

          <button
            type="button"
            aria-label={`Shopping bag, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
            className="relative flex h-10 w-10 items-center justify-center rounded-md text-[#1C1024] transition-colors duration-200 hover:bg-[#1C1024]/[0.05]"
          >
            <Bag className="h-[22px] w-[22px]" />
            {cartCount > 0 && (
              <span
                className={`absolute right-0.5 top-0.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#B8232F] px-1 text-[10px] font-semibold text-white transition-transform duration-300 motion-reduce:transition-none ${
                  cartBadgePulse ? "scale-125" : "scale-100"
                }`}
              >
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsMobileOpen((v) => !v)}
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileOpen}
            tabIndex={isMobileOpen ? -1 : 0}
            className={`flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-[5px] rounded-md transition-colors duration-200 ${
              isMobileOpen ? "pointer-events-none opacity-0" : "hover:bg-[#1C1024]/[0.05]"
            }`}
          >
            <span className="h-[1.5px] w-5 rounded-full bg-[#1C1024]" />
            <span className="h-[1.5px] w-5 rounded-full bg-[#1C1024]" />
            <span className="h-[1.5px] w-3.5 self-end rounded-full bg-[#E2711D]" />
          </button>
        </div>
      </div>

      {/* Mobile search row — now toggled by the search icon above instead of always
          taking up a permanent row, and reliably visible/focused when opened. */}
      <div
        id="navgrah-mobile-search-row"
        className={`grid overflow-hidden border-t border-[#1C1024]/8 transition-all duration-200 motion-reduce:transition-none md:hidden ${
          isMobileSearchOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] border-t-0 opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <form onSubmit={handleSearchSubmit} role="search" className="px-4 py-2.5 sm:px-6">
            <div className="relative">
              <label htmlFor="navgrah-search-mobile" className="sr-only">
                Search gemstones, remedies, consultations
              </label>
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#1C1024]/70"
                aria-hidden="true"
              />
              <input
                id="navgrah-search-mobile"
                ref={mobileSearchInputRef}
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search gemstones, remedies…"
                className="ng-ui ng-clip-sm w-full border border-[#1C1024]/15 bg-[#FCFBF8] py-2.5 pl-10 pr-4 text-[13.5px] text-[#1C1024] placeholder:text-[#1C1024]/40 outline-none transition-[border-color,box-shadow] duration-200 focus:border-[#E2711D]/50 focus:shadow-[0_0_0_3px_rgba(226,113,29,0.12)] motion-reduce:transition-none"
              />
            </div>
          </form>
        </div>
      </div>

      <nav aria-label="Primary" className="hidden border-t border-[#1C1024]/8 md:block">
        <ul className="mx-auto flex max-w-container flex-wrap items-center justify-center gap-x-10 px-6 py-1.5 lg:gap-x-14 lg:px-10">
          {primaryRow.map((item) => (
            <li
              key={item.label}
              className={item.hasDropdown ? "relative" : ""}
              ref={item.menu === "rashi" ? rashiRef : item.menu === "stone" ? stoneRef : undefined}
              onMouseEnter={item.hasDropdown ? () => openMenuNow(item.menu) : undefined}
              onMouseLeave={item.hasDropdown ? scheduleMenuClose : undefined}
              onFocus={item.hasDropdown ? () => openMenuNow(item.menu) : undefined}
            >
              <NavLink
                item={item}
                isActive={isItemActive(item)}
                isOpen={item.hasDropdown ? openMenu === item.menu : undefined}
                onToggle={item.hasDropdown ? () => toggleMenu(item.menu) : undefined}
              />

              {item.menu === "rashi" && (
                <div
                  role="menu"
                  aria-label="Shop by planet"
                  className={`ng-clip-lg absolute left-1/2 top-full z-50 mt-3 w-[660px] -translate-x-1/2 border border-[#1C1024]/10 bg-white shadow-[0_16px_40px_-14px_rgba(28,16,36,0.24)] transition-[opacity,transform] duration-200 motion-reduce:transition-none ${
                    openMenu === "rashi" ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
                  }`}
                >
                  {openMenu === "rashi" && (
                    <div className="flex items-stretch">
                      <div className="flex items-center justify-center border-r border-[#1C1024]/8 p-4">
                        <NavagrahaMandala replayKey={menuPulseKey} />
                      </div>

                      <div className="flex w-[240px] flex-col justify-between p-6">
                        <div>
                          <p className="ng-display text-[18px] italic leading-snug text-[#1C1024]">
                            Every planet carries its own stone.
                          </p>
                          <p className="mt-2 text-[12.5px] leading-relaxed text-[#1C1024]/60">
                            Rahu and Ketu are shadow planets — they have no physical body of their
                            own, so their bracelets are set with hessonite and cat&apos;s eye instead.
                          </p>
                        </div>
                        <Link href="#" className="group ng-ui relative mt-4 inline-flex w-fit items-center text-[12.5px] font-semibold text-[#B8232F]">
                          View all remedies
                          <span className="absolute -bottom-0.5 left-0 h-[1.5px] w-full origin-left scale-x-0 bg-[#B8232F] transition-transform duration-200 group-hover:scale-x-100 motion-reduce:transition-none" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {item.menu === "stone" && (
                <div
                  role="menu"
                  aria-label="Shop by stone"
                  className={`ng-clip-lg absolute left-1/2 top-full z-50 mt-3 w-[620px] -translate-x-1/2 border border-[#1C1024]/10 bg-white shadow-[0_16px_40px_-14px_rgba(28,16,36,0.24)] transition-[opacity,transform] duration-200 motion-reduce:transition-none ${
                    openMenu === "stone" ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
                  }`}
                >
                  {openMenu === "stone" && (
                    <div className="flex items-stretch">
                      <div className="flex items-center justify-center border-r border-[#1C1024]/8 p-5">
                        <StoneGrid replayKey={menuPulseKey} />
                      </div>

                      <div className="flex w-[220px] flex-col justify-between p-6">
                        <div>
                          <p className="ng-display text-[18px] italic leading-snug text-[#1C1024]">
                            One stone, one remedy.
                          </p>
                          <p className="mt-2 text-[12.5px] leading-relaxed text-[#1C1024]/60">
                            Every gemstone is lab-certified and hand-set to order, matched to the
                            planet it strengthens.
                          </p>
                        </div>
                        <Link href="#" className="group ng-ui relative mt-4 inline-flex w-fit items-center text-[12.5px] font-semibold text-[#B8232F]">
                          View all gemstones
                          <span className="absolute -bottom-0.5 left-0 h-[1.5px] w-full origin-left scale-x-0 bg-[#B8232F] transition-transform duration-200 group-hover:scale-x-100 motion-reduce:transition-none" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div
        aria-hidden={!isMobileOpen}
        onClick={() => setIsMobileOpen(false)}
        className={`fixed inset-0 z-40 bg-[#1C1024]/45 transition-opacity duration-300 motion-reduce:transition-none md:hidden ${
          isMobileOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`fixed inset-y-0 right-0 z-50 flex w-[86%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-out motion-reduce:transition-none md:hidden ${
          isMobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#1C1024]/10 px-5 py-4">
          <Image src={Logo} alt="NavGrah Logo" width={130} height={32} className="h-9 w-auto" />
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#1C1024] transition-colors duration-200 hover:bg-[#1C1024]/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2711D]/40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav aria-label="Mobile primary" className="flex-1 overflow-y-auto px-5 py-4">
          <a
            href="https://wa.me/918598573812?text=Hello%2C%20I%20would%20like%20to%20consult%20an%20expert's."
            target="_blank"
            rel="noopener noreferrer"
            className="ng-ui ng-clip-sm mb-4 flex items-center justify-center gap-2 bg-[#B8232F] py-3 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-[#93121C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8232F]/40"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="ng-live-dot absolute inset-0 rounded-full bg-[#7BC67E]" />
            </span>

            <Phone className="h-4 w-4" />

            Talk to our Expert's
          </a>


          <ul className="flex flex-col gap-1">
            {primaryRow.map((item) =>
              item.hasDropdown ? (
                <li key={item.label} className="border-b border-[#1C1024]/8 py-1">
                  <button
                    type="button"
                    onClick={() => setOpenMobileMenu((prev) => (prev === item.menu ? null : item.menu ?? null))}
                    aria-expanded={openMobileMenu === item.menu}
                    className="flex w-full items-center justify-between rounded-md py-3 text-[15px] font-medium text-[#1C1024] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2711D]/40"
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-4 w-4 text-[#E2711D] transition-transform duration-200 motion-reduce:transition-none ${
                        openMobileMenu === item.menu ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`grid overflow-hidden transition-all duration-200 motion-reduce:transition-none ${
                      openMobileMenu === item.menu ? "grid-rows-[1fr] pb-3 opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      {item.menu === "rashi" && (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pl-1">
                          {PLANETS.map((planet) => (
                            <Link
                              key={planet.name}
                              href={planet.href ?? "#"}
                              className="flex items-center gap-2 rounded-md py-1.5 text-[13.5px] text-[#1C1024]/85 transition-colors duration-150 hover:text-[#E2711D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2711D]/40"
                            >
                              <span className="w-4 shrink-0 text-center text-[13px] leading-none" style={{ color: planet.color }}>
                                {planet.glyph}
                              </span>
                              {planet.name === "Moon" && (
                                <Moon className="h-3 w-3 shrink-0 text-[#1C1024]/40" aria-hidden={true} />
                              )}
                              <span className={planet.shadow ? "italic" : ""}>
                                {planet.name} <span className="text-[#1C1024]/45">· {planet.gemstone}</span>
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}

                      {item.menu === "stone" && (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pl-1">
                          {STONES.map((stone) => (
                            <Link
                              key={stone.stone}
                              href={stone.href ?? "#"}
                              className="flex items-center gap-2 rounded-md py-1.5 text-[13.5px] text-[#1C1024]/85 transition-colors duration-150 hover:text-[#E2711D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2711D]/40"
                            >
                              <span className="w-4 shrink-0 text-center text-[13px] leading-none" style={{ color: stone.color }}>
                                {stone.glyph}
                              </span>
                              <span className={stone.shadow ? "italic" : ""}>
                                {stone.stone} <span className="text-[#1C1024]/45">· {stone.planet}</span>
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ) : (
                <li key={item.label} className="border-b border-[#1C1024]/8">
                  <Link
                    href={item.href ?? "#"}
                    aria-current={isItemActive(item) ? "page" : undefined}
                    className={`block rounded-md py-3 text-[15px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2711D]/40 ${
                      isItemActive(item) ? "text-[#E2711D]" : "text-[#1C1024] hover:text-[#E2711D]"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            )}
          </ul>

          <div className="mt-5 flex items-center justify-between border-t border-[#1C1024]/8 pt-4">
            <button
              type="button"
              aria-label="Account, log in or view your account"
              className="flex items-center gap-2 rounded-md py-2 text-[14px] font-medium text-[#1C1024] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2711D]/40"
            >
              <Person className="h-5 w-5" />
              Account
            </button>
            <button
              type="button"
              aria-label={`Wishlist, ${wishlistCount} item${wishlistCount === 1 ? "" : "s"}`}
              className="relative flex items-center gap-2 rounded-md py-2 text-[14px] font-medium text-[#1C1024] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2711D]/40"
            >
              <Heart className="h-5 w-5" filled={wishlistCount > 0} />
              Wishlist
              {wishlistCount > 0 && (
                <span className="absolute -right-3 -top-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#B8232F] px-1 text-[10px] font-semibold text-white">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button
              type="button"
              aria-label={`Shopping bag, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
              className="relative flex items-center gap-2 rounded-md py-2 text-[14px] font-medium text-[#1C1024] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2711D]/40"
            >
              <Bag className="h-5 w-5" />
              Bag
              {cartCount > 0 && (
                <span className="absolute -right-3 -top-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#B8232F] px-1 text-[10px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}