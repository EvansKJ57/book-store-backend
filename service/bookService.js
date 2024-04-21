const { StatusCodes } = require('http-status-codes');
const CustomError = require('../util/CustomError');

const BooksModel = require('../models/booksModel');

const getAllBooks = async ({ category_id, newBooks, pageSize, curPage }) => {
  try {
    const results = await BooksModel.getAllBooks(
      category_id,
      newBooks,
      pageSize,
      curPage
    );
    if (results.length === 0) {
      throw new CustomError('해당 도서 없음', StatusCodes.NOT_FOUND);
    }
    return results;
  } catch (error) {
    if (!error.statusCode) {
      throw new CustomError(
        'sql 오류',
        StatusCodes.INTERNAL_SERVER_ERROR,
        error
      );
    } else {
      throw error;
    }
  }
};
const getBookDetail = async (userId, bookId) => {
  try {
    const results = await BooksModel.getBookDetailWithLikes(userId, bookId);
    if (results.length === 0) {
      throw new CustomError('해당 도서 없음', StatusCodes.NOT_FOUND);
    }
    return results;
  } catch (error) {
    if (!error.statusCode) {
      throw new CustomError(
        'sql 오류',
        StatusCodes.INTERNAL_SERVER_ERROR,
        error
      );
    } else {
      throw error;
    }
  }
};

module.exports = { getAllBooks, getBookDetail };
