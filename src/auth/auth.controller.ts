import {
  Body,
  Controller,
  Headers,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from './guard/bearToken.guard';
import { UserModel } from 'src/entities/user.entity';
import { User } from 'src/decorator/user.decorator';
import { CreateUserDto, UserResDto } from 'src/dtos/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/email')
  async createUser(@Body() body: CreateUserDto) {
    const newUser = await this.authService.registerWithEmail(body);
    return new UserResDto(newUser);
  }

  @Post('login/email')
  loginWithEmail(@Body() body: Pick<CreateUserDto, 'email' | 'password'>) {
    return this.authService.loginWithEmail(body);
  }

  @Post('token/reissue')
  @UseGuards(RefreshTokenGuard)
  async generateNewAccessToken(
    @User() user: UserModel,
    @Headers('authorization') authHeader: string,
  ) {
    const rfToken = this.authService.extractTokenFromHeader(authHeader);

    const isVerified = await this.authService.verifyToken(rfToken);
    if (!isVerified) {
      throw new UnauthorizedException('토큰만료, 다시 로그인하세요');
    }
    const newToken = this.authService.signToken(user, false);
    return { acToken: newToken };
  }
}
