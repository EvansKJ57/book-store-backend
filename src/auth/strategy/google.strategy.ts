import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { Profile, Strategy } from 'passport-google-oauth20';
import { UsersService } from 'src/service/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_REDIRECT_URI'),
      scope: ['email', 'profile'],
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const foundUser = await this.userService.getUserByEmail(
      profile._json.email,
    );

    if (foundUser) {
      return foundUser;
    }
    const hashRound = this.configService.get<number>('bcrypt.round');
    const hash = await bcrypt.hash(
      crypto.randomBytes(10).toString('base64'),
      hashRound,
    );
    const newUser = await this.userService.createUser({
      email: profile._json.email,
      nickname: profile._json.name,
      password: hash,
      provider: 'GOOGLE',
      provider_sub: profile._json.sub,
    });
    return newUser;
  }
}
