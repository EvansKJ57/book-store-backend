const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const optionalVerify = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      req.user = { id: null };
      return next();
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

module.exports = optionalVerify;
