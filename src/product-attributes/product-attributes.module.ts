import { Module } from '@nestjs/common';
import { ProductAttributesService } from './product-attributes.service';
import { ProductAttributesController } from './product-attributes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAttributes } from './entities/product-attribute.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductAttributes])],
  controllers: [ProductAttributesController],
  providers: [ProductAttributesService],
})
export class ProductAttributesModule {}
