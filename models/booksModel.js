const mariadb = require('../db/mariadb');

const getAllBooks = async (category_id, newBooks, pageSize, curPage) => {
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
  return results;
};

const getBookDetailWithLikes = async (userId, bookId) => {
  const sql = `SELECT *,
    (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes,
    (SELECT EXISTS(SELECT * FROM likes WHERE user_id = "${userId}" AND liked_book_id = "${bookId}")) AS liked 
    FROM books
    LEFT JOIN categories
    ON books.category_id = categories.category_id
    WHERE books.id = "${bookId}"`;

  const [results] = await mariadb.query(sql);
  return results;
};

module.exports = { getAllBooks, getBookDetailWithLikes };
