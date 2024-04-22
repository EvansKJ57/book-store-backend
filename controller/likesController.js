const { StatusCodes } = require('http-status-codes');

const mariadb = require('../db/mariadb');
const CustomError = require('../util/CustomError');

const addLike = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const user = req.user;
    // console.log(userInfo);
    let sql = `INSERT INTO likes (user_id, liked_book_id) VALUES ("${user.id}" , "${bookId}")`;
    const [results] = await mariadb.query(sql);
    res.status(StatusCodes.OK).json(results);
  } catch (error) {
    next(new CustomError('sql 오류', StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

const removeLike = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const user = req.user;
    // console.log(user, bookId);
    let sql = `DELETE FROM likes WHERE user_id = "${user.id}" AND liked_book_id = "${bookId}"`;
    const [results] = await mariadb.query(sql);
    res.status(StatusCodes.OK).json(results);
  } catch (error) {
    next(new CustomError('sql 오류', StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

module.exports = { addLike, removeLike };
