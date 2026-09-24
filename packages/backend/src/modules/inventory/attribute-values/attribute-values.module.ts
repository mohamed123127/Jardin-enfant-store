import { Module } from '@nestjs/common';
import { AttributeValuesService } from './attribute-values.service';
import { AttributeValuesController } from './attribute-values.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeValueEntity } from './entities/attribute-value.entity';
import { AttributesModule } from '../attributes/attributes.module';
import { AttributeValueMapper } from './mappers/attribute-value.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([AttributeValueEntity]), AttributesModule],
  controllers: [AttributeValuesController],
  providers: [AttributeValuesService, AttributeValueMapper],
  exports: [AttributeValuesService, AttributeValueMapper],
})
export class AttributeValuesModule { }
