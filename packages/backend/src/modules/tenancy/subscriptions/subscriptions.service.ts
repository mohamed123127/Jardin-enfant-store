import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from 'src/common/base/services/base-crud.service';
import { SubscriptionEntity } from './entities/subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { TenantsService } from '../tenants/tenants.service';
import { PlansService } from '../plans/plans.service';
import { assertExists } from 'src/common/utils/dataBase-validation.util';

@Injectable()
export class SubscriptionsService extends BaseCrudService<SubscriptionEntity, CreateSubscriptionDto, UpdateSubscriptionDto> {
    constructor(
        @InjectRepository(SubscriptionEntity) repo: Repository<SubscriptionEntity>,
        private readonly tenantsService: TenantsService,
        private readonly plansService: PlansService,
    ) {
        super(repo);
        this.defaultRelations = { tenant: true, plan: true };
    }

    protected override async validateCreate(entity: SubscriptionEntity): Promise<void> {
        await assertExists(this.tenantsService, entity.tenantId, 'Tenant');
        await assertExists(this.plansService, entity.planId, 'Plan');
    }

    protected override async validateUpdate(entity: SubscriptionEntity): Promise<void> {
        await assertExists(this.tenantsService, entity.tenantId, 'Tenant');
        await assertExists(this.plansService, entity.planId, 'Plan');
    }
}
