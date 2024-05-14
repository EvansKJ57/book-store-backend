import { StatusCodes } from 'http-status-codes';
import UserService from '../service/userService';
import { NextFunction, Request, Response } from 'express';
import CustomError from '../util/CustomError';

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name, password } = req.body;
    const foundUser = await UserService.findUser(email);
    if (foundUser) {
      throw new CustomError(
        '해당 아이디는 이미 존재합니다',
        StatusCodes.BAD_REQUEST
      );
    }
    const createdUserId = await UserService.createUser({
      email,
      name,
      password,
    });
    const newUser = await UserService.findUser(createdUserId);
    res
      .status(StatusCodes.CREATED)
      .json({ email: newUser.email, name: newUser.name });
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
