"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  FiPackage,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiEdit2,
  FiCheck,
  FiAlertCircle,
  FiLayers,
  FiTag,
  FiDollarSign,
  FiBarChart2,
  FiRefreshCw,
  FiX,
  FiChevronRight,
  FiInfo,
  FiBox,
  FiMinus,
  FiArrowRight,
} from "react-icons/fi";
import { useInventoryApi, useProductDetail } from "@/hooks/useInventoryApi";
import { getColorHex, COLOR_DICTIONARY } from "@/data/colors";

// Standard preset sizes for fast selection
const PRESET_SIZES = [
  "6-9 mois",
  "9-12 mois",
  "12-18 mois",
  "18-24 mois",
  "1 - 2 ans",
  "2 - 3 ans",
  "3 - 4 ans",
  "4 - 5 ans",
  "5 - 6 ans",
  "7 - 8 ans",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "Unique",
];

// Curated popular color presets for quick selection
const POPULAR_COLORS = [
  "Blanc",
  "Noir",
  "Bleu",
  "Bleu Marine",
  "Bleu Ciel",
  "Rose",
  "Rose Bonbon",
  "Vert",
  "Vert Sauge",
  "Beige",
  "Crème",
  "Lavande",
  "Jaune",
  "Moutarde",
  "Rouge",
  "Bordeaux",
  "Gris",
  "Marron",
];

interface ColorGroup {
  colorName: string;
  colorAttributeValueId?: number;
  totalQuantity: number;
  variants: {
    productVariantId: number;
    sizeName: string;
    sizeAttributeValueId?: number;
    quantity: number;
  }[];
}

