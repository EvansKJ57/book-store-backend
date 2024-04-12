const { StatusCodes } = require('http-status-codes');
const mariadb = require('../db/mariadb');
const getAllBooks = (req, res, next) => {
  let { category_id } = req.query;
  //기본 도서 전체 조회
  let sql = `SELECT * FROM books`;
  let value = [];
  //카테고리 쿼리로 조회가 들어온 경우
  if (category_id) {
    sql = `SELECT books.id, books.title, books.img, categories.name AS category, books.isbn, books.summary, books.detail, books.author, books.pages, books.contents, books.price, books.pub_date
    FROM books
    LEFT JOIN  categories
    ON books.category_id = categories.id
    WHERE categories.id = ?`;
    value = [Number(category_id)];
  }
  mariadb.query(sql, value, (error, results) => {
    if (error) {
      const errorObj = new Error('sql 오류');
      errorObj.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      return next(errorObj);
    }
    if (results.length === 0) {
      const errorObj = new Error('도서 목록이 없음');
      errorObj.statusCode = StatusCodes.NOT_FOUND;
      return next(errorObj);
    }

    res.status(StatusCodes.OK).json(results);
  });
};
const getBookDetail = (req, res, next) => {
  const bookId = Number(req.params.bookId);

  const sql = `SELECT * FROM books WHERE id = ? `;
  const value = [bookId];
  mariadb.query(sql, value, (error, results) => {
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
module.exports = { getAllBooks, getBookDetail };
