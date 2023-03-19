import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, UseGuards, Req, SerializeOptions, SetMetadata,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import {AuthService} from "../auth/auth.service";
import {Roles} from "../roles/roles.decorator";
import {RoleEnum} from "../roles/roles.enum";
import {AuthGuard} from "@nestjs/passport";
import {RolesGuard} from "../roles/roles.guard";


@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {
    console.log('init')
  }

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

  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  async findAll() {
    return await this.orderService.findAll();
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.orderService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req: any,
  ) {
    //return await this.orderService.update(id, updateOrderDto);
  }

  @ApiBearerAuth()
  @Get('/findOrdersOfUser')
  async findOrdersOfUser(@Req() req: any) {
    console.log(545);
    return await this.orderService.findOrdersOfUser(req.user.id);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.orderService.remove(id);
  }
}
