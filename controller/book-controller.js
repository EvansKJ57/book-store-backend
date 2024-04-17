const { StatusCodes } = require('http-status-codes');
const mariadb = require('../db/mariadb');
const CustomError = require('../util/CustomError');

//(카테고리 별, 신간) 전체 도서 목록 조회
const getAllBooks = async (req, res, next) => {
  try {
    const { category_id, newBooks, curPage, pageSize } = req.query;

    let sql = `SELECT *,
      (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes,
      (SELECT EXISTS(SELECT * FROM likes WHERE liked_book_id = books.id)) AS liked 
      FROM books
      LEFT JOIN categories
      ON books.category_id = categories.category_id`;
    const conditions = [];

    if (category_id) {
      conditions.push(`books.category_id = "${Number(category_id)}"`);
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
      const limit = Number(pageSize);
      const offset = limit * (Number(curPage) - 1);
      sql += ` LIMIT ${offset}, ${limit}`;
    }

    const [results] = await mariadb.query(sql);
    if (results.length === 0) {
      return next(new CustomError('해당 도서 없음', StatusCodes.NOT_FOUND));
    }
    res.status(StatusCodes.OK).json(results);
  } catch (error) {
    next(new CustomError('sql 오류', StatusCodes.INTERNAL_SERVER_ERROR, error));
  }
};

const getBookDetail = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const bookId = Number(req.params.bookId);

    const sql = `SELECT *,
      (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes,
      (SELECT EXISTS(SELECT * FROM likes WHERE user_id = "${userId}" AND liked_book_id = "${bookId}")) AS liked 
      FROM books
      LEFT JOIN categories
      ON books.category_id = categories.category_id
      WHERE books.id = "${bookId}"`;

    const [results] = await mariadb.query(sql);
    if (results.length === 0) {
      return next(new CustomError('해당 도서 없음', StatusCodes.NOT_FOUND));
    }
    res.status(StatusCodes.OK).json(results);
  } catch (error) {
    next(new CustomError('sql 오류', StatusCodes.INTERNAL_SERVER_ERROR, error));
  }
};

module.exports = { getAllBooks, getBookDetail };
