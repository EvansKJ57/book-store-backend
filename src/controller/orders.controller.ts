import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OrdersService } from '../service/orders.service';
import { OrderResDto, postOrderDto } from 'src/dtos/order.dto';
import { User } from 'src/decorator/user.decorator';
import { SetTransaction } from 'src/interceptor/transaction.interceptor';
import { QueryRunner } from 'typeorm';
import { Qr } from 'src/decorator/queryRunner.decorator';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';
import { ApiTags } from '@nestjs/swagger';

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

  @Post()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(SetTransaction)
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
