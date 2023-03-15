import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductAttributeDto {
  @IsString()
  @ApiProperty({ example: 'diagonal' })
  name: string;
}
