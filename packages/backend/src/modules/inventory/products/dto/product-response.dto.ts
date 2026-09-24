import { VariantResponseDto } from "src/modules/inventory/variants/dto/variant-response.dto";


export type ProductResponseDto = {
    id: number;
    name: string;
    previewImage: string;
    barcode: string;
    description?: string;
    sku?: string;
    ref?: string;
    costPrice?: number;
    sellingPrice: number;
    discountedPrice?: number;
    quantity: number;
    images: string[];
    variants: VariantResponseDto[];
}

export type ProductSummaryDto = {
    id: number;
    name: string;
    previewImage: string;
    barcode: string;
    quantity: number;
    costPrice?: number;
    sellingPrice: number;
    discountedPrice?: number;
    status: "active" | "inactive" | "archived";
}