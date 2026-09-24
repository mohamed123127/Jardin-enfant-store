import { BaseEntityShape } from "../../common";
import { BusinessType } from "../../business-types";

export type Category = BaseEntityShape & {
    name: string;
    businessTypes?: BusinessType[];
}
