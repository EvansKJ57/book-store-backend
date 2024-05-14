import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

const validationRequest = (req: Request, res: Response, next: NextFunction) => {
  const validationError = validationResult(req);

  if (!validationError.isEmpty()) {
    const errorObj: any = new Error('ValidationError 입력값을 확인해주세요');
    errorObj.statusCode = StatusCodes.BAD_REQUEST;
    errorObj.stack = validationError.array();

    return next(errorObj);
  }
  next();
};

export default validationRequest;
