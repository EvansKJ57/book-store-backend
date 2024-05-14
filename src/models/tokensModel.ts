import { RowDataPacket, ResultSetHeader, PoolConnection } from 'mysql2/promise';
import mariadb from '../db/mariadb';

const insertTokenData = async (userId: number, conn: PoolConnection) => {
  const insertTokenQuery = `INSERT INTO tokens (user_id) VALUES ( ? )`;
  const values = [userId];
  const [results] = await conn.execute<ResultSetHeader>(
    insertTokenQuery,
    values
  );
  return results;
};

const findTokenByUserId = async (userId: number) => {
  const selectTokenQuery = `SELECT * FROM tokens WHERE user_id = ?`;
  const values = [userId];
  const [results] = await mariadb.execute<RowDataPacket[]>(
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

export default { insertTokenData, findTokenByUserId, updateToken };
