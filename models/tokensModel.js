const mariadb = require('../db/mariadb');

// insertData, deleteData가 없는 이유 : users에 트리거 설정해서 유저 생성/삭제 시 자동으로 토큰테이블 데이터 생성/삭제

const findTokenByUserId = async (userId) => {
  const selectTokenQuery = `SELECT * FROM tokens WHERE user_id = ?`;
  const values = [userId];
  const [results] = await mariadb.execute(selectTokenQuery, values);
  return results[0];
};

const updateToken = async ({ userId, token }) => {
  const updateUserTokenQuery = `UPDATE tokens SET token = ? WHERE user_id = ?`;
  const values = [token, userId];
  const [results] = await mariadb.execute(updateUserTokenQuery, values);
  return results;
};

module.exports = { findTokenByUserId, updateToken };
