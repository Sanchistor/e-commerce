import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ProductOrder } from './product-order.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'float', default: 0.0 })
  price: number;

  @Column()
  date: string;

  @Column()
  address: string;

  @ManyToOne(() => User, (user) => user.order, {
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => ProductOrder, (product) => product.order, {
    onDelete: 'CASCADE',
  })
  productToOrder: ProductOrder[];

  @CreateDateColumn()
  createdAt: Date;
}
