import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductAttributesToProductsEntity } from '../../products/entities/product-attributes-to-products.entity';

@Entity()
export class ProductAttributes {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @OneToMany(
    () => ProductAttributesToProductsEntity,
    (attributeToProduct) => attributeToProduct.product,
  )
  attributeToProduct: ProductAttributesToProductsEntity[];
}
