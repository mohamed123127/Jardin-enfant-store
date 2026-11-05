"use client";

import React, { useState, useEffect } from "react";
import { ProductCard } from "@/components/store/ProductCard";
import { Pagination } from "@/components/store/Pagination";
import { StoreProduct } from "@/data/fakeProducts";
import { PaginationMetaData } from "@aio/shared";
import {
    FiCheck,
    FiShoppingBag,
} from "react-icons/fi";
import { useProducts } from "@/hooks/useProducts";
import { useRouter } from "next/navigation";

interface StoreClientViewProps {
    /** Products pre-fetched by the server component (ISR cache). Used as the
     *  initial display while React Query loads fresh data in the background. */
    initialProducts: StoreProduct[];
    initialMeta?: PaginationMetaData;
    initialPage?: number;
    initialLimit?: number;
}

export function StoreClientView({
    initialProducts,
    initialMeta = null,
    initialPage = 1,
    initialLimit = 12,
}: StoreClientViewProps) {
    const router = useRouter();

    const [page, setPage] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);

    useEffect(() => {
        setPage(initialPage);
    }, [initialPage]);

    useEffect(() => {
        setLimit(initialLimit);
    }, [initialLimit]);

    // Modal & Cart & Wishlist state
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
        router.push(`/store/${product.id}`);
    };

    // React Query fetch with current page and limit
    const { filteredData, meta, isLoading } = useProducts<StoreProduct>(undefined, {
        page,
        limit,
    });

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        router.push(`/store?page=${newPage}&limit=${limit}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit);
        setPage(1);
        router.push(`/store?page=1&limit=${newLimit}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Show live data when available, fall back to server initial data while loading page 1
    const products: StoreProduct[] = filteredData.length > 0
        ? filteredData
        : (isLoading && page === 1 ? initialProducts : filteredData);

    const activeMeta = meta ?? initialMeta;
    const totalPages = activeMeta?.totalPages ?? Math.max(1, Math.ceil(products.length / limit));
    const totalItems = activeMeta?.total ?? products.length;

    // Spinner states — derived from products & isLoading
    // isInitialLoading: truly nothing to show yet (no ISR data, no cached data)
    const isInitialLoading = isLoading && products.length === 0;
    // isPageSwitching: changing page while keepPreviousData keeps old products visible
    const isPageSwitching = isLoading && products.length > 0;

    return (
        <div className="min-h-screen flex flex-col bg-zinc-50/70 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100">
            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
                {/* ── Case 1: Full centred spinner (no products at all yet) ── */}
                {isInitialLoading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="relative w-14 h-14">
                            {/* Track ring */}
                            <div className="absolute inset-0 rounded-full border-4 border-amber-100 dark:border-amber-900/30" />
                            {/* Spinning arc */}
                            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-500 animate-spin" />
                        </div>
                        <p className="mt-4 text-sm font-medium text-zinc-400 dark:text-zinc-500 animate-pulse">
                            Chargement des produits…
                        </p>
                    </div>

                /* ── Case 2: Products visible (ISR or keepPreviousData) ── */
                ) : products.length > 0 ? (
                    <>
                        {/* Subtle inline indicator while switching pages */}
                        {isPageSwitching && (
                            <div className="flex justify-center mb-4">
                                <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-medium">
                                    <div className="w-3.5 h-3.5 rounded-full border-2 border-transparent border-t-amber-500 animate-spin" />
                                    Chargement…
                                </div>
                            </div>
                        )}

                        {/* Grid — faded + non-interactive while switching pages */}
                        <div className={`transition-opacity duration-200 ${isPageSwitching ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {products.map((product) => (
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
                        </div>

                        {/* Pagination Bar */}
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            limit={limit}
                            onPageChange={handlePageChange}
                            onLimitChange={handleLimitChange}
                            isLoading={isLoading}
                        />
                    </>
                ) : (
                    /* ── Case 3: Empty state (fetch done, truly no products) ── */
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

