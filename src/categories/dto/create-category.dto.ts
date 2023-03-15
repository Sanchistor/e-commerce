import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @IsString()
  @ApiProperty({ example: 'Electronics' })
  name: string;
}
