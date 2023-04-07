import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { ProductOrder } from './entities/product-order.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(ProductOrder)
    private readonly productOrderRepository: Repository<ProductOrder>,
  ) {}
  async create(createOrderDto: CreateOrderDto, user: User) {
    const products = createOrderDto.productToOrder;
    const order = await this.orderRepository.create({
      ...createOrderDto,
      user,
    });
    const savedOrder = await this.orderRepository.save(order);
    const productsToSave = [];
    for (const item of products) {
      productsToSave.push({
        ...item,
        order: savedOrder,
      });
    }
    await this.productOrderRepository.save(productsToSave);
    return savedOrder;
  }

  async findAll() {
    return await this.orderRepository
      .createQueryBuilder('order')
      .orderBy('order.createdAt', 'DESC')
      .getMany();
  }

  async getOrder(id: string) {
    return await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.productToOrder', 'product_to_order')
      .where('order.id = :id', { id })
      .getOne();
  }

  async deleteOrderProducts(product) {
    return await this.productOrderRepository.delete({ id: product.id });
  }

  async findOne(id: string) {
    return await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.productToOrder', 'product_to_order')
      .leftJoinAndSelect('order.user', 'user')
      .where('order.id = :id', { id })
      .getOne();
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const orderData = await this.getOrder(id);

    //delete product of order if it does not exist anymore
    if (orderData.productToOrder) {
      const filteredData = orderData.productToOrder.filter(
        (product) =>
          !updateOrderDto.productToOrder.find(
            (updateProduct) => updateProduct.id === product.id,
          ),
      );
      for (const deletedItem of filteredData) {
        await this.deleteOrderProducts(deletedItem);
      }
    }

    //save updated order
    const product = updateOrderDto.productToOrder;
    const order = await this.orderRepository.preload({
      id,
      ...updateOrderDto,
    });

    if (!order) {
      throw new NotFoundException(`There is no order under id ${id}`);
    }
    const savedOrder = await this.orderRepository.save(order);
    for (const item of product) {
      await this.productOrderRepository.save({
        ...item,
        order: savedOrder,
      });
    }
  }

  async findMyOrders(userId: number) {
    return await this.orderRepository
      .createQueryBuilder('order')
      .where('order.userId = :userId', { userId })
      .getMany();
  }

  // async findOrdersOfUser(userId: number, orderId: string) {
  //   return await this.orderRepository
  //     .createQueryBuilder('order')
  //     .where('order.id = :orderId', { orderId })
  //     .andWhere('order.userId = :userId', { userId })
  //     .getOne();
  // }

  async remove(id: string) {
    const product = await this.orderRepository.findOne({ where: { id } });
    return await this.orderRepository.remove(product);
  }
}
