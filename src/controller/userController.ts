import { StatusCodes } from 'http-status-codes';
import UserService from '../service/userService';
import { NextFunction, Request, Response } from 'express';

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name, password } = req.body;
    const results = await UserService.createUser({ email, name, pw: password });
    res.status(StatusCodes.CREATED).json(results);
  } catch (error) {
    next(error);
  }
};

const pwResetRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const results = await UserService.pwResetRequest(email);
    res.status(StatusCodes.OK).json({ email: results.email });
  } catch (error) {
    next(error);
  }
};

const pwReset = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const results = await UserService.pwReset(email, password);
    return res.status(StatusCodes.OK).json(results);
  } catch (error) {
    next(error);
  }
};

export default { create, pwResetRequest, pwReset };
