"use client";

import React from "react";
import { useProduct } from "@/hooks/useProducts";
import { ProductDetailView } from "@/components/store/ProductDetailView";

interface ProductDetailWrapperProps {
  productId: string;
}

export default function ProductDetailWrapper({ productId }: ProductDetailWrapperProps) {
  const { data: backendProduct, isLoading } = useProduct<any>(productId);
  return (
    <ProductDetailView
      productId={productId}
      backendProduct={backendProduct}
    />
  );
}
