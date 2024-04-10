const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');

const validationRequest = (req, res, next) => {
  const validationError = validationResult(req);
  if (!validationError.isEmpty()) {
    const errorObj = new Error('ValidationError 입력값을 확인해주세요');
    errorObj.statusCode = StatusCodes.BAD_REQUEST;
    errorObj.stack = validationError.array();

    return next(errorObj);
  }
  next();
};

module.exports = validationRequest;
