import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { CreateUserDto } from 'src/dtos/create-user.dto';

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
}
