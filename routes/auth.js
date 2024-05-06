const express = require('express');
const jwt = require('jsonwebtoken');
const qs = require('qs');
const crypto = require('crypto');
const { StatusCodes } = require('http-status-codes');
const { default: axios } = require('axios');
const { createRemoteJWKSet, jwtVerify } = require('jose');
const router = express.Router();

const { userValidatorConfig } = require('../middleware/validationRules');
const validateRequest = require('../middleware/validateRequest');
const userController = require('../controller/userController');
const UserService = require('../service/userService');
const UsersModel = require('../models/usersModel');
const {
  issueAccessToken,
  issueRefreshToken,
} = require('../util/token/issueToken');
const CustomError = require('../util/CustomError');

const JWKS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/oauth2/v3/certs')
);

//OIDC - google
router.get('/oauth/google/login', (req, res) => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const state = crypto.randomBytes(16).toString('hex'); // CSRF 방지 난수
  const nonce = crypto.randomBytes(16).toString('hex'); // 재생 공격 방지
  const hashedNonce = crypto.createHash('sha256').update(nonce).digest('hex');
  const optionsStringify = qs.stringify({
    response_type: 'code',
    prompt: 'consent',
    scope: 'openid email profile',
    access_type: 'online',
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    client_id: process.env.GOOGLE_CLIENT_ID,
    state: state,
    nonce: hashedNonce,
  });
  res.cookie('state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  });
  res.cookie('nonce', nonce, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  });
  res.redirect(`${rootUrl}?${optionsStringify}`);
});

//OIDC - google redirect
router.get('/oauth/google/redirect', async (req, res, next) => {
  try {
    const queryParse = qs.parse(req.query);
    const oauthState = req.cookies.state;
    if (oauthState !== queryParse.state) {
      next(new CustomError('invalid state', StatusCodes.BAD_REQUEST));
    }
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const optionsStringify = qs.stringify({
      code: queryParse.code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const tokenResponse = await axios.post(tokenUrl, optionsStringify, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });

    const nonce = req.cookies.nonce;
    if (!nonce) {
      next(new CustomError('invalid nonce', StatusCodes.BAD_REQUEST));
    }
    const { payload } = await jwtVerify(tokenResponse.data.id_token, JWKS, {
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
      next(new CustomError('invalid id token', StatusCodes.BAD_REQUEST));
    }
    console.log(payload);

    // 이 유저 정보로 하는 로직작성.....
    let foundUser;
    const results = await UsersModel.findUserByEmail(payload.email);
    if (results.length === 0) {
      const random = crypto.randomBytes(8).toString('base64');
      const createResults = await UserService.createUser(
        payload.email,
        payload.name,
        random,
        'GOOGLE',
        payload.sub
      );
      foundUser = await UsersModel.findUserByEmail(createResults.insertId);
    } else {
      foundUser = results[0];
    }

    const acToken = issueAccessToken(foundUser.email, foundUser.id);
    const rfToken = issueRefreshToken(foundUser.email, foundUser.id);
    await UsersModel.updateToken(foundUser.email, rfToken);

    console.log('로그인 시 발행된 엑세스 토큰 : ', acToken);
    console.log('로그인 시 발행된 리프레쉬 토큰 : ', rfToken);
    // 쿠키에서 nonce값 삭제
    res.cookie('nonce', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 0,
    });
    res.cookie('token', rfToken, {
      httpOnly: true,
      maxAge: 86400000, // 세션쿠키가 아닌 영속 쿠키로 만들기, 하루 유지 옵션 설정
    });
    res
      .status(StatusCodes.OK)
      .json({ email: foundUser.email, acToken: acToken });
  } catch (error) {
    next(error);
  }
});

// 로컬에서 유저 로그인
router.post(
  '/local/login',
  [userValidatorConfig.email, userValidatorConfig.password, validateRequest],
  userController.login
);
// 엑세스 토큰은 json으로 res, 리프레쉬 토큰은 쿠키에 담아서  res
router.post('/reissue-access-token', async (req, res, next) => {
  try {
    const rfToken = req.cookies.token;
    console.log('엑세스 토큰 재발행 시 <<리프레시>> 토큰 : ', rfToken);
    if (!rfToken) {
      throw new CustomError('token 없음', StatusCodes.BAD_REQUEST);
    }
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

    res.status(StatusCodes.OK).json({ acToken: acToken });
  } catch (error) {
    if (!error.statusCode) {
      if (error.name === 'JsonWebTokenError') {
        error.statusCode = StatusCodes.BAD_REQUEST;
      } else if (error.name === 'TokenExpiredError') {
        error.statusCode = StatusCodes.UNAUTHORIZED;
      }
    }
    next(error);
  }
});

router.post('/logout', async (req, res, next) => {
  try {
  const rfToken = req.cookies.token;
  console.log('로그아웃 시 쿠키 : ', req.cookies);
  const isVerified = jwt.verify(rfToken, process.env.JWT_RF_KEY);
  const results = await UsersModel.updateToken(isVerified.email, null);
  res.cookie('token', '', {
    httpOnly: true,
    maxAge: 0,
  });
  res.status(StatusCodes.OK).json(results);
  } catch (error) {
    throw new CustomError(
      '로그아웃 처리중 오류',
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
});

module.exports = router;
