"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiTrash2,
  FiCheckCircle,
  FiArrowLeft,
  FiArrowRight,
  FiShoppingCart,
  FiHeart,
  FiAlertTriangle,
  FiAlertCircle,
  FiRefreshCw
} from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { FAKE_PRODUCTS } from "@/data/fakeProducts";
import { useTranslations } from "next-intl";
import { checkCartStock, StockItemStatus } from "@/lib/checkStock";

export const CartView: React.FC = () => {
  const t = useTranslations("cart");
  const router = useRouter();
  const {
    cartItems,
    removeItem,
    updateQuantity,
    cartCount,
    subtotal,
    shippingFee,
    totalPrice,
    addItem,
  } = useCart();

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isCheckingStock, setIsCheckingStock] = useState(false);
  const [stockStatuses, setStockStatuses] = useState<Record<string, StockItemStatus>>({});
  const [stockErrors, setStockErrors] = useState<StockItemStatus[]>([]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Check stock on load or when cart items change
  const verifyStock = useCallback(async () => {
    if (cartItems.length === 0) {
      setStockStatuses({});
      setStockErrors([]);
      return;
    }
    try {
      const result = await checkCartStock(cartItems);
      setStockStatuses(result.itemStatuses);
      setStockErrors(result.unavailableItems);
    } catch (err) {
      console.warn("Stock verification error:", err);
    }
  }, [cartItems]);

  useEffect(() => {
    verifyStock();
  }, [verifyStock]);

  // Handle Checkout Click
  const handleProceedToCheckout = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsCheckingStock(true);
    try {
      const result = await checkCartStock(cartItems);
      setStockStatuses(result.itemStatuses);
      setStockErrors(result.unavailableItems);

      if (!result.isValid) {
        setIsCheckingStock(false);
        const firstError = result.errors[0] || "Certains articles de votre panier ne sont plus disponibles.";
        showToast(firstError, "error");
        return;
      }

      // If all valid, navigate to checkout
      router.push("/checkout");
    } catch (err) {
      console.error("Error during checkout stock check:", err);
      // Fallback navigation if network issue
      router.push("/checkout");
    } finally {
      setIsCheckingStock(false);
    }
  };

  // Auto-adjust quantities to available stock
  const handleFixQuantities = () => {
    stockErrors.forEach((itemStatus) => {
      if (itemStatus.availableStock <= 0) {
        removeItem(itemStatus.itemId);
      } else {
        updateQuantity(itemStatus.itemId, itemStatus.availableStock);
      }
    });
    setStockErrors([]);
    showToast("Votre panier a été mis à jour selon le stock disponible.", "success");
  };

  const recommendedProducts = FAKE_PRODUCTS.filter(
    (p) => !cartItems.some((ci) => ci.productId === p.id)
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans pb-16 selection:bg-orange-500 selection:text-white">

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm font-bold animate-in slide-in-from-bottom-3 duration-200 ${
            toast.type === "error"
              ? "bg-rose-600 text-white border border-rose-500 shadow-rose-500/20"
              : "bg-zinc-900 text-white border border-zinc-800"
          }`}
        >
          {toast.type === "error" ? (
            <FiAlertTriangle className="w-5 h-5 text-amber-300 shrink-0" />
          ) : (
            <FiCheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-zinc-400 dark:text-zinc-500 mb-6">
          <Link href="/store" className="hover:text-orange-500 transition-colors">{t("breadcrumbHome")}</Link>
          <span>/</span>
          <span className="text-zinc-900 dark:text-white font-bold">{t("breadcrumbCart")}</span>
        </nav>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
            {t("title")}
          </h1>
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mt-1">
            {t("itemsCount", { count: cartCount, plural: cartCount > 1 ? "s" : "" })}
          </p>
        </div>

        {/* Stock Alert Banner if items are unavailable */}
        {stockErrors.length > 0 && (
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                <FiAlertTriangle className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-extrabold text-rose-900 dark:text-rose-200">
                  Stock insuffisant ou épuisé
                </h3>
                <p className="text-xs text-rose-700 dark:text-rose-300 mt-1 leading-relaxed">
                  Certains articles dans votre panier ne sont plus disponibles dans la quantité demandée. Veuillez ajuster les quantités avant de passer la commande.
                </p>
                <div className="mt-2.5 space-y-1">
                  {stockErrors.map((err, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs font-semibold text-rose-800 dark:text-rose-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span>{err.errorMessage}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-rose-200/60 dark:border-rose-900/40 flex justify-end">
              <button
                onClick={handleFixQuantities}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <FiRefreshCw className="w-3.5 h-3.5" />
                <span>Ajuster automatiquement le panier</span>
              </button>
            </div>
          </div>
        )}

        {cartItems.length === 0 ? (
          /* ─── Empty Cart ─── */
          <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-4 max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-500 flex items-center justify-center mx-auto text-3xl">
              🛒
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{t("empty")}</h2>
            <p className="text-xs text-zinc-500 leading-relaxed">
              {t("emptySub")}
            </p>
            <Link
              href="/store"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all"
            >
              <FiArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>{t("discoverStore")}</span>
            </Link>
          </div>

        ) : (
          /* ─── Main Cart Layout ─── */
          <div className="space-y-6">

            {/* Items List */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {cartItems.map((item) => {
                  const currentPrice = item.unitPrice;
                  const originalPrice = item.originalPrice;
                  const discountPercent = item.discountPercent;

                  return (
                    <div
                      key={item.id}
                      className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                    >
                      {/* Image + Info */}
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-100 dark:border-zinc-800">
                          <Image
                            src={item.product.previewImage || "/products/affnane-1.jpg"}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </div>

                        <div className="space-y-1 min-w-0">
                          <h3 className="font-bold text-base sm:text-lg text-zinc-900 dark:text-white truncate">
                            {item.product.name}
                          </h3>
                          <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                            {t("color")} <span className="text-zinc-600 dark:text-zinc-300">{item.selectedColor}</span>
                            {"  "}|{"  "}
                            {t("size")} <span className="text-zinc-600 dark:text-zinc-300">{item.selectedSize}</span>
                          </p>
                          
                          {/* Real-time Backend Stock Status */}
                          {stockStatuses[item.id] ? (
                            stockStatuses[item.id].availableStock <= 0 ? (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-extrabold border border-rose-200/60 dark:border-rose-900/50 animate-pulse">
                                <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>Rupture de stock</span>
                              </div>
                            ) : item.quantity > stockStatuses[item.id].availableStock ? (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-200/60 dark:border-amber-900/50">
                                <FiAlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                <span>Seulement {stockStatuses[item.id].availableStock} en stock (demandé: {item.quantity})</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                                <FiCheckCircle className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5]" />
                                <span>{t("inStock")} ({stockStatuses[item.id].availableStock} disponibles)</span>
                              </div>
                            )
                          ) : (
                            <div className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                              <FiCheckCircle className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5]" />
                              <span>{t("inStock")}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quantity + Price + Remove */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">

                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 px-2 py-1 shadow-sm shrink-0">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label={t("decrease")}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 font-bold transition-colors cursor-pointer"
                          >
                            −
                          </button>
                          <span className={`w-8 text-center font-bold text-sm ${
                            stockStatuses[item.id] && (stockStatuses[item.id].availableStock <= 0 || item.quantity > stockStatuses[item.id].availableStock)
                              ? "text-rose-600 font-black"
                              : "text-zinc-900 dark:text-white"
                          }`}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => {
                              const maxStock = stockStatuses[item.id]?.availableStock;
                              if (maxStock !== undefined && item.quantity >= maxStock) {
                                showToast(`Stock maximum disponible atteint (${maxStock} pièces).`, "error");
                                return;
                              }
                              updateQuantity(item.id, item.quantity + 1);
                            }}
                            aria-label={t("increase")}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 font-bold transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right min-w-[100px]">
                          {originalPrice && originalPrice > currentPrice && (
                            <div className="flex items-center justify-end gap-1.5 mb-0.5">
                              <span className="text-xs font-bold text-zinc-400 line-through">
                                {(originalPrice * item.quantity).toLocaleString("fr-DZ")} DA
                              </span>
                              {discountPercent && (
                                <span className="px-1.5 py-0.5 rounded-md bg-rose-500 text-white font-extrabold text-[10px]">
                                  -{discountPercent}%
                                </span>
                              )}
                            </div>
                          )}
                          <div className="text-lg sm:text-xl font-black text-orange-500 tracking-tight">
                            {(currentPrice * item.quantity).toLocaleString("fr-DZ")} <span className="text-xs">DA</span>
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-[10px] text-zinc-400 mt-0.5">
                              {t("unitPrice", { price: currentPrice.toLocaleString("fr-DZ") })}
                            </div>
                          )}
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.id)}
                          aria-label={t("removeAria")}
                          className="w-9 h-9 rounded-xl text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Actions */}
              <div className="p-4 sm:p-6 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <Link
                    href="/store"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <FiArrowLeft className="w-4 h-4 rtl:rotate-180" />
                    <span>{t("continueShopping")}</span>
                  </Link>

                  <button
                    onClick={handleProceedToCheckout}
                    disabled={isCheckingStock}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:opacity-95 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-3 shadow-lg shadow-orange-500/25 transition-all cursor-pointer active:scale-98 disabled:opacity-60"
                  >
                    {isCheckingStock ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                        <span>Vérification du stock...</span>
                      </>
                    ) : (
                      <>
                        <FiShoppingCart className="w-5 h-5" />
                        <span>{t("checkout")}</span>
                        <FiArrowRight className="w-5 h-5 stroke-[2.5] rtl:rotate-180" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommended Products */}
        {/* {recommendedProducts.length > 0 && (
          <div className="mt-12 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                Vous aimerez aussi
              </h2>
              <Link
                href="/store"
                className="text-xs sm:text-sm font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1 transition-colors"
              >
                <span>Voir tout</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {recommendedProducts.map((p) => {
                const price = typeof p.sellingPrice === "number" ? p.sellingPrice : parseFloat(p.sellingPrice || "0");
                return (
                  <div
                    key={p.id}
                    className="group bg-white dark:bg-zinc-900 rounded-3xl p-3 sm:p-4 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 mb-3">
                      <Image
                        src={p.previewImage || "/products/affnane-1.jpg"}
                        alt={p.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        aria-label="Wishlist"
                        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-sm flex items-center justify-center text-zinc-500 hover:text-rose-500 transition-colors"
                      >
                        <FiHeart className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-1 mb-3">
                      <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white truncate">
                        {p.name}
                      </h3>
                      <div className="font-black text-sm sm:text-base text-zinc-900 dark:text-white">
                        {price.toLocaleString("fr-DZ")} <span className="text-xs text-orange-500">DA</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        addItem(p, 1);
                        showToast(`"${p.name}" ajouté au panier !`);
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-orange-500/20 transition-all cursor-pointer active:scale-95"
                    >
                      <FiShoppingCart className="w-4 h-4" />
                      <span>Ajouter</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )} */}

      </div>
    </div>
  );
};
