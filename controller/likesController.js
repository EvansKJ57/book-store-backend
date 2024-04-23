const { StatusCodes } = require('http-status-codes');

const likesService = require('../service/likesService');

const addLike = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const user = req.user;

    const data = await likesService.addLike(user.id, bookId);
    res.status(StatusCodes.OK).json(data);
  } catch (error) {
    next(error);
  }
};

const removeLike = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const user = req.user;
    const data = await likesService.removeLike(user.id, bookId);
    res.status(StatusCodes.OK).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = { addLike, removeLike };
