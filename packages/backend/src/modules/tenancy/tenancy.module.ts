import { Module } from "@nestjs/common";
import { TenantsModule } from "./tenants/tenants.module";
import { PlansModule } from "./plans/plans.module";
import { SubscriptionsModule } from "./subscriptions/subscriptions.module";
import { PlanLimitsModule } from "./plan-limits/plan-limits.module";
import { BusinessTypeModule } from "./business-types/business-type.module";

@Module({
    imports: [
        TenantsModule,
        PlansModule,
        SubscriptionsModule,
        PlanLimitsModule,
        BusinessTypeModule
    ],
    exports: [
        TenantsModule,
        PlansModule,
        SubscriptionsModule,
        PlanLimitsModule,
        BusinessTypeModule
    ]
})
export class TenancyModule { }
