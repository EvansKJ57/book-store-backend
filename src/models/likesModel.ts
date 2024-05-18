import mariadb from '../db/mariadb';

const LikesModel = {
  addLike: async (userId: number, bookId: number) => {
    const insertLikeQuery = `INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)`;
    const values = [userId, bookId];
    const [results] = await mariadb.execute(insertLikeQuery, values);
    return results;
  },

  removeLike: async (userId: number, bookId: number) => {
    const deleteLikeQuery = `DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?`;
    const values = [userId, bookId];
    const [results] = await mariadb.execute(deleteLikeQuery, values);
    return results;
  },
};
export default LikesModel;
