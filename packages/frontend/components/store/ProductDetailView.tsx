"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiHeart,
  FiShoppingCart,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown,
  FiChevronUp,
  FiTruck,
  FiShield,
  FiRepeat,
  FiDollarSign,
  FiFileText,
  FiPackage,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRight,
  FiX
} from "react-icons/fi";
import { FaHeart, FaStar } from "react-icons/fa";
import { FAKE_PRODUCTS, StoreProduct } from "@/data/fakeProducts";
import { getColorHex } from "@/data/colors";
import { ProductCard } from "@/components/store/ProductCard";
import { SizeGuideModal } from "@/components/store/SizeGuideModal";
import { useCart } from "@/context/CartContext";
import { useTranslations } from "next-intl";
import { addToCart, viewContent } from "@/lib/metaPixel";

interface ProductDetailViewProps {
  productId: string;
  backendProduct?: any | null;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  productId,
  backendProduct,
}) => {
  const router = useRouter();
  const { cartItems, addItem } = useCart();
  const t = useTranslations("product");

  // Find fallback product from fake data or use backendProduct
  const fallbackProduct = useMemo(() => {
    const numId = Number(productId);
    const found = FAKE_PRODUCTS.find((p) => p.id === numId);
    if (found) return found;

    // Default to the featured Affnane product if ID matches 13, 18, or non-numeric/custom
    return FAKE_PRODUCTS[0]; // Affnane is first item
  }, [productId]);

  // Helper to extract attribute values from specifications
  const getSpecValue = (specs: any[] | undefined, attrNames: string[]): string | null => {
    if (!specs || !Array.isArray(specs)) return null;
    const match = specs.find((s: any) =>
      attrNames.some((name) => s.attribute?.toLowerCase() === name.toLowerCase())
    );
    return match?.value?.trim() || null;
  };

  const normalizeSize = (sizeStr?: string | null): string => {
    if (!sizeStr) return "";
    return sizeStr.toLowerCase().replace(/\s*ans/g, "").replace(/\s*mois/g, "m").trim();
  };

  const isSizeMatch = (size1?: string | null, size2?: string | null): boolean => {
    if (!size1 || !size2) return false;
    const s1 = size1.trim().toLowerCase();
    const s2 = size2.trim().toLowerCase();
    return s1 === s2 || normalizeSize(s1) === normalizeSize(s2) || s1.includes(s2) || s2.includes(s1);
  };

  const isColorMatch = (color1?: string | null, color2?: string | null): boolean => {
    if (!color1 || !color2) return false;
    return color1.trim().toLowerCase() === color2.trim().toLowerCase();
  };

  const DEFAULT_MEASUREMENTS: Record<string, { top: string; sleeves: string; pants: string }> = {
    "6-9 mois": { top: "32 cm", sleeves: "24 cm", pants: "38 cm" },
    "9-12 mois": { top: "34 cm", sleeves: "26 cm", pants: "41 cm" },
    "12-18 mois": { top: "36 cm", sleeves: "28 cm", pants: "44 cm" },
    "18-24 mois": { top: "38 cm", sleeves: "30 cm", pants: "47 cm" },
    "1 - 2 ans": { top: "40 cm", sleeves: "31 cm", pants: "50 cm" },
    "2 - 3 ans": { top: "42 cm", sleeves: "33 cm", pants: "54 cm" },
    "3 - 4 ans": { top: "45 cm", sleeves: "36 cm", pants: "59 cm" },
    "4 - 5 ans": { top: "48 cm", sleeves: "39 cm", pants: "64 cm" },
    "5 - 6 ans": { top: "51 cm", sleeves: "42 cm", pants: "69 cm" },
    "7 - 8 ans": { top: "54 cm", sleeves: "45 cm", pants: "74 cm" },
  };

  const getMeasurementsForSize = (sizeName: string, variants?: any[]) => {
    if (!sizeName) return null;
    const normalized = sizeName.toLowerCase().trim();

    if (variants && Array.isArray(variants)) {
      const matchedV = variants.find((v) => {
        const sVal = getSpecValue(v.specifications, ["size", "taille"]);
        return sVal && isSizeMatch(sVal, sizeName);
      });

      if (matchedV && matchedV.specifications) {
        const topSpec = getSpecValue(matchedV.specifications, ["longueur du haut", "longueur_haut", "top_length", "haut"]);
        const sleevesSpec = getSpecValue(matchedV.specifications, ["longueur des manches", "longueur_manches", "sleeves_length", "manches"]);
        const pantsSpec = getSpecValue(matchedV.specifications, ["longueur du pantalon", "longueur_pantalon", "pants_length", "pantalon"]);

        if (topSpec || sleevesSpec || pantsSpec) {
          return {
            top: topSpec || "42 cm",
            sleeves: sleevesSpec || "33 cm",
            pants: pantsSpec || "54 cm",
          };
        }
      }
    }

    for (const [key, val] of Object.entries(DEFAULT_MEASUREMENTS)) {
      if (normalized.includes(key.toLowerCase()) || key.toLowerCase().includes(normalized)) {
        return val;
      }
    }

    const ageMatch = normalized.match(/(\d+)/);
    if (ageMatch) {
      const num = parseInt(ageMatch[1], 10);
      if (normalized.includes("m") || normalized.includes("mois")) {
        return {
          top: `${30 + Math.round(num * 0.7)} cm`,
          sleeves: `${22 + Math.round(num * 0.7)} cm`,
          pants: `${35 + Math.round(num * 0.8)} cm`,
        };
      } else {
        return {
          top: `${36 + Math.round(num * 2.5)} cm`,
          sleeves: `${27 + Math.round(num * 2.5)} cm`,
          pants: `${44 + Math.round(num * 4.5)} cm`,
        };
      }
    }

    return { top: "42 cm", sleeves: "33 cm", pants: "54 cm" };
  };

  // Merge backend data with fallback details
  const product: StoreProduct = useMemo(() => {
    if (backendProduct) {
      // Parse selling and discounted prices
      const sellingPriceNum = typeof backendProduct.sellingPrice === "string"
        ? parseFloat(backendProduct.sellingPrice)
        : Number(backendProduct.sellingPrice || 0);

      const discountedPriceNum = backendProduct.discountedPrice
        ? (typeof backendProduct.discountedPrice === "string"
          ? parseFloat(backendProduct.discountedPrice)
          : Number(backendProduct.discountedPrice))
        : undefined;

      // Extract colors and sizes from backend variants specifications if available
      const colorsMap = new Map<string, { hex: string; totalStock: number }>();
      const sizesMap = new Map<string, number>();
      let totalQty = 0;

      if (backendProduct.variants && Array.isArray(backendProduct.variants)) {
        backendProduct.variants.forEach((v: any) => {
          const qty = typeof v.quantity === "number" ? v.quantity : Number(v.quantity || 0);
          totalQty += qty;

          const colorVal = getSpecValue(v.specifications, ["color", "couleur"]);
          const sizeVal = getSpecValue(v.specifications, ["size", "taille"]);

          if (colorVal) {
            const existing = colorsMap.get(colorVal) || { hex: getColorHex(colorVal), totalStock: 0 };
            existing.totalStock += qty;
            colorsMap.set(colorVal, existing);
          }

          if (sizeVal) {
            const existingStock = sizesMap.get(sizeVal) || 0;
            sizesMap.set(sizeVal, existingStock + qty);
          }
        });
      }

      const extractedColors = Array.from(colorsMap.entries()).map(([name, data]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        rawName: name,
        hex: data.hex,
        inStock: data.totalStock > 0,
      }));

      const extractedSizes = Array.from(sizesMap.entries()).map(([name, totalStock]) => {
        const displayName = /^\d+$/.test(name.trim()) ? `${name.trim()} ans` : name.trim();
        return {
          name: displayName,
          rawName: name.trim(),
          inStock: totalStock > 0,
        };
      });

      const mergedImages = backendProduct.images && backendProduct.images.length > 0
        ? backendProduct.images
        : (backendProduct.previewImage ? [backendProduct.previewImage] : fallbackProduct.images || [fallbackProduct.previewImage]);

      const computedQuantity = backendProduct.quantity !== undefined
        ? (typeof backendProduct.quantity === "number" ? backendProduct.quantity : Number(backendProduct.quantity))
        : (totalQty > 0 ? totalQty : fallbackProduct.quantity);

      return {
        id: backendProduct.id,
        name: backendProduct.name || fallbackProduct.name,
        barcode: backendProduct.barcode || fallbackProduct.barcode,
        sku: backendProduct.sku || fallbackProduct.sku,
        ref: backendProduct.ref || fallbackProduct.ref,
        description: backendProduct.description || fallbackProduct.description,
        costPrice: backendProduct.costPrice || fallbackProduct.costPrice,
        sellingPrice: sellingPriceNum > 0 ? sellingPriceNum : fallbackProduct.sellingPrice,
        discountedPrice: discountedPriceNum && discountedPriceNum < sellingPriceNum ? discountedPriceNum : fallbackProduct.discountedPrice,
        previewImage: backendProduct.previewImage || fallbackProduct.previewImage,
        images: mergedImages,
        category: fallbackProduct.category || "Ensembles",
        ageGroup: fallbackProduct.ageGroup || "2 - 3 ans",
        rating: fallbackProduct.rating || 4.8,
        reviewsCount: fallbackProduct.reviewsCount || 24,
        quantity: computedQuantity,
        status: "active",
        badge: fallbackProduct.badge || "Promo",
        features: fallbackProduct.features,
        colors: extractedColors.length > 0 ? extractedColors : fallbackProduct.colors,
        sizes: extractedSizes.length > 0 ? extractedSizes : fallbackProduct.sizes,
        variants: backendProduct.variants || fallbackProduct.variants
      };
    }
    return fallbackProduct;
  }, [backendProduct, fallbackProduct]);

  useEffect(() => {
    viewContent({
      id: product.id,
      name: product.name,
      price: Number(product.sellingPrice),
    });
  }, [product])

  // Gallery State
  const images = useMemo(() => {
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    return [product.previewImage || "/products/affnane-1.jpg"];
  }, [product]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Variant selections
  const availableColors = useMemo(() => {
    if (product.colors && product.colors.length > 0) {
      return product.colors;
    }
    return [
      { name: "Lavande", hex: "#c4b5fd", inStock: true },
      { name: "Rose Poudré", hex: "#fbcfe8", inStock: true },
      { name: "Beige Crème", hex: "#f5ebe0", inStock: true },
      { name: "Vert Sauge", hex: "#a7c4bc", inStock: true },
      { name: "Bleu Doux", hex: "#bfdbfe", inStock: true },
    ];
  }, [product.colors]);

  const availableSizes = useMemo(() => {
    if (product.sizes && product.sizes.length > 0) {
      return product.sizes;
    }
    return [
      { name: "1-2 ans", inStock: false },
      { name: "2-3 ans", inStock: true },
      { name: "3-4 ans", inStock: false },
      { name: "4-5 ans", inStock: true },
      { name: "5-6 ans", inStock: true },
    ];
  }, [product.sizes]);

  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  // Sync selectedColor when colors become available
  useEffect(() => {
    if (availableColors.length > 0) {
      setSelectedColor((current) => {
        const found = availableColors.find(
          (c) => isColorMatch(c.name, current) || (c.rawName && isColorMatch(c.rawName, current))
        );
        if (found) return found.name;
        const inStockColor = availableColors.find((c) => c.inStock);
        return (inStockColor || availableColors[0]).name;
      });
    }
  }, [availableColors]);

  // Sync selectedSize when sizes become available
  useEffect(() => {
    if (availableSizes.length > 0) {
      setSelectedSize((current) => {
        const found = availableSizes.find(
          (s) => isSizeMatch(s.name, current) || (s.rawName && isSizeMatch(s.rawName, current))
        );
        if (found) return found.name;
        const inStockSize = availableSizes.find((s) => s.inStock);
        return (inStockSize || availableSizes[0]).name;
      });
    }
  }, [availableSizes]);

  // Find the exact variant corresponding to the selected color and size
  const selectedVariant = useMemo(() => {
    if (!product.variants || !Array.isArray(product.variants) || product.variants.length === 0) {
      return null;
    }

    return product.variants.find((v: any) => {
      const colorVal = getSpecValue(v.specifications, ["color", "couleur"]);
      const sizeVal = getSpecValue(v.specifications, ["size", "taille"]);

      const matchesColor = !selectedColor || !colorVal || isColorMatch(colorVal, selectedColor);
      const matchesSize = !selectedSize || !sizeVal || isSizeMatch(sizeVal, selectedSize);

      return matchesColor && matchesSize;
    }) || null;
  }, [product.variants, selectedColor, selectedSize]);

  // Current stock quantity for selected variant / product
  const currentStock = useMemo(() => {
    if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
      if (selectedVariant) {
        return typeof selectedVariant.quantity === "number"
          ? selectedVariant.quantity
          : Number(selectedVariant.quantity || 0);
      }
      return 0;
    }
    return typeof product.quantity === "number" ? product.quantity : Number(product.quantity || 0);
  }, [product.variants, selectedVariant, product.quantity]);

  // Quantity of this variant already in the cart
  const existingCartItem = useMemo(() => {
    return cartItems.find((ci) => {
      const isProdMatch = ci.productId === product.id;
      const isColMatch = !selectedColor || isColorMatch(ci.selectedColor, selectedColor);
      const isSzMatch = !selectedSize || isSizeMatch(ci.selectedSize, selectedSize);
      return isProdMatch && isColMatch && isSzMatch;
    });
  }, [cartItems, product.id, selectedColor, selectedSize]);

  const quantityInCart = existingCartItem ? existingCartItem.quantity : 0;
  const remainingStock = Math.max(0, currentStock - quantityInCart);
  const isOutOfStock = remainingStock <= 0;

  // Handle color selection change with smart size fallback
  const handleSelectColor = (colorName: string) => {
    setSelectedColor(colorName);
    if (product.variants && product.variants.length > 0) {
      const currentSizeVariant = product.variants.find((v: any) => {
        const cVal = getSpecValue(v.specifications, ["color", "couleur"]);
        const sVal = getSpecValue(v.specifications, ["size", "taille"]);
        return isColorMatch(cVal, colorName) && isSizeMatch(sVal, selectedSize);
      });

      if (!currentSizeVariant || (currentSizeVariant.quantity ?? 0) <= 0) {
        const firstInStockVariant = product.variants.find((v: any) => {
          const cVal = getSpecValue(v.specifications, ["color", "couleur"]);
          return isColorMatch(cVal, colorName) && (v.quantity ?? 0) > 0;
        });

        if (firstInStockVariant) {
          const sVal = getSpecValue(firstInStockVariant.specifications, ["size", "taille"]);
          if (sVal) {
            const matchingSize = availableSizes.find(
              (s) => isSizeMatch(s.name, sVal) || (s.rawName && isSizeMatch(s.rawName, sVal))
            );
            if (matchingSize) {
              setSelectedSize(matchingSize.name);
            } else {
              setSelectedSize(sVal);
            }
          }
        }
      }
    }
  };

  // Clamp quantity within valid remaining stock range
  useEffect(() => {
    if (remainingStock > 0 && quantity > remainingStock) {
      setQuantity(remainingStock);
    } else if (remainingStock === 0) {
      setQuantity(1);
    }
  }, [remainingStock, quantity]);

  // Wishlist & Cart state
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Accordions open/close state
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    description: true,
    details: false,
    shipping: false,
  });

  // Toast state
  const [toast, setToast] = useState<{ message: string; visible: boolean } | null>(null);

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Price calculations
  const sellingPrice = Number(product.sellingPrice) || 4900;
  const discountedPrice = product.discountedPrice ? Number(product.discountedPrice) : 3200;
  const discountPercent = Math.round(((sellingPrice - discountedPrice) / sellingPrice) * 100);

  const currentPrice = discountedPrice || sellingPrice;
  const originalPrice = discountedPrice ? sellingPrice : null;

  // Image Navigation Handlers
  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Cart operations
  const handleAddToCart = () => {
    if (remainingStock <= 0) return;
    const qtyToAdd = Math.min(quantity, remainingStock);
    addItem(product, qtyToAdd, selectedColor, selectedSize);
    setIsAdded(true);
    showToast(`"${product.name}" (${qtyToAdd}x, ${selectedSize}, ${selectedColor}) ajouté au panier !`);
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.sellingPrice),
      quantity: quantity,
    });
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const handleBuyNow = () => {
    if (remainingStock <= 0) return;
    const qtyToAdd = Math.min(quantity, remainingStock);
    addItem(product, qtyToAdd, selectedColor, selectedSize);
    setTimeout(() => {
      router.push("/cart");
    }, 300);
  };

  const handleToggleWishlist = () => {
    const nextState = !isWishlisted;
    setIsWishlisted(nextState);
    showToast(nextState ? `"${product.name}" ajouté à vos favoris ❤️` : `"${product.name}" retiré de vos favoris`);
  };

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Related products
  const relatedProducts = useMemo(() => {
    return FAKE_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);
  }, [product.id]);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 selection:bg-orange-500 selection:text-white">
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">


        {/* Main Product Layout: Grid on Desktop, Stack on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* ================= LEFT / GALLERY SECTION ================= */}
          <div className="lg:col-span-7 flex flex-col-reverse lg:flex-row gap-4 items-start w-full">
            {/* Vertical Thumbnails on Desktop / Horizontal Row on Mobile */}
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible w-full lg:w-24 shrink-0 py-1 scrollbar-none">
              {images.map((img, idx) => {
                const isActive = activeImageIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`Afficher l'image ${idx + 1}`}
                    className={`relative w-20 h-20 sm:w-22 sm:h-22 lg:w-20 lg:h-20 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 transition-all duration-200 cursor-pointer ${isActive
                      ? "border-2 border-orange-500 shadow-md ring-2 ring-orange-500/20 scale-[1.02]"
                      : "border-2 border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 opacity-80 hover:opacity-100"
                      }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} miniature ${idx + 1}`}
                      fill
                      sizes="88px"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>

            {/* Main Featured Image Container */}
            <div className="relative w-full aspect-square sm:aspect-[4/4] lg:aspect-[4/4] rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center justify-center">
              <Image
                src={images[activeImageIndex] || images[0]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover transition-transform duration-500"
              />

              {/* Discount Badge (Top Left) */}
              {discountPercent > 0 && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-extrabold bg-[#ff4d6d] text-white shadow-md shadow-rose-500/30">
                    -{discountPercent}%
                  </span>
                </div>
              )}

              {/* Wishlist Floating Button (Top Right) */}
              <button
                onClick={handleToggleWishlist}
                aria-label={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
                className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white/95 dark:bg-zinc-900/90 backdrop-blur-md shadow-lg flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:text-rose-500 hover:scale-110 active:scale-95 transition-all duration-200 border border-zinc-100/80 dark:border-zinc-800"
              >
                {isWishlisted ? (
                  <FaHeart className="w-5 h-5 text-rose-500 fill-current animate-bounce" />
                ) : (
                  <FiHeart className="w-5 h-5" />
                )}
              </button>

              {/* Left / Right Gallery Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    aria-label="Image précédente"
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-md flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-zinc-800 hover:scale-110 active:scale-95 transition-all"
                  >
                    <FiChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    aria-label="Image suivante"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-md flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-zinc-800 hover:scale-110 active:scale-95 transition-all"
                  >
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image Counter Badge (Bottom Right) */}
              <div className="absolute bottom-4 right-4 z-10 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider">
                {activeImageIndex + 1}/{images.length}
              </div>
            </div>
          </div>

          {/* ================= RIGHT / PRODUCT DETAILS SECTION ================= */}
          <div className="lg:col-span-5 flex flex-col space-y-5">
            {/* Brand / Tag */}
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-orange-500 dark:text-orange-400">
                JARDIN D'ENFANTS
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white mt-1 leading-tight tracking-tight">
                {product.name}
              </h1>
            </div>

            {/* Stock & Rating Bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-medium">
              {/* Stock Status */}
              {remainingStock > 0 ? (
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/40">
                  <FiCheckCircle className="w-4 h-4 text-emerald-500 stroke-[2.5]" />
                  <span>
                    En stock • {remainingStock} disponible{remainingStock > 1 ? "s" : ""}
                    {quantityInCart > 0 && ` (${quantityInCart} dans votre panier)`}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-full border border-rose-100 dark:border-rose-900/40">
                  <FiAlertCircle className="w-4 h-4 text-rose-500 stroke-[2.5]" />
                  <span>
                    {quantityInCart > 0
                      ? `Rupture de stock (${quantityInCart} déjà dans votre panier)`
                      : "Rupture de stock • 0 disponible"}
                  </span>
                </div>
              )}
            </div>

            {/* Pricing Row */}
            <div className="flex items-center justify-between gap-4 pt-1">
              <div className="flex flex-col">
                {originalPrice && (
                  <span className="text-sm font-bold text-zinc-400 line-through">
                    {originalPrice.toFixed(2)} DA
                  </span>
                )}
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-black text-[#ff5500] dark:text-[#ff6a1a] tracking-tight">
                    {currentPrice.toFixed(2)}
                  </span>
                  <span className="text-base sm:text-lg font-black text-[#ff5500] dark:text-[#ff6a1a]">
                    DA
                  </span>
                </div>
              </div>

              {/* Discount Tag */}
              {discountPercent > 0 && (
                <div className="px-3 py-1.5 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 font-extrabold text-xs sm:text-sm">
                  -{discountPercent}%
                </div>
              )}
            </div>

            {/* Color Swatches */}
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
                  Couleur : <span className="font-normal text-zinc-600 dark:text-zinc-400">{selectedColor}</span>
                </span>
              </div>

              <div className="flex items-center gap-3">
                {availableColors.map((col) => {
                  const isSelected = isColorMatch(selectedColor, col.name) || (col.rawName && isColorMatch(selectedColor, col.rawName));
                  return (
                    <button
                      key={col.name}
                      onClick={() => handleSelectColor(col.name)}
                      aria-label={`Sélectionner la couleur ${col.name}`}
                      title={`${col.name}${col.inStock ? "" : " (Épuisé)"}`}
                      className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all duration-150 cursor-pointer ${isSelected
                        ? "ring-2 ring-offset-2 ring-orange-500 scale-110 shadow-sm"
                        : "border border-zinc-300 dark:border-zinc-700 hover:scale-105"
                        }`}
                      style={{ backgroundColor: col.hex }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Size Selector */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
                  Taille :
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
                {availableSizes.map((sz) => {
                  const isSelected = isSizeMatch(selectedSize, sz.name) || (sz.rawName && isSizeMatch(selectedSize, sz.rawName));

                  // Find stock for this size in currently selected color
                  const matchedV = product.variants?.find((v: any) => {
                    const cVal = getSpecValue(v.specifications, ["color", "couleur"]);
                    const sVal = getSpecValue(v.specifications, ["size", "taille"]);
                    return (!selectedColor || !cVal || isColorMatch(cVal, selectedColor)) &&
                      isSizeMatch(sVal, sz.name);
                  });

                  const totalSizeQty = matchedV !== undefined
                    ? (typeof matchedV.quantity === "number" ? matchedV.quantity : Number(matchedV.quantity || 0))
                    : (sz.inStock ? 1 : 0);

                  // Calculate how many of this specific size & color variant are already in cart
                  const szCartItem = cartItems.find((ci) => {
                    const isProdMatch = ci.productId === product.id;
                    const isColMatch = !selectedColor || isColorMatch(ci.selectedColor, selectedColor);
                    const isSzMatch = isSizeMatch(ci.selectedSize, sz.name) || (sz.rawName && isSizeMatch(ci.selectedSize, sz.rawName));
                    return isProdMatch && isColMatch && isSzMatch;
                  });

                  const szQtyInCart = szCartItem ? szCartItem.quantity : 0;
                  const szRemainingStock = Math.max(0, totalSizeQty - szQtyInCart);
                  const isInStock = szRemainingStock > 0;

                  return (
                    <button
                      key={sz.name}
                      onClick={() => setSelectedSize(sz.name)}
                      className={`relative py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold text-center transition-all cursor-pointer ${isSelected
                        ? "border-2 border-orange-500 text-orange-500 bg-orange-50/50 dark:bg-orange-950/30 shadow-sm"
                        : isInStock
                          ? "border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-600"
                          : "border border-dashed border-rose-300 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/30 text-zinc-400 dark:text-zinc-500 hover:border-rose-400 opacity-75"
                        }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>{sz.name}</span>
                        {!isInStock && (
                          <FiX className="w-3.5 h-3.5 text-rose-500 stroke-[3] shrink-0" />
                        )}
                      </div>
                      {!isInStock && (
                        <span className="block text-[9px] font-bold text-rose-500 -mt-0.5">
                          Épuisé
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Transparent measurements box with Guide des tailles in top right & larger font size */}
              {/* {selectedSize && (() => {
                const m = getMeasurementsForSize(selectedSize, product.variants);
                if (!m) return null;
                return (
                  <div className="mt-3.5 p-3.5 sm:p-4 rounded-2xl bg-transparent border border-zinc-200 dark:border-zinc-800/80">
                    <div className="flex items-center justify-between font-bold text-zinc-900 dark:text-white mb-3 text-xs sm:text-sm">
                      <span className="flex items-center gap-1.5">
                        <span>📏</span>
                        <span>{t("measurements", { size: selectedSize })}</span>
                      </span>
                      <button
                        onClick={() => setIsSizeGuideOpen(true)}
                        className="flex items-center gap-1 text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors cursor-pointer"
                      >
                        <span>{t("sizeGuide")}</span>
                        <span>→</span>
                      </button>
                    </div>

                    <ul className="space-y-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                      <li className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-1.5">
                        <span>• {t("topLength")}</span>
                        <span className="font-bold text-zinc-900 dark:text-white">{m.top}</span>
                      </li>
                      <li className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-1.5">
                        <span>• {t("sleevesLength")}</span>
                        <span className="font-bold text-zinc-900 dark:text-white">{m.sleeves}</span>
                      </li>
                      <li className="flex items-center justify-between pt-0.5">
                        <span>• {t("pantsLength")}</span>
                        <span className="font-bold text-zinc-900 dark:text-white">{m.pants}</span>
                      </li>
                    </ul>
                  </div>
                );
              })()} */}
            </div>

            {/* Quantity & Actions */}
            <div className="pt-3 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center gap-3">
                  <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white whitespace-nowrap">
                    {t("quantity")}
                  </span>
                  <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 px-2 py-1.5 shadow-sm">
                    <button
                      disabled={isOutOfStock || quantity <= 1}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      aria-label="Diminuer quantité"
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-bold text-sm text-zinc-900 dark:text-white">
                      {isOutOfStock ? 0 : quantity}
                    </span>
                    <button
                      disabled={isOutOfStock || quantity >= remainingStock}
                      onClick={() => setQuantity(Math.min(remainingStock || 1, quantity + 1))}
                      aria-label="Augmenter quantité"
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add To Cart Primary Button */}
                <button
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${isOutOfStock
                    ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed shadow-none"
                    : isAdded
                      ? "bg-emerald-600 text-white shadow-emerald-500/30 scale-[1.02] cursor-pointer"
                      : "bg-[#ff5500] hover:bg-[#e64d00] text-white shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.01] active:scale-98 cursor-pointer"
                    }`}
                >
                  {isOutOfStock ? (
                    <>
                      <FiAlertCircle className="w-5 h-5" />
                      <span>{t("outOfStock")}</span>
                    </>
                  ) : isAdded ? (
                    <>
                      <FiCheck className="w-5 h-5 stroke-[3]" />
                      <span>{t("added")}</span>
                    </>
                  ) : (
                    <>
                      <FiShoppingCart className="w-5 h-5" />
                      <span>{t("addToCart")}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Buy Now Button */}
              <button
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm transition-all shadow-sm ${isOutOfStock
                  ? "bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
                  : "bg-white dark:bg-zinc-900 border border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-white hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 cursor-pointer active:scale-98"
                  }`}
              >
                {t("buyNow")}
              </button>
            </div>

            {/* Trust Badges Grid (4 items) */}
            <div className="grid grid-cols-2 gap-3 pt-3">
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
                <div className="text-orange-500 shrink-0">
                  <FiTruck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white leading-tight">
                    {t("delivery")}
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    {t("deliverySub")}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
                <div className="text-orange-500 shrink-0">
                  <FiDollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white leading-tight">
                    {t("payment")}
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    {t("paymentSub")}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
                <div className="text-orange-500 shrink-0">
                  <FiRepeat className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white leading-tight">
                    {t("exchange")}
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    {t("exchangeSub")}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
                <div className="text-orange-500 shrink-0">
                  <FiShield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white leading-tight">
                    {t("quality")}
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    {t("qualitySub")}
                  </p>
                </div>
              </div>
            </div>

            {/* Accordions Section */}
            <div className="space-y-2.5 pt-2">

              {/* Accordion 3: Livraison & Échange */}
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <button
                  onClick={() => toggleAccordion("shipping")}
                  className="w-full p-4 flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <FiTruck className="w-4 h-4" />
                    </div>

                    <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
                      Livraison & échange
                    </span>
                  </div>

                  {openAccordions.shipping ? (
                    <FiChevronUp className="w-4 h-4 text-zinc-400" />
                  ) : (
                    <FiChevronDown className="w-4 h-4 text-zinc-400" />
                  )}
                </button>

                {openAccordions.shipping && (
                  <div className="px-4 pb-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 space-y-2 border-t border-zinc-100 dark:border-zinc-800 pt-3">
                    <p>
                      <strong>Livraison au bureau :</strong> généralement sous 1 à 2 jours
                      dans la plupart des wilayas.
                    </p>

                    <p>
                      <strong>Livraison à domicile :</strong> généralement sous 1 à 3 jours.
                    </p>

                    <p>
                      <strong>Wilayas du Sud :</strong> les délais peuvent être légèrement
                      plus longs selon la destination.
                    </p>

                    <p>
                      <strong>Échange :</strong> possible en cas de défaut du produit ou
                      si la taille ne convient pas.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>


      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      {/* Floating Toast Notification */}
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
};
