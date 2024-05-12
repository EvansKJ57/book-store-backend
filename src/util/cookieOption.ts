import { CookieOptions } from 'express';
const cookieOpt: { [key: string]: CookieOptions } = {
  OauthGoogle: {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  },
  rfToken: {
    httpOnly: true,
    maxAge: 86400000, // 세션쿠키가 아닌 영속 쿠키로 만들기, 하루 유지 옵션 설정
  },
};

export default cookieOpt;
