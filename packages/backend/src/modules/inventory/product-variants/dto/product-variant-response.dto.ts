import { SpecificationResponseDto } from "src/modules/inventory/attribute-values/dto/attributeValues-response.dto";

export type ProductVariantResponseDto = {
    id: number;
    quantity: number;
    productId: number;
    specifications: SpecificationResponseDto[];
}

export type ProductVariantSummaryDto = ProductVariantResponseDto;
