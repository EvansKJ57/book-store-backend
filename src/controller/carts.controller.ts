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
import { UserModel } from 'src/entities/user.entity';
import { CreateCartDto } from 'src/dtos/cart.dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}
  @Post()
  @UseGuards(AccessTokenGuard)
  create(@Body() body: CreateCartDto, @User() user: UserModel) {
    return this.cartsService.create(body, user);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  getCarts(@User('id') userId: number) {
    return this.cartsService.findAll(userId);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  removeCart(@Param('id', ParseIntPipe) cartId: number) {
    return this.cartsService.remove(cartId);
  }
}
