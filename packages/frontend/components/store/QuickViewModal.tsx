"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  FiX, 
  FiShoppingCart, 
  FiCheck, 
  FiShield, 
  FiTruck, 
  FiHeart, 
  FiStar,
  FiMinus,
  FiPlus,
  FiAward
} from "react-icons/fi";
import { FaHeart, FaStar } from "react-icons/fa";
import { StoreProduct } from "@/data/fakeProducts";

interface QuickViewModalProps {
  product: StoreProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: StoreProduct, quantity: number) => void;
  onToggleWishlist?: (product: StoreProduct) => void;
  isWishlisted?: boolean;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isLiked, setIsLiked] = useState(isWishlisted);

  if (!isOpen || !product) return null;

  const rawCurrentPrice = product.discountedPrice ?? product.sellingPrice ?? 0;
  const rawOriginalPrice = product.discountedPrice ? product.sellingPrice : null;
  const currentPrice = typeof rawCurrentPrice === "string" ? parseFloat(rawCurrentPrice) : Number(rawCurrentPrice || 0);
  const originalPrice = rawOriginalPrice ? (typeof rawOriginalPrice === "string" ? parseFloat(rawOriginalPrice) : Number(rawOriginalPrice)) : null;
  const discountPercent = originalPrice && originalPrice > currentPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : null;

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.previewImage];

  const handleAddToCart = () => {
    setIsAdded(true);
    if (onAddToCart) {
      onAddToCart(product, quantity);
    }
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (onToggleWishlist) {
      onToggleWishlist(product);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
      />

      {/* Modal Dialog */}
      <div className="relative bg-white dark:bg-zinc-900 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden z-10 border border-zinc-100 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center transition-colors"
        >
          <FiX className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image & Gallery Column */}
          <div className="p-6 sm:p-8 bg-gradient-to-br from-amber-50/40 via-orange-50/20 to-transparent dark:from-zinc-800/50 flex flex-col justify-between">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white dark:bg-zinc-800 shadow-inner">
              <Image
                src={images[selectedImageIndex] || product.previewImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              {discountPercent && (
                <div className="absolute top-3 left-3 bg-rose-500 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-md">
                  -{discountPercent}%
                </div>
              )}
            </div>

            {/* Thumbnails if multiple images */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImageIndex === idx
                        ? "border-amber-500 ring-2 ring-amber-500/20"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`vue ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Quality assurance tags */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-amber-100/60 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <FiShield className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Sécurité Certifiée CE</span>
              </div>
              <div className="flex items-center gap-2">
                <FiTruck className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Livraison 58 Wilayas</span>
              </div>
            </div>
          </div>

          {/* Details Column */}
          <div className="p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh] md:max-h-[600px]">
            <div>
              {/* Category & Badge */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  {product.category}
                </span>
                {product.ageGroup && (
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 text-xs font-semibold">
                    {product.ageGroup}
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white leading-tight mb-3">
                {product.name}
              </h2>

              {/* Ratings */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                  {product.rating || "4.9"}
                </span>
                <span className="text-xs text-zinc-400">
                  ({product.reviewsCount || 24} avis vérifiés)
                </span>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  En stock ({product.quantity || 15} unités)
                </span>
              </div>

              {/* Price section */}
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-zinc-800/60 mb-5 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
                  {currentPrice.toLocaleString("fr-FR")}{" "}
                  <span className="text-sm font-bold text-amber-600">DA</span>
                </span>
                {originalPrice && (
                  <span className="text-sm text-zinc-400 line-through">
                    {originalPrice.toLocaleString("fr-FR")} DA
                  </span>
                )}
                {discountPercent && (
                  <span className="ml-auto text-xs font-bold text-rose-600 bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 px-2 py-1 rounded-lg">
                    Économisez {(originalPrice! - currentPrice).toLocaleString("fr-FR")} DA
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mb-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Description pédagogique
                </h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Key Features */}
              {product.features && product.features.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Points forts & Avantages
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <FiAward className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Actions & Quantity */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 p-1 w-full sm:w-auto justify-between">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors"
                >
                  <FiMinus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-zinc-800 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.quantity || 10, quantity + 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors"
                >
                  <FiPlus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 w-full py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                  isAdded
                    ? "bg-emerald-600 text-white shadow-emerald-500/30"
                    : "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25 hover:scale-[1.02] active:scale-98"
                }`}
              >
                {isAdded ? (
                  <>
                    <FiCheck className="w-5 h-5 stroke-[3]" />
                    <span>Ajouté au panier !</span>
                  </>
                ) : (
                  <>
                    <FiShoppingCart className="w-5 h-5" />
                    <span>Ajouter au panier ({((currentPrice) * quantity).toLocaleString("fr-FR")} DA)</span>
                  </>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={handleLike}
                className="w-12 h-12 rounded-2xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-rose-500 hover:border-rose-300 dark:hover:border-rose-900 transition-all shrink-0"
              >
                {isLiked ? (
                  <FaHeart className="w-5 h-5 text-rose-500 fill-current" />
                ) : (
                  <FiHeart className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
