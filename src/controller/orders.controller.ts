import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from '../service/orders.service';
import { OrderResDto, postOrderDto } from 'src/dtos/order.dto';
import { User } from 'src/decorator/user.decorator';
import { QueryRunner } from 'typeorm';
import { Qr } from 'src/decorator/queryRunner.decorator';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { ApiTags } from '@nestjs/swagger';
import { Transactional } from 'src/decorator/transactional.decorator';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  async getOrders(@User('id') userId: number) {
    const orders = await this.ordersService.getOrders(userId);
    return orders.map((order) => new OrderResDto(order));
  }

  @Transactional()
  @Post()
  @UseGuards(AccessTokenGuard)
  async createOrder(
    @Body() body: postOrderDto,
    @User('id') userId: number,
    @Qr() qr: QueryRunner,
  ) {
    const result = await this.ordersService.createOrderTransaction(
      body,
      userId,
      qr,
    );
    const foundNewOrder = await this.ordersService.findOrderOneById(
      result.orderId,
    );
    return new OrderResDto(foundNewOrder);
  }
}
