import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/service/users.service';
import * as bcrypt from 'bcrypt';
import { UserModel } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/dtos/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async registerWithEmail(user: CreateUserDto) {
    const hashRound = this.configService.get('HASH_ROUND');

    const hash = await bcrypt.hash(user.password, parseInt(hashRound));
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
      this.configService.get<string>('JWT_RF_KEY'),
      this.configService.get<string>('JWT_AC_KEY'),
    ];
    const [rf_time, ac_time] = [
      this.configService.get<number>('JWT_RF_TIME'),
      this.configService.get<string>('JWT_AC_TIME'),
    ];
    return this.jwtService.sign(payload, {
      secret: isRfToken ? rfKey : acKey,
      expiresIn: isRfToken ? rf_time : ac_time,
    });
  }

  async verifyToken(token: string) {
    try {
      const { type } = this.jwtService.decode(token);

      let secretKey: string;
      if (type === 'rf') {
        secretKey = this.configService.get<string>('JWT_RF_KEY');
      } else {
        secretKey = this.configService.get<string>('JWT_AC_KEY');
      }

      const verifiedPayload = await this.jwtService.verify(token, {
        secret: secretKey,
      });
      return verifiedPayload;
    } catch (error) {
      throw new UnauthorizedException('토큰이 만료됐거나 잘못된 토큰');
    }
  }

  extractTokenFromHeader(authHeader: string) {
    const splitToken = authHeader.split(' ');
    if (splitToken.length !== 2 || splitToken[0].toLowerCase() !== 'bearer') {
      throw new UnauthorizedException('잘못된 토큰');
    }
    const token = splitToken[1];
    return token;
  }
}
