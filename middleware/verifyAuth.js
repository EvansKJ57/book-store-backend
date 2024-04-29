const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const CustomError = require('../util/CustomError');

const verifyAuth = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    //도서 정보 조회는 유저 아니어도 조회 가능하게 분기처리
    if (
      req.originalUrl.includes('/books') &&
      req.method === 'GET' &&
      !authorization
    ) {
      req.user = { id: null };
      return next();
    }
    if (!authorization) {
      throw new CustomError('token 없음', StatusCodes.BAD_REQUEST);
    }
    const [authScheme, token] = authorization.split(' ');
    if (authScheme !== 'Bearer') {
      throw new CustomError('적절한 토큰 타입이 아님', StatusCodes.BAD_REQUEST);
    }
    const isVerified = jwt.verify(token, process.env.JWT_AC_KEY);
    req.user = isVerified;
    next();
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
};

module.exports = verifyAuth;
