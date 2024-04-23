const mariadb = require('../db/mariadb');

const addLike = async (userId, bookId) => {
  let sql = `INSERT INTO likes (user_id, liked_book_id) VALUES ("${userId}" , "${bookId}")`;
  const [results] = await mariadb.query(sql);
  return results;
};

const removeLike = async (userId, bookId) => {
  let sql = `DELETE FROM likes WHERE user_id = "${userId}" AND liked_book_id = "${bookId}"`;
  const [results] = await mariadb.query(sql);
  return results;
};

module.exports = { addLike, removeLike };
