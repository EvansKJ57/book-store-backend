import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/service/users.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const token = req.cookies.refreshToken;
    if (!token) {
      throw new UnauthorizedException(
        '리프레쉬 토큰 없음. 다시 로그인 해주세요.',
      );
    }
    const payload = await this.authService.verifyToken(token);
    const user = await this.userService.getUserByEmail(payload.email);

    req.user = user;
    req.token = token;
    req.tokenType = payload.type;

    if (payload.type !== 'rf' && req.user && token) {
      throw new UnauthorizedException('리프레쉬 토큰이 아님');
    }
    return true;
  }
}
