const mariadb = require('../db/mariadb');

const addLike = async (userId, bookId) => {
  let sql = `INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)`;
  const values = [userId, bookId];
  const [results] = await mariadb.query(sql, values);
  return results;
};

const removeLike = async (userId, bookId) => {
  let sql = `DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?`;
  const values = [userId, bookId];
  const [results] = await mariadb.query(sql, values);
  return results;
};

module.exports = { addLike, removeLike };
