"use client";

import React, { useState, useMemo } from "react";
import {
    ProductCard
} from "@/components/store/ProductCard";
import {
    QuickViewModal
} from "@/components/store/QuickViewModal";
import {
    FAKE_PRODUCTS,
    StoreProduct
} from "@/data/fakeProducts";
import {
    FiFilter,
    FiStar,
    FiCheck,
    FiPackage,
    FiAward,
    FiHeadphones,
    FiTruck,
    FiLayers,
    FiShoppingBag,
    FiChevronDown,
    FiChevronUp,
    FiSliders
} from "react-icons/fi";
import { useProducts } from "@/hooks/useProducts";

const CATEGORIES = [
    "Tous",
    "Jeux Éducatifs",
    "Mobilier & Rangement",
    "Arts & Créativité",
    "Éveil & Motricité",
    "Livres & Musique",
] as const;


import { useRouter } from "next/navigation";


export default function StorePage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
    const [sortBy, setSortBy] = useState<"popular" | "price-asc" | "price-desc" | "rating" | "discount">("popular");
    const [onlyInStock, setOnlyInStock] = useState(false);
    const [activeBadgeFilter, setActiveBadgeFilter] = useState<string>("Tous");
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    // Modal & Cart & Wishlist state
    const [quickViewProduct, setQuickViewProduct] = useState<StoreProduct | null>(null);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const [cartItems, setCartItems] = useState<{ product: StoreProduct; quantity: number }[]>([]);
    const [wishlistIds, setWishlistIds] = useState<number[]>([]);
    const [toast, setToast] = useState<{ message: string; visible: boolean } | null>(null);

    // Cart operations
    const handleAddToCart = (product: StoreProduct, quantity: number = 1) => {
        setCartItems((prev) => {
            const existing = prev.find((item) => item.product.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { product, quantity }];
        });

        // Show toast
        setToast({
            message: `"${product.name.slice(0, 28)}..." (${quantity}x) ajouté au panier !`,
            visible: true,
        });
        setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    const handleToggleWishlist = (product: StoreProduct) => {
        setWishlistIds((prev) => {
            const exists = prev.includes(product.id);
            if (exists) {
                return prev.filter((id) => id !== product.id);
            } else {
                return [...prev, product.id];
            }
        });
    };

    const handleOpenQuickView = (product: StoreProduct) => {
        // console.log(product.id)
        router.push(`/store/${product.id}`);
    };

    const handleCloseQuickView = () => {
        setIsQuickViewOpen(false);
    };

    const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    // Filter and sort products
    const filteredProducts1 = useMemo(() => {
        return FAKE_PRODUCTS.filter((p) => {
            // Search filter
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const matchesName = (p.name || "").toLowerCase().includes(query);
                const matchesDesc = (p.description || "").toLowerCase().includes(query);
                const matchesCategory = (p.category || "").toLowerCase().includes(query);
                const matchesSku = (p.sku || "").toLowerCase().includes(query);
                if (!matchesName && !matchesDesc && !matchesCategory && !matchesSku) {
                    return false;
                }
            }

            // Category filter
            if (selectedCategory !== "Tous" && p.category !== selectedCategory) {
                return false;
            }

            // Stock filter
            if (onlyInStock && (p.quantity ?? 0) <= 0) {
                return false;
            }

            // Badge filter
            if (activeBadgeFilter === "Promo" && !p.discountedPrice) {
                return false;
            }
            if (activeBadgeFilter === "Nouveautés" && p.badge !== "Nouveau") {
                return false;
            }
            if (activeBadgeFilter === "Bestsellers" && p.badge !== "Bestseller") {
                return false;
            }

            return true;
        }).sort((a, b) => {
            const priceA = Number(a.discountedPrice ?? a.sellingPrice ?? 0);
            const priceB = Number(b.discountedPrice ?? b.sellingPrice ?? 0);

            if (sortBy === "price-asc") return priceA - priceB;
            if (sortBy === "price-desc") return priceB - priceA;
            if (sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
            if (sortBy === "discount") {
                const aSell = Number(a.sellingPrice || 0);
                const aDisc = a.discountedPrice ? Number(a.discountedPrice) : aSell;
                const bSell = Number(b.sellingPrice || 0);
                const bDisc = b.discountedPrice ? Number(b.discountedPrice) : bSell;
                const discA = aSell - aDisc;
                const discB = bSell - bDisc;
                return discB - discA;
            }
            // default: popular (reviewsCount)
            return (b.reviewsCount ?? 0) - (a.reviewsCount ?? 0);
        });
    }, [searchQuery, selectedCategory, sortBy, onlyInStock, activeBadgeFilter]);

    const state = useProducts<StoreProduct>();
    const filteredProducts = [
        ...state.filteredData,
        // ...filteredProducts1,
    ];
    return (
        <div className="min-h-screen flex flex-col bg-zinc-50/70 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100">
            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
                {/* Product Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={(prod, qty) => handleAddToCart(prod, qty)}
                                onQuickView={(prod) => handleOpenQuickView(prod)}
                                onToggleWishlist={(prod) => handleToggleWishlist(prod)}
                                isWishlisted={wishlistIds.includes(product.id)}
                            />
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-500 flex items-center justify-center mb-4">
                            <FiShoppingBag className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                            Aucun produit trouvé
                        </h3>
                        <p className="text-sm text-zinc-500 max-w-sm mb-5">
                            Essayez de modifier votre recherche ou de réinitialiser vos filtres de sélection.
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedCategory("Tous");
                                setActiveBadgeFilter("Tous");
                                setOnlyInStock(false);
                            }}
                            className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-colors"
                        >
                            Réinitialiser tous les filtres
                        </button>
                    </div>
                )}
            </main>

            {/* Toast Notification */}
            {toast && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-5 py-3.5 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                        <FiCheck className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-xs font-semibold">{toast.message}</span>
                </div>
            )}
        </div>
    );
}