import { RowDataPacket } from 'mysql2/promise';
import mariadb from '../db/mariadb';

// insertData, deleteData가 없는 이유 : users에 트리거 설정해서 유저 생성/삭제 시 자동으로 토큰테이블 데이터 생성/삭제

const findTokenByUserId = async (userId: number) => {
  const selectTokenQuery = `SELECT * FROM tokens WHERE user_id = ?`;
  const values = [userId];
  const [results]: any = await mariadb.execute<RowDataPacket[]>(
    selectTokenQuery,
    values
  );
  return results[0];
};

const updateToken = async ({
  userId,
  token,
}: {
  userId: number;
  token: string | null;
}) => {
  const updateUserTokenQuery = `UPDATE tokens SET token = ? WHERE user_id = ?`;
  const values = [token, userId];
  const [results] = await mariadb.execute(updateUserTokenQuery, values);
  return results;
};

export default { findTokenByUserId, updateToken };
