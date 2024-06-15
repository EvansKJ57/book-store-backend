import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OrdersService } from '../service/orders.service';
import { OrderResDto, postOrderDto } from 'src/dtos/order.dto';
import { BearerTokenGuard } from 'src/auth/guard/bearToken.guard';
import { User } from 'src/decorator/user.decorator';
import { SetTransaction } from 'src/interceptor/transaction.interceptor';
import { QueryRunner } from 'typeorm';
import { Qr } from 'src/decorator/queryRunner.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(BearerTokenGuard)
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
