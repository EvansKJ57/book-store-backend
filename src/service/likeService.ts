import { StatusCodes } from 'http-status-codes';
import CustomError from '../util/CustomError';

import LikesModel from '../models/likesModel';

const addLike = async (userId: number, bookId: number) => {
  try {
    const result = await LikesModel.addLike(userId, bookId);
    return result;
  } catch (error: any) {
    throw new CustomError('sql 오류', StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};

const removeLike = async (userId: number, bookId: number) => {
  try {
    const result = await LikesModel.removeLike(userId, bookId);
    return result;
  } catch (error: any) {
    throw new CustomError('sql 오류', StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};

export default { addLike, removeLike };
