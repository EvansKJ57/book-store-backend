const { StatusCodes } = require('http-status-codes');
const mariadb = require('../db/mariadb');
const CustomError = require('../util/CustomError');

const addLike = (req, res) => {
  const { bookId } = req.params;
  const { user_id } = req.body;
  console.log(bookId, user_id);
  let sql = `INSERT INTO likes (user_id, liked_book_id) VALUES ("${user_id}" , "${bookId}")`;

  mariadb.query(sql, (error, result) => {
    if (error) {
      return next(
        new CustomError('sql 오류', StatusCodes.INTERNAL_SERVER_ERROR)
      );
    }
    res.status(StatusCodes.OK).end();
  });
};

const removeLike = (req, res) => {
  const { bookId } = req.params;
  const { user_id } = req.body;
  let sql = `DELETE FROM likes WHERE user_id = "${user_id}" AND liked_book_id = "${bookId}"`;
  mariadb.query(sql, (error, result) => {
    if (error) {
      return next(
        new CustomError('sql 오류', StatusCodes.INTERNAL_SERVER_ERROR)
      );
    }
    res.status(StatusCodes.OK).end();
  });
};

module.exports = { addLike, removeLike };
