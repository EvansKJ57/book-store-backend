import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from './guard/bearToken.guard';
import { UserModel } from 'src/entities/user.entity';
import { User } from 'src/decorator/user.decorator';
import { CreateUserDto } from 'src/dtos/req/user.req.dto';

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
  generateNewAccessToken(@User() user: UserModel) {
    const newToken = this.authService.signToken(user, false);
    return { acToken: newToken };
  }
}
