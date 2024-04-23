const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const CustomError = require('../util/CustomError');

const verifyAuthorization = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new CustomError('token 없음', StatusCodes.BAD_REQUEST);
    }
    const token = authorization.split(' ')[1];
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

module.exports = verifyAuthorization;
