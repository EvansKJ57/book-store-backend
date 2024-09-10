import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModel } from 'src/entities/user.entity';
import { User } from 'src/decorator/user.decorator';
import { CreateUserDto, UserResDto } from 'src/dtos/user.dto';
import { GoogleOauthGuard } from './guard/google-oauth.guard';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenGuard } from './guard/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register/email')
  async registerUser(@Body() body: CreateUserDto) {
    const newUser = await this.authService.registerWithEmail(body);
    return new UserResDto(newUser);
  }

  @Get('login/google')
  @UseGuards(GoogleOauthGuard)
  loginHandle() {}

  @Get('login/google/redirect')
  @UseGuards(GoogleOauthGuard)
  redirectHandle(@Res() res: Response, @User() user: UserModel) {
    const { rfToken } = this.authService.loginUser(user);
    res.cookie('refreshToken', rfToken, {
      httpOnly: true,
      maxAge: this.configService.get<number>('JWT_RF_TIME'),
    });
    const frontUrl = this.configService.get<string>('FRONT_BASE_URL');
    res.redirect(`${frontUrl}/login/acb`);
  }

  @Post('login/local')
  async loginWithEmail(
    @Res() res: Response,
    @Body() body: Pick<CreateUserDto, 'email' | 'password'>,
  ) {
    const { acToken, rfToken } = await this.authService.loginWithEmail(body);
    res.cookie('refreshToken', rfToken, {
      httpOnly: true,
      maxAge: this.configService.get<number>('JWT_RF_TIME'),
    });
    res.json({ acToken });
  }

  @Post('token/reissue')
  @UseGuards(RefreshTokenGuard)
  async generateNewAccessToken(@User() user: UserModel) {
    const newToken = this.authService.signToken(user, false);
    return { acToken: newToken };
  }
}
