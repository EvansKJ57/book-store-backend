import { StatusCodes } from 'http-status-codes';
import axios from 'axios';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import CustomError from '../util/CustomError';
import UserService from './userService';
import UsersModel from '../models/usersModel';
import TokensModel from '../models/tokensModel';
import generateRandomString from '../util/generateRandomString';
import { issueAccessToken, issueRefreshToken } from '../util/token/issueToken';
import {
  ICustomJwtPayload,
  IFoundUser,
  IGoogleIdTokenPayload,
} from '../types/customTypes';

const JWKS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/oauth2/v3/certs')
);

const loginUser = async ({
  email,
  password,
  provider,
}: {
  email: string;
  password: string;
  provider: string;
}): Promise<[IFoundUser, string, string]> => {
  try {
    const foundUser = await UsersModel.findUserByEmail(email);
    // if user don't exist in db
    if (!foundUser) {
      throw new CustomError(
        '이메일 혹은 비밀번호가 다름',
        StatusCodes.UNAUTHORIZED
      );
    }
    if (foundUser.provider !== provider) {
      throw new CustomError('invalid provider', StatusCodes.BAD_REQUEST);
    }
    // check password if provider is local
    if (foundUser.provider === provider && provider === 'LOCAL') {
      const hashRequestPw = crypto
        .pbkdf2Sync(password, foundUser.salt, 10000, 10, 'sha512')
        .toString('base64');
      //비밀번호 다른 경우
      if (foundUser.password !== hashRequestPw) {
        throw new CustomError(
          '이메일 혹은 비밀번호가 다름',
          StatusCodes.UNAUTHORIZED
        );
      }
    }
    const acToken = issueAccessToken({ userId: foundUser.id });
    const uuid = uuidv4();
    const rfToken = issueRefreshToken({ userId: foundUser.id, uuid: uuid });
    await TokensModel.updateToken({ userId: foundUser.id, token: uuid });
    return [foundUser, acToken, rfToken];
  } catch (error: any) {
    if (!error.statusCode) {
      throw new CustomError(
        '로그인 처리 중 오류',
        StatusCodes.INTERNAL_SERVER_ERROR,
        error
      );
    }
    throw error;
  }
};

const reissueAcToken = async (rfToken: string) => {
  try {
    const verifiedData = jwt.verify(
      rfToken,
      process.env.JWT_RF_KEY
    ) as ICustomJwtPayload;
    const foundUser = await TokensModel.findTokenByUserId(verifiedData.id);
    // 디비에 유저의 리프레쉬 토큰과 요청 온 리프레쉬 토큰이 맞는지 확인
    if (foundUser.token !== verifiedData.uuid) {
      throw new CustomError(
        '리프레쉬 토큰 일치하지 않음',
        StatusCodes.BAD_REQUEST
      );
    }
    const acToken = issueAccessToken({ userId: verifiedData.id });
    return acToken;
  } catch (error) {
    throw error;
  }
};

const logout = async (rfToken: string) => {
  try {
    // 로그아웃은 페이로드만 확인해서 null값으로 초기화
    const decoded = jwt.decode(rfToken) as ICustomJwtPayload;
    await TokensModel.updateToken({ userId: decoded.id, token: null });
  } catch (error) {
    throw error;
  }
};

// ---------- Oauth 관련 --------------------

const getAcTokenAndIdTokenFromGoogle = async (code: string) => {
  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const options = {
    code: code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    grant_type: 'authorization_code',
  };
  try {
    const tokenResponse = await axios.post(tokenUrl, options, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });
    return tokenResponse;
  } catch (error) {
    throw error;
  }
};

const checkIdTokenFromGoogle = async (idToken: string, nonce: string) => {
  try {
    const { payload } = (await jwtVerify(idToken, JWKS, {
      issuer: 'https://accounts.google.com',
      audience: process.env.GOOGLE_CLIENT_ID,
      maxTokenAge: 60 * 5, // 5 minutes
    })) as { payload: IGoogleIdTokenPayload };

    const expectedNonce = crypto
      .createHash('sha256')
      .update(nonce)
      .digest('hex');
    //payload에 있는 해쉬된 nonce와 쿠키에 담긴 해쉬 전 nonce 비교
    if (payload.nonce !== expectedNonce) {
      throw new CustomError('invalid id token', StatusCodes.BAD_REQUEST);
    }
    return payload;
  } catch (error) {
    throw error;
  }
};

const registerOrLoginGoogleUser = async ({
  code,
  nonce,
}: {
  code: string;
  nonce: string;
}): Promise<[IFoundUser, string, string]> => {
  try {
    const tokenResponse = await getAcTokenAndIdTokenFromGoogle(code);

    const { email, name, sub } = await checkIdTokenFromGoogle(
      tokenResponse.data.id_token,
      nonce
    );

    let foundUser = await UserService.findUser(email);
    if (!foundUser) {
      const createdUserId = await UserService.createUser({
        email,
        name,
        password: generateRandomString(8, 'base64'),
        provider: 'GOOGLE',
        provider_userId: sub,
      });
      foundUser = await UserService.findUser(createdUserId);
    }

    const [user, acToken, rfToken] = await loginUser({
      email: foundUser.email,
      password: foundUser.password,
      provider: 'GOOGLE',
    });

    return [user, acToken, rfToken];
  } catch (error) {
    throw error;
  }
};

export default {
  loginUser,
  reissueAcToken,
  logout,
  getAcTokenAndIdTokenFromGoogle,
  checkIdTokenFromGoogle,
  registerOrLoginGoogleUser,
};
