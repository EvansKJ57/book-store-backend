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
import { User } from 'src/decorator/user.decorator';
import { CartsResDto, CreateCartDto } from 'src/dtos/cart.dto';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('carts')
@ApiBearerAuth('access-token')
@UseGuards(AccessTokenGuard)
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @ApiOperation({
    summary: '카트 생성',
    description: '바디로 받은 데이터를 이용해서 해당 유저의 카트를 생성합니다.',
  })
  @ApiBody({ type: CreateCartDto })
  @ApiResponse({ type: CartsResDto })
  @Post()
  async create(@Body() body: CreateCartDto, @User('id') userId: number) {
    const newCart = await this.cartsService.createCart(body, userId);
    return new CartsResDto(newCart);
  }

  @ApiOperation({
    summary: '유저의 현재 카트 데이터 가져오기',
    description: '해당 유저가 현재 카트에 넣어 놓은 물품을 전부 가져옵니다.',
  })
  @ApiResponse({ type: [CartsResDto] })
  @Get()
  async getCarts(@User('id') userId: number) {
    const carts = await this.cartsService.findActiveCarts(userId);
    return carts.map((cart) => new CartsResDto(cart));
  }

  @ApiOperation({
    summary: '해당 카트 삭제하기',
    description: '카트 아이디로 요청하면 그 아이디의 카트는 삭제됩니다.',
  })
  @ApiParam({ name: 'id', description: '카트 id', type: Number })
  @ApiResponse({ type: CartsResDto })
  @Delete(':id')
  async removeCart(@Param('id', ParseIntPipe) cartId: number) {
    const removed = await this.cartsService.remove(cartId);
    return new CartsResDto(removed);
  }
}
