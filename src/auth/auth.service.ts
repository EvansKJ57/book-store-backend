import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/service/users.service';
import * as bcrypt from 'bcrypt';
import { UserModel } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/dtos/req/user.req.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async registerWithEmail(user: CreateUserDto) {
    const hashRound = this.configService.get<number>('bcrypt.round');

    const hash = await bcrypt.hash(user.password, hashRound);
    const newUser = await this.userService.createUser({
      ...user,
      password: hash,
    });
    return newUser;
  }

  async loginWithEmail(user: Pick<UserModel, 'email' | 'password'>) {
    const existUser = await this.userService.getUserByEmail(user.email);
    if (!existUser) {
      throw new UnauthorizedException('아이디 혹은 비밀번호가 다릅니다.');
    }
    const pwOk = await bcrypt.compare(user.password, existUser.password);
    if (!pwOk) {
      throw new UnauthorizedException('아이디 혹은 비밀번호가 다릅니다.');
    }

    return this.loginUser(existUser);
  }

  loginUser(user: Pick<UserModel, 'email' | 'id'>) {
    const [acToken, rfToken] = [
      this.signToken(user, false),
      this.signToken(user, true),
    ];

    return { acToken, rfToken };
  }

  signToken(user: Pick<UserModel, 'email' | 'id'>, isRfToken: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRfToken ? 'rf' : 'ac',
    };
    const [rfKey, acKey] = [
      this.configService.get<string>('jwt.refresh'),
      this.configService.get<string>('jwt.access'),
    ];
    const [rf_time, ac_time] = [
      this.configService.get<string>('jwt.refresh_time'),
      this.configService.get<string>('jwt.access_time'),
    ];
    return this.jwtService.sign(payload, {
      secret: isRfToken ? rfKey : acKey,
      expiresIn: isRfToken ? rf_time : ac_time,
    });
  }

  verifyToken(token: string) {
    try {
      const { type } = this.jwtService.decode(token);
      let secretKey;
      if (type === 'rf') {
        secretKey = this.configService.get<string>('jwt.refresh');
      } else {
        secretKey = this.configService.get<string>('jwt.access');
      }
      const verifiedPayload = this.jwtService.verify(token, {
        secret: secretKey,
      });
      return verifiedPayload;
    } catch (error) {
      throw new UnauthorizedException('토큰이 만료됐거나 잘못된 토큰');
    }
  }

  extractTokenFromHeader(header: string) {
    const splitToken = header.split(' ');
    if (splitToken.length !== 2 || splitToken[0].toLowerCase() !== 'bearer') {
      throw new UnauthorizedException('잘못된 토큰');
    }
    const token = splitToken[1];
    return token;
  }
}
