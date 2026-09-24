import { AuditableEntityShape } from "../../common"
import { BusinessType } from "../../business-types"

export type Tenant = AuditableEntityShape & {
    name: string;
    slug: string;
    status: string;
    businessTypeId?: number;
    businessType?: BusinessType;
    // subscriptions?: Subscription[];
}
