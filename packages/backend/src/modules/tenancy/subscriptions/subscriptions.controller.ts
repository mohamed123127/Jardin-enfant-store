import { Controller } from '@nestjs/common';
import { BaseCrudController } from 'src/common/base/controllers/base-crud.controller';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionEntity } from './entities/subscription.entity';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionMapper } from './mappers/subscription.mapper';

@Controller('subscriptions')
export class SubscriptionsController extends BaseCrudController(
    CreateSubscriptionDto,
    UpdateSubscriptionDto,
)<SubscriptionEntity> {
    constructor(service: SubscriptionsService, mapper: SubscriptionMapper) {
        super(service, mapper);
    }
}
