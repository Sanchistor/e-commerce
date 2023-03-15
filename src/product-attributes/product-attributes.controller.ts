import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ProductAttributesService } from './product-attributes.service';
import { CreateProductAttributeDto } from './dto/create-product-attribute.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { UpdateProductAttributeDto } from './dto/update-product-attribute.dto';

@ApiTags('Product-attributes')
@Controller('product-attributes')
export class ProductAttributesController {
  constructor(
    private readonly productAttributesService: ProductAttributesService,
  ) {}

  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  create(@Body() createProductAttributeDto: CreateProductAttributeDto) {
    return this.productAttributesService.create(createProductAttributeDto);
  }
  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  findAll() {
    return this.productAttributesService.findAll();
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productAttributesService.findOne(id);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductAttributeDto: UpdateProductAttributeDto,
  ) {
    return this.productAttributesService.update(updateProductAttributeDto);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productAttributesService.remove(id);
  }
}
