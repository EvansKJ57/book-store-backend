import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/service/users.service';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new BadRequestException('토큰 없음');
    }
    const token = this.authService.extractTokenFromHeader(authHeader);
    const payload = await this.authService.verifyToken(token);

    if (payload.type !== 'ac') {
      throw new UnauthorizedException('엑세스 토큰이 아님');
    }

    const user = await this.userService.getUserByEmail(payload.email);

    req.user = user;
    req.token = token;
    req.tokenType = payload.type;
    return true;
  }
}
