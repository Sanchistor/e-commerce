import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Order} from "./order.entity";
import {Product} from "../../products/entities/product.entity";

@Entity()
export class ProductOrder {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    quantity: number;

    @ManyToOne(()=>Order, (order)=>order.productToOrder, {onDelete: "CASCADE"})
    order: Order;

    @ManyToOne(()=>Product, (product)=>product.orderToProduct)
    product: Product;
}