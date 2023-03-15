import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductAttributeDto } from './create-product-attribute.dto';
import { IsString } from 'class-validator';

export class UpdateProductAttributeDto extends PartialType(
  CreateProductAttributeDto,
) {
  @IsString()
  @ApiProperty({ example: 'Width' })
  name: string;
}
