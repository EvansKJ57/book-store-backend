import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import LikeService from '../service/likeService';

const addLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookId } = req.params;
    const user = req.user as { id: number } & JwtPayload;
    const data = await LikeService.addLike(user.id, Number(bookId));
    res.status(StatusCodes.CREATED).json(data);
  } catch (error) {
    next(error);
  }
};

const removeLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookId } = req.params;
    const user = req.user as { id: number } & JwtPayload;
    const data = await LikeService.removeLike(user.id, Number(bookId));
    res.status(StatusCodes.OK).json(data);
  } catch (error) {
    next(error);
  }
};

export default { addLike, removeLike };
