const mariadb = require('../db/mariadb');

const addLike = async (userId, bookId) => {
  const insertLikeQuery = `INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)`;
  const values = [userId, bookId];
  const [results] = await mariadb.execute(insertLikeQuery, values);
  return results;
};

const removeLike = async (userId, bookId) => {
  const deleteLikeQuery = `DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?`;
  const values = [userId, bookId];
  const [results] = await mariadb.execute(deleteLikeQuery, values);
  return results;
};

module.exports = { addLike, removeLike };
