import { Module } from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { AttributesController } from './attributes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeEntity } from './entities/attribute.entity';
import { AttributeMapper } from './mappers/attribute.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([AttributeEntity])],
  controllers: [AttributesController],
  providers: [AttributesService, AttributeMapper],
  exports: [AttributesService, AttributeMapper],
})
export class AttributesModule { }
