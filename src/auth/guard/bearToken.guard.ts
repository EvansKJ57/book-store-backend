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
export class BearerTokenGuard implements CanActivate {
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

    const user = await this.userService.getUserByEmail(payload.email);

    req.user = user;
    req.token = token;
    req.tokenType = payload.type;
    return true;
  }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);
    const req = context.switchToHttp().getRequest();
    if (req.tokenType !== 'ac' && req.user && req.token) {
      throw new UnauthorizedException('엑세스 토큰이 아님');
    }
    return true;
  }
}

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);
    const req = context.switchToHttp().getRequest();
    if (req.tokenType !== 'rf' && req.user && req.token) {
      throw new UnauthorizedException('리프레쉬 토큰이 아님');
    }
    return true;
  }
}
