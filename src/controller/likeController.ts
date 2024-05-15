import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import LikeService from '../service/likeService';

const addLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookId = Number(req.params.bookId);
    const user = req.user;
    const data = await LikeService.addLike(user.id, bookId);
    res.status(StatusCodes.CREATED).json(data);
  } catch (error) {
    next(error);
  }
};

const removeLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookId = Number(req.params.bookId);
    const user = req.user;
    const data = await LikeService.removeLike(user.id, bookId);
    res.status(StatusCodes.OK).json(data);
  } catch (error) {
    next(error);
  }
};

export default { addLike, removeLike };
