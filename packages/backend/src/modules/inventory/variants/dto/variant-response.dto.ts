import { SpecificationResponseDto } from "src/modules/inventory/attribute-values/dto/attributeValues-response.dto";

export type VariantResponseDto = {
    id: number;
    quantity: number;
    specifications: SpecificationResponseDto[];
}

export type VariantSummaryDto = VariantResponseDto;
