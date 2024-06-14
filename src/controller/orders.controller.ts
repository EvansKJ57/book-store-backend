import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from '../service/orders.service';
import { OrderResDto, postOrderDto } from 'src/dtos/order.dto';
import { BearerTokenGuard } from 'src/auth/guard/bearToken.guard';
import { User } from 'src/decorator/user.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(BearerTokenGuard)
  async createOrder(@Body() body: postOrderDto, @User('id') userId: number) {
    const result = await this.ordersService.postOrder(body, userId);
    return new OrderResDto(result);
  }
}
