import { StatusCodes } from 'http-status-codes';
import BookService from '../service/bookService';
import { NextFunction, Request, Response } from 'express';
import { IBookOptionQuery } from '../types/ReqRelatedType';

const BookController = {
  //(카테고리 별, 신간) 전체 도서 목록 조회
  getAllBooks: async (
    req: Request<{}, {}, {}, IBookOptionQuery>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { categoryId, newBooks, pageSize, curPage } = req.query;
      const results = await BookService.getBooks({
        categoryId,
        newBooks,
        pageSize,
        curPage,
      });

      res.status(StatusCodes.OK).json(results);
    } catch (error) {
      next(error);
    }
  },

  getBookDetail: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const bookId = Number(req.params.bookId);
      const results = await BookService.getBookDetail(bookId, user.id);
      res.status(StatusCodes.OK).json(results);
    } catch (error) {
      next(error);
    }
  },
};
export default BookController;
