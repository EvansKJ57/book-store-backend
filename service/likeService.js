const { StatusCodes } = require('http-status-codes');
const CustomError = require('../util/CustomError');

const LikesModel = require('../models/likesModel');

const addLike = async (userId, bookId) => {
  try {
    const result = await LikesModel.addLike(userId, bookId);
    return result;
  } catch (error) {
    throw new CustomError('sql 오류', StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};

const removeLike = async (userId, bookId) => {
  try {
    const result = await LikesModel.removeLike(userId, bookId);
    return result;
  } catch (error) {
    throw new CustomError('sql 오류', StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};

module.exports = { addLike, removeLike };
