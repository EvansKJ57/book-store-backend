import { StatusCodes } from 'http-status-codes';
import CustomError from '../util/CustomError';

import CartsModel from '../models/cartsModel';

const addToCart = async (userId: number, bookId: number, qty: number) => {
  try {
    const result = await CartsModel.addToCart(userId, bookId, qty);
    return result;
  } catch (error: any) {
    throw new CustomError('sql 오류', StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};

const getCarts = async (userId: number, selectedItems: number[]) => {
  try {
    const result: any = await CartsModel.getCart(userId, selectedItems);
    if (result.length === 0) {
      throw new CustomError('카트에 담긴 도서 없음', StatusCodes.NOT_FOUND);
    }
    return result;
  } catch (error: any) {
    if (!error.statusCode) {
      throw new CustomError(
        'sql 오류',
        StatusCodes.INTERNAL_SERVER_ERROR,
        error
      );
    } else {
      throw error;
    }
  }
};

const deleteCart = async (cartsId: number[], userId: number) => {
  try {
    const result = await CartsModel.deleteCart(cartsId, userId);
    if (result.affectedRows === 0) {
      throw new CustomError(
        '해당 물품은 카트에 존재하지 않음',
        StatusCodes.NOT_FOUND
      );
    }
    return result;
  } catch (error: any) {
    if (!error.statusCode) {
      throw new CustomError(
        'db 삭제 실패',
        StatusCodes.INTERNAL_SERVER_ERROR,
        error
      );
    } else {
      throw error;
    }
  }
};

export default { addToCart, getCarts, deleteCart };
