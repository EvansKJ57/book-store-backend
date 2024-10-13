import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from '../service/orders.service';
import { OrderResDto, postOrderDto } from 'src/dtos/order.dto';
import { User } from 'src/decorator/user.decorator';
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
  async createOrder(
    @Body() body: postOrderDto,
    @User('id') userId: number,
  ): Promise<OrderResDto> {
    const result = await this.ordersService.createOrderTransaction(
      body,
      userId,
    );

    const createdOrder = await this.ordersService.findOrderOneById(
      result.createdOrderId,
    );

    return new OrderResDto(createdOrder);
  }
}
