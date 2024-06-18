import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as crypto from 'crypto';
import { Profile, Strategy } from 'passport-google-oauth20';
import { UsersService } from 'src/service/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly userService: UsersService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
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

    const newUser = await this.userService.createUser({
      email: profile._json.email,
      nickname: profile._json.name,
      password: crypto.randomBytes(10).toString('base64'),
      provider: 'GOOGLE',
      provider_sub: profile._json.sub,
    });
    return newUser;
  }
}
