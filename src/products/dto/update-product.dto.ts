import {IsArray, IsNumber, IsOptional, IsString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../categories/entities/category.entity';
import { ProductAttributesToProductsEntity } from '../entities/product-attributes-to-products.entity';

export class UpdateProductDto {
  @ApiProperty({ example: 'Samsung' })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ example: 'German' })
  @IsOptional()
  @IsString()
  language: string;

  @ApiProperty({ example: 63757 })
  @IsOptional()
  @IsNumber()
  price: number;

  @ApiProperty({ example: 2019 })
  @IsOptional()
  @IsNumber()
  year: number;

  @ApiProperty({ example: 'some car' })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ example: '1000x5468' })
  @IsOptional()
  @IsString()
  size: string;

  @ApiProperty({ type: [String] })
  @IsOptional()
  @IsArray()
  category: Category[];

  @ApiProperty({ type: [String] })
  @IsOptional()
  @IsArray()
  productToAttribute: ProductAttributesToProductsEntity[];
}
