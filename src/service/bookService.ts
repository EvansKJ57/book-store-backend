import { StatusCodes } from 'http-status-codes';
import CustomError from '../util/CustomError';
import booksModel from '../models/booksModel';

const getBooks = async (
  categoryId?: number,
  newBooks?: boolean,
  pageSize?: number,
  curPage?: number
) => {
  try {
    //도서 조회 && 전체 도서 권 수 조회 병렬 처리
    const [bookList, totalCount] = await Promise.all([
      booksModel.getBooks(categoryId, newBooks, pageSize, curPage),
      booksModel.getBooksCount(),
    ]);
    if (bookList.length === 0) {
      throw new CustomError('해당 도서 없음', StatusCodes.NOT_FOUND);
    }

    const data = {
      books: bookList.map((book) => {
        let changedPropertyData = {
          ...book,
          categoryId: book.category_id,
          categoryName: book.category_name,
        };
        delete changedPropertyData.category_id,
          delete changedPropertyData.category_name;
        return changedPropertyData;
      }),
      pageNation: {
        curPage: Number(curPage),
        ...totalCount,
      },
    };
    return data;
  } catch (error: any) {
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
const getBookDetail = async (bookId: number, userId: number) => {
  try {
    const results = await booksModel.getBookDetailWithLikes(bookId, userId);
    if (results.length === 0) {
      throw new CustomError('해당 도서 없음', StatusCodes.NOT_FOUND);
    }
    const data = {
      ...results[0],
      categoryId: results[0].category_id,
      categoryName: results[0].category_name,
    };
    delete data.category_id, delete data.category_name;
    return data;
  } catch (error: any) {
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

export default { getBooks, getBookDetail };
