import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionEntity } from './entities/subscription.entity';
import { SubscriptionMapper } from './mappers/subscription.mapper';
import { TenantsModule } from '../tenants/tenants.module';
import { PlansModule } from '../plans/plans.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([SubscriptionEntity]),
        TenantsModule,
        PlansModule,
    ],
    controllers: [SubscriptionsController],
    providers: [SubscriptionsService, SubscriptionMapper],
    exports: [SubscriptionsService, SubscriptionMapper],
})
export class SubscriptionsModule {}
