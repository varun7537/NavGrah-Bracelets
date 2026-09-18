"use client";

import { useState } from "react";
import Image from "next/image";
import { Rashi } from "../../data/Rashibracelets";

export interface RashiAvatarProps {
  rashi: Rashi;
  /**
   * Diameter in px, or "fill" to stretch over the parent (parent must be
   * `relative`). "fill" replaces the old `size={9999}` + `!important` hack,
   * which also made next/image request the largest possible srcset image.
   */
  size?: number | "fill";
  /** Adds a soft white ring — useful on tinted/colored backgrounds. (Ignored in "fill" mode.) */
  ring?: boolean;
  className?: string;
}

export default function RashiAvatar({ rashi, size = 32, ring = true, className = "" }: RashiAvatarProps) {
  const [failed, setFailed] = useState(false);
  const isFill = size === "fill";

  const shapeClasses = isFill
    ? "absolute inset-0 h-full w-full"
    : `relative inline-flex shrink-0 rounded-full ${ring ? "ring-1 ring-white" : ""}`;

  // If the rashi photo is missing / 404s, show the zodiac glyph (♈ …) instead of a broken image.
  const glyph = rashi.symbol ?? rashi.name.charAt(0);
  const glyphSize = isFill ? 56 : Math.max(10, Math.round(size * 0.6));

  return (
    <span
      className={`${shapeClasses} overflow-hidden bg-[#f5eee5] ${className}`}
      style={isFill ? undefined : { width: size, height: size }}
    >
      {failed ? (
        <span
          aria-hidden="true"
          className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#f5eee5] to-[#e7d7ba] leading-none text-[#a47735]"
          style={{ fontSize: glyphSize }}
        >
          {glyph}
        </span>
      ) : (
        <Image
          src={rashi.image}
          alt=""
          fill
          sizes={isFill ? "(max-width: 640px) 100vw, 400px" : `${size}px`}
          onError={() => setFailed(true)}
          className="object-cover"
        />
      )}
    </span>
  );
}