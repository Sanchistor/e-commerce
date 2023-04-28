import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';

import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from '../files/files.service';

@ApiTags('Product')
@Controller('product')
export class ProductsController {
  constructor(
    private readonly productService: ProductsService,
    private readonly filesService: FilesService,
  ) {}


  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete('deletePhotoFromS3/:id')
  async deletePhotoFromS3(@Param('id') id: string) {
    return await this.productService.deletePhotoFromS3(id);
  }

  @Get('getSimilarProducts/:id')
  async getSimilarProducts(@Param('id') id: string){
      return await this.productService.getSimilarProducts(id);
  }

  @Get()
  async findAll() {
    return await this.productService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productService.findOne(id);
  }
  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.create(createProductDto);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productService.update(id, updateProductDto);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.productService.remove(id);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('uploadFileForProduct/:id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Param('id') id: string, @UploadedFile() file) {
    const uploadedFile = await this.filesService.uploadFile(file);
    return await this.productService.savePhotoOfProduct(id, uploadedFile);
  }
}
