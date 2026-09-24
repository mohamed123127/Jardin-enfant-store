import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Not, Repository } from 'typeorm';
import { BaseCrudService } from 'src/common/base/services/base-crud.service';
import { VariantEntity } from './entities/variant.entity';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { assertExists } from 'src/common/utils/dataBase-validation.util';
import { AttributeValuesService } from '../attribute-values/attribute-values.service';
import { ProductVariantsService } from '../product-variants/product-variants.service';

@Injectable()
export class VariantsService extends BaseCrudService<VariantEntity, CreateVariantDto, UpdateVariantDto> {
    constructor(
        @InjectRepository(VariantEntity) repo: Repository<VariantEntity>,
        private readonly attributeValuesService: AttributeValuesService,
        private readonly productVariantsService: ProductVariantsService
    ) {
        super(repo);
        this.entityPluralName = "Variants";
    }

    protected override async validateCreate(dto: CreateVariantDto): Promise<void> {
        const attributeValue = await assertExists(this.attributeValuesService, dto.attributeValueId, "Attribute Value");
        await assertExists(this.productVariantsService, dto.productVariantId, "Product VariantEntity");

        const duplicateCount = await this.countBy({
            productVariantId: dto.productVariantId,
            attributeValue: { attributeId: attributeValue.attributeId },
        } as FindOptionsWhere<VariantEntity>);

        if (duplicateCount > 0) {
            throw new ConflictException("Attribute already exists for this variant");
        }
    }

    protected override async validateUpdate(entity: VariantEntity): Promise<void> {
        const attributeValue = await assertExists(this.attributeValuesService, entity.attributeValueId, "Attribute Value");
        await assertExists(this.productVariantsService, entity.productVariantId, "Product VariantEntity");

        const duplicateCount = await this.countBy({
            id: Not(entity.id),
            productVariantId: entity.productVariantId,
            attributeValue: { attributeId: attributeValue.attributeId },
        } as FindOptionsWhere<VariantEntity>);

        if (duplicateCount > 0) {
            throw new ConflictException("Attribute already exists for this variant");
        }
    }
}
