import { BaseEntityShape } from "../../common";
import { AttributeValue } from "./attribute-value.type";
import { BusinessType } from "../../business-types";
export type Attribute = BaseEntityShape & {
    name: string;
    attributeValues: AttributeValue[];
    businessTypes?: BusinessType[];
};
