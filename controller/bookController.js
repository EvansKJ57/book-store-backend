const { StatusCodes } = require('http-status-codes');
const BookService = require('../service/bookService');

//(카테고리 별, 신간) 전체 도서 목록 조회
const getAllBooks = async (req, res, next) => {
  try {
    const queries = req.query;
    const results = await BookService.getBooks(queries);
    res.status(StatusCodes.OK).json(results);
  } catch (error) {
    next(error);
  }
};

const getBookDetail = async (req, res, next) => {
  try {
    const user = req.user;
    const bookId = Number(req.params.bookId);
    const results = await BookService.getBookDetail(bookId, user.id);
    res.status(StatusCodes.OK).json(results);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllBooks, getBookDetail };
