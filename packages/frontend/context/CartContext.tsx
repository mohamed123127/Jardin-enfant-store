"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { StoreProduct } from "@/data/fakeProducts";

export interface CartItem {
  id: string; // unique ID: `${productId}-${color}-${size}`
  productId: number;
  product: StoreProduct;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  unitPrice: number;
  originalPrice: number | null;
  discountPercent: number | null;
}

interface CartContextType {
  cartItems: CartItem[];
  addItem: (product: StoreProduct, quantity?: number, color?: string, size?: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  shippingFee: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("jardin_cart_v2");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCartItems(parsed);
          setIsInitialized(true);
          return;
        }
      }
    } catch (e) {
      console.error("Failed to parse stored cart:", e);
    }
    setCartItems([]);
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem("jardin_cart_v2", JSON.stringify(cartItems));
      } catch (e) {
        console.error("Failed to save cart:", e);
      }
    }
  }, [cartItems, isInitialized]);

  const addItem = (
    product: StoreProduct,
    quantity: number = 1,
    color?: string,
    size?: string
  ) => {
    const colorVal = color || (product.colors && product.colors[0]?.name) || "Lavande";
    const sizeVal = size || (product.sizes && product.sizes[0]?.name) || "2-3 ans";
    const itemId = `${product.id}-${colorVal}-${sizeVal}`;

    const rawSellingPrice = typeof product.sellingPrice === "string" ? parseFloat(product.sellingPrice) : Number(product.sellingPrice || 0);
    const rawDiscountPrice = product.discountedPrice
      ? (typeof product.discountedPrice === "string" ? parseFloat(product.discountedPrice) : Number(product.discountedPrice))
      : null;

    const unitPrice = rawDiscountPrice && rawDiscountPrice < rawSellingPrice ? rawDiscountPrice : rawSellingPrice;
    const originalPrice = rawDiscountPrice && rawDiscountPrice < rawSellingPrice ? rawSellingPrice : null;
    const discountPercent = originalPrice ? Math.round(((originalPrice - unitPrice) / originalPrice) * 100) : null;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === itemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      const newItem: CartItem = {
        id: itemId,
        productId: product.id,
        product,
        selectedColor: colorVal,
        selectedSize: sizeVal,
        quantity,
        unitPrice,
        originalPrice,
        discountPercent,
      };
      return [...prev, newItem];
    });
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = useMemo(() => cartItems.reduce((acc, item) => acc + item.quantity, 0), [cartItems]);

  const subtotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0),
    [cartItems]
  );

  const shippingFee = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= 15000 ? 0 : 600;
  }, [subtotal]);

  const totalPrice = useMemo(() => subtotal + shippingFee, [subtotal, shippingFee]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        shippingFee,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
