import { BaseEntityShape } from "../../common";
export type ProductVariant = BaseEntityShape & {
    quantity: number;
    productId: number;
};
