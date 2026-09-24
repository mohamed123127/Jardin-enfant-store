import { Module } from '@nestjs/common';
import { BusinessTypeService } from './business-type.service';
import { BusinessTypeController } from './business-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessTypeEntity } from './entities/business-type.entity';
import { BusinessTypeMapper } from './mappers/business-type.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessTypeEntity])],
  controllers: [BusinessTypeController],
  providers: [BusinessTypeService, BusinessTypeMapper],
  exports: [BusinessTypeService, BusinessTypeMapper],
})
export class BusinessTypeModule { }
