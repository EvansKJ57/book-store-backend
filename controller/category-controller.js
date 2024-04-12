const { StatusCodes } = require('http-status-codes');
const mariadb = require('../db/mariadb');
const getAllCategory = (req, res, next) => {
  let sql = `SELECT * FROM categories`;

  mariadb.query(sql, (error, results) => {
    if (error) {
      const errorObj = new Error('sql 오류');
      errorObj.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      return next(errorObj);
    }
    if (results.length === 0) {
      const errorObj = new Error('해당 도서 없음');
      errorObj.statusCode = StatusCodes.NOT_FOUND;
      return next(errorObj);
    }

    res.status(StatusCodes.OK).json(results);
  });
};
module.exports = { getAllCategory };
