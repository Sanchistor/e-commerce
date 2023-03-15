import { Injectable } from '@nestjs/common';
import { CreateProductAttributeDto } from './dto/create-product-attribute.dto';
import { UpdateProductAttributeDto } from './dto/update-product-attribute.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductAttributes } from './entities/product-attribute.entity';

@Injectable()
export class ProductAttributesService {
  constructor(
    @InjectRepository(ProductAttributes)
    private readonly productAttributesRepository: Repository<ProductAttributes>,
  ) {}
  async create(createProductAttributeDto: CreateProductAttributeDto) {
    const attributes = await this.productAttributesRepository.create(
      createProductAttributeDto,
    );

    return this.productAttributesRepository.save(attributes);
  }

  async findAll() {
    return await this.productAttributesRepository.find();
  }

  async findOne(id: string) {
    return await this.productAttributesRepository.findOne({ where: { id } });
  }

  async update(updateProductAttributeDto: UpdateProductAttributeDto) {
    return await this.productAttributesRepository.save(
      updateProductAttributeDto,
    );
  }

  async remove(id: string) {
    const attributes = await this.productAttributesRepository.findOne({
      where: { id },
    });
    return await this.productAttributesRepository.remove(attributes);
  }
}
