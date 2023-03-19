import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';
import { ProductAttributes } from '../../product-attributes/entities/product-attribute.entity';

@Entity('product_attributes_to_products')
export class ProductAttributesToProductsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  value: string;

  @ManyToOne(() => Product, (product) => product.productToAttribute, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @ManyToOne(
    () => ProductAttributes,
    (attribute) => attribute.attributeToProduct,
    { onDelete: 'CASCADE' },
  )
  attribute: ProductAttributes;
}
