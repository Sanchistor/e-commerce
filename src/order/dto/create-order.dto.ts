import {IsArray, IsEmail, IsNumber, IsString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {ProductOrder} from "../entities/product-order.entity";

export class CreateOrderDto {
  @ApiProperty({ example: 'Azenes iela 7' })
  @IsString()
  address: string;

  @ApiProperty({ example: '16/07/24' })
  @IsString()
  date: string;

  @ApiProperty({ example: '124.646' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'test2@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Ivan' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Dalov' })
  @IsString()
  surname: string;

  @IsArray()
  @ApiProperty({ type: [String] })
  productToOrder: ProductOrder[];
}
