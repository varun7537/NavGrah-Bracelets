"use client";

import React, { useState } from "react";
import styles from "../../styles/Braceletscollection.module.css";
import { BraceletProduct, Rashi, discountPercent } from "../../data/Rashibracelets";
import { formatINR } from "../../lib/Currency";
import RashiAvatar from "./RashiAvatar";
import { HeartIcon, StarIcon, GemIcon } from "./icons";

export interface ProductCardProps {
  product: BraceletProduct;
  rashi: Rashi | undefined;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: BraceletProduct) => void;
  onViewDetails: (product: BraceletProduct) => void;
}

export default function ProductCard({
  product,
  rashi,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onViewDetails,
}: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const discount = discountPercent(product);
  const outOfStock = product.availability === "out-of-stock";

  return (
    <div
      className={`${styles.fadeIn} group flex flex-col overflow-hidden rounded-2xl border border-[#e7dfd5] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg`}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#f5eee5]">
        {!imageFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : rashi ? (
          // Fallback: the real rashi photo (softly tinted) rather than a bare glyph.
          <div className="relative h-full w-full">
            <RashiAvatar rashi={rashi} size={9999} ring={false} className="!absolute inset-0 !h-full !w-full rounded-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#211b17]/70 via-[#211b17]/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-0.5 pb-4 text-white">
              <span className="text-xs font-medium tracking-wide">{product.stone}</span>
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#f5eee5] via-[#efe4d3] to-[#e7d7ba] text-[#a47735]">
            <GemIcon className="h-9 w-9" />
            <span className="text-xs font-medium">{product.stone}</span>
          </div>
        )}

        {/* Top-left badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="rounded-full bg-[#211b17] px-2.5 py-1 text-[11px] font-semibold text-white shadow">
              {discount}% OFF
            </span>
          )}
          {product.isNew && (
            <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#8c6327] shadow">
              New
            </span>
          )}
          {product.isBestSeller && (
            <span className="rounded-full bg-[#a47735] px-2.5 py-1 text-[11px] font-semibold text-white shadow">
              Bestseller
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={() => onToggleWishlist(product.id)}
          aria-pressed={isWishlisted}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#a47735] shadow transition hover:scale-105 hover:bg-white"
        >
          <HeartIcon className="h-[18px] w-[18px]" filled={isWishlisted} />
        </button>

        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
            <span className="rounded-full bg-[#241c16] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">
              Out of stock
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-[#a47735]">
          {rashi && <RashiAvatar rashi={rashi} size={16} />}
          <span>{rashi ? `For ${rashi.nameHi} (${rashi.nameEn})` : "All Rashis"}</span>
        </div>

        <h3 className="text-[15px] font-semibold leading-snug text-[#241c16]">{product.name}</h3>

        <p className="text-xs text-[#6d6259]">
          {product.stone} · {product.material}
        </p>

        <p className={`${styles.lineClamp2} text-xs leading-5 text-[#6d6259]`}>{product.description}</p>

        <div className="mt-1 flex items-center gap-1.5">
          <StarRating rating={product.rating} />
          <span className="text-xs text-[#6d6259]">
            {product.rating.toFixed(1)} ({product.reviewCount})
          </span>
        </div>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-lg font-semibold text-[#241c16]">{formatINR(product.price)}</span>
          {discount > 0 && <span className="text-xs text-[#a89d8f] line-through">{formatINR(product.mrp)}</span>}
        </div>

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => onViewDetails(product)}
            className="flex-1 rounded-full border border-[#e7dfd5] px-3 py-2.5 text-xs font-semibold text-[#241c16] transition hover:border-[#a47735] hover:text-[#8c6327]"
          >
            View Details
          </button>
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            disabled={outOfStock}
            className="flex-1 rounded-full bg-[#211b17] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#332822] disabled:cursor-not-allowed disabled:bg-[#c9bba3]"
          >
            {outOfStock ? "Notify Me" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  const pct = Math.max(0, Math.min(1, rating / 5)) * 100;
  return (
    <span className="relative inline-flex" aria-hidden="true">
      <span className="flex gap-0.5 text-[#e7dfd5]">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} className="h-3.5 w-3.5" />
        ))}
      </span>
      <span className="absolute inset-0 flex gap-0.5 overflow-hidden text-[#a47735]" style={{ width: `${pct}%` }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} className="h-3.5 w-3.5 shrink-0" />
        ))}
      </span>
    </span>
  );
}