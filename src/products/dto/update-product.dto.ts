import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../categories/entities/category.entity';
import { ProductAttributesToProductsEntity } from '../entities/product-attributes-to-products.entity';

export class UpdateProductDto {
  @ApiProperty({ example: 'Samsung' })
  @IsOptional()
  name: string;

  @ApiProperty({ example: '#637577' })
  @IsOptional()
  vendorCode: string;

  @ApiProperty({ example: '7577' })
  @IsOptional()
  weight: string;

  @ApiProperty({ example: 63757 })
  @IsOptional()
  price: number;

  @ApiProperty({ example: 'example.jpg' })
  @IsOptional()
  photo: string;

  @ApiProperty({ example: 'some car' })
  @IsOptional()
  description: string;

  @ApiProperty({ example: '1000x5468' })
  @IsOptional()
  size: string;

  @ApiProperty({ type: [String] })
  @IsOptional()
  category: Category[];

  @ApiProperty({ type: [String] })
  @IsOptional()
  productToAttribute: ProductAttributesToProductsEntity[];
}
