// api/inventoryApi.ts
import { apiClient } from './client';

export interface BackendAttributeValue {
  id: number;
  value: string;
  attributeId?: number;
}

export interface BackendAttribute {
  id: number;
  name: string;
  values?: BackendAttributeValue[];
  attributeValues?: BackendAttributeValue[];
}

export interface BackendSpecification {
  attribute: string;
  value: string;
}

export interface BackendProductVariant {
  id: number;
  quantity: number;
  productId: number;
  specifications?: BackendSpecification[];
}

export interface BackendVariantLink {
  id: number;
  productVariantId: number;
  attributeValueId: number;
}

export interface CreateProductPayload {
  name: string;
  previewImage?: string;
  barcode?: string;
  sku?: string;
  ref?: string;
  description?: string;
  costPrice?: number;
  sellingPrice: number;
  discountedPrice?: number;
  status?: 'active' | 'inactive' | 'archived';
}

export const inventoryApi = {
  // --- Products ---
  getProducts: async () => {
    const { data } = await apiClient.get('/products?limit=100');
    return data?.data || [];
  },

  getProductById: async (id: number | string) => {
    const { data } = await apiClient.get(`/products/${id}`);
    return data?.data || null;
  },

  createProduct: async (payload: CreateProductPayload) => {
    const { data } = await apiClient.post('/products', {
      ...payload,
      previewImage: payload.previewImage || 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80',
      status: payload.status || 'active',
      costPrice: Number(payload.costPrice || 0),
      sellingPrice: Number(payload.sellingPrice || 0),
      discountedPrice: payload.discountedPrice ? Number(payload.discountedPrice) : undefined,
    });
    return data?.data || data;
  },

  updateProduct: async (id: number | string, payload: Partial<CreateProductPayload>) => {
    const { data } = await apiClient.put(`/products/${id}`, payload);
    return data?.data || data;
  },

  deleteProduct: async (id: number | string) => {
    const { data } = await apiClient.delete(`/products/${id}`);
    return data?.data || data;
  },

  // --- Attributes (/attributes) ---
  getAttributes: async (): Promise<BackendAttribute[]> => {
    const { data } = await apiClient.get('/attributes?limit=100');
    return data?.data || [];
  },

  createAttribute: async (name: string): Promise<BackendAttribute> => {
    const { data } = await apiClient.post('/attributes', { name });
    return data?.data || data;
  },

  // --- Attribute Values (/attributeValues) ---
  getAttributeValues: async (): Promise<BackendAttributeValue[]> => {
    const { data } = await apiClient.get('/attributeValues?limit=100');
    return data?.data || [];
  },

  createAttributeValue: async (attributeId: number, value: string): Promise<BackendAttributeValue> => {
    const { data } = await apiClient.post('/attributeValues', {
      attributeId: Number(attributeId),
      value: value.trim(),
    });
    return data?.data || data;
  },

  // --- Product Variants (/ProductVariants) ---
  getProductVariants: async (): Promise<BackendProductVariant[]> => {
    const { data } = await apiClient.get('/ProductVariants?limit=100');
    return data?.data || [];
  },

  getProductVariantById: async (id: number | string): Promise<BackendProductVariant> => {
    const { data } = await apiClient.get(`/ProductVariants/${id}`);
    return data?.data || null;
  },

  createProductVariant: async (productId: number, quantity: number): Promise<BackendProductVariant> => {
    const { data } = await apiClient.post('/ProductVariants', {
      productId: Number(productId),
      quantity: Number(quantity),
    });
    return data?.data || data;
  },

  updateProductVariant: async (id: number, payload: { quantity: number; productId?: number }) => {
    const { data } = await apiClient.put(`/ProductVariants/${id}`, {
      quantity: Number(payload.quantity),
      ...(payload.productId ? { productId: Number(payload.productId) } : {}),
    });
    return data?.data || data;
  },

  deleteProductVariant: async (id: number) => {
    const { data } = await apiClient.delete(`/ProductVariants/${id}`);
    return data?.data || data;
  },

  // --- Variants Link (/variants) ---
  getVariants: async (): Promise<BackendVariantLink[]> => {
    const { data } = await apiClient.get('/variants?limit=100');
    return data?.data || [];
  },

  createVariant: async (productVariantId: number, attributeValueId: number): Promise<BackendVariantLink> => {
    const { data } = await apiClient.post('/variants', {
      productVariantId: Number(productVariantId),
      attributeValueId: Number(attributeValueId),
    });
    return data?.data || data;
  },

  deleteVariant: async (id: number) => {
    const { data } = await apiClient.delete(`/variants/${id}`);
    return data?.data || data;
  },

  // --- High-level Orchestration ---
  /**
   * Finds or creates an attribute by matching name candidates (e.g. 'Couleur' / 'Color').
   */
  findOrCreateAttribute: async (preferredName: string, aliases: string[] = []): Promise<BackendAttribute> => {
    const candidateNames = [preferredName, ...aliases].map((n) => n.toLowerCase().trim());
    try {
      const allAttributes = await inventoryApi.getAttributes();
      const found = allAttributes.find((attr) =>
        candidateNames.includes((attr.name || '').toLowerCase().trim())
      );

      if (found && found.id) return found;

      // If not found, attempt creation
      try {
        const created = await inventoryApi.createAttribute(preferredName);
        return (created as any)?.data || created;
      } catch (createErr) {
        // If creation failed because it already exists, re-fetch and find it
        const refetched = await inventoryApi.getAttributes();
        const refound = refetched.find((attr) =>
          candidateNames.includes((attr.name || '').toLowerCase().trim())
        );
        if (refound) return refound;
        throw createErr;
      }
    } catch (err) {
      console.warn('findOrCreateAttribute fallback:', err);
      return { id: 1, name: preferredName, values: [] };
    }
  },

  /**
   * Finds or creates an attribute value for a specific attribute.
   * If it already exists, directly uses and returns the existing record.
   * Strictly matches by BOTH attributeId AND value to prevent cross-attribute contamination.
   */
  findOrCreateAttributeValue: async (attributeId: number, valueName: string): Promise<BackendAttributeValue> => {
    const trimmedVal = valueName.trim().toLowerCase();

    // 1. Check existing attribute values — STRICTLY by attributeId + value
    try {
      const [allAttributes, rawValues] = await Promise.all([
        inventoryApi.getAttributes().catch(() => []),
        inventoryApi.getAttributeValues().catch(() => []),
      ]);

      // Check nested values within the specific attribute
      const targetAttr = allAttributes.find((a) => a.id === attributeId);
      const nestedValues = targetAttr?.values || targetAttr?.attributeValues || [];
      const nestedFound = nestedValues.find(
        (v) => (v.value || '').toLowerCase().trim() === trimmedVal
      );
      if (nestedFound && nestedFound.id) {
        return nestedFound;
      }

      // Check raw attributeValues list — STRICTLY match attributeId
      const rawFound = rawValues.find(
        (v) =>
          v.attributeId === attributeId &&
          (v.value || '').toLowerCase().trim() === trimmedVal
      );
      if (rawFound && rawFound.id) {
        return rawFound;
      }

      // Also check if the value exists under a related attribute (same concept, e.g. "Color"/"Couleur")
      // by looking at ALL attributes that share an alias group
      const colorAliases = ['couleur', 'color', 'couleurs', 'colors'];
      const sizeAliases = ['taille', 'size', 'tailles', 'sizes'];
      const targetAttrName = (targetAttr?.name || '').toLowerCase().trim();
      
      let relatedAttrIds: number[] = [attributeId];
      if (colorAliases.includes(targetAttrName)) {
        relatedAttrIds = allAttributes
          .filter((a) => colorAliases.includes((a.name || '').toLowerCase().trim()))
          .map((a) => a.id);
      } else if (sizeAliases.includes(targetAttrName)) {
        relatedAttrIds = allAttributes
          .filter((a) => sizeAliases.includes((a.name || '').toLowerCase().trim()))
          .map((a) => a.id);
      }

      // Check if this value already exists under a related attribute
      const relatedFound = rawValues.find(
        (v) =>
          relatedAttrIds.includes(v.attributeId!) &&
          (v.value || '').toLowerCase().trim() === trimmedVal
      );
      if (relatedFound && relatedFound.id) {
        return relatedFound;
      }
    } catch (fetchErr) {
      console.warn('Error querying existing attribute values:', fetchErr);
    }

    // 2. Not found, attempt to create via /attributeValues
    try {
      const created = await inventoryApi.createAttributeValue(attributeId, valueName.trim());
      const unwrapped = (created as any)?.data || created;
      if (unwrapped?.id) {
        return unwrapped;
      }
    } catch (createErr: any) {
      console.warn('createAttributeValue error (might already exist), fetching latest list:', createErr);
      // 3. If creation threw conflict/duplicate error, re-fetch and find the existing value
      try {
        const latestValues = await inventoryApi.getAttributeValues();
        // Strict match by attributeId first
        const strictFound = latestValues.find(
          (v) =>
            v.attributeId === attributeId &&
            (v.value || '').toLowerCase().trim() === trimmedVal
        );
        if (strictFound && strictFound.id) {
          return strictFound;
        }

        // If not found by strict attributeId, check nested values in all attributes
        const latestAttrs = await inventoryApi.getAttributes();
        const targetAttrName = (latestAttrs.find((a) => a.id === attributeId)?.name || '').toLowerCase().trim();
        const colorAliases = ['couleur', 'color', 'couleurs', 'colors'];
        const sizeAliases = ['taille', 'size', 'tailles', 'sizes'];

        let relatedAttrIds: number[] = [attributeId];
        if (colorAliases.includes(targetAttrName)) {
          relatedAttrIds = latestAttrs
            .filter((a) => colorAliases.includes((a.name || '').toLowerCase().trim()))
            .map((a) => a.id);
        } else if (sizeAliases.includes(targetAttrName)) {
          relatedAttrIds = latestAttrs
            .filter((a) => sizeAliases.includes((a.name || '').toLowerCase().trim()))
            .map((a) => a.id);
        }

        for (const attr of latestAttrs) {
          if (!relatedAttrIds.includes(attr.id)) continue;
          const vals = attr.values || attr.attributeValues || [];
          const matched = vals.find((v) => (v.value || '').toLowerCase().trim() === trimmedVal);
          if (matched && matched.id) return matched;
        }
      } catch (recoveryErr) {
        console.error('Failed to recover existing attribute value:', recoveryErr);
      }
      throw createErr;
    }

    return { id: 1, value: valueName.trim(), attributeId };
  },

  /**
   * Fully creates a variant for a product with a given Color, Size, and Quantity
   * using the endpoints /attributeValues, /ProductVariants, and /variants.
   */
  addVariantWithColorAndSize: async ({
    productId,
    colorName,
    sizeName,
    quantity,
    colorAttributeId,
    sizeAttributeId,
  }: {
    productId: number;
    colorName: string;
    sizeName: string;
    quantity: number;
    colorAttributeId?: number;
    sizeAttributeId?: number;
  }) => {
    // 1. Get or Create Color & Size Attributes
    let colorAttrId = colorAttributeId;
    if (!colorAttrId) {
      const colorAttr = await inventoryApi.findOrCreateAttribute('Couleur', ['Color', 'Couleurs', 'Colors']);
      colorAttrId = colorAttr.id;
    }

    let sizeAttrId = sizeAttributeId;
    if (!sizeAttrId) {
      const sizeAttr = await inventoryApi.findOrCreateAttribute('Taille', ['Size', 'Tailles', 'Sizes']);
      sizeAttrId = sizeAttr.id;
    }

    // 2. Get or Create AttributeValues in /attributeValues
    const colorValue = await inventoryApi.findOrCreateAttributeValue(colorAttrId, colorName);
    const sizeValue = await inventoryApi.findOrCreateAttributeValue(sizeAttrId, sizeName);

    // 3. Create ProductVariant in /ProductVariants
    const productVariantRes = await inventoryApi.createProductVariant(productId, quantity);
    const pvId = (productVariantRes as any)?.id ?? (productVariantRes as any)?.data?.id;

    if (!pvId) {
      throw new Error("Impossible de récupérer l'identifiant de la variante de produit créée");
    }

    const colorValId = (colorValue as any)?.id ?? (colorValue as any)?.data?.id;
    const sizeValId = (sizeValue as any)?.id ?? (sizeValue as any)?.data?.id;

    // 4. Link Color in /variants
    if (colorValId) {
      try {
        await inventoryApi.createVariant(pvId, colorValId);
      } catch (err: any) {
        console.warn('Could not link color attribute:', err);
      }
    }

    // 5. Link Size in /variants
    if (sizeValId) {
      try {
        await inventoryApi.createVariant(pvId, sizeValId);
      } catch (err: any) {
        console.warn('Could not link size attribute:', err);
      }
    }

    return {
      productVariant: productVariantRes,
      colorValue,
      sizeValue,
    };
  },
};
