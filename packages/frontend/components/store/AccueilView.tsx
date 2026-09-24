"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiShoppingBag,
  FiArrowRight,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiHeadphones,
  FiCheck,
} from "react-icons/fi";
import { useProducts } from "@/hooks/useProducts";
import { StoreProduct } from "@/data/fakeProducts";
import { ProductCard } from "./ProductCard";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

// --- Trust Badges ---
const TRUST_BADGES = [
  {
    icon: FiTruck,
    title: "Livraison 69 Wilayas",
    subtitle: "Partout en Algérie",
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950/30",
  },
  {
    icon: FiShield,
    title: "Produits de qualité",
    subtitle: "Sélectionnés avec soin",
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    icon: FiRefreshCw,
    title: "Échange facile",
    subtitle: "Sous conditions",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: FiHeadphones,
    title: "Service client",
    subtitle: "À votre écoute",
    color: "text-rose-500",
    bg: "bg-rose-50 dark:bg-rose-950/30",
  },
];

// --- Hero Section ---
function HeroSection() {
  return (
    <section className="w-full relative overflow-hidden bg-amber-950/10 dark:bg-zinc-900 group">
      <Link href="/store" className="block relative w-full aspect-[2.4/1] sm:aspect-[2.6/1] md:aspect-[2.7/1] lg:aspect-[2.8/1] min-h-[220px] sm:min-h-[320px]">
        <Image
          src="/images/hero-banner.png"
          alt="Nouvelle Collection Automne - Jardin d'Enfants"
          fill
          className="object-cover object-center group-hover:scale-[1.005] transition-transform duration-300"
          priority
        />
        {/* Overlay Interactive CTA Button */}
        <div className="absolute left-[6%] sm:left-[7.5%] lg:left-[8.5%] bottom-[12%] sm:bottom-[16%] lg:bottom-[20%] z-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-7 sm:py-3.5 rounded-full bg-[#963E10] hover:bg-[#7d330c] text-white font-bold text-[11px] sm:text-sm md:text-base shadow-lg shadow-amber-900/40 group-hover:scale-105 active:scale-95 transition-all duration-200">
            Découvrir la collection
            <FiArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </span>
        </div>
      </Link>
    </section>
  );
}

// --- Trust Badges Section ---
function TrustBadgesSection() {
  return (
    <section className="py-5 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {TRUST_BADGES.map((badge, i) => {
          const Icon = badge.icon;
          return (
            <div
              key={i}
              className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div
                className={`w-10 h-10 rounded-xl ${badge.bg} flex items-center justify-center shrink-0`}
              >
                <Icon className={`w-5 h-5 ${badge.color}`} />
              </div>
              <div>
                <div className="text-xs font-black text-zinc-900 dark:text-white leading-tight">
                  {badge.title}
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">{badge.subtitle}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// --- Nouveautés Section ---
function NouveautesSection() {
  const { filteredData: products, isLoading } = useProducts<StoreProduct>();
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [toast, setToast] = useState<{ message: string } | null>(null);
  const router = useRouter();
  const { addItem } = useCart();

  const newProducts = products.filter((p) => p.badge === "Nouveau");
  const others = products.filter((p) => p.badge !== "Nouveau");
  const featured = [...newProducts, ...others].slice(0, 8);

  const handleAddToCart = (product: StoreProduct, qty: number = 1) => {
    addItem(product as any, qty);
    setToast({ message: `"${product.name.slice(0, 28)}" ajouté au panier !` });
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleWishlist = (product: StoreProduct) => {
    setWishlistIds((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  };

  const handleQuickView = (product: StoreProduct) => {
    router.push(`/store/${product.id}`);
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
            Nouveautés
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Découvrez nos derniers modèles pour vos enfants
          </p>
        </div>
        <Link
          href="/store"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border-2 border-amber-500 text-amber-600 dark:text-amber-400 font-bold text-sm hover:bg-amber-500 hover:text-white transition-all duration-200"
        >
          Voir tout <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] rounded-2xl bg-zinc-200 dark:bg-zinc-800 mb-3" />
              <div className="h-3 rounded-full bg-zinc-200 dark:bg-zinc-800 mb-2 w-3/4" />
              <div className="h-3 rounded-full bg-zinc-200 dark:bg-zinc-800 w-1/2" />
            </div>
          ))}
        </div>
      ) : featured.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onQuickView={handleQuickView}
              onToggleWishlist={handleToggleWishlist}
              isWishlisted={wishlistIds.includes(product.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-zinc-500">
          <FiShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="font-medium">Produits en cours de chargement...</p>
        </div>
      )}

      {/* Mobile: View All */}
      <div className="mt-8 text-center sm:hidden">
        <Link
          href="/store"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md shadow-amber-500/20 transition-colors"
        >
          Voir tous les produits <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-5 py-3.5 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
            <FiCheck className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}
    </section>
  );
}

