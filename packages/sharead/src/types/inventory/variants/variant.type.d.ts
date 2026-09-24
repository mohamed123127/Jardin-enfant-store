import { BaseEntityShape } from "../../common";
export type Variant = BaseEntityShape & {
    productVariantId: number;
    attributeValueId: number;
};
