import { BaseEntityShape } from "../../common";
export type AttributeValue = BaseEntityShape & {
    value: string;
    attributeId: number;
};
