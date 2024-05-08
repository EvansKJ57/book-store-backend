const { StatusCodes } = require('http-status-codes');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { createRemoteJWKSet, jwtVerify } = require('jose');

const CustomError = require('../util/CustomError');
const UserService = require('../service/userService');
const UsersModel = require('../models/usersModel');
const generateRandomString = require('../util/generateRandomString');
const {
  issueAccessToken,
  issueRefreshToken,
} = require('../util/token/issueToken');
const JWKS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/oauth2/v3/certs')
);

const loginUser = async ({ email, password, provider = 'LOCAL' }) => {
  try {
    const results = await UsersModel.findUserByEmail(email);
    const foundUser = results[0];
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
    const acToken = issueAccessToken(foundUser.email, foundUser.id);
    const rfToken = issueRefreshToken(foundUser.email, foundUser.id);
    await UsersModel.updateToken({ email: foundUser.email, token: rfToken });

    console.log('로그인 시 발행된 엑세스 토큰 : ', acToken);
    console.log('로그인 시 발행된 리프레쉬 토큰 : ', rfToken);
    return [foundUser, acToken, rfToken];
  } catch (error) {
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

const reissueAcToken = async (rfToken) => {
  try {
    console.log('엑세스 토큰 재발행 시 <<리프레시>> 토큰 : ', rfToken);
    const isVerified = jwt.verify(rfToken, process.env.JWT_RF_KEY);
    const foundUser = await UsersModel.findUserByEmail(isVerified.email);
    // 디비에 유저의 리프레쉬 토큰과 요청 온 리프레쉬 토큰이 맞는지 확인
    if (foundUser[0].token !== rfToken) {
      throw new CustomError(
        '리프레쉬 토큰 일치하지 않음',
        StatusCodes.BAD_REQUEST
      );
    }
    const acToken = issueAccessToken(isVerified.email, isVerified.id);
    return acToken;
  } catch (error) {
    throw error;
  }
};

const logout = async (rfToken) => {
  // 로그아웃은 페이로드만 확인해서 null값으로 초기화
  console.log('<<로그아웃 시 rf 토큰>> : ', rfToken);
  const decoded = jwt.decode(rfToken, process.env.JWT_RF_KEY);
  await UsersModel.updateToken({ email: decoded.email, token: null });
};

// ---------- Oauth 관련 --------------------

const getAcTokenAndIdTokenFromGoogle = async (code) => {
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

const checkIdTokenFromGoogle = async (idToken, nonce) => {
  try {
    const { payload } = await jwtVerify(idToken, JWKS, {
      issuer: 'https://accounts.google.com',
      audience: process.env.GOOGLE_CLIENT_ID,
      maxTokenAge: 60 * 5, // 5 minutes
    });

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

const registerOrLoginGoogleUser = async ({ code, nonce }) => {
  const tokenResponse = await getAcTokenAndIdTokenFromGoogle(code);

  const { email, name, sub } = await checkIdTokenFromGoogle(
    tokenResponse.data.id_token,
    nonce
  );

  let foundUser = await UserService.findUser(email);
  if (foundUser.length === 0) {
    const createResults = await UserService.createUser({
      email,
      name,
      pw: generateRandomString(8, 'base64'),
      provider: 'GOOGLE',
      provider_userId: sub,
    });
    foundUser = await UserService.findUser(createResults.insertId);
  }
  const { email: foundUserEmail, password } = foundUser[0];
  const [user, acToken, rfToken] = await loginUser({
    email: foundUserEmail,
    password,
    provider: 'GOOGLE',
  });

  return [user, acToken, rfToken];
};

module.exports = {
  loginUser,
  reissueAcToken,
  logout,
  getAcTokenAndIdTokenFromGoogle,
  checkIdTokenFromGoogle,
  registerOrLoginGoogleUser,
};
