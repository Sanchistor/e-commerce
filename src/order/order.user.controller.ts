import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch, Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderService } from './order.service';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import {Roles} from "../roles/roles.decorator";
import {RoleEnum} from "../roles/roles.enum";
import {RolesGuard} from "../roles/roles.guard";
import {CreateOrderDto} from "./dto/create-order.dto";

@ApiBearerAuth()
@Roles(RoleEnum.admin)

@ApiTags('Order-User')
@Controller('order-user')
export class OrderUserController {
  constructor(
    private readonly orderService: OrderService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard('anonymous'))
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    let user = await this.usersService.findOne({
      email: createOrderDto.email,
    });
    let password = null;
    if (!user) {
      password = Math.random().toString(36).slice(-8);
      const { name, surname, email } = createOrderDto;
      const newUser = {
        email: email,
        password: password,
        firstName: name,
        lastName: surname,
      };
      user = await this.authService.register(newUser);
    }
    return {
      ...(await this.orderService.create(createOrderDto, user)),
      password,
    };
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('/findOrdersOfUser')
  async findOrdersOfUser(@Req() req: any) {
    return await this.orderService.findMyOrders(req.user.id);
  }
}
