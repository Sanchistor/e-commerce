import { IsArray, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductAttributesToProductsEntity } from '../entities/product-attributes-to-products.entity';
import { Category } from '../../categories/entities/category.entity';

export class CreateProductDto {
  @IsString()
  @ApiProperty({ example: 'Iphone 12' })
  name: string;

  @IsString()
  @ApiProperty({ example: '1kg' })
  weight: string;

  @IsNumber()
  @ApiProperty({ example: 1000 })
  price: number;

  @IsString()
  @ApiProperty({ example: 'Cool iphone' })
  description: string;

  @IsString()
  @ApiProperty({ example: '1024x530' })
  size: string;

  @IsArray()
  @ApiProperty({ type: [String] })
  category: Category[];

  @IsArray()
  @ApiProperty({ type: [String] })
  productToAttribute: ProductAttributesToProductsEntity[];
}
