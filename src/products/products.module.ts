import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { FilesModule } from '../files/files.module';
import { CategoriesModule } from '../categories/categories.module';
import { ProductAttributesToProductsEntity } from './entities/product-attributes-to-products.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductAttributesToProductsEntity]),
    FilesModule,
    CategoriesModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
