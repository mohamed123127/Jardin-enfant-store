"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  FiHeart,
  FiShoppingCart,
  FiCheck,
  FiCheckCircle
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { StoreProduct } from "@/data/fakeProducts";

export interface ProductCardProps {
  product: StoreProduct | any;
  onQuickView?: (product: StoreProduct) => void;
  onAddToCart?: (product: StoreProduct, quantity?: number) => void;
  onToggleWishlist?: (product: StoreProduct) => void;
  isWishlisted?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
}) => {
  const [isLiked, setIsLiked] = useState(isWishlisted);
  const [isAdded, setIsAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Price calculations & fallbacks
  const rawCurrentPrice = product.discountedPrice ?? product.sellingPrice ?? product.price ?? 0;
  const rawOriginalPrice = product.discountedPrice ? (product.sellingPrice ?? product.price) : null;
  const currentPrice = typeof rawCurrentPrice === "string" ? parseFloat(rawCurrentPrice) : Number(rawCurrentPrice || 0);
  const originalPrice = rawOriginalPrice ? (typeof rawOriginalPrice === "string" ? parseFloat(rawOriginalPrice) : Number(rawOriginalPrice)) : null;
  const discountPercent = originalPrice && originalPrice > currentPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : null;

  const stockQuantity = product.quantity ?? 0;
  const isOutOfStock = stockQuantity <= 0;

  const imageSrc = imageError || !product.previewImage
    ? "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80"
    : product.previewImage;

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    if (onToggleWishlist) {
      onToggleWishlist(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;

    setIsAdded(true);
    if (onAddToCart) {
      onAddToCart(product, 1);
    }
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  const handleClickProduct = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  useEffect(() => {
    product.ageGroup = "1 - 6 ans"
  }, [product])

  return (
    <div className="group relative flex flex-col transition-all duration-300">
      {/* Maximum Size Image Container without surrounding border/padding */}
      <div
        onClick={handleClickProduct}
        className="relative w-full aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-800/80 cursor-pointer flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow"
      >
        <Image
          src={imageSrc}
          alt={product.name || "Produit Jardin d'Enfants"}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={() => setImageError(true)}
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 flex flex-col gap-1.5 z-10">
          {discountPercent && (
            <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-rose-500 text-white shadow-sm shadow-rose-500/30 animate-pulse">
              -{discountPercent}%
            </span>
          )}
          {product.badge && product.badge !== "Promo" && (
            <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold shadow-sm backdrop-blur-md ${product.badge === "Bestseller"
              ? "bg-amber-500/90 text-white shadow-amber-500/20"
              : product.badge === "Coup de Cœur"
                ? "bg-purple-600/90 text-white shadow-purple-500/20"
                : "bg-emerald-600/90 text-white shadow-emerald-500/20"
              }`}>
              {product.badge}
            </span>
          )}
        </div>


      </div>

      {/* Content Section below image */}
      <div className="flex flex-col flex-1 mt-2.5 sm:mt-3 px-0.5 sm:px-1">
        {/* Category & Age Tag */}
        <div className="flex items-center justify-between gap-1.5 text-[10px] sm:text-[11px] font-semibold text-amber-600 dark:text-amber-400 mb-1">
          <span className="uppercase tracking-wider truncate">
            {product.category || "Jardin d'Enfants"}
          </span>
          {product.ageGroup && (
            <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[9px] sm:text-[10px] font-semibold shrink-0">
              {product.ageGroup}
            </span>
          )}
        </div>
        <div className="flex justify-between mt-4">
          <div>
            {/* Product Title */}
            <h3
              onClick={handleClickProduct}
              title={product.name}
              className="mb-1 text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-100 line-clamp-2 leading-snug hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer transition-colors duration-150"
            >
              {product.name}
            </h3>

            {/* Stock Status Bar */}
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium mb-2.5">
              {isOutOfStock ? (
                <span className="flex items-center gap-1 text-rose-500 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  Rupture de stock
                </span>
              ) : (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <FiCheckCircle className="w-3 h-3 text-emerald-500" />
                  {stockQuantity} En stock
                </span>
              )}
            </div>
          </div>

          {/* Price & Add to Cart Row */}
          <div className="border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-1.5">
            {originalPrice && (
              <span className="text-[10px] sm:text-[11px] text-zinc-400 line-through leading-none">
                {originalPrice.toLocaleString("fr-FR")} DA
              </span>
            )}
            <span className="text-xs sm:text-base font-extrabold text-zinc-900 dark:text-white leading-tight flex items-baseline gap-0.5 sm:gap-1">
              {currentPrice.toLocaleString("fr-FR")}{" "}
              <span className="text-[10px] sm:text-xs font-bold text-amber-600 dark:text-amber-400">DA</span>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
