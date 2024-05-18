import { StatusCodes } from 'http-status-codes';
import qs from 'qs';
import crypto from 'crypto';

import CustomError from '../util/CustomError';
import AuthService from './../service/authService';
import generateRandomString from '../util/generateRandomString';
import cookieOpt from '../util/cookieOption';
import { NextFunction, Request, Response } from 'express';
import { ILoginUserReqBody } from '../types/ReqRelatedType';

const AuthController = {
  requestGoogleOpenIDConnect: (req: Request, res: Response) => {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const state = generateRandomString(16); // CSRF 방지 난수
    const nonce = generateRandomString(16); // 재사용 공격 방지
    const hashedNonce = crypto.createHash('sha256').update(nonce).digest('hex');
    const optionsStringify = qs.stringify({
      response_type: 'code',
      prompt: 'consent',
      scope: 'openid email profile', // access_type: 'online',
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      client_id: process.env.GOOGLE_CLIENT_ID,
      state: state,
      nonce: hashedNonce,
    });
    res.cookie('state', state, cookieOpt.OauthGoogle);
    res.cookie('nonce', nonce, cookieOpt.OauthGoogle);
    res.redirect(`${rootUrl}?${optionsStringify}`);
  },

  loginGoogle: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const code = req.query.code as string;
      const queryState = req.query.state;
      const { state, nonce } = req.cookies;
      if (state !== queryState || !nonce) {
        throw new CustomError(
          'invalid state or nonce',
          StatusCodes.BAD_REQUEST
        );
      }

      const [user, acToken, rfToken] =
        await AuthService.registerOrLoginGoogleUser({
          code: code,
          nonce,
        });
      // 쿠키에서 nonce값 삭제
      res.cookie('nonce', '', {
        ...cookieOpt.OauthGoogle,
        maxAge: 0,
      });
      res.cookie('token', rfToken, cookieOpt.rfToken);
      res.status(StatusCodes.OK).json({ email: user.email, acToken: acToken });
    } catch (error) {
      next(error);
    }
  },

  loginLocal: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password }: ILoginUserReqBody = req.body;
      const [user, acToken, rfToken] = await AuthService.loginUser({
        email,
        password,
        provider: 'LOCAL',
      });
      // 엑세스 토큰은 json으로 res, 리프레쉬 토큰은 쿠키에 담아서  res
      res.cookie('token', rfToken, cookieOpt.rfToken);
      res.status(StatusCodes.OK).json({ email: user.email, acToken });
    } catch (error) {
      next(error);
    }
  },

  reissueAcToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rfToken = req.cookies.token;
      if (!rfToken) {
        throw new CustomError('token 없음', StatusCodes.BAD_REQUEST);
      }
      const acToken = await AuthService.reissueAcToken(rfToken);

      res.status(StatusCodes.OK).json({ acToken: acToken });
    } catch (error: any) {
      if (!error.statusCode) {
        if (error.name === 'JsonWebTokenError') {
          error.statusCode = StatusCodes.BAD_REQUEST;
        } else if (error.name === 'TokenExpiredError') {
          error.statusCode = StatusCodes.UNAUTHORIZED;
        }
      }
      next(error);
    }
  },

  logout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rfToken = req.cookies.token;
      await AuthService.logout(rfToken);
      res.cookie('token', '', {
        ...cookieOpt.rfToken,
        maxAge: 0,
      });
      res.status(StatusCodes.OK).json({ msg: '로그아웃 성공' });
    } catch (error) {
      next(
        new CustomError(
          '로그아웃 처리중 오류',
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      );
    }
  },
};
export default AuthController;
