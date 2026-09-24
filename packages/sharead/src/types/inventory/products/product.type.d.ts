import { TenantScopedEntityShape } from "../../common";
export type Product = TenantScopedEntityShape & {
    name: string;
    previewImage: string;
    barcode: string;
    sku?: string;
    ref?: string;
    description?: string;
    costPrice: number;
    sellingPrice: number;
    discountedPrice?: number;
    quantity?: number;
    status: 'active' | "inactive" | "archived";
};
