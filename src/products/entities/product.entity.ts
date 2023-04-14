import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { ProductAttributesToProductsEntity } from './product-attributes-to-products.entity';
import {ProductOrder} from "../../order/entities/product-order.entity";
import {FileEntity} from "../../files/entities/file.entity";

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ length: 50 })
  vendorCode: string;

  @Column({ length: 10 })
  weight: string;

  @Column('decimal', {
    precision: 8,
    scale: 2,
  })
  price: number;

  @OneToMany(() => FileEntity, (photo) => photo.product)
  photo: FileEntity[];

  @Column()
  description: string;

  @Column()
  size: string;

  @ManyToMany(() => Category, (category) => category.product)
  @JoinTable()
  category: Category[];

  @OneToMany(
    () => ProductAttributesToProductsEntity,
    (productToAttribute) => productToAttribute.product,
  )
  productToAttribute: ProductAttributesToProductsEntity[];

  @OneToMany(() => ProductOrder, (order) => order.product, {
    onDelete: 'CASCADE',
  })
  orderToProduct: ProductOrder[];
}