export default function AddProductView() {
  const {
    products,
    isLoadingProducts,
    refetchProducts,
    attributes,
    attributeValues,
    createProduct,
    isCreatingProduct,
    addVariant,
    isAddingVariant,
    updateVariantQuantity,
    isUpdatingQuantity,
    deleteVariant,
    isDeletingVariant,
  } = useInventoryApi();

  // Selection & Search State
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [productSearch, setProductSearch] = useState("");

  // Product detail query for selected product
  const {
    data: selectedProductData,
    isLoading: isLoadingDetail,
    refetch: refetchProductDetail,
  } = useProductDetail(selectedProductId);

  // Modals & Forms State
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isAddColorModalOpen, setIsAddColorModalOpen] = useState(false);
  const [activeInlineAddSizeColor, setActiveInlineAddSizeColor] = useState<string | null>(null);
  const [editingVariantId, setEditingVariantId] = useState<number | null>(null);
  const [editQuantityValue, setEditQuantityValue] = useState<number>(0);

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // --- Form States ---
  // 1. Create New Product Form
  const [newProductForm, setNewProductForm] = useState({
    name: "",
    sellingPrice: "",
    costPrice: "",
    discountedPrice: "",
    sku: "",
    ref: "",
    description: "",
    previewImage: "",
  });

  // 2. Add New Color Form
  const [newColorForm, setNewColorForm] = useState({
    colorName: "",
    sizeName: "2 - 3 ans",
    customSizeName: "",
    quantity: 1,
  });

  // 3. Add Size to Existing Color Form
  const [inlineSizeForm, setInlineSizeForm] = useState({
    sizeName: "2 - 3 ans",
    customSizeName: "",
    quantity: 1,
  });

  // Filtered Products for Left Sidebar
  const filteredProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];
    if (!productSearch.trim()) return products;
    const q = productSearch.toLowerCase();
    return products.filter(
      (p: any) =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.barcode && p.barcode.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q))
    );
  }, [products, productSearch]);

  // Selected Product (merged detail + list item)
  const currentProduct = useMemo(() => {
    if (!selectedProductId) return null;
    return (
      selectedProductData ||
      products.find((p: any) => p.id === selectedProductId) ||
      null
    );
  }, [selectedProductId, selectedProductData, products]);

  // Auto-select first product if none selected and list is loaded
  React.useEffect(() => {
    if (!selectedProductId && products && products.length > 0) {
      setSelectedProductId(products[0].id);
    }
  }, [products, selectedProductId]);

  // Group variants by color for the selected product
  const groupedVariants = useMemo<ColorGroup[]>(() => {
    if (!currentProduct || !currentProduct.variants) return [];

    const rawVariants: any[] = currentProduct.variants;
    const colorMap: Record<string, ColorGroup> = {};

    rawVariants.forEach((pv: any) => {
      const specs = pv.specifications || [];

      // Extract color
      const colorSpec = specs.find((s: any) => {
        const attrName = (s.attribute || "").toLowerCase().trim();
        return (
          attrName.includes("couleur") ||
          attrName.includes("color") ||
          attrName.includes("couleurs") ||
          attrName.includes("colors")
        );
      });

      // Extract size
      const sizeSpec = specs.find((s: any) => {
        const attrName = (s.attribute || "").toLowerCase().trim();
        return (
          attrName.includes("taille") ||
          attrName.includes("size") ||
          attrName.includes("tailles") ||
          attrName.includes("sizes")
        );
      });

      const colorName = colorSpec?.value?.trim() || "Couleur Standard";
      const sizeName = sizeSpec?.value?.trim() || (specs.length > 0 && !colorSpec ? specs[0]?.value : "Taille Unique");

      if (!colorMap[colorName]) {
        colorMap[colorName] = {
          colorName,
          totalQuantity: 0,
          variants: [],
        };
      }

      const qty = Number(pv.quantity || 0);
      colorMap[colorName].totalQuantity += qty;
      colorMap[colorName].variants.push({
        productVariantId: pv.id,
        sizeName: sizeName || "Unique",
        quantity: qty,
      });
    });

    return Object.values(colorMap);
  }, [currentProduct]);

  // Calculate total units and statistics
  const productStats = useMemo(() => {
    if (!currentProduct) return { totalUnits: 0, totalColors: 0, totalVariants: 0 };
    const totalColors = groupedVariants.length;
    let totalUnits = 0;
    let totalVariants = 0;

    groupedVariants.forEach((cg) => {
      totalUnits += cg.totalQuantity;
      totalVariants += cg.variants.length;
    });

    return { totalUnits, totalColors, totalVariants };
  }, [currentProduct, groupedVariants]);

  // --- Handlers ---

  // 1. Handle Submit New Product
  const handleCreateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.name.trim()) {
      showToast("Veuillez saisir un nom pour le produit", "error");
      return;
    }
    if (!newProductForm.sellingPrice || Number(newProductForm.sellingPrice) <= 0) {
      showToast("Veuillez saisir un prix de vente valide", "error");
      return;
    }

    try {
      const created = await createProduct({
        name: newProductForm.name.trim(),
        sellingPrice: Number(newProductForm.sellingPrice),
        costPrice: newProductForm.costPrice ? Number(newProductForm.costPrice) : 0,
        discountedPrice: newProductForm.discountedPrice
          ? Number(newProductForm.discountedPrice)
          : undefined,
        sku: newProductForm.sku.trim() || undefined,
        ref: newProductForm.ref.trim() || undefined,
        description: newProductForm.description.trim() || undefined,
        previewImage: newProductForm.previewImage.trim() || undefined,
        status: "active",
      });

      showToast(`Produit "${newProductForm.name}" créé avec succès !`, "success");
      setIsNewProductModalOpen(false);
      setNewProductForm({
        name: "",
        sellingPrice: "",
        costPrice: "",
        discountedPrice: "",
        sku: "",
        ref: "",
        description: "",
        previewImage: "",
      });

      if (created?.id) {
        setSelectedProductId(created.id);
      }
    } catch (err: any) {
      console.error(err);
      showToast(err?.response?.data?.message || err.message || "Erreur lors de la création du produit", "error");
    }
  };

  // 2. Handle Submit New Color & Variant
  const handleAddColorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;

    const color = newColorForm.colorName.trim();
    if (!color) {
      showToast("Veuillez sélectionner ou saisir un nom de couleur", "error");
      return;
    }

    const size =
      newColorForm.sizeName === "Autre..."
        ? newColorForm.customSizeName.trim()
        : newColorForm.sizeName.trim();

    if (!size) {
      showToast("Veuillez spécifier une taille", "error");
      return;
    }

    const qty = Number(newColorForm.quantity);
    if (isNaN(qty) || qty < 0) {
      showToast("Veuillez saisir une quantité valide", "error");
      return;
    }

    try {
      await addVariant({
        productId: selectedProductId,
        colorName: color,
        sizeName: size,
        quantity: qty,
      });

      showToast(`Couleur "${color}" (${size} - ${qty} pcs) ajoutée avec succès !`, "success");
      setIsAddColorModalOpen(false);
      setNewColorForm({
        colorName: "",
        sizeName: "2 - 3 ans",
        customSizeName: "",
        quantity: 10,
      });
      refetchProductDetail();
    } catch (err: any) {
      console.error(err);
      showToast(err?.response?.data?.message || err.message || "Erreur lors de l'ajout de la variante", "error");
    }
  };

  // 3. Handle Submit Size to Existing Color
  const handleAddSizeToColor = async (colorName: string) => {
    if (!selectedProductId) return;

    const size =
      inlineSizeForm.sizeName === "Autre..."
        ? inlineSizeForm.customSizeName.trim()
        : inlineSizeForm.sizeName.trim();

    if (!size) {
      showToast("Veuillez spécifier une taille", "error");
      return;
    }

    const qty = Number(inlineSizeForm.quantity);
    if (isNaN(qty) || qty < 0) {
      showToast("Veuillez saisir une quantité valide", "error");
      return;
    }

    try {
      await addVariant({
        productId: selectedProductId,
        colorName: colorName,
        sizeName: size,
        quantity: qty,
      });

      showToast(`Taille "${size}" (${qty} pcs) ajoutée pour ${colorName} !`, "success");
      setActiveInlineAddSizeColor(null);
      setInlineSizeForm({
        sizeName: "2 - 3 ans",
        customSizeName: "",
        quantity: 10,
      });
      refetchProductDetail();
    } catch (err: any) {
      console.error(err);
      showToast(err?.response?.data?.message || err.message || "Erreur lors de l'ajout de la taille", "error");
    }
  };

  // 4. Handle Update Quantity
  const handleSaveQuantity = async (variantId: number) => {
    if (!selectedProductId) return;
    if (isNaN(editQuantityValue) || editQuantityValue < 0) {
      showToast("Quantité invalide", "error");
      return;
    }

    try {
      await updateVariantQuantity({
        variantId,
        productId: selectedProductId,
        quantity: Number(editQuantityValue),
      });

      showToast("Quantité mise à jour avec succès !", "success");
      setEditingVariantId(null);
      refetchProductDetail();
    } catch (err: any) {
      console.error(err);
      showToast(err?.response?.data?.message || err.message || "Erreur de mise à jour de la quantité", "error");
    }
  };

  // 5. Handle Delete Variant
  const handleDeleteVariant = async (variantId: number, sizeName: string, colorName: string) => {
    if (!confirm(`Supprimer la variante ${colorName} - Taille ${sizeName} ?`)) {
      return;
    }

    try {
      await deleteVariant({
        variantId,
        productId: selectedProductId || undefined,
      });

      showToast(`Variante ${sizeName} supprimée`, "success");
      refetchProductDetail();
    } catch (err: any) {
      console.error(err);
      showToast(err?.response?.data?.message || err.message || "Erreur lors de la suppression", "error");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/70 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 flex flex-col">
      {/* Top Banner Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
                <FiLayers className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">
                  Gestion des Produits & Variantes
                </h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Gérez les stocks, ajoutez des couleurs et associez des tailles avec précision
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                refetchProducts();
                if (selectedProductId) refetchProductDetail();
              }}
              title="Actualiser les données"
              className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-amber-600 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
            >
              <FiRefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsNewProductModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-amber-500/25 hover:shadow-lg transition-all active:scale-98 cursor-pointer"
            >
              <FiPlus className="w-4 h-4 stroke-[3]" />
              <span>Nouveau Produit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout: Left Sidebar (Products List) + Right Studio (Variants Matrix) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT SIDEBAR: PRODUCTS LIST ================= */}
        <aside className="lg:col-span-4 xl:col-span-4 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col overflow-hidden max-h-[calc(100vh-180px)] sticky top-24">
          {/* Header & Search */}
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Catalogue Produits ({filteredProducts.length})
              </span>
              <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
                Sélectionnez pour éditer
              </span>
            </div>
            <div className="relative">
              <FiSearch className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Rechercher un produit ou code-barres..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
              />
            </div>
          </div>

          {/* Product Items List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 divide-y divide-transparent">
            {isLoadingProducts ? (
              // Loading Skeleton
              <div className="space-y-3 p-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div
                    key={n}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 animate-pulse"
                  >
                    <div className="w-12 h-12 rounded-xl bg-zinc-200 dark:bg-zinc-700 shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4" />
                      <div className="h-2.5 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((p: any) => {
                const isSelected = selectedProductId === p.id;
                const stockQty = Number(p.quantity || 0);
                const hasPromo = !!p.discountedPrice;

                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedProductId(p.id);
                      setActiveInlineAddSizeColor(null);
                    }}
                    className={`group relative flex items-center gap-3.5 p-3 rounded-2xl cursor-pointer transition-all duration-200 border ${isSelected
                        ? "bg-amber-50/80 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700/60 shadow-sm"
                        : "bg-white dark:bg-zinc-900 border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:border-zinc-200 dark:hover:border-zinc-700/50"
                      }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200/60 dark:border-zinc-700">
                      {p.previewImage ? (
                        <Image
                          src={p.previewImage}
                          alt={p.name || "Product"}
                          fill
                          sizes="60px"
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400">
                          <FiPackage className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4
                          className={`text-xs sm:text-sm font-bold truncate ${isSelected
                              ? "text-amber-950 dark:text-amber-200"
                              : "text-zinc-800 dark:text-zinc-200"
                            }`}
                        >
                          {p.name}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                          {p.discountedPrice || p.sellingPrice} DA
                        </span>
                        {hasPromo && (
                          <span className="text-[10px] line-through text-zinc-400">
                            {p.sellingPrice} DA
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-1.5">
                        <span className="text-[10px] text-zinc-400 font-mono truncate">
                          {p.barcode || p.sku || `ID: #${p.id}`}
                        </span>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${stockQty > 0
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                              : "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
                            }`}
                        >
                          {stockQty > 0 ? `${stockQty} en stock` : "Rupture"}
                        </span>
                      </div>
                    </div>

                    {/* Active Chevron Indicator */}
                    {isSelected && (
                      <div className="w-2 h-8 rounded-full bg-amber-500 absolute -left-1 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center px-4">
                <FiPackage className="w-8 h-8 text-zinc-300 dark:text-zinc-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-zinc-500">Aucun produit trouvé</p>
                <button
                  onClick={() => setIsNewProductModalOpen(true)}
                  className="mt-3 text-xs font-bold text-amber-600 hover:underline"
                >
                  + Créer un nouveau produit
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* ================= RIGHT WORKSPACE: VARIANT & INVENTORY STUDIO ================= */}
        <main className="lg:col-span-8 xl:col-span-8 space-y-6">
          {currentProduct ? (
            <>
              {/* Selected Product Banner */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-5 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pb-5 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200 dark:border-zinc-700 shadow-inner">
                      {currentProduct.previewImage ? (
                        <Image
                          src={currentProduct.previewImage}
                          alt={currentProduct.name}
                          fill
                          sizes="100px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400">
                          <FiPackage className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                          Produit Sélectionné
                        </span>
                        <span className="text-xs text-zinc-400 font-mono">
                          ID: #{currentProduct.id}
                        </span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white mt-1">
                        {currentProduct.name}
                      </h2>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-zinc-500">
                        <span className="font-bold text-amber-600 dark:text-amber-400">
                          Prix : {currentProduct.discountedPrice || currentProduct.sellingPrice} DA
                        </span>
                        {currentProduct.barcode && (
                          <span>• Code-barres : {currentProduct.barcode}</span>
                        )}
                        {currentProduct.sku && <span>• SKU : {currentProduct.sku}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Primary Action: Add Color Button */}
                  <button
                    onClick={() => setIsAddColorModalOpen(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 hover:scale-[1.02] active:scale-98 transition-all cursor-pointer"
                  >
                    <FiPlus className="w-4 h-4 stroke-[3]" />
                    <span>Ajouter une Couleur</span>
                  </button>
                </div>

                {/* Quick Stats Cards */}
                <div className="grid grid-cols-3 gap-3 pt-4">
                  <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700/50 flex flex-col">
                    <span className="text-[11px] font-semibold text-zinc-500">Couleurs actives</span>
                    <span className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-100 mt-0.5">
                      {productStats.totalColors}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700/50 flex flex-col">
                    <span className="text-[11px] font-semibold text-zinc-500">Total Tailles</span>
                    <span className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-100 mt-0.5">
                      {productStats.totalVariants}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/40 flex flex-col">
                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                      Stock Total Unités
                    </span>
                    <span className="text-base sm:text-lg font-black text-emerald-700 dark:text-emerald-300 mt-0.5">
                      {productStats.totalUnits} pcs
                    </span>
                  </div>
                </div>
              </div>

              {/* ================= COLOR & SIZES MATRIX ================= */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                    <span>Couleurs & Tailles associées</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 font-bold">
                      {groupedVariants.length}
                    </span>
                  </h3>
                  <button
                    onClick={() => setIsAddColorModalOpen(true)}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                  >
                    <FiPlus className="w-3.5 h-3.5" />
                    <span>Nouvelle couleur</span>
                  </button>
                </div>

                {isLoadingDetail ? (
                  <div className="p-8 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 animate-pulse">
                    <FiRefreshCw className="w-6 h-6 text-amber-500 animate-spin mx-auto mb-2" />
                    <p className="text-xs text-zinc-500">Chargement des variantes...</p>
                  </div>
                ) : groupedVariants.length > 0 ? (
                  <div className="space-y-4">
                    {groupedVariants.map((colorGroup) => {
                      const colorHex = getColorHex(colorGroup.colorName);
                      const isInlineActive =
                        activeInlineAddSizeColor === colorGroup.colorName;

                      return (
                        <div
                          key={colorGroup.colorName}
                          className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm overflow-hidden transition-all duration-200 hover:border-zinc-300 dark:hover:border-zinc-700"
                        >
                          {/* Color Group Header */}
                          <div className="p-4 sm:p-5 bg-gradient-to-r from-zinc-50 to-transparent dark:from-zinc-800/40 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              {/* Color Swatch */}
                              <div
                                className="w-7 h-7 rounded-full shadow-inner border-2 border-white dark:border-zinc-800 shrink-0 ring-2 ring-zinc-200/80 dark:ring-zinc-700"
                                style={{ backgroundColor: colorHex }}
                              />
                              <div>
                                <h4 className="text-sm font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                  <span>{colorGroup.colorName}</span>
                                  <span className="text-xs font-normal text-zinc-400">
                                    ({colorGroup.variants.length} taille{colorGroup.variants.length > 1 ? "s" : ""})
                                  </span>
                                </h4>
                                <span className="text-[11px] text-zinc-500">
                                  Stock total : <strong className="text-zinc-800 dark:text-zinc-200">{colorGroup.totalQuantity} unités</strong>
                                </span>
                              </div>
                            </div>

                            {/* Add Size Button for this Color */}
                            <button
                              onClick={() => {
                                setActiveInlineAddSizeColor(
                                  isInlineActive ? null : colorGroup.colorName
                                );
                              }}
                              className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${isInlineActive
                                  ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200"
                                  : "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/60"
                                }`}
                            >
                              {isInlineActive ? (
                                <>
                                  <FiX className="w-3.5 h-3.5" />
                                  <span>Fermer</span>
                                </>
                              ) : (
                                <>
                                  <FiPlus className="w-3.5 h-3.5 stroke-[3]" />
                                  <span>Ajouter une Taille</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Inline Add Size Form (When Expanded) */}
                          {isInlineActive && (
                            <div className="p-4 sm:p-5 bg-amber-50/50 dark:bg-amber-950/10 border-b border-amber-200/60 dark:border-amber-900/40 animate-in slide-in-from-top-2 duration-200">
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs font-black text-amber-900 dark:text-amber-200">
                                  Ajouter une taille pour &quot;{colorGroup.colorName}&quot;
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                                {/* Size Picker */}
                                <div className="sm:col-span-5 space-y-1">
                                  <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
                                    Sélectionnez la taille
                                  </label>
                                  <select
                                    value={inlineSizeForm.sizeName}
                                    onChange={(e) =>
                                      setInlineSizeForm((prev) => ({
                                        ...prev,
                                        sizeName: e.target.value,
                                      }))
                                    }
                                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-amber-500 font-medium"
                                  >
                                    {PRESET_SIZES.map((sz) => (
                                      <option key={sz} value={sz}>
                                        {sz}
                                      </option>
                                    ))}
                                    <option value="Autre...">Autre (personnalisé)...</option>
                                  </select>
                                </div>

                                {inlineSizeForm.sizeName === "Autre..." && (
                                  <div className="sm:col-span-3 space-y-1">
                                    <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
                                      Taille personnalisée
                                    </label>
                                    <input
                                      type="text"
                                      value={inlineSizeForm.customSizeName}
                                      onChange={(e) =>
                                        setInlineSizeForm((prev) => ({
                                          ...prev,
                                          customSizeName: e.target.value,
                                        }))
                                      }
                                      placeholder="Ex: 8 - 9 ans"
                                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                                    />
                                  </div>
                                )}

                                {/* Quantity Input */}
                                <div
                                  className={`${inlineSizeForm.sizeName === "Autre..."
                                      ? "sm:col-span-4"
                                      : "sm:col-span-4"
                                    } space-y-1`}
                                >
                                  <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
                                    Quantité en stock
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={inlineSizeForm.quantity}
                                    onChange={(e) =>
                                      setInlineSizeForm((prev) => ({
                                        ...prev,
                                        quantity: Math.max(0, parseInt(e.target.value) || 0),
                                      }))
                                    }
                                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                                  />
                                </div>

                                {/* Submit Button */}
                                <div className="sm:col-span-3">
                                  <button
                                    onClick={() => handleAddSizeToColor(colorGroup.colorName)}
                                    disabled={isAddingVariant}
                                    className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
                                  >
                                    {isAddingVariant ? (
                                      <FiRefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <FiCheck className="w-3.5 h-3.5 stroke-[3]" />
                                    )}
                                    <span>Enregistrer</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Sizes List Table */}
                          <div className="p-4 sm:p-5 divide-y divide-zinc-100 dark:divide-zinc-800/80">
                            {colorGroup.variants.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {colorGroup.variants.map((v) => {
                                  const isEditing = editingVariantId === v.productVariantId;

                                  return (
                                    <div
                                      key={v.productVariantId}
                                      className="p-3.5 rounded-2xl bg-zinc-50/80 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 flex flex-col justify-between gap-2.5 transition-all hover:bg-white dark:hover:bg-zinc-800 hover:shadow-sm"
                                    >
                                      <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                                          <span className="text-xs font-extrabold text-zinc-900 dark:text-zinc-100">
                                            {v.sizeName}
                                          </span>
                                        </div>

                                        <button
                                          onClick={() =>
                                            handleDeleteVariant(
                                              v.productVariantId,
                                              v.sizeName,
                                              colorGroup.colorName
                                            )
                                          }
                                          title="Supprimer cette variante"
                                          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                        >
                                          <FiTrash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>

                                      {/* Quantity & Actions */}
                                      <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-700/40">
                                        {isEditing ? (
                                          <div className="flex items-center gap-1.5 w-full">
                                            <input
                                              type="number"
                                              min="0"
                                              value={editQuantityValue}
                                              onChange={(e) =>
                                                setEditQuantityValue(
                                                  Math.max(0, parseInt(e.target.value) || 0)
                                                )
                                              }
                                              className="w-16 px-2 py-1 text-xs font-bold rounded-lg bg-white dark:bg-zinc-900 border border-amber-400 text-center"
                                              autoFocus
                                            />
                                            <button
                                              onClick={() => handleSaveQuantity(v.productVariantId)}
                                              disabled={isUpdatingQuantity}
                                              className="p-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
                                              title="Confirmer"
                                            >
                                              <FiCheck className="w-3 h-3 stroke-[3]" />
                                            </button>
                                            <button
                                              onClick={() => setEditingVariantId(null)}
                                              className="p-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
                                              title="Annuler"
                                            >
                                              <FiX className="w-3 h-3" />
                                            </button>
                                          </div>
                                        ) : (
                                          <>
                                            <div className="flex items-center gap-1.5">
                                              <span className="text-[11px] text-zinc-500">Stock:</span>
                                              <span
                                                className={`text-xs font-black px-2 py-0.5 rounded-md ${v.quantity > 0
                                                    ? "bg-emerald-100/70 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                                                    : "bg-rose-100/70 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                                                  }`}
                                              >
                                                {v.quantity} pcs
                                              </span>
                                            </div>

                                            <button
                                              onClick={() => {
                                                setEditingVariantId(v.productVariantId);
                                                setEditQuantityValue(v.quantity);
                                              }}
                                              className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                                              title="Modifier la quantité"
                                            >
                                              <FiEdit2 className="w-3.5 h-3.5" />
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="py-4 text-center text-xs text-zinc-400">
                                Aucune taille enregistrée pour cette couleur. Cliquez sur &quot;Ajouter une Taille&quot; ci-dessus.
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 sm:p-12 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mx-auto mb-3">
                      <FiLayers className="w-7 h-7" />
                    </div>
                    <h4 className="text-base font-bold text-zinc-800 dark:text-zinc-200">
                      Aucune couleur ni taille configurée
                    </h4>
                    <p className="text-xs text-zinc-500 max-w-md mx-auto mt-1 mb-5">
                      Ce produit n&apos;a pas encore de variantes. Commencez par ajouter une première couleur et ses tailles avec leur stock.
                    </p>
                    <button
                      onClick={() => setIsAddColorModalOpen(true)}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                    >
                      + Ajouter la première Couleur & Taille
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Empty selection state */
            <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mx-auto mb-4">
                <FiBox className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-zinc-800 dark:text-zinc-200">
                Sélectionnez un Produit
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1 mb-6">
                Choisissez un produit dans la liste de gauche pour voir et gérer ses couleurs, tailles et quantités en stock.
              </p>
              <button
                onClick={() => setIsNewProductModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-md hover:scale-[1.02] active:scale-98 transition-all"
              >
                + Créer un nouveau produit
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ================= MODAL: ADD COLOR & INITIAL SIZE ================= */}
      {isAddColorModalOpen && selectedProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-lg w-full p-6 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                  <FiLayers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-900 dark:text-white">
                    Ajouter une Couleur & Taille
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Pour : {currentProduct?.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddColorModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 flex items-center justify-center"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddColorSubmit} className="space-y-4">
              {/* Color Name Input + Presets */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Nom de la couleur <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-xl shrink-0 shadow-inner border border-zinc-200 dark:border-zinc-700"
                    style={{ backgroundColor: getColorHex(newColorForm.colorName) }}
                  />
                  <input
                    type="text"
                    required
                    value={newColorForm.colorName}
                    onChange={(e) =>
                      setNewColorForm((prev) => ({ ...prev, colorName: e.target.value }))
                    }
                    placeholder="Ex: Bleu Ciel, Rose Poudré, Vert Sauge..."
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Color Chips Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1 max-h-24 overflow-y-auto">
                  {POPULAR_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() =>
                        setNewColorForm((prev) => ({ ...prev, colorName: c }))
                      }
                      className={`px-2 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1.5 border transition-all ${newColorForm.colorName.toLowerCase() === c.toLowerCase()
                          ? "bg-amber-100 border-amber-400 text-amber-900 dark:bg-amber-950 dark:border-amber-700 dark:text-amber-200"
                          : "bg-zinc-50 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400"
                        }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: getColorHex(c) }}
                      />
                      <span>{c}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Initial Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Taille initiale
                  </label>
                  <select
                    value={newColorForm.sizeName}
                    onChange={(e) =>
                      setNewColorForm((prev) => ({ ...prev, sizeName: e.target.value }))
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  >
                    {PRESET_SIZES.map((sz) => (
                      <option key={sz} value={sz}>
                        {sz}
                      </option>
                    ))}
                    <option value="Autre...">Autre (personnalisé)...</option>
                  </select>
                </div>

                {/* Initial Quantity */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Quantité initiale
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newColorForm.quantity}
                    onChange={(e) =>
                      setNewColorForm((prev) => ({
                        ...prev,
                        quantity: Math.max(0, parseInt(e.target.value) || 0),
                      }))
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              {newColorForm.sizeName === "Autre..." && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Nom de taille personnalisé
                  </label>
                  <input
                    type="text"
                    value={newColorForm.customSizeName}
                    onChange={(e) =>
                      setNewColorForm((prev) => ({
                        ...prev,
                        customSizeName: e.target.value,
                      }))
                    }
                    placeholder="Ex: 8 - 9 ans"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddColorModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isAddingVariant}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold shadow-md shadow-amber-500/25 flex items-center gap-2"
                >
                  {isAddingVariant ? (
                    <>
                      <FiRefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <>
                      <FiCheck className="w-4 h-4 stroke-[3]" />
                      <span>Créer la Variante</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE NEW PRODUCT ================= */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-xl w-full p-6 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                  <FiPackage className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-900 dark:text-white">
                    Créer un Nouveau Produit
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Ajoutez le produit principal avant de configurer ses couleurs et tailles
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNewProductModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 flex items-center justify-center"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProductSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Nom du produit <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newProductForm.name}
                  onChange={(e) =>
                    setNewProductForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Ex: Ensemble Bébé Hiver Douillet"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Prices: Selling & Discounted & Cost */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Prix de vente (DA) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newProductForm.sellingPrice}
                    onChange={(e) =>
                      setNewProductForm((prev) => ({
                        ...prev,
                        sellingPrice: e.target.value,
                      }))
                    }
                    placeholder="3500"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Prix Promo (DA)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newProductForm.discountedPrice}
                    onChange={(e) =>
                      setNewProductForm((prev) => ({
                        ...prev,
                        discountedPrice: e.target.value,
                      }))
                    }
                    placeholder="2900 (Optionnel)"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Prix d&apos;achat (DA)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newProductForm.costPrice}
                    onChange={(e) =>
                      setNewProductForm((prev) => ({
                        ...prev,
                        costPrice: e.target.value,
                      }))
                    }
                    placeholder="2000 (Optionnel)"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              {/* SKU & Ref */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    SKU (Code Article)
                  </label>
                  <input
                    type="text"
                    value={newProductForm.sku}
                    onChange={(e) =>
                      setNewProductForm((prev) => ({ ...prev, sku: e.target.value }))
                    }
                    placeholder="Ex: ENS-HIV-001"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={newProductForm.previewImage}
                    onChange={(e) =>
                      setNewProductForm((prev) => ({
                        ...prev,
                        previewImage: e.target.value,
                      }))
                    }
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newProductForm.description}
                  onChange={(e) =>
                    setNewProductForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Détails du tissu, caractéristiques..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsNewProductModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isCreatingProduct}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold shadow-md shadow-amber-500/25 flex items-center gap-2"
                >
                  {isCreatingProduct ? (
                    <>
                      <FiRefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Création...</span>
                    </>
                  ) : (
                    <>
                      <FiCheck className="w-4 h-4 stroke-[3]" />
                      <span>Enregistrer le Produit</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white animate-in slide-in-from-bottom-5 duration-300 ${toast.type === "success" ? "bg-zinc-900 dark:bg-white dark:text-zinc-900" : "bg-rose-600"
            }`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${toast.type === "success" ? "bg-emerald-500 text-white" : "bg-white text-rose-600"
              }`}
          >
            {toast.type === "success" ? (
              <FiCheck className="w-3.5 h-3.5 stroke-[3]" />
            ) : (
              <FiAlertCircle className="w-3.5 h-3.5 stroke-[3]" />
            )}
          </div>
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
