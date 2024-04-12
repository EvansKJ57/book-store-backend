const { StatusCodes } = require('http-status-codes');
const mariadb = require('../db/mariadb');
const CustomError = require('../util/CustomError');

//(카테고리 별, 신간) 전체 도서 목록 조회
const getAllBooks = (req, res, next) => {
  const { category_id, newBooks, curPage, pageSize } = req.query;

  let sql = `SELECT * FROM books`;
  const values = [];
  const conditions = [];

  if (category_id) {
    conditions.push(`category_id = ?`);
    values.push(Number(category_id));
  }
  if (newBooks) {
    conditions.push(
      `pub_date BETWEEN DATE_SUB(NOW(),INTERVAL 30 DAY) AND NOW()`
    );
  }
  //sql 합치기
  if (conditions.length) {
    sql += ` WHERE ${conditions.join(' AND ')}`;
  }

  if (curPage && pageSize) {
    sql += ` LIMIT ?, ?`;
    const limit = Number(pageSize);
    const offset = limit * (Number(curPage) - 1);
    values.push(offset);
    values.push(limit);
  }

  // console.log(sql, values);

  mariadb.query(sql, values, (error, results) => {
    if (error) {
      return next(
        new CustomError('sql 오류', StatusCodes.INTERNAL_SERVER_ERROR, error)
      );
    }
    if (results.length === 0) {
      return next(new CustomError('해당 도서 없음', StatusCodes.NOT_FOUND));
    }

    res.status(StatusCodes.OK).json(results);
  });
};

const getBookDetail = (req, res, next) => {
  const bookId = Number(req.params.bookId);

  const sql = `SELECT * FROM books JOIN categories ON books.category_id = categories.id WHERE books.id = ? `;
  const value = [bookId];
  mariadb.query(sql, value, (error, results) => {
    if (error) {
      return next(
        new CustomError('sql 오류', StatusCodes.INTERNAL_SERVER_ERROR, error)
      );
    }
    if (results.length === 0) {
      return next(new CustomError('해당 도서 없음', StatusCodes.NOT_FOUND));
    }
    res.status(StatusCodes.OK).json(results);
  });
};

module.exports = { getAllBooks, getBookDetail };
