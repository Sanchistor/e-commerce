import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductAttributesToProductsEntity } from './entities/product-attributes-to-products.entity';
import { FileEntity } from '../files/entities/file.entity';
import { S3 } from 'aws-sdk';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductAttributesToProductsEntity)
    private readonly productAttributesRepository: Repository<ProductAttributesToProductsEntity>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async findAll() {
    return await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.productToAttribute', 'attribute')
        .leftJoinAndSelect('product.photo', 'photo')
        .select(['product', 'category', 'attribute', 'photo.path'])
        .getMany();
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
      .leftJoinAndSelect('product.photo', 'photo')
      .where('product.id = :id', { id })
      .select(['product', 'category', 'attribute', 'photo.path'])
      .getOne();

    if (!product) {
      throw new NotFoundException(`There is no product under id ${id}`);
    }
    return product;
  }

  generateRandomCode() {
    const length = 5;
    let code = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }

  async create(createProductDto: CreateProductDto) {
    const attributes = createProductDto.productToAttribute;
    const vendorCode = this.generateRandomCode();
    const product = await this.productRepository.create({
      ...createProductDto,
      vendorCode: vendorCode,
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

  async savePhotoOfProduct(id: string, file: FileEntity) {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
    });
    product.photo = [file];
    return await this.productRepository.save(product);
  }

  async deletePhotoFromS3(id: string) {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.photo', 'photo')
      .where('product.id = :id', { id })
      .getOne();

    const link = product.photo[0].path;
    const s3 = new S3();

    const bucketName = link.split('.')[0].split('//')[1];
    const objectKey = link.split('/').slice(3).join('/');

    const params = {
      Bucket: bucketName,
      Key: objectKey,
    };

    s3.deleteObject(params, function (err, data) {
      if (err) console.log(err, err.stack);
      else console.log(data);
    });

    return await this.fileRepository.delete({ id: product.photo[0].id });
  }

  async getSimilarProducts(productId: string) {
    const product = await this.findOne(productId);

    const allProducts = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.productToAttribute', 'productToAttribute')
      .where('product.id != :id', { id: productId })
      .getMany();

    const similarityMap = allProducts.map((p) => {
      let similarity =
        (product.language === p.language ? 1 : 0) +
        (Math.abs(product.price - p.price) <= 200 ? 1 : 0) +
        (Math.abs(product.year - p.year) <= 5 ? 1 : 0);

      p.productToAttribute.forEach((attribute) => {
        const attributeValue = attribute.value;

        if (
          product.productToAttribute.some((a) => a.value === attributeValue)
        ) {
          similarity++;
        }
      });
      return { product: p, similarity };
    });

    const sortedProducts = similarityMap.sort(
      (a, b) => b.similarity - a.similarity,
    );

    return sortedProducts.slice(0, 12).map((p) => p.product);
  }
}
