const { StatusCodes } = require('http-status-codes');
const CustomError = require('../util/CustomError');

const CartsModel = require('../models/cartsModel');

const addToCart = async (userId, bookId, qty) => {
  try {
    const result = await CartsModel.addToCart(userId, bookId, qty);
    return result;
  } catch (error) {
    throw new CustomError('sql 오류', StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};

const getCarts = async (userId, selectedItems) => {
  try {
    const result = await CartsModel.getCart(userId, selectedItems);
    if (result.length === 0) {
      throw new CustomError('카트에 담긴 도서 없음', StatusCodes.NOT_FOUND);
    }
    return result;
  } catch (error) {
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

const deleteCart = async (cartsId, userId) => {
  try {
    const result = await CartsModel.deleteCart([cartsId], userId);
    if (result.affectedRows === 0) {
      throw new CustomError(
        '해당 물품은 카트에 존재하지 않음',
        StatusCodes.NOT_FOUND
      );
    }
    return result;
  } catch (error) {
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

module.exports = { addToCart, getCarts, deleteCart };
