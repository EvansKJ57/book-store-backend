const express = require('express');
const jwt = require('jsonwebtoken');
const qs = require('qs');
const { issueAccessToken } = require('../util/token/issueToken');
const UsersModel = require('../models/usersModel');
const CustomError = require('../util/CustomError');
const { StatusCodes } = require('http-status-codes');
const { default: axios } = require('axios');
const router = express.Router();

//Oauth - google
router.get('/oauth/google/login', (req, res) => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const optionsStringify = qs.stringify({
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '),
    access_type: 'offline',
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    client_id: process.env.GOOGLE_CLIENT_ID,
  });
  res.redirect(`${rootUrl}?${optionsStringify}`);
});
//Oauth - google redirect 코드 받는 곳
router.get('/oauth/google/redirect', async (req, res, next) => {
  const queryParse = qs.parse(req.query);
  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const userInfoUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';
  const optionsStringify = qs.stringify({
    code: queryParse.code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    grant_type: 'authorization_code',
  });
  try {
    const tokenResponse = await axios.post(tokenUrl, optionsStringify, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });
    const userResponse = await axios.get(userInfoUrl, {
      headers: {
        Authorization: `Bearer ${tokenResponse.data.access_token}`,
      },
    });

    const googleUser = userResponse.data;
    console.log(googleUser); // 유저 정보를 받고 이걸 db에 저장하고
    const isUser = await UsersModel.findUserByEmail(googleUser.email);
    if (!isUser) {
      console.log(isUser);
    }
  } catch (error) {
    next(error);
  }
});

// 엑세스 토큰은 json으로 res, 리프레쉬 토큰은 쿠키에 담아서  res
router.post('/reissue', async (req, res, next) => {
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
    const isVerified = jwt.verify(rfToken, process.env.JWT_RF_KEY);
    const results = await UsersModel.updateToken(isVerified.email, null);

    res.status(StatusCodes.OK).json(results);
  } catch (error) {
    throw new CustomError(
      '로그아웃 처리중 오류',
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
});

module.exports = router;
