import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderAdminController } from './order.admin.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Order} from "./entities/order.entity";
import {ProductOrder} from "./entities/product-order.entity";
import {UsersModule} from "../users/users.module";
import {AuthModule} from "../auth/auth.module";
import {OrderUserController} from "./order.user.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, ProductOrder]),
    UsersModule,
    AuthModule,
  ],
  controllers: [OrderAdminController, OrderUserController],
  providers: [OrderService],
})
export class OrderModule {}
