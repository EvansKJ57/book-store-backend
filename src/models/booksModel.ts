import { RowDataPacket } from 'mysql2';
import mariadb from '../db/mariadb';
import { BookDetailData } from '../types/customTypes';

const getBooks = async (
  categoryId?: number,
  newBooks?: boolean,
  pageSize?: number,
  curPage?: number
) => {
  let booksQuery = `SELECT *,
      (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes
      FROM books
      LEFT JOIN categories
      ON books.category_id = categories.category_id`;
  const conditions = [];
  const values = [];

  if (categoryId) {
    conditions.push(`books.category_id = ?`);
    values.push(categoryId);
  }
  if (newBooks) {
    conditions.push(
      `pub_date BETWEEN DATE_SUB(NOW(),INTERVAL 60 DAY) AND NOW()`
    );
  }
  //sql 합치기
  if (conditions.length) {
    booksQuery += ` WHERE ${conditions.join(' AND ')}`;
  }

  if (curPage && pageSize) {
    const limit = pageSize;
    const offset = limit * (curPage - 1);
    booksQuery += ` LIMIT ?, ?`;
    values.push(offset, limit);
  }
  const [results] = await mariadb.execute(booksQuery, values);

  return results as BookDetailData[];
};

const getBooksCount = async () => {
  const countBooksQuery = `SELECT count(*) AS totalCount FROM books`;
  const [results] = await mariadb.execute<RowDataPacket[]>(countBooksQuery);
  return results[0];
};

const getBookDetailWithLikes = async (bookId: number, userId: number) => {
  const bookDetailsWithLikesQuery = `SELECT *,
    (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes,
    (SELECT EXISTS(SELECT * FROM likes WHERE user_id = ? AND liked_book_id = ? )) AS liked 
    FROM books
    LEFT JOIN categories
    ON books.category_id = categories.category_id
    WHERE books.id = ?`;

  const values = [userId, bookId, bookId];
  const [results] = await mariadb.execute(bookDetailsWithLikesQuery, values);
  return results as BookDetailData[];
};

export default { getBooks, getBooksCount, getBookDetailWithLikes };
