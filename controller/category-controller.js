const { StatusCodes } = require('http-status-codes');
const mariadb = require('../db/mariadb');
const CustomError = require('../util/CustomError');

const getAllCategory = (req, res, next) => {
  let sql = `SELECT * FROM categories`;

  mariadb.query(sql, (error, results) => {
    if (error) {
      return next(
        new CustomError('sql 오류', StatusCodes.INTERNAL_SERVER_ERROR, error)
      );
    }
    if (results.length === 0) {
      return next(new CustomError('해당 카테고리 없음', StatusCodes.NOT_FOUND));
    }

    res.status(StatusCodes.OK).json(results);
  });
};
module.exports = { getAllCategory };
