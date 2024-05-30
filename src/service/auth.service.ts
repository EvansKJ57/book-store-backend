import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UsersService } from 'src/service/users.service';
import * as bcrypt from 'bcrypt';
import { UserModel } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

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
}
