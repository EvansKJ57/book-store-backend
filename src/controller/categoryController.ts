import { StatusCodes } from 'http-status-codes';
import CategoryService from '../service/categoryService';
import { NextFunction, Request, Response } from 'express';

const getAllCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await CategoryService.getCategories();
    res.status(StatusCodes.OK).json(data);
  } catch (error) {
    next(error);
  }
};
export default { getAllCategory };
