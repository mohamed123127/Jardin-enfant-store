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
 * Loops through cart items and fetches /ProductVariants/:variantId to check if quantity is sufficient.
 */
export async function checkStock(cartItems: CartItem[]): Promise<CheckStockResult> {
  if (!cartItems || cartItems.length === 0) {
    return { isValid: true, itemStatuses: {}, unavailableItems: [], errors: [] };
  }

  const itemStatuses: Record<string, StockItemStatus> = {};
  const unavailableItems: StockItemStatus[] = [];
  const errors: string[] = [];

  for (const item of cartItems) {
    const pId = Number(item.productId || item.product?.id);
    let availableStock = 0;
    let foundVariantId: number | undefined = item.variantId;

    if (item.variantId) {
      try {
        const response = await apiClient.get(`/ProductVariants/${item.variantId}`);
        const variantData = response.data?.data ?? response.data;
        if (variantData) {
          availableStock =
            typeof variantData.quantity === "number"
              ? variantData.quantity
              : Number(variantData.quantity || 0);
          console.log(
            `[checkStock] Fetched /ProductVariants/${item.variantId}: availableStock = ${availableStock}`
          );
        }
      } catch (error) {
        console.warn(`[checkStock] Failed to fetch /ProductVariants/${item.variantId}:`, error);
        // Fallback: try fetching product
        try {
          const prodResponse = await apiClient.get(`/products/${pId}`);
          const prodData = prodResponse.data?.data ?? prodResponse.data;
          const matchedVariant = prodData?.variants?.find(
            (v: any) => Number(v.id) === Number(item.variantId)
          );
          if (matchedVariant) {
            availableStock =
              typeof matchedVariant.quantity === "number"
                ? matchedVariant.quantity
                : Number(matchedVariant.quantity || 0);
          } else if (typeof prodData?.quantity === "number") {
            availableStock = prodData.quantity;
          }
        } catch (e) {
          console.warn(`[checkStock] Fallback product fetch failed for ${pId}:`, e);
        }
      }
    } else {
      // Fallback if no variantId in item: fetch /products/:pId
      try {
        const response = await apiClient.get(`/products/${pId}`);
        const productData = response.data?.data ?? response.data;
        if (productData) {
          if (Array.isArray(productData.variants) && productData.variants.length > 0) {
            const matched = productData.variants[0];
            foundVariantId = matched?.id;
            availableStock =
              typeof matched?.quantity === "number"
                ? matched.quantity
                : Number(matched?.quantity || 0);
          } else {
            availableStock =
              typeof productData.quantity === "number"
                ? productData.quantity
                : Number(productData.quantity || 0);
          }
        }
      } catch (error) {
        console.warn(`[checkStock] Failed to fetch /products/${pId}:`, error);
      }
    }

    const isAvailable = availableStock > 0 && availableStock >= item.quantity;
    let errorMsg: string | undefined;
    const variantLabel = [item.selectedColor, item.selectedSize].filter(Boolean).join(" - ");

    if (availableStock <= 0) {
      errorMsg = `"${item.product?.name || "Produit"}"${variantLabel ? ` (${variantLabel})` : ""} est en rupture de stock.`;
    } else if (item.quantity > availableStock) {
      errorMsg = `Quantité insuffisante pour "${item.product?.name || "Produit"}"${variantLabel ? ` (${variantLabel})` : ""}. Seulement ${availableStock} disponible(s) (demandé: ${item.quantity}).`;
    }

    const status: StockItemStatus = {
      itemId: item.id,
      productId: pId,
      productName: item.product?.name || "Produit",
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

export const checkCartStock = checkStock;
