const { StatusCodes } = require('http-status-codes');
const CustomError = require('../util/CustomError');

const BooksModel = require('../models/booksModel');

const getBooks = async ({ category_id, newBooks, pageSize, curPage }) => {
  try {
    //도서 조회 && 전체 도서 권 수 조회 병렬 처리
    const [bookList, totalCount] = await Promise.all([
      BooksModel.getBooks(category_id, newBooks, pageSize, curPage),
      BooksModel.getBooksCount(),
    ]);
    if (bookList.length === 0) {
      throw new CustomError('해당 도서 없음', StatusCodes.NOT_FOUND);
    }

    const data = {
      books: bookList,
      pageNation: {
        curPage: Number(curPage),
        ...totalCount,
      },
    };
    return data;
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
const getBookDetail = async (bookId, userId) => {
  try {
    const results = await BooksModel.getBookDetailWithLikes(bookId, userId);
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

module.exports = { getBooks, getBookDetail };