// --- Promo Banner ---
function PromoBanner() {
  return (
    <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-8 sm:p-10">
        <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/10" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-white/5" />
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-white/80 text-sm font-semibold mb-1">
              Offre spéciale — Durée limitée
            </p>
            <h3 className="text-white text-2xl sm:text-3xl font-black leading-tight">
              🎒 -30% sur tout le mobilier
              <br className="hidden sm:block" /> &amp; équipement pédagogique
            </h3>
          </div>
          <Link
            href="/store"
            className="shrink-0 inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-white text-amber-600 font-black text-sm hover:bg-amber-50 hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            Profiter de l&apos;offre <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// --- Bestsellers Section ---
function BestsellersSection() {
  const { filteredData: products, isLoading } = useProducts<StoreProduct>();
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [toast, setToast] = useState<{ message: string } | null>(null);
  const router = useRouter();
  const { addItem } = useCart();

  const bestsellers = products.filter((p) => p.badge === "Bestseller");
  const fallback = products.slice(8, 12);
  const featured = (bestsellers.length >= 4 ? bestsellers : [...bestsellers, ...fallback]).slice(
    0,
    4
  );

  const handleAddToCart = (product: StoreProduct, qty: number = 1) => {
    addItem(product as any, qty);
    setToast({ message: `"${product.name.slice(0, 28)}" ajouté au panier !` });
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleWishlist = (product: StoreProduct) => {
    setWishlistIds((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  };

  const handleQuickView = (product: StoreProduct) => {
    router.push(`/store/${product.id}`);
  };

  if (!isLoading && featured.length === 0) return null;

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
            ⭐ Bestsellers
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Les produits les plus appréciés de nos clients
          </p>
        </div>
        <Link
          href="/store"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border-2 border-amber-500 text-amber-600 dark:text-amber-400 font-bold text-sm hover:bg-amber-500 hover:text-white transition-all duration-200"
        >
          Voir tout <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] rounded-2xl bg-zinc-200 dark:bg-zinc-800 mb-3" />
              <div className="h-3 rounded-full bg-zinc-200 dark:bg-zinc-800 mb-2 w-3/4" />
              <div className="h-3 rounded-full bg-zinc-200 dark:bg-zinc-800 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onQuickView={handleQuickView}
              onToggleWishlist={handleToggleWishlist}
              isWishlisted={wishlistIds.includes(product.id)}
            />
          ))}
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-5 py-3.5 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
            <FiCheck className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}
    </section>
  );
}

// --- Promotions Section ---
function PromotionsSection() {
  const { filteredData: products, isLoading } = useProducts<StoreProduct>();
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [toast, setToast] = useState<{ message: string } | null>(null);
  const router = useRouter();
  const { addItem } = useCart();

  const promos = products.filter((p) => p.discountedPrice || p.badge === "Promo");
  const fallback = products.slice(4, 8);
  const featured = (promos.length >= 4 ? promos : [...promos, ...fallback]).slice(0, 4);

  const handleAddToCart = (product: StoreProduct, qty: number = 1) => {
    addItem(product as any, qty);
    setToast({ message: `"${product.name.slice(0, 28)}" ajouté au panier !` });
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleWishlist = (product: StoreProduct) => {
    setWishlistIds((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  };

  const handleQuickView = (product: StoreProduct) => {
    router.push(`/store/${product.id}`);
  };

  if (!isLoading && featured.length === 0) return null;

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
            🔥 Offres & Promotions
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Profitez de nos meilleures réductions sur une sélection d'articles
          </p>
        </div>
        <Link
          href="/store"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border-2 border-amber-500 text-amber-600 dark:text-amber-400 font-bold text-sm hover:bg-amber-500 hover:text-white transition-all duration-200"
        >
          Voir tout <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] rounded-2xl bg-zinc-200 dark:bg-zinc-800 mb-3" />
              <div className="h-3 rounded-full bg-zinc-200 dark:bg-zinc-800 mb-2 w-3/4" />
              <div className="h-3 rounded-full bg-zinc-200 dark:bg-zinc-800 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onQuickView={handleQuickView}
              onToggleWishlist={handleToggleWishlist}
              isWishlisted={wishlistIds.includes(product.id)}
            />
          ))}
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-5 py-3.5 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
            <FiCheck className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}
    </section>
  );
}

// --- Main Export ---
export default function AccueilView() {
  return (
    <main className="pb-12 bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      <HeroSection />
      <TrustBadgesSection />
      {/* <NouveautesSection /> */}
      {/* <PromoBanner /> */}
      <PromotionsSection />
      {/* <BestsellersSection /> */}
    </main>
  );
}
