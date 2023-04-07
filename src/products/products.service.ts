import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductAttributesToProductsEntity } from './entities/product-attributes-to-products.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductAttributesToProductsEntity)
    private readonly productAttributesRepository: Repository<ProductAttributesToProductsEntity>,
  ) {}

  async findAll() {
    return await this.productRepository.find();
  }

  async findManyByIds(arrayOfIds: Array<string>) {
    const products = await this.productRepository
      .createQueryBuilder()
      .where('id IN(:...arrayOfIds)', { arrayOfIds })
      .getMany();

    return products;
  }

  async findOne(id: string) {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.productToAttribute', 'attribute')
      .where('product.id = :id', { id })
      .getOne();

    if (!product) {
      throw new NotFoundException(`There is no product under id ${id}`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto) {
    const attributes = createProductDto.productToAttribute;
    const product = await this.productRepository.create({
      ...createProductDto,
    });
    const savedProduct = await this.productRepository.save(product);
    const attributesToSave = [];
    for (const item of attributes) {
      attributesToSave.push({
        ...item,
        product: savedProduct,
      });
    }

    await this.productAttributesRepository.save(attributesToSave);
    return savedProduct;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const productData = await this.findOne(id);

    //delete attributes of product if they do not exist anymore
    if (productData.productToAttribute) {
      const filteredData = productData.productToAttribute.filter(
        (product) =>
          !updateProductDto.productToAttribute.find(
            (updateProduct) => updateProduct.id === product.id,
          ),
      );
      for (const deletedItem of filteredData) {
        await this.deleteAttributesOfProduct(deletedItem);
      }
    }

    //save product with attributes and categories
    const attributes = updateProductDto.productToAttribute;
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto,
    });

    if (!product) {
      throw new NotFoundException(`There is no product under id ${id}`);
    }
    const savedProduct = await this.productRepository.save(product);
    for (const item of attributes) {
      await this.productAttributesRepository.save({
        ...item,
        product: savedProduct,
      });
    }
  }

  async remove(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });
    return await this.productRepository.remove(product);
  }

  async deleteAttributesOfProduct(attribute) {
    return await this.productAttributesRepository.delete({ id: attribute.id });
  }
}
