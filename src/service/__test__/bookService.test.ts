import BookService from '../bookService';
import BooksModel from '../../models/booksModel';
import ServiceMockData from './service.mock.data';

describe('bookService test', () => {
  const { bookDetailQueryResult, bookDetailResData } = ServiceMockData;
  describe('getBookDetail', () => {
    it('각 프로퍼티는 카멜 케이스인 객체로 리턴해야한다', async () => {
      const getBookDetailWithLikesMock = jest
        .fn()
        .mockResolvedValue(bookDetailQueryResult);

      BooksModel.getBookDetailWithLikes = getBookDetailWithLikesMock;

      const result = await BookService.getBookDetail(2, 3);
      expect(result).toStrictEqual(bookDetailResData);
      expect(getBookDetailWithLikesMock).toHaveBeenCalledWith(2, 3);
    });
  });
});
