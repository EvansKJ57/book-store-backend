const mariadb = require('../db/mariadb');

const getBooks = async (categoryId, newBooks, pageSize, curPage) => {
  let sql = `SELECT *,
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
    sql += ` WHERE ${conditions.join(' AND ')}`;
  }

  if (curPage && pageSize) {
    const limit = pageSize;
    const offset = limit * (curPage - 1);
    sql += ` LIMIT ?, ?`;
    values.push(offset, limit);
  }

  const [results] = await mariadb.query(sql, values);
  return results;
};

const getBooksCount = async () => {
  let sql = `SELECT count(*) AS totalCount FROM books`;
  const [results] = await mariadb.query(sql);
  return results[0];
};

const getBookDetailWithLikes = async (bookId, userId) => {
  const sql = `SELECT *,
    (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes,
    (SELECT EXISTS(SELECT * FROM likes WHERE user_id = ? AND liked_book_id = ? )) AS liked 
    FROM books
    LEFT JOIN categories
    ON books.category_id = categories.category_id
    WHERE books.id = ?`;

  const values = [userId, bookId, bookId];
  const [results] = await mariadb.query(sql, values);
  return results;
};

module.exports = { getBooks, getBooksCount, getBookDetailWithLikes };
