import { BaseEntityShape } from "../common";

export type BusinessType = BaseEntityShape & {
    name: string;
    description?: string;
};
