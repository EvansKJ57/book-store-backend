const { StatusCodes } = require('http-status-codes');
const mariadb = require('../db/mariadb');
const CustomError = require('../util/CustomError');

const getAllCategory = async (req, res, next) => {
  try {
    let sql = `SELECT * FROM categories`;
    const [results] = await mariadb.query(sql);
    if (results.length === 0) {
      return next(new CustomError('해당 카테고리 없음', StatusCodes.NOT_FOUND));
    }
    const data = results.map((category) => {
      const memo = {
        categoryId: category.category_id,
        categoryName: category.category_name,
      };
      return memo;
    });
    res.status(StatusCodes.OK).json(data);
  } catch (error) {
    next(new CustomError('sql 오류', StatusCodes.INTERNAL_SERVER_ERROR, error));
  }
};
module.exports = { getAllCategory };
