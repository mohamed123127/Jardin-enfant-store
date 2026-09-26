import { apiClient } from "@/api/client";
import { CartItem } from "@/context/CartContext";

export interface StockItemStatus {
  itemId: string;
  productId: number;
  productName: string;
  variantId?: number;
  selectedColor: string;
  selectedSize: string;
  requestedQuantity: number;
  availableStock: number;
  isAvailable: boolean;
  errorMessage?: string;
}

export interface CheckStockResult {
  isValid: boolean;
  itemStatuses: Record<string, StockItemStatus>;
  unavailableItems: StockItemStatus[];
  errors: string[];
}

/**
 * Checks real-time stock availability in the backend for all cart items.
 */
export async function checkCartStock(cartItems: CartItem[]): Promise<CheckStockResult> {
  if (!cartItems || cartItems.length === 0) {
    return {
      isValid: true,
      itemStatuses: {},
      unavailableItems: [],
      errors: [],
    };
  }

  // Group items by unique productId to minimize backend requests
  const uniqueProductIds = Array.from(
    new Set(cartItems.map((item) => Number(item.productId || item.product.id)))
  );

  const productDataMap = new Map<number, any>();

  await Promise.all(
    uniqueProductIds.map(async (pId) => {
      try {
        const response = await apiClient.get(`/products/${pId}`);
        if (response.data) {
          productDataMap.set(pId, response.data);
        }
      } catch (error) {
        console.warn(`[checkStock] Unable to fetch real-time backend product for ID ${pId}:`, error);
      }
    })
  );

  const itemStatuses: Record<string, StockItemStatus> = {};
  const unavailableItems: StockItemStatus[] = [];
  const errors: string[] = [];

  for (const item of cartItems) {
    const pId = Number(item.productId || item.product.id);
    const backendProduct = productDataMap.get(pId) || item.product;

    let availableStock = 0;
    let foundVariantId: number | undefined = undefined;

    if (backendProduct?.variants && Array.isArray(backendProduct.variants) && backendProduct.variants.length > 0) {
      // Find matching variant based on color and size
      const variant = backendProduct.variants.find((v: any) => {
        const specs = v.specifications || [];
        const cVal = specs.find((s: any) =>
          ["color", "couleur"].includes(
            (typeof s.attribute === "string" ? s.attribute : s.attribute?.name || "").toLowerCase()
          )
        )?.value;
        const sVal = specs.find((s: any) =>
          ["size", "taille"].includes(
            (typeof s.attribute === "string" ? s.attribute : s.attribute?.name || "").toLowerCase()
          )
        )?.value;

        const matchesColor = !item.selectedColor || !cVal || cVal.trim().toLowerCase() === item.selectedColor.trim().toLowerCase();
        const matchesSize = !item.selectedSize || !sVal || sVal.trim().toLowerCase() === item.selectedSize.trim().toLowerCase();
        return matchesColor && matchesSize;
      }) || backendProduct.variants[0];

      if (variant) {
        foundVariantId = variant.id;
        availableStock = typeof variant.quantity === "number" ? variant.quantity : Number(variant.quantity || 0);
      } else {
        availableStock = typeof backendProduct.quantity === "number" ? backendProduct.quantity : Number(backendProduct.quantity || 0);
      }
    } else {
      availableStock = typeof backendProduct?.quantity === "number" ? backendProduct.quantity : Number(backendProduct?.quantity || 0);
    }

    const isAvailable = availableStock >= item.quantity && availableStock > 0;
    let errorMsg: string | undefined = undefined;

    const variantDetails = [item.selectedColor, item.selectedSize].filter(Boolean).join(" - ");

    if (availableStock <= 0) {
      errorMsg = `L'article "${item.product.name}"${variantDetails ? ` (${variantDetails})` : ""} est en rupture de stock.`;
    } else if (item.quantity > availableStock) {
      errorMsg = `Quantité insuffisante pour "${item.product.name}"${variantDetails ? ` (${variantDetails})` : ""}. Seulement ${availableStock} pièce(s) disponible(s) (demandé: ${item.quantity}).`;
    }

    const status: StockItemStatus = {
      itemId: item.id,
      productId: pId,
      productName: item.product.name,
      variantId: foundVariantId,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize,
      requestedQuantity: item.quantity,
      availableStock,
      isAvailable,
      errorMessage: errorMsg,
    };

    itemStatuses[item.id] = status;

    if (!isAvailable) {
      unavailableItems.push(status);
      if (errorMsg) errors.push(errorMsg);
    }
  }

  return {
    isValid: unavailableItems.length === 0,
    itemStatuses,
    unavailableItems,
    errors,
  };
}
