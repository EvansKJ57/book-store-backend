const { StatusCodes } = require('http-status-codes');

const LikeService = require('../service/likeService');

const addLike = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const user = req.user;
    const data = await LikeService.addLike(user.id, bookId);
    res.status(StatusCodes.CREATED).json(data);
  } catch (error) {
    next(error);
  }
};

const removeLike = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const user = req.user;
    const data = await LikeService.removeLike(user.id, bookId);
    res.status(StatusCodes.OK).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = { addLike, removeLike };
