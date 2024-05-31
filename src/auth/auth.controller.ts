import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { RefreshTokenGuard } from './guard/bearToken.guard';
import { UserModel } from 'src/entities/user.entity';
import { User } from 'src/decorator/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/email')
  createUser(@Body() body: CreateUserDto) {
    return this.authService.registerWithEmail(body);
  }

  @Post('login/email')
  loginWithEmail(@Body() body: Pick<CreateUserDto, 'email' | 'password'>) {
    return this.authService.loginWithEmail(body);
  }

  @Post('token/reissue')
  @UseGuards(RefreshTokenGuard)
  generateNewAccessToken(
    @Headers('authorization') rawToken: string,
    @User() user: UserModel,
  ) {
    const newToken = this.authService.signToken(user, false);
    return { accessToken: newToken };
  }
}
