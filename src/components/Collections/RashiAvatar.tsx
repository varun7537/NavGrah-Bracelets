"use client";

import Image from "next/image";
import { Rashi } from "../../data/Rashibracelets";

export interface RashiAvatarProps {
  rashi: Rashi;
  size?: number;
  /** Adds a soft white ring — useful on tinted/colored backgrounds. */
  ring?: boolean;
  className?: string;
}

export default function RashiAvatar({ rashi, size = 32, ring = true, className = "" }: RashiAvatarProps) {
  return (
    <span
      className={`relative inline-flex shrink-0 overflow-hidden rounded-full bg-[#f5eee5] ${
        ring ? "ring-1 ring-white" : ""
      } ${className}`}
      style={{ width: size, height: size }}
    >
      <Image src={rashi.image} alt="" fill sizes={`${size}px`} className="object-cover" />
    </span>
  );
}