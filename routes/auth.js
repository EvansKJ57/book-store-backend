const express = require('express');
const jwt = require('jsonwebtoken');
const { issueAccessToken } = require('../util/token/issueToken');
const UsersModel = require('../models/usersModel');
const CustomError = require('../util/CustomError');
const { StatusCodes } = require('http-status-codes');
const router = express.Router();

// 엑세스 토큰은 json으로 res, 리프레쉬 토큰은 쿠키에 담아서  res
router.post('/reissue', async (req, res, next) => {
  try {
    const rfToken = req.cookies.token;
    console.log('엑세스 토큰 재발행 시 <<리프레시>> 토큰 : ', rfToken);
    if (!rfToken) {
      throw new CustomError('token 없음', StatusCodes.BAD_REQUEST);
    }
    const isVerified = jwt.verify(rfToken, process.env.JWT_RF_KEY);
    console.log(isVerified);
    const foundUser = await UsersModel.findUserByEmail(isVerified.email);
    // 디비에 유저의 리프레쉬 토큰과 요청 온 리프레쉬 토큰이 맞는지 확인
    if (foundUser[0].token !== rfToken) {
      throw new CustomError(
        '리프레쉬 토큰 일치하지 않음',
        StatusCodes.BAD_REQUEST
      );
    }
    const acToken = issueAccessToken(isVerified.email, isVerified.id);

    res.status(200).json({ acToken: acToken });
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

    res.json(results);
  } catch (error) {
    throw new CustomError(
      '로그아웃 처리중 오류',
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
});

module.exports = router;
