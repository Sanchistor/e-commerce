import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ProductOrder } from '../entities/product-order.entity';

export class UpdateOrderDto {
  @ApiProperty({ example: 'Azenes iela 466' })
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty({ example: '16/07/24' })
  @IsOptional()
  @IsString()
  date: string;

  @ApiProperty({ example: '124.646' })
  @IsOptional()
  @IsNumber()
  price: number;

  @IsArray()
  @IsOptional()
  @ApiProperty({ type: [String] })
  productToOrder: ProductOrder[];
}
