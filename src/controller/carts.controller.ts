import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CartsService } from '../service/carts.service';
import { AccessTokenGuard } from 'src/auth/guard/bearToken.guard';
import { User } from 'src/decorator/user.decorator';
import { CartsResDto, CreateCartDto } from 'src/dtos/cart.dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  async create(@Body() body: CreateCartDto, @User('id') userId: number) {
    const newCart = await this.cartsService.createCart(body, userId);
    return new CartsResDto(newCart);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  async getCarts(@User('id') userId: number) {
    const carts = await this.cartsService.findActiveCarts(userId);
    return carts.map((cart) => new CartsResDto(cart));
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  async removeCart(@Param('id', ParseIntPipe) cartId: number) {
    const removed = await this.cartsService.remove(cartId);
    return new CartsResDto(removed);
  }
}
