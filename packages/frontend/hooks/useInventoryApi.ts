// hooks/useInventoryApi.ts
"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  inventoryApi,
  CreateProductPayload,
  BackendProductVariant,
} from '@/api/inventoryApi';

export const INVENTORY_KEYS = {
  products: ['inventory', 'products'] as const,
  productDetail: (id: number | string) => ['inventory', 'products', id] as const,
  attributes: ['inventory', 'attributes'] as const,
  attributeValues: ['inventory', 'attributeValues'] as const,
  productVariants: ['inventory', 'productVariants'] as const,
  variants: ['inventory', 'variants'] as const,
};

export function useInventoryApi() {
  const queryClient = useQueryClient();

  // 1. Fetch Products
  const productsQuery = useQuery({
    queryKey: INVENTORY_KEYS.products,
    queryFn: () => inventoryApi.getProducts(),
    staleTime: 1000 * 30, // 30s
  });

  // 2. Fetch Attributes (Couleur, Taille, etc.)
  const attributesQuery = useQuery({
    queryKey: INVENTORY_KEYS.attributes,
    queryFn: () => inventoryApi.getAttributes(),
    staleTime: 1000 * 60, // 1 min
  });

  // 3. Fetch Attribute Values
  const attributeValuesQuery = useQuery({
    queryKey: INVENTORY_KEYS.attributeValues,
    queryFn: () => inventoryApi.getAttributeValues(),
    staleTime: 1000 * 60,
  });

  // 4. Fetch Product Variants
  const productVariantsQuery = useQuery({
    queryKey: INVENTORY_KEYS.productVariants,
    queryFn: () => inventoryApi.getProductVariants(),
    staleTime: 1000 * 30,
  });

  // Mutation: Create Product
  const createProductMutation = useMutation({
    mutationFn: (payload: CreateProductPayload) => inventoryApi.createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.products });
    },
  });

  // Mutation: Create Attribute Value
  const createAttributeValueMutation = useMutation({
    mutationFn: ({ attributeId, value }: { attributeId: number; value: string }) =>
      inventoryApi.createAttributeValue(attributeId, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.attributes });
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.attributeValues });
    },
  });

  // Mutation: Add Color & Size Variant (using /attributeValues, /ProductVariants, /variants)
  const addVariantMutation = useMutation({
    mutationFn: (args: {
      productId: number;
      colorName: string;
      sizeName: string;
      quantity: number;
      colorAttributeId?: number;
      sizeAttributeId?: number;
    }) => inventoryApi.addVariantWithColorAndSize(args),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.products });
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.productDetail(variables.productId) });
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.attributes });
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.attributeValues });
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.productVariants });
    },
  });

  // Mutation: Update Variant Quantity
  const updateVariantQuantityMutation = useMutation({
    mutationFn: ({
      variantId,
      productId,
      quantity,
    }: {
      variantId: number;
      productId: number;
      quantity: number;
    }) => inventoryApi.updateProductVariant(variantId, { quantity, productId }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.products });
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.productDetail(variables.productId) });
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.productVariants });
    },
  });

  // Mutation: Delete Variant
  const deleteVariantMutation = useMutation({
    mutationFn: ({ variantId, productId }: { variantId: number; productId?: number }) =>
      inventoryApi.deleteProductVariant(variantId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.products });
      if (variables.productId) {
        queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.productDetail(variables.productId) });
      }
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.productVariants });
    },
  });

  return {
    products: productsQuery.data || [],
    isLoadingProducts: productsQuery.isLoading,
    refetchProducts: productsQuery.refetch,

    attributes: attributesQuery.data || [],
    isLoadingAttributes: attributesQuery.isLoading,

    attributeValues: attributeValuesQuery.data || [],
    isLoadingAttributeValues: attributeValuesQuery.isLoading,

    productVariants: productVariantsQuery.data || [],

    createProduct: createProductMutation.mutateAsync,
    isCreatingProduct: createProductMutation.isPending,

    createAttributeValue: createAttributeValueMutation.mutateAsync,
    isCreatingAttributeValue: createAttributeValueMutation.isPending,

    addVariant: addVariantMutation.mutateAsync,
    isAddingVariant: addVariantMutation.isPending,

    updateVariantQuantity: updateVariantQuantityMutation.mutateAsync,
    isUpdatingQuantity: updateVariantQuantityMutation.isPending,

    deleteVariant: deleteVariantMutation.mutateAsync,
    isDeletingVariant: deleteVariantMutation.isPending,
  };
}

export function useProductDetail(productId: number | null | undefined) {
  return useQuery({
    queryKey: INVENTORY_KEYS.productDetail(productId || 0),
    queryFn: () => (productId ? inventoryApi.getProductById(productId) : null),
    enabled: !!productId,
  });
}
